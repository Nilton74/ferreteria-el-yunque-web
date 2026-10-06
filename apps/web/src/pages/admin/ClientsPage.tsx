import { useMemo, useState } from 'react'
import {
  Search, X, Eye, Users, UserPlus, Crown, Wallet, TrendingUp,
  ChevronDown, PackageX, Download, Mail, Phone,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { KpiCard } from '@/components/admin/KpiCard'
import { SegmentBadge } from '@/components/admin/clients/SegmentBadge'
import { ClientDetailModal } from '@/components/admin/clients/ClientDetailModal'
import {
  getClientes,
  SEGMENTOS,
  type Cliente,
  type Segmento,
} from '@/features/clientes/clientStore'
import { formatCurrency, cn } from '@/lib/utils'

type FiltroSegmento = 'todos' | Segmento
type Orden = 'recientes' | 'gastado' | 'pedidos' | 'nombre'

const ORDENES: { value: Orden; label: string }[] = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'gastado',   label: 'Mayor gasto' },
  { value: 'pedidos',   label: 'Más pedidos' },
  { value: 'nombre',    label: 'Nombre (A-Z)' },
]

export default function ClientsPage() {
  const [clientes] = useState<Cliente[]>(() => getClientes())
  const [detalle, setDetalle] = useState<Cliente | null>(null)
  const [ahora] = useState(() => Date.now())

  const [q, setQ] = useState('')
  const [segmento, setSegmento] = useState<FiltroSegmento>('todos')
  const [orden, setOrden] = useState<Orden>('recientes')

  // ---------- KPIs ----------
  const kpis = useMemo(() => {
    const total = clientes.length
    const nuevos = clientes.filter((c) => {
      const dias = Math.floor((ahora - new Date(c.creadoEn).getTime()) / 86400000)
      return dias <= 30
    }).length
    const vip = clientes.filter((c) => c.segmento === 'vip').length
    const valorTotal = clientes.reduce((acc, c) => acc + c.totalGastado, 0)
    return { total, nuevos, vip, valorTotal }
  }, [clientes, ahora])

  // ---------- Conteo por segmento ----------
  const conteoSegmentos = useMemo(() => {
    const c: Record<string, number> = { todos: clientes.length }
    ;(['vip', 'frecuente', 'nuevo', 'inactivo', 'regular'] as Segmento[]).forEach((s) => {
      c[s] = clientes.filter((x) => x.segmento === s).length
    })
    return c
  }, [clientes])

  // ---------- Filtrado y ordenamiento ----------
  const filtrados = useMemo(() => {
    let r = [...clientes]

    if (q.trim()) {
      const t = q.toLowerCase()
      r = r.filter(
        (c) =>
          c.nombre.toLowerCase().includes(t) ||
          c.email.toLowerCase().includes(t) ||
          c.telefono.includes(t) ||
          c.ciudad.toLowerCase().includes(t),
      )
    }

    if (segmento !== 'todos') {
      r = r.filter((c) => c.segmento === segmento)
    }

    r.sort((a, b) => {
      switch (orden) {
        case 'gastado':
          return b.totalGastado - a.totalGastado
        case 'pedidos':
          return b.pedidos.length - a.pedidos.length
        case 'nombre':
          return a.nombre.localeCompare(b.nombre)
        case 'recientes':
        default:
          return new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
      }
    })

    return r
  }, [clientes, q, segmento, orden])

  // ---------- Exportar CSV ----------
  const exportarCSV = () => {
    const headers = [
      'Nombre', 'Email', 'Teléfono', 'Ciudad', 'Provincia',
      'Segmento', 'Pedidos', 'Total gastado', 'Ticket medio', 'Última compra',
    ]
    const rows = filtrados.map((c) => [
      c.nombre,
      c.email,
      c.telefono,
      c.ciudad,
      c.provincia,
      SEGMENTOS[c.segmento].label,
      c.pedidos.length,
      c.totalGastado.toFixed(2),
      c.ticketPromedio.toFixed(2),
      c.ultimaCompra
        ? new Date(c.ultimaCompra).toLocaleDateString('es-ES')
        : '—',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(',')),
    ].join('\n')

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clientes-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const limpiarFiltros = () => {
    setQ('')
    setSegmento('todos')
    setOrden('recientes')
  }

  const filtrosActivos = (q ? 1 : 0) + (segmento !== 'todos' ? 1 : 0) + (orden !== 'recientes' ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Clientes</h1>
          <p className="text-sm text-ink-500 mt-1">
            {filtrados.length} de {clientes.length} clientes
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
          label="Total clientes"
          value={String(kpis.total)}
          icon={Users}
        />
        <KpiCard
          label="Nuevos (30 días)"
          value={String(kpis.nuevos)}
          icon={UserPlus}
          iconColor="text-blue-600"
        />
        <KpiCard
          label="Clientes VIP"
          value={String(kpis.vip)}
          icon={Crown}
          iconColor="text-yunque-700"
        />
        <KpiCard
          label="Valor total"
          value={formatCurrency(kpis.valorTotal)}
          icon={Wallet}
          iconColor="text-green-600"
        />
      </div>

      {/* Tabs segmentos */}
      <div className="flex gap-1 border-b border-ink-200 overflow-x-auto">
        <TabBtn
          active={segmento === 'todos'}
          onClick={() => setSegmento('todos')}
          count={conteoSegmentos.todos}
        >
          Todos
        </TabBtn>
        {(['vip', 'frecuente', 'nuevo', 'regular', 'inactivo'] as Segmento[]).map((s) => (
          <TabBtn
            key={s}
            active={segmento === s}
            onClick={() => setSegmento(s)}
            count={conteoSegmentos[s]}
          >
            {SEGMENTOS[s].emoji} {SEGMENTOS[s].label}
          </TabBtn>
        ))}
      </div>

      {/* Barra de filtros */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, email, teléfono o ciudad…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-ink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yunque-400"
            />
          </div>

          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="appearance-none rounded-lg border border-ink-200 bg-white pl-9 pr-9 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yunque-400 cursor-pointer"
            >
              {ORDENES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
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
              No hay clientes
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              Prueba ajustando los filtros.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold hidden md:table-cell">Contacto</th>
                  <th className="p-4 font-semibold text-center">Pedidos</th>
                  <th className="p-4 font-semibold text-right">Total gastado</th>
                  <th className="p-4 font-semibold hidden lg:table-cell">Segmento</th>
                  <th className="p-4 font-semibold hidden xl:table-cell">Última compra</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtrados.map((c) => {
                  const ultima = c.ultimaCompra
                    ? new Date(c.ultimaCompra).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })
                    : '—'

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-ink-50/60 transition cursor-pointer"
                      onClick={() => setDetalle(c)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-yunque-500 text-ink-900 grid place-items-center font-bold shrink-0">
                            {c.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-ink-900 line-clamp-1">
                              {c.nombre}
                            </p>
                            <p className="text-xs text-ink-500">
                              {c.ciudad}, {c.provincia}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 hidden md:table-cell">
                        <p className="flex items-center gap-1.5 text-xs text-ink-600">
                          <Mail className="h-3 w-3 shrink-0 text-ink-400" />
                          <span className="truncate max-w-[180px]">{c.email}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-ink-600 mt-1">
                          <Phone className="h-3 w-3 shrink-0 text-ink-400" />
                          {c.telefono}
                        </p>
                      </td>

                      <td className="p-4 text-center">
                        <p className="font-bold text-ink-900">
                          {c.pedidos.length}
                        </p>
                      </td>

                      <td className="p-4 text-right">
                        <p className="font-black text-ink-900">
                          {formatCurrency(c.totalGastado)}
                        </p>
                        {c.pedidos.length > 0 && (
                          <p className="text-[11px] text-ink-400">
                            ticket {formatCurrency(c.ticketPromedio)}
                          </p>
                        )}
                      </td>

                      <td className="p-4 hidden lg:table-cell">
                        <SegmentBadge segmento={c.segmento} />
                      </td>

                      <td className="p-4 hidden xl:table-cell text-ink-600">
                        {ultima}
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
      <ClientDetailModal
        open={!!detalle}
        onClose={() => setDetalle(null)}
        cliente={detalle}
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