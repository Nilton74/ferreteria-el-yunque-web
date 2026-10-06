import { Link, Outlet, NavLink } from 'react-router-dom'
import { ShoppingCart, Search, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'



export function PublicLayout() {
  const user = useAuthStore((s) => s.user)
  const count = useCartStore((s) =>
    s.items.reduce((a, i) => a + i.cantidad, 0),
  )
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    navigate(`/productos?q=${encodeURIComponent(query)}`)
    setQ('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-ink-900">EL YUNQUE</span>
            <span className="h-2 w-2 rounded-full bg-yunque-500" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-700">
            <NavLink to="/productos">Catalogo</NavLink>
            <NavLink to="/productos?cat=herramientas">Herramientas</NavLink>
            <NavLink to="/productos?cat=electricidad">Electricidad</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar producto, SKU..."
                className="pl-9 pr-3 py-2 w-64 rounded-lg border border-ink-200 bg-ink-100/60 focus:outline-none focus:ring-2 focus:ring-yunque-400"
              />
            </form>

            <Link
              to={user ? '/cuenta' : '/login'}
              className="p-2 rounded-lg hover:bg-ink-100"
              title={user ? 'Mi cuenta' : 'Iniciar sesión'}
            >
              <User className="h-5 w-5" />
            </Link>

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

      <main className="flex-1">
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
