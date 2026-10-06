import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { PageLoader } from '@/components/PageLoader'

import HomePage from '@/pages/public/HomePage'
import CatalogPage from '@/pages/public/CatalogPage'
import ProductPage from '@/pages/public/ProductPage'
import CartPage from '@/pages/public/CartPage'
import CheckoutPage from '@/pages/public/CheckoutPage'
import OrderSuccessPage from '@/pages/public/OrderSuccessPage'
import AccountPage from '@/pages/public/AccountPage'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const ProductsPage = lazy(() => import('@/pages/admin/ProductsPage'))
const InventoryPage = lazy(() => import('@/pages/admin/InventoryPage'))
const PosPage = lazy(() => import('@/pages/admin/pos/PosPage'))
const CajaPage = lazy(() => import('@/pages/admin/CajaPage'))
const OrdersPage = lazy(() => import('@/pages/admin/OrdersPage'))
const ClientsPage = lazy(() => import('@/pages/admin/ClientsPage'))
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const AccessDeniedPage = lazy(() => import('@/pages/admin/AccessDeniedPage'))

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/productos/:slug" element={<ProductPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido/:id" element={<OrderSuccessPage />} />
        <Route
          path="/cuenta/*"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['superadmin', 'admin', 'vendedor', 'almacenero']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute modulo="dashboard">
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="productos"
          element={
            <ProtectedRoute modulo="productos">
              <Suspense fallback={<PageLoader />}>
                <ProductsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="inventario"
          element={
            <ProtectedRoute modulo="inventario">
              <Suspense fallback={<PageLoader />}>
                <InventoryPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="pos"
          element={
            <ProtectedRoute modulo="pos">
              <Suspense fallback={<PageLoader />}>
                <PosPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="caja"
          element={
            <ProtectedRoute modulo="caja">
              <Suspense fallback={<PageLoader />}>
                <CajaPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="pedidos"
          element={
            <ProtectedRoute modulo="pedidos">
              <Suspense fallback={<PageLoader />}>
                <OrdersPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="clientes"
          element={
            <ProtectedRoute modulo="clientes">
              <Suspense fallback={<PageLoader />}>
                <ClientsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="reportes"
          element={
            <ProtectedRoute modulo="reportes">
              <Suspense fallback={<PageLoader />}>
                <ReportsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="acceso-denegado"
          element={
            <Suspense fallback={<PageLoader />}>
              <AccessDeniedPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

