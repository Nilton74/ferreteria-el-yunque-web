import { z } from 'zod'

export const productoSchema = z.object({
  sku: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(/^[A-Z0-9-]+$/i, 'Solo letras, números y guiones'),
  nombre: z.string().min(3, 'Mínimo 3 caracteres').max(120, 'Máximo 120 caracteres'),
  descripcion: z.string().min(5, 'Mínimo 5 caracteres'),
  descripcionLarga: z.string().optional().default(''),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  marca: z.string().min(1, 'Selecciona una marca'),
  precio: z
    .coerce.number({ error: 'Número inválido' })
    .positive('Debe ser mayor que 0'),
  precioPromo: z.coerce.number().nonnegative().optional().or(z.literal(0)),
  costo: z
    .coerce.number({ error: 'Número inválido' })
    .nonnegative('No puede ser negativo'),
  stock: z.coerce.number().int('Debe ser entero').nonnegative('No puede ser negativo'),
  stockMinimo: z.coerce.number().int().nonnegative(),
  imagenes: z.array(z.string().url('URL inválida')).default([]),
  especificaciones: z
    .array(
      z.object({
        clave: z.string().min(1, 'Requerido'),
        valor: z.string().min(1, 'Requerido'),
      }),
    )
    .default([]),
  activo: z.boolean().default(true),
  destacado: z.boolean().default(false),
  nuevo: z.boolean().default(false),
})

export type ProductoForm = z.output<typeof productoSchema>
export type ProductoFormInput = z.input<typeof productoSchema>