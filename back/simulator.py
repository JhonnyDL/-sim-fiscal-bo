from typing import List, Dict, Optional
import random
from schemas import ParametrosSimulacion, ResultadoAnual, PasoSimulacion, ResultadoSimulacion, ResultadoMonteCarloAnual, EstadisticasVariable, ResultadoMonteCarloComplete
from fiscal_model import calcular_ingresos, calcular_gastos, calcular_indicadores, calcular_deficit_deuda
from stochastic import aplicar_volatilidad_precios, simular_shock

class SimuladorFiscalBolivia:
    """
    Motor principal de simulación fiscal para Bolivia
    Calcula proyecciones fiscales año por año con relaciones causa-efecto
    """
    
    def __init__(self, parametros: ParametrosSimulacion):
        self.parametros = parametros
        self.pasos: List[PasoSimulacion] = []
        
    def _simular_anio(self, ano_numero: int, estado_anterior: Optional[ResultadoAnual]) -> ResultadoAnual:
        """
        Simula un año fiscal completo con todas las relaciones económicas del modelo
        """
        ano_actual = 2020 + ano_numero
        cambios: List[str] = []
        
        # PASO 1: Calcular ingresos con modelo estocástico
        ingresos = calcular_ingresos(self.parametros, estado_anterior)
        
        # PASO 2: Calcular gastos con modelo estocástico
        gastos = calcular_gastos(
            self.parametros,
            estado_anterior,
            ingresos['tipo_cambio'],
            ingresos['z_value']
        )
        
        deuda_externa_anterior = estado_anterior.deuda_externa if estado_anterior else self.parametros.deuda_externa_inicial
        deuda_interna_anterior = estado_anterior.deuda_interna if estado_anterior else self.parametros.deuda_interna_inicial
        rin_anterior = estado_anterior.rin if estado_anterior else self.parametros.rin_inicial
        
        # PASO 4: Calcular PIB (simplificado)
        pib_anterior = estado_anterior.pib if estado_anterior else self.parametros.pib_inicial
        pib = pib_anterior * (1 + self.parametros.crecimiento_pib / 100)
        
        # PASO 4: Calcular PIB (simplificado)
        pib_anterior = estado_anterior.pib if estado_anterior else self.parametros.pib_inicial
        pib = pib_anterior * (1 + self.parametros.crecimiento_pib / 100)
        
        deficit_deuda = calcular_deficit_deuda(
            ingresos['total'],
            gastos['total'],
            deuda_externa_anterior,
            deuda_interna_anterior,
            self.parametros.tasa_interes_externa / 100,
            self.parametros.tasa_interes_interna / 100,
            ingresos['gas_ingresos_brutos'] + ingresos['exportaciones_total'],
            rin_anterior,
            ingresos['tipo_cambio'],
            pib  # Agregado PIB
        )
        
        # PASO 5: Calcular indicadores
        deuda_pib = (deficit_deuda['deuda_total'] / pib * 100) if pib > 0 else 0
        deficit_pib = (deficit_deuda['deficit'] / pib * 100) if pib > 0 else 0
        
        importaciones_estimadas = gastos['total'] * 0.25  # Estimación: 25% del gasto son importaciones
        importaciones_mensuales_usd = (importaciones_estimadas / ingresos['tipo_cambio']) / 12 if ingresos['tipo_cambio'] > 0 else 0
        rin_meses = deficit_deuda['rin'] / importaciones_mensuales_usd if importaciones_mensuales_usd > 0 else 0
        
        # Alertas
        if deuda_pib > 70:
            cambios.append(f"⚠️ Deuda/PIB {deuda_pib:.1f}% supera límite prudencial")
        if deficit_pib > 5:
            cambios.append(f"⚠️ Déficit/PIB {deficit_pib:.1f}% elevado")
        if gastos['subsidio_hidrocarburos'] > ingresos['gas_total']:
            cambios.append(f"⚠️ Subsidios ({gastos['subsidio_hidrocarburos']:.0f}M) superan ingresos gas")
        if rin_meses < 3:
            cambios.append(f"⚠️ RIN ({rin_meses:.1f} meses) por debajo del mínimo recomendado")
        
        # Registrar paso
        self.pasos.append(PasoSimulacion(
            paso=len(self.pasos),
            descripcion=f"Año {ano_actual}: Z={ingresos['z_value']:.3f}, TC={ingresos['tipo_cambio']:.2f}, Déficit={deficit_deuda['deficit']:.0f}M, RIN={deficit_deuda['rin']:.0f}M USD",
            ano=ano_actual,
            impacto_en=cambios
        ))
        
        # Construir resultado anual
        return ResultadoAnual(
            ano=ano_actual,
            # Ingresos
            ing_gas=ingresos['gas_total'],
            ing_zinc=ingresos['zinc'],
            ing_estano=ingresos['estano'],
            ing_oro=ingresos['oro'],
            ing_plata=ingresos['plata'],
            ing_litio=0,  # No incluido en el modelo del PDF
            ing_hidrocarburos_total=ingresos['gas_total'],
            ing_mineria_total=ingresos['exportaciones_total'] - ingresos['gas_regalias'],
            ing_iva=ingresos['iva_mi'] + ingresos['iva_i'],
            ing_iue=ingresos['iue'],
            ing_it=ingresos['it'],
            ing_itf=ingresos['itf'],
            ing_rc_iva=ingresos['rc_iva'],
            ing_ice=ingresos['ice_mi'] + ingresos['ice_i'],
            ing_ga=ingresos['ga'],
            ing_impuestos_total=ingresos['tributarios_total'],
            ingresos_totales=ingresos['total'],
            # Gastos
            gasto_sueldos=0,  # Incluido en gasto corriente
            gasto_bienes_servicios=0,  # Incluido en gasto corriente
            gasto_inversion=gastos['corriente'],  # Gasto corriente total
            gasto_subsidio_combustibles=gastos['subsidio_hidrocarburos'],
            gasto_subsidio_alimentos=gastos['subsidio_alimentos'],
            intereses_deuda_externa=deficit_deuda['intereses_externa'],
            intereses_deuda_interna=deficit_deuda['intereses_interna'],
            intereses_totales=deficit_deuda['intereses'],
            gastos_totales=gastos['total'],
            # Fiscales
            deficit_superavit=deficit_deuda['deficit'],
            resultado_primario=deficit_deuda['deficit'] - deficit_deuda['intereses'],
            deuda_total=deficit_deuda['deuda_total'],
            deuda_externa=deficit_deuda['deuda_externa'],
            deuda_interna=deficit_deuda['deuda_interna'],
            deuda_pib_ratio=deuda_pib,
            delta_deuda_externa=deficit_deuda.get('delta_deuda_externa', 0),
            delta_deuda_interna=deficit_deuda.get('delta_deuda_interna', 0),
            deuda_externa_pib=deficit_deuda.get('deuda_externa_pib', 0),
            deuda_interna_pib=deficit_deuda.get('deuda_interna_pib', 0),
            ratio_externa_total=deficit_deuda.get('ratio_externa_total', 0),
            ratio_interna_total=deficit_deuda.get('ratio_interna_total', 0),
            intereses_ingresos_ratio=deficit_deuda.get('intereses_ingresos_ratio', 0),
            # Externos (simplificados)
            exportaciones=ingresos['gas_ingresos_brutos'] + ingresos['exportaciones_total'],
            importaciones=importaciones_estimadas,
            saldo_comercial=ingresos['gas_ingresos_brutos'] + ingresos['exportaciones_total'] - importaciones_estimadas,
            rin=deficit_deuda['rin'],
            rin_meses_importacion=rin_meses,
            # PIB
            pib=pib,
            pib_real=pib,
            crecimiento_pib_efectivo=self.parametros.crecimiento_pib,
            deficit_pib_ratio=deficit_pib,
            presion_tributaria=(ingresos['tributarios_total'] / pib * 100) if pib > 0 else 0,
            capacidad_pago=(ingresos['total'] / deficit_deuda['intereses']) if deficit_deuda['intereses'] > 0 else 999,
            cambios=cambios
        )
    
    def simular(self, anos: int) -> ResultadoSimulacion:
        """
        Ejecuta simulación completa para múltiples años
        
        Args:
            anos: Número de años a simular
            
        Returns:
            ResultadoSimulacion con resultados y pasos
        """
        self.pasos = []
        resultados: List[ResultadoAnual] = []
        
        for i in range(anos):
            estado_anterior = resultados[-1] if resultados else None
            resultado = self._simular_anio(i, estado_anterior)
            resultados.append(resultado)
        
        return ResultadoSimulacion(
            resultados=resultados,
            pasos=self.pasos
        )
    
    def simular_monte_carlo(self, anos: int, num_simulaciones: int = 1000) -> 'ResultadoMonteCarloComplete':
        """
        Ejecuta múltiples simulaciones Monte Carlo para obtener distribuciones de probabilidad
        
        Args:
            anos: Número de años a simular
            num_simulaciones: Número de simulaciones a ejecutar (default: 1000)
            
        Returns:
            ResultadoMonteCarloComplete con estadísticas y distribuciones
        """
        
        # Almacenar todas las simulaciones
        todas_las_simulaciones: List[List[ResultadoAnual]] = []
        
        print(f"Ejecutando {num_simulaciones} simulaciones Monte Carlo...")
        
        for sim_num in range(num_simulaciones):
            # Ejecutar una simulación completa
            resultado = self.simular(anos)
            todas_las_simulaciones.append(resultado.resultados)
            
            if (sim_num + 1) % 100 == 0:
                print(f"  Completadas {sim_num + 1}/{num_simulaciones} simulaciones")
        
        # Calcular estadísticas año por año
        resultados_mc: List[ResultadoMonteCarloAnual] = []
        
        for ano_idx in range(anos):
            ano_actual = 2020 + ano_idx
            
            # Recolectar valores de todas las simulaciones para este año
            valores = {
                'ingresos_totales': [],
                'gastos_totales': [],
                'deficit_superavit': [],
                'deuda_total': [],
                'deuda_pib_ratio': [],
                'rin': [],
                'rin_meses_importacion': [],
                'deficit_pib_ratio': [],
                'presion_tributaria': [],
                'ing_gas': [],
                'ing_mineria_total': [],
                'ing_iva': [],
                'ing_iue': [],
                'gasto_subsidio_combustibles': [],
                # Nuevos campos agregados
                'delta_deuda_externa': [],
                'delta_deuda_interna': [],
                'deuda_externa_pib': [],
                'deuda_interna_pib': [],
                'ratio_externa_total': [],
                'ratio_interna_total': [],
                'intereses_ingresos_ratio': [],
            }
            
            for sim in todas_las_simulaciones:
                resultado_ano = sim[ano_idx]
                for key in valores.keys():
                    valores[key].append(getattr(resultado_ano, key))
            
            # Calcular estadísticas para cada variable
            def calcular_estadisticas(datos: List[float]) -> EstadisticasVariable:
                import numpy as np
                datos_array = np.array(datos)
                return EstadisticasVariable(
                    promedio=float(np.mean(datos_array)),
                    mediana=float(np.median(datos_array)),
                    desviacion_estandar=float(np.std(datos_array)),
                    percentil_5=float(np.percentile(datos_array, 5)),
                    percentil_25=float(np.percentile(datos_array, 25)),
                    percentil_75=float(np.percentile(datos_array, 75)),
                    percentil_95=float(np.percentile(datos_array, 95)),
                    minimo=float(np.min(datos_array)),
                    maximo=float(np.max(datos_array))
                )
            
            # Crear resultado para este año
            resultado_mc_ano = ResultadoMonteCarloAnual(
                ano=ano_actual,
                ingresos_totales=calcular_estadisticas(valores['ingresos_totales']),
                gastos_totales=calcular_estadisticas(valores['gastos_totales']),
                deficit_superavit=calcular_estadisticas(valores['deficit_superavit']),
                deuda_total=calcular_estadisticas(valores['deuda_total']),
                deuda_pib_ratio=calcular_estadisticas(valores['deuda_pib_ratio']),
                rin=calcular_estadisticas(valores['rin']),
                rin_meses_importacion=calcular_estadisticas(valores['rin_meses_importacion']),
                deficit_pib_ratio=calcular_estadisticas(valores['deficit_pib_ratio']),
                presion_tributaria=calcular_estadisticas(valores['presion_tributaria']),
                ing_gas=calcular_estadisticas(valores['ing_gas']),
                ing_mineria_total=calcular_estadisticas(valores['ing_mineria_total']),
                ing_iva=calcular_estadisticas(valores['ing_iva']),
                ing_iue=calcular_estadisticas(valores['ing_iue']),
                gasto_subsidio_combustibles=calcular_estadisticas(valores['gasto_subsidio_combustibles']),
                # Distribuciones completas para histogramas
                distribucion_deficit=valores['deficit_superavit'],
                distribucion_deuda_pib=valores['deuda_pib_ratio'],
                distribucion_rin=valores['rin'],
                # Nuevos campos agregados
                distribucion_delta_deuda_externa=valores['delta_deuda_externa'],
                distribucion_delta_deuda_interna=valores['delta_deuda_interna'],
                distribucion_deuda_externa_pib=valores['deuda_externa_pib'],
                distribucion_deuda_interna_pib=valores['deuda_interna_pib'],
                distribucion_ratio_externa_total=valores['ratio_externa_total'],
                distribucion_ratio_interna_total=valores['ratio_interna_total'],
                distribucion_intereses_ingresos_ratio=valores['intereses_ingresos_ratio'],
            )
            
            resultados_mc.append(resultado_mc_ano)
        
        # Tomar una simulación representativa (la que está más cerca de la mediana)
        simulacion_representativa = todas_las_simulaciones[num_simulaciones // 2]
        
        return ResultadoMonteCarloComplete(
            num_simulaciones=num_simulaciones,
            resultados_estadisticos=resultados_mc,
            simulacion_representativa=simulacion_representativa,
            metodo="Monte Carlo con Box-Müller"
        )
def aplicar_volatilidad_precios(precio_base: float, volatilidad_pct: float) -> float:
    """
    Aplica un cambio estocástico al precio usando volatilidad porcentual.
    precio_base: precio inicial
    volatilidad_pct: porcentaje de volatilidad (ej. 5 para ±5%)
    """
    cambio = precio_base * volatilidad_pct / 100
    return precio_base + random.uniform(-cambio, cambio)
