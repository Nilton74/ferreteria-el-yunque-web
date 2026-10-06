import type { Producto } from './mockProducts'

export type Orden = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nuevos' | 'rating'

export interface Filtros {
  q: string
  categorias: string[]
  marcas: string[]
  precioMin: number
  precioMax: number
  soloOfertas: boolean
  soloDisponibles: boolean
  orden: Orden
}

export const FILTROS_INICIALES: Filtros = {
  q: '',
  categorias: [],
  marcas: [],
  precioMin: 0,
  precioMax: 9999,
  soloOfertas: false,
  soloDisponibles: false,
  orden: 'relevancia',
}

export function aplicarFiltros(productos: Producto[], f: Filtros): Producto[] {
  let result = [...productos]

  // Búsqueda
  if (f.q.trim()) {
    const term = f.q.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term),
    )
  }

  // Categorías
  if (f.categorias.length > 0) {
    result = result.filter((p) => f.categorias.includes(p.categoria))
  }

  // Marcas
  if (f.marcas.length > 0) {
    result = result.filter((p) => f.marcas.includes(p.marca))
  }

  // Rango de precio
  result = result.filter((p) => {
    const precio = p.precioPromo ?? p.precio
    return precio >= f.precioMin && precio <= f.precioMax
  })

  // Solo ofertas
  if (f.soloOfertas) {
    result = result.filter((p) => !!p.precioPromo)
  }

  // Solo disponibles
  if (f.soloDisponibles) {
    result = result.filter((p) => p.stock > 0)
  }

  // Ordenamiento
  switch (f.orden) {
    case 'precio-asc':
      result.sort(
        (a, b) => (a.precioPromo ?? a.precio) - (b.precioPromo ?? b.precio),
      )
      break
    case 'precio-desc':
      result.sort(
        (a, b) => (b.precioPromo ?? b.precio) - (a.precioPromo ?? a.precio),
      )
      break
    case 'nuevos':
      result.sort((a, b) => Number(!!b.nuevo) - Number(!!a.nuevo))
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'relevancia':
    default:
      // mantiene el orden original
      break
  }

  return result
}

export function rangoPrecios(productos: Producto[]): [number, number] {
  if (productos.length === 0) return [0, 1000]
  const precios = productos.map((p) => p.precioPromo ?? p.precio)
  return [
    Math.floor(Math.min(...precios)),
    Math.ceil(Math.max(...precios)),
  ]
}