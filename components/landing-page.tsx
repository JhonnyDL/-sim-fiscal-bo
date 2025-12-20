"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, LineChart, Database, TrendingUp, DollarSign, Building2, ArrowRight } from "lucide-react"

const ROJO_BOLIVIA = "#DA291C"
const AMARILLO_BOLIVIA = "#FCD116"
const VERDE_BOLIVIA = "#007A3D"

interface FuenteDatos {
  nombre: string
  url: string
  icono: React.ReactNode
  descripcion: string
}

const fuentes: FuenteDatos[] = [
  {
    nombre: "Ministerio de Economía y Finanzas Públicas",
    url: "https://www.economiayfinanzas.gob.bo",
    icono: <Building2 className="h-6 w-6" />,
    descripcion: "Deuda pública, flujos de caja, ingresos tributarios, operaciones del sector público",
  },
  {
    nombre: "YPFB - Yacimientos Petrolíferos Fiscales Bolivianos",
    url: "https://www.ypfb.gob.bo/Gas_natural",
    icono: <TrendingUp className="h-6 w-6" />,
    descripcion: "Producción fiscalizada de gas natural, exportaciones, volumen comercializado mercado interno",
  },
  {
    nombre: "Instituto Nacional de Estadística (INE)",
    url: "https://www.ine.gob.bo",
    icono: <Database className="h-6 w-6" />,
    descripcion:
      "Comercio exterior, precios internacionales, cuentas nacionales, hidrocarburos, minería, estadísticas económicas",
  },
  {
    nombre: "Banco Central de Bolivia (BCB)",
    url: "https://www.bcb.gob.bo",
    icono: <DollarSign className="h-6 w-6" />,
    descripcion: "Tipos de cambio históricos, tasas de interés activas y pasivas, LIBOR, cotizaciones",
  },
  {
    nombre: "DatosMacro - Ratings Bolivia",
    url: "https://datosmacro.expansion.com/ratings/bolivia",
    icono: <LineChart className="h-4 w-4" />,
    descripcion: "Calificaciones de riesgo país, indicadores macroeconómicos internacionales",
  },
]

interface Props {
  onIniciar: () => void
}

export default function LandingPage({ onIniciar }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${ROJO_BOLIVIA} 0%, ${AMARILLO_BOLIVIA} 50%, ${VERDE_BOLIVIA} 100%)`,
          }}
        />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48 drop-shadow-2xl">
                <Image
                  src="/escudo-bolivia.png"
                  alt="Escudo de Bolivia"
                  fill
                  className="object-contain animate-float"
                  priority
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Simulador Fiscal Macroeconómico
              <br />
              <span style={{ color: VERDE_BOLIVIA }}>Estado Plurinacional de Bolivia</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed text-balance">
              Herramienta avanzada para análisis dinámico del Presupuesto General del Estado (PGE) con simulación
              <span className="font-bold text-red-600"> año por año</span> de relaciones causa-efecto entre variables
              macroeconómicas
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{ backgroundColor: VERDE_BOLIVIA }}
                onClick={onIniciar}
              >
                Iniciar Simulador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Características clave */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 hover:scale-105 transition-transform" style={{ borderColor: ROJO_BOLIVIA }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: ROJO_BOLIVIA }}>
                    <LineChart className="h-5 w-5" />
                    Simulación Año por Año
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Avance manual o automático con visualización progresiva de cada período fiscal
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:scale-105 transition-transform" style={{ borderColor: AMARILLO_BOLIVIA }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: "#E5A500" }}>
                    <TrendingUp className="h-5 w-5" />
                    Relaciones Causa-Efecto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Comprenda las interdependencias entre ingresos, gastos, deuda, RIN y crecimiento económico
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:scale-105 transition-transform" style={{ borderColor: VERDE_BOLIVIA }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: VERDE_BOLIVIA }}>
                    <Database className="h-5 w-5" />
                    Datos Oficiales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Basado en fuentes gubernamentales: MEFP, YPFB, INE, BCB y organismos internacionales
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Fuentes de Datos Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4" style={{ color: VERDE_BOLIVIA }}>
              Fuentes de Datos Oficiales
            </h2>
            <p className="text-center text-lg text-gray-600 mb-12 text-balance">
              Toda la información utilizada proviene de instituciones oficiales bolivianas y organismos reconocidos
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fuentes.map((fuente, idx) => (
                <Card key={idx} className="border-2 hover:shadow-lg transition-all group">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: AMARILLO_BOLIVIA }}
                      >
                        {fuente.icono}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{fuente.nombre}</CardTitle>
                        <CardDescription className="text-sm">{fuente.descripcion}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={fuente.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ color: VERDE_BOLIVIA }}
                    >
                      Visitar sitio web
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detalle de datos por categoría */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-base">Gobierno - MEFP</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-gray-700">
                  <p>• Deuda pública externa e interna TGN</p>
                  <p>• Flujos de caja (GAM, GAD, TGN)</p>
                  <p>• Inversión pública</p>
                  <p>• Recaudaciones tributarias</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-base">Gas Natural - YPFB</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-gray-700">
                  <p>• Producción fiscalizada</p>
                  <p>• Exportaciones por país</p>
                  <p>• Volumen mercado interno</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-base">Estadísticas - INE</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-gray-700">
                  <p>• Comercio exterior</p>
                  <p>• Precios internacionales</p>
                  <p>• Cuentas nacionales</p>
                  <p>• Hidrocarburos y minería</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-base">Finanzas - BCB</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-gray-700">
                  <p>• Tipos de cambio histórico</p>
                  <p>• Tasas de interés</p>
                  <p>• LIBOR</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-base">Riesgo País</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-gray-700">
                  <p>• Calificaciones crediticias</p>
                  <p>• Indicadores de riesgo</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-base">Minería - INE</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-gray-700">
                  <p>• Zinc, Estaño, Oro, Plata</p>
                  <p>• Litio</p>
                  <p>• Precios y volúmenes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16" style={{ backgroundColor: VERDE_BOLIVIA }}>
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">¿Listo para explorar el sistema fiscal boliviano?</h3>
          <p className="text-white/90 text-lg mb-8">
            Modifique parámetros, observe impactos año por año y comprenda las dinámicas macroeconómicas
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            style={{ backgroundColor: "white", color: VERDE_BOLIVIA }}
            onClick={onIniciar}
          >
            Comenzar Simulación
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
