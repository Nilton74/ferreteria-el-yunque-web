import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { mockRegister, homeByRol } from '@/features/auth/mockAuth'
import { registerSchema, type RegisterForm } from '@/features/auth/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const [serverError, setServerError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nombre: '', email: '', password: '', confirmar: '' },
  })

  const onSubmit = async (data: RegisterForm) => {
    setServerError('')
    try {
      const { user, token } = await mockRegister({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
      })
      login(user, token)
      navigate(homeByRol(user.rol), { replace: true })
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Error al registrarse')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-ink-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-ink-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl font-black text-ink-900">EL YUNQUE</span>
          <span className="h-2 w-2 rounded-full bg-yunque-500" />
        </div>

        <h2 className="text-2xl font-bold text-ink-900">Crear cuenta</h2>
        <p className="mt-1 text-sm text-ink-500">
          Regístrate para empezar a comprar
        </p>

        {serverError && (
          <div className="mt-6">
            <Alert variant="error">{serverError}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            error={errors.nombre?.message}
            {...register('nombre')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Contraseña"
              type={show ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-[34px] text-ink-400 hover:text-ink-700"
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            error={errors.confirmar?.message}
            {...register('confirmar')}
          />

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              'Creando cuenta…'
            ) : (
              <>
                Crear cuenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-500">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-yunque-700 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}