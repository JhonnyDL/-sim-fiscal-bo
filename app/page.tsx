"use client"
import LandingPage from "@/components/landing-page"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Play,
  Loader2,
  RotateCcw,
  Settings,
  BarChart3,
  Download,
  Calendar,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import TablaResultados from "@/components/tabla-resultados"
import GraficosInteractivos from "@/components/graficos-interactivos"
import DiagramaRelaciones from "@/components/diagrama-relaciones"
import GraficasDetalladas from "@/components/graficas-detalladas"
import { type ResultadoAnual, type PasoSimulacion, ESCENARIOS_SHOCKS } from "@/lib/types"
import { simularFiscal } from "@/lib/api"
import {
  EditorParametrosAvanzados,
  PARAMETROS_MODELO_DEFAULT,
  type ParametrosModelo,
} from "@/components/editor-parametros-avanzados"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const ROJO_BOLIVIA = "#DA291C"
const VERDE_BOLIVIA = "#007A3D"

export default function Page() {
  const [mostrarLanding, setMostrarLanding] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("parametrizacion")
  const [parametros, setParametros] = useState<ParametrosModelo>(PARAMETROS_MODELO_DEFAULT)
  const [resultados, setResultados] = useState<ResultadoAnual[] | null>(null)
  const [pasos, setPasos] = useState<PasoSimulacion[]>([])
  const [simulando, setSimulando] = useState(false)
  const [anoVisualizacion, setAnoVisualizacion] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [velocidadAutoPlay, setVelocidadAutoPlay] = useState(2000) // milliseconds
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState<string | null>(null)

  const aplicarEscenario = (escenario: string) => {
    console.log("[v0] Aplicando escenario:", escenario)
    setParametros({ ...parametros, ...ESCENARIOS_SHOCKS[escenario as keyof typeof ESCENARIOS_SHOCKS].shocks })
    setEscenarioSeleccionado(escenario)
  }

  const ejecutarSimulacion = async () => {
    setSimulando(true)
    setAnoVisualizacion(0)

    try {
      const resultado = await simularFiscal(parametros)
      setResultados(resultado.resultados)
      setPasos(resultado.pasos)
      setActiveTab("dashboard")
    } catch (error) {
      console.error("Error en simulación:", error)
      alert("Error al ejecutar la simulación. Verifica que el backend esté funcionando.")
    } finally {
      setSimulando(false)
    }
  }

  const resetear = () => {
    setParametros(PARAMETROS_MODELO_DEFAULT)
    setResultados(null)
    setPasos([])
    setAnoVisualizacion(0)
    setAutoPlay(false)
    setEscenarioSeleccionado(null)
  }

  const avanzarAno = () => {
    if (resultados && anoVisualizacion < resultados.length - 1) {
      setAnoVisualizacion((prev) => prev + 1)
    } else if (resultados && anoVisualizacion === resultados.length - 1) {
      setAutoPlay(false) // Stop auto-play at the end
    }
  }

  const retrocederAno = () => {
    if (anoVisualizacion > 0) {
      setAnoVisualizacion((prev) => prev - 1)
    }
  }

  const irAlAno = (ano: number) => {
    if (resultados && ano >= 0 && ano < resultados.length) {
      setAnoVisualizacion(ano)
    }
  }

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev)
  }

  useEffect(() => {
    if (autoPlay && resultados && anoVisualizacion < resultados.length - 1) {
      const timer = setTimeout(() => {
        avanzarAno()
      }, velocidadAutoPlay)
      return () => clearTimeout(timer)
    } else if (autoPlay && resultados && anoVisualizacion === resultados.length - 1) {
      setAutoPlay(false)
    }
  }, [autoPlay, anoVisualizacion, resultados, velocidadAutoPlay])
  if (mostrarLanding) {
    return <LandingPage onIniciar={() => setMostrarLanding(false)} />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--bolivia-rojo)] to-transparent" />
        <div className="absolute top-32 left-0 w-full h-32 bg-gradient-to-b from-[var(--bolivia-amarillo)] to-transparent" />
        <div className="absolute top-64 left-0 w-full h-32 bg-gradient-to-b from-[var(--bolivia-verde)] to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10 animate-fade-in">
        <div className="mb-8">
          <Card className="border-2 overflow-hidden shadow-lg animate-slide-in-up">
            <div className="h-2 gradient-bolivia" />
            <div className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col w-12 h-12 rounded-lg overflow-hidden shadow-md border-2 border-border">
                    <div className="h-1/3 bg-[#DA291C]" />
                    <div className="h-1/3 bg-[#FFD600]" />
                    <div className="h-1/3 bg-[#007A3D]" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--bolivia-verde)] via-[var(--bolivia-amarillo)] to-[var(--bolivia-rojo)] bg-clip-text text-transparent">
                      Simulador Fiscal de Bolivia
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Modelo estocástico DSGE • Proyección fiscal 2020-2025
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex items-center gap-2">
                    <Label htmlFor="anos-header" className="text-sm font-medium whitespace-nowrap">
                      Años:
                    </Label>
                    <Input
                      id="anos-header"
                      type="number"
                      min={1}
                      max={20}
                      value={parametros.anos}
                      onChange={(e) => setParametros({ ...parametros, anos: Number.parseInt(e.target.value) || 5 })}
                      className="w-20 h-9 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetear}
                    className="shadow-sm hover:shadow-md transition-shadow bg-transparent"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Resetear
                  </Button>
                  <Button
                    onClick={ejecutarSimulacion}
                    disabled={simulando}
                    className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-[var(--bolivia-verde)]"
                  >
                    {simulando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Simulando...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Simular
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-scale-in">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-card shadow-lg border-2">
            <TabsTrigger
              value="parametrizacion"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[var(--bolivia-verde)] data-[state=active]:text-primary-foreground py-3 transition-all"
            >
              <Settings className="h-5 w-5" />
              <span className="font-semibold">Parametrización</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[var(--bolivia-verde)] data-[state=active]:text-primary-foreground py-3 transition-all"
              disabled={!resultados}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="exportar"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[var(--bolivia-verde)] data-[state=active]:text-primary-foreground py-3 transition-all"
              disabled={!resultados}
            >
              <Download className="h-5 w-5" />
              <span className="font-semibold">Exportar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parametrizacion" className="space-y-6 animate-fade-in">
            <Card className="p-6 shadow-lg border-2">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="h-1 w-8 gradient-bolivia rounded-full" />
                Escenarios Predefinidos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(ESCENARIOS_SHOCKS).map(([key, escenario]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className={`h-auto py-4 flex flex-col items-start text-left transition-all hover:scale-105 ${escenarioSeleccionado === key
                      ? "bg-gradient-to-br from-primary to-[var(--bolivia-verde)] shadow-lg"
                      : "hover:border-primary"
                      }`}
                    onClick={() => aplicarEscenario(key)}
                  >
                    <span className="font-semibold text-sm">{escenario.nombre}</span>
                    <span className="text-xs text-muted-foreground mt-1 line-clamp-2">{escenario.descripcion}</span>
                  </Button>
                ))}
              </div>
            </Card>

            <EditorParametrosAvanzados parametros={parametros} onParametrosChange={setParametros} />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            {resultados && (
              <>
                <Card className="border-2 gradient-bolivia sticky top-0 z-10 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Year indicator and progress */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">
                            Año {resultados[anoVisualizacion].ano}
                            <Badge className="ml-3 text-lg px-3 py-1" style={{ backgroundColor: VERDE_BOLIVIA }}>
                              {anoVisualizacion + 1} / {resultados.length}
                            </Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Avance: {Math.round(((anoVisualizacion + 1) / resultados.length) * 100)}% completado
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setVelocidadAutoPlay(1000)}
                            className={velocidadAutoPlay === 1000 ? "bg-yellow-100" : ""}
                          >
                            Rápido (1s)
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setVelocidadAutoPlay(2000)}
                            className={velocidadAutoPlay === 2000 ? "bg-yellow-100" : ""}
                          >
                            Normal (2s)
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setVelocidadAutoPlay(3000)}
                            className={velocidadAutoPlay === 3000 ? "bg-yellow-100" : ""}
                          >
                            Lento (3s)
                          </Button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 ease-out gradient-bolivia"
                          style={{ width: `${((anoVisualizacion + 1) / resultados.length) * 100}%` }}
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => irAlAno(0)}
                            disabled={anoVisualizacion === 0}
                            variant="outline"
                            size="icon"
                            title="Ir al inicio"
                          >
                            <ChevronsLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={retrocederAno}
                            disabled={anoVisualizacion === 0}
                            variant="outline"
                            size="icon"
                            title="Año anterior"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={toggleAutoPlay}
                            size="lg"
                            className="px-6"
                            style={{ backgroundColor: autoPlay ? "#EF4444" : VERDE_BOLIVIA }}
                          >
                            {autoPlay ? (
                              <>
                                <Pause className="h-5 w-5 mr-2" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <Play className="h-5 w-5 mr-2" />
                                Auto-Simular
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={avanzarAno}
                            disabled={anoVisualizacion === resultados.length - 1}
                            variant="outline"
                            size="icon"
                            title="Año siguiente"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={() => irAlAno(resultados.length - 1)}
                            disabled={anoVisualizacion === resultados.length - 1}
                            variant="outline"
                            size="icon"
                            title="Ir al final"
                          >
                            <ChevronsRight className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Year selector dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Saltar a:</span>
                          <select
                            value={anoVisualizacion}
                            onChange={(e) => irAlAno(Number(e.target.value))}
                            className="border rounded px-3 py-2 bg-white"
                          >
                            {resultados.map((r, idx) => (
                              <option key={r.ano} value={idx}>
                                Año {r.ano}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Key metrics for current year */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 font-medium">Ingresos</p>
                          <p className="text-lg font-bold text-green-900">
                            ${resultados[anoVisualizacion].ingresos_totales.toFixed(0)}M
                          </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <p className="text-xs text-red-700 font-medium">Gastos</p>
                          <p className="text-lg font-bold text-red-900">
                            ${resultados[anoVisualizacion].gastos_totales.toFixed(0)}M
                          </p>
                        </div>
                        <div
                          className={`p-3 rounded-lg border ${resultados[anoVisualizacion].deficit_superavit > 0
                            ? "bg-red-50 border-red-200"
                            : "bg-green-50 border-green-200"
                            }`}
                        >
                          <p
                            className={`text-xs font-medium ${resultados[anoVisualizacion].deficit_superavit > 0 ? "text-red-700" : "text-green-700"
                              }`}
                          >
                            {resultados[anoVisualizacion].deficit_superavit > 0 ? "Déficit" : "Superávit"}
                          </p>
                          <p
                            className={`text-lg font-bold ${resultados[anoVisualizacion].deficit_superavit > 0 ? "text-red-900" : "text-green-900"
                              }`}
                          >
                            ${Math.abs(resultados[anoVisualizacion].deficit_superavit).toFixed(0)}M
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium">RIN</p>
                          <p className="text-lg font-bold text-blue-900">
                            ${resultados[anoVisualizacion].rin.toFixed(0)}M
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <DiagramaRelaciones
                  resultado={resultados[anoVisualizacion]}
                  resultadoAnterior={anoVisualizacion > 0 ? resultados[anoVisualizacion - 1] : undefined}
                />

                <GraficasDetalladas resultados={resultados} anoSeleccionado={anoVisualizacion} />

                <GraficosInteractivos resultados={resultados} />

                <TablaResultados resultados={resultados} />
              </>
            )}
          </TabsContent>

          <TabsContent value="exportar" className="space-y-6 animate-fade-in">
            <Card className="p-8 shadow-lg border-2">
              <div className="text-center space-y-6">
                <div>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-1 w-12 gradient-bolivia rounded-full" />
                    <h3 className="text-2xl font-bold">Exportar Resultados</h3>
                    <div className="h-1 w-12 gradient-bolivia rounded-full" />
                  </div>
                  <p className="text-muted-foreground">
                    Descarga los resultados de la simulación en diferentes formatos
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
                  <Card className="p-6 space-y-4 hover:border-primary hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2">
                    <div className="text-5xl">📊</div>
                    <h4 className="font-bold text-lg">Excel (.xlsx)</h4>
                    <p className="text-sm text-muted-foreground">
                      Exporta todos los datos en formato Excel para análisis detallado
                    </p>
                    <Button
                      className="w-full shadow-md hover:shadow-lg transition-all"
                      onClick={() => console.log("Exportar Excel")}
                      disabled={true}
                    >
                      Descargar Excel
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-4 hover:border-accent hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2">
                    <div className="text-5xl">📄</div>
                    <h4 className="font-bold text-lg">PDF</h4>
                    <p className="text-sm text-muted-foreground">Genera un reporte PDF con gráficos y tablas resumen</p>
                    <Button
                      className="w-full shadow-md hover:shadow-lg transition-all"
                      variant="secondary"
                      onClick={() => console.log("Exportar PDF")}
                      disabled={true}
                    >
                      Descargar PDF
                    </Button>
                  </Card>
                </div>

                {resultados && (
                  <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Datos incluidos:</strong> {resultados.length} años simulados, {parametros.anos} periodos,{" "}
                      {Object.keys(parametros).length} parámetros configurados
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
