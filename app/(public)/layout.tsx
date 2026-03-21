import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="border-b border-border-dark flex justify-between items-center py-6 px-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/assets/logo.png" alt="Sereza Logo" width={120} height={40} className="object-contain" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/nosotros" className="text-[11px] font-black uppercase tracking-wider hover:text-sereza-turquoise transition-colors">Nosotros</Link>
          <Link href="/servicios" className="text-[11px] font-black uppercase tracking-wider hover:text-sereza-turquoise transition-colors">Servicios</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login">
            <button className="text-[11px] font-black uppercase tracking-wider px-4 py-4 hover:text-sereza-turquoise transition-colors">Entrar</button>
          </Link>
          <Link href="/registro">
            <Button showArrow={false} className="hidden md:inline-flex">Regístrate</Button>
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
