import {
  Euro, ShoppingBag, Wallet, Users, TrendingUp, Package,
  AlertTriangle, ArrowRight, Boxes,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { KpiCard } from '@/components/admin/KpiCard'
import { SalesChart } from '@/components/admin/SalesChart'
import { CategoryDonut } from '@/components/admin/reports/CategoryDonut'
import { PaymentBars } from '@/components/admin/reports/PaymentBars'
import { TopProducts } from '@/components/admin/TopProducts'
import { LowStockAlerts } from '@/components/admin/LowStockAlerts'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { DASHBOARD_POR_ROL } from '@/features/dashboard/roleConfig'
import {
  KPIS, VENTAS_CATEGORIA, VENTAS_METODO,
} from '@/features/dashboard/mockStats'
import { useAuthStore } from '@/store/authStore'
import { useInventoryStats } from '@/features/dashboard/useInventoryStats'
import { formatCurrency, cn } from '@/lib/utils'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const rol = user?.rol ?? 'admin'
  const cfg = DASHBOARD_POR_ROL[rol]
  const invStats = useInventoryStats()

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-ink-900">
            Hola, {user?.nombre ?? 'Admin'} 👋
          </h1>
          <p className="text-sm text-ink-500 mt-1">{cfg.mensajeBienvenida}</p>
        </div>
        <RolBadge rol={rol} color={cfg.colorPrimario} />
      </div>

      {/* KPIs adaptados al rol */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {cfg.mostrarVentas && (
          <KpiCard
            label="Ventas hoy"
            value={formatCurrency(KPIS.ventasHoy)}
            change={KPIS.ventasHoyCambio}
            icon={Euro}
          />
        )}
        {cfg.mostrarGanancias && (
          <KpiCard
            label="Ganancia mes"
            value={formatCurrency(KPIS.gananciaMes)}
            change={KPIS.gananciaMesCambio}
            icon={Wallet}
            iconColor="text-green-600"
          />
        )}
        {cfg.mostrarPedidos && (
          <KpiCard
            label="Pedidos hoy"
            value={String(KPIS.pedidosHoy)}
            change={4.2}
            icon={ShoppingBag}
            iconColor="text-blue-600"
          />
        )}
        {cfg.mostrarClientes && (
          <KpiCard
            label="Clientes nuevos"
            value={String(KPIS.clientesNuevos)}
            change={-2.1}
            icon={Users}
            iconColor="text-purple-600"
          />
        )}
        {cfg.mostrarStockBajo && (
          <KpiCard
            label="Productos con stock bajo"
            value={String(invStats.stockBajo)}
            icon={AlertTriangle}
            iconColor="text-orange-600"
          />
        )}
        {/* Almacenero ve 4 KPIs de inventario */}
        {rol === 'almacenero' && (
          <>
            <KpiCard
              label="Unidades totales"
              value={String(invStats.unidadesTotales)}
              icon={Boxes}
            />
            <KpiCard
              label="Productos activos"
              value={String(invStats.productosActivos)}
              icon={Package}
              iconColor="text-blue-600"
            />
            <KpiCard
              label="Valor del inventario"
              value={formatCurrency(invStats.valorInventario)}
              icon={Euro}
              iconColor="text-green-600"
            />
          </>
        )}
      </div>

      {/* Mini KPIs secundarios */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {cfg.mostrarTicket && (
          <MiniKpi
            label="Ticket promedio"
            value={formatCurrency(KPIS.ticketPromedio)}
            icon={TrendingUp}
          />
        )}
        {cfg.mostrarClientes && (
          <MiniKpi
            label="Clientes totales"
            value={String(KPIS.clientesTotales)}
            icon={Users}
          />
        )}
        {cfg.mostrarPedidos && (
          <MiniKpi
            label="Pedidos pendientes"
            value={String(KPIS.pedidosPendientes)}
            icon={ShoppingBag}
            highlight
          />
        )}
        {cfg.mostrarStockBajo && rol !== 'almacenero' && (
          <MiniKpi
            label="Stock bajo"
            value={String(invStats.stockBajo)}
            icon={Package}
            alert
          />
        )}
      </div>

      {/* Gráfica de evolución (admin y vendedor) */}
      {cfg.mostrarGraficaVentas && (
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          {cfg.mostrarStockBajo && <LowStockAlerts />}
        </div>
      )}

      {/* Dona de categorías + Métodos de pago */}
      {cfg.mostrarCategorias && (
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          <CategoryDonut data={VENTAS_CATEGORIA} />
          {cfg.mostrarMetodosPago && <PaymentBars data={VENTAS_METODO} />}
        </div>
      )}

      {/* Top productos + Últimos pedidos */}
      {(cfg.mostrarTopProductos || cfg.mostrarUltimosPedidos) && (
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {cfg.mostrarTopProductos && <TopProducts />}
          {cfg.mostrarUltimosPedidos && <RecentOrders />}
        </div>
      )}

      {/* Sección especial para almacenero */}
      {rol === 'almacenero' && (
        <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-5 lg:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 grid place-items-center shrink-0">
              <Boxes className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-ink-900">
                Gestión de inventario
              </h3>
              <p className="text-sm text-ink-500 mt-0.5">
                Revisa movimientos, ajustes y alertas de stock en el módulo de inventario
              </p>
            </div>
            <Link
              to="/admin/inventario"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-blue-700 transition shrink-0"
            >
              Ir a inventario
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function RolBadge({ rol, color }: { rol: string; color: string }) {
  const labels: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Administrador',
    vendedor: 'Vendedor',
    almacenero: 'Almacenero',
  }
  const colors: Record<string, string> = {
    yunque: 'bg-yunque-100 text-yunque-800 border-yunque-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide',
        colors[color] ?? colors.yunque,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {labels[rol] ?? rol}
    </span>
  )
}

function MiniKpi({
  label,
  value,
  icon: Icon,
  alert,
  highlight,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  alert?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border px-3 py-2.5 lg:px-4 lg:py-3 flex items-center gap-2.5 lg:gap-3',
        alert
          ? 'border-orange-200 bg-orange-50/40'
          : highlight
            ? 'border-yunque-200 bg-yunque-50/40'
            : 'border-ink-200 bg-white',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 lg:h-5 lg:w-5 shrink-0',
          alert
            ? 'text-orange-600'
            : highlight
              ? 'text-yunque-700'
              : 'text-ink-400',
        )}
      />
      <div className="min-w-0">
        <p className="text-[11px] lg:text-xs text-ink-500 truncate">{label}</p>
        <p className="text-sm lg:text-base font-bold text-ink-900 truncate">{value}</p>
      </div>
    </div>
  )
}
