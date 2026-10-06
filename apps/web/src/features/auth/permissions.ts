import type { Rol } from '@/store/authStore'

// ============================================
// Módulos del panel admin
// ============================================
export type Modulo =
  | 'dashboard'
  | 'productos'
  | 'inventario'
  | 'pos'
  | 'pedidos'
  | 'clientes'
  | 'reportes'
  | 'caja'

// ============================================
// Permisos por rol
// ============================================
// '*' significa acceso total a todos los módulos
// Array vacío = sin acceso al panel
export const PERMISOS_POR_ROL: Record<Rol, Modulo[] | ['*'] | []> = {
  superadmin: ['*'],
  admin:      ['*'],
  vendedor:   ['dashboard', 'pos', 'pedidos', 'clientes', 'productos', 'caja'],
  almacenero: ['dashboard', 'inventario', 'productos'],
  cliente:    [],
}

// ============================================
// Helpers
// ============================================
export function tieneAccesoPanel(rol: Rol): boolean {
  return PERMISOS_POR_ROL[rol].length > 0
}

export function puedeAcceder(rol: Rol, modulo: Modulo): boolean {
  const permisos = PERMISOS_POR_ROL[rol]
  if (permisos.length === 0) return false
  if ((permisos as string[]).includes('*')) return true
  return (permisos as Modulo[]).includes(modulo)
}

// ============================================
// Restricciones específicas de vista
// ============================================
// Algunos roles pueden VER un módulo pero no modificarlo.
// Ej: almacenero ve productos pero no los crea/edita.
export type NivelAcceso = 'total' | 'solo-ver' | 'sin-acceso'

export function nivelAcceso(rol: Rol, modulo: Modulo): NivelAcceso {
  // Admin/Superadmin siempre total
  if (rol === 'admin' || rol === 'superadmin') return 'total'

  // Almacenero: en productos solo puede ver, en inventario total
  if (rol === 'almacenero') {
    if (modulo === 'productos') return 'solo-ver'
    if (modulo === 'inventario' || modulo === 'dashboard') return 'total'
    return 'sin-acceso'
  }

  // Vendedor: total en dashboard/pos/pedidos/clientes/caja; solo ver en productos
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
// Rutas de retorno tras iniciar sesión
// ============================================
// Evita que un rol sea enviado a una zona que no le corresponde
// (p. ej. admin -> /cuenta tras un logout hecho desde la cuenta de cliente).
export function puedeUsarRutaDeRetorno(rol: Rol, path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//')) return false
  if (path === '/login' || path === '/registro') return false

  const esRuta = (base: string) => path === base || path.startsWith(base + '/')

  // Panel: solo roles con acceso al panel
  if (esRuta('/admin')) return tieneAccesoPanel(rol)

  // Área de cliente: solo clientes (el personal vuelve a su panel)
  if (esRuta('/cuenta')) return !tieneAccesoPanel(rol)

  return true
}
