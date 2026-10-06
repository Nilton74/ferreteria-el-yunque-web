import { useState } from 'react'
import {
  Lock, Unlock, Wallet, Banknote, CreditCard, Building2,
  ArrowUpCircle, ArrowDownCircle, Plus, CheckCircle2, Clock,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { AbrirCajaModal } from '@/components/admin/caja/AbrirCajaModal'
import { MovimientoCajaModal } from '@/components/admin/caja/MovimientoCajaModal'
import { CerrarCajaModal } from '@/components/admin/caja/CerrarCajaModal'
import {
  useCajaStore,
  TIPOS_MOV_CAJA,
  METODOS_PAGO_CAJA,
  type TurnoCaja,
  type MovimientoCaja,
  type TotalesCaja,
} from '@/features/caja/cajaStore'
import { formatCurrency, cn } from '@/lib/utils'

export default function CajaPage() {
  // ⚠️ CRÍTICO: usar el selector para que sea REACTIVO
  const turnos = useCajaStore((s) => s.turnos)
  const calcularTotales = useCajaStore((s) => s.calcularTotales)

  const turnoAbierto = turnos.find((t) => t.estado === 'abierto')
  const turnosCerrados = turnos
    .filter((t) => t.estado === 'cerrado')
    .sort(
      (a, b) =>
        new Date(b.fechaCierre ?? b.fechaApertura).getTime() -
        new Date(a.fechaCierre ?? a.fechaApertura).getTime(),
    )

  const [abrirOpen, setAbrirOpen] = useState(false)
  const [movOpen, setMovOpen] = useState(false)
  const [cerrarOpen, setCerrarOpen] = useState(false)

  // ============ SIN TURNO ABIERTO ============
  if (!turnoAbierto) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Caja</h1>
          <p className="text-sm text-ink-500 mt-1">
            Gestion de turnos de caja y arqueo
          </p>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-ink-200 bg-white p-12 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-yunque-100 grid place-items-center">
            <Lock className="h-10 w-10 text-yunque-700" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-ink-900">Caja cerrada</h2>
          <p className="mt-2 text-ink-500 max-w-md mx-auto">
            Para empezar a registrar ventas y movimientos, abre un nuevo turno
            con el saldo inicial que hay en caja.
          </p>

          <Button size="lg" onClick={() => setAbrirOpen(true)} className="mt-8">
            <Unlock className="h-5 w-5 mr-2" />
            Abrir caja
          </Button>
        </div>

        {turnosCerrados.length > 0 && (
          <HistorialTurnos turnos={turnosCerrados} calcularTotales={calcularTotales} />
        )}

        <AbrirCajaModal open={abrirOpen} onClose={() => setAbrirOpen(false)} />
      </div>
    )
  }

  // ============ CON TURNO ABIERTO ============
  const totales = calcularTotales(turnoAbierto.id)
  const fechaApertura = new Date(turnoAbierto.fechaApertura).toLocaleString(
    'es-ES',
    { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
  )

  const movimientos = [...turnoAbierto.movimientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Caja</h1>
          <p className="text-sm text-ink-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Turno #{String(turnoAbierto.numero).padStart(3, '0')} abierto
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Desde {fechaApertura}
            </span>
            <span>·</span>
            <span>{turnoAbierto.usuarioApertura}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setMovOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Movimiento
          </Button>
          <Button onClick={() => setCerrarOpen(true)}>
            <Lock className="h-4 w-4 mr-2" />
            Cerrar caja
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ventas del turno"
          value={formatCurrency(totales.totalVentas)}
          icon={Banknote}
          color="green"
          sub={
            totales.cantidadVentas +
            ' ' +
            (totales.cantidadVentas === 1 ? 'venta realizada' : 'ventas realizadas')
          }
        />
        <KpiCard
          label="Efectivo esperado"
          value={formatCurrency(totales.efectivoEsperado)}
          icon={Wallet}
          color="yunque"
          sub={'Saldo inicial: ' + formatCurrency(turnoAbierto.saldoInicial)}
        />
        <KpiCard
          label="Ingresos manuales"
          value={formatCurrency(totales.ingresos)}
          icon={ArrowDownCircle}
          color="blue"
          sub="Cambio, banco, caja fuerte"
        />
        <KpiCard
          label="Salidas"
          value={formatCurrency(totales.retiros + totales.gastos)}
          icon={ArrowUpCircle}
          color="red"
          sub={
            'Retiros: ' + formatCurrency(totales.retiros) +
            ' · Gastos: ' + formatCurrency(totales.gastos)
          }
        />
      </div>

      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-ink-900">
              Ventas por metodo de pago
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              {totales.cantidadVentas}{' '}
              {totales.cantidadVentas === 1 ? 'venta' : 'ventas'} ·{' '}
              {formatCurrency(totales.totalVentas)} total
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <MetodoCard icon={Banknote} label="Efectivo" value={totales.ventasEfectivo} cantidad={totales.cantidadEfectivo} total={totales.totalVentas} color="green" />
          <MetodoCard icon={CreditCard} label="Tarjeta" value={totales.ventasTarjeta} cantidad={totales.cantidadTarjeta} total={totales.totalVentas} color="blue" />
          <MetodoCard icon={Building2} label="Transferencia" value={totales.ventasTransferencia} cantidad={totales.cantidadTransferencia} total={totales.totalVentas} color="purple" />
        </div>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-ink-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-ink-900">Movimientos del turno</h2>
            <p className="text-xs text-ink-500 mt-0.5">
              {movimientos.length}{' '}
              {movimientos.length === 1 ? 'movimiento' : 'movimientos'}
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setMovOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Registrar
          </Button>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 border-b border-ink-200 sticky top-0">
              <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                <th className="p-3 font-semibold">Hora</th>
                <th className="p-3 font-semibold">Tipo</th>
                <th className="p-3 font-semibold">Concepto</th>
                <th className="p-3 font-semibold hidden md:table-cell">Usuario</th>
                <th className="p-3 font-semibold text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {movimientos.map((mov) => (
                <MovimientoRow key={mov.id} movimiento={mov} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MovimientoCajaModal open={movOpen} onClose={() => setMovOpen(false)} turnoId={turnoAbierto.id} />
      <CerrarCajaModal open={cerrarOpen} onClose={() => setCerrarOpen(false)} turnoId={turnoAbierto.id} />
    </div>
  )
}

function KpiCard({ label, value, icon: Icon, color = 'yunque', sub }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; color?: 'yunque' | 'green' | 'blue' | 'red'; sub?: string }) {
  const colores = { yunque: 'bg-yunque-50 text-yunque-700', green: 'bg-green-50 text-green-700', blue: 'bg-blue-50 text-blue-700', red: 'bg-red-50 text-red-700' }
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className={cn('h-10 w-10 rounded-xl grid place-items-center', colores[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xs font-bold text-ink-500 uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-400">{sub}</p>}
    </div>
  )
}

function MetodoCard({ icon: Icon, label, value, cantidad, total, color = 'yunque' }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; cantidad: number; total: number; color?: 'yunque' | 'green' | 'blue' | 'purple' }) {
  const porcentaje = total > 0 ? (value / total) * 100 : 0
  const colores = {
    yunque: { icon: 'text-yunque-700', bar: 'bg-yunque-500' },
    green: { icon: 'text-green-600', bar: 'bg-green-500' },
    blue: { icon: 'text-blue-600', bar: 'bg-blue-500' },
    purple: { icon: 'text-purple-600', bar: 'bg-purple-500' },
  }
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-ink-50 grid place-items-center">
            <Icon className={cn('h-4 w-4', colores[color].icon)} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">{label}</p>
            <p className="text-[11px] text-ink-500">
              {cantidad} {cantidad === 1 ? 'venta' : 'ventas'}
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-ink-500">
          {cantidad > 0 ? porcentaje.toFixed(1) + '%' : '—'}
        </span>
      </div>
      <p className="text-2xl font-black text-ink-900">{formatCurrency(value)}</p>
      <div className="mt-3 h-1.5 rounded-full bg-ink-100 overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', colores[color].bar)} style={{ width: porcentaje + '%' }} />
      </div>
    </div>
  )
}

function MovimientoRow({ movimiento }: { movimiento: MovimientoCaja }) {
  const cfg = TIPOS_MOV_CAJA[movimiento.tipo]
  const hora = new Date(movimiento.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  const esEntrada = movimiento.tipo === 'venta' || movimiento.tipo === 'ingreso' || movimiento.tipo === 'apertura'
  const esSalida = movimiento.tipo === 'retiro' || movimiento.tipo === 'gasto'
  return (
    <tr className="hover:bg-ink-50/60 transition">
      <td className="p-3"><p className="font-medium text-ink-900">{hora}</p></td>
      <td className="p-3">
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
          cfg.color === 'yunque' && 'bg-yunque-100 text-yunque-800',
          cfg.color === 'green' && 'bg-green-100 text-green-800',
          cfg.color === 'red' && 'bg-red-100 text-red-700',
          cfg.color === 'blue' && 'bg-blue-100 text-blue-800',
          cfg.color === 'orange' && 'bg-orange-100 text-orange-800',
        )}>
          {cfg.emoji} {cfg.label}
        </span>
      </td>
      <td className="p-3">
        <p className="text-ink-900 line-clamp-1">{movimiento.concepto}</p>
        {movimiento.metodo && <p className="text-xs text-ink-500">{METODOS_PAGO_CAJA[movimiento.metodo]}</p>}
      </td>
      <td className="p-3 hidden md:table-cell text-ink-600">{movimiento.usuario}</td>
      <td className="p-3 text-right">
        <p className={cn('font-black', esEntrada && 'text-green-600', esSalida && 'text-red-600', movimiento.tipo === 'apertura' && 'text-ink-900')}>
          {(esEntrada ? '+' : esSalida ? '-' : '') + formatCurrency(movimiento.monto)}
        </p>
      </td>
    </tr>
  )
}

function HistorialTurnos({ turnos, calcularTotales }: { turnos: TurnoCaja[]; calcularTotales: (id: string) => TotalesCaja }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="p-5 border-b border-ink-200">
        <h2 className="font-bold text-ink-900">Historial de turnos</h2>
        <p className="text-xs text-ink-500 mt-0.5">{turnos.length} {turnos.length === 1 ? 'turno cerrado' : 'turnos cerrados'}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-ink-200">
            <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
              <th className="p-3 font-semibold">Turno</th>
              <th className="p-3 font-semibold">Apertura</th>
              <th className="p-3 font-semibold hidden md:table-cell">Cierre</th>
              <th className="p-3 font-semibold text-right">Ventas</th>
              <th className="p-3 font-semibold text-right">Diferencia</th>
              <th className="p-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {turnos.map((t) => {
              const tot = calcularTotales(t.id)
              const dif = t.diferencia ?? 0
              const cuadra = Math.abs(dif) < 0.01
              const fa = new Date(t.fechaApertura).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
              const fc = t.fechaCierre ? new Date(t.fechaCierre).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—'
              return (
                <tr key={t.id} className="hover:bg-ink-50/60 transition">
                  <td className="p-3">
                    <p className="font-mono font-bold text-ink-900">#{String(t.numero).padStart(3, '0')}</p>
                    <p className="text-xs text-ink-500">{t.usuarioApertura}</p>
                  </td>
                  <td className="p-3 text-ink-700">{fa}</td>
                  <td className="p-3 hidden md:table-cell text-ink-700">{fc}</td>
                  <td className="p-3 text-right font-bold text-ink-900">{formatCurrency(tot.totalVentas)}</td>
                  <td className="p-3 text-right">
                    {cuadra ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />Cuadra
                      </span>
                    ) : (
                      <span className={cn('text-xs font-bold', dif > 0 ? 'text-blue-600' : 'text-red-600')}>
                        {(dif > 0 ? '+' : '') + formatCurrency(dif)}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 text-ink-700 text-xs font-bold px-2 py-0.5">Cerrado</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
