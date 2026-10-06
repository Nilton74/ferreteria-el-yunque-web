import { Link } from 'react-router-dom'
import {
  User, Mail, Phone, MapPin, Calendar, ShoppingBag,
  Wallet, TrendingUp, Package, MessageCircle, ExternalLink,
} from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { SegmentBadge } from './SegmentBadge'
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge'
import type { Cliente } from '@/features/clientes/clientStore'
import type { EstadoPedido } from '@/features/orders/mockOrders'
import { formatCurrency } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  cliente: Cliente | null
}

export function ClientDetailModal({ open, onClose, cliente }: Props) {
  if (!cliente) return null

  const fechaRegistro = new Date(cliente.creadoEn).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const ultimaCompra = cliente.ultimaCompra
    ? new Date(cliente.ultimaCompra).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin compras'

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={cliente.nombre}
      subtitle={cliente.email}
      footer={
        <>
          <a
            href={`https://wa.me/${cliente.telefono.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="mr-auto"
          >
            <Button variant="ghost">
              <MessageCircle className="h-4 w-4 mr-1.5" />
              WhatsApp
            </Button>
          </a>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Cabecera con avatar + segmento */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-yunque-500 text-ink-900 grid place-items-center text-2xl font-black shrink-0">
            {cliente.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-ink-900">{cliente.nombre}</p>
            <div className="mt-1">
              <SegmentBadge segmento={cliente.segmento} />
            </div>
          </div>
        </div>

        {/* KPIs del cliente */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniKpi
            icon={ShoppingBag}
            label="Pedidos"
            value={String(cliente.pedidos.length)}
          />
          <MiniKpi
            icon={Wallet}
            label="Total gastado"
            value={formatCurrency(cliente.totalGastado)}
            color="green"
          />
          <MiniKpi
            icon={TrendingUp}
            label="Ticket medio"
            value={formatCurrency(cliente.ticketPromedio)}
          />
          <MiniKpi
            icon={Calendar}
            label="Última compra"
            value={ultimaCompra}
            small
          />
        </div>

        {/* Info de contacto */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-ink-200 bg-white p-4 space-y-3">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Contacto
            </p>
            <p className="flex items-center gap-2 text-sm text-ink-700">
              <Mail className="h-4 w-4 text-ink-400 shrink-0" />
              <span className="truncate">{cliente.email}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-ink-700">
              <Phone className="h-4 w-4 text-ink-400 shrink-0" />
              {cliente.telefono}
            </p>
            <p className="flex items-center gap-2 text-xs text-ink-500 pt-2 border-t border-ink-100">
              <Calendar className="h-3.5 w-3.5 text-ink-400" />
              Cliente desde {fechaRegistro}
            </p>
          </div>

          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <MapPin className="h-3.5 w-3.5" />
              Dirección
            </p>
            <p className="text-sm text-ink-700 leading-relaxed">
              {cliente.direccion}
              <br />
              {cliente.codigoPostal} {cliente.ciudad}
              <br />
              {cliente.provincia}
            </p>
          </div>
        </div>

        {/* Productos favoritos */}
        {cliente.productosFavoritos.length > 0 && (
          <div className="rounded-xl border border-ink-200 bg-white p-4">
            <p className="text-xs font-bold text-ink-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Package className="h-3.5 w-3.5" />
              Productos favoritos
            </p>
            <div className="space-y-2">
              {cliente.productosFavoritos.map((pf: { nombre: string; cantidad: number }, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-1.5"
                >
                  <span className="text-ink-700 line-clamp-1">{pf.nombre}</span>
                  <span className="text-ink-500 font-semibold text-xs shrink-0 ml-3">
                    {pf.cantidad} uds
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historial de pedidos */}
        <div>
          <p className="text-xs font-bold text-ink-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <ShoppingBag className="h-3.5 w-3.5" />
            Historial de pedidos
            {cliente.pedidos.length > 0 && (
              <span className="ml-1 rounded-full bg-ink-100 text-ink-600 text-[10px] font-bold px-2 py-0.5">
                {cliente.pedidos.length}
              </span>
            )}
          </p>

          {cliente.pedidos.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/60 p-6 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-ink-300" />
              <p className="mt-2 text-sm text-ink-500">
                Este cliente aún no ha hecho pedidos
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-ink-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 border-b border-ink-200">
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                    <th className="p-3 font-semibold">Pedido</th>
                    <th className="p-3 font-semibold">Fecha</th>
                    <th className="p-3 font-semibold text-right">Total</th>
                    <th className="p-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {cliente.pedidos.slice(0, 5).map((p: { id: string; creadoEn: string; numero: string; total: number; estado: EstadoPedido }) => {
                    const fecha = new Date(p.creadoEn).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit',
                    })
                    return (
                      <tr key={p.id} className="hover:bg-ink-50/60 transition">
                        <td className="p-3 font-mono text-xs font-semibold text-ink-700">
                          {p.numero}
                        </td>
                        <td className="p-3 text-ink-600">{fecha}</td>
                        <td className="p-3 text-right font-bold text-ink-900">
                          {formatCurrency(p.total)}
                        </td>
                        <td className="p-3">
                          <OrderStatusBadge estado={p.estado} size="sm" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {cliente.pedidos.length > 5 && (
                <div className="border-t border-ink-200 bg-ink-50/60 p-3 text-center">
                  <Link
                    to="/admin/pedidos"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-yunque-700 hover:underline"
                  >
                    Ver todos los pedidos
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

// ---------- Mini KPI ----------
function MiniKpi({
  icon: Icon,
  label,
  value,
  color = 'default',
  small = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color?: 'default' | 'green'
  small?: boolean
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-3">
      <Icon
        className={
          'h-4 w-4 ' + (color === 'green' ? 'text-green-600' : 'text-ink-400')
        }
      />
      <p className="mt-2 text-[10px] font-bold text-ink-500 uppercase tracking-wider">
        {label}
      </p>
      <p
        className={
          'mt-0.5 font-black text-ink-900 ' +
          (small ? 'text-xs' : 'text-base')
        }
      >
        {value}
      </p>
    </div>
  )
}