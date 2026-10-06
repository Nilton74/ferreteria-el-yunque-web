import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'
import type { KpiComparativo as KpiComparativoData } from '@/features/reports/reportsData'

interface KpiComparativoProps {
  label: string
  kpi: KpiComparativoData
  icon: LucideIcon
  format?: 'currency' | 'number'
}

function formatValue(value: number, format: 'currency' | 'number') {
  if (format === 'number') {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 0,
    }).format(value)
  }

  return formatCurrency(value)
}

export function KpiComparativo({
  label,
  kpi,
  icon: Icon,
  format = 'currency',
}: KpiComparativoProps) {
  const cambioPositivo = kpi.cambio >= 0
  const cambioAbsoluto = Math.abs(kpi.cambio)

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-500">{label}</p>
        </div>
        <div className="rounded-xl bg-ink-100 p-2 text-ink-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-black text-ink-900">
          {formatValue(kpi.actual, format)}
        </div>

        <div
          className={[
            'mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
            cambioPositivo
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700',
          ].join(' ')}
        >
          {cambioPositivo ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {cambioAbsoluto.toFixed(1)}%
        </div>
      </div>

      <p className="mt-3 text-xs text-ink-500">
        vs. {formatValue(kpi.anterior, format)} en el período anterior
      </p>
    </div>
  )
}
