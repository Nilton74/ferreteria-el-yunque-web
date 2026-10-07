import { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  Minus, Plus, ShoppingCart, Heart, Share2, Star, Truck,
  ShieldCheck, RotateCcw, ChevronRight, Check, PackageX, Info,
} from 'lucide-react'

import { useCartStore } from '@/store/cartStore'
import { formatCurrency, cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/public/ProductCard'
import {
  getBySlug,
  getRelacionados,
  CATEGORIAS,
} from '@/features/products/mockProducts'

type Tab = 'descripcion' | 'especificaciones' | 'envio'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const producto = slug ? getBySlug(slug) : undefined

  const [cantidad, setCantidad] = useState(1)
  const [imagenActiva, setImagenActiva] = useState(0)
  const [tab, setTab] = useState<Tab>('descripcion')
  const add = useCartStore((s) => s.add)

  // Scroll al top al cambiar de producto
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [slug])

  if (!producto) return <Navigate to="/productos" replace />

  const categoria = CATEGORIAS.find((c) => c.slug === producto.categoria)
  const relacionados = getRelacionados(producto)
  const tienePromo = !!producto.precioPromo
  const descuento = tienePromo
    ? Math.round((1 - producto.precioPromo! / producto.precio) * 100)
    : 0
  const precioFinal = producto.precioPromo ?? producto.precio
  const stockBajo = producto.stock > 0 && producto.stock <= producto.stockMinimo
  const agotado = producto.stock === 0

  const handleAddToCart = () => {
    add(
      {
        id: producto.id,
        sku: producto.sku,
        nombre: producto.nombre,
        precio: precioFinal,
        imagen: producto.imagenes[0],
      },
      cantidad,
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs lg:text-sm text-ink-500 mb-3 lg:mb-5 flex-wrap">
          <Link to="/" className="hover:text-ink-900">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/productos" className="hover:text-ink-900">Catálogo</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {categoria && (
            <>
              <Link to={`/productos?cat=${categoria.slug}`} className="hover:text-ink-900">
                {categoria.nombre}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-ink-900 font-medium truncate">{producto.nombre}</span>
        </nav>

        {/* Grid principal: imagen 320px + info flexible */}
        <div className="grid md:grid-cols-[320px_1fr] gap-6 lg:gap-10">
          {/* ==================== Galería ==================== */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-100 border border-ink-200 w-full max-w-[320px] mx-auto md:mx-0">
              <img
                src={producto.imagenes[imagenActiva]}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
              {tienePromo && (
                <span className="absolute top-3 left-3 rounded-full bg-red-500 text-white text-xs font-bold px-2.5 py-1">
                  -{descuento}%
                </span>
              )}
              {producto.nuevo && (
                <span className="absolute top-3 right-3 rounded-full bg-ink-900 text-white text-[10px] font-bold px-2 py-1">
                  NUEVO
                </span>
              )}
              <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                <button
                  className="h-9 w-9 grid place-items-center rounded-full bg-white shadow hover:bg-ink-100 transition"
                  title="Favoritos"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  className="h-9 w-9 grid place-items-center rounded-full bg-white shadow hover:bg-ink-100 transition"
                  title="Compartir"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Miniaturas */}
            {producto.imagenes.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2 max-w-[320px] mx-auto md:mx-0">
                {producto.imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImagenActiva(i)}
                    className={cn(
                      'aspect-square rounded-lg overflow-hidden border-2 transition',
                      imagenActiva === i
                        ? 'border-yunque-500'
                        : 'border-ink-200 hover:border-ink-300',
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ==================== Info ==================== */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs lg:text-sm">
              <span className="font-bold text-yunque-700 uppercase tracking-wide">
                {producto.marca}
              </span>
              <span className="text-ink-400">·</span>
              <span className="text-ink-500">SKU: {producto.sku}</span>
            </div>

            <h1 className="mt-1.5 text-2xl lg:text-3xl font-black text-ink-900 leading-tight">
              {producto.nombre}
            </h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2 text-xs lg:text-sm">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5 lg:h-4 lg:w-4',
                      i <= Math.round(producto.rating)
                        ? 'fill-yunque-500 text-yunque-500'
                        : 'text-ink-300',
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-ink-900">{producto.rating.toFixed(1)}</span>
              <span className="text-ink-500">({producto.reviews})</span>
            </div>

            {/* Precio */}
            <div className="mt-3 flex items-end gap-2 flex-wrap">
              <span className="text-3xl lg:text-4xl font-black text-ink-900">
                {formatCurrency(precioFinal)}
              </span>
              {tienePromo && (
                <>
                  <span className="text-base lg:text-lg text-ink-400 line-through">
                    {formatCurrency(producto.precio)}
                  </span>
                  <span className="rounded-full bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5">
                    -{descuento}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-ink-500">IVA incluido</p>

            {/* Descripción corta */}
            <p className="mt-3 text-sm lg:text-base text-ink-600 leading-relaxed">
              {producto.descripcion}
            </p>

            {/* Stock */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              {agotado ? (
                <span className="inline-flex items-center gap-1.5 text-red-600 font-medium">
                  <PackageX className="h-4 w-4" /> Sin stock
                </span>
              ) : stockBajo ? (
                <span className="inline-flex items-center gap-1.5 text-orange-600 font-medium">
                  <Info className="h-4 w-4" /> ¡Solo quedan {producto.stock}!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
                  <Check className="h-4 w-4" /> En stock ({producto.stock} disponibles)
                </span>
              )}
            </div>

            {/* Cantidad + Añadir */}
            <div className="mt-4 flex flex-wrap gap-2 lg:gap-3">
              <div className="inline-flex items-center rounded-lg border border-ink-200 bg-white">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={cantidad <= 1 || agotado}
                  className="h-11 w-11 grid place-items-center hover:bg-ink-100 rounded-l-lg transition disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{cantidad}</span>
                <button
                  onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                  disabled={cantidad >= producto.stock || agotado}
                  className="h-11 w-11 grid place-items-center hover:bg-ink-100 rounded-r-lg transition disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={agotado}
                className="flex-1 min-w-[180px]"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {agotado ? 'Sin stock' : 'Añadir al carrito'}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <TrustBadge icon={Truck} title="Envío" subtitle="24-48h" />
              <TrustBadge icon={RotateCcw} title="Devolución" subtitle="30 días" />
              <TrustBadge icon={ShieldCheck} title="Garantía" subtitle="2 años" />
            </div>

            {/* Tabs */}
            <div className="mt-5 border-t border-ink-200 pt-4">
              <div className="flex gap-1 border-b border-ink-200 -mb-px overflow-x-auto">
                <TabButton active={tab === 'descripcion'} onClick={() => setTab('descripcion')}>
                  Descripción
                </TabButton>
                <TabButton active={tab === 'especificaciones'} onClick={() => setTab('especificaciones')}>
                  Especificaciones
                </TabButton>
                <TabButton active={tab === 'envio'} onClick={() => setTab('envio')}>
                  Envío
                </TabButton>
              </div>

              <div className="pt-4 text-sm text-ink-600 leading-relaxed">
                {tab === 'descripcion' && <p>{producto.descripcionLarga}</p>}

                {tab === 'especificaciones' && (
                  <dl className="divide-y divide-ink-100">
                    {producto.especificaciones.map((esp) => (
                      <div key={esp.clave} className="grid grid-cols-2 gap-4 py-2.5">
                        <dt className="text-ink-500">{esp.clave}</dt>
                        <dd className="font-medium text-ink-900">{esp.valor}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {tab === 'envio' && (
                  <div className="space-y-2">
                    <p><strong className="text-ink-900">Estándar:</strong> 3-5 días. Gratis +50€.</p>
                    <p><strong className="text-ink-900">Express:</strong> 24-48h por 9,95€.</p>
                    <p><strong className="text-ink-900">Recogida:</strong> Disponible en 2 horas.</p>
                    <p><strong className="text-ink-900">Devoluciones:</strong> 30 días sin coste.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== Relacionados ==================== */}
        {relacionados.length > 0 && (
          <section className="mt-10 lg:mt-14">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-black text-ink-900">
                Productos relacionados
              </h2>
              <Link
                to={`/productos?cat=${producto.categoria}`}
                className="text-sm font-semibold text-yunque-700 hover:underline"
              >
                Ver más
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {relacionados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ==================== Subcomponentes ====================

function TrustBadge({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
}) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-2.5 text-center">
      <Icon className="h-4 w-4 mx-auto text-yunque-600" />
      <p className="mt-1 text-[11px] font-bold text-ink-900">{title}</p>
      <p className="text-[10px] text-ink-500">{subtitle}</p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 lg:px-4 py-2.5 text-xs lg:text-sm font-semibold whitespace-nowrap border-b-2 transition',
        active
          ? 'border-yunque-500 text-ink-900'
          : 'border-transparent text-ink-500 hover:text-ink-900',
      )}
    >
      {children}
    </button>
  )
}