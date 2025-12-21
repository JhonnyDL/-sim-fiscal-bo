from pydantic import BaseModel, Field
from typing import List, Optional

class ParametrosSimulacion(BaseModel):
    """Parámetros de entrada para la simulación fiscal basados en el modelo estocástico"""
    
    # Configuración temporal
    anos: int = Field(default=6, description="Número de años a simular")
    
    pib_inicial: float = Field(default=420000, description="PIB inicial (millones de Bs)")
    crecimiento_pib: float = Field(default=3.2, description="Crecimiento PIB (%)")
    
    # Deuda interna y externa según RF1
    deuda_externa_inicial: float = Field(default=100000, description="Deuda externa inicial (millones de Bs)")
    deuda_interna_inicial: float = Field(default=50000, description="Deuda interna inicial (millones de Bs)")
    tasa_interes_externa: float = Field(default=4.3, description="Tasa de interés deuda externa (%)")
    tasa_interes_interna: float = Field(default=3.1, description="Tasa de interés deuda interna (%)")
    
    rin_inicial: float = Field(default=3500, description="Reservas Internacionales Netas iniciales (millones USD)")
    
    deuda_inicial: float = Field(default=150000, description="[Calculado] Deuda total inicial")
    tasa_interes: float = Field(default=4.3, description="[Calculado] Tasa promedio")
    
    shock_tc: float = Field(default=0.0, description="Shock en tipo de cambio (%)")
    shock_precio_gas: float = Field(default=0.0, description="Shock en precio del gas (%)")
    shock_precio_oro: float = Field(default=0.0, description="Shock en precio del oro (%)")
    shock_precio_plata: float = Field(default=0.0, description="Shock en precio de plata (%)")
    shock_precio_zinc: float = Field(default=0.0, description="Shock en precio de zinc (%)")
    shock_precio_estano: float = Field(default=0.0, description="Shock en precio de estaño (%)")
    shock_precio_plomo: float = Field(default=0.0, description="Shock en precio de plomo (%)")
    
    subsidio_combustibles_activo: bool = Field(default=True, description="Subsidio combustibles activo")

    # Tipo de Cambio
    tc_base: float = Field(default=12.4125, description="TC base")
    tc_coef_z: float = Field(default=1.835528988, description="TC coeficiente Z")
    
    # Gas Natural
    gas_volumen_base: float = Field(default=16515000, description="Gas volumen base")
    gas_volumen_coef_z: float = Field(default=6202447.464, description="Gas volumen coef Z")
    gas_precio_base: float = Field(default=871.208, description="Gas precio base")
    gas_precio_coef_z: float = Field(default=729.0108468, description="Gas precio coef Z")
    gas_tasa_idh: float = Field(default=32, description="Tasa IDH (%)")
    gas_tasa_regalias: float = Field(default=18, description="Tasa regalías (%)")
    
    # Oro
    oro_volumen_base: float = Field(default=33.86, description="Oro volumen base")
    oro_volumen_coef_z: float = Field(default=17.43482148, description="Oro volumen coef Z")
    oro_precio_base: float = Field(default=62377907.29, description="Oro precio base")
    oro_precio_coef_z: float = Field(default=8328119.788, description="Oro precio coef Z")
    oro_tasa_regalias: float = Field(default=12, description="Oro tasa regalías (%)")
    
    # Plata
    plata_volumen_base: float = Field(default=1227.708333, description="Plata volumen base")
    plata_volumen_coef_z: float = Field(default=146.1280268, description="Plata volumen coef Z")
    plata_precio_base: float = Field(default=864265.5598, description="Plata precio base")
    plata_precio_coef_z: float = Field(default=260978.7337, description="Plata precio coef Z")
    plata_tasa_regalias: float = Field(default=12, description="Plata tasa regalías (%)")
    
    # Zinc
    zinc_volumen_base: float = Field(default=469430.4, description="Zinc volumen base")
    zinc_volumen_coef_z: float = Field(default=67671.09523, description="Zinc volumen coef Z")
    zinc_precio_base: float = Field(default=2826.32284, description="Zinc precio base")
    zinc_precio_coef_z: float = Field(default=427.3211028, description="Zinc precio coef Z")
    zinc_tasa_regalias: float = Field(default=12, description="Zinc tasa regalías (%)")
    
    # Estaño
    estano_volumen_base: float = Field(default=16195.4, description="Estaño volumen base")
    estano_volumen_coef_z: float = Field(default=3060.343739, description="Estaño volumen coef Z")
    estano_precio_base: float = Field(default=27438.70052, description="Estaño precio base")
    estano_precio_coef_z: float = Field(default=6279.561218, description="Estaño precio coef Z")
    estano_tasa_regalias: float = Field(default=12, description="Estaño tasa regalías (%)")
    
    # Plomo
    plomo_volumen_base: float = Field(default=90045, description="Plomo volumen base")
    plomo_volumen_coef_z: float = Field(default=19231.45031, description="Plomo volumen coef Z")
    plomo_precio_base: float = Field(default=2081.16128, description="Plomo precio base")
    plomo_precio_coef_z: float = Field(default=148.3825547, description="Plomo precio coef Z")
    plomo_tasa_regalias: float = Field(default=12, description="Plomo tasa regalías (%)")
    
    # Impuestos
    iva_mi_base: float = Field(default=9946000000, description="IVA MI base")
    iva_mi_coef_z: float = Field(default=1048843554, description="IVA MI coef Z")
    iue_base: float = Field(default=8053000000, description="IUE base")
    iue_coef_z: float = Field(default=1504402074, description="IUE coef Z")
    it_base: float = Field(default=5336333333, description="IT base")
    it_coef_z: float = Field(default=811801125.1, description="IT coef Z")
    ice_mi_base: float = Field(default=1826333333, description="ICE MI base")
    ice_mi_coef_z: float = Field(default=202134278.8, description="ICE MI coef Z")
    rc_iva_base: float = Field(default=633500000, description="RC-IVA base")
    rc_iva_coef_z: float = Field(default=230075422.4, description="RC-IVA coef Z")
    itf_base: float = Field(default=433666666.7, description="ITF base")
    itf_coef_z: float = Field(default=128233640.9, description="ITF coef Z")
    ij_base: float = Field(default=48000000, description="IJ base")
    ij_coef_z: float = Field(default=20386269.89, description="IJ coef Z")
    conceptos_varios_base: float = Field(default=4110000000, description="Conceptos Varios base")
    conceptos_varios_coef_z: float = Field(default=1427622359, description="Conceptos Varios coef Z")
    ga_base: float = Field(default=3473166667, description="GA base")
    ga_coef_z: float = Field(default=833990987.2, description="GA coef Z")
    iva_i_base: float = Field(default=10566333333, description="IVA I base")
    iva_i_coef_z: float = Field(default=2157826468, description="IVA I coef Z")
    ice_i_base: float = Field(default=761666666.7, description="ICE I base")
    ice_i_coef_z: float = Field(default=120392137.1, description="ICE I coef Z")
    iehd_mi_base: float = Field(default=2200333333, description="IEHD MI base")
    iehd_mi_coef_z: float = Field(default=275045935.6, description="IEHD MI coef Z")
    iehd_i_base: float = Field(default=32666666.67, description="IEHD I base")
    iehd_i_coef_z: float = Field(default=17305105.22, description="IEHD I coef Z")
    
    # Gastos
    corriente_base: float = Field(default=111953166667, description="Gasto corriente base")
    corriente_coef_z: float = Field(default=13443318019, description="Gasto corriente coef Z")
    subsidio_alimentos_base: float = Field(default=401142857.1, description="Subsidio alimentos base")
    subsidio_alimentos_coef_z: float = Field(default=238077318.4, description="Subsidio alimentos coef Z")
    
    # Subsidio Combustibles
    subsidio_gasolina_precio_base: float = Field(default=961.0769231, description="Gasolina precio import base")
    subsidio_gasolina_precio_coef_z: float = Field(default=188.465191, description="Gasolina precio import coef Z")
    subsidio_gasolina_volumen_base: float = Field(default=439256.5537, description="Gasolina volumen import base")
    subsidio_gasolina_volumen_coef_z: float = Field(default=318706.3029, description="Gasolina volumen import coef Z")
    subsidio_gasolina_venta: float = Field(default=4986.67, description="Gasolina precio venta")
    
    subsidio_diesel_precio_base: float = Field(default=812.6923077, description="Diésel precio import base")
    subsidio_diesel_precio_coef_z: float = Field(default=170.6858262, description="Diésel precio import coef Z")
    subsidio_diesel_volumen_base: float = Field(default=1194994.527, description="Diésel volumen import base")
    subsidio_diesel_volumen_coef_z: float = Field(default=519808.993, description="Diésel volumen import coef Z")
    subsidio_diesel_venta: float = Field(default=4376.47, description="Diésel precio venta")
    
    # NOTA: Los siguientes parámetros ya NO son necesarios porque se calculan con las fórmulas
    # del modelo estocástico, pero los mantenemos para compatibilidad con el frontend
    # Minería desagregada (NO SE USAN - calculados por el modelo)
    precio_zinc: float = Field(default=2850, description="[No usado] Precio del zinc")
    volumen_zinc: float = Field(default=480, description="[No usado] Volumen de zinc")
    precio_estano: float = Field(default=26000, description="[No usado] Precio del estaño")
    volumen_estano: float = Field(default=19, description="[No usado] Volumen de estaño")
    precio_oro: float = Field(default=1950, description="[No usado] Precio del oro")
    volumen_oro: float = Field(default=38, description="[No usado] Volumen de oro")
    precio_plata: float = Field(default=25, description="[No usado] Precio de la plata")
    volumen_plata: float = Field(default=1300, description="[No usado] Volumen de plata")
    precio_litio: float = Field(default=19000, description="[No usado] Precio del litio")
    volumen_litio: float = Field(default=28, description="[No usado] Volumen de litio")
    precio_gas: float = Field(default=4.2, description="[No usado] Precio del gas")
    volumen_gas: float = Field(default=2800, description="[No usado] Volumen de gas")
    
    # Impuestos (NO SE USAN - calculados por el modelo)
    iva: float = Field(default=8900, description="[No usado] Recaudación IVA")
    iva_activo: bool = Field(default=True, description="[No usado] IVA activo")
    iue: float = Field(default=2950, description="[No usado] Recaudación IUE")
    iue_activo: bool = Field(default=True, description="[No usado] IUE activo")
    it: float = Field(default=1700, description="[No usado] Recaudación IT")
    it_activo: bool = Field(default=True, description="[No usado] IT activo")
    itf: float = Field(default=480, description="[No usado] Recaudación ITF")
    itf_activo: bool = Field(default=True, description="[No usado] ITF activo")
    rc_iva: float = Field(default=3400, description="[No usado] Recaudación RC-IVA")
    rc_iva_activo: bool = Field(default=True, description="[No usado] RC-IVA activo")
    ice: float = Field(default=920, description="[No usado] Recaudación ICE")
    ice_activo: bool = Field(default=True, description="[No usado] ICE activo")
    ga: float = Field(default=1280, description="[No usado] Recaudación GA")
    ga_activo: bool = Field(default=True, description="[No usado] GA activo")
    
    # Gastos (NO SE USAN - calculados por el modelo)
    sueldos_salarios: float = Field(default=14200, description="[No usado] Sueldos y salarios")
    bienes_servicios: float = Field(default=8900, description="[No usado] Bienes y servicios")
    inversion_publica: float = Field(default=6200, description="[No usado] Inversión pública")
    subsidio_combustibles: float = Field(default=3100, description="[No usado] Subsidio combustibles")
    subsidio_combustibles_activo: bool = Field(default=True, description="[No usado] Subsidio combustibles activo")
    subsidio_alimentos: float = Field(default=1050, description="[No usado] Subsidio alimentos")
    subsidio_alimentos_activo: bool = Field(default=True, description="[No usado] Subsidio alimentos activo")
    
    # Otros parámetros no usados
    rin_inicial: float = Field(default=1920, description="[No usado] RIN inicial")
    inflacion: float = Field(default=1.5, description="[No usado] Inflación")
    tipo_cambio: float = Field(default=6.96, description="[No usado] Tipo de cambio")
    importaciones_base: float = Field(default=10200, description="[No usado] Importaciones base")

class ResultadoAnual(BaseModel):
    """Resultado fiscal de un año específico"""
    
    ano: int
    
    # Ingresos desagregados
    ing_gas: float
    ing_zinc: float
    ing_estano: float
    ing_oro: float
    ing_plata: float
    ing_litio: float
    ing_hidrocarburos_total: float
    ing_mineria_total: float
    
    # Impuestos
    ing_iva: float
    ing_iue: float
    ing_it: float
    ing_itf: float
    ing_rc_iva: float
    ing_ice: float
    ing_ga: float
    ing_impuestos_total: float
    
    ingresos_totales: float
    
    # Gastos desagregados
    gasto_sueldos: float
    gasto_bienes_servicios: float
    gasto_inversion: float
    gasto_subsidio_combustibles: float
    gasto_subsidio_alimentos: float
    intereses_deuda_externa: float
    intereses_deuda_interna: float
    intereses_totales: float
    
    gastos_totales: float
    
    # Indicadores fiscales
    deficit_superavit: float
    resultado_primario: float
    
    # Deuda
    deuda_total: float
    deuda_externa: float
    deuda_interna: float
    deuda_pib_ratio: float
    
    # Sector externo
    exportaciones: float
    importaciones: float
    saldo_comercial: float
    rin: float
    rin_meses_importacion: float
    
    # PIB
    pib: float
    pib_real: float
    crecimiento_pib_efectivo: float
    
    # Indicadores de sostenibilidad
    deficit_pib_ratio: float
    presion_tributaria: float
    capacidad_pago: float
    
    # Variables afectadas
    cambios: List[str]

class PasoSimulacion(BaseModel):
    """Paso individual de la simulación"""
    
    paso: int
    descripcion: str
    ano: int
    variable_modificada: Optional[str] = None
    valor_anterior: Optional[float] = None
    valor_nuevo: Optional[float] = None
    impacto_en: List[str]

class ResultadoSimulacion(BaseModel):
    """Resultado completo de la simulación"""
    
    resultados: List[ResultadoAnual]
    pasos: List[PasoSimulacion]

class EstadisticasVariable(BaseModel):
    """Estadísticas de una variable en Monte Carlo"""
    promedio: float
    mediana: float
    desviacion_estandar: float
    percentil_5: float
    percentil_25: float
    percentil_75: float
    percentil_95: float
    minimo: float
    maximo: float

class ResultadoMonteCarloAnual(BaseModel):
    """Resultado anual con estadísticas de Monte Carlo"""
    ano: int
    
    # Estadísticas de variables principales
    ingresos_totales: EstadisticasVariable
    gastos_totales: EstadisticasVariable
    deficit_superavit: EstadisticasVariable
    deuda_total: EstadisticasVariable
    deuda_pib_ratio: EstadisticasVariable
    rin: EstadisticasVariable
    rin_meses_importacion: EstadisticasVariable
    deficit_pib_ratio: EstadisticasVariable
    presion_tributaria: EstadisticasVariable
    
    # Variables específicas
    ing_gas: EstadisticasVariable
    ing_mineria_total: EstadisticasVariable
    ing_iva: EstadisticasVariable
    ing_iue: EstadisticasVariable
    gasto_subsidio_combustibles: EstadisticasVariable
    
    # Distribuciones completas (para histogramas)
    distribucion_deficit: List[float]
    distribucion_deuda_pib: List[float]
    distribucion_rin: List[float]

class ResultadoMonteCarloComplete(BaseModel):
    """Resultado completo de simulación Monte Carlo"""
    num_simulaciones: int
    resultados_estadisticos: List[ResultadoMonteCarloAnual]
    simulacion_representativa: List[ResultadoAnual]
    metodo: str
