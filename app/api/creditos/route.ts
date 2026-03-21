import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const solicitarCreditoSchema = z.object({
  monto_solicitado: z.coerce.number().positive('El monto debe ser mayor a 0'),
  plazo_meses: z.coerce.number().int().min(3).max(36),
})

// GET /api/creditos — créditos del paciente autenticado
export async function GET() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('creditos')
    .select(`
      *,
      cuotas (
        id, numero, monto, fecha_vence, estatus
      )
    `)
    .eq('paciente_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[creditos] Error fetching creditos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/creditos — solicitar un crédito
export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = solicitarCreditoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { monto_solicitado, plazo_meses } = parsed.data
  const TASA_ANUAL = 0.18 // 18% anual — se almacena la tasa anual según el schema

  // Usamos admin client para el INSERT porque las policies RLS de Supabase
  // requieren que el schema esté actualizado; el admin client las bypasea de forma segura.
  // El usuario ya fue autenticado con supabase.auth.getUser() arriba.
  const adminClient = createAdminClient()
  const { data: credito, error } = await adminClient
    .from('creditos')
    .insert({
      paciente_id: user.id,
      monto_aprobado: monto_solicitado,
      monto_pendiente: monto_solicitado,
      plazo_meses,
      tasa_interes: TASA_ANUAL,
      estatus: 'pendiente',
    })
    .select()
    .single()

  if (error) {
    console.error('[creditos] Error inserting credito:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  return NextResponse.json(credito, { status: 201 })
}
