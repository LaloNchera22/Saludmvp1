-- ============================================================
-- SEREZA MVP — Supabase Schema
-- Coloca este SQL en el Editor SQL de tu proyecto Supabase
-- ============================================================

-- ─── EXTENSIONES ────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── ENUM TYPES ─────────────────────────────────────────────
create type rol_usuario as enum ('paciente', 'admin');
create type estatus_credito as enum ('pendiente', 'activo', 'pagado', 'moroso', 'rechazado');
create type estatus_cuota as enum ('pendiente', 'pagada', 'vencida');
create type estatus_membresia as enum ('activa', 'inactiva', 'cancelada');
create type modulo_tipo as enum ('odontologia', 'nutricion', 'medicina_general', 'psicologia', 'oftalmologia');

-- ─── TABLA: profiles ────────────────────────────────────────
-- Extiende auth.users con datos del negocio
create table public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  rol             rol_usuario not null default 'paciente',
  nombre_completo text        not null default '',
  telefono        text,
  ingresos_mensuales numeric(12, 2),
  historial_bancario_url text,   -- ruta en Storage
  score_credito   smallint    check (score_credito between 0 and 100),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Trigger: sincroniza updated_at automáticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─── TABLA: creditos ────────────────────────────────────────
create table public.creditos (
  id              uuid primary key default uuid_generate_v4(),
  paciente_id     uuid references public.profiles(id) on delete cascade not null,
  folio           text unique not null,           -- ej. SHS-9281
  monto_aprobado  numeric(12, 2) not null,
  monto_pendiente numeric(12, 2) not null,
  plazo_meses     smallint not null,
  tasa_interes    numeric(5, 4) not null,         -- ej. 0.1800 = 18%
  estatus         estatus_credito not null default 'pendiente',
  fecha_aprobacion date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_creditos_updated_at
  before update on public.creditos
  for each row execute procedure public.set_updated_at();

-- Genera folio automáticamente
create or replace function public.generar_folio_credito()
returns trigger language plpgsql as $$
declare
  secuencia integer;
begin
  select count(*) + 1 into secuencia from public.creditos;
  new.folio := 'SHS-' || lpad(secuencia::text, 4, '0');
  return new;
end;
$$;

create trigger trg_generar_folio
  before insert on public.creditos
  for each row execute procedure public.generar_folio_credito();

-- ─── TABLA: cuotas ──────────────────────────────────────────
create table public.cuotas (
  id          uuid primary key default uuid_generate_v4(),
  credito_id  uuid references public.creditos(id) on delete cascade not null,
  numero      smallint not null,                  -- 1, 2, 3…
  monto       numeric(12, 2) not null,
  fecha_vence date not null,
  fecha_pago  date,
  estatus     estatus_cuota not null default 'pendiente',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(credito_id, numero)
);

create trigger trg_cuotas_updated_at
  before update on public.cuotas
  for each row execute procedure public.set_updated_at();

-- ─── TABLA: membresias ──────────────────────────────────────
create table public.membresias (
  id          uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade not null,
  estatus     estatus_membresia not null default 'activa',
  fecha_inicio date not null default current_date,
  fecha_fin    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_membresias_updated_at
  before update on public.membresias
  for each row execute procedure public.set_updated_at();

-- ─── TABLA: membresias_modulos ──────────────────────────────
-- Módulos activos dentro de cada membresía
create table public.membresias_modulos (
  id            uuid primary key default uuid_generate_v4(),
  membresia_id  uuid references public.membresias(id) on delete cascade not null,
  modulo        modulo_tipo not null,
  activo        boolean not null default true,
  created_at    timestamptz not null default now(),
  unique(membresia_id, modulo)
);

-- ─── ROW LEVEL SECURITY (RLS) ───────────────────────────────
alter table public.profiles         enable row level security;
alter table public.creditos         enable row level security;
alter table public.cuotas           enable row level security;
alter table public.membresias       enable row level security;
alter table public.membresias_modulos enable row level security;

-- Helper: rol del usuario actual
create or replace function public.mi_rol()
returns rol_usuario language sql stable as $$
  select rol from public.profiles where id = auth.uid();
$$;

-- profiles: cada usuario ve/edita solo su fila; admin ve todo
create policy "paciente_ver_propio_perfil"
  on public.profiles for select
  using (id = auth.uid() or public.mi_rol() = 'admin');

create policy "paciente_actualizar_propio_perfil"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Permite al usuario insertar su propio perfil al registrarse
create policy "insert_propio_perfil"
  on public.profiles for insert
  with check (id = auth.uid());

-- Permite al service_role (backend) insertar/actualizar/eliminar cualquier perfil
-- Esta policy es necesaria para el registro vía API con admin client
create policy "service_role_gestionar_perfiles"
  on public.profiles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- creditos: paciente ve los suyos; admin ve todos
create policy "paciente_ver_propios_creditos"
  on public.creditos for select
  using (paciente_id = auth.uid() or public.mi_rol() = 'admin');

create policy "admin_gestionar_creditos"
  on public.creditos for all
  using (public.mi_rol() = 'admin');

-- cuotas: paciente ve las de sus créditos; admin ve todo
create policy "paciente_ver_propias_cuotas"
  on public.cuotas for select
  using (
    exists (
      select 1 from public.creditos c
      where c.id = credito_id and c.paciente_id = auth.uid()
    )
    or public.mi_rol() = 'admin'
  );

-- membresias: paciente ve las suyas; admin ve todo
create policy "paciente_ver_propias_membresias"
  on public.membresias for select
  using (paciente_id = auth.uid() or public.mi_rol() = 'admin');

-- membresias_modulos: sigue la policy de membresía padre
create policy "ver_modulos_de_membresia_propia"
  on public.membresias_modulos for select
  using (
    exists (
      select 1 from public.membresias m
      where m.id = membresia_id
        and (m.paciente_id = auth.uid() or public.mi_rol() = 'admin')
    )
  );

-- ─── STORAGE: bucket para documentos bancarios ──────────────
-- Ejecuta esto DESPUÉS de crear el bucket 'documentos' en el panel
-- insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false);

create policy "usuario_subir_propio_documento"
  on storage.objects for insert
  with check (
    bucket_id = 'documentos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "usuario_ver_propio_documento"
  on storage.objects for select
  using (
    bucket_id = 'documentos'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.mi_rol() = 'admin'
    )
  );

-- ─── VISTAS PARA ADMIN ──────────────────────────────────────
create or replace view public.admin_stats as
select
  (select count(*) from public.creditos)                                   as total_creditos,
  (select count(*) from public.creditos where estatus = 'activo')          as creditos_activos,
  (select coalesce(sum(monto_pendiente), 0) from public.creditos where estatus = 'activo') as cartera_activa,
  (select count(*) from public.creditos where estatus = 'moroso')          as creditos_morosos,
  round(
    (select count(*) from public.creditos where estatus = 'moroso')::numeric
    / nullif((select count(*) from public.creditos where estatus in ('activo','moroso','pagado')), 0) * 100,
    2
  )                                                                        as tasa_morosidad,
  (select count(*) from public.membresias where estatus = 'activa')        as membresias_activas;
