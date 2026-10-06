import { useState, useEffect } from 'react'
import { Calculator, Check, TrendingDown, TrendingUp, Equal } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useCajaStore } from '@/features/caja/cajaStore'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  turnoId: string
}

export function CerrarCajaModal({ open, onClose, turnoId }: Props) {
  const calcularTotales = useCajaStore((s) => s.calcularTotales)
  const cerrarTurno = useCajaStore((s) => s.cerrarTurno)
  const user = useAuthStore((s) => s.user)

  const [contado, setContado] = useState<number>(0)
  const [notas, setNotas] = useState('')
  const [error, setError] = useState('')

  const totales = calcularTotales(turnoId)
  const diferencia = contado - totales.efectivoEsperado
  const cuadra = Math.abs(diferencia) < 0.01

  useEffect(() => {
    if (open) {
      setContado(0)
      setNotas('')
      setError('')
    }
  }, [open])

  const handleSubmit = () => {
    setError('')
    if (contado < 0) {
      setError('El efectivo contado no puede ser negativo')
      return
    }
    try {
      cerrarTurno({
        turnoId,
        efectivoContado: contado,
        usuario: user?.nombre ?? 'Sistema',
        notas: notas.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar caja')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cerrar caja"
      subtitle="Realiza el arqueo y confirma el cierre del turno"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Check className="h-4 w-4 mr-1.5" />
            Cerrar turno
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <section className="rounded-xl border border-ink-200 bg-ink-50/60 p-4">
          <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-3">
            Resumen del turno
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Row
              label="Ventas efectivo"
              value={formatCurrency(totales.ventasEfectivo)}
            />
            <Row
              label="Ventas tarjeta"
              value={formatCurrency(totales.ventasTarjeta)}
            />
            <Row
              label="Ventas transferencia"
              value={formatCurrency(totales.ventasTransferencia)}
            />
            <Row label="Ingresos" value={'+' + formatCurrency(totales.ingresos)} />
            <Row label="Retiros" value={'-' + formatCurrency(totales.retiros)} />
            <Row label="Gastos" value={'-' + formatCurrency(totales.gastos)} />
          </div>
        </section>

        <section className="rounded-xl border-2 border-yunque-400 bg-yunque-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-yunque-800 uppercase tracking-wider">
                Efectivo esperado en caja
              </p>
              <p className="text-xs text-yunque-700 mt-0.5">Segun el sistema</p>
            </div>
            <p className="text-3xl font-black text-yunque-900">
              {formatCurrency(totales.efectivoEsperado)}
            </p>
          </div>
        </section>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Efectivo contado <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={contado || ''}
              onChange={(e) => setContado(Number(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full pl-11 pr-3 py-3 rounded-lg border border-ink-200 bg-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-yunque-400"
              autoFocus
            />
          </div>
          <p className="mt-1 text-xs text-ink-500">
            Cuenta el efectivo fisico en caja e introducelo aqui
          </p>
        </div>

        {contado > 0 && (
          <div
            className={cn(
              'rounded-xl border-2 p-4',
              cuadra
                ? 'border-green-300 bg-green-50'
                : diferencia > 0
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-red-300 bg-red-50',
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-10 w-10 rounded-full grid place-items-center',
                  cuadra
                    ? 'bg-green-100 text-green-700'
                    : diferencia > 0
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700',
                )}
              >
                {cuadra ? (
                  <Equal className="h-5 w-5" />
                ) : diferencia > 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-bold',
                    cuadra
                      ? 'text-green-800'
                      : diferencia > 0
                        ? 'text-blue-800'
                        : 'text-red-800',
                  )}
                >
                  {cuadra
                    ? 'Cuadra perfecto'
                    : diferencia > 0
                      ? 'Sobrante'
                      : 'Faltante'}
                </p>
                <p
                  className={cn(
                    'text-xs',
                    cuadra
                      ? 'text-green-700'
                      : diferencia > 0
                        ? 'text-blue-700'
                        : 'text-red-700',
                  )}
                >
                  {cuadra
                    ? 'El efectivo contado coincide con el sistema'
                    : 'Diferencia de ' + formatCurrency(Math.abs(diferencia))}
                </p>
              </div>
              <p
                className={cn(
                  'text-2xl font-black',
                  cuadra
                    ? 'text-green-700'
                    : diferencia > 0
                      ? 'text-blue-700'
                      : 'text-red-700',
                )}
              >
                {(diferencia > 0 ? '+' : '') + formatCurrency(diferencia)}
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Notas del cierre (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            placeholder="Observaciones, incidencias..."
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </Modal>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  )
}
