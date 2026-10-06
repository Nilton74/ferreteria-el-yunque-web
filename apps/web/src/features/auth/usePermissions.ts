import { useAuthStore } from '@/store/authStore'
import {
  puedeAcceder,
  tieneAccesoPanel,
  nivelAcceso,
  type Modulo,
  type NivelAcceso,
} from './permissions'

export function usePermissions() {
  const user = useAuthStore((s) => s.user)
  const rol = user?.rol ?? 'cliente'

  return {
    rol,
    tieneAccesoPanel: tieneAccesoPanel(rol),
    puede: (modulo: Modulo) => puedeAcceder(rol, modulo),
    nivel: (modulo: Modulo): NivelAcceso => nivelAcceso(rol, modulo),
    esAdmin: rol === 'admin' || rol === 'superadmin',
    esVendedor: rol === 'vendedor',
    esAlmacenero: rol === 'almacenero',
  }
}