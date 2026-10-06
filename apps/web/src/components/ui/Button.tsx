import { cn } from '@/lib/utils'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variant === 'primary' && 'bg-yunque-500 text-ink-900 hover:bg-yunque-400',
        variant === 'secondary' && 'bg-ink-900 text-white hover:bg-ink-800',
        variant === 'ghost' && 'hover:bg-ink-100 text-ink-700',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-500',
        className,
      )}
    />
  )
}
