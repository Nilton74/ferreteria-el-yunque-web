import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, type Rol } from '@/store/authStore'
import { puedeAcceder, type Modulo } from '@/features/auth/permissions'

interface Props {
  roles?: Rol[]
  modulo?: Modulo
  children: React.ReactNode
}

export function ProtectedRoute({ roles, modulo, children }: Props) {
  const { user } = useAuthStore()
  const location = useLocation()

  // 1. Sin sesión → login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // 2. Si se especifican roles permitidos → verificar
  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/" replace />
  }

  // 3. Si se especifica un módulo → verificar permiso
  if (modulo && !puedeAcceder(user.rol, modulo)) {
    // En vez de redirigir a home (que confunde), mostramos pantalla de denegado
    return <Navigate to="/admin/acceso-denegado" replace />
  }

  return <>{children}</>
}