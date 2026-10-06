import { z } from 'zod'

export const checkoutSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z
    .string()
    .min(9, 'Mínimo 9 dígitos')
    .regex(/^[0-9+\s-]+$/, 'Solo números, +, - y espacios'),
  direccion: z.string().min(5, 'Dirección demasiado corta'),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  codigoPostal: z.string().min(4, 'Código postal inválido'),
  provincia: z.string().min(2, 'Provincia requerida'),
  notas: z.string().optional(),
})

export type CheckoutForm = z.infer<typeof checkoutSchema>