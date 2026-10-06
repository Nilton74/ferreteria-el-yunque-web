import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { STOCK_BAJO } from '@/features/dashboard/mockStats'

export function LowStockAlerts() {
  if (STOCK_BAJO.length === 0) return null

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 grid place-items-center rounded-lg bg-orange-100">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-ink-900">
            Alertas de stock
          </h3>
          <p className="text-xs text-ink-500">
            {STOCK_BAJO.length} productos con stock bajo
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {STOCK_BAJO.map((p) => {
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-lg bg-white border border-orange-200 p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 line-clamp-1">
                  {p.nombre}
                </p>
                <p className="text-xs text-ink-500 font-mono">{p.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-orange-600">
                  {p.stock} uds
                </p>
                <p className="text-[10px] text-ink-400">
                  mín. {p.stockMinimo}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <Link
        to="/admin/inventario"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:underline"
      >
        Ver inventario
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}