import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Search, User, LayoutDashboard, LogOut, ChevronDown,
  Package, Heart,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { puedeAcceder } from '@/features/auth/permissions'

export function PublicLayout() {
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.cantidad, 0))
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    navigate('/productos?q=' + encodeURIComponent(q.trim()))
    setQ('')
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    window.location.href = '/'
  }

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const tienePanel = user && puedeAcceder(user.rol, 'dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-4 lg:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl lg:text-2xl font-black text-ink-900">EL YUNQUE</span>
            <span className="h-2 w-2 rounded-full bg-yunque-500" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-700">
            <NavLink to="/productos">Catalogo</NavLink>
            <NavLink to="/productos?cat=herramientas">Herramientas</NavLink>
            <NavLink to="/productos?cat=electricidad">Electricidad</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:gap-3">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar producto, SKU..."
                className="pl-9 pr-3 py-2 w-48 lg:w-64 rounded-lg border border-ink-200 bg-ink-100/60 focus:outline-none focus:ring-2 focus:ring-yunque-400 text-sm"
              />
            </form>

            {/* Usuario: dropdown si logueado, link si no */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-ink-100 transition"
                >
                  <div className="h-8 w-8 rounded-full bg-yunque-500 text-ink-900 grid place-items-center font-bold text-sm">
                    {user.nombre.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className={'h-4 w-4 text-ink-500 transition ' + (menuOpen ? 'rotate-180' : '')} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-ink-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-ink-100 bg-ink-50/60">
                      <p className="text-sm font-bold text-ink-900 truncate">{user.nombre}</p>
                      <p className="text-xs text-ink-500 truncate">{user.email}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-yunque-500 text-ink-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                        {user.rol}
                      </span>
                    </div>

                    <div className="py-1">
                      <MenuItem to="/cuenta" icon={User} onClick={() => setMenuOpen(false)}>
                        Mi cuenta
                      </MenuItem>
                      <MenuItem to="/cuenta" icon={Package} onClick={() => setMenuOpen(false)}>
                        Mis pedidos
                      </MenuItem>
                      <MenuItem to="/cuenta" icon={Heart} onClick={() => setMenuOpen(false)}>
                        Favoritos
                      </MenuItem>
                    </div>

                    {tienePanel && (
                      <>
                        <div className="border-t border-ink-100" />
                        <div className="py-1">
                          <MenuItem
                            to="/admin/dashboard"
                            icon={LayoutDashboard}
                            highlight
                            onClick={() => setMenuOpen(false)}
                          >
                            Panel administrativo
                          </MenuItem>
                        </div>
                      </>
                    )}

                    <div className="border-t border-ink-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-lg hover:bg-ink-100" title="Iniciar sesion">
                <User className="h-5 w-5" />
              </Link>
            )}

            <Link to="/carrito" className="relative p-2 rounded-lg hover:bg-ink-100">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-yunque-500 text-ink-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 page-enter">
        <Outlet />
      </main>

      <footer className="border-t border-ink-200 bg-ink-900 text-ink-200 py-10">
        <div className="mx-auto max-w-7xl px-4 text-sm">
          Ferreteria El Yunque - Todo lo que necesitas para construir, reparar y transformar.
        </div>
      </footer>
    </div>
  )
}

function MenuItem({
  to,
  icon: Icon,
  children,
  onClick,
  highlight = false,
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  onClick: () => void
  highlight?: boolean
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={
        'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ' +
        (highlight
          ? 'text-yunque-700 hover:bg-yunque-50'
          : 'text-ink-700 hover:bg-ink-50')
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
