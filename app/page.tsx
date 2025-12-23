"use client"
import LandingPage from "@/components/landing-page"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Play,
  Loader2,
  RotateCcw,
  Settings,
  BarChart3,
  Download,
  Calendar,
  Table2,
  Zap,
  X,
  ExternalLink,
  Activity,
} from "lucide-react"
import GraficosInteractivos from "@/components/graficos-interactivos"
import DiagramaRelaciones from "@/components/diagrama-relaciones"
import TablaCompletaUnificada from "@/components/tabla-completa-unificada"
import type { ResultadoAnual, PasoSimulacion, ResultadoMonteCarloComplete } from "@/lib/types"
import { ESCENARIOS_SHOCKS } from "@/lib/escenarios"
import { simularFiscal, simularMonteCarlo, exportarExcel, exportarPDF, obtenerParametrosDefault } from "@/lib/api"
import { EditorParametrosAvanzados, type ParametrosModelo } from "@/components/editor-parametros-avanzados"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { ControlSimulacionFlotante } from "@/components/control-simulacion-flotante"

const ROJO_BOLIVIA = "#DA291C"
const VERDE_BOLIVIA = "#007A3D"

export default function Page() {
  const [mostrarLanding, setMostrarLanding] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("parametrizacion")
  const [dashboardSubTab, setDashboardSubTab] = useState<string>("graficos")
  const [parametros, setParametros] = useState<ParametrosModelo | null>(null)
  const [parametrosDefault, setParametrosDefault] = useState<ParametrosModelo | null>(null)
  const [cargandoParametros, setCargandoParametros] = useState(true)
  const [resultados, setResultados] = useState<ResultadoAnual[] | null>(null)
  const [pasos, setPasos] = useState<PasoSimulacion[]>([])
  const [simulando, setSimulando] = useState(false)
  const [anoVisualizacion, setAnoVisualizacion] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [velocidadAutoPlay, setVelocidadAutoPlay] = useState(2000) // milliseconds
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState<string | null>("normal") // Establecer "normal" como escenario por defecto
  const [metodoSimulacion, setMetodoSimulacion] = useState<"box-muller" | "monte-carlo">("monte-carlo")
  const [numSimulacionesMC, setNumSimulacionesMC] = useState(1000)
  const [resultadosMonteCarlo, setResultadosMonteCarlo] = useState<ResultadoMonteCarloComplete | null>(null)
  const [cargando, setCargando] = useState(false)

  const cargarParametrosDefault = async () => {
    try {
      console.log("[v0] Cargando parámetros por defecto desde el backend...")
      const parametrosBackend = await obtenerParametrosDefault()
      console.log("[v0] Parámetros cargados exitosamente:", parametrosBackend)

      if (!parametrosBackend.tc_base) {
        console.error("[v0] ERROR: El backend no devolvió todos los parámetros avanzados")
        throw new Error("Parámetros incompletos del backend")
      }

      setParametrosDefault(parametrosBackend)
      setParametros(parametrosBackend)
    } catch (error) {
      console.error("[v0] Error al cargar parámetros:", error)
      alert(
        "Error: No se pudo conectar con el backend. Por favor, asegúrate de que el servidor Python esté ejecutándose en http://localhost:8000",
      )
    } finally {
      setCargandoParametros(false)
    }
  }

  useEffect(() => {
    cargarParametrosDefault()
  }, [])

  const aplicarEscenario = (escenario: string) => {
    if (!parametros) return
    console.log("[v0] Aplicando escenario:", escenario)

    const escenarioData = ESCENARIOS_SHOCKS[escenario as keyof typeof ESCENARIOS_SHOCKS]
    const nuevosParametros = { ...parametros, ...escenarioData.shocks }

    // Solo actualizar parámetros, no ejecutar simulación automáticamente
    setParametros(nuevosParametros)
    setEscenarioSeleccionado(escenario)

    toast({
      title: "Escenario aplicado",
      description: `Se ha aplicado el escenario: ${escenarioData.nombre}. Presiona "Simular" para ver los resultados.`,
    })
  }

  const ejecutarSimulacion = async (parametros: ParametrosModelo) => {
    setSimulando(true)
    setAnoVisualizacion(0)
    setResultadosMonteCarlo(null)

    try {
      if (metodoSimulacion === "box-muller") {
        const resultado = await simularFiscal(parametros)
        return resultado
      } else {
        const resultadoMC = await simularMonteCarlo(parametros, numSimulacionesMC)
        setResultadosMonteCarlo(resultadoMC)
        return { resultados: resultadoMC.simulacion_representativa, pasos: [] }
      }
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
      setEscenarioSeleccionado("normal") // Volver al escenario normal al resetear
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

  const handleSimular = async () => {
    if (!parametros) return
    const resultado = await ejecutarSimulacion(parametros)
    setResultados(resultado.resultados)
    setPasos(resultado.pasos)
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden flex flex-col">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--bolivia-rojo)] to-transparent" />
        <div className="absolute top-32 left-0 w-full h-32 bg-gradient-to-b from-[var(--bolivia-amarillo)] to-transparent" />
        <div className="absolute top-64 left-0 w-full h-32 bg-gradient-to-b from-[var(--bolivia-verde)] to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 animate-fade-in flex-1">
        {/* Header Section - Mejorado */}
        <div className="mb-8">
          <Card className="border-2 overflow-hidden shadow-xl animate-slide-in-up bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
            <div className="h-2 gradient-bolivia" />
            <div className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 border-border hover:scale-110 transition-transform">
                    <div className="h-1/3 bg-[#DA291C]" />
                    <div className="h-1/3 bg-[#FFD600]" />
                    <div className="h-1/3 bg-[#007A3D]" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--bolivia-verde)] via-[var(--bolivia-amarillo)] to-[var(--bolivia-rojo)] bg-clip-text text-transparent drop-shadow-sm">
                      Simulador Fiscal de Bolivia
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 font-medium">
                      Modelo estocástico DSGE
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gradient-to-br from-muted/70 to-muted/40 px-5 py-3 rounded-xl border-2 shadow-sm hover:shadow-md transition-all">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex items-center gap-2">
                    <Label htmlFor="anos-header" className="text-sm font-semibold whitespace-nowrap">
                      Años:
                    </Label>
                    <Input
                      id="anos-header"
                      type="number"
                      min={1}
                      max={20}
                      value={parametros.anos}
                      onChange={(e) => setParametros({ ...parametros, anos: Number.parseInt(e.target.value) || 5 })}
                      className="w-20 h-9 text-center font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setMostrarLanding(true)}
                    className="shadow-sm hover:shadow-md transition-all border-2"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Salir
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetear}
                    className="shadow-sm hover:shadow-md transition-all border-2 bg-transparent"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Resetear
                  </Button>
                  <Button
                    onClick={handleSimular}
                    disabled={simulando || cargando}
                    className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-[var(--bolivia-verde)] hover:scale-105"
                  >
                    {simulando || cargando ? (
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

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-scale-in">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1.5 bg-card shadow-xl border-2 rounded-xl">
            <TabsTrigger
              value="parametrizacion"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[var(--bolivia-verde)] data-[state=active]:text-primary-foreground py-3 transition-all rounded-lg data-[state=active]:shadow-lg"
            >
              <Settings className="h-5 w-5" />
              <span className="font-semibold">Parametrización</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[var(--bolivia-verde)] data-[state=active]:text-primary-foreground py-3 transition-all rounded-lg data-[state=active]:shadow-lg"
              disabled={!resultados}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="exportar"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[var(--bolivia-verde)] data-[state=active]:text-primary-foreground py-3 transition-all rounded-lg data-[state=active]:shadow-lg"
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {/* <div
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
                  </div> */}

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
                        Ejecuta múltiples simulaciones. Más completo pero más lento.
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

            {/* Escenarios Predefinidos */}
            <Card className="shadow-md border-2">
              <div className="h-2 gradient-bolivia" />
              <CardHeader className="bg-gradient-to-br from-card to-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Escenarios Predefinidos</CardTitle>
                      {escenarioSeleccionado && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Activo:{" "}
                          <span className="font-semibold text-primary">
                            {ESCENARIOS_SHOCKS[escenarioSeleccionado as keyof typeof ESCENARIOS_SHOCKS].nombre}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  {escenarioSeleccionado && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEscenarioSeleccionado(null)
                        cargarParametrosDefault()
                      }}
                      className="text-xs"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(ESCENARIOS_SHOCKS).map(([key, escenario]) => {
                    const isActive = escenarioSeleccionado === key
                    const shockEntries = Object.entries(escenario.shocks).filter(([_, v]) => v !== 0)

                    return (
                      <button
                        key={key}
                        disabled={cargando}
                        className={`
                          relative overflow-hidden rounded-xl p-5 text-left transition-all duration-300
                          border-2 hover:scale-[1.02] active:scale-[0.98]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${isActive
                            ? "bg-gradient-to-br from-primary via-primary/90 to-[var(--bolivia-verde)] text-primary-foreground shadow-xl border-primary/50 scale-[1.02]"
                            : "bg-card hover:bg-muted/50 border-border hover:border-primary/30 shadow-sm"
                          }
                        `}
                        onClick={() => aplicarEscenario(key)}
                      >
                        {/* Indicador de activo */}
                        {isActive && (
                          <div className="absolute top-3 right-3">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg" />
                          </div>
                        )}

                        {/* Nombre del escenario */}
                        <h4 className={`font-bold text-base mb-2 pr-6 ${isActive ? "text-white" : "text-foreground"}`}>
                          {escenario.nombre}
                        </h4>

                        {/* Descripción */}
                        <p
                          className={`text-xs mb-3 line-clamp-2 leading-relaxed ${isActive ? "text-white/90" : "text-muted-foreground"
                            }`}
                        >
                          {escenario.descripcion}
                        </p>

                        {/* Shocks aplicados */}
                        {shockEntries.length > 0 && (
                          <div className={`pt-3 border-t ${isActive ? "border-white/20" : "border-border"}`}>
                            <div className="flex flex-wrap gap-1.5">
                              {shockEntries.map(([k, v]) => {
                                const label = k.replace("shock_precio_", "").replace("shock_", "").toUpperCase()
                                const isPositive = v > 0

                                return (
                                  <span
                                    key={k}
                                    className={`
                                      inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md
                                      ${isActive
                                        ? isPositive
                                          ? "bg-white/20 text-white"
                                          : "bg-white/20 text-white"
                                        : isPositive
                                          ? "bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                                          : "bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                      }
                                    `}
                                  >
                                    {isPositive ? "↑" : "↓"} {label}: {isPositive ? "+" : ""}
                                    {v}%
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <EditorParametrosAvanzados
              parametros={parametros}
              onParametrosChange={setParametros}
              onResetearParametros={resetear}
              parametrosDefault={parametrosDefault}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            {resultados && resultados.length > 0 && (
              <>
                {/* {resultadosMonteCarlo && (
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
                                  <span className="font-mono">
                                    Bs. {stats.deficit_superavit.percentil_5.toFixed(0)}M
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P50 (mediana):</span>
                                  <span className="font-mono font-bold">
                                    Bs. {stats.deficit_superavit.mediana.toFixed(0)}M
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P95 (pesimista):</span>
                                  <span className="font-mono">
                                    Bs. {stats.deficit_superavit.percentil_95.toFixed(0)}M
                                  </span>
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
                              <p className="text-sm text-green-700 font-medium mb-2">RIN (millones Bs.)</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P5 (pesimista):</span>
                                  <span className="font-mono">Bs. {stats.rin.percentil_5.toFixed(0)}M</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P50 (mediana):</span>
                                  <span className="font-mono font-bold">Bs. {stats.rin.mediana.toFixed(0)}M</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">P95 (optimista):</span>
                                  <span className="font-mono">Bs. {stats.rin.percentil_95.toFixed(0)}M</span>
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
                )} */}
                <ControlSimulacionFlotante
                  resultados={resultados}
                  anoVisualizacion={anoVisualizacion}
                  autoPlay={autoPlay}
                  toggleAutoPlay={toggleAutoPlay}
                  avanzarAno={avanzarAno}
                  retrocederAno={retrocederAno}
                  irAlAno={irAlAno}
                />

                <Card className="border-2 shadow-lg">
                  <CardContent className="pt-6">
                    <Tabs value={dashboardSubTab} onValueChange={setDashboardSubTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="graficos" className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Gráficos
                        </TabsTrigger>
                        <TabsTrigger value="tablas" className="flex items-center gap-2">
                          <Table2 className="h-4 w-4" />
                          Tablas
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="graficos" className="space-y-6">
                        <GraficosInteractivos resultados={resultados} anoActual={anoVisualizacion} />
                      </TabsContent>

                      <TabsContent value="tablas" className="space-y-6">
                        <TablaCompletaUnificada resultados={resultados} anoActual={anoVisualizacion} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <DiagramaRelaciones
                  resultado={resultados[anoVisualizacion]}
                  resultadoAnterior={anoVisualizacion > 0 ? resultados[anoVisualizacion - 1] : undefined}
                />
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

      <footer className="relative z-10 border-t-2 bg-card/95 backdrop-blur-sm shadow-2xl mt-12">
        <div className="h-1 gradient-bolivia" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sección 1: Logo y descripción */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col w-10 h-10 rounded-lg overflow-hidden shadow-md border-2 border-border">
                  <div className="h-1/3 bg-[#DA291C]" />
                  <div className="h-1/3 bg-[#FFD600]" />
                  <div className="h-1/3 bg-[#007A3D]" />
                </div>
                <h3 className="font-bold text-lg">Simulador Fiscal</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Herramienta de análisis fiscal para Bolivia basada en modelos estocásticos DSGE. Desarrollado para
                apoyar la toma de decisiones económicas.
              </p>
            </div>

            {/* Sección 2: Enlaces rápidos */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-primary">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://www.economiayfinanzas.gob.bo"
                    target="_blank"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ministerio de Economía
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.bcb.gob.bo"
                    target="_blank"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Banco Central de Bolivia
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ine.gob.bo"
                    target="_blank"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Instituto Nacional de Estadística
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ypfb.gob.bo"
                    target="_blank"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    YPFB Corporación
                  </a>
                </li>
              </ul>
            </div>

            {/* Sección 3: Información técnica */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-primary">Información Técnica</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Método Box-Müller</p>
                    <p className="text-xs">Simulación estocástica única</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Monte Carlo</p>
                    <p className="text-xs">Análisis de distribuciones probabilísticas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Modelo DSGE</p>
                    <p className="text-xs">Equilibrio general dinámico estocástico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

          {/* Copyright y versión */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Simulador Fiscal de Bolivia. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">Versión 1.0.0</span>
              <span className="text-xs">Última actualización: 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
