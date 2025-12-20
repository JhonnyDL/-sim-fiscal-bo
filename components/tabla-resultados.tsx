"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { ResultadoAnual } from "@/lib/simulador-avanzado"

interface Props {
  resultados: ResultadoAnual[]
  anoActual?: number
}

export default function TablaResultados({ resultados, anoActual }: Props) {
  const resultadosMostrar = anoActual !== undefined ? resultados.slice(0, anoActual + 1) : resultados

  const exportarExcel = () => {
    // Crear CSV
    const headers = [
      "Año",
      "Ingresos",
      "Gastos",
      "Déficit",
      "Deuda",
      "Deuda/PIB%",
      "RIN",
      "PIB",
      "Saldo Comercial",
      "Capacidad Pago",
    ]

    const rows = resultadosMostrar.map((r) => [
      r.ano,
      r.ingresos_totales.toFixed(2),
      r.gastos_totales.toFixed(2),
      r.deficit_superavit.toFixed(2),
      r.deuda_total.toFixed(2),
      r.deuda_pib_ratio.toFixed(2),
      r.rin.toFixed(2),
      r.pib.toFixed(2),
      r.saldo_comercial.toFixed(2),
      r.capacidad_pago.toFixed(2),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `simulacion-fiscal-bolivia-${Date.now()}.csv`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resultados Detallados por Año</CardTitle>
            <CardDescription>Todos los indicadores fiscales y macroeconómicos</CardDescription>
          </div>
          <Button onClick={exportarExcel} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-400">
                <TableHead className="font-bold">Año</TableHead>
                <TableHead className="font-bold text-right">Ingresos</TableHead>
                <TableHead className="font-bold text-right">Gastos</TableHead>
                <TableHead className="font-bold text-right">Déficit</TableHead>
                <TableHead className="font-bold text-right">Deuda</TableHead>
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
                    ${resultado.ingresos_totales.toFixed(0)}M
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-semibold">
                    ${resultado.gastos_totales.toFixed(0)}M
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        resultado.deficit_superavit > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"
                      }
                    >
                      {resultado.deficit_superavit > 0 ? "-" : "+"}${Math.abs(resultado.deficit_superavit).toFixed(0)}M
                    </span>
                  </TableCell>
                  <TableCell className="text-right">${resultado.deuda_total.toFixed(0)}M</TableCell>
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
                      ${resultado.rin.toFixed(0)}M
                      {resultado.rin_meses_importacion < 3 && (
                        <Badge variant="destructive" className="text-xs">
                          BAJO
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${resultado.pib.toFixed(0)}M</TableCell>
                  <TableCell className="text-right">
                    <span className={resultado.saldo_comercial > 0 ? "text-green-600" : "text-red-600"}>
                      {resultado.saldo_comercial > 0 ? "+" : ""}${resultado.saldo_comercial.toFixed(0)}M
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Tabla de ingresos desagregados */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-green-600 rounded"></div>
            Ingresos Desagregados por Fuente
          </h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-100">
                  <TableHead>Año</TableHead>
                  <TableHead className="text-right">Gas</TableHead>
                  <TableHead className="text-right">Zinc</TableHead>
                  <TableHead className="text-right">Estaño</TableHead>
                  <TableHead className="text-right">Oro</TableHead>
                  <TableHead className="text-right">Plata</TableHead>
                  <TableHead className="text-right">Litio</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                  <TableHead className="text-right">IUE</TableHead>
                  <TableHead className="text-right">Otros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultadosMostrar.map((r, idx) => (
                  <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    <TableCell>{r.ano}</TableCell>
                    <TableCell className="text-right">${r.ing_gas.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.ing_zinc.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.ing_estano.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.ing_oro.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.ing_plata.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.ing_litio.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.ing_iva.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.ing_iue.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">
                      ${(r.ing_it + r.ing_itf + r.ing_rc_iva + r.ing_ice + r.ing_ga).toFixed(0)}M
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Tabla de gastos desagregados */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-red-600 rounded"></div>
            Gastos Desagregados por Categoría
          </h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-100">
                  <TableHead>Año</TableHead>
                  <TableHead className="text-right">Sueldos</TableHead>
                  <TableHead className="text-right">Bienes/Servicios</TableHead>
                  <TableHead className="text-right">Inversión</TableHead>
                  <TableHead className="text-right">Sub. Combustibles</TableHead>
                  <TableHead className="text-right">Sub. Alimentos</TableHead>
                  <TableHead className="text-right">Intereses</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultadosMostrar.map((r, idx) => (
                  <TableRow key={r.ano} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    <TableCell>{r.ano}</TableCell>
                    <TableCell className="text-right">${r.gasto_sueldos.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.gasto_bienes_servicios.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.gasto_inversion.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.gasto_subsidio_combustibles.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.gasto_subsidio_alimentos.toFixed(0)}M</TableCell>
                    <TableCell className="text-right">${r.intereses_totales.toFixed(0)}M</TableCell>
                    <TableCell className="text-right font-bold">${r.gastos_totales.toFixed(0)}M</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
