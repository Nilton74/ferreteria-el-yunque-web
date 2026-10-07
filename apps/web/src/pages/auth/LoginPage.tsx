import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Home, MessageCircle, HelpCircle,
} from 'lucide-react'

import { useAuthStore, type Rol } from '@/store/authStore'
import { mockLogin, homeByRol } from '@/features/auth/mockAuth'
import { loginSchema, type LoginForm } from '@/features/auth/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

interface LocationState {
  from?: string
}

const DEMO = [
  { rol: 'Admin',    email: 'admin@yunque.com',    pass: 'admin123' },
  { rol: 'Vendedor', email: 'vendedor@yunque.com', pass: 'vendedor123' },
  { rol: 'Almacen',  email: 'almacen@yunque.com',  pass: 'almacen123' },
  { rol: 'Cliente',  email: 'cliente@yunque.com',  pass: 'cliente123' },
]

function resolverRuta(rol: Rol, from: string | undefined): string {
  if (!from) return homeByRol(rol)
  if (!from.startsWith('/')) return homeByRol(rol)
  if (from.startsWith('/login') || from.startsWith('/registro')) {
    return homeByRol(rol)
  }
  if (from.startsWith('/admin')) {
    if (rol === 'admin' || rol === 'superadmin' || rol === 'vendedor' || rol === 'almacenero') {
      return from
    }
    return homeByRol(rol)
  }
  return from
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [rolActivo, setRolActivo] = useState<string | null>(null)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    setServerError('')
    try {
      const { user: u, token } = await mockLogin(data)
      login(u, token)
      const state = location.state as LocationState | null
      navigate(resolverRuta(u.rol, state?.from), { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesion'
      setServerError(message)
    }
  }

  const usarDemo = (email: string, pass: string, rol: string) => {
    setValue('email', email, { shouldValidate: true })
    setValue('password', pass, { shouldValidate: true })
    setRolActivo(rol)
    setServerError('')
  }

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-ink-100 overflow-hidden">
      {/* Panel decorativo izquierdo */}
      <div className="hidden lg:flex flex-col justify-between bg-ink-900 text-white p-8 relative overflow-hidden">
        <Link to="/" className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 px-2.5 py-1.5 text-xs font-semibold backdrop-blur transition">
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la tienda
        </Link>

        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-yunque-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-yunque-700/20 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-3 pt-8">
          <span className="text-2xl font-black tracking-tight">EL YUNQUE</span>
          <span className="h-2 w-2 rounded-full bg-yunque-500" />
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl font-black leading-tight">
            Todo lo que necesitas
            <br />
            para construir,
            <br />
            <span className="text-yunque-500">reparar y transformar.</span>
          </h1>
          <p className="mt-4 text-ink-300 max-w-md text-sm">
            Plataforma omnicanal de ventas, inventario y gestion para ferreterias.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-xs text-ink-500">
          <a href="https://wa.me/34600000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-yunque-400 transition">
            <MessageCircle className="h-3.5 w-3.5" />
            Soporte
          </a>
          <span>·</span>
          <a href="#" className="inline-flex items-center gap-1.5 hover:text-yunque-400 transition">
            <HelpCircle className="h-3.5 w-3.5" />
            Ayuda
          </a>
          <span>·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <Link to="/" className="flex items-center gap-1.5">
              <span className="text-base font-black text-ink-900">EL YUNQUE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-yunque-500" />
            </Link>
          </div>

          <div className="hidden lg:flex justify-end mb-1">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 hover:text-ink-900">
              <Home className="h-3.5 w-3.5" />
              Inicio
            </Link>
          </div>

          <h2 className="text-xl font-bold text-ink-900">Iniciar sesion</h2>
          <p className="mt-0.5 text-xs text-ink-500">Accede a tu cuenta para continuar</p>

          <div className="mt-3 rounded-lg border border-ink-200 bg-white p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-500 mb-1.5">
              Probar como
            </p>
            <div className="grid grid-cols-4 gap-1">
              {DEMO.map((d) => (
                <button
                  key={d.rol}
                  type="button"
                  onClick={() => usarDemo(d.email, d.pass, d.rol)}
                  className={
                    'rounded-md px-2 py-1.5 text-[11px] font-bold transition border ' +
                    (rolActivo === d.rol
                      ? 'bg-yunque-500 text-ink-900 border-yunque-500'
                      : 'bg-ink-50 text-ink-700 border-ink-200 hover:border-yunque-400 hover:bg-yunque-50')
                  }
                >
                  {d.rol}
                </button>
              ))}
            </div>
          </div>

          {serverError && (
            <div className="mt-3">
              <Alert variant="error">{serverError}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
            <Input
              label="Email"
              type="email"
              placeholder="admin@yunque.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Contrasena"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-ink-400 hover:text-ink-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Entrando...' : (<>
                Iniciar sesion
                <ArrowRight className="ml-2 h-4 w-4" />
              </>)}
            </Button>
          </form>

          <div className="mt-3 rounded-lg border border-yunque-200 bg-yunque-50/60 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-ink-600">Aun no tienes cuenta?</p>
              <Link to="/registro" className="inline-flex items-center gap-1 rounded-md bg-yunque-500 text-ink-900 px-3 py-1.5 text-xs font-bold hover:bg-yunque-400 transition shrink-0">
                Crear cuenta
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-2 pt-2 border-t border-yunque-200/60 text-center">
              <Link to="/productos" className="text-[11px] font-semibold text-ink-500 hover:text-ink-900 inline-flex items-center gap-1">
                Explorar sin registrarme
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
