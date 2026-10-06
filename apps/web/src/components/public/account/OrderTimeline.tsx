import { cn } from '@/lib/utils'
import {
  ESTADOS,
  FLUJO_ESTADOS,
  type Pedido,
} from '@/features/orders/mockOrders'

interface Props {
  pedido: Pedido
  compact?: boolean
}

export function OrderTimeline({ pedido, compact = false }: Props) {
  // Estados cancelados tienen un tratamiento distinto
  if (pedido.estado === 'cancelado') {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-red-100 grid place-items-center text-xl">
          ✗
        </div>
        <div>
          <p className="font-bold text-red-800">Pedido cancelado</p>
          <p className="text-xs text-red-700">
            Este pedido fue cancelado. Contacta con soporte si tienes dudas.
          </p>
        </div>
      </div>
    )
  }

  const idxActual = FLUJO_ESTADOS.indexOf(pedido.estado)

  return (
    <div className={cn('flex', compact ? 'gap-1' : 'gap-2')}>
      {FLUJO_ESTADOS.map((estado, i) => {
        const hecho = i <= idxActual
        const activo = i === idxActual
        const cfg = ESTADOS[estado]
        const evento = pedido.historial.find((h) => h.estado === estado)
        const fecha = evento
          ? new Date(evento.fecha).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
            })
          : null

        return (
          <div key={estado} className="flex-1 min-w-0">
            <div className="flex items-center">
              <div
                className={cn(
                  'rounded-full grid place-items-center shrink-0 transition-all',
                  compact ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm',
                  hecho
                    ? activo
                      ? 'bg-yunque-500 text-ink-900 ring-4 ring-yunque-200'
                      : 'bg-yunque-500 text-ink-900'
                    : 'bg-ink-200 text-ink-400',
                )}
              >
                {hecho ? cfg.emoji : i + 1}
              </div>
              {i < FLUJO_ESTADOS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 ml-1',
                    i < idxActual ? 'bg-yunque-500' : 'bg-ink-200',
                  )}
                />
              )}
            </div>
            {!compact && (
              <div className="mt-2">
                <p
                  className={cn(
                    'text-xs font-bold',
                    activo ? 'text-ink-900' : 'text-ink-500',
                  )}
                >
                  {cfg.label}
                </p>
                {fecha && <p className="text-[10px] text-ink-400">{fecha}</p>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}