import type { CartItem } from '@/store/cartStore'

export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'pagado'
  | 'preparando'
  | 'enviado'
  | 'entregado'
  | 'cancelado'

export type MetodoEntrega = 'estandar' | 'express' | 'recogida'
export type MetodoPago = 'tarjeta' | 'transferencia' | 'contraentrega'

export interface DireccionEnvio {
  nombre: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  codigoPostal: string
  provincia: string
  notas?: string
}

export interface HistorialEstado {
  estado: EstadoPedido
  fecha: string
  usuario: string
  nota?: string
}

export interface Pedido {
  id: string
  numero: string
  items: CartItem[]
  direccion: DireccionEnvio
  metodoEntrega: MetodoEntrega
  metodoPago: MetodoPago
  subtotal: number
  envio: number
  total: number
  estado: EstadoPedido
  creadoEn: string
  historial: HistorialEstado[]
}

// ---------- Configuración visual de estados ----------
export const ESTADOS: Record<
  EstadoPedido,
  { label: string; color: string; emoji: string }
> = {
  pendiente:  { label: 'Pendiente',  color: 'yellow', emoji: '⏳' },
  confirmado: { label: 'Confirmado', color: 'blue',   emoji: '✓' },
  pagado:     { label: 'Pagado',     color: 'green',  emoji: '💰' },
  preparando: { label: 'Preparando', color: 'purple', emoji: '📦' },
  enviado:    { label: 'Enviado',    color: 'indigo', emoji: '🚚' },
  entregado:  { label: 'Entregado',  color: 'emerald',emoji: '✓✓' },
  cancelado:  { label: 'Cancelado',  color: 'red',    emoji: '✗' },
}

// ---------- Secuencia de estados del flujo ----------
export const FLUJO_ESTADOS: EstadoPedido[] = [
  'pendiente',
  'confirmado',
  'pagado',
  'preparando',
  'enviado',
  'entregado',
]

export const METODO_ENTREGA_LABEL: Record<MetodoEntrega, string> = {
  estandar: 'Envío estándar (3-5 días)',
  express: 'Envío express (24-48h)',
  recogida: 'Recogida en tienda',
}

export const METODO_PAGO_LABEL: Record<MetodoPago, string> = {
  tarjeta: 'Tarjeta de crédito/débito',
  transferencia: 'Transferencia bancaria',
  contraentrega: 'Pago contra entrega',
}

// ---------- Persistencia ----------
const PEDIDOS_KEY = 'yunque-pedidos'
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function generarNumero(): string {
  const n = Math.floor(10000 + Math.random() * 90000)
  return `#${n}`
}

function leerPedidos(): Pedido[] {
  try {
    const raw = localStorage.getItem(PEDIDOS_KEY)
    if (!raw) return seedPedidos()
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedPedidos()
  } catch {
    return seedPedidos()
  }
}

function guardarPedidos(pedidos: Pedido[]) {
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos))
}

// ---------- Seed inicial (si no hay pedidos) ----------
function seedPedidos(): Pedido[] {
  const hoy = new Date()
  const dias = (n: number) => {
    const d = new Date(hoy)
    d.setDate(d.getDate() - n)
    return d.toISOString()
  }

  const pedidos: Pedido[] = [
    {
      id: 'demo-1',
      numero: '#10045',
      items: [
        { id: 'p1', sku: 'BOS-TP-001', nombre: 'Taladro Percutor Bosch 800W', precio: 99.9, imagen: 'https://picsum.photos/seed/bosch/200', cantidad: 1 },
        { id: 'p5', sku: 'PHI-BOM-005', nombre: 'Bombilla LED Philips 9W', precio: 4.9, imagen: 'https://picsum.photos/seed/philips/200', cantidad: 4 },
        { id: 'p8', sku: '3M-MAS-008', nombre: 'Mascarilla 3M FFP2 (pack 5)', precio: 9.9, imagen: 'https://picsum.photos/seed/3m/200', cantidad: 2 },
      ],
      direccion: { nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '+34 600 111 222', direccion: 'Calle Mayor 45, 3ºA', ciudad: 'Madrid', codigoPostal: '28013', provincia: 'Madrid' },
      metodoEntrega: 'estandar',
      metodoPago: 'tarjeta',
      subtotal: 145.5,
      envio: 0,
      total: 145.5,
      estado: 'pagado',
      creadoEn: dias(0),
      historial: [
        { estado: 'pendiente', fecha: dias(0), usuario: 'Sistema' },
        { estado: 'confirmado', fecha: dias(0), usuario: 'Sistema' },
        { estado: 'pagado', fecha: dias(0), usuario: 'Stripe' },
      ],
    },
    {
      id: 'demo-2',
      numero: '#10044',
      items: [
        { id: 'p5', sku: 'PHI-BOM-005', nombre: 'Bombilla LED Philips 9W', precio: 4.9, imagen: 'https://picsum.photos/seed/philips/200', cantidad: 10 },
      ],
      direccion: { nombre: 'María López', email: 'maria@example.com', telefono: '+34 600 333 444', direccion: 'Av. Libertad 12', ciudad: 'Barcelona', codigoPostal: '08012', provincia: 'Barcelona' },
      metodoEntrega: 'estandar',
      metodoPago: 'transferencia',
      subtotal: 49,
      envio: 4.95,
      total: 53.95,
      estado: 'pendiente',
      creadoEn: dias(1),
      historial: [
        { estado: 'pendiente', fecha: dias(1), usuario: 'Sistema' },
      ],
    },
    {
      id: 'demo-3',
      numero: '#10043',
      items: [
        { id: 'p3', sku: 'DEW-TAL-003', nombre: 'Taladro Inalámbrico DeWalt 20V', precio: 159, imagen: 'https://picsum.photos/seed/dewalt/200', cantidad: 2 },
        { id: 'p2', sku: 'MAK-AM-002', nombre: 'Amoladora Angular Makita 720W', precio: 89.5, imagen: 'https://picsum.photos/seed/makita/200', cantidad: 1 },
      ],
      direccion: { nombre: 'Pedro García', email: 'pedro@example.com', telefono: '+34 600 555 666', direccion: 'Calle Sol 8', ciudad: 'Valencia', codigoPostal: '46002', provincia: 'Valencia' },
      metodoEntrega: 'express',
      metodoPago: 'tarjeta',
      subtotal: 407.5,
      envio: 9.95,
      total: 417.45,
      estado: 'enviado',
      creadoEn: dias(2),
      historial: [
        { estado: 'pendiente', fecha: dias(2), usuario: 'Sistema' },
        { estado: 'confirmado', fecha: dias(2), usuario: 'Sistema' },
        { estado: 'pagado', fecha: dias(2), usuario: 'Stripe' },
        { estado: 'preparando', fecha: dias(1), usuario: 'Admin' },
        { estado: 'enviado', fecha: dias(0), usuario: 'Admin' },
      ],
    },
    {
      id: 'demo-4',
      numero: '#10042',
      items: [
        { id: 'p6', sku: 'TRU-CAB-006', nombre: 'Cable Eléctrico 2x2.5mm 100m', precio: 74.9, imagen: 'https://picsum.photos/seed/cable/200', cantidad: 1 },
        { id: 'p7', sku: 'SKA-ADH-007', nombre: 'SikaBond Adhesivo Universal 300ml', precio: 12.9, imagen: 'https://picsum.photos/seed/sika/200', cantidad: 3 },
      ],
      direccion: { nombre: 'Ana Martín', email: 'ana@example.com', telefono: '+34 600 777 888', direccion: 'Calle Luna 22', ciudad: 'Sevilla', codigoPostal: '41001', provincia: 'Sevilla' },
      metodoEntrega: 'estandar',
      metodoPago: 'tarjeta',
      subtotal: 113.6,
      envio: 0,
      total: 113.6,
      estado: 'preparando',
      creadoEn: dias(3),
      historial: [
        { estado: 'pendiente', fecha: dias(3), usuario: 'Sistema' },
        { estado: 'confirmado', fecha: dias(3), usuario: 'Sistema' },
        { estado: 'pagado', fecha: dias(3), usuario: 'Stripe' },
        { estado: 'preparando', fecha: dias(0), usuario: 'Admin' },
      ],
    },
    {
      id: 'demo-5',
      numero: '#10041',
      items: [
        { id: 'p4', sku: 'STA-CAJ-004', nombre: 'Caja de Herramientas Stanley 19"', precio: 45.9, imagen: 'https://picsum.photos/seed/stanley/200', cantidad: 2 },
      ],
      direccion: { nombre: 'Luis Sánchez', email: 'luis@example.com', telefono: '+34 600 999 000', direccion: 'Calle Río 5', ciudad: 'Bilbao', codigoPostal: '48001', provincia: 'Bizkaia' },
      metodoEntrega: 'recogida',
      metodoPago: 'contraentrega',
      subtotal: 91.8,
      envio: 0,
      total: 91.8,
      estado: 'entregado',
      creadoEn: dias(7),
      historial: [
        { estado: 'pendiente', fecha: dias(7), usuario: 'Sistema' },
        { estado: 'confirmado', fecha: dias(7), usuario: 'Sistema' },
        { estado: 'pagado', fecha: dias(6), usuario: 'Admin' },
        { estado: 'preparando', fecha: dias(6), usuario: 'Admin' },
        { estado: 'enviado', fecha: dias(5), usuario: 'Admin' },
        { estado: 'entregado', fecha: dias(4), usuario: 'Admin' },
      ],
    },
  ]

  guardarPedidos(pedidos)
  return pedidos
}

// ---------- API mock ----------
export async function crearPedido(data: {
  items: CartItem[]
  direccion: DireccionEnvio
  metodoEntrega: MetodoEntrega
  metodoPago: MetodoPago
  subtotal: number
  envio: number
}): Promise<Pedido> {
  await delay(900)

  const estadoInicial: EstadoPedido =
    data.metodoPago === 'tarjeta' ? 'pagado' : 'pendiente'

  const pedido: Pedido = {
    id: crypto.randomUUID(),
    numero: generarNumero(),
    items: data.items,
    direccion: data.direccion,
    metodoEntrega: data.metodoEntrega,
    metodoPago: data.metodoPago,
    subtotal: data.subtotal,
    envio: data.envio,
    total: data.subtotal + data.envio,
    estado: estadoInicial,
    creadoEn: new Date().toISOString(),
    historial: [
      { estado: 'pendiente', fecha: new Date().toISOString(), usuario: 'Sistema' },
      ...(estadoInicial !== 'pendiente'
        ? [{ estado: estadoInicial, fecha: new Date().toISOString(), usuario: 'Stripe' }]
        : []),
    ],
  }

  const pedidos = leerPedidos()
  pedidos.unshift(pedido)
  guardarPedidos(pedidos)

  return pedido
}

export function getPedidos(): Pedido[] {
  return leerPedidos()
}

export function getPedidoById(id: string): Pedido | undefined {
  return leerPedidos().find((p) => p.id === id)
}

export function actualizarEstadoPedido(
  id: string,
  nuevoEstado: EstadoPedido,
  usuario: string,
  nota?: string,
): Pedido | undefined {
  const pedidos = leerPedidos()
  const idx = pedidos.findIndex((p) => p.id === id)
  if (idx < 0) return undefined

  pedidos[idx] = {
    ...pedidos[idx],
    estado: nuevoEstado,
    historial: [
      ...pedidos[idx].historial,
      { estado: nuevoEstado, fecha: new Date().toISOString(), usuario, nota },
    ],
  }

  guardarPedidos(pedidos)
  return pedidos[idx]
}