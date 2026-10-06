import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package, Home, MessageCircle } from 'lucide-react'
import { getPedidoById, type MetodoEntrega, type MetodoPago } from '@/features/orders/mockOrders'
import { formatCurrency } from '@/lib/utils'

const ENTREGA_LABEL: Record<MetodoEntrega, string> = {
  estandar: 'Envío estándar (3-5 días)',
  express: 'Envío express (24-48h)',
  recogida: 'Recogida en tienda',
}

const PAGO_LABEL: Record<MetodoPago, string> = {
  tarjeta: 'Tarjeta de crédito/débito',
  transferencia: 'Transferencia bancaria',
  contraentrega: 'Pago contra entrega',
}

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const pedido = id ? getPedidoById(id) : undefined

  if (!pedido) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-ink-900">
          Pedido no encontrado
        </h1>
        <p className="mt-2 text-ink-500">
          El pedido que buscas no existe o fue eliminado.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-yunque-500 text-ink-900 px-6 py-3 font-semibold hover:bg-yunque-400 transition"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    )
  }

  const fecha = new Date(pedido.creadoEn).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-ink-100 min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Encabezado éxito */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 grid place-items-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl font-black text-ink-900">
            ¡Gracias por tu compra!
          </h1>
          <p className="mt-3 text-ink-500">
            Hemos recibido tu pedido correctamente. Te enviamos un email de
            confirmación.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-ink-200 px-4 py-2">
            <Package className="h-4 w-4 text-yunque-600" />
            <span className="text-sm font-bold text-ink-900">
              Pedido {pedido.numero}
            </span>
          </div>
        </div>

        {/* Detalles */}
        <div className="mt-10 rounded-2xl border border-ink-200 bg-white p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Fecha
              </p>
              <p className="mt-1 text-sm font-medium text-ink-900">{fecha}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Estado
              </p>
              <span
                className={
                  pedido.estado === 'pagado'
                    ? 'mt-1 inline-block rounded-full bg-green-100 text-green-800 text-xs font-bold px-3 py-1'
                    : 'mt-1 inline-block rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1'
                }
              >
                {pedido.estado.toUpperCase()}
              </span>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Dirección de envío
              </p>
              <p className="mt-1 text-sm text-ink-900">
                {pedido.direccion.nombre}
                <br />
                {pedido.direccion.direccion}
                <br />
                {pedido.direccion.codigoPostal} {pedido.direccion.ciudad},{' '}
                {pedido.direccion.provincia}
                <br />
                {pedido.direccion.telefono}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Entrega
              </p>
              <p className="mt-1 text-sm text-ink-900">
                {ENTREGA_LABEL[pedido.metodoEntrega]}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Pago
              </p>
              <p className="mt-1 text-sm text-ink-900">
                {PAGO_LABEL[pedido.metodoPago]}
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-4">Productos</h2>
          <div className="space-y-3">
            {pedido.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-12 w-12 rounded-lg object-cover border border-ink-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink-900 line-clamp-1">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-ink-400">
                    {item.cantidad} × {formatCurrency(item.precio)}
                  </p>
                </div>
                <span className="font-semibold text-ink-900">
                  {formatCurrency(item.precio * item.cantidad)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-ink-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(pedido.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Envío</span>
              <span className="font-medium">
                {pedido.envio === 0 ? 'Gratis' : formatCurrency(pedido.envio)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-ink-100">
              <span className="font-bold text-ink-900">Total</span>
              <span className="text-xl font-black text-ink-900">
                {formatCurrency(pedido.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 rounded-lg bg-yunque-500 text-ink-900 px-6 py-3 font-semibold hover:bg-yunque-400 transition"
          >
            Seguir comprando
          </Link>
          <Link
            to="/cuenta"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white text-ink-900 px-6 py-3 font-semibold hover:bg-ink-100 transition"
          >
            Ver mis pedidos
          </Link>
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white text-ink-900 px-6 py-3 font-semibold hover:bg-ink-100 transition"
          >
            <MessageCircle className="h-4 w-4" />
            Contactar
          </a>
        </div>
      </div>
    </div>
  )
}