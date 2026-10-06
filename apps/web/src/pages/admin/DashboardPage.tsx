import {
  Euro, ShoppingBag, Wallet, Users, TrendingUp, Package,
} from 'lucide-react'

import { KpiCard } from '@/components/admin/KpiCard'
import { SalesChart } from '@/components/admin/SalesChart'
import { CategoryChart } from '@/components/admin/CategoryChart'
import { TopProducts } from '@/components/admin/TopProducts'
import { LowStockAlerts } from '@/components/admin/LowStockAlerts'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { KPIS } from '@/features/dashboard/mockStats'
import { formatCurrency } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink-900">
          Hola, {user?.nombre ?? 'Admin'} 👋
        </h1>
        <p className="text-sm text-ink-500 mt-1">
          Este es el resumen de tu negocio hoy
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ventas hoy"
          value={formatCurrency(KPIS.ventasHoy)}
          change={KPIS.ventasHoyCambio}
          icon={Euro}
        />
        <KpiCard
          label="Pedidos hoy"
          value={String(KPIS.pedidosHoy)}
          change={4.2}
          icon={ShoppingBag}
          iconColor="text-blue-600"
        />
        <KpiCard
          label="Ganancia mes"
          value={formatCurrency(KPIS.gananciaMes)}
          change={KPIS.gananciaMesCambio}
          icon={Wallet}
          iconColor="text-green-600"
        />
        <KpiCard
          label="Clientes nuevos"
          value={String(KPIS.clientesNuevos)}
          change={-2.1}
          icon={Users}
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniKpi
          label="Ticket promedio"
          value={formatCurrency(KPIS.ticketPromedio)}
          icon={TrendingUp}
        />
        <MiniKpi
          label="Clientes totales"
          value={String(KPIS.clientesTotales)}
          icon={Users}
        />
        <MiniKpi
          label="Pedidos pendientes"
          value={String(KPIS.pedidosPendientes)}
          icon={ShoppingBag}
          highlight
        />
        <MiniKpi
          label="Stock bajo"
          value={String(KPIS.stockBajo)}
          icon={Package}
          alert
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <LowStockAlerts />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CategoryChart />
        <TopProducts />
      </div>

      <RecentOrders />
    </div>
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
      className={
        'rounded-xl border bg-white px-4 py-3 flex items-center gap-3 ' +
        (alert
          ? 'border-orange-200 bg-orange-50/40'
          : highlight
            ? 'border-yunque-200 bg-yunque-50/40'
            : 'border-ink-200')
      }
    >
      <Icon
        className={
          'h-5 w-5 shrink-0 ' +
          (alert
            ? 'text-orange-600'
            : highlight
              ? 'text-yunque-700'
              : 'text-ink-400')
        }
      />
      <div className="min-w-0">
        <p className="text-xs text-ink-500 truncate">{label}</p>
        <p className="text-base font-bold text-ink-900">{value}</p>
      </div>
    </div>
  )
}

