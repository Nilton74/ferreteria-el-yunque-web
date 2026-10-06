import { Link } from 'react-router-dom'
import { ShieldX, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center max-w-md">
        <div className="mx-auto h-20 w-20 rounded-full bg-red-100 grid place-items-center">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="mt-6 text-2xl font-black text-ink-900">
          Acceso denegado
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          No tienes permisos para acceder a este módulo. Si crees que es un error, contacta con el administrador.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/admin/dashboard">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Ir al dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost">Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}