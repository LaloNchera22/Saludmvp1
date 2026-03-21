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
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  // RLS garantiza que solo el paciente dueño o un admin puede ver esto
  return NextResponse.json(data)
}
