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
import {
  type ResultadoAnual,
  type PasoSimulacion,
  ESCENARIOS_SHOCKS,
  type ResultadoMonteCarloComplete,
} from "@/lib/types"
import { simularFiscal, simularMonteCarlo, exportarExcel, exportarPDF, obtenerParametrosDefault } from "@/lib/api"
import { EditorParametrosAvanzados, type ParametrosModelo } from "@/components/editor-parametros-avanzados"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const ROJO_BOLIVIA = "#DA291C"
const VERDE_BOLIVIA = "#007A3D"

export default function Page() {
  const [mostrarLanding, setMostrarLanding] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("parametrizacion")
  const [parametros, setParametros] = useState<ParametrosModelo | null>(null)
  const [parametrosDefault, setParametrosDefault] = useState<ParametrosModelo | null>(null)
  const [cargandoParametros, setCargandoParametros] = useState(true)
  const [resultados, setResultados] = useState<ResultadoAnual[] | null>(null)
  const [pasos, setPasos] = useState<PasoSimulacion[]>([])
  const [simulando, setSimulando] = useState(false)
  const [anoVisualizacion, setAnoVisualizacion] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [velocidadAutoPlay, setVelocidadAutoPlay] = useState(2000) // milliseconds
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState<string | null>(null)
  const [metodoSimulacion, setMetodoSimulacion] = useState<"box-muller" | "monte-carlo">("box-muller")
  const [numSimulacionesMC, setNumSimulacionesMC] = useState(1000)
  const [resultadosMonteCarlo, setResultadosMonteCarlo] = useState<ResultadoMonteCarloComplete | null>(null)

  useEffect(() => {
    const cargarParametrosDefault = async () => {
      try {
        console.log("[v0] Cargando parámetros por defecto desde el backend...")
        const parametrosBackend = await obtenerParametrosDefault()
        console.log("[v0] Parámetros cargados:", parametrosBackend)
        setParametrosDefault(parametrosBackend)
        setParametros(parametrosBackend)
      } catch (error) {
        console.error("[v0] Error al cargar parámetros del backend:", error)
        alert("Error al cargar los parámetros por defecto. Verifica que el backend esté funcionando.")
      } finally {
        setCargandoParametros(false)
      }
    }

    cargarParametrosDefault()
  }, [])

  const aplicarEscenario = (escenario: string) => {
    if (!parametros) return
    console.log("[v0] Aplicando escenario:", escenario)
    setParametros({ ...parametros, ...ESCENARIOS_SHOCKS[escenario as keyof typeof ESCENARIOS_SHOCKS].shocks })
    setEscenarioSeleccionado(escenario)
  }

  const ejecutarSimulacion = async () => {
    if (!parametros) {
      alert("Los parámetros aún no se han cargado. Espera un momento e intenta nuevamente.")
      return
    }

    setSimulando(true)
    setAnoVisualizacion(0)
    setResultadosMonteCarlo(null)

    try {
      if (metodoSimulacion === "box-muller") {
        const resultado = await simularFiscal(parametros)
        setResultados(resultado.resultados)
        setPasos(resultado.pasos)
      } else {
        const resultadoMC = await simularMonteCarlo(parametros, numSimulacionesMC)
        setResultadosMonteCarlo(resultadoMC)
        setResultados(resultadoMC.simulacion_representativa)
        setPasos([]) // Monte Carlo no genera pasos detallados
      }
      setActiveTab("dashboard")
    } catch (error) {
      console.error("Error en simulación:", error)
      alert("Error al ejecutar la simulación. Verifica que el backend esté funcionando.")
    } finally {
      setSimulando(false)
    }
  }

  const resetear = () => {
    if (parametrosDefault) {
      setParametros(parametrosDefault)
      setResultados(null)
      setPasos([])
      setAnoVisualizacion(0)
      setAutoPlay(false)
      setEscenarioSeleccionado(null)
      setResultadosMonteCarlo(null)
    }
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

  if (cargandoParametros || !parametros) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <Card className="p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Cargando parámetros del modelo...</p>
            <p className="text-sm text-muted-foreground">Conectando con el backend</p>
          </div>
        </Card>
      </div>
    )
  }

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
                Método de Simulación
              </h3>
              <RadioGroup
                value={metodoSimulacion}
                onValueChange={(v) => setMetodoSimulacion(v as "box-muller" | "monte-carlo")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${metodoSimulacion === "box-muller"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                      }`}
                    onClick={() => setMetodoSimulacion("box-muller")}
                  >
                    <RadioGroupItem value="box-muller" id="box-muller" />
                    <div className="flex-1">
                      <Label htmlFor="box-muller" className="cursor-pointer font-semibold text-base">
                        Box-Müller (Simulación Única)
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Genera una trayectoria usando el algoritmo Box-Müller para variables aleatorias normales. Rápido
                        y eficiente para análisis individual.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${metodoSimulacion === "monte-carlo"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                      }`}
                    onClick={() => setMetodoSimulacion("monte-carlo")}
                  >
                    <RadioGroupItem value="monte-carlo" id="monte-carlo" />
                    <div className="flex-1">
                      <Label htmlFor="monte-carlo" className="cursor-pointer font-semibold text-base">
                        Monte Carlo (Múltiples Iteraciones)
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ejecuta múltiples simulaciones para obtener distribuciones de probabilidad y estadísticas (P5,
                        P50, P95). Más completo pero más lento.
                      </p>
                      {metodoSimulacion === "monte-carlo" && (
                        <div className="mt-3 flex items-center gap-2">
                          <Label htmlFor="num-sims" className="text-sm whitespace-nowrap">
                            Iteraciones:
                          </Label>
                          <Input
                            id="num-sims"
                            type="number"
                            min={100}
                            max={10000}
                            step={100}
                            value={numSimulacionesMC}
                            onChange={(e) => setNumSimulacionesMC(Number(e.target.value) || 1000)}
                            className="w-24"
                          />
                          <span className="text-xs text-muted-foreground">(100-10,000)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {metodoSimulacion === "monte-carlo" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Nota:</strong> El método Monte Carlo ejecutará {numSimulacionesMC.toLocaleString()}{" "}
                    simulaciones independientes usando Box-Müller para cada una. Esto puede tomar varios segundos
                    dependiendo del número de iteraciones.
                  </p>
                </div>
              )}
            </Card>

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

            <EditorParametrosAvanzados
              parametros={parametros}
              onParametrosChange={setParametros}
              onResetearParametros={resetear}
              parametrosDefault={parametrosDefault}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            {resultados && (
              <>
                {resultadosMonteCarlo && (
                  <Card className="p-6 shadow-lg border-2 bg-gradient-to-br from-blue-50 to-purple-50">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                      Resultados Monte Carlo ({resultadosMonteCarlo.num_simulaciones.toLocaleString()} simulaciones)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(() => {
                        const stats = resultadosMonteCarlo.resultados_estadisticos[anoVisualizacion]
                        return (
                          <>
                            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                              <p className="text-sm text-blue-700 font-medium mb-2">Déficit/Superávit</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P5 (optimista):</span>
                                  <span className="font-mono">${stats.deficit_superavit.percentil_5.toFixed(0)}M</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P50 (mediana):</span>
                                  <span className="font-mono font-bold">
                                    ${stats.deficit_superavit.mediana.toFixed(0)}M
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P95 (pesimista):</span>
                                  <span className="font-mono">${stats.deficit_superavit.percentil_95.toFixed(0)}M</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                              <p className="text-sm text-purple-700 font-medium mb-2">Deuda/PIB %</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P5 (optimista):</span>
                                  <span className="font-mono">{stats.deuda_pib_ratio.percentil_5.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P50 (mediana):</span>
                                  <span className="font-mono font-bold">
                                    {stats.deuda_pib_ratio.mediana.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P95 (pesimista):</span>
                                  <span className="font-mono">{stats.deuda_pib_ratio.percentil_95.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                              <p className="text-sm text-green-700 font-medium mb-2">RIN (millones USD)</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P5 (pesimista):</span>
                                  <span className="font-mono">${stats.rin.percentil_5.toFixed(0)}M</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P50 (mediana):</span>
                                  <span className="font-mono font-bold">${stats.rin.mediana.toFixed(0)}M</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P95 (optimista):</span>
                                  <span className="font-mono">${stats.rin.percentil_95.toFixed(0)}M</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Mostrando estadísticas para Año {resultados[anoVisualizacion].ano}. La simulación representativa
                      mostrada es la mediana de las {resultadosMonteCarlo.num_simulaciones.toLocaleString()}{" "}
                      iteraciones.
                    </p>
                  </Card>
                )}

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
                      onClick={async () => {
                        if (!resultados) return
                        try {
                          await exportarExcel({
                            parametros_iniciales: parametros,
                            resultados: resultados,
                            pasos: pasos,
                          })
                        } catch (error) {
                          console.error("Error al exportar Excel:", error)
                          alert("Error al exportar el archivo Excel")
                        }
                      }}
                      disabled={!resultados}
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
                      onClick={async () => {
                        if (!resultados) return
                        try {
                          await exportarPDF({
                            parametros_iniciales: parametros,
                            resultados: resultados,
                            pasos: pasos,
                          })
                        } catch (error) {
                          console.error("Error al exportar PDF:", error)
                          alert("Error al exportar el archivo PDF")
                        }
                      }}
                      disabled={!resultados}
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
