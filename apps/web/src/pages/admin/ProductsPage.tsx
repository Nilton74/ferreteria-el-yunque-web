import { useMemo, useState } from 'react'
import {
  Plus, Search, Pencil, Trash2, Power, PackageX,
  ChevronLeft, ChevronRight, X, ChevronUp, ChevronDown,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProductFormModal } from '@/components/admin/ProductFormModal'
import { CATEGORIAS, MARCAS } from '@/features/products/mockProducts'
import {
  useProductStore,
  calcularMargen,
  type ProductoAdmin,
} from '@/features/products/productStore'
import { formatCurrency, cn } from '@/lib/utils'

const POR_PAGINA = 10

type SortKey = 'nombre' | 'precio' | 'stock' | 'margen'
type SortDir = 'asc' | 'desc'

export default function ProductsPage() {
  const productos = useProductStore((s) => s.productos)
  const eliminar = useProductStore((s) => s.eliminar)
  const toggleActivo = useProductStore((s) => s.toggleActivo)
  const toggleActivoMultiple = useProductStore((s) => s.toggleActivoMultiple)

  const [formOpen, setFormOpen] = useState(false)
  const [editar, setEditar] = useState<ProductoAdmin | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [aEliminar, setAEliminar] = useState<string[]>([])

  const [q, setQ] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroMarca, setFiltroMarca] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'' | 'activo' | 'inactivo' | 'stock-bajo'>('')
  const [pagina, setPagina] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('nombre')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())

  // ---------- Filtrado y ordenamiento ----------
  const filtrados = useMemo(() => {
    let r = [...productos]

    if (q.trim()) {
      const t = q.toLowerCase()
      r = r.filter(
        (p) =>
          p.nombre.toLowerCase().includes(t) ||
          p.sku.toLowerCase().includes(t) ||
          p.marca.toLowerCase().includes(t),
      )
    }
    if (filtroCategoria) r = r.filter((p) => p.categoria === filtroCategoria)
    if (filtroMarca) r = r.filter((p) => p.marca === filtroMarca)
    if (filtroEstado === 'activo') r = r.filter((p) => p.activo)
    if (filtroEstado === 'inactivo') r = r.filter((p) => !p.activo)
    if (filtroEstado === 'stock-bajo')
      r = r.filter((p) => p.stock <= p.stockMinimo)

    r.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'nombre') cmp = a.nombre.localeCompare(b.nombre)
      if (sortKey === 'precio') cmp = a.precio - b.precio
      if (sortKey === 'stock') cmp = a.stock - b.stock
      if (sortKey === 'margen')
        cmp =
          calcularMargen(a.precio, a.costo).porcentaje -
          calcularMargen(b.precio, b.costo).porcentaje
      return sortDir === 'asc' ? cmp : -cmp
    })

    return r
  }, [productos, q, filtroCategoria, filtroMarca, filtroEstado, sortKey, sortDir])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  )

  // ---------- Handlers ----------
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggleSeleccion = (id: string) => {
    const s = new Set(seleccionados)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setSeleccionados(s)
  }

  const toggleTodos = () => {
    if (visibles.every((p) => seleccionados.has(p.id))) {
      const s = new Set(seleccionados)
      visibles.forEach((p) => s.delete(p.id))
      setSeleccionados(s)
    } else {
      const s = new Set(seleccionados)
      visibles.forEach((p) => s.add(p.id))
      setSeleccionados(s)
    }
  }

  const confirmarEliminar = () => {
    eliminar(aEliminar)
    setSeleccionados(new Set())
    setAEliminar([])
  }

  const limpiarFiltros = () => {
    setQ('')
    setFiltroCategoria('')
    setFiltroMarca('')
    setFiltroEstado('')
    setPagina(1)
  }

  const filtrosActivos =
    (q ? 1 : 0) +
    (filtroCategoria ? 1 : 0) +
    (filtroMarca ? 1 : 0) +
    (filtroEstado ? 1 : 0)

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Productos</h1>
          <p className="text-sm text-ink-500 mt-1">
            {filtrados.length} de {productos.length} productos
          </p>
        </div>
        <Button
          onClick={() => {
            setEditar(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      {/* Barra de filtros */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPagina(1)
              }}
              placeholder="Buscar por nombre, SKU o marca…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-ink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
            />
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => {
              setFiltroCategoria(e.target.value)
              setPagina(1)
            }}
            className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
          >
            <option value="">Categoría</option>
            {CATEGORIAS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={filtroMarca}
            onChange={(e) => {
              setFiltroMarca(e.target.value)
              setPagina(1)
            }}
            className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
          >
            <option value="">Marca</option>
            {MARCAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value as typeof filtroEstado)
              setPagina(1)
            }}
            className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
          >
            <option value="">Estado</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="stock-bajo">Stock bajo</option>
          </select>

          {filtrosActivos > 0 && (
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 hover:bg-ink-100"
            >
              <X className="h-4 w-4" />
              Limpiar ({filtrosActivos})
            </button>
          )}
        </div>
      </div>

      {/* Acciones masivas */}
      {seleccionados.size > 0 && (
        <div className="rounded-2xl border border-yunque-300 bg-yunque-50 p-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-ink-900">
            {seleccionados.size} seleccionado{seleccionados.size !== 1 ? 's' : ''}
          </span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                toggleActivoMultiple(Array.from(seleccionados), true)
                setSeleccionados(new Set())
              }}
            >
              <Power className="h-4 w-4 mr-1" />
              Activar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                toggleActivoMultiple(Array.from(seleccionados), false)
                setSeleccionados(new Set())
              }}
            >
              <Power className="h-4 w-4 mr-1" />
              Desactivar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setAEliminar(Array.from(seleccionados))
                setConfirmOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
        {visibles.length === 0 ? (
          <div className="p-12 text-center">
            <PackageX className="mx-auto h-12 w-12 text-ink-300" />
            <h3 className="mt-4 text-lg font-bold text-ink-900">
              No hay productos
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {filtrosActivos > 0
                ? 'Ajusta los filtros para encontrar lo que buscas.'
                : 'Empieza creando tu primer producto.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        visibles.length > 0 &&
                        visibles.every((p) => seleccionados.has(p.id))
                      }
                      onChange={toggleTodos}
                      className="rounded border-ink-300 text-yunque-500 focus:ring-yunque-400"
                    />
                  </th>
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold hidden md:table-cell">
                    Categoría
                  </th>
                  <th
                    className="p-4 font-semibold cursor-pointer select-none hidden lg:table-cell"
                    onClick={() => handleSort('precio')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Precio
                      <SortIcon active={sortKey === 'precio'} dir={sortDir} />
                    </span>
                  </th>
                  <th
                    className="p-4 font-semibold cursor-pointer select-none"
                    onClick={() => handleSort('stock')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Stock
                      <SortIcon active={sortKey === 'stock'} dir={sortDir} />
                    </span>
                  </th>
                  <th className="p-4 font-semibold hidden lg:table-cell">
                    Estado
                  </th>
                  <th className="p-4 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {visibles.map((p) => {
                  const cat = CATEGORIAS.find((c) => c.slug === p.categoria)
                  const stockBajo = p.stock > 0 && p.stock <= p.stockMinimo
                  const agotado = p.stock === 0
                  const seleccionado = seleccionados.has(p.id)

                  return (
                    <tr
                      key={p.id}
                      className={cn(
                        'hover:bg-ink-50/60 transition',
                        seleccionado && 'bg-yunque-50/60',
                      )}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={seleccionado}
                          onChange={() => toggleSeleccion(p.id)}
                          className="rounded border-ink-300 text-yunque-500 focus:ring-yunque-400"
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imagenes[0]}
                            alt={p.nombre}
                            className="h-12 w-12 rounded-lg object-cover border border-ink-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-ink-900 line-clamp-1">
                              {p.nombre}
                            </p>
                            <p className="text-xs text-ink-500 font-mono">
                              {p.sku} · {p.marca}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 hidden md:table-cell">
                        <span className="text-ink-700">
                          {cat?.emoji} {cat?.nombre}
                        </span>
                      </td>

                      <td className="p-4 hidden lg:table-cell">
                        {p.precioPromo ? (
                          <div>
                            <p className="font-bold text-yunque-700">
                              {formatCurrency(p.precioPromo)}
                            </p>
                            <p className="text-xs text-ink-400 line-through">
                              {formatCurrency(p.precio)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold text-ink-900">
                            {formatCurrency(p.precio)}
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        {agotado ? (
                          <Badge variant="danger">Agotado</Badge>
                        ) : stockBajo ? (
                          <div>
                            <Badge variant="warning">{p.stock} uds</Badge>
                            <p className="text-[10px] text-ink-400 mt-1">
                              mín. {p.stockMinimo}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-ink-900">{p.stock} uds</p>
                            <p className="text-[10px] text-ink-400">
                              mín. {p.stockMinimo}
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="p-4 hidden lg:table-cell">
                        {p.activo ? (
                          <Badge variant="success">Activo</Badge>
                        ) : (
                          <Badge variant="neutral">Inactivo</Badge>
                        )}
                        {p.precioPromo && (
                          <Badge variant="promo" className="ml-1">
                            Oferta
                          </Badge>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditar(p)
                              setFormOpen(true)
                            }}
                            className="p-2 rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleActivo(p.id)}
                            className={cn(
                              'p-2 rounded-lg transition',
                              p.activo
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-ink-400 hover:bg-ink-100',
                            )}
                            title={p.activo ? 'Desactivar' : 'Activar'}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setAEliminar([p.id])
                              setConfirmOpen(true)
                            }}
                            className="p-2 rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600 transition"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {filtrados.length > POR_PAGINA && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-ink-200 bg-ink-50/60">
            <p className="text-sm text-ink-500">
              Mostrando {(paginaActual - 1) * POR_PAGINA + 1}–
              {Math.min(paginaActual * POR_PAGINA, filtrados.length)} de{' '}
              {filtrados.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="p-2 rounded-lg hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPaginas }).map((_, i) => {
                const n = i + 1
                if (
                  n === 1 ||
                  n === totalPaginas ||
                  Math.abs(n - paginaActual) <= 1
                ) {
                  return (
                    <button
                      key={n}
                      onClick={() => setPagina(n)}
                      className={cn(
                        'h-9 w-9 rounded-lg text-sm font-bold transition',
                        n === paginaActual
                          ? 'bg-yunque-500 text-ink-900'
                          : 'hover:bg-ink-100 text-ink-700',
                      )}
                    >
                      {n}
                    </button>
                  )
                }
                if (
                  n === paginaActual - 2 ||
                  n === paginaActual + 2
                ) {
                  return (
                    <span key={n} className="px-1 text-ink-400">
                      …
                    </span>
                  )
                }
                return null
              })}
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
                className="p-2 rounded-lg hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <ProductFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditar(null)
        }}
        producto={editar}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setAEliminar([])
        }}
        onConfirm={confirmarEliminar}
        title="Eliminar producto"
        description={
          aEliminar.length === 1
            ? '¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.'
            : `¿Seguro que quieres eliminar ${aEliminar.length} productos? Esta acción no se puede deshacer.`
        }
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return (
      <span className="text-ink-300">
        <ChevronUp className="h-3 w-3 inline" />
      </span>
    )
  }
  return dir === 'asc' ? (
    <ChevronUp className="h-3 w-3 text-yunque-600" />
  ) : (
    <ChevronDown className="h-3 w-3 text-yunque-600" />
  )
}