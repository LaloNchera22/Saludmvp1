'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginForm) {
    setServerError(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError('Correo o contraseña incorrectos.')
      return
    }

    // Redirigir según rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', data.user.id)
      .single()

    router.push(profile?.rol === 'admin' ? '/admin' : '/paciente')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 py-[120px]">
      <div className="w-full max-w-md border border-border-dark p-8 md:p-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Iniciar Sesión</h1>

        {serverError && (
          <p className="text-sm text-red-600 mb-6 border border-red-300 p-3">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>

          <p className="text-center text-sm opacity-60">
            ¿Sin cuenta?{' '}
            <a href="/registro" className="underline hover:text-sereza-turquoise transition-colors">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}
