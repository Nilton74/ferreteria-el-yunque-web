import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Producto } from '@/features/products/mockProducts'

export function FeaturedCarousel({ productos }: { productos: Producto[] }) {
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return
    const amount = ref.current.clientWidth * 0.8
    ref.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {/* Botones de navegación (solo desktop) */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:grid absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center rounded-full bg-white shadow-lg border border-ink-200 hover:bg-yunque-50 hover:border-yunque-400 transition -ml-4"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5 text-ink-700" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="hidden md:grid absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center rounded-full bg-white shadow-lg border border-ink-200 hover:bg-yunque-50 hover:border-yunque-400 transition -mr-4"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5 text-ink-700" />
      </button>

      {/* Scroll horizontal */}
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {productos.map((p) => (
          <div key={p.id} className="min-w-[220px] max-w-[220px] shrink-0 snap-start">
            <ProductCard producto={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
