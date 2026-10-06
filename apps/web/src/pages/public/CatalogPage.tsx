import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, PackageX, ChevronDown, Search } from 'lucide-react'

import { ProductCard } from '@/components/public/ProductCard'
import { FilterSidebar } from '@/components/public/FilterSidebar'
import { Button } from '@/components/ui/Button'
import { PRODUCTOS, CATEGORIAS } from '@/features/products/mockProducts'
import {
  aplicarFiltros,
  rangoPrecios,
  FILTROS_INICIALES,
  type Filtros,
  type Orden,
} from '@/features/products/filters'

const ORDENES: { value: Orden; label: string }[] = [
  { value: 'relevancia',  label: 'Relevancia' },
  { value: 'precio-asc',  label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'nuevos',      label: 'Novedades' },
  { value: 'rating',      label: 'Mejor valorados' },
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const precioRango = useMemo(() => rangoPrecios(PRODUCTOS), [])

  const filtros: Filtros = useMemo(
    () => ({
      q: searchParams.get('q') ?? '',
      categorias: searchParams.getAll('cat'),
      marcas: searchParams.getAll('marca'),
      precioMin: Number(searchParams.get('min') ?? precioRango[0]),
      precioMax: Number(searchParams.get('max') ?? precioRango[1]),
      soloOfertas: searchParams.get('promo') === '1',
      soloDisponibles: searchParams.get('stock') === '1',
      orden: (searchParams.get('orden') as Orden) ?? 'relevancia',
    }),
    [searchParams, precioRango],
  )

  const setFiltros = (f: Filtros) => {
    const params = new URLSearchParams()
    if (f.q) params.set('q', f.q)
    f.categorias.forEach((c) => params.append('cat', c))
    f.marcas.forEach((m) => params.append('marca', m))
    if (f.precioMin > precioRango[0]) params.set('min', String(f.precioMin))
    if (f.precioMax < precioRango[1]) params.set('max', String(f.precioMax))
    if (f.soloOfertas) params.set('promo', '1')
    if (f.soloDisponibles) params.set('stock', '1')
    if (f.orden !== 'relevancia') params.set('orden', f.orden)
    setSearchParams(params, { replace: true })
  }

  const productos = useMemo(() => aplicarFiltros(PRODUCTOS, filtros), [filtros])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const filtrosActivos =
    filtros.categorias.length +
    filtros.marcas.length +
    (filtros.q ? 1 : 0) +
    (filtros.soloOfertas ? 1 : 0) +
    (filtros.soloDisponibles ? 1 : 0) +
    (filtros.precioMin > precioRango[0] || filtros.precioMax < precioRango[1] ? 1 : 0)

  const limpiarTodo = () => setFiltros(FILTROS_INICIALES)

  return (
    <div className="bg-ink-100 min-h-screen">
      {/* ==================== Cabecera compacta ==================== */}
      <div className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-2xl font-black text-ink-900">Catálogo</h1>
          <p className="text-sm text-ink-500 mt-0.5">
            {productos.length}{' '}
            {productos.length === 1 ? 'producto' : 'productos'}
            {filtros.q && (
              <>
                {' '}para <strong className="text-ink-900">"{filtros.q}"</strong>
              </>
            )}
          </p>
        </div>
      </div>

      {/* ==================== Contenido principal ==================== */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid lg:grid-cols-[220px_1fr] gap-4">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-ink-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-ink-900">Filtros</h2>
                {filtrosActivos > 0 && (
                  <button
                    onClick={limpiarTodo}
                    className="text-xs font-semibold text-yunque-700 hover:underline"
                  >
                    Limpiar ({filtrosActivos})
                  </button>
                )}
              </div>
              <FilterSidebar
                filtros={filtros}
                onChange={setFiltros}
                precioRango={precioRango}
              />
            </div>
          </aside>

          {/* Columna principal */}
          <main className="min-w-0">
            {/* Barra de búsqueda y orden */}
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  value={filtros.q}
                  onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
                  placeholder="Buscar en el catálogo..."
                  className="w-full rounded-lg border border-ink-200 bg-white pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
                />
                {filtros.q && (
                  <button
                    onClick={() => setFiltros({ ...filtros, q: '' })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-ink-100"
                  >
                    <X className="h-4 w-4 text-ink-500" />
                  </button>
                )}
              </div>

              {/* Botón filtros móvil */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium hover:bg-ink-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="rounded-full bg-yunque-500 text-ink-900 text-xs font-bold h-5 min-w-5 grid place-items-center px-1">
                    {filtrosActivos}
                  </span>
                )}
              </button>

              {/* Orden */}
              <div className="relative">
                <select
                  value={filtros.orden}
                  onChange={(e) =>
                    setFiltros({ ...filtros, orden: e.target.value as Orden })
                  }
                  className="appearance-none rounded-lg border border-ink-200 bg-white pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yunque-400 cursor-pointer"
                >
                  {ORDENES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500" />
              </div>
            </div>

            {/* Pills de filtros activos */}
            {filtrosActivos > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filtros.q && (
                  <Pill onRemove={() => setFiltros({ ...filtros, q: '' })}>
                    Búsqueda: "{filtros.q}"
                  </Pill>
                )}
                {filtros.categorias.map((slug) => {
                  const cat = CATEGORIAS.find((c) => c.slug === slug)
                  return (
                    <Pill
                      key={slug}
                      onRemove={() =>
                        setFiltros({
                          ...filtros,
                          categorias: filtros.categorias.filter((c) => c !== slug),
                        })
                      }
                    >
                      {cat?.emoji} {cat?.nombre}
                    </Pill>
                  )
                })}
                {filtros.marcas.map((m) => (
                  <Pill
                    key={m}
                    onRemove={() =>
                      setFiltros({
                        ...filtros,
                        marcas: filtros.marcas.filter((x) => x !== m),
                      })
                    }
                  >
                    {m}
                  </Pill>
                ))}
                {(filtros.precioMin > precioRango[0] ||
                  filtros.precioMax < precioRango[1]) && (
                  <Pill
                    onRemove={() =>
                      setFiltros({
                        ...filtros,
                        precioMin: precioRango[0],
                        precioMax: precioRango[1],
                      })
                    }
                  >
                    {filtros.precioMin}€ – {filtros.precioMax}€
                  </Pill>
                )}
                {filtros.soloOfertas && (
                  <Pill onRemove={() => setFiltros({ ...filtros, soloOfertas: false })}>
                    Solo ofertas
                  </Pill>
                )}
                {filtros.soloDisponibles && (
                  <Pill
                    onRemove={() =>
                      setFiltros({ ...filtros, soloDisponibles: false })
                    }
                  >
                    Solo disponibles
                  </Pill>
                )}
                <button
                  onClick={limpiarTodo}
                  className="text-xs font-semibold text-ink-500 hover:text-red-600 underline self-center px-2"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {/* Grid de productos */}
            {productos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {productos.map((p) => (
                  <ProductCard key={p.id} producto={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-ink-300 bg-white p-12 text-center">
                <PackageX className="mx-auto h-12 w-12 text-ink-300" />
                <h3 className="mt-4 text-xl font-bold text-ink-900">
                  No encontramos productos
                </h3>
                <p className="mt-1 text-sm text-ink-500">
                  Prueba ajustando los filtros o limpiando la búsqueda.
                </p>
                <Button onClick={limpiarTodo} className="mt-6">
                  Limpiar filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ==================== Drawer móvil ==================== */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-ink-900/60 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden overflow-y-auto p-5">
            <FilterSidebar
              filtros={filtros}
              onChange={setFiltros}
              precioRango={precioRango}
              onClose={() => setDrawerOpen(false)}
            />
            <div className="sticky bottom-0 -mx-5 mt-4 border-t border-ink-200 bg-white p-4">
              <Button
                onClick={() => setDrawerOpen(false)}
                className="w-full"
                size="lg"
              >
                Ver {productos.length}{' '}
                {productos.length === 1 ? 'producto' : 'productos'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Pill({
  children,
  onRemove,
}: {
  children: React.ReactNode
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-ink-200 px-3 py-1 text-xs font-medium text-ink-700">
      {children}
      <button
        onClick={onRemove}
        className="hover:text-red-600 transition"
        aria-label="Quitar filtro"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}


