import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AdminStats } from '@/types/database'

function fmt(n: number) {
  return n.toLocaleString('es-MX')
}

function fmtMXN(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${fmt(n)}`
}

export default async function AdminDashboard() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single() as { data: { rol: string } | null; error: unknown }

  if (!profile || profile.rol !== 'admin') redirect('/paciente')

  const adminClient = createAdminClient()
  const { data: stats } = await adminClient
    .from('admin_stats')
    .select('*')
    .single() as { data: AdminStats | null }

  const s: AdminStats = stats ?? {
    total_creditos: 0,
    creditos_activos: 0,
    cartera_activa: 0,
    creditos_morosos: 0,
    tasa_morosidad: 0,
    membresias_activas: 0,
  }

  return (
    <main className="py-[120px] px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 uppercase">
        Panel Administrativo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="border border-border-dark p-8 flex flex-col justify-between hover:border-sereza-turquoise transition-colors group">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500 group-hover:text-sereza-turquoise transition-colors">
            Créditos Otorgados
          </h2>
          <p className="text-5xl font-mono font-bold">{fmt(s.total_creditos)}</p>
          <div className="mt-8 pt-4 border-t border-border-light flex justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-sereza-turquoise">
              {s.creditos_activos} activos
            </span>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between hover:border-sereza-turquoise transition-colors group">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500 group-hover:text-sereza-turquoise transition-colors">
            Cartera Activa
          </h2>
          <p
            className="text-4xl font-mono font-bold text-sereza-turquoise truncate"
            title={`$${fmt(s.cartera_activa)} MXN`}
          >
            {fmtMXN(s.cartera_activa)}
          </p>
          <div className="mt-8 pt-4 border-t border-border-light">
            <span className="text-[10px] uppercase font-bold tracking-wider">MXN</span>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between bg-foreground text-background">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">
            Tasa de Morosidad
          </h2>
          <p className="text-5xl font-mono font-bold">
            {s.tasa_morosidad != null ? `${s.tasa_morosidad}%` : 'N/A'}
          </p>
          <div className="mt-8 pt-4 border-t border-gray-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              {s.creditos_morosos} en mora
            </span>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between hover:border-sereza-turquoise transition-colors group">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500 group-hover:text-sereza-turquoise transition-colors">
            Membresías Activas
          </h2>
          <p className="text-5xl font-mono font-bold">{fmt(s.membresias_activas)}</p>
          <div className="mt-8 pt-4 border-t border-border-light" />
        </div>
      </div>
    </main>
  )
}
