import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cuotas — próximas cuotas pendientes del paciente autenticado
export async function GET() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Obtener los IDs de créditos del paciente autenticado
  const { data: creditos, error: creditosError } = await supabase
    .from('creditos')
    .select('id')
    .eq('paciente_id', user.id)

  if (creditosError) {
    console.error('[cuotas] Error fetching creditos:', creditosError)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  if (!creditos || creditos.length === 0) {
    return NextResponse.json([])
  }

  const creditoIds = creditos.map((c) => c.id)

  // Traer solo las cuotas pendientes de los créditos del paciente
  const { data, error } = await supabase
    .from('cuotas')
    .select(`
      *,
      credito:credito_id (folio, estatus)
    `)
    .in('credito_id', creditoIds)
    .eq('estatus', 'pendiente')
    .order('fecha_vence', { ascending: true })
    .limit(5)

  if (error) {
    console.error('[cuotas] Error fetching cuotas:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  return NextResponse.json(data)
}
