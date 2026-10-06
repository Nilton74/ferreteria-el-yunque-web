import { create } from 'zustand'
import type { ProductoAdmin } from '@/features/products/productStore'

export interface TicketItem {
  productoId: string
  sku: string
  nombre: string
  precio: number
  imagen: string
  cantidad: number
  stockDisponible: number
}

export type MetodoPagoPOS = 'efectivo' | 'tarjeta' | 'transferencia' | 'mixto'

interface POSState {
  items: TicketItem[]
  descuento: number // en % (0-100)
  agregar: (p: ProductoAdmin) => void
  quitar: (productoId: string) => void
  setCantidad: (productoId: string, cantidad: number) => void
  setDescuento: (valor: number) => void
  vaciar: () => void
  subtotal: () => number
  descuentoValor: () => number
  iva: () => number
  total: () => number
}

const IVA = 0.21

export const usePOSStore = create<POSState>((set, get) => ({
  items: [],
  descuento: 0,

  agregar: (p) => {
    const items = [...get().items]
    const idx = items.findIndex((i) => i.productoId === p.id)
    const precio = p.precioPromo ?? p.precio

    if (idx >= 0) {
      if (items[idx].cantidad >= p.stock) return // no pasar del stock
      items[idx].cantidad += 1
    } else {
      if (p.stock <= 0) return
      items.push({
        productoId: p.id,
        sku: p.sku,
        nombre: p.nombre,
        precio,
        imagen: p.imagenes[0] ?? '',
        cantidad: 1,
        stockDisponible: p.stock,
      })
    }
    set({ items })
  },

  quitar: (productoId) => {
    set({ items: get().items.filter((i) => i.productoId !== productoId) })
  },

  setCantidad: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().quitar(productoId)
      return
    }
    set({
      items: get().items.map((i) =>
        i.productoId === productoId
          ? { ...i, cantidad: Math.min(cantidad, i.stockDisponible) }
          : i,
      ),
    })
  },

  setDescuento: (valor) => set({ descuento: Math.max(0, Math.min(100, valor)) }),

  vaciar: () => set({ items: [], descuento: 0 }),

  subtotal: () =>
    get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),

  descuentoValor: () => {
    const sub = get().subtotal()
    return (sub * get().descuento) / 100
  },

  iva: () => {
    const base = get().subtotal() - get().descuentoValor()
    return base * IVA
  },

  total: () => {
    const base = get().subtotal() - get().descuentoValor()
    return base + base * IVA
  },
}))