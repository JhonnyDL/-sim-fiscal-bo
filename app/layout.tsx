import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Simulador Macroeconómico Dinámico - Bolivia",
  description:
    "Herramienta interactiva para analizar cómo las variables del Presupuesto General del Estado (PGE) se afectan entre sí a lo largo del tiempo. Simulación fiscal boliviana con relaciones causa-efecto.",
  generator: "v0.app",
  icons: {
    icon: "/escudo-bolivia.png",
    apple: "/escudo-bolivia.png",
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
