import { useState, useEffect } from 'react'
import { Calculator, AlertCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useCajaStore } from '@/features/caja/cajaStore'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

const SUGERENCIAS = [100, 200, 300, 500]

export function AbrirCajaModal({ open, onClose }: Props) {
  const abrirTurno = useCajaStore((s) => s.abrirTurno)
  const user = useAuthStore((s) => s.user)

  const [saldo, setSaldo] = useState<number>(0)
  const [notas, setNotas] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setSaldo(0)
      setNotas('')
      setError('')
    }
  }, [open])

  const handleSubmit = () => {
    setError('')
    if (saldo < 0) {
      setError('El saldo no puede ser negativo')
      return
    }
    try {
      abrirTurno({
        saldoInicial: saldo,
        usuario: user?.nombre ?? 'Sistema',
        notas: notas.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al abrir caja')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Abrir caja"
      subtitle="Introduce el efectivo que hay en caja al iniciar el turno"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Abrir turno</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-yunque-200 bg-yunque-50 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-yunque-700 shrink-0 mt-0.5" />
          <div className="text-sm text-yunque-900">
            <p className="font-semibold">Cuenta el efectivo antes de empezar</p>
            <p className="mt-1 text-yunque-800/80">
              Asegurate de contar los billetes y monedas. Este sera el saldo
              inicial del turno.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Saldo inicial
          </label>
          <div className="relative">
            <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={saldo || ''}
              onChange={(e) => setSaldo(Number(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full pl-11 pr-3 py-3 rounded-lg border border-ink-200 bg-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-yunque-400"
              autoFocus
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSaldo(s)}
                className="px-3 py-1.5 rounded-lg border border-ink-200 bg-white text-sm font-bold hover:border-yunque-400 hover:bg-yunque-50 transition"
              >
                {formatCurrency(s)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Notas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            placeholder="Observaciones del turno..."
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </Modal>
  )
}
