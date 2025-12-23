"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ResultadoAnual } from "@/lib/types"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"

interface Props {
  resultados: ResultadoAnual[]
  anoSeleccionado: number
}

const COLORES = {
  hidrocarburos: "#DA291C",
  mineria: "#FCD116",
  impuestos: "#007A3D",
  gastos: "#FF6B6B",
  deuda: "#8B5CF6",
  rin: "#3B82F6",
}

export default function GraficasDetalladas({ resultados, anoSeleccionado }: Props) {
  const resultadoActual = resultados[anoSeleccionado]

  // Datos para composición de ingresos
  const datosIngresos = [
    { nombre: "Gas Natural", valor: resultadoActual.ing_gas, color: "#DA291C" },
    { nombre: "Zinc", valor: resultadoActual.ing_zinc, color: "#E63946" },
    { nombre: "Estaño", valor: resultadoActual.ing_estano, color: "#F1FAEE" },
    { nombre: "Oro", valor: resultadoActual.ing_oro, color: "#FFD700" },
    { nombre: "Plata", valor: resultadoActual.ing_plata, color: "#C0C0C0" },
    { nombre: "Litio", valor: resultadoActual.ing_litio, color: "#A8DADC" },
  ]

  // Datos para composición de impuestos
  const datosImpuestos = [
    { nombre: "IVA", valor: resultadoActual.ing_iva },
    { nombre: "IUE", valor: resultadoActual.ing_iue },
    { nombre: "IT", valor: resultadoActual.ing_it },
    { nombre: "ITF", valor: resultadoActual.ing_itf },
    { nombre: "RC-IVA", valor: resultadoActual.ing_rc_iva },
    { nombre: "ICE", valor: resultadoActual.ing_ice },
    { nombre: "GA", valor: resultadoActual.ing_ga },
  ].filter((item) => item.valor > 0)

  // Datos para composición de gastos
  const datosGastos = [
    { nombre: "Sueldos y Salarios", valor: resultadoActual.gasto_sueldos, color: "#E63946" },
    { nombre: "Bienes y Servicios", valor: resultadoActual.gasto_bienes_servicios, color: "#F1FAEE" },
    { nombre: "Inversión Pública", valor: resultadoActual.gasto_inversion, color: "#A8DADC" },
    { nombre: "Subsidio Combustibles", valor: resultadoActual.gasto_subsidio_combustibles, color: "#457B9D" },
    { nombre: "Subsidio Alimentos", valor: resultadoActual.gasto_subsidio_alimentos, color: "#1D3557" },
    { nombre: "Intereses Deuda", valor: resultadoActual.intereses_totales, color: "#8B5CF6" },
  ].filter((item) => item.valor > 0)

  // Series temporales para comparación
  const seriesTemporal = resultados.map((r) => ({
    ano: r.ano,
    ingresos: r.ingresos_totales,
    gastos: r.gastos_totales,
    deficit: r.deficit_superavit,
    deuda: r.deuda_total,
    rin: r.rin,
    deuda_pib: r.deuda_pib_ratio,
  }))

  // Evolución de exportaciones por commodity
  const evolucionExportaciones = resultados.map((r) => ({
    ano: r.ano,
    gas: r.ing_gas,
    mineria: r.ing_mineria_total,
    total: r.ing_hidrocarburos_total + r.ing_mineria_total,
  }))

  // Sostenibilidad fiscal a lo largo del tiempo
  const sostenibilidad = resultados.map((r) => ({
    ano: r.ano,
    deficit_pib: r.deficit_pib_ratio,
    deuda_pib: r.deuda_pib_ratio,
    presion_tributaria: r.presion_tributaria,
    capacidad_pago: r.capacidad_pago,
  }))

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-500">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Análisis Gráfico Detallado - Año {resultadoActual.ano}</CardTitle>
          <CardDescription className="text-blue-100">
            Visualización completa de todas las variables económicas y sus relaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfica 1: Composición de Ingresos por Exportaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ingresos por Exportaciones (Año {resultadoActual.ano})</CardTitle>
                <CardDescription>Desagregación por commodity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosIngresos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, valor }) => `${nombre}: Bs.${valor.toFixed(0)}M`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {datosIngresos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Bs.${value.toFixed(2)}M`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica 2: Composición de Impuestos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recaudación por Impuesto (Año {resultadoActual.ano})</CardTitle>
                <CardDescription>Solo impuestos activos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosImpuestos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `Bs.${value.toFixed(2)}M`} />
                    <Bar dataKey="valor" fill={COLORES.impuestos} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica 3: Composición de Gastos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estructura del Gasto Público (Año {resultadoActual.ano})</CardTitle>
                <CardDescription>Distribución del presupuesto</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosGastos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, valor }) => `${nombre}: Bs.${valor.toFixed(0)}M`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {datosGastos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Bs.${value.toFixed(2)}M`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica 4: Evolución Ingresos vs Gastos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ingresos vs Gastos - Evolución Temporal</CardTitle>
                <CardDescription>Trayectoria fiscal completa</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={seriesTemporal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `Bs.${value.toFixed(2)}M`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="ingresos"
                      fill="#10B981"
                      stroke="#10B981"
                      fillOpacity={0.3}
                      name="Ingresos"
                    />
                    <Area
                      type="monotone"
                      dataKey="gastos"
                      fill="#EF4444"
                      stroke="#EF4444"
                      fillOpacity={0.3}
                      name="Gastos"
                    />
                    <Line type="monotone" dataKey="deficit" stroke="#8B5CF6" strokeWidth={3} name="Déficit/Superávit" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica 5: Evolución de Exportaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evolución de Exportaciones por Sector</CardTitle>
                <CardDescription>Gas vs Minería</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evolucionExportaciones}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `Bs.${value.toFixed(2)}M`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="gas"
                      stackId="1"
                      stroke={COLORES.hidrocarburos}
                      fill={COLORES.hidrocarburos}
                      name="Gas Natural"
                    />
                    <Area
                      type="monotone"
                      dataKey="mineria"
                      stackId="1"
                      stroke={COLORES.mineria}
                      fill={COLORES.mineria}
                      name="Minería"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica 6: Indicadores de Sostenibilidad */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicadores de Sostenibilidad Fiscal</CardTitle>
                <CardDescription>Métricas clave de salud fiscal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sostenibilidad}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="deficit_pib" stroke="#EF4444" strokeWidth={2} name="Déficit/PIB %" />
                    <Line type="monotone" dataKey="deuda_pib" stroke="#8B5CF6" strokeWidth={2} name="Deuda/PIB %" />
                    <Line
                      type="monotone"
                      dataKey="presion_tributaria"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Presión Tributaria %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica 7: Evolución de Deuda y RIN */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deuda Pública y Reservas Internacionales</CardTitle>
                <CardDescription>Solvencia externa</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={seriesTemporal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}M`} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="deuda" fill={COLORES.deuda} name="Deuda Total" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rin"
                      stroke={COLORES.rin}
                      strokeWidth={3}
                      name="RIN"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica 8: Capacidad de Pago */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capacidad de Pago de la Deuda</CardTitle>
                <CardDescription>Ratio Ingresos/Intereses (mínimo saludable: 2.0x)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sostenibilidad}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}x`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="capacidad_pago"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Capacidad de Pago"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <Badge
                    variant={resultadoActual.capacidad_pago >= 2 ? "default" : "destructive"}
                    className="text-base px-4 py-2"
                  >
                    Capacidad actual: {resultadoActual.capacidad_pago.toFixed(2)}x
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
