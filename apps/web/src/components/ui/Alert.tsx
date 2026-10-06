import { cn } from '@/lib/utils'

export function Alert({
  variant = 'error',
  children,
}: {
  variant?: 'error' | 'success' | 'info'
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-lg px-3 py-2 text-sm font-medium',
        variant === 'error' && 'bg-red-50 text-red-700 border border-red-200',
        variant === 'success' &&
          'bg-green-50 text-green-700 border border-green-200',
        variant === 'info' && 'bg-blue-50 text-blue-700 border border-blue-200',
      )}
    >
      {children}
    </div>
  )
}