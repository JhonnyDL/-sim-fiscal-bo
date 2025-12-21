import type {
  ParametrosSimulacion as ParametrosSimulacionType,
  ResultadoSimulacion as ResultadoSimulacionType,
  ResultadoMonteCarloComplete,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ResultadoAnual {
  ano: number

  // Ingresos desagregados
  ing_gas: number
  ing_zinc: number
  ing_estano: number
  ing_oro: number
  ing_plata: number
  ing_litio: number
  ing_hidrocarburos_total: number
  ing_mineria_total: number

  // Impuestos
  ing_iva: number
  ing_iue: number
  ing_it: number
  ing_itf: number
  ing_rc_iva: number
  ing_ice: number
  ing_ga: number
  ing_impuestos_total: number

  ingresos_totales: number

  // Gastos desagregados
  gasto_sueldos: number
  gasto_bienes_servicios: number
  gasto_inversion: number
  gasto_subsidio_combustibles: number
  gasto_subsidio_alimentos: number
  intereses_deuda_externa: number
  intereses_deuda_interna: number
  intereses_totales: number

  gastos_totales: number

  // Indicadores fiscales
  deficit_superavit: number
  resultado_primario: number

  // Deuda
  deuda_total: number
  deuda_externa: number
  deuda_interna: number
  deuda_pib_ratio: number

  // Sector externo
  exportaciones: number
  importaciones: number
  saldo_comercial: number
  rin: number
  rin_meses_importacion: number

  // PIB
  pib: number
  pib_real: number
  crecimiento_pib_efectivo: number

  // Indicadores de sostenibilidad
  deficit_pib_ratio: number
  presion_tributaria: number
  capacidad_pago: number

  cambios: string[]
}

export interface PasoSimulacion {
  paso: number
  descripcion: string
  ano: number
  variable_modificada?: string
  valor_anterior?: number
  valor_nuevo?: number
  impacto_en: string[]
}

export interface ResultadoSimulacion {
  resultados: ResultadoAnual[]
  pasos: PasoSimulacion[]
}

/**
 * Ejecuta una simulación fiscal completa llamando al backend Python
 */
export async function simularFiscal(parametros: ParametrosSimulacionType): Promise<ResultadoSimulacionType> {
  console.log("[v0] Llamando a API Python:", `${API_BASE_URL}/api/simular`)

  const response = await fetch(`${API_BASE_URL}/api/simular`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Error desconocido" }))
    throw new Error(errorData.detail || "Error en la simulación")
  }

  return response.json()
}

/**
 * Ejecuta una simulación Monte Carlo con múltiples iteraciones
 */
export async function simularMonteCarlo(
  parametros: ParametrosSimulacionType,
  numSimulaciones = 1000,
): Promise<ResultadoMonteCarloComplete> {
  console.log("[v0] Llamando a API Monte Carlo:", `${API_BASE_URL}/api/simular-monte-carlo`)

  const response = await fetch(`${API_BASE_URL}/api/simular-monte-carlo?num_simulaciones=${numSimulaciones}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Error desconocido" }))
    throw new Error(errorData.detail || "Error en la simulación Monte Carlo")
  }

  return response.json()
}

/**
 * Obtiene los parámetros por defecto del backend
 */
export async function obtenerParametrosDefault(): Promise<ParametrosSimulacionType> {
  console.log("[v0] Solicitando parámetros por defecto al backend...")
  const response = await fetch(`${API_BASE_URL}/api/parametros-default`)

  if (!response.ok) {
    throw new Error("Error al obtener parámetros por defecto del backend")
  }

  return response.json()
}

/**
 * Verifica el estado del backend
 */
export async function verificarBackend(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      cache: "no-store",
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Exporta los resultados de la simulación a formato Excel
 */
export async function exportarExcel(data: {
  parametros_iniciales: ParametrosSimulacionType
  resultados: ResultadoAnual[]
  pasos: PasoSimulacion[]
}) {
  const response = await fetch("/api/exportar/excel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Error al exportar a Excel")
  }

  // Descargar el archivo
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `simulacion_fiscal_bolivia_${new Date().toISOString().split("T")[0]}.xlsx`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

/**
 * Exporta los resultados de la simulación a formato PDF
 */
export async function exportarPDF(data: {
  parametros_iniciales: ParametrosSimulacionType
  resultados: ResultadoAnual[]
  pasos: PasoSimulacion[]
}) {
  const response = await fetch("/api/exportar/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Error al exportar a PDF")
  }

  // Descargar el archivo
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `reporte_fiscal_bolivia_${new Date().toISOString().split("T")[0]}.pdf`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
