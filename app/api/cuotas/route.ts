import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cuotas — próximas cuotas pendientes del paciente
export async function GET() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Traer cuotas pendientes de los créditos activos del paciente
  const { data, error } = await supabase
    .from('cuotas')
    .select(`
      *,
      credito:credito_id (folio, estatus)
    `)
    .eq('estatus', 'pendiente')
    .order('fecha_vence', { ascending: true })
    .limit(5)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
