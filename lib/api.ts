import type {
  ParametrosSimulacion as ParametrosSimulacionType,
  ResultadoSimulacion as ResultadoSimulacionType,
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
 * Obtiene los parámetros por defecto del backend
 */
export async function obtenerParametrosDefault(): Promise<ParametrosSimulacionType> {
  const response = await fetch(`${API_BASE_URL}/api/parametros-default`)

  if (!response.ok) {
    throw new Error("Error al obtener parámetros por defecto")
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

// Parámetros por defecto locales (fallback si backend no está disponible)
export const PARAMETROS_DEFAULT: ParametrosSimulacionType = {
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
}
