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
// ============================================
// Validar ruta de retorno después del login
// ============================================
// Evita que un usuario sea redirigido a rutas inválidas
// o a secciones para las que no tiene permiso.
export function puedeUsarRutaDeRetorno(rol: Rol, from: string | undefined): boolean {
  // Sin ruta de retorno
  if (!from) return false

  // Debe empezar con /
  if (!from.startsWith('/')) return false

  // No redirigir al propio login/registro
  if (from.startsWith('/login') || from.startsWith('/registro')) return false

  // Si es admin y quiere ir al panel admin → permitir solo si tiene acceso al panel
  if (from.startsWith('/admin')) {
    return tieneAccesoPanel(rol)
  }

  // Cualquier otra ruta pública → permitir
  return true
}