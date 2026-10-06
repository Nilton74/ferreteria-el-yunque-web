import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TipoMovimientoCaja =
  | 'apertura'
  | 'venta'
  | 'retiro'
  | 'ingreso'
  | 'gasto'

export type MetodoPagoCaja = 'efectivo' | 'tarjeta' | 'transferencia' | 'mixto'

export interface MovimientoCaja {
  id: string
  turnoId: string
  tipo: TipoMovimientoCaja
  concepto: string
  monto: number
  metodo?: MetodoPagoCaja
  referencia?: string
  usuario: string
  fecha: string
  notas?: string
}

export interface TurnoCaja {
  id: string
  numero: number
  usuarioApertura: string
  usuarioCierre?: string
  saldoInicial: number
  notasApertura?: string
  fechaApertura: string
  fechaCierre?: string
  estado: 'abierto' | 'cerrado'
  movimientos: MovimientoCaja[]
  efectivoContado?: number
  diferencia?: number
  notasCierre?: string
}

export interface TotalesCaja {
  ventasEfectivo: number
  ventasTarjeta: number
  ventasTransferencia: number
  totalVentas: number
  cantidadVentas: number
  cantidadEfectivo: number
  cantidadTarjeta: number
  cantidadTransferencia: number
  retiros: number
  ingresos: number
  gastos: number
  efectivoEsperado: number
}

interface CajaState {
  turnos: TurnoCaja[]

  abrirTurno: (data: {
    saldoInicial: number
    usuario: string
    notas?: string
  }) => TurnoCaja

  cerrarTurno: (data: {
    turnoId: string
    efectivoContado: number
    usuario: string
    notas?: string
  }) => void

  registrarMovimiento: (data: {
    turnoId: string
    tipo: TipoMovimientoCaja
    concepto: string
    monto: number
    metodo?: MetodoPagoCaja
    referencia?: string
    usuario: string
    notas?: string
  }) => void

  registrarVentaPOS: (data: {
    monto: number
    metodo: MetodoPagoCaja
    referencia: string
    usuario: string
  }) => void

  calcularTotales: (turnoId: string) => TotalesCaja
}

const TOTALES_VACIOS: TotalesCaja = {
  ventasEfectivo: 0,
  ventasTarjeta: 0,
  ventasTransferencia: 0,
  totalVentas: 0,
  cantidadVentas: 0,
  cantidadEfectivo: 0,
  cantidadTarjeta: 0,
  cantidadTransferencia: 0,
  retiros: 0,
  ingresos: 0,
  gastos: 0,
  efectivoEsperado: 0,
}

export const useCajaStore = create<CajaState>()(
  persist(
    (set, get) => ({
      turnos: [],

      // ============================================
      // Abrir turno
      // ============================================
      abrirTurno: ({ saldoInicial, usuario, notas }) => {
        const turnos = get().turnos
        const abierto = turnos.find((t) => t.estado === 'abierto')
        if (abierto) throw new Error('Ya hay un turno abierto')

        const nuevoNumero =
          turnos.length > 0 ? Math.max(...turnos.map((t) => t.numero)) + 1 : 1

        const nuevoId = crypto.randomUUID()

        const movApertura: MovimientoCaja = {
          id: crypto.randomUUID(),
          turnoId: nuevoId,
          tipo: 'apertura',
          concepto: 'Apertura de caja',
          monto: saldoInicial,
          usuario,
          fecha: new Date().toISOString(),
          notas,
        }

        const nuevo: TurnoCaja = {
          id: nuevoId,
          numero: nuevoNumero,
          usuarioApertura: usuario,
          saldoInicial,
          notasApertura: notas,
          fechaApertura: new Date().toISOString(),
          estado: 'abierto',
          movimientos: [movApertura],
        }

        set({ turnos: [nuevo, ...turnos] })
        return nuevo
      },

      // ============================================
      // Cerrar turno
      // ============================================
      cerrarTurno: ({ turnoId, efectivoContado, usuario, notas }) => {
        const turno = get().turnos.find((t) => t.id === turnoId)
        if (!turno) throw new Error('Turno no encontrado')

        const totales = get().calcularTotales(turnoId)
        const diferencia = efectivoContado - totales.efectivoEsperado

        set({
          turnos: get().turnos.map((t) =>
            t.id === turnoId
              ? {
                  ...t,
                  estado: 'cerrado',
                  fechaCierre: new Date().toISOString(),
                  usuarioCierre: usuario,
                  efectivoContado,
                  diferencia,
                  notasCierre: notas,
                }
              : t,
          ),
        })
      },

      // ============================================
      // Registrar movimiento manual
      // ============================================
      registrarMovimiento: ({
        turnoId,
        tipo,
        concepto,
        monto,
        metodo,
        referencia,
        usuario,
        notas,
      }) => {
        const mov: MovimientoCaja = {
          id: crypto.randomUUID(),
          turnoId,
          tipo,
          concepto,
          monto,
          metodo,
          referencia,
          usuario,
          fecha: new Date().toISOString(),
          notas,
        }
        set({
          turnos: get().turnos.map((t) =>
            t.id === turnoId
              ? { ...t, movimientos: [...t.movimientos, mov] }
              : t,
          ),
        })
      },

      // ============================================
      // Registrar venta desde POS
      // ============================================
      registrarVentaPOS: ({ monto, metodo, referencia, usuario }) => {
        const abierto = get().turnos.find((t) => t.estado === 'abierto')
        if (!abierto) return

        const mov: MovimientoCaja = {
          id: crypto.randomUUID(),
          turnoId: abierto.id,
          tipo: 'venta',
          concepto: 'Venta POS ' + referencia,
          monto,
          metodo,
          referencia,
          usuario,
          fecha: new Date().toISOString(),
        }

        set({
          turnos: get().turnos.map((t) =>
            t.id === abierto.id
              ? { ...t, movimientos: [...t.movimientos, mov] }
              : t,
          ),
        })
      },

      // ============================================
      // Calcular totales del turno
      // ============================================
      calcularTotales: (turnoId) => {
        const turno = get().turnos.find((t) => t.id === turnoId)
        if (!turno) return TOTALES_VACIOS

        const movs = turno.movimientos
        const ventas = movs.filter((m) => m.tipo === 'venta')

        const ventasEfectivo = ventas
          .filter((m) => m.metodo === 'efectivo')
          .reduce((a, m) => a + m.monto, 0)
        const ventasTarjeta = ventas
          .filter((m) => m.metodo === 'tarjeta')
          .reduce((a, m) => a + m.monto, 0)
        const ventasTransferencia = ventas
          .filter((m) => m.metodo === 'transferencia')
          .reduce((a, m) => a + m.monto, 0)

        const cantidadEfectivo = ventas.filter(
          (m) => m.metodo === 'efectivo',
        ).length
        const cantidadTarjeta = ventas.filter(
          (m) => m.metodo === 'tarjeta',
        ).length
        const cantidadTransferencia = ventas.filter(
          (m) => m.metodo === 'transferencia',
        ).length

        const retiros = movs
          .filter((m) => m.tipo === 'retiro')
          .reduce((a, m) => a + m.monto, 0)
        const ingresos = movs
          .filter((m) => m.tipo === 'ingreso')
          .reduce((a, m) => a + m.monto, 0)
        const gastos = movs
          .filter((m) => m.tipo === 'gasto')
          .reduce((a, m) => a + m.monto, 0)

        const efectivoEsperado =
          turno.saldoInicial + ventasEfectivo + ingresos - retiros - gastos

        return {
          ventasEfectivo,
          ventasTarjeta,
          ventasTransferencia,
          totalVentas: ventasEfectivo + ventasTarjeta + ventasTransferencia,
          cantidadVentas: ventas.length,
          cantidadEfectivo,
          cantidadTarjeta,
          cantidadTransferencia,
          retiros,
          ingresos,
          gastos,
          efectivoEsperado,
        }
      },
    }),
    { name: 'yunque-caja' },
  ),
)

// ============================================
// Configuración visual
// ============================================
export const TIPOS_MOV_CAJA: Record<
  TipoMovimientoCaja,
  { label: string; emoji: string; color: string; signo: 1 | -1 | 0 }
> = {
  apertura: { label: 'Apertura', emoji: '🔓', color: 'yunque', signo: 0 },
  venta:    { label: 'Venta',    emoji: '💰', color: 'green',  signo: 1 },
  retiro:   { label: 'Retiro',   emoji: '📤', color: 'red',    signo: -1 },
  ingreso:  { label: 'Ingreso',  emoji: '📥', color: 'blue',   signo: 1 },
  gasto:    { label: 'Gasto',    emoji: '🧾', color: 'orange', signo: -1 },
}

export const METODOS_PAGO_CAJA: Record<MetodoPagoCaja, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  mixto: 'Mixto',
}
