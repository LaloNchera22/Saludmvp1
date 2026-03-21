import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const encuestaSchema = z.object({
  nombre_completo: z.string().min(2, 'Nombre requerido'),
  ingresos_mensuales: z.coerce.number().positive('Debe ser mayor a 0'),
  historial_bancario_url: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = encuestaSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { nombre_completo, ingresos_mensuales, historial_bancario_url } = parsed.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      nombre_completo,
      ingresos_mensuales,
    }

    if (historial_bancario_url) {
      updateData.historial_bancario_url = historial_bancario_url
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    if (profileError) {
      console.error('[encuesta] Error updating profile:', profileError)
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Perfil actualizado exitosamente' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
