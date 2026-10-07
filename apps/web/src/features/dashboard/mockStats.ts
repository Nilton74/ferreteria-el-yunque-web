export interface KpiData {
  ventasHoy: number
  ventasHoyCambio: number
  pedidosPendientes: number
  pedidosHoy: number
  gananciaMes: number
  gananciaMesCambio: number
  clientesTotales: number
  clientesNuevos: number
  stockBajo: number
  ticketPromedio: number
}

export interface VentaDia {
  dia: string
  fecha: string
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
}

export interface TopProducto {
  id: string
  nombre: string
  sku: string
  vendidos: number
  ingresos: number
  imagen: string
}

export interface StockBajo {
  id: string
  nombre: string
  sku: string
  stock: number
  stockMinimo: number
}

export const KPIS: KpiData = {
  ventasHoy: 4285.9,
  ventasHoyCambio: 12.4,
  pedidosPendientes: 8,
  pedidosHoy: 24,
  gananciaMes: 17430,
  gananciaMesCambio: 8.2,
  clientesTotales: 842,
  clientesNuevos: 17,
  stockBajo: 6,
  ticketPromedio: 89.5,
}

export const VENTAS_7_DIAS: VentaDia[] = [
  { dia: 'Lun', fecha: '30 sep', ventas: 2650, pedidos: 18 },
  { dia: 'Mar', fecha: '1 oct',  ventas: 3120, pedidos: 22 },
  { dia: 'Mié', fecha: '2 oct',  ventas: 2890, pedidos: 19 },
  { dia: 'Jue', fecha: '3 oct',  ventas: 3980, pedidos: 27 },
  { dia: 'Vie', fecha: '4 oct',  ventas: 4285, pedidos: 24 },
  { dia: 'Sáb', fecha: '5 oct',  ventas: 5120, pedidos: 31 },
  { dia: 'Dom', fecha: '6 oct',  ventas: 1850, pedidos: 9 },
]

// Ventas por categoría (para dona)
export const VENTAS_CATEGORIA: VentaCategoria[] = [
  { categoria: 'Herramientas', emoji: '🔧', total: 5820, cantidad: 48 },
  { categoria: 'Electricidad', emoji: '⚡', total: 3140, cantidad: 92 },
  { categoria: 'Construcción', emoji: '🧱', total: 2450, cantidad: 34 },
  { categoria: 'Pinturas',     emoji: '🎨', total: 1890, cantidad: 41 },
  { categoria: 'Plomería',     emoji: '🚿', total: 1520, cantidad: 28 },
  { categoria: 'Adhesivos',    emoji: '🧴', total: 980,  cantidad: 55 },
]

// Métodos de pago
export const VENTAS_METODO: VentaMetodoPago[] = [
  { metodo: 'efectivo',      label: 'Efectivo',      total: 6840, cantidad: 82 },
  { metodo: 'tarjeta',       label: 'Tarjeta',       total: 5120, cantidad: 64 },
  { metodo: 'transferencia', label: 'Transferencia', total: 2340, cantidad: 28 },
  { metodo: 'contraentrega', label: 'Contraentrega', total: 1500, cantidad: 18 },
]

export const TOP_PRODUCTOS: TopProducto[] = [
  { id: 'p1', nombre: 'Taladro Percutor Bosch 800W', sku: 'BOS-TP-001', vendidos: 42, ingresos: 4195.8, imagen: 'https://picsum.photos/seed/bosch-t/100/100' },
  { id: 'p3', nombre: 'Taladro Inalámbrico DeWalt 20V', sku: 'DEW-TAL-003', vendidos: 28, ingresos: 4452, imagen: 'https://picsum.photos/seed/dewalt-t/100/100' },
  { id: 'p5', nombre: 'Bombilla LED Philips 9W E27', sku: 'PHI-BOM-005', vendidos: 156, ingresos: 764.4, imagen: 'https://picsum.photos/seed/philips-t/100/100' },
  { id: 'p2', nombre: 'Amoladora Angular Makita 720W', sku: 'MAK-AM-002', vendidos: 24, ingresos: 2148, imagen: 'https://picsum.photos/seed/makita-t/100/100' },
  { id: 'p8', nombre: 'Mascarilla 3M FFP2 (pack 5)', sku: '3M-MAS-008', vendidos: 88, ingresos: 871.2, imagen: 'https://picsum.photos/seed/3m-t/100/100' },
]

export const STOCK_BAJO: StockBajo[] = [
  { id: 'p3', nombre: 'Taladro Inalámbrico DeWalt 20V', sku: 'DEW-TAL-003', stock: 7,  stockMinimo: 3 },
  { id: 'p2', nombre: 'Amoladora Angular Makita 720W',  sku: 'MAK-AM-002', stock: 12, stockMinimo: 4 },
  { id: 'p4', nombre: 'Caja de Herramientas Stanley 19"', sku: 'STA-CAJ-004', stock: 25, stockMinimo: 6 },
]
