import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Package, MapPin, Heart, LogOut, Plus, Pencil, Trash2,
  Star, Phone, Home, ShoppingBag, TrendingUp, Wallet,
  PackageX, Eye, RefreshCw, Check,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { OrderStatusBadge } from '@/components/admin/orders/OrderStatusBadge'
import { PublicOrderModal } from '@/components/public/account/PublicOrderModal'
import { ProductCard } from '@/components/public/ProductCard'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import {
  useProfileStore,
  type Direccion,
} from '@/features/clientes/clientProfileStore'
import { getPedidos, type Pedido } from '@/features/orders/mockOrders'
import { PRODUCTOS } from '@/features/products/mockProducts'
import { formatCurrency, cn } from '@/lib/utils'

type Seccion = 'pedidos' | 'perfil' | 'direcciones' | 'favoritos'

const NAV: { value: Seccion; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'pedidos',     label: 'Mis pedidos',  icon: Package },
  { value: 'perfil',      label: 'Mi perfil',    icon: User },
  { value: 'direcciones', label: 'Direcciones',  icon: MapPin },
  { value: 'favoritos',   label: 'Favoritos',    icon: Heart },
]

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { direcciones, favoritos } = useProfileStore()
  const addToCart = useCartStore((s) => s.add)

  const [seccion, setSeccion] = useState<Seccion>('pedidos')
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null)

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [user, navigate])

  // ---------- Datos del usuario logueado ----------
  const perfil = useMemo(
    () => ({
      nombre: user?.nombre ?? 'Usuario',
      email: user?.email ?? '',
      telefono: '',
    }),
    [user],
  )

  // ---------- Pedidos del cliente actual ----------
  const misPedidos = useMemo(() => {
    if (!user) return []
    const email = user.email.toLowerCase()
    return getPedidos()
      .filter((p) => p.direccion.email.toLowerCase() === email)
      .sort(
        (a, b) =>
          new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
      )
  }, [user])

  const kpis = useMemo(() => {
    const total = misPedidos.reduce((acc, p) => acc + p.total, 0)
    const ticket = misPedidos.length > 0 ? total / misPedidos.length : 0
    return { pedidos: misPedidos.length, total, ticket }
  }, [misPedidos])

  const productosFavoritos = useMemo(
    () => PRODUCTOS.filter((p) => favoritos.includes(p.id)),
    [favoritos],
  )

  if (!user) return null

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handleRepetirPedido = (pedido: Pedido) => {
    pedido.items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          sku: item.sku,
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imagen,
        },
        item.cantidad,
      )
    })
    setPedidoDetalle(null)
    navigate('/carrito')
  }

  return (
    <div className="bg-ink-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
        {/* Cabecera */}
        <div className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-yunque-500 text-ink-900 grid place-items-center text-xl lg:text-2xl font-black shrink-0">
              {perfil.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-black text-ink-900 truncate">
                Hola, {perfil.nombre.split(' ')[0]}
              </h1>
              <p className="text-sm text-ink-500 mt-0.5 truncate">{perfil.email}</p>
              <span className="mt-1.5 inline-block rounded-full bg-yunque-500 text-ink-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                {user.rol}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-4 lg:gap-6">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-ink-200 bg-white p-2 lg:p-3">
            <nav className="flex lg:block gap-1 overflow-x-auto lg:overflow-visible">
              {NAV.map(({ value, label, icon: Icon }) => {
                const active = seccion === value
                const count =
                  value === 'pedidos' ? misPedidos.length
                  : value === 'favoritos' ? productosFavoritos.length
                  : value === 'direcciones' ? direcciones.length
                  : undefined

                return (
                  <button
                    key={value}
                    onClick={() => setSeccion(value)}
                    className={cn(
                      'shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                      active
                        ? 'bg-yunque-500 text-ink-900'
                        : 'text-ink-700 hover:bg-ink-100',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="lg:flex-1 text-left">{label}</span>
                    {count !== undefined && count > 0 && (
                      <span
                        className={cn(
                          'rounded-full text-xs font-bold px-2 py-0.5',
                          active ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600',
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            <div className="hidden lg:block mt-3 pt-3 border-t border-ink-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-600 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </aside>

          {/* Contenido */}
          <main className="min-w-0">
            {seccion === 'pedidos' && (
              <PedidosTab
                pedidos={misPedidos}
                kpis={kpis}
                onVerDetalle={setPedidoDetalle}
                onRepetir={handleRepetirPedido}
              />
            )}
            {seccion === 'perfil' && <PerfilTab perfil={perfil} />}
            {seccion === 'direcciones' && <DireccionesTab />}
            {seccion === 'favoritos' && <FavoritosTab productos={productosFavoritos} />}
          </main>
        </div>
      </div>

      <PublicOrderModal
        open={!!pedidoDetalle}
        onClose={() => setPedidoDetalle(null)}
        pedido={pedidoDetalle}
        onRepeat={handleRepetirPedido}
      />
    </div>
  )
}

// ==================== TAB: PEDIDOS ====================
function PedidosTab({
  pedidos,
  kpis,
  onVerDetalle,
  onRepetir,
}: {
  pedidos: Pedido[]
  kpis: { pedidos: number; total: number; ticket: number }
  onVerDetalle: (p: Pedido) => void
  onRepetir: (p: Pedido) => void
}) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-3 gap-2 lg:gap-4">
        <MiniKpi label="Pedidos" value={String(kpis.pedidos)} icon={ShoppingBag} />
        <MiniKpi label="Total gastado" value={formatCurrency(kpis.total)} icon={Wallet} color="green" />
        <MiniKpi label="Ticket medio" value={formatCurrency(kpis.ticket)} icon={TrendingUp} />
      </div>

      {pedidos.length === 0 ? (
        <EmptyState
          icon={PackageX}
          title="Aún no has hecho pedidos"
          description="Cuando realices tu primera compra aparecerá aquí."
          cta={{ label: 'Explorar catálogo', to: '/productos' }}
        />
      ) : (
        <div className="space-y-3">
          {pedidos.map((p) => {
            const fecha = new Date(p.creadoEn).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-5 hover:border-yunque-300 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-ink-900">{p.numero}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{fecha}</p>
                  </div>
                  <OrderStatusBadge estado={p.estado} />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    {p.items.slice(0, 4).map((item) => (
                      <img
                        key={item.id}
                        src={item.imagen}
                        alt=""
                        className="h-9 w-9 lg:h-10 lg:w-10 rounded-lg border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-xs lg:text-sm text-ink-600 ml-2">
                    {p.items.reduce((a, i) => a + i.cantidad, 0)} productos
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-base lg:text-lg font-black text-ink-900">
                      {formatCurrency(p.total)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-ink-100">
                  <Button size="sm" variant="ghost" onClick={() => onVerDetalle(p)}>
                    <Eye className="h-4 w-4 mr-1.5" />
                    Ver detalle
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onRepetir(p)}>
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Repetir
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==================== TAB: PERFIL ====================
function PerfilTab({
  perfil,
}: {
  perfil: { nombre: string; email: string; telefono: string }
}) {
  const { user } = useAuthStore()
  const { actualizarPerfil } = useProfileStore()
  const [nombre, setNombre] = useState(perfil.nombre)
  const [email, setEmail] = useState(perfil.email)
  const [telefono, setTelefono] = useState(perfil.telefono)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    actualizarPerfil({ nombre, email, telefono })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-xl font-black text-ink-900">Mi perfil</h2>
        <p className="text-sm text-ink-500 mt-1">
          {user?.rol === 'cliente' ? 'Actualiza tus datos personales' : 'Tu cuenta de ' + user?.rol}
        </p>
      </div>

      {saved && (
        <div className="mb-4">
          <Alert variant="success">
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4" />
              Datos actualizados correctamente
            </span>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <Input
          label="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled
        />
        <Input
          label="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Añade tu teléfono"
        />

        <div className="pt-2">
          <Button type="submit">Guardar cambios</Button>
        </div>
      </form>
    </div>
  )
}

// ==================== TAB: DIRECCIONES ====================
function DireccionesTab() {
  const {
    direcciones, agregarDireccion, actualizarDireccion, eliminarDireccion,
    marcarPrincipal,
  } = useProfileStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Direccion | null>(null)
  const [aEliminar, setAEliminar] = useState<string | null>(null)

  const abrirNueva = () => {
    setEditando(null)
    setModalOpen(true)
  }
  const abrirEditar = (d: Direccion) => {
    setEditando(d)
    setModalOpen(true)
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg lg:text-xl font-black text-ink-900">Direcciones</h2>
          <p className="text-sm text-ink-500 mt-1">Gestiona tus direcciones de envío</p>
        </div>
        <Button onClick={abrirNueva}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir
        </Button>
      </div>

      {direcciones.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Sin direcciones"
          description="Añade tu primera dirección de envío."
          cta={{ label: 'Añadir dirección', onClick: abrirNueva }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
          {direcciones.map((d: Direccion) => (
            <div
              key={d.id}
              className={cn(
                'rounded-2xl border p-4 lg:p-5 relative',
                d.principal
                  ? 'border-yunque-400 bg-yunque-50/40'
                  : 'border-ink-200 bg-white',
              )}
            >
              {d.principal && (
                <span className="absolute top-3 right-3 rounded-full bg-yunque-500 text-ink-900 text-[10px] font-bold px-2 py-0.5">
                  PRINCIPAL
                </span>
              )}

              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-ink-500" />
                <p className="font-bold text-ink-900">{d.alias}</p>
              </div>

              <div className="space-y-1 text-sm text-ink-700">
                <p className="font-semibold">{d.nombre}</p>
                <p>{d.direccion}</p>
                <p>{d.codigoPostal} {d.ciudad}, {d.provincia}</p>
                <p className="flex items-center gap-1.5 text-ink-500 pt-1">
                  <Phone className="h-3.5 w-3.5" />
                  {d.telefono}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-ink-200/70 flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => abrirEditar(d)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
                {!d.principal && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => marcarPrincipal(d.id)}>
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Principal
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setAEliminar(d.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <DireccionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        direccion={editando}
        onSave={(data) => {
          if (editando) actualizarDireccion(editando.id, data)
          else agregarDireccion(data)
          setModalOpen(false)
        }}
      />

      <ConfirmDialog
        open={!!aEliminar}
        onClose={() => setAEliminar(null)}
        onConfirm={() => {
          if (aEliminar) eliminarDireccion(aEliminar)
        }}
        title="Eliminar dirección"
        description="¿Seguro que quieres eliminar esta dirección? Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  )
}

function DireccionFormModal({
  open,
  onClose,
  direccion,
  onSave,
}: {
  open: boolean
  onClose: () => void
  direccion: Direccion | null
  onSave: (data: Omit<Direccion, 'id'>) => void
}) {
  const initialForm = (value: Direccion | null): Omit<Direccion, 'id'> => {
    if (!value) {
      return {
        alias: 'Casa',
        nombre: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        provincia: '',
        principal: false,
      }
    }

    const { id, ...rest } = value
    return rest
  }

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={direccion ? 'Editar dirección' : 'Nueva dirección'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="dir-form">
            {direccion ? 'Guardar cambios' : 'Crear dirección'}
          </Button>
        </>
      }
    >
      <DireccionFormContent
        initialForm={initialForm(direccion)}
        onSave={onSave}
      />
    </Modal>
  )
}

function DireccionFormContent({
  initialForm,
  onSave,
}: {
  initialForm: Omit<Direccion, 'id'>
  onSave: (data: Omit<Direccion, 'id'>) => void
}) {
  const [form, setForm] = useState<Omit<Direccion, 'id'>>(initialForm)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form id="dir-form" onSubmit={handleSave} className="space-y-4">
      <Input
        label="Alias"
        placeholder="Casa, Oficina, Obra..."
        value={form.alias}
        onChange={(e) => setForm({ ...form, alias: e.target.value })}
        required
      />
      <Input
        label="Nombre completo"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        required
      />
      <Input
        label="Teléfono"
        value={form.telefono}
        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        required
      />
      <Input
        label="Dirección"
        value={form.direccion}
        onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        required
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          value={form.ciudad}
          onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
          required
        />
        <Input
          label="Código postal"
          value={form.codigoPostal}
          onChange={(e) => setForm({ ...form, codigoPostal: e.target.value })}
          required
        />
      </div>
      <Input
        label="Provincia"
        value={form.provincia}
        onChange={(e) => setForm({ ...form, provincia: e.target.value })}
        required
      />

      <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={form.principal}
          onChange={(e) => setForm({ ...form, principal: e.target.checked })}
          className="rounded border-ink-300 text-yunque-500 focus:ring-yunque-400"
        />
        <span className="text-sm text-ink-700">Marcar como dirección principal</span>
      </label>
    </form>
  )
}

// ==================== TAB: FAVORITOS ====================
function FavoritosTab({ productos }: { productos: typeof PRODUCTOS }) {
  if (productos.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Sin favoritos"
        description="Guarda productos que te gusten para encontrarlos más rápido."
        cta={{ label: 'Explorar catálogo', to: '/productos' }}
      />
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="text-lg lg:text-xl font-black text-ink-900">Favoritos</h2>
        <p className="text-sm text-ink-500 mt-1">
          {productos.length} {productos.length === 1 ? 'producto guardado' : 'productos guardados'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  )
}

// ==================== Subcomponentes ====================
function MiniKpi({
  label,
  value,
  icon: Icon,
  color = 'default',
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color?: 'default' | 'green'
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-3 lg:p-5">
      <div className={cn('h-9 w-9 lg:h-10 lg:w-10 rounded-xl grid place-items-center', color === 'green' ? 'bg-green-50' : 'bg-yunque-50')}>
        <Icon className={cn('h-4 w-4 lg:h-5 lg:w-5', color === 'green' ? 'text-green-600' : 'text-yunque-700')} />
      </div>
      <p className="mt-2 lg:mt-3 text-[10px] lg:text-xs font-bold text-ink-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-0.5 lg:mt-1 text-base lg:text-xl font-black text-ink-900 truncate">
        {value}
      </p>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  cta?: { label: string; to?: string; onClick?: () => void }
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-white p-8 lg:p-12 text-center">
      <div className="mx-auto h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-ink-100 grid place-items-center">
        <Icon className="h-7 w-7 lg:h-8 lg:w-8 text-ink-400" />
      </div>
      <h3 className="mt-4 text-base lg:text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-500 max-w-sm mx-auto">{description}</p>
      {cta && (
        <div className="mt-5">
          {cta.to ? (
            <Link to={cta.to}><Button>{cta.label}</Button></Link>
          ) : (
            <Button onClick={cta.onClick}>{cta.label}</Button>
          )}
        </div>
      )}
    </div>
  )
}
