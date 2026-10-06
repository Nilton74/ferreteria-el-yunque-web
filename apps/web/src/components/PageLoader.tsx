export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-3 border-ink-200" />
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-yunque-500 animate-spin" />
        </div>
        <p className="text-sm text-ink-500 font-medium">Cargando…</p>
      </div>
    </div>
  )
}
