import { useState } from 'react'
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
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* ---------- Breadcrumb ---------- */}
        <nav className="flex items-center gap-1 text-sm text-ink-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-ink-900">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/productos" className="hover:text-ink-900">Catálogo</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {categoria && (
            <>
              <Link
                to={`/productos?cat=${categoria.slug}`}
                className="hover:text-ink-900"
              >
                {categoria.nombre}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-ink-900 font-medium truncate">
            {producto.nombre}
          </span>
        </nav>

        {/* ---------- Grid principal ---------- */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* ============ Galería ============ */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-100 border border-ink-200">
              <img
                src={producto.imagenes[imagenActiva]}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />

              {tienePromo && (
                <span className="absolute top-4 left-4 rounded-full bg-red-500 text-white text-sm font-bold px-3 py-1.5">
                  -{descuento}%
                </span>
              )}
              {producto.nuevo && (
                <span className="absolute top-4 right-4 rounded-full bg-ink-900 text-white text-xs font-bold px-3 py-1.5">
                  NUEVO
                </span>
              )}

              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  className="h-10 w-10 grid place-items-center rounded-full bg-white shadow hover:bg-ink-100 transition"
                  title="Añadir a favoritos"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  className="h-10 w-10 grid place-items-center rounded-full bg-white shadow hover:bg-ink-100 transition"
                  title="Compartir"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {producto.imagenes.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
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
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ============ Info ============ */}
          <div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-bold text-yunque-700 uppercase tracking-wide">
                {producto.marca}
              </span>
              <span className="text-ink-400">·</span>
              <span className="text-ink-500">SKU: {producto.sku}</span>
            </div>

            <h1 className="mt-2 text-3xl md:text-4xl font-black text-ink-900 leading-tight">
              {producto.nombre}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i <= Math.round(producto.rating)
                        ? 'fill-yunque-500 text-yunque-500'
                        : 'text-ink-300',
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-ink-900">
                {producto.rating.toFixed(1)}
              </span>
              <span className="text-ink-500">
                ({producto.reviews} valoraciones)
              </span>
            </div>

            {/* Precio */}
            <div className="mt-5 flex items-end gap-3 flex-wrap">
              <span className="text-4xl font-black text-ink-900">
                {formatCurrency(precioFinal)}
              </span>
              {tienePromo && (
                <>
                  <span className="text-xl text-ink-400 line-through">
                    {formatCurrency(producto.precio)}
                  </span>
                  <span className="rounded-full bg-red-100 text-red-700 text-xs font-bold px-2 py-1">
                    Ahorras {formatCurrency(producto.precio - producto.precioPromo!)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-500">IVA incluido</p>

            {/* Descripción corta */}
            <p className="mt-5 text-ink-600 leading-relaxed">
              {producto.descripcion}
            </p>

            {/* Stock */}
            <div className="mt-5 flex items-center gap-2 text-sm">
              {agotado ? (
                <span className="inline-flex items-center gap-2 text-red-600 font-medium">
                  <PackageX className="h-4 w-4" />
                  Sin stock
                </span>
              ) : stockBajo ? (
                <span className="inline-flex items-center gap-2 text-orange-600 font-medium">
                  <Info className="h-4 w-4" />
                  ¡Solo quedan {producto.stock} unidades!
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-green-700 font-medium">
                  <Check className="h-4 w-4" />
                  En stock ({producto.stock} disponibles)
                </span>
              )}
            </div>

            {/* Cantidad + Añadir */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center rounded-lg border border-ink-200 bg-white">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={cantidad <= 1 || agotado}
                  className="h-12 w-12 grid place-items-center hover:bg-ink-100 rounded-l-lg transition disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-base font-semibold">
                  {cantidad}
                </span>
                <button
                  onClick={() =>
                    setCantidad((c) => Math.min(producto.stock, c + 1))
                  }
                  disabled={cantidad >= producto.stock || agotado}
                  className="h-12 w-12 grid place-items-center hover:bg-ink-100 rounded-r-lg transition disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={agotado}
                size="lg"
                className="flex-1 min-w-[220px]"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {agotado ? 'Sin stock' : 'Añadir al carrito'}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <TrustBadge icon={Truck} title="Envío rápido" subtitle="24-48 h" />
              <TrustBadge
                icon={RotateCcw}
                title="Devolución"
                subtitle="30 días"
              />
              <TrustBadge
                icon={ShieldCheck}
                title="Garantía"
                subtitle="2 años"
              />
            </div>

            {/* Tabs */}
            <div className="mt-8 border-t border-ink-200 pt-6">
              <div className="flex gap-1 border-b border-ink-200 -mb-px overflow-x-auto">
                <TabButton active={tab === 'descripcion'} onClick={() => setTab('descripcion')}>
                  Descripción
                </TabButton>
                <TabButton active={tab === 'especificaciones'} onClick={() => setTab('especificaciones')}>
                  Especificaciones
                </TabButton>
                <TabButton active={tab === 'envio'} onClick={() => setTab('envio')}>
                  Envío y devoluciones
                </TabButton>
              </div>

              <div className="pt-5 text-sm text-ink-600 leading-relaxed">
                {tab === 'descripcion' && (
                  <p>{producto.descripcionLarga}</p>
                )}

                {tab === 'especificaciones' && (
                  <dl className="divide-y divide-ink-100">
                    {producto.especificaciones.map((esp) => (
                      <div
                        key={esp.clave}
                        className="grid grid-cols-2 gap-4 py-3"
                      >
                        <dt className="text-ink-500">{esp.clave}</dt>
                        <dd className="font-medium text-ink-900">
                          {esp.valor}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {tab === 'envio' && (
                  <div className="space-y-3">
                    <p>
                      <strong className="text-ink-900">Envío estándar:</strong>{' '}
                      3-5 días laborables. Gratis a partir de 50€.
                    </p>
                    <p>
                      <strong className="text-ink-900">Envío express:</strong>{' '}
                      24-48h por 9,95€.
                    </p>
                    <p>
                      <strong className="text-ink-900">Recogida en tienda:</strong>{' '}
                      Disponible en 2 horas sin coste.
                    </p>
                    <p>
                      <strong className="text-ink-900">Devoluciones:</strong>{' '}
                      Tienes 30 días para devolver el producto sin coste.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Relacionados ---------- */}
        {relacionados.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-black text-ink-900">
                Productos relacionados
              </h2>
              <Link
                to={`/productos?cat=${producto.categoria}`}
                className="text-sm font-semibold text-yunque-700 hover:underline"
              >
                Ver más
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

// ---------- Subcomponentes ----------
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
    <div className="rounded-xl border border-ink-200 bg-white p-3 text-center">
      <Icon className="h-5 w-5 mx-auto text-yunque-600" />
      <p className="mt-2 text-xs font-bold text-ink-900">{title}</p>
      <p className="text-[11px] text-ink-500">{subtitle}</p>
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
        'px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition',
        active
          ? 'border-yunque-500 text-ink-900'
          : 'border-transparent text-ink-500 hover:text-ink-900',
      )}
    >
      {children}
    </button>
  )
}