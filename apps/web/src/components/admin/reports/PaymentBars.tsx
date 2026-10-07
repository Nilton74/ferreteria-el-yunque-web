import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { COLORES_METODOS_PAGO } from '@/features/dashboard/roleConfig'
import type { VentaMetodoPago } from '@/features/dashboard/mockStats'

export function PaymentBars({ data }: { data: VentaMetodoPago[] }) {
  const total = data.reduce((acc, m) => acc + m.total, 0)

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-6">
        <h3 className="text-lg font-bold text-ink-900 mb-1">Métodos de pago</h3>
        <p className="text-sm text-ink-500">Sin datos en este período</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-6">
      <div className="mb-4">
        <h3 className="text-base lg:text-lg font-bold text-ink-900">
          Métodos de pago
        </h3>
        <p className="text-xs lg:text-sm text-ink-500">
          Distribución de ingresos por forma de cobro
        </p>
      </div>

      <div className="h-56 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`)}
            />
            <YAxis
              type="category"
              dataKey="label"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                fontSize: 13,
              }}
              formatter={(value: unknown) => [formatCurrency(Number(value)), 'Ventas']}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="total" radius={[0, 8, 8, 0]}>
              {data.map((m) => (
                <Cell key={m.metodo} fill={COLORES_METODOS_PAGO[m.metodo] ?? '#f0b429'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((m) => (
          <div key={m.metodo} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ background: COLORES_METODOS_PAGO[m.metodo] ?? '#f0b429' }}
            />
            <span className="text-ink-700 truncate">{m.label}</span>
            <span className="ml-auto font-bold text-ink-900 shrink-0">
              {total > 0 ? ((m.total / total) * 100).toFixed(1) + '%' : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

