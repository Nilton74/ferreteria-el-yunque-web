import { useMemo, useState } from 'react'
import {
  Search, X, Eye, PackageX, Clock, Wallet, Truck, TrendingUp,
  Download, Calendar, ChevronDown,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { KpiCard } from '@/components/admin/KpiCard'
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge'
import { OrderDetailModal } from '@/components/admin/orders/OrderDetailModal'
import {
  getPedidos,
  ESTADOS,
  FLUJO_ESTADOS,
  type Pedido,
  type EstadoPedido,
} from '@/features/orders/mockOrders'
import { formatCurrency, cn } from '@/lib/utils'

type TabActiva = 'todos' | EstadoPedido
type RangoFecha = 'hoy' | '7d' | '30d' | 'todos'

const RANGOS: { value: RangoFecha; label: string }[] = [
  { value: 'hoy',   label: 'Hoy' },
  { value: '7d',    label: 'Últimos 7 días' },
  { value: '30d',   label: 'Últimos 30 días' },
  { value: 'todos', label: 'Todos' },
]

export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => getPedidos())
  const [detalle, setDetalle] = useState<Pedido | null>(null)

  const [q, setQ] = useState('')
  const [tab, setTab] = useState<TabActiva>('todos')
  const [rango, setRango] = useState<RangoFecha>('30d')

  // ---------- Refrescar pedidos desde storage ----------
  const refresh = () => setPedidos(getPedidos())

  // ---------- KPIs ----------
  const kpis = useMemo(() => {
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

    const delMes = pedidos.filter((p) => new Date(p.creadoEn) >= inicioMes)
    const ingresos = delMes.reduce((acc, p) => acc + p.total, 0)

    return {
      pendientes: pedidos.filter((p) => p.estado === 'pendiente').length,
      enviados: pedidos.filter((p) => p.estado === 'enviado').length,
      delMes: delMes.length,
      ingresos,
    }
  }, [pedidos])

  // ---------- Filtrado ----------
  const filtrados = useMemo(() => {
    let r = [...pedidos]

    // Filtro por rango de fechas
    if (rango !== 'todos') {
      const ahora = new Date()
      const limite = new Date(ahora)
      if (rango === 'hoy') limite.setHours(0, 0, 0, 0)
      if (rango === '7d') limite.setDate(limite.getDate() - 7)
      if (rango === '30d') limite.setDate(limite.getDate() - 30)
      r = r.filter((p) => new Date(p.creadoEn) >= limite)
    }

    // Búsqueda
    if (q.trim()) {
      const t = q.toLowerCase()
      r = r.filter(
        (p) =>
          p.numero.toLowerCase().includes(t) ||
          p.direccion.nombre.toLowerCase().includes(t) ||
          p.direccion.email.toLowerCase().includes(t),
      )
    }

    // Tab por estado
    if (tab !== 'todos') {
      r = r.filter((p) => p.estado === tab)
    }

    // Ordenar por fecha desc
    r.sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())

    return r
  }, [pedidos, q, tab, rango])

  // ---------- Conteo por estado (para los tabs) ----------
  const conteoEstados = useMemo(() => {
    const c: Record<string, number> = { todos: pedidos.length }
    FLUJO_ESTADOS.forEach((e) => {
      c[e] = pedidos.filter((p) => p.estado === e).length
    })
    c.cancelado = pedidos.filter((p) => p.estado === 'cancelado').length
    return c
  }, [pedidos])

  // ---------- Exportar CSV ----------
  const exportarCSV = () => {
    const headers = [
      'Número',
      'Fecha',
      'Cliente',
      'Email',
      'Teléfono',
      'Ciudad',
      'Estado',
      'Items',
      'Subtotal',
      'Envío',
      'Total',
    ]
    const rows = filtrados.map((p) => [
      p.numero,
      new Date(p.creadoEn).toLocaleDateString('es-ES'),
      p.direccion.nombre,
      p.direccion.email,
      p.direccion.telefono,
      p.direccion.ciudad,
      p.estado,
      p.items.length,
      p.subtotal.toFixed(2),
      p.envio.toFixed(2),
      p.total.toFixed(2),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n')

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const limpiarFiltros = () => {
    setQ('')
    setTab('todos')
    setRango('30d')
  }

  const filtrosActivos = (q ? 1 : 0) + (tab !== 'todos' ? 1 : 0) + (rango !== '30d' ? 1 : 0)

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Pedidos</h1>
          <p className="text-sm text-ink-500 mt-1">
            {filtrados.length} de {pedidos.length} pedidos
          </p>
        </div>
        <Button variant="secondary" onClick={exportarCSV}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pendientes"
          value={String(kpis.pendientes)}
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <KpiCard
          label="Enviados"
          value={String(kpis.enviados)}
          icon={Truck}
          iconColor="text-blue-600"
        />
        <KpiCard
          label="Pedidos del mes"
          value={String(kpis.delMes)}
          icon={TrendingUp}
          iconColor="text-purple-600"
        />
        <KpiCard
          label="Ingresos del mes"
          value={formatCurrency(kpis.ingresos)}
          icon={Wallet}
          iconColor="text-green-600"
        />
      </div>

      {/* Tabs por estado */}
      <div className="flex gap-1 border-b border-ink-200 overflow-x-auto">
        <TabBtn
          active={tab === 'todos'}
          onClick={() => setTab('todos')}
          count={conteoEstados.todos}
        >
          Todos
        </TabBtn>
        {FLUJO_ESTADOS.map((e) => (
          <TabBtn
            key={e}
            active={tab === e}
            onClick={() => setTab(e)}
            count={conteoEstados[e]}
          >
            {ESTADOS[e].label}
          </TabBtn>
        ))}
        {conteoEstados.cancelado > 0 && (
          <TabBtn
            active={tab === 'cancelado'}
            onClick={() => setTab('cancelado')}
            count={conteoEstados.cancelado}
          >
            Cancelados
          </TabBtn>
        )}
      </div>

      {/* Barra de filtros */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nº, cliente o email…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-ink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            <select
              value={rango}
              onChange={(e) => setRango(e.target.value as RangoFecha)}
              className="appearance-none rounded-lg border border-ink-200 bg-white pl-9 pr-9 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yunque-400 cursor-pointer"
            >
              {RANGOS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-500" />
          </div>

          {filtrosActivos > 0 && (
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 hover:bg-ink-100"
            >
              <X className="h-4 w-4" />
              Limpiar ({filtrosActivos})
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-ink-200 bg-white overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="p-12 text-center">
            <PackageX className="mx-auto h-12 w-12 text-ink-300" />
            <h3 className="mt-4 text-lg font-bold text-ink-900">
              No hay pedidos
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {filtrosActivos > 0
                ? 'Prueba ajustando los filtros.'
                : 'Aún no se han recibido pedidos.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="p-4 font-semibold">Pedido</th>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Items</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold hidden lg:table-cell">Fecha</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtrados.map((p) => {
                  const fecha = new Date(p.creadoEn).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                  })
                  const hora = new Date(p.creadoEn).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-ink-50/60 transition cursor-pointer"
                      onClick={() => setDetalle(p)}
                    >
                      <td className="p-4">
                        <p className="font-mono text-sm font-bold text-ink-900">
                          {p.numero}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-ink-900">
                          {p.direccion.nombre}
                        </p>
                        <p className="text-xs text-ink-500 truncate">
                          {p.direccion.email}
                        </p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-ink-700">
                          {p.items.reduce((a, i) => a + i.cantidad, 0)} uds
                        </span>
                        <p className="text-xs text-ink-400">
                          {p.items.length} {p.items.length === 1 ? 'línea' : 'líneas'}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-black text-ink-900">
                          {formatCurrency(p.total)}
                        </p>
                      </td>
                      <td className="p-4">
                        <OrderStatusBadge estado={p.estado} />
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <p className="font-medium text-ink-900">{fecha}</p>
                        <p className="text-xs text-ink-500">{hora}</p>
                      </td>
                      <td className="p-4">
                        <button className="p-2 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-900 transition">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal detalle */}
      <OrderDetailModal
        open={!!detalle}
        onClose={() => setDetalle(null)}
        pedido={detalle}
        onUpdate={() => {
          refresh()
          // Refrescar el pedido del modal también
          if (detalle) {
            const actualizado = getPedidos().find((p) => p.id === detalle.id)
            setDetalle(actualizado ?? null)
          }
        }}
      />
    </div>
  )
}

// ---------- Tabs ----------
function TabBtn({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count?: number
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition inline-flex items-center gap-2',
        active
          ? 'border-yunque-500 text-ink-900'
          : 'border-transparent text-ink-500 hover:text-ink-900',
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'rounded-full text-xs font-bold px-2 py-0.5',
            active ? 'bg-yunque-500 text-ink-900' : 'bg-ink-100 text-ink-600',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}