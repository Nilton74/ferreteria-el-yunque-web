import type { Rol } from '@/store/authStore'

export interface DashboardConfig {
  mostrarVentas: boolean          // KPIs de ventas/ingresos
  mostrarGanancias: boolean       // Ganancias/costos (dato sensible)
  mostrarPedidos: boolean         // Pedidos del día
  mostrarClientes: boolean        // Clientes nuevos
  mostrarTicket: boolean          // Ticket promedio
  mostrarGraficaVentas: boolean   // Gráfica de evolución
  mostrarCategorias: boolean      // Dona por categorías
  mostrarMetodosPago: boolean     // Barras método pago
  mostrarTopProductos: boolean    // Top productos vendidos
  mostrarStockBajo: boolean       // Alertas de stock
  mostrarUltimosPedidos: boolean  // Últimos pedidos

  // Vista de "héroe" personalizada
  mensajeBienvenida: string
  colorPrimario: 'yunque' | 'green' | 'blue' | 'purple'
}

export const DASHBOARD_POR_ROL: Record<Rol, DashboardConfig> = {
  superadmin: {
    mostrarVentas: true,
    mostrarGanancias: true,
    mostrarPedidos: true,
    mostrarClientes: true,
    mostrarTicket: true,
    mostrarGraficaVentas: true,
    mostrarCategorias: true,
    mostrarMetodosPago: true,
    mostrarTopProductos: true,
    mostrarStockBajo: true,
    mostrarUltimosPedidos: true,
    mensajeBienvenida: 'Vista completa del negocio',
    colorPrimario: 'yunque',
  },

  admin: {
    mostrarVentas: true,
    mostrarGanancias: true,
    mostrarPedidos: true,
    mostrarClientes: true,
    mostrarTicket: true,
    mostrarGraficaVentas: true,
    mostrarCategorias: true,
    mostrarMetodosPago: true,
    mostrarTopProductos: true,
    mostrarStockBajo: true,
    mostrarUltimosPedidos: true,
    mensajeBienvenida: 'Vista completa del negocio',
    colorPrimario: 'yunque',
  },

  vendedor: {
    mostrarVentas: true,
    mostrarGanancias: false,        // ❌ No ve ganancias
    mostrarPedidos: true,
    mostrarClientes: true,
    mostrarTicket: true,
    mostrarGraficaVentas: true,
    mostrarCategorias: true,
    mostrarMetodosPago: true,
    mostrarTopProductos: true,
    mostrarStockBajo: false,        // ❌ No ve inventario
    mostrarUltimosPedidos: true,
    mensajeBienvenida: 'Tu resumen de ventas',
    colorPrimario: 'green',
  },

  almacenero: {
    mostrarVentas: false,           // ❌ No ve ventas
    mostrarGanancias: false,
    mostrarPedidos: false,
    mostrarClientes: false,
    mostrarTicket: false,
    mostrarGraficaVentas: false,
    mostrarCategorias: false,
    mostrarMetodosPago: false,
    mostrarTopProductos: false,
    mostrarStockBajo: true,         // ✅ Solo inventario
    mostrarUltimosPedidos: false,
    mensajeBienvenida: 'Estado del inventario',
    colorPrimario: 'blue',
  },

  cliente: {
    mostrarVentas: false,
    mostrarGanancias: false,
    mostrarPedidos: false,
    mostrarClientes: false,
    mostrarTicket: false,
    mostrarGraficaVentas: false,
    mostrarCategorias: false,
    mostrarMetodosPago: false,
    mostrarTopProductos: false,
    mostrarStockBajo: false,
    mostrarUltimosPedidos: false,
    mensajeBienvenida: '',
    colorPrimario: 'yunque',
  },
}

// Paleta para gráficos - colores diferenciables
export const COLORES_GRAFICOS = [
  '#f0b429', // Ámbar (yunque)
  '#3b82f6', // Azul
  '#10b981', // Verde
  '#ef4444', // Rojo
  '#8b5cf6', // Púrpura
  '#06b6d4', // Cian
  '#ec4899', // Rosa
  '#f97316', // Naranja
  '#6366f1', // Índigo
  '#84cc16', // Lima
]

export const COLORES_METODOS_PAGO: Record<string, string> = {
  efectivo: '#10b981',      // Verde
  tarjeta: '#3b82f6',       // Azul
  transferencia: '#8b5cf6', // Púrpura
  contraentrega: '#f97316', // Naranja
}
