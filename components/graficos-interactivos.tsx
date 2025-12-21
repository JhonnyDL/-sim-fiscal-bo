"use client"

import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ResultadoAnual } from "@/lib/types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
)

interface Props {
  resultados: ResultadoAnual[]
  anoActual?: number
}

export default function GraficosInteractivos({ resultados, anoActual = resultados.length - 1 }: Props) {
  const anos = resultados.map((r) => r.ano.toString())

  const resultadosHastaAhora = resultados.slice(0, anoActual + 1)
  const anosHastaAhora = resultadosHastaAhora.map((r) => r.ano.toString())

  // Gráfico 1: Evolución Fiscal (Ingresos vs Gastos vs Déficit)
  const dataEvolucionFiscal = {
    labels: anosHastaAhora,
    datasets: [
      {
        label: "Ingresos Totales",
        data: resultadosHastaAhora.map((r) => r.ingresos_totales),
        borderColor: "#007A3D",
        backgroundColor: "rgba(0, 122, 61, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Gastos Totales",
        data: resultadosHastaAhora.map((r) => r.gastos_totales),
        borderColor: "#DA291C",
        backgroundColor: "rgba(218, 41, 28, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Déficit/Superávit",
        data: resultadosHastaAhora.map((r) => -r.deficit_superavit),
        borderColor: "#FCD116",
        backgroundColor: "rgba(252, 209, 22, 0.2)",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  }

  // Gráfico 2: Deuda y Sostenibilidad
  const dataDeuda = {
    labels: anosHastaAhora,
    datasets: [
      {
        label: "Deuda Total (MM USD)",
        data: resultadosHastaAhora.map((r) => r.deuda_total),
        borderColor: "#DA291C",
        backgroundColor: "rgba(218, 41, 28, 0.8)",
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Deuda/PIB (%)",
        data: resultadosHastaAhora.map((r) => r.deuda_pib_ratio),
        borderColor: "#FCD116",
        backgroundColor: "rgba(252, 209, 22, 0.8)",
        borderWidth: 2,
        type: "line" as const,
        yAxisID: "y1",
      },
    ],
  }

  // Gráfico 3: Composición de Ingresos (último año visible)
  const ultimoResultado = resultadosHastaAhora[resultadosHastaAhora.length - 1]
  const dataIngresos = {
    labels: ["Gas", "Minerales", "IVA", "IUE", "Otros Impuestos"],
    datasets: [
      {
        data: [
          ultimoResultado.ing_hidrocarburos_total,
          ultimoResultado.ing_mineria_total,
          ultimoResultado.ing_iva,
          ultimoResultado.ing_iue,
          ultimoResultado.ing_it +
          ultimoResultado.ing_itf +
          ultimoResultado.ing_rc_iva +
          ultimoResultado.ing_ice +
          ultimoResultado.ing_ga,
        ],
        backgroundColor: ["#007A3D", "#8B4513", "#FCD116", "#FF6384", "#DA291C"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  }

  // Gráfico 4: RIN y Sector Externo
  const dataSectorExterno = {
    labels: anosHastaAhora,
    datasets: [
      {
        label: "RIN (MM USD)",
        data: resultadosHastaAhora.map((r) => r.rin),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Saldo Comercial",
        data: resultadosHastaAhora.map((r) => r.saldo_comercial),
        borderColor: "#007A3D",
        backgroundColor: "rgba(0, 122, 61, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  }

  const optionsComunes = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += "$" + context.parsed.y.toFixed(0) + "M"
            }
            return label
          },
        },
      },
    },
  }

  return (
    <div className="grid gap-6">
      {/* Evolución Fiscal */}
      <Card className="border-2 border-green-600">
        <CardHeader style={{ backgroundColor: "#007A3D", color: "white" }}>
          <CardTitle>Evolución Fiscal: Ingresos vs Gastos</CardTitle>
          <CardDescription className="text-green-100">
            Visualiza cómo los ingresos y gastos del Estado evolucionan año tras año y su impacto en el déficit fiscal
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Line data={dataEvolucionFiscal} options={optionsComunes} />
        </CardContent>
      </Card>

      {/* Deuda y Sostenibilidad */}
      <Card className="border-2 border-red-600">
        <CardHeader style={{ backgroundColor: "#DA291C", color: "white" }}>
          <CardTitle>Deuda Pública y Sostenibilidad Fiscal</CardTitle>
          <CardDescription className="text-red-100">
            Monitorea el crecimiento de la deuda y el ratio Deuda/PIB para evaluar riesgos fiscales
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Bar
            data={dataDeuda}
            options={{
              ...optionsComunes,
              scales: {
                y: {
                  type: "linear" as const,
                  display: true,
                  position: "left" as const,
                  title: {
                    display: true,
                    text: "Deuda (MM USD)",
                  },
                },
                y1: {
                  type: "linear" as const,
                  display: true,
                  position: "right" as const,
                  title: {
                    display: true,
                    text: "Deuda/PIB (%)",
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Composición de Ingresos */}
        <Card className="border-2 border-yellow-500">
          <CardHeader style={{ backgroundColor: "#FCD116" }}>
            <CardTitle>Composición de Ingresos {ultimoResultado.ano}</CardTitle>
            <CardDescription className="text-yellow-900">
              Distribución porcentual de las fuentes de ingresos fiscales
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex justify-center">
            <div style={{ maxWidth: "400px", width: "100%" }}>
              <Doughnut
                data={dataIngresos}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom" as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context: any) => {
                          const label = context.label || ""
                          const value = context.parsed
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                          const percentage = ((value / total) * 100).toFixed(1)
                          return `${label}: $${value.toFixed(0)}M (${percentage}%)`
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* RIN y Sector Externo */}
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle>Reservas Internacionales (RIN) y Sector Externo</CardTitle>
            <CardDescription className="text-blue-100">
              Capacidad del país para cubrir importaciones y honrar deuda externa
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Line
              data={dataSectorExterno}
              options={{
                ...optionsComunes,
                scales: {
                  y: {
                    type: "linear" as const,
                    display: true,
                    position: "left" as const,
                    title: {
                      display: true,
                      text: "RIN (MM USD)",
                    },
                  },
                  y1: {
                    type: "linear" as const,
                    display: true,
                    position: "right" as const,
                    title: {
                      display: true,
                      text: "Saldo Comercial (MM USD)",
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
