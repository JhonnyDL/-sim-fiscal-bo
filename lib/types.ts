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

  // Tipo de Cambio (RF3)
  tc_base: number
  tc_coef_z: number

  // Gas Natural (RF4)
  gas_volumen_base: number
  gas_volumen_coef_z: number
  gas_precio_base: number
  gas_precio_coef_z: number
  gas_tasa_idh: number
  gas_tasa_regalias: number

  // Oro (RF4)
  oro_volumen_base: number
  oro_volumen_coef_z: number
  oro_precio_base: number
  oro_precio_coef_z: number
  oro_tasa_regalias: number

  // Plata (RF4)
  plata_volumen_base: number
  plata_volumen_coef_z: number
  plata_precio_base: number
  plata_precio_coef_z: number
  plata_tasa_regalias: number

  // Zinc (RF4)
  zinc_volumen_base: number
  zinc_volumen_coef_z: number
  zinc_precio_base: number
  zinc_precio_coef_z: number
  zinc_tasa_regalias: number

  // Estaño (RF4)
  estano_volumen_base: number
  estano_volumen_coef_z: number
  estano_precio_base: number
  estano_precio_coef_z: number
  estano_tasa_regalias: number

  // Plomo (RF4)
  plomo_volumen_base: number
  plomo_volumen_coef_z: number
  plomo_precio_base: number
  plomo_precio_coef_z: number
  plomo_tasa_regalias: number

  // Impuestos (RF5)
  iva_mi_base: number
  iva_mi_coef_z: number
  iue_base: number
  iue_coef_z: number
  it_base: number
  it_coef_z: number
  ice_mi_base: number
  ice_mi_coef_z: number
  rc_iva_base: number
  rc_iva_coef_z: number
  itf_base: number
  itf_coef_z: number
  ij_base: number
  ij_coef_z: number
  cv_base: number
  cv_coef_z: number
  ga_base: number
  ga_coef_z: number
  iva_i_base: number
  iva_i_coef_z: number
  ice_i_base: number
  ice_i_coef_z: number
  iehd_mi_base: number
  iehd_mi_coef_z: number
  iehd_i_base: number
  iehd_i_coef_z: number

  // Gastos (RF6)
  gasto_corriente_base: number
  gasto_corriente_coef_z: number
  subsidio_alimentos_base: number
  subsidio_alimentos_coef_z: number

  // Subsidio Combustibles (RF7)
  gasolina_precio_importacion_base: number
  gasolina_precio_importacion_coef_z: number
  gasolina_volumen_importacion_base: number
  gasolina_volumen_importacion_coef_z: number
  gasolina_precio_venta_domestico: number

  diesel_precio_importacion_base: number
  diesel_precio_importacion_coef_z: number
  diesel_volumen_importacion_base: number
  diesel_volumen_importacion_coef_z: number
  diesel_precio_venta_domestico: number

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
  inflacion?: number
  tipo_cambio?: number
  importaciones_base?: number
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

  delta_deuda_externa?: number
  delta_deuda_interna?: number
  deuda_externa_pib?: number
  deuda_interna_pib?: number
  ratio_externa_total?: number
  ratio_interna_total?: number
  intereses_ingresos_ratio?: number

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
