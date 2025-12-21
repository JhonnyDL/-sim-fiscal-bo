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

  try {
    const response = await fetch(`${API_BASE_URL}/api/parametros-default`)

    if (!response.ok) {
      console.warn("[v0] Backend no disponible, usando parámetros locales completos")
      return PARAMETROS_DEFAULT_COMPLETO
    }

    return response.json()
  } catch (error) {
    console.warn("[v0] Error al conectar con backend, usando parámetros locales completos:", error)
    return PARAMETROS_DEFAULT_COMPLETO
  }
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

export const PARAMETROS_DEFAULT_COMPLETO: ParametrosSimulacionType = {
  // Parámetros básicos originales
  anos: 6,
  precio_gas: 4.2,
  volumen_gas: 2800,
  precio_zinc: 2850,
  volumen_zinc: 480,
  precio_estano: 26000,
  volumen_estano: 19,
  precio_oro: 1950,
  volumen_oro: 38,
  precio_plata: 25,
  volumen_plata: 1300,
  precio_litio: 19000,
  volumen_litio: 28,
  iva: 8900,
  iva_activo: true,
  iue: 2950,
  iue_activo: true,
  it: 1700,
  it_activo: true,
  itf: 480,
  itf_activo: true,
  rc_iva: 3400,
  rc_iva_activo: true,
  ice: 920,
  ice_activo: true,
  ga: 1280,
  ga_activo: true,
  sueldos_salarios: 14200,
  bienes_servicios: 8900,
  inversion_publica: 6200,
  subsidio_combustibles: 3100,
  subsidio_combustibles_activo: true,
  subsidio_alimentos: 1050,
  subsidio_alimentos_activo: true,
  deuda_inicial: 45000,
  deuda_externa_inicial: 29000,
  deuda_interna_inicial: 16000,
  tasa_interes_externa: 0.043,
  tasa_interes_interna: 0.031,
  rin_inicial: 1920,
  pib_inicial: 42000,
  crecimiento_pib: 3.2,
  inflacion: 1.5,
  tipo_cambio: 6.96,
  importaciones_base: 10200,

  shock_tc: 0,
  shock_precio_gas: 0,
  shock_precio_oro: 0,
  shock_precio_plata: 0,
  shock_precio_zinc: 0,
  shock_precio_estano: 0,
  shock_precio_plomo: 0,

  tc_base: 6.96,
  tc_coef_z: 0.15,

  gas_volumen_base: 2800,
  gas_volumen_coef_z: 0.12,
  gas_precio_base: 4.2,
  gas_precio_coef_z: 0.18,
  gas_tasa_idh: 0.32,
  gas_tasa_regalias: 0.18,

  oro_volumen_base: 38,
  oro_volumen_coef_z: 0.08,
  oro_precio_base: 1950,
  oro_precio_coef_z: 0.22,
  oro_tasa_regalias: 0.07,

  plata_volumen_base: 1300,
  plata_volumen_coef_z: 0.1,
  plata_precio_base: 25,
  plata_precio_coef_z: 0.25,
  plata_tasa_regalias: 0.07,

  zinc_volumen_base: 480,
  zinc_volumen_coef_z: 0.09,
  zinc_precio_base: 2850,
  zinc_precio_coef_z: 0.2,
  zinc_tasa_regalias: 0.07,

  estano_volumen_base: 19,
  estano_volumen_coef_z: 0.07,
  estano_precio_base: 26000,
  estano_precio_coef_z: 0.23,
  estano_tasa_regalias: 0.07,

  plomo_volumen_base: 85,
  plomo_volumen_coef_z: 0.11,
  plomo_precio_base: 2100,
  plomo_precio_coef_z: 0.19,
  plomo_tasa_regalias: 0.07,

  iva_mi_base: 8900,
  iva_mi_coef_z: 0.85,
  iue_base: 2950,
  iue_coef_z: 0.78,
  it_base: 1700,
  it_coef_z: 0.82,
  ice_mi_base: 920,
  ice_mi_coef_z: 0.75,
  rc_iva_base: 3400,
  rc_iva_coef_z: 0.8,
  itf_base: 480,
  itf_coef_z: 0.7,
  ij_base: 320,
  ij_coef_z: 0.65,
  cv_base: 180,
  cv_coef_z: 0.6,
  ga_base: 1280,
  ga_coef_z: 0.83,
  iva_i_base: 1200,
  iva_i_coef_z: 0.72,
  ice_i_base: 250,
  ice_i_coef_z: 0.68,
  iehd_mi_base: 680,
  iehd_mi_coef_z: 0.77,
  iehd_i_base: 420,
  iehd_i_coef_z: 0.71,

  gasto_corriente_base: 23100,
  gasto_corriente_coef_z: 0.92,
  subsidio_alimentos_base: 1050,
  subsidio_alimentos_coef_z: 0.88,

  gasolina_precio_importacion_base: 2.85,
  gasolina_precio_importacion_coef_z: 0.21,
  gasolina_volumen_importacion_base: 1420,
  gasolina_volumen_importacion_coef_z: 0.14,
  gasolina_precio_venta_domestico: 0.54,
  diesel_precio_importacion_base: 2.92,
  diesel_precio_importacion_coef_z: 0.2,
  diesel_volumen_importacion_base: 1680,
  diesel_volumen_importacion_coef_z: 0.13,
  diesel_precio_venta_domestico: 0.53,
}

export const PARAMETROS_DEFAULT = PARAMETROS_DEFAULT_COMPLETO
