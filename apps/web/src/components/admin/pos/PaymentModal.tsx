import { useState } from 'react'
import {
  Banknote, CreditCard, Building2, Split, Check,
  Calculator, Receipt,
} from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { formatCurrency, cn } from '@/lib/utils'
import type { MetodoPagoPOS } from '@/features/pos/posStore'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (metodo: MetodoPagoPOS, recibido: number) => void
  total: number
}

const METODOS: {
  value: MetodoPagoPOS
  icon: React.ComponentType<{ className?: string }>
  label: string
  desc: string
}[] = [
  { value: 'efectivo', icon: Banknote, label: 'Efectivo', desc: 'Pago en metálico' },
  { value: 'tarjeta', icon: CreditCard, label: 'Tarjeta', desc: 'Débito o crédito' },
  { value: 'transferencia', icon: Building2, label: 'Transferencia', desc: 'Pago bancario' },
  { value: 'mixto', icon: Split, label: 'Pago mixto', desc: 'Combinar métodos' },
]

export function PaymentModal({ open, onClose, onConfirm, total }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Cobrar"
      subtitle="Selecciona el método de pago"
    >
      <PaymentForm key={open ? 'payment-open' : 'payment-closed'} onClose={onClose} onConfirm={onConfirm} total={total} />
    </Modal>
  )
}

function PaymentForm({
  onClose,
  onConfirm,
  total,
}: {
  onClose: () => void
  onConfirm: (metodo: MetodoPagoPOS, recibido: number) => void
  total: number
}) {
  const [metodo, setMetodo] = useState<MetodoPagoPOS>('efectivo')
  const [recibido, setRecibido] = useState<number>(0)
  const [error, setError] = useState('')

  const cambio = Math.max(0, recibido - total)
  const insuficiente = metodo === 'efectivo' && recibido > 0 && recibido < total

  const sugerencias = [
    total,
    Math.ceil(total / 5) * 5,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 50) * 50,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total)

  const handleConfirm = () => {
    setError('')
    if (metodo === 'efectivo' && recibido < total) {
      setError('El efectivo recibido es insuficiente')
      return
    }
    onConfirm(metodo, recibido || total)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-ink-900 text-white p-6 text-center">
        <p className="text-sm text-ink-300">Total a cobrar</p>
        <p className="mt-1 text-4xl font-black text-yunque-500">
          {formatCurrency(total)}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-ink-700 mb-3">
          Método de pago
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {METODOS.map(({ value, icon: Icon, label }) => {
            const selected = metodo === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMetodo(value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition',
                  selected
                    ? 'border-yunque-500 bg-yunque-50'
                    : 'border-ink-200 hover:border-ink-300 bg-white',
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6',
                    selected ? 'text-yunque-700' : 'text-ink-400',
                  )}
                />
                <span
                  className={cn(
                    'text-sm font-semibold',
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

      {metodo === 'efectivo' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Efectivo recibido
            </label>
            <div className="relative">
              <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="number"
                step="0.01"
                value={recibido || ''}
                onChange={(e) => setRecibido(Number(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-3 rounded-lg border border-ink-200 bg-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-yunque-400"
                autoFocus
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {sugerencias.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRecibido(v)}
                className="px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm font-bold hover:border-yunque-400 hover:bg-yunque-50 transition"
              >
                {formatCurrency(v)}
              </button>
            ))}
          </div>

          {recibido > 0 && (
            <div
              className={cn(
                'rounded-lg p-4 flex items-center justify-between',
                insuficiente
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200',
              )}
            >
              <span className="text-sm font-medium text-ink-700">
                {insuficiente ? 'Falta' : 'Cambio'}
              </span>
              <span
                className={cn(
                  'text-2xl font-black',
                  insuficiente ? 'text-red-600' : 'text-green-700',
                )}
              >
                {formatCurrency(insuficiente ? total - recibido : cambio)}
              </span>
            </div>
          )}
        </div>
      )}

      {(metodo === 'tarjeta' || metodo === 'transferencia') && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
          <Receipt className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold">
              {metodo === 'tarjeta'
                ? 'Pago con tarjeta'
                : 'Pago por transferencia'}
            </p>
            <p className="mt-1 text-blue-700">
              {metodo === 'tarjeta'
                ? 'Pasa la tarjeta por el datáfono y confirma el cobro.'
                : 'Muestra los datos bancarios al cliente y confirma al recibir el pago.'}
            </p>
          </div>
        </div>
      )}

      {metodo === 'mixto' && (
        <div className="rounded-lg border border-yunque-200 bg-yunque-50 p-4 text-sm text-ink-700">
          <p className="font-semibold text-ink-900">Pago mixto</p>
          <p className="mt-1">
            Se dividirá el pago entre efectivo y tarjeta. Se registrarán ambos
            importes en el movimiento.
          </p>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} disabled={insuficiente}>
          <Check className="h-4 w-4 mr-2" />
          Confirmar cobro
        </Button>
      </div>
    </div>
  )
}