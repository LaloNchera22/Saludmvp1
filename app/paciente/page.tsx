export default function PacienteDashboard() {
  return (
    <main className="py-[120px] px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 uppercase">Portal de Paciente</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="border border-border-dark p-8 flex flex-col justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">Estatus de Financiamiento</h2>
          <p className="text-4xl font-mono text-sereza-turquoise font-bold">Activo</p>
          <div className="mt-8 pt-4 border-t border-border-light flex justify-between">
            <span className="text-xs uppercase tracking-wider">Crédito Aprobado</span>
            <span className="font-mono text-sm">#SHS-9281</span>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between bg-foreground text-background">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Próxima Cuota</h2>
          <p className="text-4xl font-mono font-bold">$1,250.00</p>
          <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider">Vence: 15 Oct</span>
            <button className="text-[11px] font-black uppercase tracking-wider hover:text-sereza-turquoise transition-colors">Pagar Ahora →</button>
          </div>
        </div>

        <div className="border border-border-dark p-8 flex flex-col justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">Módulos de Membresía</h2>
          <ul className="space-y-4 font-mono text-sm">
            <li className="flex justify-between items-center pb-2 border-b border-border-light">
              <span>Odontología</span>
              <span className="bg-sereza-turquoise text-white text-[10px] px-2 py-1 uppercase font-black tracking-wider">Activo</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-border-light">
              <span>Nutrición</span>
              <span className="bg-sereza-turquoise text-white text-[10px] px-2 py-1 uppercase font-black tracking-wider">Activo</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
