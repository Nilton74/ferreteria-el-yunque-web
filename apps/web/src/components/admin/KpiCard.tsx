import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string
  change?: number
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
}

export function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor = 'text-yunque-600',
}: Props) {
  const positivo = change !== undefined && change >= 0

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'h-11 w-11 grid place-items-center rounded-xl bg-yunque-50',
            iconColor,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {change !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold',
              positivo
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700',
            )}
          >
            {positivo ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {positivo ? '+' : ''}
            {change}%
          </span>
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink-900">{value}</p>
    </div>
  )
}