import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email invalido'),
  password: z
    .string()
    .min(1, 'La contrasena es obligatoria')
    .min(6, 'Minimo 6 caracteres'),
})

export const registerSchema = z
  .object({
    nombre: z.string().min(2, 'Minimo 2 caracteres'),
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Minimo 6 caracteres'),
    confirmar: z.string(),
  })
  .refine((data) => data.password === data.confirmar, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmar'],
  })

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
