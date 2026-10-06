import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { VentaCategoria } from '@/features/reports/reportsData'

const COLORS = ['#f0b429', '#de911d', '#cb6e17', '#b44d12', '#8d2b0b', '#5c1b06']

export function CategoryBarChart({ data }: { data: VentaCategoria[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink-900 mb-1">Ventas por categoría</h3>
        <p className="text-sm text-ink-500">Sin datos en este período</p>
      </div>
    )
  }

  const dataConEmoji = data.map((c) => ({
    ...c,
    label: `${c.emoji} ${c.categoria}`,
  }))

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink-900">Ventas por categoría</h3>
        <p className="text-sm text-ink-500">Ingresos agrupados por tipo</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataConEmoji}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
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
              width={140}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                fontSize: 13,
              }}
              formatter={(value) => {
                const numericValue = Number(value ?? 0)
                return [formatCurrency(numericValue), 'Ventas']
              }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="total" radius={[0, 8, 8, 0]}>
              {dataConEmoji.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}