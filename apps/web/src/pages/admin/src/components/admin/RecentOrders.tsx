import { Link } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'

const ORDERS = [
  { numero: '#10045', cliente: 'Juan Pérez',   total: 245.9, estado: 'pagado' as const },
  { numero: '#10044', cliente: 'María López',  total: 89.5,  estado: 'pendiente' as const },
  { numero: '#10043', cliente: 'Pedro García', total: 532.0, estado: 'enviado' as const },
  { numero: '#10042', cliente: 'Ana Martín',   total: 128.4, estado: 'pagado' as const },
  { numero: '#10041', cliente: 'Luis Sánchez', total: 74.9,  estado: 'preparando' as const },
]

const BADGES: Record<string, string> = {
  pagado:     'bg-green-100 text-green-800',
  pendiente:  'bg-yellow-100 text-yellow-800',
  enviado:    'bg-blue-100 text-blue-800',
  preparando: 'bg-purple-100 text-purple-800',
}

export function RecentOrders() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-ink-900">Últimos pedidos</h3>
          <p className="text-sm text-ink-500">Actividad reciente</p>
        </div>
        <Link
          to="/admin/pedidos"
          className="text-sm font-semibold text-yunque-700 hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-ink-400 border-b border-ink-200">
              <th className="pb-3 font-semibold">Pedido</th>
              <th className="pb-3 font-semibold">Cliente</th>
              <th className="pb-3 font-semibold text-right">Total</th>
              <th className="pb-3 font-semibold text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ORDERS.map((o) => (
              <tr key={o.numero} className="hover:bg-ink-50/60 transition">
                <td className="py-3 font-mono text-xs font-semibold text-ink-700">
                  {o.numero}
                </td>
                <td className="py-3 text-ink-900 font-medium">{o.cliente}</td>
                <td className="py-3 text-right font-bold text-ink-900">
                  {formatCurrency(o.total)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={cn(
                      'inline-block rounded-full px-2.5 py-1 text-xs font-bold uppercase',
                      BADGES[o.estado],
                    )}
                  >
                    {o.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}