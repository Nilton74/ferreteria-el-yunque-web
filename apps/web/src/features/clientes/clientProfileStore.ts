import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Direccion {
  id: string
  alias: string       // "Casa", "Oficina", "Obra"
  nombre: string
  telefono: string
  direccion: string
  ciudad: string
  codigoPostal: string
  provincia: string
  principal: boolean
}

export interface PerfilCliente {
  nombre: string
  email: string
  telefono: string
}

interface ProfileState {
  perfil: PerfilCliente
  direcciones: Direccion[]
  favoritos: string[]     // IDs de productos

  actualizarPerfil: (data: Partial<PerfilCliente>) => void
  agregarDireccion: (dir: Omit<Direccion, 'id'>) => void
  actualizarDireccion: (id: string, dir: Partial<Direccion>) => void
  eliminarDireccion: (id: string) => void
  marcarPrincipal: (id: string) => void

  toggleFavorito: (productoId: string) => void
  esFavorito: (productoId: string) => boolean
}

const DIRECCIONES_DEMO: Direccion[] = [
  {
    id: 'd1',
    alias: 'Casa',
    nombre: 'Juan Pérez',
    telefono: '+34 600 111 222',
    direccion: 'Calle Mayor 45, 3ºA',
    ciudad: 'Madrid',
    codigoPostal: '28013',
    provincia: 'Madrid',
    principal: true,
  },
]

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      perfil: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '+34 600 111 222',
      },
      direcciones: DIRECCIONES_DEMO,
      favoritos: ['p1', 'p3'],

      actualizarPerfil: (data) =>
        set({ perfil: { ...get().perfil, ...data } }),

      agregarDireccion: (dir) => {
        const nueva: Direccion = {
          ...dir,
          id: crypto.randomUUID(),
        }
        // Si es principal, quitar la principalidad de las demás
        let direcciones = [...get().direcciones]
        if (nueva.principal) {
          direcciones = direcciones.map((d) => ({ ...d, principal: false }))
        }
        set({ direcciones: [...direcciones, nueva] })
      },

      actualizarDireccion: (id, data) => {
        let direcciones = get().direcciones.map((d) =>
          d.id === id ? { ...d, ...data } : d,
        )
        // Si la nueva es principal, quitar principalidad de las demás
        if (data.principal) {
          direcciones = direcciones.map((d) =>
            d.id === id ? d : { ...d, principal: false },
          )
        }
        set({ direcciones })
      },

      eliminarDireccion: (id) => {
        const dirs = get().direcciones
        const eraPrincipal = dirs.find((d) => d.id === id)?.principal
        let nuevas = dirs.filter((d) => d.id !== id)
        // Si borramos la principal, la primera pasa a principal
        if (eraPrincipal && nuevas.length > 0) {
          nuevas = nuevas.map((d, i) => ({ ...d, principal: i === 0 }))
        }
        set({ direcciones: nuevas })
      },

      marcarPrincipal: (id) => {
        set({
          direcciones: get().direcciones.map((d) => ({
            ...d,
            principal: d.id === id,
          })),
        })
      },

      toggleFavorito: (productoId) => {
        const favs = get().favoritos
        set({
          favoritos: favs.includes(productoId)
            ? favs.filter((id) => id !== productoId)
            : [...favs, productoId],
        })
      },

      esFavorito: (productoId) => get().favoritos.includes(productoId),
    }),
    { name: 'yunque-perfil-cliente' },
  ),
)