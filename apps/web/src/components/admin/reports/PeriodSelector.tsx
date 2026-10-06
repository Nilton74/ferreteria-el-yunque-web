import { cn } from '@/lib/utils'
import type { Periodo } from '@/features/reports/reportsData'

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: 'hoy', label: 'Hoy' },
  { value: '7d',  label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: 'mes', label: 'Este mes' },
  { value: 'anio', label: 'Este año' },
]

export function PeriodSelector({
  value,
  onChange,
}: {
  value: Periodo
  onChange: (p: Periodo) => void
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-ink-200 bg-white p-1">
      {PERIODOS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-semibold transition',
            value === p.value
              ? 'bg-yunque-500 text-ink-900'
              : 'text-ink-600 hover:bg-ink-100',
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}