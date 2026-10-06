import type { User, Rol } from '@/store/authStore'

/**
 * Mock de autenticación.
 * Cuando tengamos backend, este archivo se reemplaza por llamadas reales a la API.
 */

interface MockUser extends User {
  password: string
}

const USERS: MockUser[] = [
  {
    id: '1',
    nombre: 'Admin',
    email: 'admin@yunque.com',
    rol: 'admin',
    password: 'admin123',
  },
  {
    id: '2',
    nombre: 'Vendedor',
    email: 'vendedor@yunque.com',
    rol: 'vendedor',
    password: 'vendedor123',
  },
  {
    id: '3',
    nombre: 'Almacén',
    email: 'almacen@yunque.com',
    rol: 'almacenero',
    password: 'almacen123',
  },
  {
    id: '4',
    nombre: 'Cliente Demo',
    email: 'cliente@yunque.com',
    rol: 'cliente',
    password: 'cliente123',
  },
]

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function mockLogin(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  await delay(700) // simula latencia de red

  const found = USERS.find(
    (u) =>
      u.email.toLowerCase() === credentials.email.toLowerCase() &&
      u.password === credentials.password,
  )

  if (!found) {
    throw new Error('Credenciales inválidas')
  }

  const { password, ...user } = found
  void password
  const token = `mock-token-${user.id}-${Date.now()}`

  return { user, token }
}

export async function mockRegister(data: {
  nombre: string
  email: string
  password: string
}): Promise<AuthResponse> {
  await delay(700)

  if (USERS.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('Ese email ya está registrado')
  }

  const newUser: MockUser = {
    id: String(Date.now()),
    nombre: data.nombre,
    email: data.email,
    rol: 'cliente' as Rol,
    password: data.password,
  }
  USERS.push(newUser)

  const user: User = {
    id: newUser.id,
    nombre: newUser.nombre,
    email: newUser.email,
    rol: newUser.rol,
  }
  return { user, token: `mock-token-${user.id}-${Date.now()}` }
}

/**
 * Devuelve la ruta inicial según el rol del usuario.
 */
export function homeByRol(rol: Rol): string {
  switch (rol) {
    case 'superadmin':
    case 'admin':
    case 'vendedor':
    case 'almacenero':
      return '/admin/dashboard'
    case 'cliente':
    default:
      return '/'
  }
}