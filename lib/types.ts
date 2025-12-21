export interface ParametrosSimulacion {
  // Configuración temporal
  anos: number

  // PIB y finanzas
  pib_inicial: number
  crecimiento_pib: number

  deuda_externa_inicial: number
  deuda_interna_inicial: number
  tasa_interes_externa: number
  tasa_interes_interna: number

  rin_inicial: number

  // Compatibilidad con código existente
  deuda_inicial?: number
  tasa_interes?: number

  // Shocks externos (lo más importante del modelo)
  shock_tc: number
  shock_precio_gas: number
  shock_precio_oro: number
  shock_precio_plata: number
  shock_precio_zinc: number
  shock_precio_estano: number
  shock_precio_plomo: number

  subsidio_combustibles_activo?: boolean

  // Parámetros legacy (no usados por el backend pero necesarios para UI)
  precio_zinc?: number
  volumen_zinc?: number
  precio_estano?: number
  volumen_estano?: number
  precio_oro?: number
  volumen_oro?: number
  precio_plata?: number
  volumen_plata?: number
  precio_litio?: number
  volumen_litio?: number
  precio_gas?: number
  volumen_gas?: number
  iva?: number
  iva_activo?: boolean
  iue?: number
  iue_activo?: boolean
  it?: number
  it_activo?: boolean
  itf?: number
  itf_activo?: boolean
  rc_iva?: number
  rc_iva_activo?: boolean
  ice?: number
  ice_activo?: boolean
  ga?: number
  ga_activo?: boolean
  sueldos_salarios?: number
  bienes_servicios?: number
  inversion_publica?: number
  subsidio_combustibles?: number
  subsidio_alimentos?: number
  subsidio_alimentos_activo?: boolean
}

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

  // Variables afectadas
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

// Parámetros por defecto basados en datos actuales de Bolivia
export const PARAMETROS_DEFAULT: ParametrosSimulacion = {
  anos: 6,

  // PIB y finanzas (datos 2024)
  pib_inicial: 420000, // 420 mil millones de Bs
  crecimiento_pib: 3.2, // 3.2% proyectado

  deuda_externa_inicial: 100000, // 100 mil millones de Bs
  deuda_interna_inicial: 50000, // 50 mil millones de Bs
  tasa_interes_externa: 4.3, // 4.3% promedio deuda externa
  tasa_interes_interna: 3.1, // 3.1% promedio deuda interna

  rin_inicial: 3500, // 3500 millones USD

  // Compatibilidad
  deuda_inicial: 150000,
  tasa_interes: 4.3,

  // Shocks externos (0 = sin shock, valores en %)
  shock_tc: 0.0,
  shock_precio_gas: 0.0,
  shock_precio_oro: 0.0,
  shock_precio_plata: 0.0,
  shock_precio_zinc: 0.0,
  shock_precio_estano: 0.0,
  shock_precio_plomo: 0.0,

  subsidio_combustibles_activo: true,
}

// Escenarios predefinidos de shocks
export const ESCENARIOS_SHOCKS = {
  normal: {
    nombre: "Escenario Normal",
    descripcion: "Sin shocks externos",
    shocks: {
      shock_tc: 0,
      shock_precio_gas: 0,
      shock_precio_oro: 0,
      shock_precio_plata: 0,
      shock_precio_zinc: 0,
      shock_precio_estano: 0,
      shock_precio_plomo: 0,
    },
  },
  crisis_commodities: {
    nombre: "Crisis de Commodities",
    descripcion: "Caída de precios internacionales",
    shocks: {
      shock_tc: 5,
      shock_precio_gas: -30,
      shock_precio_oro: -20,
      shock_precio_plata: -25,
      shock_precio_zinc: -30,
      shock_precio_estano: -25,
      shock_precio_plomo: -28,
    },
  },
  auge_minerales: {
    nombre: "Auge de Minerales",
    descripcion: "Aumento de precios de minerales",
    shocks: {
      shock_tc: 0,
      shock_precio_gas: 0,
      shock_precio_oro: 25,
      shock_precio_plata: 30,
      shock_precio_zinc: 20,
      shock_precio_estano: 22,
      shock_precio_plomo: 18,
    },
  },
  crisis_energetica: {
    nombre: "Crisis Energética",
    descripcion: "Aumento de precios de hidrocarburos",
    shocks: {
      shock_tc: 0,
      shock_precio_gas: 40,
      shock_precio_oro: 0,
      shock_precio_plata: 0,
      shock_precio_zinc: 0,
      shock_precio_estano: 0,
      shock_precio_plomo: 0,
    },
  },
}

export interface EstadisticasVariable {
  promedio: number
  mediana: number
  desviacion_estandar: number
  percentil_5: number
  percentil_25: number
  percentil_75: number
  percentil_95: number
  minimo: number
  maximo: number
}

export interface ResultadoMonteCarloAnual {
  ano: number
  ingresos_totales: EstadisticasVariable
  gastos_totales: EstadisticasVariable
  deficit_superavit: EstadisticasVariable
  deuda_total: EstadisticasVariable
  deuda_pib_ratio: EstadisticasVariable
  rin: EstadisticasVariable
  rin_meses_importacion: EstadisticasVariable
  deficit_pib_ratio: EstadisticasVariable
  presion_tributaria: EstadisticasVariable
  ing_gas: EstadisticasVariable
  ing_mineria_total: EstadisticasVariable
  ing_iva: EstadisticasVariable
  ing_iue: EstadisticasVariable
  gasto_subsidio_combustibles: EstadisticasVariable
  distribucion_deficit: number[]
  distribucion_deuda_pib: number[]
  distribucion_rin: number[]
}

export interface ResultadoMonteCarloComplete {
  num_simulaciones: number
  resultados_estadisticos: ResultadoMonteCarloAnual[]
  simulacion_representativa: ResultadoAnual[]
  metodo: string
}
