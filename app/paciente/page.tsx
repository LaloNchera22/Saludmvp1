import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Credito, Cuota, Membresia, MembresiaModulo } from '@/types/database'

const MODULO_LABEL: Record<string, string> = {
  odontologia: 'Odontología',
  nutricion: 'Nutrición',
  medicina_general: 'Medicina General',
  psicologia: 'Psicología',
  oftalmologia: 'Oftalmología',
}

export default async function PacienteDashboard() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Crédito activo
  const { data: credito } = await supabase
    .from('creditos')
    .select('*, cuotas(*)')
    .eq('paciente_id', user.id)
    .in('estatus', ['activo', 'pendiente'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() as { data: (Credito & { cuotas: Cuota[] }) | null }

  // Próxima cuota pendiente
  const proximaCuota = credito?.cuotas
    ?.filter((c) => c.estatus === 'pendiente')
    ?.sort((a, b) => new Date(a.fecha_vence).getTime() - new Date(b.fecha_vence).getTime())[0]

  // Membresía activa con módulos
  const { data: membresia } = await supabase
    .from('membresias')
    .select('*, modulos:membresias_modulos(*)')
    .eq('paciente_id', user.id)
    .eq('estatus', 'activa')
    .limit(1)
    .maybeSingle() as { data: (Membresia & { modulos: MembresiaModulo[] }) | null }

  const modulosActivos = membresia?.modulos?.filter((m) => m.activo) ?? []

  return (
    <main className="py-[120px] px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 uppercase">
        Portal de Paciente
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Estatus de Financiamiento */}
        <div className="border border-border-dark p-8 flex flex-col justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">
            Estatus de Financiamiento
          </h2>
          {credito ? (
            <>
              <p className="text-4xl font-mono text-sereza-turquoise font-bold capitalize">
                {credito.estatus}
              </p>
              <div className="mt-8 pt-4 border-t border-border-light flex justify-between">
                <span className="text-xs uppercase tracking-wider">Crédito Aprobado</span>
                <span className="font-mono text-sm">#{credito.folio}</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-4xl font-mono text-gray-300 font-bold">Sin crédito</p>
              <div className="mt-8 pt-4 border-t border-border-light">
                <a
                  href="/servicios"
                  className="text-[11px] font-black uppercase tracking-wider hover:text-sereza-turquoise transition-colors"
                >
                  Solicitar financiamiento →
                </a>
              </div>
            </>
          )}
        </div>

        {/* Próxima Cuota */}
        <div className="border border-border-dark p-8 flex flex-col justify-between bg-foreground text-background">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">
            Próxima Cuota
          </h2>
          {proximaCuota ? (
            <>
              <p className="text-4xl font-mono font-bold">
                ${proximaCuota.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider">
                  Vence:{' '}
                  {new Date(proximaCuota.fecha_vence).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <button className="text-[11px] font-black uppercase tracking-wider hover:text-sereza-turquoise transition-colors">
                  Pagar Ahora →
                </button>
              </div>
            </>
          ) : (
            <p className="text-2xl font-mono font-bold opacity-40">Sin cuotas pendientes</p>
          )}
        </div>

        {/* Módulos de Membresía */}
        <div className="border border-border-dark p-8 flex flex-col justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">
            Módulos de Membresía
          </h2>
          {modulosActivos.length > 0 ? (
            <ul className="space-y-4 font-mono text-sm">
              {modulosActivos.map((m) => (
                <li
                  key={m.id}
                  className="flex justify-between items-center pb-2 border-b border-border-light"
                >
                  <span>{MODULO_LABEL[m.modulo] ?? m.modulo}</span>
                  <span className="bg-sereza-turquoise text-white text-[10px] px-2 py-1 uppercase font-black tracking-wider">
                    Activo
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-sm opacity-40">Sin membresía activa</p>
          )}
        </div>
      </div>
    </main>
  )
}
