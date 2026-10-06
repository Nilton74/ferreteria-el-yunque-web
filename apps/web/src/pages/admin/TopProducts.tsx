import { TOP_PRODUCTOS } from '@/features/dashboard/mockStats'
import { formatCurrency } from '@/lib/utils'

export function TopProducts() {
  const max = Math.max(...TOP_PRODUCTOS.map((p) => p.vendidos))

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-ink-900">Top productos</h3>
          <p className="text-sm text-ink-500">Más vendidos este mes</p>
        </div>
      </div>

      <div className="space-y-4">
        {TOP_PRODUCTOS.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-xs font-bold text-ink-400 w-4">
              #{i + 1}
            </span>
            <img
              src={p.imagen}
              alt={p.nombre}
              className="h-11 w-11 rounded-lg object-cover border border-ink-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-900 line-clamp-1">
                {p.nombre}
              </p>
              <div className="mt-1.5 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                <div
                  className="h-full bg-yunque-500 rounded-full transition-all"
                  style={{ width: `${(p.vendidos / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-ink-900">
                {formatCurrency(p.ingresos)}
              </p>
              <p className="text-xs text-ink-500">{p.vendidos} uds</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}