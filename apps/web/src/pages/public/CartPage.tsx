import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'

const ENVIO_GRATIS_DESDE = 50
const COSTO_ENVIO = 4.95

export default function CartPage() {
  const { items, remove, setQty, subtotal, clear } = useCartStore()
  const subtotalValue = subtotal()
  const envio = subtotalValue >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO
  const total = subtotalValue + envio
  const faltaParaEnvioGratis = Math.max(0, ENVIO_GRATIS_DESDE - subtotalValue)

  // -------- Carrito vacío --------
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto h-24 w-24 grid place-items-center rounded-full bg-ink-100">
          <ShoppingBag className="h-10 w-10 text-ink-400" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-ink-900">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-ink-500">
          Aún no has agregado ningún producto.
        </p>
        <Link
          to="/productos"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-yunque-500 text-ink-900 px-6 py-3 font-semibold hover:bg-yunque-400 transition"
        >
          Explorar catálogo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  // -------- Carrito con items --------
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-ink-900">
          Carrito{' '}
          <span className="text-ink-400 font-medium text-xl">
            ({items.length} {items.length === 1 ? 'producto' : 'productos'})
          </span>
        </h1>

        <button
          onClick={clear}
          className="text-sm text-ink-500 hover:text-red-600 font-medium transition"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* ------------ Lista de items ------------ */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-ink-200 bg-white p-4"
            >
              <Link
                to={`/productos/${item.id}`}
                className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-ink-100"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-yunque-700 uppercase tracking-wide">
                      {item.sku}
                    </p>
                    <Link
                      to={`/productos/${item.id}`}
                      className="font-semibold text-ink-900 hover:underline line-clamp-2"
                    >
                      {item.nombre}
                    </Link>
                  </div>

                  <button
                    onClick={() => remove(item.id)}
                    className="p-2 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto pt-3 flex items-end justify-between">
                  {/* Cantidad */}
                  <div className="inline-flex items-center rounded-lg border border-ink-200">
                    <button
                      onClick={() => setQty(item.id, item.cantidad - 1)}
                      className="h-9 w-9 grid place-items-center hover:bg-ink-100 rounded-l-lg transition"
                      disabled={item.cantidad <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => setQty(item.id, item.cantidad + 1)}
                      className="h-9 w-9 grid place-items-center hover:bg-ink-100 rounded-r-lg transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <p className="text-xs text-ink-400">
                      {formatCurrency(item.precio)} c/u
                    </p>
                    <p className="text-lg font-black text-ink-900">
                      {formatCurrency(item.precio * item.cantidad)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-yunque-700 hover:underline mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Seguir comprando
          </Link>
        </div>

        {/* ------------ Resumen ------------ */}
        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="text-lg font-bold text-ink-900 mb-4">
            Resumen del pedido
          </h2>

          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotalValue)} />
            <Row
              label="Envío"
              value={envio === 0 ? 'Gratis' : formatCurrency(envio)}
              valueClass={envio === 0 ? 'text-green-600 font-semibold' : ''}
            />

            {faltaParaEnvioGratis > 0 && (
              <div className="rounded-lg bg-yunque-50 border border-yunque-200 px-3 py-2 text-xs text-yunque-800 mt-3">
                Añade <strong>{formatCurrency(faltaParaEnvioGratis)}</strong> más
                y obtén <strong>envío gratis</strong> 🚚
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-ink-200 flex items-center justify-between">
            <span className="font-bold text-ink-900">Total</span>
            <span className="text-2xl font-black text-ink-900">
              {formatCurrency(total)}
            </span>
          </div>

          <p className="mt-2 text-xs text-ink-400">
            IVA incluido · Calculado al finalizar la compra
          </p>

          <Link
            to="/checkout"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-yunque-500 text-ink-900 px-6 py-3 font-bold hover:bg-yunque-400 transition"
          >
            Finalizar compra
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-4 flex items-center gap-3 text-xs text-ink-500 justify-center">
            <span>🔒 Pago seguro</span>
            <span>·</span>
            <span>↩️ Devolución 30 días</span>
          </div>
        </aside>
      </div>
    </div>
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
      <span className={`font-medium text-ink-900 ${valueClass}`}>{value}</span>
    </div>
  )
}