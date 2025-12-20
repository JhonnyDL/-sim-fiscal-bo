from typing import Dict, Optional
from schemas import ParametrosSimulacion, ResultadoAnual
from stochastic import box_muller, aplicar_shock

def calcular_tipo_cambio(parametros, Z: float, shock_pct: float = 0.0) -> float:
    """
    TC = base + coef_z*Z ± Shock%
    Now uses configurable parameters instead of hardcoded values
    """
    tc = parametros.tc_base + parametros.tc_coef_z * Z
    return aplicar_shock(tc, shock_pct)

def calcular_ingresos_gas(parametros, Z: float, TC: float, shock_precio_pct: float = 0.0) -> Dict[str, float]:
    """
    Uses configurable gas parameters from ParametrosSimulacion
    """
    # Volumen de exportación (Toneladas)
    Vg = parametros.gas_volumen_base + parametros.gas_volumen_coef_z * Z
    
    # Precio internacional ($/Tonelada)
    Pg = parametros.gas_precio_base + parametros.gas_precio_coef_z * Z
    Pg = aplicar_shock(Pg, shock_precio_pct)
    
    # Ingresos brutos
    ingresos_brutos = Vg * Pg * TC
    
    # IDH y Regalías con tasas configurables
    IDH = ingresos_brutos * (parametros.gas_tasa_idh / 100)
    regalias = ingresos_brutos * (parametros.gas_tasa_regalias / 100)
    
    return {
        'volumen': Vg,
        'precio_usd': Pg,
        'ingresos_brutos': ingresos_brutos,
        'idh': IDH,
        'regalias': regalias,
        'total': IDH + regalias
    }

def calcular_ingresos_oro(parametros, Z: float, TC: float, shock_precio_pct: float = 0.0) -> Dict[str, float]:
    """
    Uses configurable oro parameters
    """
    VO = parametros.oro_volumen_base + parametros.oro_volumen_coef_z * Z
    PO = parametros.oro_precio_base + parametros.oro_precio_coef_z * Z
    PO = aplicar_shock(PO, shock_precio_pct)
    IO = VO * PO * TC * (parametros.oro_tasa_regalias / 100)
    
    return {'volumen': VO, 'precio_usd': PO, 'total': IO}

def calcular_ingresos_plata(parametros, Z: float, TC: float, shock_precio_pct: float = 0.0) -> Dict[str, float]:
    """
    Uses configurable plata parameters
    """
    VP = parametros.plata_volumen_base + parametros.plata_volumen_coef_z * Z
    PP = parametros.plata_precio_base + parametros.plata_precio_coef_z * Z
    PP = aplicar_shock(PP, shock_precio_pct)
    IP = VP * PP * TC * (parametros.plata_tasa_regalias / 100)
    
    return {'volumen': VP, 'precio_usd': PP, 'total': IP}

def calcular_ingresos_zinc(parametros, Z: float, TC: float, shock_precio_pct: float = 0.0) -> Dict[str, float]:
    """
    Uses configurable zinc parameters
    """
    VZ = parametros.zinc_volumen_base + parametros.zinc_volumen_coef_z * Z
    PZ = parametros.zinc_precio_base + parametros.zinc_precio_coef_z * Z
    PZ = aplicar_shock(PZ, shock_precio_pct)
    IZ = VZ * PZ * TC * (parametros.zinc_tasa_regalias / 100)
    
    return {'volumen': VZ, 'precio_usd': PZ, 'total': IZ}

def calcular_ingresos_estano(parametros, Z: float, TC: float, shock_precio_pct: float = 0.0) -> Dict[str, float]:
    """
    Uses configurable estano parameters
    """
    VES = parametros.estano_volumen_base + parametros.estano_volumen_coef_z * Z
    PES = parametros.estano_precio_base + parametros.estano_precio_coef_z * Z
    PES = aplicar_shock(PES, shock_precio_pct)
    IES = VES * PES * TC * (parametros.estano_tasa_regalias / 100)
    
    return {'volumen': VES, 'precio_usd': PES, 'total': IES}

def calcular_ingresos_plomo(parametros, Z: float, TC: float, shock_precio_pct: float = 0.0) -> Dict[str, float]:
    """
    Uses configurable plomo parameters
    """
    VPL = parametros.plomo_volumen_base + parametros.plomo_volumen_coef_z * Z
    PPL = parametros.plomo_precio_base + parametros.plomo_precio_coef_z * Z
    PPL = aplicar_shock(PPL, shock_precio_pct)
    IPL = VPL * PPL * TC * (parametros.plomo_tasa_regalias / 100)
    
    return {'volumen': VPL, 'precio_usd': PPL, 'total': IPL}

def calcular_ingresos_tributarios(parametros, Z: float, ing_gas_brutos: float) -> Dict[str, float]:
    """
    Calcula todos los ingresos tributarios según fórmulas del modelo
    """
    # IVA Mercado Interno
    I_IVA_MI = parametros.iva_mi_base + parametros.iva_mi_coef_z * Z
    
    # IUE
    I_IUE = parametros.iue_base + parametros.iue_coef_z * Z
    
    # IT
    I_IT = parametros.it_base + parametros.it_coef_z * Z
    
    # ICE Mercado Interno
    I_ICE_MI = parametros.ice_mi_base + parametros.ice_mi_coef_z * Z
    
    # RC-IVA
    I_RC_IVA = parametros.rc_iva_base + parametros.rc_iva_coef_z * Z
    
    # ITF
    I_ITF = parametros.itf_base + parametros.itf_coef_z * Z
    
    # IJ
    I_IJ = parametros.ij_base + parametros.ij_coef_z * Z
    
    # Conceptos Varios
    I_CV = parametros.conceptos_varios_base + parametros.conceptos_varios_coef_z * Z
    
    # GA
    I_GA = parametros.ga_base + parametros.ga_coef_z * Z
    
    # IVA Importaciones
    I_IVA_I = parametros.iva_i_base + parametros.iva_i_coef_z * Z
    
    # ICE Importaciones
    I_ICE_I = parametros.ice_i_base + parametros.ice_i_coef_z * Z
    
    # IDH (32% de ingresos brutos de gas) - ya calculado en gas
    I_IDH = ing_gas_brutos * (parametros.gas_tasa_idh / 100)
    
    # IEHD Mercado Interno
    I_IEHD_MI = parametros.iehd_mi_base + parametros.iehd_mi_coef_z * Z
    
    # IEHD Importaciones
    I_IEHD_I = parametros.iehd_i_base + parametros.iehd_i_coef_z * Z
    
    # Total recaudación tributaria
    I_RT = (I_IVA_MI + I_IUE + I_IT + I_ICE_MI + I_RC_IVA + I_ITF + 
            I_IJ + I_CV + I_GA + I_IVA_I + I_ICE_I + I_IDH + I_IEHD_MI + I_IEHD_I)
    
    return {
        'iva_mercado_interno': I_IVA_MI,
        'iue': I_IUE,
        'it': I_IT,
        'ice_mercado_interno': I_ICE_MI,
        'rc_iva': I_RC_IVA,
        'itf': I_ITF,
        'ij': I_IJ,
        'conceptos_varios': I_CV,
        'ga': I_GA,
        'iva_importaciones': I_IVA_I,
        'ice_importaciones': I_ICE_I,
        'idh': I_IDH,
        'iehd_mercado_interno': I_IEHD_MI,
        'iehd_importaciones': I_IEHD_I,
        'total': I_RT
    }

def calcular_ingresos(
    parametros: ParametrosSimulacion,
    estado_anterior: Optional[ResultadoAnual]
) -> Dict[str, float]:
    """
    Calcula TODOS los ingresos fiscales usando el modelo estocástico completo
    
    Returns:
        Dict con todos los ingresos desagregados
    """
    # Generar variable aleatoria normal
    Z = box_muller()
    
    # Tipo de cambio con parámetros configurables
    TC = calcular_tipo_cambio(parametros, Z, parametros.shock_tc)
    
    # EXPORTACIONES con parámetros configurables
    gas_data = calcular_ingresos_gas(parametros, Z, TC, parametros.shock_precio_gas)
    oro_data = calcular_ingresos_oro(parametros, Z, TC, parametros.shock_precio_oro)
    plata_data = calcular_ingresos_plata(parametros, Z, TC, parametros.shock_precio_plata)
    zinc_data = calcular_ingresos_zinc(parametros, Z, TC, parametros.shock_precio_zinc)
    estano_data = calcular_ingresos_estano(parametros, Z, TC, parametros.shock_precio_estano)
    plomo_data = calcular_ingresos_plomo(parametros, Z, TC, parametros.shock_precio_plomo)
    
    # Ingresos por exportación de recursos
    I_EX = (plata_data['total'] + oro_data['total'] + gas_data['regalias'] + 
            zinc_data['total'] + estano_data['total'] + plomo_data['total'])
    
    # INGRESOS TRIBUTARIOS
    tributarios = calcular_ingresos_tributarios(parametros, Z, gas_data['ingresos_brutos'])
    
    # INGRESOS TOTALES
    I_T = I_EX + tributarios['total'] + gas_data['idh']
    
    return {
        'z_value': Z,
        'tipo_cambio': TC,
        # Gas
        'gas_volumen': gas_data['volumen'],
        'gas_precio_usd': gas_data['precio_usd'],
        'gas_ingresos_brutos': gas_data['ingresos_brutos'],
        'gas_idh': gas_data['idh'],
        'gas_regalias': gas_data['regalias'],
        'gas_total': gas_data['total'],
        # Minerales
        'oro': oro_data['total'],
        'plata': plata_data['total'],
        'zinc': zinc_data['total'],
        'estano': estano_data['total'],
        'plomo': plomo_data['total'],
        'exportaciones_total': I_EX,
        # Tributarios
        'iva_mi': tributarios['iva_mercado_interno'],
        'iue': tributarios['iue'],
        'it': tributarios['it'],
        'ice_mi': tributarios['ice_mercado_interno'],
        'rc_iva': tributarios['rc_iva'],
        'itf': tributarios['itf'],
        'ij': tributarios['ij'],
        'conceptos_varios': tributarios['conceptos_varios'],
        'ga': tributarios['ga'],
        'iva_i': tributarios['iva_importaciones'],
        'ice_i': tributarios['ice_importaciones'],
        'idh': tributarios['idh'],
        'iehd_mi': tributarios['iehd_mercado_interno'],
        'iehd_i': tributarios['iehd_importaciones'],
        'tributarios_total': tributarios['total'],
        # Total
        'total': I_T
    }

def calcular_gastos(
    parametros: ParametrosSimulacion,
    estado_anterior: Optional[ResultadoAnual],
    TC: float,
    Z: float
) -> Dict[str, float]:
    """
    Calcula todos los gastos fiscales según el modelo
    
    Returns:
        Dict con gastos desagregados
    """
    # Gasto corriente
    GC = parametros.corriente_base + parametros.corriente_coef_z * Z
    
    if parametros.subsidio_combustibles_activo:
        # SUBSIDIOS DE HIDROCARBUROS
        # Precios de importación
        PIG = parametros.subsidio_gasolina_precio_base + parametros.subsidio_gasolina_precio_coef_z * Z  # $/Tonelada Gasolina
        PID = parametros.subsidio_diesel_precio_base + parametros.subsidio_diesel_precio_coef_z * Z  # $/Tonelada Diésel
        
        # Volúmenes de importación
        VIG = parametros.subsidio_gasolina_volumen_base + parametros.subsidio_gasolina_volumen_coef_z * Z  # Toneladas Gasolina
        VID = parametros.subsidio_diesel_volumen_base + parametros.subsidio_diesel_volumen_coef_z * Z   # Toneladas Diésel
        
        # Subsidios (diferencia entre precio de importación y precio de venta)
        GSG = (PIG * TC - parametros.subsidio_gasolina_venta) * VIG  # Subsidio Gasolina
        GSD = (PID * TC - parametros.subsidio_diesel_venta) * VID  # Subsidio Diésel
        GSH = GSG + GSD  # Subsidio total hidrocarburos
    else:
        # If subsidies are disabled, set all to zero
        PIG = 0
        PID = 0
        VIG = 0
        VID = 0
        GSG = 0
        GSD = 0
        GSH = 0
    
    # Subsidio de alimentos
    GSA = parametros.subsidio_alimentos_base + parametros.subsidio_alimentos_coef_z * Z
    
    # Gasto total
    GT = GC + GSH + GSA
    
    return {
        'corriente': GC,
        'subsidio_gasolina': GSG,
        'subsidio_diesel': GSD,
        'subsidio_hidrocarburos': GSH,
        'subsidio_alimentos': GSA,
        'total': GT,
        # Variables auxiliares
        'precio_importacion_gasolina': PIG,
        'precio_importacion_diesel': PID,
        'volumen_importacion_gasolina': VIG,
        'volumen_importacion_diesel': VID
    }

def calcular_deficit_deuda(
    ingresos_totales: float,
    gastos_totales: float,
    deuda_externa_anterior: float,
    deuda_interna_anterior: float,
    tasa_interes_externa: float,
    tasa_interes_interna: float,
    exportaciones: float,
    rin_anterior: float,
    tc: float
) -> Dict[str, float]:
    """
    Calcula déficit y actualiza deuda según el modelo
    
    Fórmulas:
    - Déficit = IT - GT
    - Deuda Externa = DE(t-1) * (1 + TIE) - proporción del superávit/déficit
    - Deuda Interna = DI(t-1) * (1 + TII) - proporción del superávit/déficit
    - RIN = RIN(t-1) + (Exportaciones / TC) - ajuste por déficit
    """
    # Déficit (negativo = superávit)
    deficit = ingresos_totales - gastos_totales
    
    # Calcular intereses
    intereses_externa = deuda_externa_anterior * tasa_interes_externa
    intereses_interna = deuda_interna_anterior * tasa_interes_interna
    intereses_totales = intereses_externa + intereses_interna
    
    proporcion_externa = 0.7
    deficit_financiado_externo = deficit * proporcion_externa if deficit < 0 else deficit * proporcion_externa
    deficit_financiado_interno = deficit * (1 - proporcion_externa) if deficit < 0 else deficit * (1 - proporcion_externa)
    
    # Actualizar deudas
    deuda_externa = deuda_externa_anterior * (1 + tasa_interes_externa) - deficit_financiado_externo
    deuda_interna = deuda_interna_anterior * (1 + tasa_interes_interna) - deficit_financiado_interno
    deuda_total = deuda_externa + deuda_interna
    
    # RIN aumenta con exportaciones y disminuye si hay déficit externo
    exportaciones_usd = exportaciones / tc
    ajuste_rin = exportaciones_usd * 0.3  # 30% de exportaciones se acumula en RIN
    if deficit < 0:  # Si hay déficit
        ajuste_rin -= (abs(deficit) / tc) * 0.5  # El déficit reduce RIN
    
    rin = max(0, rin_anterior + ajuste_rin)  # RIN no puede ser negativo
    
    return {
        'deficit': -deficit,  # Convertir a convención (positivo = déficit)
        'superavit': deficit if deficit > 0 else 0,
        'deuda_total': deuda_total,
        'deuda_externa': deuda_externa,
        'deuda_interna': deuda_interna,
        'intereses_externa': intereses_externa,
        'intereses_interna': intereses_interna,
        'intereses': intereses_totales,
        'rin': rin
    }
