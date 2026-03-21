import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/creditos/[id] — detalle de un crédito con sus cuotas
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('creditos')
    .select(`
      *,
      cuotas (*)
    `)
    .eq('id', params.id)
    .eq('paciente_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('[creditos/id] Error fetching credito:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Crédito no encontrado' }, { status: 404 })
  }

  return NextResponse.json(data)
}
