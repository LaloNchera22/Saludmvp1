import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center py-[120px] px-6 text-center max-w-5xl mx-auto">
      <div className="mb-12 border border-sereza-turquoise text-sereza-turquoise px-4 py-2 text-[10px] font-black uppercase tracking-widest inline-block">
        Piloto Exclusivo en Querétaro
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 uppercase leading-[1.1]">
        Cuidarte no debería costarte <span className="text-sereza-turquoise">todo</span>.
      </h1>

      <p className="text-lg md:text-2xl mb-16 max-w-3xl leading-relaxed">
        Sereza Health Services Company ofrece financiamiento médico directo para pagar en plazos accesibles. La salud que mereces, sin comprometer tu futuro.
      </p>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        <Button>Aplica a tu crédito</Button>
        <button className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-foreground hover:text-sereza-turquoise hover:border-sereza-turquoise transition-colors py-2 px-4">
          Conoce más
        </button>
      </div>
    </main>
  );
}
