import { useMemo, useState } from 'react'
import {
  Boxes, AlertTriangle, PackageX, Euro, Search, X,
  PackagePlus, PackageMinus, SlidersHorizontal, RotateCcw,
  ChevronLeft, ChevronRight, ArrowRight, User,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { KpiCard } from '@/components/admin/KpiCard'
import { MovementModal } from '@/features/inventory/MovementModal'
import { CATEGORIAS } from '@/features/products/mockProducts'
import {
  useProductStore,
  type ProductoAdmin,
} from '@/features/products/productStore'
import {
  useMovementStore,
  TIPO_CONFIG,
  type Movimiento,
  type TipoMovimiento,
} from '@/features/inventory/movementStore'
import { formatCurrency, cn } from '@/lib/utils'

const POR_PAGINA = 10

type Tab = 'stock' | 'movimientos'
type FiltroEstado = '' | 'stock-bajo' | 'agotado' | 'ok'

const ICONOS_TIPO: Record<TipoMovimiento, React.ComponentType<{ className?: string }>> = {
  entrada: PackagePlus,
  salida: PackageMinus,
  ajuste: SlidersHorizontal,
  devolucion: RotateCcw,
  merma: AlertTriangle,
}

export default function InventoryPage() {
  const productos = useProductStore((s) => s.productos)
  const movimientos = useMovementStore((s) => s.movimientos)

  const [tab, setTab] = useState<Tab>('stock')
  const [q, setQ] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('')
  const [pagina, setPagina] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoAdmin | null>(null)

  // ---------- KPIs ----------
  const kpis = useMemo(() => {
    const valorTotal = productos.reduce((acc, p) => acc + p.stock * p.costo, 0)
    const unidadesTotales = productos.reduce((acc, p) => acc + p.stock, 0)
    const stockBajo = productos.filter(
      (p) => p.stock > 0 && p.stock <= p.stockMinimo,
    ).length
    const agotados = productos.filter((p) => p.stock === 0).length
    return { valorTotal, unidadesTotales, stockBajo, agotados }
  }, [productos])

  // ---------- Filtrado ----------
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
    if (filtroEstado === 'stock-bajo')
      r = r.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo)
    if (filtroEstado === 'agotado') r = r.filter((p) => p.stock === 0)
    if (filtroEstado === 'ok')
      r = r.filter((p) => p.stock > p.stockMinimo)

    // Ordenar: críticos primero
    r.sort((a, b) => {
      const prioridad = (p: ProductoAdmin) =>
        p.stock === 0 ? 0 : p.stock <= p.stockMinimo ? 1 : 2
      return prioridad(a) - prioridad(b)
    })

    return r
  }, [productos, q, filtroCategoria, filtroEstado])

  // Movimientos filtrados por búsqueda
  const movimientosFiltrados = useMemo(() => {
    if (!q.trim()) return movimientos
    const t = q.toLowerCase()
    return movimientos.filter(
      (m) =>
        m.productoNombre.toLowerCase().includes(t) ||
        m.productoSku.toLowerCase().includes(t),
    )
  }, [movimientos, q])

  // ---------- Paginación ----------
  const listaProductos = filtrados
  const listaMovimientos = movimientosFiltrados
  const lista = tab === 'stock' ? listaProductos : listaMovimientos
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles =
    tab === 'stock'
      ? listaProductos.slice(
          (paginaActual - 1) * POR_PAGINA,
          paginaActual * POR_PAGINA,
        )
      : listaMovimientos.slice(
          (paginaActual - 1) * POR_PAGINA,
          paginaActual * POR_PAGINA,
        )

  // ---------- Handlers ----------
  const abrirModal = (p: ProductoAdmin) => {
    setProductoSeleccionado(p)
    setModalOpen(true)
  }

  const limpiarFiltros = () => {
    setQ('')
    setFiltroCategoria('')
    setFiltroEstado('')
    setPagina(1)
  }

  const filtrosActivos =
    (q ? 1 : 0) + (filtroCategoria ? 1 : 0) + (filtroEstado ? 1 : 0)

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-black text-ink-900">Inventario</h1>
        <p className="text-sm text-ink-500 mt-1">
          Control de stock, movimientos y valorización
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Valor del inventario"
          value={formatCurrency(kpis.valorTotal)}
          icon={Euro}
          iconColor="text-green-600"
        />
        <KpiCard
          label="Unidades totales"
          value={String(kpis.unidadesTotales)}
          icon={Boxes}
        />
        <KpiCard
          label="Stock bajo"
          value={String(kpis.stockBajo)}
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <KpiCard
          label="Productos agotados"
          value={String(kpis.agotados)}
          icon={PackageX}
          iconColor="text-red-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-ink-200">
        <TabButton active={tab === 'stock'} onClick={() => { setTab('stock'); setPagina(1) }}>
          Stock actual
          <span className="ml-2 rounded-full bg-ink-100 text-ink-700 text-xs font-bold px-2 py-0.5">
            {productos.length}
          </span>
        </TabButton>
        <TabButton active={tab === 'movimientos'} onClick={() => { setTab('movimientos'); setPagina(1) }}>
          Movimientos
          <span className="ml-2 rounded-full bg-ink-100 text-ink-700 text-xs font-bold px-2 py-0.5">
            {movimientos.length}
          </span>
        </TabButton>
      </div>

      {/* Barra de filtros */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPagina(1) }}
              placeholder={tab === 'stock' ? 'Buscar producto o SKU…' : 'Buscar por producto…'}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-ink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
            />
          </div>

          {tab === 'stock' && (
            <>
              <select
                value={filtroCategoria}
                onChange={(e) => { setFiltroCategoria(e.target.value); setPagina(1) }}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
              >
                <option value="">Categoría</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.nombre}</option>
                ))}
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => { setFiltroEstado(e.target.value as FiltroEstado); setPagina(1) }}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
              >
                <option value="">Estado</option>
                <option value="ok">En stock</option>
                <option value="stock-bajo">Stock bajo</option>
                <option value="agotado">Agotados</option>
              </select>
            </>
          )}

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

      {/* Tabla */}
      <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
        {(tab === 'stock' ? visibles.length === 0 : visibles.length === 0) ? (
          <div className="p-12 text-center">
            <Boxes className="mx-auto h-12 w-12 text-ink-300" />
            <h3 className="mt-4 text-lg font-bold text-ink-900">
              Sin resultados
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {tab === 'stock'
                ? 'Ajusta los filtros para ver productos.'
                : 'Aún no hay movimientos registrados.'}
            </p>
          </div>
        ) : tab === 'stock' ? (
          <StockTable productos={visibles as ProductoAdmin[]} onMovimiento={abrirModal} />
        ) : (
          <MovementsTable movimientos={visibles as Movimiento[]} />
        )}

        {/* Paginación */}
        {lista.length > POR_PAGINA && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-ink-200 bg-ink-50/60">
            <p className="text-sm text-ink-500">
              Mostrando {(paginaActual - 1) * POR_PAGINA + 1}–
              {Math.min(paginaActual * POR_PAGINA, lista.length)} de {lista.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="p-2 rounded-lg hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-sm font-semibold">
                {paginaActual} / {totalPaginas}
              </span>
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

      <MovementModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setProductoSeleccionado(null) }}
        producto={productoSeleccionado}
      />
    </div>
  )
}

// ---------- Subcomponentes ----------

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition inline-flex items-center',
        active
          ? 'border-yunque-500 text-ink-900'
          : 'border-transparent text-ink-500 hover:text-ink-900',
      )}
    >
      {children}
    </button>
  )
}

function StockTable({
  productos,
  onMovimiento,
}: {
  productos: ProductoAdmin[]
  onMovimiento: (p: ProductoAdmin) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-ink-50 border-b border-ink-200">
          <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
            <th className="p-4 font-semibold">Producto</th>
            <th className="p-4 font-semibold hidden md:table-cell">Categoría</th>
            <th className="p-4 font-semibold">Stock</th>
            <th className="p-4 font-semibold hidden lg:table-cell">Valor</th>
            <th className="p-4 font-semibold">Estado</th>
            <th className="p-4 w-32"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {productos.map((p) => {
            const cat = CATEGORIAS.find((c) => c.slug === p.categoria)
            const agotado = p.stock === 0
            const bajo = p.stock > 0 && p.stock <= p.stockMinimo
            const valor = p.stock * p.costo

            return (
              <tr
                key={p.id}
                className={cn(
                  'hover:bg-ink-50/60 transition',
                  agotado && 'bg-red-50/30',
                  bajo && !agotado && 'bg-orange-50/30',
                )}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imagenes[0]}
                      alt={p.nombre}
                      className="h-11 w-11 rounded-lg object-cover border border-ink-200 shrink-0"
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

                <td className="p-4 hidden md:table-cell text-ink-700">
                  {cat?.emoji} {cat?.nombre}
                </td>

                <td className="p-4">
                  <p className="font-bold text-ink-900">{p.stock} uds</p>
                  <p className="text-[11px] text-ink-400">
                    mín. {p.stockMinimo}
                  </p>
                </td>

                <td className="p-4 hidden lg:table-cell">
                  <p className="font-semibold text-ink-900">
                    {formatCurrency(valor)}
                  </p>
                  <p className="text-[11px] text-ink-400">
                    {formatCurrency(p.costo)} c/u
                  </p>
                </td>

                <td className="p-4">
                  {agotado ? (
                    <Badge variant="danger">Agotado</Badge>
                  ) : bajo ? (
                    <Badge variant="warning">Stock bajo</Badge>
                  ) : (
                    <Badge variant="success">Disponible</Badge>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMovimiento(p)}
                    >
                      <ArrowRight className="h-3.5 w-3.5 mr-1" />
                      Movimiento
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function MovementsTable({ movimientos }: { movimientos: Movimiento[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-ink-50 border-b border-ink-200">
          <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
            <th className="p-4 font-semibold">Fecha</th>
            <th className="p-4 font-semibold">Producto</th>
            <th className="p-4 font-semibold">Tipo</th>
            <th className="p-4 font-semibold text-center">Cambio</th>
            <th className="p-4 font-semibold hidden lg:table-cell">Motivo</th>
            <th className="p-4 font-semibold hidden md:table-cell">Usuario</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {movimientos.map((m) => {
            const cfg = TIPO_CONFIG[m.tipo]
            const Icon = ICONOS_TIPO[m.tipo]
            const fecha = new Date(m.fecha)
            const fechaStr = fecha.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            const horaStr = fecha.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })
            const delta = m.stockDespues - m.stockAntes

            return (
              <tr key={m.id} className="hover:bg-ink-50/60 transition">
                <td className="p-4">
                  <p className="font-medium text-ink-900">{fechaStr}</p>
                  <p className="text-xs text-ink-500">{horaStr}</p>
                </td>

                <td className="p-4">
                  <p className="font-semibold text-ink-900 line-clamp-1">
                    {m.productoNombre}
                  </p>
                  <p className="text-xs text-ink-500 font-mono">
                    {m.productoSku}
                  </p>
                </td>

                <td className="p-4">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
                      cfg.color === 'green' && 'bg-green-100 text-green-800',
                      cfg.color === 'blue' && 'bg-blue-100 text-blue-800',
                      cfg.color === 'yellow' && 'bg-yellow-100 text-yellow-800',
                      cfg.color === 'purple' && 'bg-purple-100 text-purple-800',
                      cfg.color === 'red' && 'bg-red-100 text-red-700',
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <p
                    className={cn(
                      'font-bold',
                      delta > 0
                        ? 'text-green-600'
                        : delta < 0
                          ? 'text-red-600'
                          : 'text-ink-900',
                    )}
                  >
                    {delta > 0 ? '+' : ''}
                    {delta}
                  </p>
                  <p className="text-[11px] text-ink-400">
                    {m.stockAntes} → {m.stockDespues}
                  </p>
                </td>

                <td className="p-4 hidden lg:table-cell">
                  <p className="text-ink-700">{m.motivo}</p>
                  {m.notas && (
                    <p className="text-xs text-ink-400 italic line-clamp-1">
                      {m.notas}
                    </p>
                  )}
                </td>

                <td className="p-4 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 text-sm text-ink-600">
                    <User className="h-3.5 w-3.5" />
                    {m.usuario}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}