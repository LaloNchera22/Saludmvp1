import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 py-[120px]">
      <div className="w-full max-w-md border border-border-dark p-8 md:p-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Iniciar Sesión</h1>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-wider">Correo Electrónico</label>
            <input type="email" className="border-b border-border-dark p-3 focus:outline-none focus:border-sereza-turquoise bg-transparent transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-wider">Contraseña</label>
            <input type="password" className="border-b border-border-dark p-3 focus:outline-none focus:border-sereza-turquoise bg-transparent transition-colors" />
          </div>
          <div className="mt-8">
            <Button className="w-full">Entrar</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
