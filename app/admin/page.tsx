export default function AdminDashboard() {
  return (
    <main className="py-[120px] px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 uppercase">Panel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="border border-border-dark p-8 flex flex-col justify-between hover:border-sereza-turquoise transition-colors group">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500 group-hover:text-sereza-turquoise transition-colors">Créditos Otorgados</h2>
          <p className="text-5xl font-mono font-bold">4,281</p>
          <div className="mt-8 pt-4 border-t border-border-light flex justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-green-600">+12% este mes</span>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between hover:border-sereza-turquoise transition-colors group">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500 group-hover:text-sereza-turquoise transition-colors">Cartera Activa</h2>
          <p className="text-4xl font-mono font-bold text-sereza-turquoise truncate" title="$12,450,000 MXN">$12.4M</p>
          <div className="mt-8 pt-4 border-t border-border-light flex justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider">MXN</span>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between bg-foreground text-background">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Tasa de Morosidad</h2>
          <p className="text-5xl font-mono font-bold">9.2%</p>
          <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Estimada (8-12%)</span>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between hover:border-sereza-turquoise transition-colors group">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500 group-hover:text-sereza-turquoise transition-colors">Membresías Activas</h2>
          <p className="text-5xl font-mono font-bold">1,894</p>
          <div className="mt-8 pt-4 border-t border-border-light flex justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-green-600">+5% este mes</span>
          </div>
        </div>
      </div>
    </main>
  );
}
