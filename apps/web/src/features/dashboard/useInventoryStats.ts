import { useMemo } from 'react'
import { useProductStore } from '@/features/products/productStore'

export function useInventoryStats() {
  const productos = useProductStore((s) => s.productos)

  return useMemo(() => {
    const stockBajo = productos.filter(
      (p) => p.stock > 0 && p.stock <= p.stockMinimo,
    ).length
    const agotados = productos.filter((p) => p.stock === 0).length
    const unidadesTotales = productos.reduce((acc, p) => acc + p.stock, 0)
    const valorInventario = productos.reduce(
      (acc, p) => acc + p.stock * p.costo,
      0,
    )
    const productosActivos = productos.filter((p) => p.activo).length

    return {
      stockBajo,
      agotados,
      unidadesTotales,
      valorInventario,
      productosActivos,
      total: productos.length,
    }
  }, [productos])
}
