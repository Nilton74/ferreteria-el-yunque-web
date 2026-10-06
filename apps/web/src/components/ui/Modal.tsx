import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: Props) {
  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 grid place-items-center p-4 overflow-y-auto">
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'w-full bg-white rounded-2xl shadow-2xl my-8',
            size === 'sm' && 'max-w-md',
            size === 'md' && 'max-w-2xl',
            size === 'lg' && 'max-w-4xl',
            size === 'xl' && 'max-w-6xl',
          )}
        >
          <div className="flex items-start justify-between p-6 border-b border-ink-200">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-ink-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-900 shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">{children}</div>

          {footer && (
            <div className="px-6 py-4 border-t border-ink-200 bg-ink-50/60 rounded-b-2xl flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )
}