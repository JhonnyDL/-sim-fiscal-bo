"""Parámetros por defecto basados en el modelo estocástico fiscal de Bolivia"""

PARAMETROS_DEFAULT = {
    # Configuración básica
    "anos": 6,
    "pib_inicial": 420000,  # millones de Bs (≈$60B USD)
    "crecimiento_pib": 3.2,  # %
    
    # Deuda y finanzas
    "deuda_externa_inicial": 100000,  # millones de Bs
    "deuda_interna_inicial": 50000,   # millones de Bs
    "tasa_interes_externa": 4.3,      # %
    "tasa_interes_interna": 3.1,      # %
    
    "rin_inicial": 3500,  # millones USD
    
    # Compatibilidad
    "deuda_inicial": 150000,  # millones de Bs
    "tasa_interes": 4.3,      # %
    
    "shock_tc": 0.0,  # % shock en tipo de cambio
    "shock_precio_gas": 0.0,  # % shock en precio del gas
    "shock_precio_oro": 0.0,  # % shock en precio del oro
    "shock_precio_plata": 0.0,  # % shock en precio de plata
    "shock_precio_zinc": 0.0,  # % shock en precio de zinc
    "shock_precio_estano": 0.0,  # % shock en precio de estaño
    "shock_precio_plomo": 0.0,  # % shock en precio de plomo
    
    # Parámetros legacy (mantenidos para compatibilidad pero no se usan)
    "precio_gas": 4.2,
    "volumen_gas": 2800,
    "precio_zinc": 2850,
    "volumen_zinc": 480,
    "precio_estano": 26000,
    "volumen_estano": 19,
    "precio_oro": 1950,
    "volumen_oro": 38,
    "precio_plata": 25,
    "volumen_plata": 1300,
    "precio_litio": 19000,
    "volumen_litio": 28,
    "iva": 8900,
    "iva_activo": True,
    "iue": 2950,
    "iue_activo": True,
    "it": 1700,
    "it_activo": True,
    "itf": 480,
    "itf_activo": True,
    "rc_iva": 3400,
    "rc_iva_activo": True,
    "ice": 920,
    "ice_activo": True,
    "ga": 1280,
    "ga_activo": True,
    "sueldos_salarios": 14200,
    "bienes_servicios": 8900,
    "inversion_publica": 6200,
    "subsidio_combustibles": 3100,
    "subsidio_combustibles_activo": True,
    "subsidio_alimentos": 1050,
    "subsidio_alimentos_activo": True,
    "inflacion": 1.5,
    "tipo_cambio": 6.96,
    "importaciones_base": 10200
}

ESCENARIOS_SHOCKS = {
    "sin_shock": {
        "nombre": "Sin Shocks",
        "descripcion": "Escenario base sin perturbaciones externas",
        "shocks": {}
    },
    "caida_commodities": {
        "nombre": "Caída de Commodities",
        "descripcion": "Reducción del 30% en precios de gas y minerales",
        "shocks": {
            "shock_precio_gas": -30,
            "shock_precio_oro": -25,
            "shock_precio_plata": -25,
            "shock_precio_zinc": -30,
            "shock_precio_estano": -30,
            "shock_precio_plomo": -30
        }
    },
    "auge_commodities": {
        "nombre": "Auge de Commodities",
        "descripcion": "Aumento del 40% en precios de gas y minerales",
        "shocks": {
            "shock_precio_gas": 40,
            "shock_precio_oro": 35,
            "shock_precio_plata": 35,
            "shock_precio_zinc": 40,
            "shock_precio_estano": 40,
            "shock_precio_plomo": 40
        }
    },
    "devaluacion": {
        "nombre": "Devaluación Cambiaria",
        "descripcion": "Devaluación del tipo de cambio del 15%",
        "shocks": {
            "shock_tc": 15
        }
    },
    "crisis_combinada": {
        "nombre": "Crisis Combinada",
        "descripcion": "Caída de commodities + devaluación",
        "shocks": {
            "shock_tc": 20,
            "shock_precio_gas": -25,
            "shock_precio_oro": -20,
            "shock_precio_plata": -20,
            "shock_precio_zinc": -25,
            "shock_precio_estano": -25,
            "shock_precio_plomo": -25
        }
    }
}
