export default function ServiciosPage() {
  return (
    <main className="py-[120px] px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-16 uppercase">Nuestros Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="border border-border-dark p-12">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">Financiamiento Médico</h2>
          <p className="mb-6 leading-relaxed">Paga directamente a tu proveedor médico en plazos de 3 a 24 meses. Flexibilidad total para tu bienestar.</p>
        </section>
        <section className="border border-border-dark p-12">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">Membresías Modulares</h2>
          <p className="mb-6 leading-relaxed">Opciones anuales como Odontología, Psicología, Oftalmología, y Nutrición. Personaliza tu atención médica.</p>
        </section>
      </div>
    </main>
  );
}
