import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { ProductoVendido } from '@/features/reports/reportsData'

export function TopProductsTable({ data }: { data: ProductoVendido[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink-900 mb-1">Top productos</h3>
        <p className="text-sm text-ink-500">Sin ventas en este período</p>
      </div>
    )
  }

  const max = Math.max(...data.map((p) => p.ingresos))

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-ink-900">Top productos</h3>
          <p className="text-sm text-ink-500">Por ingresos generados</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((p, i) => (
          <div key={p.productoId} className="flex items-center gap-3">
            <span className="text-xs font-bold text-ink-400 w-5 text-center">
              #{i + 1}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-900 line-clamp-1">
                {p.nombre}
              </p>
              <p className="text-[11px] text-ink-500 font-mono mt-0.5">
                {p.sku} · {p.categoria}
              </p>
              <div className="mt-1.5 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                <div
                  className="h-full bg-yunque-500 rounded-full transition-all"
                  style={{ width: `${(p.ingresos / max) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-right shrink-0 ml-2">
              <p className="text-sm font-bold text-ink-900">
                {formatCurrency(p.ingresos)}
              </p>
              <p className="text-xs text-ink-500">
                {p.cantidad} {p.cantidad === 1 ? 'ud' : 'uds'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/admin/productos"
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-yunque-700 hover:underline"
      >
        <TrendingUp className="h-4 w-4" />
        Ver todos los productos
      </Link>
    </div>
  )
}