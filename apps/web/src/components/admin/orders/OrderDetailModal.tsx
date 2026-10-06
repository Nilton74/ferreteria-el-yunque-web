import { useState } from 'react'
import {
  MapPin, CreditCard, Truck, User, Mail,
  Phone, Printer, MessageCircle, ChevronRight,
} from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { OrderStatusBadge } from './OrderStatusBadge'
import {
  ESTADOS,
  FLUJO_ESTADOS,
  METODO_ENTREGA_LABEL,
  METODO_PAGO_LABEL,
  actualizarEstadoPedido,
  type Pedido,
  type EstadoPedido,
} from '@/features/orders/mockOrders'
import { formatCurrency, cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

interface Props {
  open: boolean
  onClose: () => void
  pedido: Pedido | null
  onUpdate: () => void
}

export function OrderDetailModal({ open, onClose, pedido, onUpdate }: Props) {
  const user = useAuthStore((s) => s.user)
  const [nota, setNota] = useState('')

  if (!pedido) return null

  const fecha = new Date(pedido.creadoEn).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // ---------- Cambiar estado ----------
  const handleCambiarEstado = (nuevo: EstadoPedido) => {
    actualizarEstadoPedido(
      pedido.id,
      nuevo,
      user?.nombre ?? 'Admin',
      nota.trim() || undefined,
    )
    setNota('')
    onUpdate()
  }

  // ---------- Próximo estado ----------
  const idxActual = FLUJO_ESTADOS.indexOf(pedido.estado)
  const proximoEstado =
    idxActual >= 0 && idxActual < FLUJO_ESTADOS.length - 1
      ? FLUJO_ESTADOS[idxActual + 1]
      : null

  const esFinal =
    pedido.estado === 'entregado' || pedido.estado === 'cancelado'

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={`Pedido ${pedido.numero}`}
      subtitle={`${fecha} · ${pedido.items.length} ${pedido.items.length === 1 ? 'producto' : 'productos'}`}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => window.print()}
            className="mr-auto"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Imprimir
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          {proximoEstado && !esFinal && (
            <Button onClick={() => handleCambiarEstado(proximoEstado)}>
              Avanzar a {ESTADOS[proximoEstado].label}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </>
      }
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* ============ Columna izquierda ============ */}
        <div className="space-y-6">
          {/* Items */}
          <section>
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-3">
              Productos
            </h3>
            <div className="rounded-xl border border-ink-200 divide-y divide-ink-100">
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
                      {item.sku} · {item.cantidad} × {formatCurrency(item.precio)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-ink-900 shrink-0">
                    {formatCurrency(item.precio * item.cantidad)}
                  </p>
                </div>
              ))}
            </div>
          </section>

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

          {/* Cambio de estado manual */}
          {!esFinal && (
            <section>
              <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-3">
                Cambiar estado
              </h3>

              <input
                type="text"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Nota opcional (ej. nº de seguimiento)"
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-yunque-400"
              />

              <div className="flex flex-wrap gap-2">
                {FLUJO_ESTADOS.filter((e) => e !== pedido.estado).map((e) => (
                  <button
                    key={e}
                    onClick={() => handleCambiarEstado(e)}
                    className="px-3 py-1.5 rounded-lg border border-ink-200 bg-white text-xs font-semibold text-ink-700 hover:border-yunque-400 hover:bg-yunque-50 transition"
                  >
                    {ESTADOS[e].emoji} {ESTADOS[e].label}
                  </button>
                ))}
                <button
                  onClick={() => handleCambiarEstado('cancelado')}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  ✗ Cancelar pedido
                </button>
              </div>
            </section>
          )}

          {/* Timeline */}
          <section>
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-3">
              Historial
            </h3>
            <div className="space-y-4">
              {pedido.historial.map((h, i) => {
                const cfg = ESTADOS[h.estado]
                const fechaH = new Date(h.fecha).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                const esUltimo = i === pedido.historial.length - 1

                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full grid place-items-center text-sm font-bold shrink-0',
                          esUltimo
                            ? 'bg-yunque-500 text-ink-900'
                            : 'bg-ink-100 text-ink-500',
                        )}
                      >
                        {cfg.emoji}
                      </div>
                      {!esUltimo && (
                        <div className="w-0.5 flex-1 bg-ink-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-semibold text-ink-900">
                        {cfg.label}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {fechaH} · {h.usuario}
                      </p>
                      {h.nota && (
                        <p className="mt-1 text-xs text-ink-600 italic bg-ink-50 rounded-lg px-2 py-1">
                          {h.nota}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* ============ Columna derecha: info ============ */}
        <aside className="space-y-4">
          {/* Estado actual */}
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2">
              Estado actual
            </p>
            <OrderStatusBadge estado={pedido.estado} />
          </div>

          {/* Cliente */}
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Cliente
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-ink-900">
                {pedido.direccion.nombre}
              </p>
              <p className="flex items-center gap-2 text-ink-600">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{pedido.direccion.email}</span>
              </p>
              <p className="flex items-center gap-2 text-ink-600">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {pedido.direccion.telefono}
              </p>
            </div>
          </div>

          {/* Dirección */}
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Dirección de envío
            </p>
            <p className="text-sm text-ink-700 leading-relaxed">
              {pedido.direccion.direccion}
              <br />
              {pedido.direccion.codigoPostal} {pedido.direccion.ciudad}
              <br />
              {pedido.direccion.provincia}
            </p>
          </div>

          {/* Entrega y pago */}
          <div className="rounded-xl border border-ink-200 bg-white p-4 space-y-3">
            <div>
              <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Entrega
              </p>
              <p className="text-sm text-ink-700">
                {METODO_ENTREGA_LABEL[pedido.metodoEntrega]}
              </p>
            </div>
            <div className="pt-2 border-t border-ink-100">
              <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                Pago
              </p>
              <p className="text-sm text-ink-700">
                {METODO_PAGO_LABEL[pedido.metodoPago]}
              </p>
            </div>
          </div>

          {/* Notas */}
          {pedido.direccion.notas && (
            <div className="rounded-xl border border-yunque-200 bg-yunque-50 p-4">
              <p className="text-xs font-bold text-yunque-800 uppercase tracking-wider mb-2">
                Notas del cliente
              </p>
              <p className="text-sm text-ink-800 italic">
                "{pedido.direccion.notas}"
              </p>
            </div>
          )}

          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/${pedido.direccion.telefono.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-green-200 bg-green-50 p-3 text-center hover:bg-green-100 transition"
          >
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-green-800">
              <MessageCircle className="h-4 w-4" />
              Contactar por WhatsApp
            </div>
          </a>
        </aside>
      </div>
    </Modal>
  )
}