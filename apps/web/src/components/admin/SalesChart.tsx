import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { VENTAS_7_DIAS } from '@/features/dashboard/mockStats'
import { formatCurrency } from '@/lib/utils'

export function SalesChart() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-ink-900">Ventas últimos 7 días</h3>
          <p className="text-sm text-ink-500">Ingresos diarios</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-500">Total semana</p>
          <p className="text-lg font-black text-ink-900">
            {formatCurrency(
              VENTAS_7_DIAS.reduce((acc, d) => acc + d.ventas, 0),
            )}
          </p>
        </div>
      </div>

     <div className="h-56 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={VENTAS_7_DIAS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0b429" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f0b429" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="dia"
              stroke="#9ca3af"
              fontSize={12}
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
              labelStyle={{ fontWeight: 600, color: '#0f1115' }}
            />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#de911d"
              strokeWidth={3}
              fill="url(#colorVentas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}