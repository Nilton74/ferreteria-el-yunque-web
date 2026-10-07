import type { Rol } from '@/store/authStore'

export type Modulo =
  | 'dashboard'
  | 'productos'
  | 'inventario'
  | 'pos'
  | 'pedidos'
  | 'clientes'
  | 'reportes'
  | 'caja'

export const PERMISOS_POR_ROL: Record<Rol, Modulo[] | ['*'] | []> = {
  superadmin: ['*'],
  admin:      ['*'],
  vendedor:   ['dashboard', 'pos', 'pedidos', 'clientes', 'productos', 'caja'],
  almacenero: ['dashboard', 'inventario', 'productos'],
  cliente:    [],
}

export function tieneAccesoPanel(rol: Rol): boolean {
  return PERMISOS_POR_ROL[rol].length > 0
}

export function puedeAcceder(rol: Rol, modulo: Modulo): boolean {
  const permisos = PERMISOS_POR_ROL[rol]
  if (permisos.length === 0) return false
  if (permisos[0] === '*') return true
  return (permisos as Modulo[]).includes(modulo)
}

export type NivelAcceso = 'total' | 'solo-ver' | 'sin-acceso'

export function nivelAcceso(rol: Rol, modulo: Modulo): NivelAcceso {
  if (rol === 'admin' || rol === 'superadmin') return 'total'

  if (rol === 'almacenero') {
    if (modulo === 'productos') return 'solo-ver'
    if (modulo === 'inventario' || modulo === 'dashboard') return 'total'
    return 'sin-acceso'
  }

  if (rol === 'vendedor') {
    if (['dashboard', 'pos', 'pedidos', 'clientes', 'caja'].includes(modulo))
      return 'total'
    if (modulo === 'productos') return 'solo-ver'
    return 'sin-acceso'
  }

  return 'sin-acceso'
}

export const PUEDE_ESCRIBIR = (nivel: NivelAcceso) => nivel === 'total'

// ============================================
// NIVEL DE DASHBOARD
// ============================================
// Cada rol ve un dashboard diferente según su responsabilidad.
// Los datos financieros (ventas totales, ganancias, valor inventario)
// solo son visibles para admin/superadmin.

export type DashboardNivel = 'completo' | 'vendedor' | 'almacen' | 'sin-acceso'

export function getDashboardNivel(rol: Rol): DashboardNivel {
  if (rol === 'superadmin' || rol === 'admin') return 'completo'
  if (rol === 'vendedor') return 'vendedor'
  if (rol === 'almacenero') return 'almacen'
  return 'sin-acceso'
}
