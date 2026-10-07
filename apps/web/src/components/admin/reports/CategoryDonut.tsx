import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { COLORES_GRAFICOS } from '@/features/dashboard/roleConfig'
import type { VentaCategoria } from '@/features/dashboard/mockStats'

export function CategoryDonut({ data }: { data: VentaCategoria[] }) {
  const totalVentas = data.reduce((acc, c) => acc + c.total, 0)

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-6">
        <h3 className="text-lg font-bold text-ink-900 mb-1">Ventas por categoría</h3>
        <p className="text-sm text-ink-500">Sin datos en este período</p>
      </div>
    )
  }

  // Añadir porcentaje a cada item
  const dataConPorcentaje = data.map((c) => ({
    ...c,
    porcentaje: totalVentas > 0 ? (c.total / totalVentas) * 100 : 0,
  }))

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-6">
      <div className="mb-4">
        <h3 className="text-base lg:text-lg font-bold text-ink-900">
          Ventas por categoría
        </h3>
        <p className="text-xs lg:text-sm text-ink-500">
          Distribución porcentual del período
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Dona */}
        <div className="relative h-56 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataConPorcentaje}
                dataKey="total"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
              >
                {dataConPorcentaje.map((_, i) => (
                  <Cell key={i} fill={COLORES_GRAFICOS[i % COLORES_GRAFICOS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: 13,
                }}
                formatter={(value: any, name: any) => [formatCurrency(Number(value)), String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centro con total */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              <p className="text-[10px] lg:text-xs font-bold text-ink-500 uppercase tracking-wider">
                Total
              </p>
              <p className="text-lg lg:text-2xl font-black text-ink-900">
                {formatCurrency(totalVentas)}
              </p>
            </div>
          </div>
        </div>

        {/* Leyenda con porcentajes */}
        <div className="space-y-2">
          {dataConPorcentaje.map((c, i) => (
            <div
              key={c.categoria}
              className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-ink-50 transition"
            >
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ background: COLORES_GRAFICOS[i % COLORES_GRAFICOS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">
                  {c.emoji} {c.categoria}
                </p>
                <p className="text-[11px] text-ink-500">
                  {c.cantidad} {c.cantidad === 1 ? 'unidad' : 'unidades'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-ink-900">
                  {c.porcentaje.toFixed(1)}%
                </p>
                <p className="text-[10px] text-ink-500">
                  {formatCurrency(c.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

