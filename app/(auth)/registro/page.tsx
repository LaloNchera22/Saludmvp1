'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const registroSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type RegistroForm = z.infer<typeof registroSchema>

export default function RegistroPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroForm>({ resolver: zodResolver(registroSchema) })

  async function onSubmit(values: RegistroForm) {
    setServerError(null)

    const payload = {
      email: values.email,
      password: values.password,
    }

    const res = await fetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setServerError(
        typeof data.error === 'string' ? data.error : 'Error al registrar. Intenta de nuevo.',
      )
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 py-[120px]">
        <div className="w-full max-w-md border border-border-dark p-8 md:p-12 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-4">¡Registro exitoso!</h1>
          <p className="opacity-70 mb-8">
            Revisa tu correo para confirmar tu cuenta y después inicia sesión.
          </p>
          <Button onClick={() => router.push('/login')}>Ir a iniciar sesión</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 py-[120px]">
      <div className="w-full max-w-md border border-border-dark p-8 md:p-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Registro</h1>

        {serverError && (
          <p className="text-sm text-red-600 mb-6 border border-red-300 p-3">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <p className="text-sm opacity-70 -mt-2">
            Scoring crediticio alternativo — incluye a usuarios no bancarizados.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-wider">
              Correo Electrónico
            </label>
            <input
              type="email"
              {...register('email')}
              className="border-b border-border-dark p-3 focus:outline-none focus:border-sereza-turquoise bg-transparent transition-colors"
            />
            {errors.email && (
              <span className="text-[11px] text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-wider">Contraseña</label>
            <input
              type="password"
              {...register('password')}
              className="border-b border-border-dark p-3 focus:outline-none focus:border-sereza-turquoise bg-transparent transition-colors"
            />
            {errors.password && (
              <span className="text-[11px] text-red-500">{errors.password.message}</span>
            )}
          </div>

          <div className="mt-8">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </Button>
          </div>

          <p className="text-center text-sm opacity-60">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="underline hover:text-sereza-turquoise transition-colors">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}
