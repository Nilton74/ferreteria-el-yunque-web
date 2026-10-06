import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, type Rol } from '@/store/authStore'

export function ProtectedRoute({
  roles,
  children,
}: {
  roles?: Rol[]
  children: React.ReactNode
}) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}