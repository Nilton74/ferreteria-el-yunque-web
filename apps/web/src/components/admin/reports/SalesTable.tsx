import { formatCurrency } from '@/lib/utils'
import type { VentaDia } from '@/features/reports/reportsData'

export function SalesTable({ data }: { data: VentaDia[] }) {
  const total = data.reduce((acc, d) => acc + d.ventas, 0)
  const pedidos = data.reduce((acc, d) => acc + d.pedidos, 0)

  return (
    <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="p-6 border-b border-ink-200">
        <h3 className="text-lg font-bold text-ink-900">Detalle por período</h3>
        <p className="text-sm text-ink-500">
          {data.length} {data.length === 1 ? 'fila' : 'filas'}
        </p>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-ink-200 sticky top-0 z-10">
            <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
              <th className="p-4 font-semibold">Fecha</th>
              <th className="p-4 font-semibold text-right">Pedidos</th>
              <th className="p-4 font-semibold text-right">Ventas</th>
              <th className="p-4 font-semibold text-right hidden md:table-cell">
                Ticket medio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {data.map((d) => (
              <tr key={d.fecha} className="hover:bg-ink-50/60 transition">
                <td className="p-4 text-ink-900 font-medium">{d.label}</td>
                <td className="p-4 text-right text-ink-700">{d.pedidos}</td>
                <td className="p-4 text-right font-bold text-ink-900">
                  {formatCurrency(d.ventas)}
                </td>
                <td className="p-4 text-right text-ink-600 hidden md:table-cell">
                  {d.pedidos > 0
                    ? formatCurrency(d.ventas / d.pedidos)
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-ink-50 border-t-2 border-ink-200 sticky bottom-0">
            <tr className="font-bold">
              <td className="p-4 text-ink-900">TOTAL</td>
              <td className="p-4 text-right text-ink-900">{pedidos}</td>
              <td className="p-4 text-right text-ink-900">
                {formatCurrency(total)}
              </td>
              <td className="p-4 text-right text-ink-900 hidden md:table-cell">
                {pedidos > 0 ? formatCurrency(total / pedidos) : '—'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}