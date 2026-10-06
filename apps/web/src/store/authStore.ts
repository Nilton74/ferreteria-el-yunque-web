import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Rol = 'superadmin' | 'admin' | 'vendedor' | 'almacenero' | 'cliente'

export interface User {
  id: string
  nombre: string
  email: string
  rol: Rol
}

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  hasRole: (...roles: Rol[]) => boolean
}

const AUTH_STORAGE_KEY = 'yunque-auth'

const clearPersistedAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem('token')
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token })
      },
      logout: () => {
        clearPersistedAuth()
        set({ user: null, token: null })
      },
      hasRole: (...roles) => {
        const rol = get().user?.rol
        return rol ? roles.includes(rol) : false
      },
    }),
    { name: AUTH_STORAGE_KEY },
  ),
)
