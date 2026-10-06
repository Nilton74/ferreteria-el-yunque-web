import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          {...props}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm transition',
            'focus:outline-none focus:ring-2 focus:ring-yunque-400 focus:border-transparent',
            error
              ? 'border-red-400 bg-red-50'
              : 'border-ink-200 bg-white hover:border-ink-300',
            className,
          )}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'