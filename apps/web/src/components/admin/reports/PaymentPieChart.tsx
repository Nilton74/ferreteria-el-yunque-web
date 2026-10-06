import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { VentaMetodoPago } from '@/features/reports/reportsData'

const COLORS = ['#f0b429', '#de911d', '#cb6e17', '#b44d12']

export function PaymentPieChart({ data }: { data: VentaMetodoPago[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink-900 mb-1">Métodos de pago</h3>
        <p className="text-sm text-ink-500">Sin datos en este período</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <h3 className="text-lg font-bold text-ink-900 mb-1">Métodos de pago</h3>
      <p className="text-sm text-ink-500 mb-4">Distribución de ingresos</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                fontSize: 13,
              }}
              formatter={(value, name) => {
                const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
                return [formatCurrency(numericValue), String(name)]
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Lista debajo */}
      <div className="mt-4 space-y-2">
        {data.map((m, i) => (
          <div key={m.metodo} className="flex items-center gap-3 text-sm">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-ink-700 truncate">{m.label}</span>
            <span className="font-bold text-ink-900 shrink-0">
              {m.porcentaje.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}