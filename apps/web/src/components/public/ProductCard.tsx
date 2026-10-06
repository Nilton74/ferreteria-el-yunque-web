import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import type { Producto } from '@/features/products/mockProducts'

export function ProductCard({ producto }: { producto: Producto }) {
  const add = useCartStore((s) => s.add)
  const tienePromo = !!producto.precioPromo
  const descuento = tienePromo
    ? Math.round((1 - producto.precioPromo! / producto.precio) * 100)
    : 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    add({
      id: producto.id,
      sku: producto.sku,
      nombre: producto.nombre,
      precio: producto.precioPromo ?? producto.precio,
      imagen: producto.imagenes[0],
    })
  }

  return (
    <Link
      to={`/productos/${producto.slug}`}
      className="group flex flex-col rounded-2xl border border-ink-200 bg-white overflow-hidden hover:border-yunque-400 hover:shadow-lg transition-all"
    >
      <div className="relative aspect-square bg-ink-100 overflow-hidden">
        <img
          src={producto.imagenes[0]}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {tienePromo && (
            <span className="rounded-full bg-red-500 text-white text-xs font-bold px-2 py-1">
              -{descuento}%
            </span>
          )}
          {producto.nuevo && (
            <span className="rounded-full bg-ink-900 text-white text-xs font-bold px-2 py-1">
              NUEVO
            </span>
          )}
          {producto.stock === 0 && (
            <span className="rounded-full bg-ink-400 text-white text-xs font-bold px-2 py-1">
              AGOTADO
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3">
        <p className="text-xs font-medium text-yunque-700 uppercase tracking-wide">
          {producto.marca}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-ink-900 line-clamp-2 min-h-[36px]">
          {producto.nombre}
        </h3>

        <div className="mt-3 flex items-end justify-between">
          <div>
            {tienePromo ? (
              <>
                <p className="text-xs text-ink-400 line-through">
                  {formatCurrency(producto.precio)}
                </p>
                <p className="text-xl font-black text-yunque-700">
                  {formatCurrency(producto.precioPromo!)}
                </p>
              </>
            ) : (
              <p className="text-xl font-black text-ink-900">
                {formatCurrency(producto.precio)}
              </p>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={producto.stock === 0}
            className="h-10 w-10 grid place-items-center rounded-lg bg-yunque-500 text-ink-900 hover:bg-yunque-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="AÃ±adir al carrito"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}
