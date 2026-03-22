import Image from "next/image";

const WHATSAPP_URL =
  "https://wa.me/524423175599?text=Hola%2C%20me%20interesa%20obtener%20una%20cotizaci%C3%B3n%20de%20Sereza";

// ─── Reusable atoms ───────────────────────────────────────────────────────────

function WhatsAppButton({
  label = "Solicita tu cotización",
  size = "md",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-[10px] px-6 py-3 tracking-[0.3em]",
    md: "text-[11px] px-8 py-4 tracking-[0.4em]",
    lg: "text-[12px] px-10 py-5 tracking-[0.4em]",
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-3
        bg-foreground text-background
        hover:bg-sereza-turquoise hover:text-foreground
        transition-colors duration-200
        font-black uppercase
        border border-foreground
        ${sizeClasses[size]}
      `}
    >
      <WhatsAppIcon />
      <span>{label}</span>
      <span className="font-mono text-[14px] leading-none">→</span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] font-black uppercase tracking-widest border border-sereza-turquoise text-sereza-turquoise px-3 py-1.5 mb-8">
      {children}
    </span>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="border-b border-border-dark w-full">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="/" aria-label="Sereza inicio">
          <Image
            src="/assets/logo.png"
            alt="Sereza"
            width={110}
            height={36}
            className="object-contain"
            priority
          />
        </a>
        <WhatsAppButton label="Cotiza por WhatsApp" size="sm" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="w-full border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
        <SectionLabel>Piloto Exclusivo · Querétaro, México</SectionLabel>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[1.05] tracking-tight mb-8 max-w-4xl">
          Cuidarte no debería costarte{" "}
          <span className="text-sereza-turquoise">todo.</span>
        </h1>

        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mb-12 text-foreground/80">
          Sereza ofrece financiamiento médico directo y membresías de salud
          modulares para que pagues tu atención en plazos accesibles.
          La salud que mereces, sin comprometer tu futuro.
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          <WhatsAppButton label="Solicita tu cotización" size="lg" />
          <a
            href="#servicios"
            className="inline-flex items-center text-[11px] font-black uppercase tracking-[0.3em] border-b border-foreground hover:text-sereza-turquoise hover:border-sereza-turquoise transition-colors py-5 px-2"
          >
            Conoce más ↓
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "44M+", label: "personas sin acceso a salud de calidad en México" },
    { value: "3–24", label: "meses de plazo para pagar tu atención médica" },
    { value: "5", label: "especialidades disponibles en membresías modulares" },
  ];

  return (
    <section className="w-full bg-foreground text-background border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
        {items.map(({ value, label }) => (
          <div key={value} className="py-10 sm:py-8 sm:px-12 first:pt-10 last:pb-10">
            <p className="text-5xl md:text-6xl font-black text-sereza-turquoise leading-none mb-3">
              {value}
            </p>
            <p className="text-[13px] uppercase tracking-wider leading-relaxed text-white/70">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatWeDo() {
  return (
    <section className="w-full border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <SectionLabel>Qué hacemos</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight mb-6">
              Salud accesible para todos en México.
            </h2>
          </div>
          <div>
            <p className="text-base md:text-lg leading-relaxed text-foreground/70 mb-6">
              En México, más de 44 millones de personas no tienen acceso a
              atención médica de calidad. La razón no siempre es falta de
              voluntad — es falta de opciones financieras.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/70">
              Sereza conecta a pacientes con proveedores médicos de confianza,
              ofreciendo financiamiento directo y membresías modulares para que
              el costo nunca vuelva a ser un obstáculo para tu salud.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      number: "01",
      title: "Financiamiento Médico",
      description:
        "Paga directamente a tu proveedor médico en plazos de 3 a 24 meses. Cirugías, tratamientos dentales, consultas especializadas — sin liquidar todo de golpe.",
      features: [
        "Aprobación rápida y sin burocracia",
        "Pagos directos al proveedor médico",
        "Plazos de 3 a 24 meses",
        "Transparencia total en tasas y condiciones",
      ],
    },
    {
      number: "02",
      title: "Membresías Modulares",
      description:
        "Arma tu plan de salud con las especialidades que realmente necesitas. Paga una cuota anual y accede a atención de calidad cuando la necesites.",
      features: [
        "Odontología preventiva y correctiva",
        "Psicología y salud mental",
        "Oftalmología y optometría",
        "Nutrición y medicina general",
      ],
    },
  ];

  return (
    <section id="servicios" className="w-full border-b border-border-light scroll-mt-0">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <SectionLabel>Servicios</SectionLabel>

        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-16">
          Dos formas de cuidarte.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-dark">
          {services.map((service, i) => (
            <div
              key={service.number}
              className={`p-10 md:p-14 ${i === 0 ? "border-b md:border-b-0 md:border-r border-border-dark" : ""}`}
            >
              <span className="block text-[11px] font-mono text-sereza-turquoise tracking-widest mb-6">
                {service.number}
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-5">
                {service.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-foreground/70 mb-8">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-3 text-[13px] leading-relaxed"
                  >
                    <span className="text-sereza-turquoise font-black mt-0.5 shrink-0">
                      →
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Contáctanos por WhatsApp",
      description:
        "Escríbenos con tu necesidad médica. Te respondemos en menos de 24 horas con opciones personalizadas.",
    },
    {
      step: "02",
      title: "Evaluamos tu caso",
      description:
        "Analizamos tu situación para ofrecerte el plan de financiamiento o membresía que mejor se ajusta a ti.",
    },
    {
      step: "03",
      title: "Recibes tu plan",
      description:
        "Te presentamos condiciones claras: monto, plazo y cuota mensual. Sin letras pequeñas ni sorpresas.",
    },
    {
      step: "04",
      title: "Accede a tu atención",
      description:
        "Ve con tu proveedor médico. Sereza cubre directamente el pago. Tú pagas en cómodos plazos.",
    },
  ];

  return (
    <section className="w-full border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <SectionLabel>Cómo funciona</SectionLabel>

        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-16">
          Cuatro pasos. Sin complicaciones.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border-dark">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className={`p-8 md:p-10 ${
                i < steps.length - 1
                  ? "border-b sm:border-b-0 sm:border-r border-border-dark"
                  : ""
              } ${
                i === 1 ? "lg:border-r border-border-dark" : ""
              } ${
                i >= 2 ? "sm:border-t lg:border-t-0" : ""
              }`}
            >
              <span className="block text-[11px] font-mono text-sereza-turquoise tracking-widest mb-6">
                {item.step}
              </span>
              <h3 className="text-base font-black uppercase tracking-wider mb-4">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-foreground/65">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="w-full bg-sereza-turquoise border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-foreground/60 mb-4">
            Empieza hoy
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tight max-w-xl">
            ¿Listo para cuidar tu salud sin límites?
          </h2>
        </div>
        <div className="shrink-0">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-3
              bg-foreground text-background
              hover:bg-white hover:text-foreground
              transition-colors duration-200
              font-black uppercase text-[12px] tracking-[0.4em]
              px-10 py-5
              border border-foreground
            "
          >
            <WhatsAppIcon />
            <span>Solicita tu cotización</span>
            <span className="font-mono text-[14px] leading-none">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Image
            src="/assets/logo.png"
            alt="Sereza"
            width={90}
            height={30}
            className="object-contain opacity-80"
          />
          <span className="text-[11px] text-foreground/40 uppercase tracking-wider">
            Health Services Company
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <span className="text-[11px] text-foreground/40 uppercase tracking-wider">
            Piloto exclusivo en Querétaro, México
          </span>
          <span className="text-[11px] text-foreground/30 uppercase tracking-wider">
            © {new Date().getFullYear()} Sereza
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Stats />
        <WhatWeDo />
        <Services />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
