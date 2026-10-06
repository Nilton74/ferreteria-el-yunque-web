import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIAS, MARCAS } from '@/features/products/mockProducts'
import type { Filtros } from '@/features/products/filters'

interface Props {
  filtros: Filtros
  onChange: (f: Filtros) => void
  precioRango: [number, number]
  onClose?: () => void
}

export function FilterSidebar({ filtros, onChange, precioRango, onClose }: Props) {
  const [minAbs, maxAbs] = precioRango

  const toggleCategoria = (slug: string) => {
    const set = new Set(filtros.categorias)
    if (set.has(slug)) {
      set.delete(slug)
    } else {
      set.add(slug)
    }
    onChange({ ...filtros, categorias: Array.from(set) })
  }

  const toggleMarca = (marca: string) => {
    const set = new Set(filtros.marcas)
    if (set.has(marca)) {
      set.delete(marca)
    } else {
      set.add(marca)
    }
    onChange({ ...filtros, marcas: Array.from(set) })
  }

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-bold">Filtros</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Categorías */}
      <section>
        <h3 className="text-sm font-bold text-ink-900 mb-3 uppercase tracking-wide">
          Categoría
        </h3>
        <div className="space-y-2">
          {CATEGORIAS.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 cursor-pointer text-sm hover:text-ink-900"
            >
              <input
                type="checkbox"
                checked={filtros.categorias.includes(c.slug)}
                onChange={() => toggleCategoria(c.slug)}
                className="rounded border-ink-300 text-yunque-500 focus:ring-yunque-400"
              />
              <span className="flex-1 text-ink-700">
                {c.emoji} {c.nombre}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Marcas */}
      <section className="pt-6 border-t border-ink-200">
        <h3 className="text-sm font-bold text-ink-900 mb-3 uppercase tracking-wide">
          Marca
        </h3>
        <div className="space-y-2">
          {MARCAS.map((m) => (
            <label
              key={m}
              className="flex items-center gap-2 cursor-pointer text-sm hover:text-ink-900"
            >
              <input
                type="checkbox"
                checked={filtros.marcas.includes(m)}
                onChange={() => toggleMarca(m)}
                className="rounded border-ink-300 text-yunque-500 focus:ring-yunque-400"
              />
              <span className="text-ink-700">{m}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Precio */}
      <section className="pt-6 border-t border-ink-200">
        <h3 className="text-sm font-bold text-ink-900 mb-3 uppercase tracking-wide">
          Precio
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            min={minAbs}
            max={filtros.precioMax}
            value={filtros.precioMin}
            onChange={(e) =>
              onChange({
                ...filtros,
                precioMin: Math.max(minAbs, Number(e.target.value) || minAbs),
              })
            }
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            placeholder="Min"
          />
          <span className="text-ink-400">—</span>
          <input
            type="number"
            min={filtros.precioMin}
            max={maxAbs}
            value={filtros.precioMax}
            onChange={(e) =>
              onChange({
                ...filtros,
                precioMax: Math.min(maxAbs, Number(e.target.value) || maxAbs),
              })
            }
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min={minAbs}
          max={maxAbs}
          value={filtros.precioMax}
          onChange={(e) =>
            onChange({
              ...filtros,
              precioMax: Math.max(filtros.precioMin, Number(e.target.value)),
            })
          }
          className="w-full accent-yunque-500"
        />
        <p className="mt-2 text-xs text-ink-500 text-center">
          Hasta <strong className="text-ink-900">{filtros.precioMax} €</strong>
        </p>
      </section>

      {/* Toggles */}
      <section className="pt-6 border-t border-ink-200 space-y-3">
        <ToggleRow
          label="Solo ofertas"
          checked={filtros.soloOfertas}
          onChange={(v) => onChange({ ...filtros, soloOfertas: v })}
        />
        <ToggleRow
          label="Solo disponibles"
          checked={filtros.soloDisponibles}
          onChange={(v) => onChange({ ...filtros, soloDisponibles: v })}
        />
      </section>
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-ink-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition',
          checked ? 'bg-yunque-500' : 'bg-ink-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  )
}