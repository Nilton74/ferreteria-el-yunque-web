import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  sku: string
  nombre: string
  precio: number
  imagen?: string
  cantidad: number
}

interface CartState {
  items: CartItem[]
  add: (item: Omit<CartItem, 'cantidad'>, cantidad?: number) => void
  remove: (id: string) => void
  setQty: (id: string, cantidad: number) => void
  clear: () => void
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, cantidad = 1) => {
        const items = [...get().items]
        const idx = items.findIndex((i) => i.id === item.id)
        if (idx >= 0) items[idx].cantidad += cantidad
        else items.push({ ...item, cantidad })
        set({ items })
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, cantidad) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, cantidad: Math.max(1, cantidad) } : i,
          ),
        }),
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    }),
    { name: 'yunque-cart' },
  ),
)
