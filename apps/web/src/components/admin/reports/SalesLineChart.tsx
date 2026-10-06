import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { VentaDia } from '@/features/reports/reportsData'

export function SalesLineChart({ data }: { data: VentaDia[] }) {
  const maxVentas = Math.max(...data.map((d) => d.ventas), 100)

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-ink-900">Evolución de ventas</h3>
          <p className="text-sm text-ink-500">
            {data.length} {data.length === 1 ? 'día' : 'puntos'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-500">Máximo</p>
          <p className="text-lg font-black text-ink-900">
            {formatCurrency(maxVentas)}
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0b429" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#f0b429" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: 13,
              }}
              formatter={(value) => {
                const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
                return [formatCurrency(numericValue), 'Ventas']
              }}
              labelStyle={{ fontWeight: 600, color: '#0f1115' }}
            />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#de911d"
              strokeWidth={3}
              fill="url(#gradVentas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}