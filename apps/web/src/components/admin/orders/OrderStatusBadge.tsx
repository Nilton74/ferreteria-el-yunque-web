import { cn } from '@/lib/utils'
import { ESTADOS, type EstadoPedido } from '@/features/orders/mockOrders'

const COLORES: Record<string, string> = {
  yellow:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  blue:    'bg-blue-100 text-blue-800 border-blue-200',
  green:   'bg-green-100 text-green-800 border-green-200',
  purple:  'bg-purple-100 text-purple-800 border-purple-200',
  indigo:  'bg-indigo-100 text-indigo-800 border-indigo-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  red:     'bg-red-100 text-red-700 border-red-200',
}

export function OrderStatusBadge({
  estado,
  size = 'md',
}: {
  estado: EstadoPedido
  size?: 'sm' | 'md'
}) {
  const cfg = ESTADOS[estado]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold border whitespace-nowrap',
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        size === 'md' && 'px-2.5 py-1 text-xs',
        COLORES[cfg.color],
      )}
    >
      <span>{cfg.emoji}</span>
      {cfg.label}
    </span>
  )
}