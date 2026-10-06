import { cn } from '@/lib/utils'
import { SEGMENTOS, type Segmento } from '@/features/clientes/clientStore'

const COLORES: Record<string, string> = {
  yunque:  'bg-yunque-100 text-yunque-800 border-yunque-200',
  green:   'bg-green-100 text-green-800 border-green-200',
  blue:    'bg-blue-100 text-blue-800 border-blue-200',
  red:     'bg-red-100 text-red-700 border-red-200',
  neutral: 'bg-ink-100 text-ink-700 border-ink-200',
}

export function SegmentBadge({
  segmento,
  size = 'md',
}: {
  segmento: Segmento
  size?: 'sm' | 'md'
}) {
  const cfg = SEGMENTOS[segmento]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold border whitespace-nowrap',
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