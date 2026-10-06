import { Link } from 'react-router-dom'
import {
  ArrowRight, MessageCircle, Truck, ShieldCheck, Headphones,
  Zap, Star, Quote, Wrench, Paintbrush, Hammer,
  Droplets, Package, Award, Sparkles, type LucideIcon,
} from 'lucide-react'
import { ProductCard } from '@/components/public/ProductCard'
import { FeaturedCarousel } from '@/components/public/FeaturedCarousel'
import {
  CATEGORIAS, MARCAS, getDestacados, getConPromo,
} from '@/features/products/mockProducts'

// Imágenes de categorías (Unsplash con crop consistente)
const CATEGORIA_IMGS: Record<string, string> = {
  herramientas:  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
  electricidad:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  plomeria:      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop',
  construccion:  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop',
  pinturas:      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop',
  tornilleria:   'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&h=400&fit=crop',
  seguridad:     'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop',
  jardineria:    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
  adhesivos:     'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?w=400&h=400&fit=crop',
  equipos:       'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
}

// Íconos por categoría (fallback)
const CATEGORIA_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  herramientas: Wrench,
  electricidad: Zap,
  plomeria: Droplets,
  construccion: Hammer,
  pinturas: Paintbrush,
  tornilleria: Hammer,
  seguridad: ShieldCheck,
  jardineria: Sparkles,
  adhesivos: Package,
  equipos: Wrench,
}

// Testimonios
const TESTIMONIOS = [
  {
    nombre: 'Carlos Ortega',
    rol: 'Contratista',
    texto: 'Excelente catálogo y envío rapidísimo. Ya he hecho 3 obras con material de aquí y siempre cumplen.',
    rating: 5,
    inicial: 'C',
    color: 'bg-yunque-500',
  },
  {
    nombre: 'Lucía Fernández',
    rol: 'Decoradora',
    texto: 'Los precios son competitivos y la atención al cliente por WhatsApp es de 10. Muy recomendable.',
    rating: 5,
    inicial: 'L',
    color: 'bg-blue-500',
  },
  {
    nombre: 'Miguel Torres',
    rol: 'Bricolaje',
    texto: 'Encontré justo lo que necesitaba para reformar el baño. La web es súper fácil de usar.',
    rating: 5,
    inicial: 'M',
    color: 'bg-green-500',
  },
]

// Consejos / blog
const CONSEJOS = [
  {
    titulo: 'Cómo elegir el taladro adecuado',
    categoria: 'Guía',
    tiempo: '5 min',
    img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop',
    emoji: '🔧',
  },
  {
    titulo: 'Diferencias entre cable rígido y flexible',
    categoria: 'Electricidad',
    tiempo: '4 min',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    emoji: '⚡',
  },
  {
    titulo: 'Guía de pinturas para interiores',
    categoria: 'Pintura',
    tiempo: '6 min',
    img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop',
    emoji: '🎨',
  },
]

export default function HomePage() {
  const destacados = getDestacados()
  const promos = getConPromo().slice(0, 4)
  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section className="relative bg-ink-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1600&h=900&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/90 to-ink-900/60" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-yunque-500/20 border border-yunque-500/40 text-yunque-400 text-xs font-bold px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-yunque-500 animate-pulse" />
              ENVÍO GRATIS +50€
            </span>

            <h1 className="mt-4 text-3xl md:text-4xl lg:text-[42px] font-black leading-[1.05] tracking-tight">
              Todo lo que necesitas
              <br />
              para <span className="text-yunque-500">construir</span>,
              <br />
              reparar y transformar.
            </h1>

            <p className="mt-4 text-base md:text-lg text-ink-300 max-w-lg">
              Herramientas profesionales, materiales de construcción,
              electricidad y más. Envío rápido y atención personalizada.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 rounded-lg bg-yunque-500 text-ink-900 px-5 py-2.5 font-semibold hover:bg-yunque-400 transition"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 text-white px-5 py-2.5 font-semibold hover:bg-white/10 transition backdrop-blur"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Feature icon={Truck} text="Envío rápido" />
              <Feature icon={ShieldCheck} text="Garantía 2 años" />
              <Feature icon={Headphones} text="Soporte 24/7" />
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="relative aspect-square max-w-sm ml-auto rounded-3xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop"
                alt="Taladro Bosch"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 rounded-full bg-red-500 text-white text-xs font-bold px-3 py-1.5">
                -23%
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 backdrop-blur p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-yunque-700">
                  Producto estrella
                </p>
                <p className="text-sm font-bold text-ink-900 mt-0.5 line-clamp-1">
                  Taladro Percutor Bosch 800W
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-black text-yunque-700">99,90 €</p>
                    <p className="text-xs text-ink-400 line-through">129,90 €</p>
                  </div>
                  <Link
                    to="/productos/taladro-percutor-bosch-800w"
                    className="text-xs font-bold text-yunque-700 hover:underline"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BARRA DE CONFIANZA ==================== */}
      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <TrustBadge icon={Truck} title="Envío gratis" subtitle="Pedidos +50€" />
          <TrustBadge icon={ShieldCheck} title="Pago seguro" subtitle="Cifrado SSL" />
          <TrustBadge icon={Award} title="Garantía" subtitle="2 años en todo" />
          <TrustBadge icon={Headphones} title="Soporte" subtitle="WhatsApp 24/7" />
        </div>
      </section>

      {/* ==================== CATEGORÍAS ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-ink-900">Categorías</h2>
            <p className="text-ink-500 mt-1 text-sm">Explora por tipo de producto</p>
          </div>
          <Link
            to="/productos"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-yunque-700 hover:underline"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIAS.slice(0, 10).map((cat) => {
            const Icon = CATEGORIA_ICONS[cat.slug] ?? Wrench
            const img = CATEGORIA_IMGS[cat.slug]
            return (
              <Link
                key={cat.id}
                to={`/productos?cat=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-ink-200 hover:border-yunque-400 hover:shadow-lg transition"
              >
                <img
                  src={img}
                  alt={cat.nombre}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1.5 text-white">
                    <Icon className="h-3.5 w-3.5 text-yunque-400" />
                    <p className="text-sm font-bold">{cat.nombre}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ==================== OFERTAS ==================== */}
      {promos.length > 0 && (
        <section className="bg-ink-900 text-white py-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500 text-white text-xs font-bold px-2.5 py-1">
                  <Zap className="h-3 w-3" />
                  OFERTAS
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-2">Promociones del mes</h2>
                <p className="text-ink-300 mt-1 text-sm">Aprovecha antes de que se agoten</p>
              </div>
              <Link
                to="/productos?promo=1"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-yunque-400 hover:underline"
              >
                Ver ofertas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {promos.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CARRUSEL DESTACADOS ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-ink-900">Los más vendidos</h2>
            <p className="text-ink-500 mt-1 text-sm">Los favoritos de nuestros clientes</p>
          </div>
          <Link
            to="/productos"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-yunque-700 hover:underline"
          >
            Ver más <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <FeaturedCarousel productos={destacados} />
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section className="bg-ink-100 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-ink-900">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-ink-500 mt-1 text-sm">
              Miles de profesionales confían en nosotros
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIOS.map((t) => (
              <div
                key={t.nombre}
                className="rounded-2xl border border-ink-200 bg-white p-5"
              >
                <Quote className="h-6 w-6 text-yunque-500 mb-3" />
                <p className="text-sm text-ink-700 leading-relaxed">
                  "{t.texto}"
                </p>
                <div className="mt-4 pt-4 border-t border-ink-100 flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full ${t.color} text-white grid place-items-center font-bold`}
                  >
                    {t.inicial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-900">{t.nombre}</p>
                    <p className="text-xs text-ink-500">{t.rol}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yunque-500 text-yunque-500" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CONSEJOS / BLOG ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-ink-900">
              Consejos y guías
            </h2>
            <p className="text-ink-500 mt-1 text-sm">Aprende antes de comprar</p>
          </div>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-yunque-700 hover:underline"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {CONSEJOS.map((c) => (
            <a
              key={c.titulo}
              href="#"
              className="group rounded-2xl border border-ink-200 bg-white overflow-hidden hover:border-yunque-400 hover:shadow-lg transition"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-yunque-100 text-yunque-800 font-bold px-2 py-0.5">
                    {c.emoji} {c.categoria}
                  </span>
                  <span className="text-ink-400">· {c.tiempo}</span>
                </div>
                <h3 className="mt-2 font-bold text-ink-900 group-hover:text-yunque-700 transition">
                  {c.titulo}
                </h3>
                <p className="mt-2 text-xs text-yunque-700 font-semibold inline-flex items-center gap-1">
                  Leer más <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ==================== MARCAS ==================== */}
      <section className="border-y border-ink-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-ink-400 mb-5">
            Trabajamos con las mejores marcas
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {MARCAS.map((m) => (
              <span
                key={m}
                className="text-xl md:text-2xl font-black text-ink-300 hover:text-ink-900 transition cursor-default"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-800 p-8 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div className="text-white">
            <span className="inline-flex items-center gap-1.5 text-yunque-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Newsletter
            </span>
            <h3 className="mt-2 text-2xl md:text-3xl font-black">
              Ofertas exclusivas en tu correo
            </h3>
            <p className="mt-2 text-ink-300 text-sm">
              Recibe un <strong className="text-yunque-400">10% de descuento</strong> en tu
              primera compra al suscribirte.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert('¡Gracias por suscribirte! Revisa tu email.')
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              placeholder="tucorreo@ejemplo.com"
              className="flex-1 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-ink-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yunque-500 backdrop-blur"
            />
            <button
              type="submit"
              className="rounded-lg bg-yunque-500 text-ink-900 px-5 py-3 font-bold hover:bg-yunque-400 transition shrink-0"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      {/* ==================== CTA WHATSAPP ==================== */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="rounded-3xl bg-gradient-to-br from-yunque-500 to-yunque-700 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-ink-900">
              ¿Necesitas asesoría?
            </h3>
            <p className="text-ink-800 mt-1.5 max-w-md text-sm md:text-base">
              Nuestro equipo te ayuda a elegir el producto adecuado para tu proyecto.
            </p>
          </div>
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-ink-900 text-white px-5 py-3 font-semibold hover:bg-ink-800 transition shrink-0"
          >
            <MessageCircle className="h-5 w-5" />
            Contactar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}

// ==================== Subcomponentes ====================

function Feature({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-300">
      <Icon className="h-4 w-4 text-yunque-500" />
      <span>{text}</span>
    </div>
  )
}

function TrustBadge({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-yunque-50 grid place-items-center shrink-0">
        <Icon className="h-5 w-5 text-yunque-700" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900 truncate">{title}</p>
        <p className="text-xs text-ink-500 truncate">{subtitle}</p>
      </div>
    </div>
  )
}

