import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, ClipboardList,
  Users, BarChart3, LogOut, Bell, Lock, Wallet, Menu, X,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { usePermissions } from '@/features/auth/usePermissions'
import type { Modulo } from '@/features/auth/permissions'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  modulo: Modulo
}

const NAV: NavItem[] = [
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard, modulo: 'dashboard' },
  { to: '/admin/productos',  label: 'Productos',  icon: Package,         modulo: 'productos' },
  { to: '/admin/inventario', label: 'Inventario', icon: Boxes,           modulo: 'inventario' },
  { to: '/admin/pos',        label: 'POS',        icon: ShoppingCart,    modulo: 'pos' },
  { to: '/admin/caja',       label: 'Caja',       icon: Wallet,          modulo: 'caja' },
  { to: '/admin/pedidos',    label: 'Pedidos',    icon: ClipboardList,   modulo: 'pedidos' },
  { to: '/admin/clientes',   label: 'Clientes',   icon: Users,           modulo: 'clientes' },
  { to: '/admin/reportes',   label: 'Reportes',   icon: BarChart3,       modulo: 'reportes' },
]

const ROL_LABEL: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Administrador',
  vendedor: 'Vendedor',
  almacenero: 'Almacenero',
  cliente: 'Cliente',
}

export function AdminLayout() {
  const { user, logout } = useAuthStore()
  const { puede } = usePermissions()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const navVisible = NAV.filter((item) => puede(item.modulo))

  // Cerrar drawer al cambiar de ruta (móvil)
  const handleNavClick = () => setDrawerOpen(false)

  return (
    <div className="h-screen flex bg-ink-100 overflow-hidden">
      {/* ============ Overlay móvil ============ */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-ink-900/60 z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ============ Sidebar ============ */}
      <aside
        className={
          'w-64 shrink-0 bg-ink-900 text-ink-200 flex flex-col z-50 ' +
          'fixed inset-y-0 left-0 transform transition-transform duration-300 ' +
          'lg:relative lg:translate-x-0 ' +
          (drawerOpen ? 'translate-x-0' : '-translate-x-full')
        }
      >
        {/* Logo + botón cerrar en móvil */}
        <div className="h-16 flex items-center px-5 border-b border-ink-700 shrink-0">
          <span className="font-black text-lg text-white">EL YUNQUE</span>
          <span className="ml-2 h-2 w-2 rounded-full bg-yunque-500" />
          <button
            onClick={() => setDrawerOpen(false)}
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-ink-700 text-ink-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navVisible.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ' +
                (isActive
                  ? 'bg-yunque-500 text-ink-900'
                  : 'hover:bg-ink-700 text-ink-200')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}

          {navVisible.length === 0 && (
            <div className="rounded-lg bg-ink-800 p-4 text-xs text-ink-400 text-center">
              <Lock className="h-5 w-5 mx-auto mb-2" />
              Sin modulos disponibles para tu rol
            </div>
          )}
        </nav>

        {/* Footer usuario */}
        <div className="p-3 border-t border-ink-700 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-yunque-500 text-ink-900 flex items-center justify-center font-bold shrink-0">
              {user?.nombre?.[0] ?? 'U'}
            </div>
            <div className="text-xs min-w-0">
              <p className="font-semibold text-white truncate">{user?.nombre}</p>
              <p className="text-ink-400">
                {ROL_LABEL[user?.rol ?? ''] ?? user?.rol}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-ink-700 transition"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesion
          </button>
        </div>
      </aside>

      {/* ============ Contenido ============ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 shrink-0 bg-white border-b border-ink-200 flex items-center px-4 lg:px-6 gap-3">
          {/* Botón hamburguesa (móvil) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-ink-100"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="font-semibold text-ink-900 text-sm lg:text-base truncate">
            Panel administrativo
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-ink-100">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main scrolleable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
