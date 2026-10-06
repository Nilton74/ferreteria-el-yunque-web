import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Plus, Minus, Trash2, X, ShoppingCart, Percent,
  Package, ChevronRight, Check, AlertTriangle,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { PaymentModal } from '@/components/admin/pos/PaymentModal'
import { CATEGORIAS } from '@/features/products/mockProducts'
import {
  useProductStore,
  type ProductoAdmin,
} from '@/features/products/productStore'
import { usePOSStore, type MetodoPagoPOS } from '@/features/pos/posStore'
import { useMovementStore } from '@/features/inventory/movementStore'
import { useCajaStore } from '@/features/caja/cajaStore'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, cn } from '@/lib/utils'

export default function PosPage() {
  const productos = useProductStore((s) => s.productos)
  const user = useAuthStore((s) => s.user)
  const registrarMovimiento = useMovementStore((s) => s.registrar)
  const registrarVentaPOS = useCajaStore((s) => s.registrarVentaPOS)

  // ¿Hay turno de caja abierto?
  const turnos = useCajaStore((s) => s.turnos)
  const turnoAbierto = turnos.find((t) => t.estado === 'abierto')

  const {
    items, descuento, agregar, quitar, setCantidad, setDescuento, vaciar,
    subtotal, descuentoValor, iva, total,
  } = usePOSStore()

  const [q, setQ] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const ticketCounter = useRef(0)

  // ---------- Filtrado de productos ----------
  const productosFiltrados = useMemo(() => {
    let r = productos.filter((p) => p.activo && p.stock > 0)
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
    return r.slice(0, 24)
  }, [productos, q, filtroCategoria])

  const subtotalValue = subtotal()
  const descuentoValue = descuentoValor()
  const ivaValue = iva()
  const totalValue = total()

  // ---------- Añadir con Enter ----------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && productosFiltrados.length === 1) {
      agregar(productosFiltrados[0])
      setQ('')
    }
  }

  // ---------- Cobrar ----------
  const handleCobrar = (metodo: MetodoPagoPOS, recibido: number) => {
    if (items.length === 0) return

    ticketCounter.current = (ticketCounter.current + 1) % 1_000_000
    const ticketNum = ticketCounter.current.toString().padStart(6, '0')

    // 1) Descontar stock por cada item (movimiento de inventario)
    items.forEach((item) => {
      registrarMovimiento({
        productoId: item.productoId,
        tipo: 'salida',
        cantidad: item.cantidad,
        motivo: 'Venta mostrador',
        notas:
          'POS · ' +
          metodo.toUpperCase() +
          ' · Recibido: ' +
          formatCurrency(recibido) +
          ' · Ticket #' +
          ticketNum,
        usuario: user?.nombre ?? 'Vendedor',
      })
    })

    // 2) Registrar la venta en Caja (si hay turno abierto)
    if (turnoAbierto) {
      const metodoCaja = metodo === 'mixto' ? 'efectivo' : metodo
      registrarVentaPOS({
        monto: totalValue,
        metodo: metodoCaja,
        referencia: '#' + ticketNum,
        usuario: user?.nombre ?? 'Vendedor',
      })
    }

    setPaymentOpen(false)
    setSuccess(true)
    vaciar()

    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
      {/* ==================== Columna izquierda: catálogo ==================== */}
      <div className="flex flex-col gap-4 min-h-0">
        {/* Alerta si no hay caja abierta */}
        {!turnoAbierto && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 flex items-start gap-2 text-sm shrink-0">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-orange-900">
                No hay turno de caja abierto
              </p>
              <p className="text-orange-700 text-xs mt-0.5">
                Puedes vender, pero la operación NO se registrará en caja.{' '}
                <Link to="/admin/caja" className="font-bold underline">
                  Abrir caja
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Buscador */}
        <div className="rounded-2xl border border-ink-200 bg-white p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar por nombre, SKU o marca..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-ink-200 bg-ink-50/60 text-base font-medium focus:outline-none focus:ring-2 focus:ring-yunque-400 focus:bg-white transition"
              autoFocus
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-ink-100"
              >
                <X className="h-4 w-4 text-ink-500" />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <CategoriaChip
              activo={filtroCategoria === ''}
              onClick={() => setFiltroCategoria('')}
            >
              Todos
            </CategoriaChip>
            {CATEGORIAS.slice(0, 6).map((c) => (
              <CategoriaChip
                key={c.slug}
                activo={filtroCategoria === c.slug}
                onClick={() => setFiltroCategoria(c.slug)}
              >
                {c.emoji} {c.nombre}
              </CategoriaChip>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-ink-200 bg-white p-4">
          {productosFiltrados.length === 0 ? (
            <div className="h-full grid place-items-center text-center">
              <div>
                <Package className="mx-auto h-12 w-12 text-ink-300" />
                <p className="mt-3 text-sm text-ink-500">
                  {q ? 'Sin resultados' : 'No hay productos disponibles'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {productosFiltrados.map((p) => (
                <ProductoTile key={p.id} producto={p} onClick={() => agregar(p)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== Columna derecha: ticket ==================== */}
      <aside className="grid grid-rows-[auto_1fr_auto] rounded-2xl border border-ink-200 bg-white overflow-hidden min-h-0">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-ink-200 bg-ink-50">
          <ShoppingCart className="h-5 w-5 text-ink-700" />
          <h2 className="font-bold text-ink-900">Ticket actual</h2>
          {items.length > 0 && (
            <span className="ml-auto rounded-full bg-yunque-500 text-ink-900 text-xs font-bold px-2.5 py-1">
              {items.reduce((a, i) => a + i.cantidad, 0)} uds
            </span>
          )}
        </div>

        {/* Items */}
        <div className="overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full grid place-items-center text-center">
              <div>
                <ShoppingCart className="mx-auto h-14 w-14 text-ink-200" />
                <p className="mt-4 font-semibold text-ink-500">Ticket vacío</p>
                <p className="mt-1 text-sm text-ink-400">
                  Añade productos desde la izquierda
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productoId}
                  className="flex gap-3 rounded-xl border border-ink-200 p-3"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="h-14 w-14 rounded-lg object-cover border border-ink-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 line-clamp-2">
                      {item.nombre}
                    </p>
                    <p className="text-[11px] text-ink-400 font-mono">
                      {item.sku}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-md border border-ink-200">
                        <button
                          onClick={() =>
                            setCantidad(item.productoId, item.cantidad - 1)
                          }
                          className="h-7 w-7 grid place-items-center hover:bg-ink-100 rounded-l-md"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            setCantidad(item.productoId, item.cantidad + 1)
                          }
                          disabled={item.cantidad >= item.stockDisponible}
                          className="h-7 w-7 grid place-items-center hover:bg-ink-100 rounded-r-md disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs text-ink-400">
                        {formatCurrency(item.precio)} c/u
                      </span>
                      <button
                        onClick={() => quitar(item.productoId)}
                        className="ml-auto p-1.5 rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-ink-900">
                      {formatCurrency(item.precio * item.cantidad)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 ? (
          <div className="border-t border-ink-200 bg-ink-50/60 p-5 space-y-3">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
                <Percent className="h-3.5 w-3.5" />
                Descuento
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[0, 5, 10, 15, 20].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDescuento(d)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition border',
                      descuento === d
                        ? 'bg-yunque-500 text-ink-900 border-yunque-500'
                        : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300',
                    )}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 text-sm">
              <Row label="Subtotal" value={formatCurrency(subtotalValue)} />
              {descuento > 0 && (
                <Row
                  label={'Descuento (' + descuento + '%)'}
                  value={'-' + formatCurrency(descuentoValue)}
                  valueClass="text-red-600"
                />
              )}
              <Row label="IVA (21%)" value={formatCurrency(ivaValue)} />
            </div>

            <div className="pt-3 border-t border-ink-200 flex items-center justify-between">
              <span className="font-bold text-ink-900">TOTAL</span>
              <span className="text-2xl font-black text-ink-900">
                {formatCurrency(totalValue)}
              </span>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-2 pt-2">
              <Button variant="ghost" onClick={vaciar} title="Vaciar ticket">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                onClick={() => setPaymentOpen(true)}
                className="w-full"
              >
                Cobrar {formatCurrency(totalValue)}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-ink-200 bg-ink-50/60 p-5 text-center text-xs text-ink-400">
            Añade productos para ver los totales
          </div>
        )}
      </aside>

      {/* Modales */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onConfirm={handleCobrar}
        total={totalValue}
      />

      {/* Toast de éxito */}
      {success && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-green-600 text-white px-5 py-4 shadow-2xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">¡Venta registrada!</p>
            <p className="text-xs text-green-50">
              {turnoAbierto
                ? 'Stock y caja actualizados automáticamente'
                : 'Stock actualizado (sin turno de caja abierto)'}
            </p>
          </div>
          <Link
            to="/admin/caja"
            className="ml-2 text-xs font-semibold underline"
          >
            Ver caja
          </Link>
        </div>
      )}
    </div>
  )
}

// ---------- Subcomponentes ----------
function CategoriaChip({
  activo,
  onClick,
  children,
}: {
  activo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-semibold transition border',
        activo
          ? 'bg-ink-900 text-white border-ink-900'
          : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300',
      )}
    >
      {children}
    </button>
  )
}

function ProductoTile({
  producto,
  onClick,
}: {
  producto: ProductoAdmin
  onClick: () => void
}) {
  const stockBajo = producto.stock <= producto.stockMinimo

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-xl border border-ink-200 bg-white overflow-hidden hover:border-yunque-400 hover:shadow-md transition"
    >
      <div className="aspect-square bg-ink-100 overflow-hidden relative">
        <img
          src={producto.imagenes[0]}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {producto.precioPromo && (
          <span className="absolute top-1.5 left-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5">
            OFERTA
          </span>
        )}
        {stockBajo && (
          <span className="absolute top-1.5 right-1.5 rounded-full bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5">
            {producto.stock} uds
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[11px] font-medium text-yunque-700 uppercase tracking-wide">
          {producto.marca}
        </p>
        <p className="text-xs font-semibold text-ink-900 line-clamp-2 min-h-[32px] mt-0.5">
          {producto.nombre}
        </p>
        <div className="mt-1.5 flex items-end justify-between">
          {producto.precioPromo ? (
            <div>
              <p className="text-[10px] text-ink-400 line-through">
                {formatCurrency(producto.precio)}
              </p>
              <p className="text-sm font-black text-yunque-700">
                {formatCurrency(producto.precioPromo)}
              </p>
            </div>
          ) : (
            <p className="text-sm font-black text-ink-900">
              {formatCurrency(producto.precio)}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

function Row({
  label,
  value,
  valueClass = '',
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={cn('font-medium text-ink-900', valueClass)}>{value}</span>
    </div>
  )
}
