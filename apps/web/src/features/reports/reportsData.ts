import {
  getPedidos,
  METODO_PAGO_LABEL,
  type Pedido,
} from '@/features/orders/mockOrders'
import { CATEGORIAS, PRODUCTOS } from '@/features/products/mockProducts'

// ============================================
// Tipos
// ============================================
export type Periodo = 'hoy' | '7d' | '30d' | '90d' | 'mes' | 'anio'

export interface RangoFechas {
  desde: Date
  hasta: Date
  label: string
}

export interface KpiComparativo {
  actual: number
  anterior: number
  cambio: number // porcentaje
}

export interface VentaDia {
  fecha: string
  label: string
  ventas: number
  pedidos: number
}

export interface VentaCategoria {
  categoria: string
  emoji: string
  total: number
  cantidad: number
}

export interface VentaMetodoPago {
  metodo: string
  label: string
  total: number
  cantidad: number
  porcentaje: number
}

export interface ProductoVendido {
  productoId: string
  nombre: string
  sku: string
  categoria: string
  cantidad: number
  ingresos: number
}

export interface ReporteCompleto {
  rango: RangoFechas
  rangoAnterior: RangoFechas
  pedidos: Pedido[]
  kpis: {
    ventas: KpiComparativo
    pedidos: KpiComparativo
    ticketMedio: KpiComparativo
    unidadesVendidas: KpiComparativo
  }
  ventasPorDia: VentaDia[]
  ventasPorCategoria: VentaCategoria[]
  ventasPorMetodoPago: VentaMetodoPago[]
  topProductos: ProductoVendido[]
}

// ============================================
// Utilidades de fecha
// ============================================
export function calcularRango(periodo: Periodo): RangoFechas {
  const hoy = new Date()
  hoy.setHours(23, 59, 59, 999)

  const desde = new Date()
  desde.setHours(0, 0, 0, 0)

  let label = ''

  switch (periodo) {
    case 'hoy':
      label = 'Hoy'
      break
    case '7d':
      desde.setDate(desde.getDate() - 6)
      label = 'Últimos 7 días'
      break
    case '30d':
      desde.setDate(desde.getDate() - 29)
      label = 'Últimos 30 días'
      break
    case '90d':
      desde.setDate(desde.getDate() - 89)
      label = 'Últimos 90 días'
      break
    case 'mes':
      desde.setDate(1)
      label = 'Este mes'
      break
    case 'anio':
      desde.setMonth(0, 1)
      label = 'Este año'
      break
  }

  return { desde, hasta: hoy, label }
}

function calcularRangoAnterior(rango: RangoFechas): RangoFechas {
  const duracion = rango.hasta.getTime() - rango.desde.getTime()
  const hasta = new Date(rango.desde.getTime() - 1)
  const desde = new Date(hasta.getTime() - duracion)
  return { desde, hasta, label: 'Período anterior' }
}

function estaEnRango(fecha: string, rango: RangoFechas): boolean {
  const d = new Date(fecha).getTime()
  return d >= rango.desde.getTime() && d <= rango.hasta.getTime()
}

// ============================================
// Cálculo de cambio porcentual
// ============================================
function calcularCambio(actual: number, anterior: number): number {
  if (anterior === 0) return actual > 0 ? 100 : 0
  return ((actual - anterior) / anterior) * 100
}

// ============================================
// Cálculo principal
// ============================================
export function calcularReporte(periodo: Periodo): ReporteCompleto {
  const todosPedidos = getPedidos().filter((p) => p.estado !== 'cancelado')
  const rango = calcularRango(periodo)
  const rangoAnterior = calcularRangoAnterior(rango)

  const pedidos = todosPedidos.filter((p) => estaEnRango(p.creadoEn, rango))
  const pedidosAnteriores = todosPedidos.filter((p) =>
    estaEnRango(p.creadoEn, rangoAnterior),
  )

  // ============ KPIs ============
  const sumar = (lista: Pedido[], fn: (p: Pedido) => number) =>
    lista.reduce((acc, p) => acc + fn(p), 0)

  const ventasActual = sumar(pedidos, (p) => p.total)
  const ventasAnterior = sumar(pedidosAnteriores, (p) => p.total)

  const unidadesActual = sumar(pedidos, (p) =>
    p.items.reduce((a, i) => a + i.cantidad, 0),
  )
  const unidadesAnterior = sumar(pedidosAnteriores, (p) =>
    p.items.reduce((a, i) => a + i.cantidad, 0),
  )

  const ticketActual = pedidos.length > 0 ? ventasActual / pedidos.length : 0
  const ticketAnterior =
    pedidosAnteriores.length > 0 ? ventasAnterior / pedidosAnteriores.length : 0

  const kpis = {
    ventas: {
      actual: ventasActual,
      anterior: ventasAnterior,
      cambio: calcularCambio(ventasActual, ventasAnterior),
    },
    pedidos: {
      actual: pedidos.length,
      anterior: pedidosAnteriores.length,
      cambio: calcularCambio(pedidos.length, pedidosAnteriores.length),
    },
    ticketMedio: {
      actual: ticketActual,
      anterior: ticketAnterior,
      cambio: calcularCambio(ticketActual, ticketAnterior),
    },
    unidadesVendidas: {
      actual: unidadesActual,
      anterior: unidadesAnterior,
      cambio: calcularCambio(unidadesActual, unidadesAnterior),
    },
  }

  // ============ Ventas por día ============
  const diasMap = new Map<string, { ventas: number; pedidos: number }>()

  // Rellenar todos los días del rango con 0
  const cursor = new Date(rango.desde)
  cursor.setHours(0, 0, 0, 0)
  const limite = new Date(rango.hasta)
  limite.setHours(0, 0, 0, 0)

  // Si el rango es muy grande (>60 días), agrupamos por semana
  const diasTotales = Math.ceil(
    (limite.getTime() - cursor.getTime()) / 86400000,
  ) + 1
  const agruparPorSemana = diasTotales > 60

  while (cursor <= limite) {
    const key = cursor.toISOString().slice(0, 10)
    diasMap.set(key, { ventas: 0, pedidos: 0 })
    cursor.setDate(cursor.getDate() + (agruparPorSemana ? 7 : 1))
  }

  pedidos.forEach((p) => {
    const fecha = new Date(p.creadoEn)
    fecha.setHours(0, 0, 0, 0)
    if (agruparPorSemana) {
      const dia = fecha.getDay()
      const diff = fecha.getDate() - dia + (dia === 0 ? -6 : 1)
      fecha.setDate(diff)
    }
    const key = fecha.toISOString().slice(0, 10)
    const actual = diasMap.get(key)
    if (actual) {
      actual.ventas += p.total
      actual.pedidos += 1
    }
  })

  const ventasPorDia: VentaDia[] = Array.from(diasMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => {
      const d = new Date(key)
      return {
        fecha: key,
        label: d.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
        }),
        ventas: data.ventas,
        pedidos: data.pedidos,
      }
    })

  // ============ Ventas por categoría ============
  const catMap = new Map<string, { total: number; cantidad: number }>()
  pedidos.forEach((p) => {
    p.items.forEach((item) => {
      // Encontrar la categoría del producto
      const producto = PRODUCTOS.find((prod) => prod.id === item.id)
      const catSlug = producto?.categoria ?? 'otros'
      const actual = catMap.get(catSlug) ?? { total: 0, cantidad: 0 }
      actual.total += item.precio * item.cantidad
      actual.cantidad += item.cantidad
      catMap.set(catSlug, actual)
    })
  })

  const ventasPorCategoria: VentaCategoria[] = Array.from(catMap.entries())
    .map(([slug, data]) => {
      const cat = CATEGORIAS.find((c) => c.slug === slug)
      return {
        categoria: cat?.nombre ?? 'Otros',
        emoji: cat?.emoji ?? '📦',
        total: data.total,
        cantidad: data.cantidad,
      }
    })
    .sort((a, b) => b.total - a.total)

  // ============ Ventas por método de pago ============
  const pagoMap = new Map<string, { total: number; cantidad: number }>()
  pedidos.forEach((p) => {
    const actual = pagoMap.get(p.metodoPago) ?? { total: 0, cantidad: 0 }
    actual.total += p.total
    actual.cantidad += 1
    pagoMap.set(p.metodoPago, actual)
  })

  const totalPagos = Array.from(pagoMap.values()).reduce(
    (acc, v) => acc + v.total,
    0,
  )

  const ventasPorMetodoPago: VentaMetodoPago[] = Array.from(pagoMap.entries())
    .map(([metodo, data]) => ({
      metodo,
      label: METODO_PAGO_LABEL[metodo as keyof typeof METODO_PAGO_LABEL] ?? metodo,
      total: data.total,
      cantidad: data.cantidad,
      porcentaje: totalPagos > 0 ? (data.total / totalPagos) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)

  // ============ Top productos ============
  const prodMap = new Map<string, ProductoVendido>()
  pedidos.forEach((p) => {
    p.items.forEach((item) => {
      const actual = prodMap.get(item.id) ?? {
        productoId: item.id,
        nombre: item.nombre,
        sku: item.sku,
        categoria:
          CATEGORIAS.find((c) => c.slug === PRODUCTOS.find((p) => p.id === item.id)?.categoria)
            ?.nombre ?? 'Otros',
        cantidad: 0,
        ingresos: 0,
      }
      actual.cantidad += item.cantidad
      actual.ingresos += item.precio * item.cantidad
      prodMap.set(item.id, actual)
    })
  })

  const topProductos = Array.from(prodMap.values())
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 10)

  return {
    rango,
    rangoAnterior,
    pedidos,
    kpis,
    ventasPorDia,
    ventasPorCategoria,
    ventasPorMetodoPago,
    topProductos,
  }
}

// ============================================
// Exportar CSV
// ============================================
export function exportarReporteCSV(reporte: ReporteCompleto) {
  const lineas: string[] = []

  // Encabezado
  lineas.push(`Reporte de ventas - ${reporte.rango.label}`)
  lineas.push(
    `Período: ${reporte.rango.desde.toLocaleDateString('es-ES')} a ${reporte.rango.hasta.toLocaleDateString('es-ES')}`,
  )
  lineas.push('')

  // KPIs
  lineas.push('RESUMEN')
  lineas.push('Métrica,Actual,Anterior,Cambio %')
  lineas.push(
    `Ventas,${reporte.kpis.ventas.actual.toFixed(2)},${reporte.kpis.ventas.anterior.toFixed(2)},${reporte.kpis.ventas.cambio.toFixed(1)}`,
  )
  lineas.push(
    `Pedidos,${reporte.kpis.pedidos.actual},${reporte.kpis.pedidos.anterior},${reporte.kpis.pedidos.cambio.toFixed(1)}`,
  )
  lineas.push(
    `Ticket medio,${reporte.kpis.ticketMedio.actual.toFixed(2)},${reporte.kpis.ticketMedio.anterior.toFixed(2)},${reporte.kpis.ticketMedio.cambio.toFixed(1)}`,
  )
  lineas.push(
    `Unidades,${reporte.kpis.unidadesVendidas.actual},${reporte.kpis.unidadesVendidas.anterior},${reporte.kpis.unidadesVendidas.cambio.toFixed(1)}`,
  )
  lineas.push('')

  // Ventas por día
  lineas.push('VENTAS POR DÍA')
  lineas.push('Fecha,Ventas,Pedidos')
  reporte.ventasPorDia.forEach((d) => {
    lineas.push(`${d.fecha},${d.ventas.toFixed(2)},${d.pedidos}`)
  })
  lineas.push('')

  // Categorías
  lineas.push('VENTAS POR CATEGORÍA')
  lineas.push('Categoría,Total,Unidades')
  reporte.ventasPorCategoria.forEach((c) => {
    lineas.push(`"${c.categoria}",${c.total.toFixed(2)},${c.cantidad}`)
  })
  lineas.push('')

  // Métodos de pago
  lineas.push('MÉTODOS DE PAGO')
  lineas.push('Método,Total,Pedidos,%')
  reporte.ventasPorMetodoPago.forEach((m) => {
    lineas.push(
      `"${m.label}",${m.total.toFixed(2)},${m.cantidad},${m.porcentaje.toFixed(1)}`,
    )
  })
  lineas.push('')

  // Top productos
  lineas.push('TOP PRODUCTOS')
  lineas.push('SKU,Producto,Categoría,Unidades,Ingresos')
  reporte.topProductos.forEach((p) => {
    lineas.push(
      `"${p.sku}","${p.nombre}","${p.categoria}",${p.cantidad},${p.ingresos.toFixed(2)}`,
    )
  })

  const csv = lineas.join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reporte-${reporte.rango.label.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}