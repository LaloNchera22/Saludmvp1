import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-inter",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: "Sereza · Salud sin barreras financieras",
  description:
    "Financiamiento médico directo y membresías de salud modulares. Paga tu atención médica en plazos accesibles. Piloto exclusivo en Querétaro, México.",
  openGraph: {
    title: "Sereza · Salud sin barreras financieras",
    description:
      "Financiamiento médico directo y membresías de salud modulares en Querétaro.",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased text-foreground bg-background selection:bg-sereza-turquoise selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
