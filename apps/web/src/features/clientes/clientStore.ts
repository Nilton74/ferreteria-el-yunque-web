import { getPedidos, type Pedido } from '@/features/orders/mockOrders'

export type Segmento = 'vip' | 'frecuente' | 'nuevo' | 'inactivo' | 'regular'

export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  ciudad: string
  provincia: string
  direccion: string
  codigoPostal: string
  creadoEn: string
  // Derivados de pedidos
  pedidos: Pedido[]
  totalGastado: number
  ticketPromedio: number
  ultimaCompra: string | null
  segmento: Segmento
  productosFavoritos: { nombre: string; cantidad: number }[]
}

const CLIENTES_KEY = 'yunque-clientes'

interface ClienteBase {
  id: string
  nombre: string
  email: string
  telefono: string
  ciudad: string
  provincia: string
  direccion: string
  codigoPostal: string
  creadoEn: string
}

// ---------- Clientes semilla (además de los que vienen de pedidos) ----------
const CLIENTES_SEMILLA: ClienteBase[] = [
  { id: 'c1', nombre: 'Juan Pérez',    email: 'juan@example.com',    telefono: '+34 600 111 222', ciudad: 'Madrid',    provincia: 'Madrid',    direccion: 'Calle Mayor 45, 3ºA', codigoPostal: '28013', creadoEn: diasAtras(120) },
  { id: 'c2', nombre: 'María López',   email: 'maria@example.com',   telefono: '+34 600 333 444', ciudad: 'Barcelona', provincia: 'Barcelona', direccion: 'Av. Libertad 12',     codigoPostal: '08012', creadoEn: diasAtras(90) },
  { id: 'c3', nombre: 'Pedro García',  email: 'pedro@example.com',   telefono: '+34 600 555 666', ciudad: 'Valencia',  provincia: 'Valencia',  direccion: 'Calle Sol 8',         codigoPostal: '46002', creadoEn: diasAtras(60) },
  { id: 'c4', nombre: 'Ana Martín',    email: 'ana@example.com',     telefono: '+34 600 777 888', ciudad: 'Sevilla',   provincia: 'Sevilla',   direccion: 'Calle Luna 22',       codigoPostal: '41001', creadoEn: diasAtras(45) },
  { id: 'c5', nombre: 'Luis Sánchez',  email: 'luis@example.com',    telefono: '+34 600 999 000', ciudad: 'Bilbao',    provincia: 'Bizkaia',   direccion: 'Calle Río 5',         codigoPostal: '48001', creadoEn: diasAtras(200) },
  { id: 'c6', nombre: 'Carmen Ruiz',   email: 'carmen@example.com',  telefono: '+34 600 121 314', ciudad: 'Zaragoza',  provincia: 'Zaragoza',  direccion: 'Calle Pilar 3',       codigoPostal: '50001', creadoEn: diasAtras(30) },
  { id: 'c7', nombre: 'Javier Ramos',  email: 'javier@example.com',  telefono: '+34 600 151 617', ciudad: 'Málaga',    provincia: 'Málaga',    direccion: 'Paseo Mar 100',       codigoPostal: '29001', creadoEn: diasAtras(15) },
  { id: 'c8', nombre: 'Lucía Fernández', email: 'lucia@example.com', telefono: '+34 600 181 920', ciudad: 'Murcia',    provincia: 'Murcia',    direccion: 'Calle Sol 45',        codigoPostal: '30001', creadoEn: diasAtras(5)  },
  { id: 'c9', nombre: 'Carlos Ortega', email: 'carlos@example.com',  telefono: '+34 600 212 223', ciudad: 'Granada',   provincia: 'Granada',   direccion: 'Av. Constitución 22', codigoPostal: '18001', creadoEn: diasAtras(240) },
  { id: 'c10', nombre: 'Elena Navarro',email: 'elena@example.com',   telefono: '+34 600 242 526', ciudad: 'Alicante',  provincia: 'Alicante',  direccion: 'Calle Mar 8',         codigoPostal: '03001', creadoEn: diasAtras(75) },
]

function diasAtras(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// ---------- Fusionar pedidos con clientes ----------
function construirClientes(): Cliente[] {
  const pedidos = getPedidos()
  const clientesBase: ClienteBase[] = [...CLIENTES_SEMILLA]

  // Añadir clientes que aparecen en pedidos pero no están en la semilla
  pedidos.forEach((p) => {
    const existe = clientesBase.some(
      (c) => c.email.toLowerCase() === p.direccion.email.toLowerCase(),
    )
    if (!existe) {
      clientesBase.push({
        id: `ped-${p.id}`,
        nombre: p.direccion.nombre,
        email: p.direccion.email,
        telefono: p.direccion.telefono,
        ciudad: p.direccion.ciudad,
        provincia: p.direccion.provincia,
        direccion: p.direccion.direccion,
        codigoPostal: p.direccion.codigoPostal,
        creadoEn: p.creadoEn,
      })
    }
  })

  return clientesBase.map((base) => {
    const susPedidos = pedidos
      .filter((p) => p.direccion.email.toLowerCase() === base.email.toLowerCase())
      .sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
      )

    const totalGastado = susPedidos.reduce((acc, p) => acc + p.total, 0)
    const ticketPromedio = susPedidos.length > 0 ? totalGastado / susPedidos.length : 0

    // Productos favoritos
    const mapa: Record<string, { nombre: string; cantidad: number }> = {}
    susPedidos.forEach((p) => {
      p.items.forEach((item) => {
        if (!mapa[item.id]) mapa[item.id] = { nombre: item.nombre, cantidad: 0 }
        mapa[item.id].cantidad += item.cantidad
      })
    })
    const productosFavoritos = Object.values(mapa)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3)

    // Segmento
    const ahora = Date.now()
    const ultima = susPedidos[0]?.creadoEn ?? null
    const diasSinComprar = ultima
      ? Math.floor((ahora - new Date(ultima).getTime()) / 86400000)
      : 999
    const diasDesdeRegistro = Math.floor(
      (ahora - new Date(base.creadoEn).getTime()) / 86400000,
    )

    let segmento: Segmento = 'regular'
    if (diasDesdeRegistro <= 30 && susPedidos.length <= 1) segmento = 'nuevo'
    else if (diasSinComprar > 120) segmento = 'inactivo'
    else if (totalGastado >= 1000 || susPedidos.length >= 5) segmento = 'vip'
    else if (susPedidos.length >= 3 || totalGastado >= 300) segmento = 'frecuente'

    return {
      ...base,
      pedidos: susPedidos,
      totalGastado,
      ticketPromedio,
      ultimaCompra: ultima,
      segmento,
      productosFavoritos,
    }
  })
}

export function getClientes(): Cliente[] {
  // Guardamos en localStorage solo como caché, pero recalculamos siempre
  // para reflejar los pedidos más recientes
  const clientes = construirClientes()
  try {
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes.map((c) => ({ ...c, pedidos: [] }))))
  } catch {
    // ignorar
  }
  return clientes
}

export function getClienteById(id: string): Cliente | undefined {
  return getClientes().find((c) => c.id === id)
}

// ---------- Configuración visual de segmentos ----------
export const SEGMENTOS: Record<
  Segmento,
  { label: string; color: string; emoji: string }
> = {
  vip:        { label: 'VIP',        color: 'yunque',  emoji: '👑' },
  frecuente:  { label: 'Frecuente',  color: 'green',   emoji: '⭐' },
  nuevo:      { label: 'Nuevo',      color: 'blue',    emoji: '✨' },
  inactivo:   { label: 'Inactivo',   color: 'red',     emoji: '💤' },
  regular:    { label: 'Regular',    color: 'neutral', emoji: '👤' },
}