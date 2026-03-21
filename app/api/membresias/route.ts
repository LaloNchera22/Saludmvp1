import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { ModuloTipo } from '@/types/database'

const MODULOS_VALIDOS: ModuloTipo[] = [
  'odontologia',
  'nutricion',
  'medicina_general',
  'psicologia',
  'oftalmologia',
]

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// POST /api/membresias — crear o activar membresía con módulos
export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await request.json()
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
    return NextResponse.json({ error: membresiaError.message }, { status: 500 })
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
    return NextResponse.json({ error: modulosError.message }, { status: 500 })
  }

  return NextResponse.json({ ...membresia, modulos: modulosInsert }, { status: 201 })
}
