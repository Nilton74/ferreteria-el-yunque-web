import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Especificacion } from './mockProducts'
import { PRODUCTOS } from './mockProducts'

export interface ProductoAdmin {
  id: string
  sku: string
  nombre: string
  slug: string
  descripcion: string
  descripcionLarga: string
  categoria: string
  marca: string
  precio: number
  precioPromo?: number
  costo: number
  stock: number
  stockMinimo: number
  imagenes: string[]
  especificaciones: Especificacion[]
  activo: boolean
  destacado?: boolean
  nuevo?: boolean
  rating: number
  reviews: number
}

interface ProductState {
  productos: ProductoAdmin[]
  crear: (p: Omit<ProductoAdmin, 'id' | 'slug' | 'rating' | 'reviews'>) => ProductoAdmin
  actualizar: (id: string, p: Partial<ProductoAdmin>) => void
  eliminar: (ids: string[]) => void
  toggleActivo: (id: string) => void
  toggleActivoMultiple: (ids: string[], activo: boolean) => void
  getById: (id: string) => ProductoAdmin | undefined
}

// Convierte los productos mock al tipo admin con costo estimado y activo
const iniciales: ProductoAdmin[] = PRODUCTOS.map((p) => ({
  ...p,
  costo: +(p.precio * 0.6).toFixed(2), // costo estimado
  activo: true,
}))

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      productos: iniciales,

      crear: (data) => {
        const nuevo: ProductoAdmin = {
          ...data,
          id: crypto.randomUUID(),
          slug: slugify(data.nombre),
          rating: 0,
          reviews: 0,
        }
        set({ productos: [nuevo, ...get().productos] })
        return nuevo
      },

      actualizar: (id, data) => {
        set({
          productos: get().productos.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...data,
                  slug: data.nombre ? slugify(data.nombre) : p.slug,
                }
              : p,
          ),
        })
      },

      eliminar: (ids) => {
        set({ productos: get().productos.filter((p) => !ids.includes(p.id)) })
      },

      toggleActivo: (id) => {
        set({
          productos: get().productos.map((p) =>
            p.id === id ? { ...p, activo: !p.activo } : p,
          ),
        })
      },

      toggleActivoMultiple: (ids, activo) => {
        set({
          productos: get().productos.map((p) =>
            ids.includes(p.id) ? { ...p, activo } : p,
          ),
        })
      },

      getById: (id) => get().productos.find((p) => p.id === id),
    }),
    { name: 'yunque-productos' },
  ),
)

export function calcularMargen(precio: number, costo: number): {
  valor: number
  porcentaje: number
} {
  if (precio <= 0 || costo < 0) return { valor: 0, porcentaje: 0 }
  const valor = precio - costo
  return { valor, porcentaje: (valor / precio) * 100 }
}