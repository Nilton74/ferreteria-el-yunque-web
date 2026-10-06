import { useMemo, useState } from 'react'
import {
  Euro, ShoppingBag, TrendingUp, Package, Download,
  BarChart3, Calendar, RefreshCw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { PeriodSelector } from '@/components/admin/reports/PeriodSelector'
import { SalesLineChart } from '@/components/admin/reports/SalesLineChart'
import { PaymentPieChart } from '@/components/admin/reports/PaymentPieChart'
import { CategoryBarChart } from '@/components/admin/reports/CategoryBarChart'
import { TopProductsTable } from '@/components/admin/reports/TopProductsTable'
import { SalesTable } from '@/components/admin/reports/SalesTable'
import {
  calcularReporte,
  exportarReporteCSV,
  type Periodo,
} from '@/features/reports/reportsData'

type KpiData = {
  actual?: number
  valor?: number
  total?: number
  anterior?: number
  variacionPorcentual?: number
  cambioPorcentual?: number
}

function KpiComparativo({
  label,
  kpi,
  format,
  icon: Icon,
}: {
  label: string
  kpi: number | KpiData
  format?: 'number'
  icon: LucideIcon
}) {
  const valor = typeof kpi === 'number'
    ? kpi
    : kpi.actual ?? kpi.valor ?? kpi.total ?? 0
  const comparativo = typeof kpi === 'number' ? undefined : kpi
  const anterior = comparativo?.anterior
  const variacion = comparativo?.variacionPorcentual ?? comparativo?.cambioPorcentual
    ?? (typeof anterior === 'number' && anterior !== 0
      ? ((valor - anterior) / anterior) * 100
      : undefined)
  const formatted = format === 'number'
    ? Number(valor).toLocaleString('es-ES')
    : Number(valor).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <Icon className="h-5 w-5 text-ink-400" />
      </div>
      <p className="mt-3 text-2xl font-black text-ink-900">{formatted}</p>
      {typeof variacion === 'number' && (
        <p className={`mt-1 text-xs font-medium ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {variacion > 0 ? '+' : ''}{variacion.toLocaleString('es-ES', { maximumFractionDigits: 1 })}% respecto al período anterior
        </p>
      )}
    </div>
  )
}

export default function ReportsPage() {
  const [periodo, setPeriodo] = useState<Periodo>('30d')
  const [refreshKey, setRefreshKey] = useState(0)

  // Recalcular cada vez que cambia el período o refreshKey
  const reporte = useMemo(() => {
    void refreshKey
    return calcularReporte(periodo)
  }, [periodo, refreshKey])

  const handleExportar = () => {
    exportarReporteCSV(reporte)
  }

  const fechaInicio = reporte.rango.desde.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const fechaFin = reporte.rango.hasta.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-900">Reportes</h1>
          <p className="text-sm text-ink-500 mt-1">
            Analítica de ventas y rendimiento del negocio
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium hover:bg-ink-100 transition"
            title="Recalcular"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <Button variant="secondary" onClick={handleExportar}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Selector de período */}
      <div className="flex flex-wrap items-center gap-3">
        <PeriodSelector value={periodo} onChange={setPeriodo} />

        <div className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-600">
          <Calendar className="h-3.5 w-3.5 text-ink-400" />
          {fechaInicio} → {fechaFin}
        </div>
      </div>

      {/* KPIs comparativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiComparativo
          label="Ventas"
          kpi={reporte.kpis.ventas}
          icon={Euro}
        />
        <KpiComparativo
          label="Pedidos"
          kpi={reporte.kpis.pedidos}
          format="number"
          icon={ShoppingBag}
        />
        <KpiComparativo
          label="Ticket medio"
          kpi={reporte.kpis.ticketMedio}
          icon={TrendingUp}
        />
        <KpiComparativo
          label="Unidades vendidas"
          kpi={reporte.kpis.unidadesVendidas}
          format="number"
          icon={Package}
        />
      </div>

      {/* Estado vacío */}
      {reporte.pedidos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-white p-12 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-ink-300" />
          <h3 className="mt-4 text-lg font-bold text-ink-900">
            Sin datos en este período
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Prueba con otro rango de fechas o crea pedidos para ver analíticas.
          </p>
        </div>
      ) : (
        <>
          {/* Gráfica principal */}
          <SalesLineChart data={reporte.ventasPorDia} />

          {/* Grid de gráficas */}
          <div className="grid lg:grid-cols-2 gap-6">
            <CategoryBarChart data={reporte.ventasPorCategoria} />
            <PaymentPieChart data={reporte.ventasPorMetodoPago} />
          </div>

          {/* Top productos */}
          <TopProductsTable data={reporte.topProductos} />

          {/* Tabla detallada */}
          <SalesTable data={reporte.ventasPorDia} />
        </>
      )}
    </div>
  )
}
