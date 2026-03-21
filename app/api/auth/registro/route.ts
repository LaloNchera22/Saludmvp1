import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const registroSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const body = await request.json()
    const parsed = registroSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { email, password } = parsed.data
    const supabase = createClient()

    // 1. Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message ?? 'Error al crear usuario' },
        { status: 400 },
      )
    }

    // 2. Insertar perfil
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      nombre_completo: '', // Empty initially, to be filled in survey
      rol: 'paciente',
      ingresos_mensuales: null,
    })

    if (profileError) {
      console.error('[registro] Error inserting profile:', profileError)
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.' },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
