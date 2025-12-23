"""Parámetros por defecto basados en el modelo estocástico fiscal de Bolivia"""

PARAMETROS_DEFAULT = {
    # Configuración básica (RF1 - Parámetros Iniciales Clave)
    "anos": 6,
    "pib_inicial": 420000,  # millones de Bs (≈$60B USD)
    "crecimiento_pib": 3.2,  # %
    
    # Deuda y finanzas
    "deuda_externa_inicial": 210811,  # millones de Bs
    "deuda_interna_inicial": 95839,   # millones de Bs
    "tasa_interes_externa": 4.3,      # %
    "tasa_interes_interna": 3.1,      # %
    
    "rin_inicial": 3500,  # millones USD
    
    # Compatibilidad
    "deuda_inicial": 306650,  # millones de Bs
    "tasa_interes": 4.3,      # %
    
    # Shocks (RF2 - Shocks Externos)
    "shock_tc": 0.0,  # % shock en tipo de cambio
    "shock_precio_gas": 0.0,  # % shock en precio del gas
    "shock_precio_oro": 0.0,  # % shock en precio del oro
    "shock_precio_plata": 0.0,  # % shock en precio de plata
    "shock_precio_zinc": 0.0,  # % shock en precio de zinc
    "shock_precio_estano": 0.0,  # % shock en precio de estaño
    "shock_precio_plomo": 0.0,  # % shock en precio de plomo
    
    "tc_base": 12.4125,
    "tc_coef_z": 1.835528988,
    
    "gas_volumen_base": 16515000.0,
    "gas_volumen_coef_z": 6202447.464,
    "gas_precio_base": 871.208,
    "gas_precio_coef_z": 729.0108468,
    "gas_tasa_idh": 32.0,  # %
    "gas_tasa_regalias": 18.0,  # %
    
    "oro_volumen_base": 33.86,
    "oro_volumen_coef_z": 17.43482148,
    "oro_precio_base": 62377907.29,
    "oro_precio_coef_z": 8328119.788,
    "oro_tasa_regalias": 12.0,  # %
    
    "plata_volumen_base": 1227.708333,
    "plata_volumen_coef_z": 146.1280268,
    "plata_precio_base": 864265.5598,
    "plata_precio_coef_z": 260978.7337,
    "plata_tasa_regalias": 12.0,  # %
    
    "zinc_volumen_base": 469430.4,
    "zinc_volumen_coef_z": 67671.09523,
    "zinc_precio_base": 2826.32284,
    "zinc_precio_coef_z": 427.3211028,
    "zinc_tasa_regalias": 12.0,  # %
    
    "estano_volumen_base": 16195.4,
    "estano_volumen_coef_z": 3060.343739,
    "estano_precio_base": 27438.70052,
    "estano_precio_coef_z": 6279.561218,
    "estano_tasa_regalias": 12.0,  # %
    
    "plomo_volumen_base": 90045.0,
    "plomo_volumen_coef_z": 19231.45031,
    "plomo_precio_base": 2081.16128,
    "plomo_precio_coef_z": 148.3825547,
    "plomo_tasa_regalias": 12.0,  # %
    
    "iva_mi_base": 9946000000.0,
    "iva_mi_coef_z": 1048843554.0,
    "iue_base": 8053000000.0,
    "iue_coef_z": 1504402074.0,
    "it_base": 5336333333.0,
    "it_coef_z": 811801125.1,
    "ice_mi_base": 1826333333.0,
    "ice_mi_coef_z": 202134278.8,
    "rc_iva_base": 633500000.0,
    "rc_iva_coef_z": 230075422.4,
    "itf_base": 433666666.7,
    "itf_coef_z": 128233640.9,
    "ij_base": 48000000.0,
    "ij_coef_z": 20386269.89,
    "cv_base": 4110000000.0,  # Conceptos Varios
    "cv_coef_z": 1427622359.0,
    "ga_base": 3473166667.0,
    "ga_coef_z": 833990987.2,
    "iva_i_base": 10566333333.0,
    "iva_i_coef_z": 2157826468.0,
    "ice_i_base": 761666666.7,
    "ice_i_coef_z": 120392137.1,
    "iehd_mi_base": 2200333333.0,
    "iehd_mi_coef_z": 275045935.6,
    "iehd_i_base": 32666666.67,
    "iehd_i_coef_z": 17305105.22,
    
    "gasto_corriente_base": 111953166667.0,
    "gasto_corriente_coef_z": 13443318019.0,
    "subsidio_alimentos_base": 401142857.1,
    "subsidio_alimentos_coef_z": 238077318.4,
    
    "gasolina_precio_importacion_base": 961.0769231,
    "gasolina_precio_importacion_coef_z": 188.465191,
    "gasolina_volumen_importacion_base": 439256.5537,
    "gasolina_volumen_importacion_coef_z": 318706.3029,
    "gasolina_precio_venta_domestico": 4986.67,
    
    "diesel_precio_importacion_base": 812.6923077,
    "diesel_precio_importacion_coef_z": 170.6858262,
    "diesel_volumen_importacion_base": 1194994.527,
    "diesel_volumen_importacion_coef_z": 519808.993,
    "diesel_precio_venta_domestico": 4376.47,
    
    # Flag para activar/desactivar subsidios
    "subsidio_combustibles_activo": True,
    
    # Parámetros legacy (mantenidos para compatibilidad pero no se usan en el modelo estocástico)
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
