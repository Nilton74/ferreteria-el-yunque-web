import {
  MapPin, CreditCard, Truck, Package, RefreshCw, Download,
  MessageCircle,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge'
import { OrderTimeline } from './OrderTimeline'
import {
  METODO_ENTREGA_LABEL,
  METODO_PAGO_LABEL,
  type Pedido,
} from '@/features/orders/mockOrders'
import { formatCurrency } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  pedido: Pedido | null
  onRepeat?: (pedido: Pedido) => void
}

export function PublicOrderModal({ open, onClose, pedido, onRepeat }: Props) {
  if (!pedido) return null

  const fecha = new Date(pedido.creadoEn).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Pedido ${pedido.numero}`}
      subtitle={fecha}
      footer={
        <>
          {onRepeat && (
            <Button
              variant="secondary"
              onClick={() => onRepeat(pedido)}
              className="mr-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Repetir pedido
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Estado + Timeline */}
        <section className="rounded-xl border border-ink-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-ink-900 uppercase tracking-wider">
              Estado del pedido
            </p>
            <OrderStatusBadge estado={pedido.estado} />
          </div>
          <OrderTimeline pedido={pedido} />
        </section>

        {/* Productos */}
        <section>
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Productos ({pedido.items.length})
          </h3>
          <div className="rounded-xl border border-ink-200 divide-y divide-ink-100 bg-white">
            {pedido.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-14 w-14 rounded-lg object-cover border border-ink-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 line-clamp-2">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-ink-500 font-mono mt-0.5">
                    {item.sku}
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {item.cantidad} × {formatCurrency(item.precio)}
                  </p>
                </div>
                <p className="text-sm font-bold text-ink-900 shrink-0">
                  {formatCurrency(item.precio * item.cantidad)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Grid de info */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Entrega */}
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Entrega
            </p>
            <p className="text-sm text-ink-700">
              {METODO_ENTREGA_LABEL[pedido.metodoEntrega]}
            </p>
          </div>

          {/* Pago */}
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Pago
            </p>
            <p className="text-sm text-ink-700">
              {METODO_PAGO_LABEL[pedido.metodoPago]}
            </p>
          </div>

          {/* Dirección */}
          <div className="rounded-xl border border-ink-200 bg-white p-4 sm:col-span-2">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Dirección de envío
            </p>
            <p className="text-sm text-ink-700 leading-relaxed">
              {pedido.direccion.nombre}
              <br />
              {pedido.direccion.direccion}
              <br />
              {pedido.direccion.codigoPostal} {pedido.direccion.ciudad},{' '}
              {pedido.direccion.provincia}
            </p>
          </div>
        </div>

        {/* Totales */}
        <section className="rounded-xl border border-ink-200 bg-ink-50/60 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">Subtotal</span>
            <span className="font-medium">{formatCurrency(pedido.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">Envío</span>
            <span className="font-medium">
              {pedido.envio === 0 ? 'Gratis' : formatCurrency(pedido.envio)}
            </span>
          </div>
          <div className="pt-2 border-t border-ink-200 flex justify-between">
            <span className="font-bold text-ink-900">Total</span>
            <span className="text-xl font-black text-ink-900">
              {formatCurrency(pedido.total)}
            </span>
          </div>
        </section>

        {/* Acciones secundarias */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium hover:bg-ink-100 transition"
          >
            <Download className="h-4 w-4" />
            Descargar factura
          </button>
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-100 transition"
          >
            <MessageCircle className="h-4 w-4" />
            Contactar soporte
          </a>
        </div>
      </div>
    </Modal>
  )
}