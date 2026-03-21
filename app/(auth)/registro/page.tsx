import { Button } from "@/components/ui/Button";

export default function RegistroPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 py-[120px]">
      <div className="w-full max-w-md border border-border-dark p-8 md:p-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Registro</h1>
        <form className="flex flex-col gap-6">
          <p className="text-sm opacity-70 mb-4">Captura de datos para un scoring crediticio alternativo (historial bancario, ingresos) diseñado para incluir a usuarios no bancarizados.</p>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-wider">Nombre Completo</label>
            <input type="text" className="border-b border-border-dark p-3 focus:outline-none focus:border-sereza-turquoise bg-transparent transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-wider">Ingresos Mensuales Estimados</label>
            <input type="text" className="border-b border-border-dark p-3 focus:outline-none focus:border-sereza-turquoise bg-transparent transition-colors font-mono" placeholder="$0.00" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-wider">Historial Bancario (Opcional)</label>
            <input type="file" className="border-b border-border-dark py-3 focus:outline-none focus:border-sereza-turquoise bg-transparent transition-colors text-sm" />
          </div>

          <div className="mt-8">
            <Button className="w-full">Registrarse</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
