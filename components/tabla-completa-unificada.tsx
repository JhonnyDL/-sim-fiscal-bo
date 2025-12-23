"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, TrendingDown } from "lucide-react"
import type { ResultadoAnual } from "@/lib/types"

interface Props {
    resultados: ResultadoAnual[]
    anoActual?: number
}

export default function TablaCompletaUnificada({ resultados, anoActual }: Props) {
    const resultadosMostrar = anoActual !== undefined ? resultados.slice(0, anoActual + 1) : resultados

    const exportarCSV = () => {
        const headers = [
            "Año",
            "Ingresos",
            "Gastos",
            "Déficit",
            "Deuda Total",
            "Deuda Externa",
            "Deuda Interna",
            "Deuda/PIB%",
            "RIN",
            "PIB",
        ]

        const rows = resultadosMostrar.map((r) => [
            r.ano,
            r.ingresos_totales.toFixed(2),
            r.gastos_totales.toFixed(2),
            r.deficit_superavit.toFixed(2),
            r.deuda_total.toFixed(2),
            r.deuda_externa.toFixed(2),
            r.deuda_interna.toFixed(2),
            r.deuda_pib_ratio.toFixed(2),
            r.rin.toFixed(2),
            r.pib.toFixed(2),
        ])

        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `simulacion-completa-${Date.now()}.csv`
        a.click()
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Datos Detallados - Vista Completa</CardTitle>
                            <CardDescription>
                                Todos los indicadores fiscales, macroeconómicos y análisis de deuda por año
                            </CardDescription>
                        </div>
                        <Button onClick={exportarCSV} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="resumen" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="resumen">Resumen General</TabsTrigger>
                            <TabsTrigger value="deuda">Análisis de Deuda</TabsTrigger>
                            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
                            <TabsTrigger value="gastos">Gastos</TabsTrigger>
                        </TabsList>

                        {/* Tab 1: Resumen General */}
                        <TabsContent value="resumen" className="space-y-6">
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-yellow-400">
                                            <TableHead className="font-bold">Año</TableHead>
                                            <TableHead className="font-bold text-right">Ingresos</TableHead>
                                            <TableHead className="font-bold text-right">Gastos</TableHead>
                                            <TableHead className="font-bold text-right">Déficit/Superávit</TableHead>
                                            <TableHead className="font-bold text-right">Deuda Total</TableHead>
                                            <TableHead className="font-bold text-right">Deuda/PIB</TableHead>
                                            <TableHead className="font-bold text-right">RIN</TableHead>
                                            <TableHead className="font-bold text-right">PIB</TableHead>
                                            <TableHead className="font-bold text-right">Saldo Com.</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {resultadosMostrar.map((resultado, idx) => (
                                            <TableRow key={resultado.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                <TableCell className="font-medium">{resultado.ano}</TableCell>
                                                <TableCell className="text-right text-green-600 font-semibold">
                                                    Bs.{resultado.ingresos_totales.toFixed(0)}M
                                                </TableCell>
                                                <TableCell className="text-right text-red-600 font-semibold">
                                                    Bs.{resultado.gastos_totales.toFixed(0)}M
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={
                                                            resultado.deficit_superavit > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"
                                                        }
                                                    >
                                                        {resultado.deficit_superavit > 0 ? "-" : "+"}Bs.
                                                        {Math.abs(resultado.deficit_superavit).toFixed(0)}M
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    Bs.{resultado.deuda_total.toFixed(0)}M
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {resultado.deuda_pib_ratio.toFixed(1)}%
                                                        {resultado.deuda_pib_ratio > 70 && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                ALTO
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        Bs.{resultado.rin.toFixed(0)}M
                                                        {resultado.rin_meses_importacion < 3 && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                BAJO
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">Bs.{resultado.pib.toFixed(0)}M</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={resultado.saldo_comercial > 0 ? "text-green-600" : "text-red-600"}>
                                                        {resultado.saldo_comercial > 0 ? "+" : ""}Bs.{resultado.saldo_comercial.toFixed(0)}M
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        {/* Tab 2: Deuda Pública */}
                        <TabsContent value="deuda" className="space-y-6">
                            {/*Tabla de Deuda Externa vs Interna */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-orange-600 rounded"></div>
                                    Deuda Pública Desagregada (Externa vs Interna)
                                </h3>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-orange-100">
                                                <TableHead>Año</TableHead>
                                                <TableHead className="text-right">Deuda Externa</TableHead>
                                                <TableHead className="text-right">Δ Externa</TableHead>
                                                <TableHead className="text-right">Deuda Interna</TableHead>
                                                <TableHead className="text-right">Δ Interna</TableHead>
                                                <TableHead className="text-right">Deuda Total</TableHead>
                                                <TableHead className="text-right">Intereses Tot.</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultadosMostrar.map((r, idx) => (
                                                <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                    <TableCell className="font-medium">{r.ano}</TableCell>
                                                    <TableCell className="text-right font-semibold text-orange-700">
                                                        Bs.{r.deuda_externa.toFixed(0)}M
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={r.delta_deuda_externa > 0 ? "text-red-600" : "text-green-600"}>
                                                            {r.delta_deuda_externa > 0 ? "+" : ""}
                                                            {r.delta_deuda_externa.toFixed(0)}M
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-blue-700">
                                                        Bs.{r.deuda_interna.toFixed(0)}M
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={r.delta_deuda_interna > 0 ? "text-red-600" : "text-green-600"}>
                                                            {r.delta_deuda_interna > 0 ? "+" : ""}
                                                            {r.delta_deuda_interna.toFixed(0)}M
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">Bs.{r.deuda_total.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right text-red-600">
                                                        Bs.{r.intereses_totales.toFixed(0)}M
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Leyenda de Indicadores */}
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <h4 className="font-semibold mb-3">Indicadores Clave:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="font-medium">Δ (Delta):</span> Cambio respecto al año anterior
                                    </div>
                                    <div>
                                        <span className="font-medium">Int. (Intereses):</span> Pago anual de intereses de la deuda
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                    <h5 className="font-semibold mb-2">Alertas:</h5>
                                    <ul className="space-y-1 text-xs text-gray-600">
                                        <li>• Deuda Externa/PIB &gt; 40% = ALTO</li>
                                        <li>• Deuda Interna/PIB &gt; 30% = ALTO</li>
                                        <li>• Deuda Total/PIB &gt; 70% = CRÍTICO</li>
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab 3: Ingresos Desagregados */}
                        <TabsContent value="ingresos" className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-green-600 rounded"></div>
                                    Ingresos por Hidrocarburos y Minería
                                </h3>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-green-100">
                                                <TableHead>Año</TableHead>
                                                <TableHead className="text-right">Gas Natural</TableHead>
                                                <TableHead className="text-right">Total Hidrocarburos</TableHead>
                                                <TableHead className="text-right">Zinc</TableHead>
                                                <TableHead className="text-right">Estaño</TableHead>
                                                <TableHead className="text-right">Oro</TableHead>
                                                <TableHead className="text-right">Plata</TableHead>
                                                <TableHead className="text-right">Litio</TableHead>
                                                <TableHead className="text-right">Total Minería</TableHead>
                                                <TableHead className="text-right">% del Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultadosMostrar.map((r, idx) => {
                                                const totalRecursosNaturales = r.ing_hidrocarburos_total + r.ing_mineria_total
                                                const porcentajeDelTotal = (totalRecursosNaturales / r.ingresos_totales) * 100

                                                return (
                                                    <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                        <TableCell className="font-medium">{r.ano}</TableCell>
                                                        <TableCell className="text-right font-semibold text-blue-700">
                                                            Bs.{r.ing_gas.toFixed(0)}M
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold">
                                                            Bs.{r.ing_hidrocarburos_total.toFixed(0)}M
                                                        </TableCell>
                                                        <TableCell className="text-right text-amber-600">Bs.{r.ing_zinc.toFixed(0)}M</TableCell>
                                                        <TableCell className="text-right text-gray-600">Bs.{r.ing_estano.toFixed(0)}M</TableCell>
                                                        <TableCell className="text-right text-yellow-600">Bs.{r.ing_oro.toFixed(0)}M</TableCell>
                                                        <TableCell className="text-right text-gray-400">Bs.{r.ing_plata.toFixed(0)}M</TableCell>
                                                        <TableCell className="text-right text-cyan-600">Bs.{r.ing_litio.toFixed(0)}M</TableCell>
                                                        <TableCell className="text-right font-bold">Bs.{r.ing_mineria_total.toFixed(0)}M</TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge variant={porcentajeDelTotal > 40 ? "default" : "secondary"}>
                                                                {porcentajeDelTotal.toFixed(1)}%
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-emerald-600 rounded"></div>
                                    Ingresos Tributarios
                                </h3>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-emerald-100">
                                                <TableHead>Año</TableHead>
                                                <TableHead className="text-right">IVA</TableHead>
                                                <TableHead className="text-right">IUE</TableHead>
                                                <TableHead className="text-right">IT</TableHead>
                                                <TableHead className="text-right">ITF</TableHead>
                                                <TableHead className="text-right">RC-IVA</TableHead>
                                                <TableHead className="text-right">ICE</TableHead>
                                                <TableHead className="text-right">GA</TableHead>
                                                <TableHead className="text-right">Total Impuestos</TableHead>
                                                <TableHead className="text-right">Presión Tributaria</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultadosMostrar.map((r, idx) => (
                                                <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                    <TableCell className="font-medium">{r.ano}</TableCell>
                                                    <TableCell className="text-right">Bs.{r.ing_iva.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right">Bs.{r.ing_iue.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right">Bs.{r.ing_it.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right">Bs.{r.ing_itf.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right">Bs.{r.ing_rc_iva.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right">Bs.{r.ing_ice.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right">Bs.{r.ing_ga.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right font-bold">Bs.{r.ing_impuestos_total.toFixed(0)}M</TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant={r.presion_tributaria < 15 ? "destructive" : "default"}>
                                                            {r.presion_tributaria.toFixed(1)}%
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-teal-600 rounded"></div>
                                    Evolución de Ingresos (Variación Anual)
                                </h3>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-teal-100">
                                                <TableHead>Año</TableHead>
                                                <TableHead className="text-right">Δ Ingresos Totales</TableHead>
                                                <TableHead className="text-right">Δ Hidrocarburos</TableHead>
                                                <TableHead className="text-right">Δ Minería</TableHead>
                                                <TableHead className="text-right">Δ Impuestos</TableHead>
                                                <TableHead className="text-right">Ingresos/PIB %</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultadosMostrar.map((r, idx) => {
                                                const anterior = idx > 0 ? resultadosMostrar[idx - 1] : null
                                                const deltaIngresos = anterior ? r.ingresos_totales - anterior.ingresos_totales : 0
                                                const deltaHidrocarburos = anterior
                                                    ? r.ing_hidrocarburos_total - anterior.ing_hidrocarburos_total
                                                    : 0
                                                const deltaMineria = anterior ? r.ing_mineria_total - anterior.ing_mineria_total : 0
                                                const deltaImpuestos = anterior ? r.ing_impuestos_total - anterior.ing_impuestos_total : 0
                                                const ingresosPibRatio = (r.ingresos_totales / r.pib) * 100

                                                return (
                                                    <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                        <TableCell className="font-medium">{r.ano}</TableCell>
                                                        <TableCell className="text-right">
                                                            {idx === 0 ? (
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                <div className="flex items-center justify-end gap-1">
                                                                    {deltaIngresos > 0 ? (
                                                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                                                    ) : (
                                                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                                                    )}
                                                                    <span className={deltaIngresos > 0 ? "text-green-600" : "text-red-600"}>
                                                                        {deltaIngresos > 0 ? "+" : ""}
                                                                        Bs.{deltaIngresos.toFixed(0)}M
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {idx === 0 ? (
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                <span className={deltaHidrocarburos > 0 ? "text-green-600" : "text-red-600"}>
                                                                    {deltaHidrocarburos > 0 ? "+" : ""}
                                                                    Bs.{deltaHidrocarburos.toFixed(0)}M
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {idx === 0 ? (
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                <span className={deltaMineria > 0 ? "text-green-600" : "text-red-600"}>
                                                                    {deltaMineria > 0 ? "+" : ""}
                                                                    Bs.{deltaMineria.toFixed(0)}M
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {idx === 0 ? (
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                <span className={deltaImpuestos > 0 ? "text-green-600" : "text-red-600"}>
                                                                    {deltaImpuestos > 0 ? "+" : ""}
                                                                    Bs.{deltaImpuestos.toFixed(0)}M
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">{ingresosPibRatio.toFixed(1)}%</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab 4: Gastos Fiscales Desagregados */}
                        <TabsContent value="gastos" className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-red-600 rounded"></div>
                                    Gastos Fiscales Desagregados
                                </h3>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-red-100">
                                                <TableHead>Año</TableHead>
                                                <TableHead className="text-right">Inversión Pública</TableHead>
                                                <TableHead className="text-right">Total Gastos</TableHead>
                                                <TableHead className="text-right">Gastos/PIB %</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultadosMostrar.map((r, idx) => {
                                                const gastosPibRatio = (r.gastos_totales / r.pib) * 100

                                                return (
                                                    <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                        <TableCell className="font-medium">{r.ano}</TableCell>
                                                        <TableCell className="text-right font-semibold text-blue-700">
                                                            Bs.{r.gasto_inversion.toFixed(0)}M
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold text-red-700">
                                                            Bs.{r.gastos_totales.toFixed(0)}M
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge variant={gastosPibRatio > 35 ? "destructive" : "default"}>
                                                                {gastosPibRatio.toFixed(1)}%
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-orange-600 rounded"></div>
                                    Subsidios y Servicio de Deuda
                                </h3>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-orange-100">
                                                <TableHead>Año</TableHead>
                                                <TableHead className="text-right">Subsidio Combustibles</TableHead>
                                                <TableHead className="text-right">Subsidio Alimentos</TableHead>
                                                <TableHead className="text-right">Total Subsidios</TableHead>
                                                <TableHead className="text-right">Intereses Totales</TableHead>
                                                <TableHead className="text-right">% del Gasto Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultadosMostrar.map((r, idx) => {
                                                const totalSubsidios = r.gasto_subsidio_combustibles + r.gasto_subsidio_alimentos
                                                const porcentajeSubsidios = (totalSubsidios / r.gastos_totales) * 100
                                                const porcentajeIntereses = (r.intereses_totales / r.gastos_totales) * 100

                                                return (
                                                    <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                        <TableCell className="font-medium">{r.ano}</TableCell>
                                                        <TableCell className="text-right text-amber-700">
                                                            Bs.{r.gasto_subsidio_combustibles.toFixed(0)}M
                                                        </TableCell>
                                                        <TableCell className="text-right text-amber-700">
                                                            Bs.{r.gasto_subsidio_alimentos.toFixed(0)}M
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold">Bs.{totalSubsidios.toFixed(0)}M</TableCell>
                                                        <TableCell className="text-right font-bold text-purple-700">
                                                            Bs.{r.intereses_totales.toFixed(0)}M
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex flex-col gap-1">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Subs: {porcentajeSubsidios.toFixed(1)}%
                                                                </Badge>
                                                                <Badge
                                                                    variant={porcentajeIntereses > 15 ? "destructive" : "secondary"}
                                                                    className="text-xs"
                                                                >
                                                                    Int: {porcentajeIntereses.toFixed(1)}%
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-pink-600 rounded"></div>
                                    Evolución y Eficiencia del Gasto
                                </h3>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-pink-100">
                                                <TableHead>Año</TableHead>
                                                <TableHead className="text-right">Δ Gastos Totales</TableHead>
                                                <TableHead className="text-right">Δ Inversión Pública</TableHead>
                                                <TableHead className="text-right">Δ Subsidios</TableHead>
                                                <TableHead className="text-right">Inversión/Gastos %</TableHead>
                                                <TableHead className="text-right">Resultado Primario</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resultadosMostrar.map((r, idx) => {
                                                const anterior = idx > 0 ? resultadosMostrar[idx - 1] : null
                                                const deltaGastos = anterior ? r.gastos_totales - anterior.gastos_totales : 0
                                                const deltaInversion = anterior ? r.gasto_inversion - anterior.gasto_inversion : 0
                                                const deltaSubsidios = anterior
                                                    ? r.gasto_subsidio_combustibles +
                                                    r.gasto_subsidio_alimentos -
                                                    (anterior.gasto_subsidio_combustibles + anterior.gasto_subsidio_alimentos)
                                                    : 0
                                                const inversionGastosRatio = (r.gasto_inversion / r.gastos_totales) * 100

                                                return (
                                                    <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                        <TableCell className="font-medium">{r.ano}</TableCell>
                                                        <TableCell className="text-right">
                                                            {idx === 0 ? (
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                <div className="flex items-center justify-end gap-1">
                                                                    {deltaGastos > 0 ? (
                                                                        <TrendingUp className="h-3 w-3 text-red-500" />
                                                                    ) : (
                                                                        <TrendingDown className="h-3 w-3 text-green-500" />
                                                                    )}
                                                                    <span className={deltaGastos > 0 ? "text-red-600" : "text-green-600"}>
                                                                        {deltaGastos > 0 ? "+" : ""}
                                                                        Bs.{deltaGastos.toFixed(0)}M
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {idx === 0 ? (
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                <span className={deltaInversion > 0 ? "text-green-600" : "text-red-600"}>
                                                                    {deltaInversion > 0 ? "+" : ""}
                                                                    Bs.{deltaInversion.toFixed(0)}M
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {idx === 0 ? (
                                                                <span className="text-gray-400">-</span>
                                                            ) : (
                                                                <span className={deltaSubsidios > 0 ? "text-red-600" : "text-green-600"}>
                                                                    {deltaSubsidios > 0 ? "+" : ""}
                                                                    Bs.{deltaSubsidios.toFixed(0)}M
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge variant={inversionGastosRatio < 20 ? "destructive" : "default"}>
                                                                {inversionGastosRatio.toFixed(1)}%
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <span
                                                                className={
                                                                    r.resultado_primario > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"
                                                                }
                                                            >
                                                                {r.resultado_primario > 0 ? "-" : "+"} Bs.{Math.abs(r.resultado_primario).toFixed(0)}M
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
