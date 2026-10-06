import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useProductStore } from '@/features/products/productStore'

export type TipoMovimiento =
  | 'entrada'
  | 'salida'
  | 'ajuste'
  | 'devolucion'
  | 'merma'

export interface Movimiento {
  id: string
  productoId: string
  productoSku: string
  productoNombre: string
  tipo: TipoMovimiento
  cantidad: number
  stockAntes: number
  stockDespues: number
  motivo: string
  notas?: string
  usuario: string
  fecha: string
}

interface MovementState {
  movimientos: Movimiento[]
  registrar: (data: {
    productoId: string
    tipo: TipoMovimiento
    cantidad: number
    motivo: string
    notas?: string
    usuario: string
  }) => Movimiento
  getByProducto: (productoId: string) => Movimiento[]
  getUltimos: (n?: number) => Movimiento[]
}

export const TIPO_CONFIG: Record<
  TipoMovimiento,
  { label: string; signo: 1 | -1 | 0; color: string }
> = {
  entrada:    { label: 'Entrada',    signo: 1,  color: 'green' },
  salida:     { label: 'Salida',     signo: -1, color: 'blue' },
  ajuste:     { label: 'Ajuste',     signo: 0,  color: 'yellow' },
  devolucion: { label: 'Devolución', signo: 1,  color: 'purple' },
  merma:      { label: 'Merma',      signo: -1, color: 'red' },
}

export const useMovementStore = create<MovementState>()(
  persist(
    (set, get) => ({
      movimientos: [],

      registrar: ({ productoId, tipo, cantidad, motivo, notas, usuario }) => {
        const producto = useProductStore
          .getState()
          .productos.find((p) => p.id === productoId)

        if (!producto) throw new Error('Producto no encontrado')

        const stockAntes = producto.stock
        const signo = TIPO_CONFIG[tipo].signo
        let stockDespues: number

        if (tipo === 'ajuste') {
          // En ajuste, "cantidad" es el nuevo stock directamente
          stockDespues = cantidad
        } else {
          stockDespues = Math.max(0, stockAntes + signo * cantidad)
        }

        // Actualizar producto
        useProductStore.getState().actualizar(productoId, {
          stock: stockDespues,
        })

        const mov: Movimiento = {
          id: crypto.randomUUID(),
          productoId,
          productoSku: producto.sku,
          productoNombre: producto.nombre,
          tipo,
          cantidad,
          stockAntes,
          stockDespues,
          motivo,
          notas,
          usuario,
          fecha: new Date().toISOString(),
        }

        set({ movimientos: [mov, ...get().movimientos] })
        return mov
      },

      getByProducto: (productoId) =>
        get().movimientos.filter((m) => m.productoId === productoId),

      getUltimos: (n = 20) => get().movimientos.slice(0, n),
    }),
    { name: 'yunque-movimientos' },
  ),
)