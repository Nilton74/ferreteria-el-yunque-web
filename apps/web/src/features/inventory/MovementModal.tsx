import { useState } from 'react'
import {
  PackagePlus, PackageMinus, SlidersHorizontal, RotateCcw,
  AlertTriangle, ArrowRight,
} from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/lib/utils'
import {
  useMovementStore,
  TIPO_CONFIG,
  type TipoMovimiento,
} from '@/features/inventory/movementStore'
import type { ProductoAdmin } from '@/features/products/productStore'
import { useAuthStore } from '@/store/authStore'

const TIPOS: {
  value: TipoMovimiento
  icon: React.ComponentType<{ className?: string }>
  desc: string
}[] = [
  { value: 'entrada',    icon: PackagePlus,       desc: 'Recepción de mercancía o compra' },
  { value: 'salida',     icon: PackageMinus,      desc: 'Venta o salida de almacén' },
  { value: 'ajuste',     icon: SlidersHorizontal, desc: 'Corrección por inventario físico' },
  { value: 'devolucion', icon: RotateCcw,         desc: 'Devolución de cliente' },
  { value: 'merma',      icon: AlertTriangle,     desc: 'Producto dañado o perdido' },
]

interface Props {
  open: boolean
  onClose: () => void
  producto: ProductoAdmin | null
}

export function MovementModal({ open, onClose, producto }: Props) {
  if (!producto) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Registrar movimiento"
      subtitle={`${producto.sku} · ${producto.nombre}`}
    >
      <MovementForm key={`${producto.id}-${open ? 'open' : 'closed'}`} producto={producto} onClose={onClose} />
    </Modal>
  )
}

function MovementForm({
  producto,
  onClose,
}: {
  producto: ProductoAdmin
  onClose: () => void
}) {
  const registrar = useMovementStore((s) => s.registrar)
  const user = useAuthStore((s) => s.user)

  const [tipo, setTipo] = useState<TipoMovimiento>('entrada')
  const [cantidad, setCantidad] = useState<number>(0)
  const [motivo, setMotivo] = useState('')
  const [notas, setNotas] = useState('')
  const [error, setError] = useState('')

  const signo = TIPO_CONFIG[tipo].signo
  const nuevoStock =
    tipo === 'ajuste'
      ? cantidad
      : Math.max(0, producto.stock + signo * cantidad)
  const esAjuste = tipo === 'ajuste'

  const handleSubmit = () => {
    setError('')
    if (!motivo.trim()) {
      setError('El motivo es obligatorio')
      return
    }
    if (cantidad <= 0 && !esAjuste) {
      setError('La cantidad debe ser mayor que 0')
      return
    }
    if (esAjuste && cantidad < 0) {
      setError('El nuevo stock no puede ser negativo')
      return
    }

    try {
      registrar({
        productoId: producto.id,
        tipo,
        cantidad,
        motivo: motivo.trim(),
        notas: notas.trim() || undefined,
        usuario: user?.nombre ?? 'Sistema',
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar')
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stock actual */}
        <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">Stock actual</span>
            <span className="font-bold text-ink-900">{producto.stock} uds</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink-500">Nuevo stock</span>
            <span
              className={cn(
                'font-black',
                nuevoStock > producto.stock
                  ? 'text-green-600'
                  : nuevoStock < producto.stock
                    ? 'text-red-600'
                    : 'text-ink-900',
              )}
            >
              {nuevoStock} uds
            </span>
          </div>
          {nuevoStock !== producto.stock && (
            <div className="mt-2 flex items-center gap-2 text-xs text-ink-500">
              <span>{producto.stock}</span>
              <ArrowRight className="h-3 w-3" />
              <span className="font-semibold">{nuevoStock}</span>
            </div>
          )}
        </div>

        {/* Tipo */}
        <div>
          <p className="text-sm font-medium text-ink-700 mb-3">Tipo de movimiento</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {TIPOS.map(({ value, icon: Icon, desc }) => {
              const selected = tipo === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTipo(value)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border-2 p-3 text-left transition',
                    selected
                      ? 'border-yunque-500 bg-yunque-50'
                      : 'border-ink-200 hover:border-ink-300 bg-white',
                  )}
                >
                  <div
                    className={cn(
                      'h-9 w-9 shrink-0 grid place-items-center rounded-lg',
                      selected
                        ? 'bg-yunque-500 text-ink-900'
                        : 'bg-ink-100 text-ink-500',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">
                      {TIPO_CONFIG[value].label}
                    </p>
                    <p className="text-xs text-ink-500 leading-tight">{desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Cantidad */}
        <Input
          label={esAjuste ? 'Nuevo stock (ajuste)' : 'Cantidad'}
          type="number"
          min={0}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value) || 0)}
          placeholder="0"
        />

        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Motivo <span className="text-red-500">*</span>
          </label>
          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
          >
            <option value="">— Selecciona un motivo —</option>
            {tipo === 'entrada' && (
              <>
                <option value="Compra a proveedor">Compra a proveedor</option>
                <option value="Devolución de cliente">Devolución de cliente</option>
                <option value="Ajuste positivo">Ajuste positivo</option>
                <option value="Reingreso">Reingreso</option>
              </>
            )}
            {tipo === 'salida' && (
              <>
                <option value="Venta mostrador">Venta mostrador</option>
                <option value="Traspaso a sucursal">Traspaso a sucursal</option>
                <option value="Uso interno">Uso interno</option>
              </>
            )}
            {tipo === 'ajuste' && (
              <>
                <option value="Inventario físico">Inventario físico</option>
                <option value="Corrección de error">Corrección de error</option>
              </>
            )}
            {tipo === 'devolucion' && (
              <>
                <option value="Devolución por defecto">Devolución por defecto</option>
                <option value="Devolución garantía">Devolución garantía</option>
              </>
            )}
            {tipo === 'merma' && (
              <>
                <option value="Producto dañado">Producto dañado</option>
                <option value="Producto vencido">Producto vencido</option>
                <option value="Pérdida">Pérdida</option>
                <option value="Robo">Robo</option>
              </>
            )}
            <option value="Otro">Otro (especificar en notas)</option>
          </select>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Notas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            placeholder="Detalles adicionales…"
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Registrar movimiento</Button>
      </div>
    </>
  )
}