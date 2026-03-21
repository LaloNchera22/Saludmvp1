import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const crearMembresiaSchema = z.object({
  modulos: z
    .array(z.enum(['odontologia', 'nutricion', 'medicina_general', 'psicologia', 'oftalmologia']))
    .min(1, 'Selecciona al menos un módulo'),
})

// GET /api/membresias — membresía activa con módulos del paciente
export async function GET() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('membresias')
    .select(`
      *,
      modulos:membresias_modulos (*)
    `)
    .eq('paciente_id', user.id)
    .eq('estatus', 'activa')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[membresias] Error fetching membresia:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/membresias — crear o activar membresía con módulos
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

  const parsed = crearMembresiaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { modulos } = parsed.data

  // Crear membresía
  const { data: membresia, error: membresiaError } = await supabase
    .from('membresias')
    .insert({ paciente_id: user.id, estatus: 'activa' })
    .select()
    .single()

  if (membresiaError) {
    console.error('[membresias] Error inserting membresia:', membresiaError)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  // Insertar módulos seleccionados
  const modulosInsert = modulos.map((modulo) => ({
    membresia_id: membresia.id,
    modulo,
    activo: true,
  }))

  const { error: modulosError } = await supabase
    .from('membresias_modulos')
    .insert(modulosInsert)

  if (modulosError) {
    console.error('[membresias] Error inserting modulos:', modulosError)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }

  return NextResponse.json({ ...membresia, modulos: modulosInsert }, { status: 201 })
}
