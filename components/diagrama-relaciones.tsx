"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import type { ResultadoAnual } from "@/lib/simulador-avanzado"

interface Props {
  resultado: ResultadoAnual
  resultadoAnterior?: ResultadoAnual
}

const VERDE_BOLIVIA = "#007A3D"
const ROJO_BOLIVIA = "#DA291C"
const AMARILLO_BOLIVIA = "#FCD116"

export default function DiagramaRelaciones({ resultado, resultadoAnterior }: Props) {
  const calcularCambio = (actual: number, anterior?: number) => {
    if (!anterior) return null
    const cambio = ((actual - anterior) / anterior) * 100
    return cambio
  }

  const CambioIndicador = ({ actual, anterior }: { actual: number; anterior?: number }) => {
    const cambio = calcularCambio(actual, anterior)
    if (!cambio) return null

    return (
      <span className={`flex items-center gap-1 text-xs ${cambio > 0 ? "text-green-600" : "text-red-600"}`}>
        {cambio > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(cambio).toFixed(1)}%
      </span>
    )
  }

  return (
    <Card className="border-2" style={{ borderColor: VERDE_BOLIVIA }}>
      <CardHeader style={{ backgroundColor: VERDE_BOLIVIA, color: "white" }}>
        <CardTitle className="flex items-center gap-2">
          Diagrama de Relaciones Causa-Efecto - Año {resultado.ano}
        </CardTitle>
        <CardDescription className="text-green-100">
          Visualización de cómo las variables se afectan entre sí en el sistema fiscal boliviano
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* NIVEL 1: EXPORTACIONES → INGRESOS */}
          <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-300">
            <h3 className="font-bold text-lg mb-4 text-blue-900">1. Exportaciones → Ingresos Fiscales</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="font-semibold text-blue-800">Exportación de Gas</div>
                <div className="pl-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Ingresos Gas:</span>
                    <span className="font-bold">${resultado.ing_gas.toFixed(0)}M</span>
                  </div>
                  <CambioIndicador actual={resultado.ing_gas} anterior={resultadoAnterior?.ing_gas} />
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  IDH 32% + Regalías 18%
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-semibold text-blue-800">Exportación de Minerales</div>
                <div className="pl-4 space-y-1 text-sm">
                  <div>Zinc: ${resultado.ing_zinc.toFixed(0)}M</div>
                  <div>Estaño: ${resultado.ing_estano.toFixed(0)}M</div>
                  <div>Oro: ${resultado.ing_oro.toFixed(0)}M</div>
                  <div>Plata: ${resultado.ing_plata.toFixed(0)}M</div>
                  <div>Litio: ${resultado.ing_litio.toFixed(0)}M</div>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Regalías mineras 5%
                </div>
              </div>

              <div className="p-3 rounded bg-green-100 border-2 border-green-500">
                <div className="font-bold text-green-900">INGRESOS POR EXPORTACIONES</div>
                <div className="text-2xl font-bold text-green-700 mt-2">
                  ${(resultado.ing_hidrocarburos_total + resultado.ing_mineria_total).toFixed(0)}M
                </div>
                <CambioIndicador
                  actual={resultado.ing_hidrocarburos_total + resultado.ing_mineria_total}
                  anterior={
                    resultadoAnterior
                      ? resultadoAnterior.ing_hidrocarburos_total + resultadoAnterior.ing_mineria_total
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          {/* NIVEL 2: IMPUESTOS */}
          <div className="p-4 rounded-lg bg-yellow-50 border-2 border-yellow-400">
            <h3 className="font-bold text-lg mb-4 text-yellow-900">2. Recaudación Tributaria</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>IVA:</span>
                  <span className="font-bold">
                    ${resultado.ing_iva.toFixed(0)}M
                    {resultado.ing_iva === 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        DESACTIVADO
                      </Badge>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>IUE:</span>
                  <span className="font-bold">
                    ${resultado.ing_iue.toFixed(0)}M
                    {resultado.ing_iue === 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        DESACTIVADO
                      </Badge>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>IT:</span>
                  <span className="font-bold">
                    ${resultado.ing_it.toFixed(0)}M
                    {resultado.ing_it === 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        DESACTIVADO
                      </Badge>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>ITF:</span>
                  <span className="font-bold">
                    ${resultado.ing_itf.toFixed(0)}M
                    {resultado.ing_itf === 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        DESACTIVADO
                      </Badge>
                    )}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded bg-yellow-100 border-2 border-yellow-500">
                <div className="font-bold text-yellow-900">INGRESOS TRIBUTARIOS</div>
                <div className="text-2xl font-bold text-yellow-700 mt-2">
                  ${resultado.ing_impuestos_total.toFixed(0)}M
                </div>
                <CambioIndicador
                  actual={resultado.ing_impuestos_total}
                  anterior={resultadoAnterior?.ing_impuestos_total}
                />
                <div className="text-xs mt-2 text-yellow-700">
                  Presión tributaria: {resultado.presion_tributaria.toFixed(1)}% del PIB
                </div>
              </div>
            </div>
          </div>

          {/* NIVEL 3: INGRESOS TOTALES → GASTOS */}
          <div className="p-4 rounded-lg bg-green-50 border-2 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-green-900">3. Balance Fiscal</h3>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">INGRESOS TOTALES</div>
                <div className="text-2xl font-bold text-green-700">${resultado.ingresos_totales.toFixed(0)}M</div>
              </div>
            </div>

            <div className="flex items-center justify-center my-4">
              <ArrowRight className="h-8 w-8" style={{ color: VERDE_BOLIVIA }} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="font-semibold text-green-800 mb-2">Gastos Corrientes</div>
                <div className="pl-4 space-y-1 text-sm">
                  <div>Sueldos: ${resultado.gasto_sueldos.toFixed(0)}M</div>
                  <div>Bienes/Servicios: ${resultado.gasto_bienes_servicios.toFixed(0)}M</div>
                  <div>
                    Subsidio combustibles: ${resultado.gasto_subsidio_combustibles.toFixed(0)}M
                    {resultado.gasto_subsidio_combustibles === 0 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        OFF
                      </Badge>
                    )}
                  </div>
                  <div>
                    Subsidio alimentos: ${resultado.gasto_subsidio_alimentos.toFixed(0)}M
                    {resultado.gasto_subsidio_alimentos === 0 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        OFF
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-green-800 mb-2">Gastos de Capital e Intereses</div>
                <div className="pl-4 space-y-1 text-sm">
                  <div>Inversión pública: ${resultado.gasto_inversion.toFixed(0)}M</div>
                  <div>Intereses deuda externa: ${resultado.intereses_deuda_externa.toFixed(0)}M</div>
                  <div>Intereses deuda interna: ${resultado.intereses_deuda_interna.toFixed(0)}M</div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">GASTOS TOTALES</div>
              <div className="text-2xl font-bold text-red-600">${resultado.gastos_totales.toFixed(0)}M</div>
            </div>
          </div>

          {/* NIVEL 4: DÉFICIT → DEUDA */}
          <div className="p-4 rounded-lg bg-red-50 border-2 border-red-500">
            <h3 className="font-bold text-lg mb-4 text-red-900">
              4. Déficit Fiscal → Incremento de Deuda (CAUSA → EFECTO)
            </h3>
            <div className="grid md:grid-cols-3 gap-4 items-center">
              <div className="p-4 rounded bg-red-100 border-2 border-red-400">
                <div className="font-bold text-red-900">DÉFICIT FISCAL</div>
                <div className="text-2xl font-bold text-red-700 mt-2">
                  {resultado.deficit_superavit > 0 ? "-" : "+"}${Math.abs(resultado.deficit_superavit).toFixed(0)}M
                </div>
                <div className="text-xs mt-1 text-red-600">{resultado.deficit_pib_ratio.toFixed(1)}% del PIB</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <ArrowRight className="h-8 w-8 text-red-600" />
                <div className="text-xs text-center text-muted-foreground">
                  Financiamiento:
                  <br />
                  60% externa, 40% interna
                </div>
              </div>

              <div className="p-4 rounded bg-orange-100 border-2 border-orange-500">
                <div className="font-bold text-orange-900">DEUDA PÚBLICA</div>
                <div className="text-2xl font-bold text-orange-700 mt-2">${resultado.deuda_total.toFixed(0)}M</div>
                <CambioIndicador actual={resultado.deuda_total} anterior={resultadoAnterior?.deuda_total} />
                <div className="text-xs mt-1 text-orange-600">
                  Ratio Deuda/PIB: {resultado.deuda_pib_ratio.toFixed(1)}%
                  {resultado.deuda_pib_ratio > 70 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      RIESGO
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* NIVEL 5: SECTOR EXTERNO → RIN */}
          <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-500">
            <h3 className="font-bold text-lg mb-4 text-blue-900">5. Sector Externo → RIN (CAUSA → EFECTO)</h3>
            <div className="grid md:grid-cols-3 gap-4 items-center">
              <div className="p-4 rounded bg-blue-100 border-2 border-blue-400">
                <div className="font-bold text-blue-900">SALDO COMERCIAL</div>
                <div
                  className={`text-2xl font-bold mt-2 ${resultado.saldo_comercial > 0 ? "text-green-700" : "text-red-700"}`}
                >
                  {resultado.saldo_comercial > 0 ? "+" : ""}${resultado.saldo_comercial.toFixed(0)}M
                </div>
                <div className="text-xs mt-1 text-blue-600">
                  Exp: ${resultado.exportaciones.toFixed(0)}M - Imp: ${resultado.importaciones.toFixed(0)}M
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <ArrowRight className="h-8 w-8 text-blue-600" />
                <div className="text-xs text-center text-muted-foreground">
                  Afecta reservas
                  <br />
                  menos servicio de deuda
                </div>
              </div>

              <div className="p-4 rounded bg-cyan-100 border-2 border-cyan-500">
                <div className="font-bold text-cyan-900">RESERVAS (RIN)</div>
                <div className="text-2xl font-bold text-cyan-700 mt-2">${resultado.rin.toFixed(0)}M</div>
                <CambioIndicador actual={resultado.rin} anterior={resultadoAnterior?.rin} />
                <div className="text-xs mt-1 text-cyan-600">
                  Cubre {resultado.rin_meses_importacion.toFixed(1)} meses de importaciones
                  {resultado.rin_meses_importacion < 3 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      CRÍTICO
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
