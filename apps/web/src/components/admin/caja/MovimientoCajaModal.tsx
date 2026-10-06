import { useState, useEffect } from 'react'
import { PackageMinus, PackagePlus, Receipt } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/lib/utils'
import {
  useCajaStore,
  type TipoMovimientoCaja,
} from '@/features/caja/cajaStore'
import { useAuthStore } from '@/store/authStore'

type TipoManual = 'retiro' | 'ingreso' | 'gasto'

const TIPOS: {
  value: TipoManual
  icon: React.ComponentType<{ className?: string }>
  label: string
  desc: string
}[] = [
  { value: 'ingreso', icon: PackagePlus,  label: 'Ingreso', desc: 'Anadir efectivo a caja' },
  { value: 'retiro',  icon: PackageMinus, label: 'Retiro',  desc: 'Sacar efectivo de caja' },
  { value: 'gasto',   icon: Receipt,      label: 'Gasto',   desc: 'Pago de gasto con efectivo' },
]

interface Props {
  open: boolean
  onClose: () => void
  turnoId: string
}

export function MovimientoCajaModal({ open, onClose, turnoId }: Props) {
  const registrar = useCajaStore((s) => s.registrarMovimiento)
  const user = useAuthStore((s) => s.user)

  const [tipo, setTipo] = useState<TipoManual>('ingreso')
  const [concepto, setConcepto] = useState('')
  const [monto, setMonto] = useState<number>(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setTipo('ingreso')
      setConcepto('')
      setMonto(0)
      setError('')
    }
  }, [open])

  const handleSubmit = () => {
    setError('')
    if (!concepto.trim()) {
      setError('El concepto es obligatorio')
      return
    }
    if (monto <= 0) {
      setError('El monto debe ser mayor que 0')
      return
    }

    try {
      registrar({
        turnoId,
        tipo: tipo as TipoMovimientoCaja,
        concepto: concepto.trim(),
        monto,
        usuario: user?.nombre ?? 'Sistema',
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar movimiento"
      subtitle="Ingreso, retiro o gasto de efectivo"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Registrar</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-ink-700 mb-3">Tipo de movimiento</p>
          <div className="grid grid-cols-3 gap-2">
            {TIPOS.map(({ value, icon: Icon, label }) => {
              const selected = tipo === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTipo(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition',
                    selected
                      ? 'border-yunque-500 bg-yunque-50'
                      : 'border-ink-200 hover:border-ink-300 bg-white',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      selected ? 'text-yunque-700' : 'text-ink-400',
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-bold',
                      selected ? 'text-ink-900' : 'text-ink-600',
                    )}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Concepto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            placeholder={
              tipo === 'ingreso'
                ? 'Ej: Cambio desde caja fuerte'
                : tipo === 'retiro'
                  ? 'Ej: Retiro a banco'
                  : 'Ej: Compra de bolsas'
            }
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Monto
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monto || ''}
            onChange={(e) => setMonto(Number(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-yunque-400"
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </Modal>
  )
}
