import { cn } from '@/lib/utils'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'promo'

export function Badge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: Variant
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'warning' && 'bg-yellow-100 text-yellow-800',
        variant === 'danger' && 'bg-red-100 text-red-700',
        variant === 'info' && 'bg-blue-100 text-blue-800',
        variant === 'neutral' && 'bg-ink-100 text-ink-700',
        variant === 'promo' && 'bg-yunque-100 text-yunque-800',
        className,
      )}
    >
      {children}
    </span>
  )
}