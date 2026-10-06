import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft, Truck, Zap, Store, CreditCard, Banknote, Building2,
  ShieldCheck, Loader2,
} from 'lucide-react'

import { useCartStore } from '@/store/cartStore'
import { formatCurrency, cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { checkoutSchema, type CheckoutForm } from '@/features/orders/schemas'
import {
  crearPedido,
  type MetodoEntrega,
  type MetodoPago,
} from '@/features/orders/mockOrders'

const ENVIO_GRATIS_DESDE = 50
const COSTOS_ENVIO: Record<MetodoEntrega, number> = {
  estandar: 4.95,
  express: 9.95,
  recogida: 0,
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCartStore()
  const navigate = useNavigate()
  const [metodoEntrega, setMetodoEntrega] = useState<MetodoEntrega>('estandar')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta')
  const [serverError, setServerError] = useState('')

  const subtotalValue = subtotal()
  const envio =
    metodoEntrega === 'estandar' && subtotalValue >= ENVIO_GRATIS_DESDE
      ? 0
      : COSTOS_ENVIO[metodoEntrega]
  const total = subtotalValue + envio

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      provincia: '',
      notas: '',
    },
  })

  // Carrito vacío → redirigir
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-ink-900">
          No hay productos en el carrito
        </h1>
        <p className="mt-2 text-ink-500">
          Añade productos antes de finalizar la compra.
        </p>
        <Link
          to="/productos"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-yunque-500 text-ink-900 px-6 py-3 font-semibold hover:bg-yunque-400 transition"
        >
          Ir al catálogo
        </Link>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutForm) => {
    setServerError('')
    try {
      const pedido = await crearPedido({
        items,
        direccion: data,
        metodoEntrega,
        metodoPago,
        subtotal: subtotalValue,
        envio,
      })
      clear()
      navigate(`/pedido/${pedido.id}`, { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error al procesar el pedido',
      )
    }
  }

  return (
    <div className="bg-ink-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Link
          to="/carrito"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al carrito
        </Link>

        <h1 className="text-3xl font-black text-ink-900 mb-8">
          Finalizar compra
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid lg:grid-cols-[1fr_400px] gap-8"
        >
          {/* ------------ Columna izquierda ------------ */}
          <div className="space-y-6">
            {serverError && <Alert variant="error">{serverError}</Alert>}

            {/* Dirección */}
            <section className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-8 w-8 grid place-items-center rounded-full bg-yunque-500 text-ink-900 font-bold text-sm">
                  1
                </span>
                <h2 className="text-lg font-bold text-ink-900">
                  Dirección de envío
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Nombre completo"
                    placeholder="Juan Pérez"
                    error={errors.nombre?.message}
                    {...register('nombre')}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Teléfono"
                  placeholder="+34 600 000 000"
                  error={errors.telefono?.message}
                  {...register('telefono')}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Dirección"
                    placeholder="Calle, número, piso"
                    error={errors.direccion?.message}
                    {...register('direccion')}
                  />
                </div>
                <Input
                  label="Ciudad"
                  placeholder="Madrid"
                  error={errors.ciudad?.message}
                  {...register('ciudad')}
                />
                <Input
                  label="Código postal"
                  placeholder="28001"
                  error={errors.codigoPostal?.message}
                  {...register('codigoPostal')}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Provincia"
                    placeholder="Madrid"
                    error={errors.provincia?.message}
                    {...register('provincia')}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink-700 mb-1">
                    Notas del pedido (opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Referencias, horario de entrega..."
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400 focus:border-transparent"
                    {...register('notas')}
                  />
                </div>
              </div>
            </section>

            {/* Método de entrega */}
            <section className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-8 w-8 grid place-items-center rounded-full bg-yunque-500 text-ink-900 font-bold text-sm">
                  2
                </span>
                <h2 className="text-lg font-bold text-ink-900">
                  Método de entrega
                </h2>
              </div>

              <div className="space-y-3">
                <OptionCard
                  selected={metodoEntrega === 'estandar'}
                  onClick={() => setMetodoEntrega('estandar')}
                  icon={Truck}
                  title="Envío estándar"
                  subtitle="3-5 días laborables"
                  price={
                    subtotalValue >= ENVIO_GRATIS_DESDE
                      ? 'Gratis'
                      : formatCurrency(COSTOS_ENVIO.estandar)
                  }
                  priceGreen={subtotalValue >= ENVIO_GRATIS_DESDE}
                />
                <OptionCard
                  selected={metodoEntrega === 'express'}
                  onClick={() => setMetodoEntrega('express')}
                  icon={Zap}
                  title="Envío express"
                  subtitle="24-48 horas"
                  price={formatCurrency(COSTOS_ENVIO.express)}
                />
                <OptionCard
                  selected={metodoEntrega === 'recogida'}
                  onClick={() => setMetodoEntrega('recogida')}
                  icon={Store}
                  title="Recogida en tienda"
                  subtitle="Disponible en 2 horas"
                  price="Gratis"
                  priceGreen
                />
              </div>
            </section>

            {/* Método de pago */}
            <section className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-8 w-8 grid place-items-center rounded-full bg-yunque-500 text-ink-900 font-bold text-sm">
                  3
                </span>
                <h2 className="text-lg font-bold text-ink-900">
                  Método de pago
                </h2>
              </div>

              <div className="space-y-3">
                <OptionCard
                  selected={metodoPago === 'tarjeta'}
                  onClick={() => setMetodoPago('tarjeta')}
                  icon={CreditCard}
                  title="Tarjeta de crédito/débito"
                  subtitle="Pago seguro con cifrado SSL"
                />
                <OptionCard
                  selected={metodoPago === 'transferencia'}
                  onClick={() => setMetodoPago('transferencia')}
                  icon={Building2}
                  title="Transferencia bancaria"
                  subtitle="Recibirás los datos por email"
                />
                <OptionCard
                  selected={metodoPago === 'contraentrega'}
                  onClick={() => setMetodoPago('contraentrega')}
                  icon={Banknote}
                  title="Pago contra entrega"
                  subtitle="Paga al recibir el pedido (+2€)"
                />
              </div>
            </section>
          </div>

          {/* ------------ Resumen derecha ------------ */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-ink-200 bg-white p-6">
            <h2 className="text-lg font-bold text-ink-900 mb-4">
              Resumen del pedido
            </h2>

            <div className="space-y-3 max-h-64 overflow-auto pr-1 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="relative shrink-0">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="h-14 w-14 rounded-lg object-cover border border-ink-200"
                    />
                    <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-ink-900 text-white text-xs font-bold">
                      {item.cantidad}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-900 line-clamp-2">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-ink-400">{item.sku}</p>
                  </div>
                  <span className="font-semibold text-ink-900 shrink-0">
                    {formatCurrency(item.precio * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(subtotalValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Envío</span>
                <span
                  className={cn(
                    'font-medium',
                    envio === 0 && 'text-green-600',
                  )}
                >
                  {envio === 0 ? 'Gratis' : formatCurrency(envio)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-ink-200 flex items-center justify-between">
              <span className="font-bold text-ink-900">Total</span>
              <span className="text-2xl font-black text-ink-900">
                {formatCurrency(total)}
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="mt-6 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando…
                </>
              ) : (
                <>
                  Confirmar pedido · {formatCurrency(total)}
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-ink-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Compra protegida · Devolución 30 días
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}

// ---------- Subcomponente: tarjeta de opción ----------
function OptionCard({
  selected,
  onClick,
  icon: Icon,
  title,
  subtitle,
  price,
  priceGreen = false,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  price?: string
  priceGreen?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition',
        selected
          ? 'border-yunque-500 bg-yunque-50'
          : 'border-ink-200 hover:border-ink-300 bg-white',
      )}
    >
      <div
        className={cn(
          'h-10 w-10 shrink-0 grid place-items-center rounded-lg',
          selected ? 'bg-yunque-500 text-ink-900' : 'bg-ink-100 text-ink-500',
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-900">{title}</p>
        <p className="text-xs text-ink-500">{subtitle}</p>
      </div>
      {price && (
        <span
          className={cn(
            'font-bold shrink-0',
            priceGreen ? 'text-green-600' : 'text-ink-900',
          )}
        >
          {price}
        </span>
      )}
      <span
        className={cn(
          'h-5 w-5 shrink-0 rounded-full border-2 grid place-items-center transition',
          selected ? 'border-yunque-500 bg-yunque-500' : 'border-ink-300',
        )}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-ink-900" />}
      </span>
    </button>
  )
}