import { Modal } from './Modal'
import { Button } from './Button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  variant?: 'danger' | 'primary'
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  variant = 'danger',
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div
          className={
            'h-12 w-12 shrink-0 grid place-items-center rounded-full ' +
            (variant === 'danger' ? 'bg-red-100' : 'bg-yunque-100')
          }
        >
          <AlertTriangle
            className={
              'h-6 w-6 ' +
              (variant === 'danger' ? 'text-red-600' : 'text-yunque-700')
            }
          />
        </div>
        <p className="text-sm text-ink-600 leading-relaxed">{description}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}