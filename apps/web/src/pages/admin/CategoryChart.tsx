import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'
import { VENTAS_CATEGORIA } from '@/features/dashboard/mockStats'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#f0b429', '#de911d', '#cb6e17', '#b44d12', '#8d2b0b', '#5c1b06']

export function CategoryChart() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink-900">Ventas por categoría</h3>
        <p className="text-sm text-ink-500">Este mes</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={VENTAS_CATEGORIA}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="categoria"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `€${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: 13,
              }}
              formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Ventas']}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {VENTAS_CATEGORIA.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}