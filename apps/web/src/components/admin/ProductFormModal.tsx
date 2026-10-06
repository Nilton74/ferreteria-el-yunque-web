import {
  useEffect,
  forwardRef,
  type ComponentPropsWithoutRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, ImageIcon, Calculator } from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { CATEGORIAS, MARCAS } from '@/features/products/mockProducts'
import { productoSchema, type ProductoForm } from '@/features/products/productSchema'
import {
  useProductStore,
  calcularMargen,
  type ProductoAdmin,
} from '@/features/products/productStore'
import { formatCurrency, cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  producto?: ProductoAdmin | null
}

export function ProductFormModal({ open, onClose, producto }: Props) {
  const crear = useProductStore((s) => s.crear)
  const actualizar = useProductStore((s) => s.actualizar)
  const editar = !!producto

  const defaultValues: ProductoForm = {
    sku: '',
    nombre: '',
    descripcion: '',
    descripcionLarga: '',
    categoria: '',
    marca: '',
    precio: 0,
    precioPromo: 0,
    costo: 0,
    stock: 0,
    stockMinimo: 0,
    imagenes: [],
    especificaciones: [],
    activo: true,
    destacado: false,
    nuevo: false,
  }

  const resolver: Resolver<ProductoForm> = zodResolver(productoSchema) as Resolver<ProductoForm>

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductoForm>({
    resolver,
    defaultValues,
  })

  const imagenes = useWatch({ control, name: 'imagenes' }) ?? []
  const especificaciones = useWatch({ control, name: 'especificaciones' }) ?? []

  const addImagen = () => {
    setValue('imagenes', [...imagenes, ''], { shouldDirty: true, shouldTouch: true })
  }

  const removeImagen = (index: number) => {
    setValue(
      'imagenes',
      imagenes.filter((_: string, i: number) => i !== index),
      { shouldDirty: true, shouldTouch: true },
    )
  }

  const addEspec = () => {
    setValue(
      'especificaciones',
      [...especificaciones, { clave: '', valor: '' }],
      { shouldDirty: true, shouldTouch: true },
    )
  }

  const removeEspec = (index: number) => {
    setValue(
      'especificaciones',
      especificaciones.filter((_: { clave: string; valor: string }, i: number) => i !== index),
      { shouldDirty: true, shouldTouch: true },
    )
  }

  // Cargar datos al abrir en modo edición
  useEffect(() => {
    if (open && producto) {
      reset({
        sku: producto.sku,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        descripcionLarga: producto.descripcionLarga,
        categoria: producto.categoria,
        marca: producto.marca,
        precio: producto.precio,
        precioPromo: producto.precioPromo ?? 0,
        costo: producto.costo,
        stock: producto.stock,
        stockMinimo: producto.stockMinimo,
        imagenes: producto.imagenes,
        especificaciones: producto.especificaciones,
        activo: producto.activo,
        destacado: producto.destacado ?? false,
        nuevo: producto.nuevo ?? false,
      })
    } else if (open) {
      reset({
        sku: '',
        nombre: '',
        descripcion: '',
        descripcionLarga: '',
        categoria: '',
        marca: '',
        precio: 0,
        precioPromo: 0,
        costo: 0,
        stock: 0,
        stockMinimo: 0,
        imagenes: [],
        especificaciones: [],
        activo: true,
        destacado: false,
        nuevo: false,
      })
    }
  }, [open, producto, reset])

  // Cálculo de margen en vivo
  const precio = useWatch({ control, name: 'precio' }) ?? 0
  const costo = useWatch({ control, name: 'costo' }) ?? 0
  const precioPromo = useWatch({ control, name: 'precioPromo' }) ?? 0
  const margen = calcularMargen(Number(precio) || 0, Number(costo) || 0)
  const margenPromo =
    Number(precioPromo) > 0
      ? calcularMargen(Number(precioPromo), Number(costo) || 0)
      : null

  const onSubmit = (data: ProductoForm) => {
    const parsed = productoSchema.parse(data)
    const payload = {
      sku: parsed.sku.toUpperCase(),
      nombre: parsed.nombre,
      descripcion: parsed.descripcion,
      descripcionLarga: parsed.descripcionLarga ?? '',
      categoria: parsed.categoria,
      marca: parsed.marca,
      precio: Number(parsed.precio),
      precioPromo:
        parsed.precioPromo && Number(parsed.precioPromo) > 0
          ? Number(parsed.precioPromo)
          : undefined,
      costo: Number(parsed.costo),
      stock: Number(parsed.stock),
      stockMinimo: Number(parsed.stockMinimo),
      imagenes: parsed.imagenes ?? [],
      especificaciones: parsed.especificaciones ?? [],
      activo: parsed.activo,
      destacado: parsed.destacado,
      nuevo: parsed.nuevo,
    }

    if (editar && producto) {
      actualizar(producto.id, payload)
    } else {
      crear(payload)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={editar ? `Editar producto` : 'Nuevo producto'}
      subtitle={
        editar ? `${producto?.sku} · ${producto?.nombre}` : 'Añade un producto al catálogo'
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
          >
            {editar ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ---------- Básicos ---------- */}
        <Section title="Información básica">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="SKU"
              placeholder="BOS-TP-001"
              error={errors.sku?.message}
              className="font-mono uppercase"
              {...register('sku')}
            />
            <Input
              label="Nombre"
              placeholder="Taladro Percutor Bosch 800W"
              error={errors.nombre?.message}
              {...register('nombre')}
            />

            <Select
              label="Categoría"
              options={CATEGORIAS.map((c) => ({ value: c.slug, label: `${c.emoji} ${c.nombre}` }))}
              error={errors.categoria?.message}
              {...register('categoria')}
            />
            <Select
              label="Marca"
              options={MARCAS.map((m) => ({ value: m, label: m }))}
              error={errors.marca?.message}
              {...register('marca')}
            />

            <div className="sm:col-span-2">
              <Input
                label="Descripción corta"
                placeholder="Breve resumen del producto"
                error={errors.descripcion?.message}
                {...register('descripcion')}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Descripción larga
              </label>
              <textarea
                rows={3}
                placeholder="Detalles completos del producto…"
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
                {...register('descripcionLarga')}
              />
            </div>
          </div>
        </Section>

        {/* ---------- Precios ---------- */}
        <Section title="Precios y stock">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Costo (€)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.costo?.message}
              {...register('costo')}
            />
            <Input
              label="Precio venta (€)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.precio?.message}
              {...register('precio')}
            />
            <Input
              label="Precio promo (€)"
              type="number"
              step="0.01"
              placeholder="Opcional"
              {...register('precioPromo')}
            />
            <div className="rounded-lg border border-ink-200 bg-ink-50 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-500 mb-1">
                <Calculator className="h-3.5 w-3.5" />
                Margen
              </div>
              <p className="text-lg font-black text-green-700">
                {margen.porcentaje.toFixed(1)}%
              </p>
              <p className="text-xs text-ink-500">{formatCurrency(margen.valor)}</p>
              {margenPromo && (
                <p className="mt-1 text-[11px] text-yunque-700">
                  Con promo: {margenPromo.porcentaje.toFixed(1)}%
                </p>
              )}
            </div>

            <Input
              label="Stock"
              type="number"
              placeholder="0"
              error={errors.stock?.message}
              {...register('stock')}
            />
            <Input
              label="Stock mínimo"
              type="number"
              placeholder="0"
              error={errors.stockMinimo?.message}
              {...register('stockMinimo')}
            />

            <div className="lg:col-span-2 flex items-center gap-6 pt-2">
              <Toggle label="Activo" {...register('activo')} />
              <Toggle label="Destacado" {...register('destacado')} />
              <Toggle label="Nuevo" {...register('nuevo')} />
            </div>
          </div>
        </Section>

        {/* ---------- Imágenes ---------- */}
        <Section
          title="Imágenes"
          action={
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={addImagen}
            >
              <Plus className="h-4 w-4 mr-1" /> Añadir
            </Button>
          }
        >
          {imagenes.length === 0 ? (
            <div className="text-center py-6 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50/60">
              <ImageIcon className="mx-auto h-8 w-8 text-ink-300" />
              <p className="mt-2 text-sm text-ink-500">
                Añade URLs de imágenes del producto
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {imagenes.map((f, i) => (
                <div key={`${f}-${i}`} className="flex gap-2">
                  <input
                    placeholder="https://…"
                    className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
                    {...register(`imagenes.${i}` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImagen(i)}
                    className="p-2 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ---------- Especificaciones ---------- */}
        <Section
          title="Especificaciones"
          action={
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={addEspec}
            >
              <Plus className="h-4 w-4 mr-1" /> Añadir
            </Button>
          }
        >
          {especificaciones.length === 0 ? (
            <p className="text-sm text-ink-500 italic">
              Sin especificaciones todavía.
            </p>
          ) : (
            <div className="space-y-2">
              {especificaciones.map((f, i) => (
                <div key={`${f.clave}-${f.valor}-${i}`} className="flex gap-2">
                  <input
                    placeholder="Clave (ej. Potencia)"
                    className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
                    {...register(`especificaciones.${i}.clave` as const)}
                  />
                  <input
                    placeholder="Valor (ej. 800 W)"
                    className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
                    {...register(`especificaciones.${i}.valor` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => removeEspec(i)}
                    className="p-2 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {Object.keys(errors).length > 0 && (
          <Alert variant="error">
            Revisa los campos marcados en rojo antes de continuar.
          </Alert>
        )}
      </form>
    </Modal>
  )
}

// ---------- Subcomponentes ----------
function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  )
}

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  label: string
  options: { value: string; label: string }[]
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, ...props }, ref) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      <select
        ref={ref}
        {...props}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm bg-white',
          'focus:outline-none focus:ring-2 focus:ring-yunque-400',
          error ? 'border-red-400 bg-red-50' : 'border-ink-200',
        )}
      >
        <option value="">— Selecciona —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  ),
)

Select.displayName = 'Select'

function Toggle({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-ink-300 text-yunque-500 focus:ring-yunque-400"
        {...props}
      />
      <span className="text-sm font-medium text-ink-700">{label}</span>
    </label>
  )
}