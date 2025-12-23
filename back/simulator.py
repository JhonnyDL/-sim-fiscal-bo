from typing import List, Dict, Optional
import random
import numpy as np
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
        OPTIMIZADO con NumPy para mejor rendimiento
        
        Args:
            anos: Número de años a simular
            num_simulaciones: Número de simulaciones a ejecutar (default: 1000)
            
        Returns:
            ResultadoMonteCarloComplete con estadísticas y distribuciones
        """
        
        # Almacenar todas las simulaciones
        todas_las_simulaciones: List[List[ResultadoAnual]] = []
        
        print(f"Ejecutando {num_simulaciones} simulaciones Monte Carlo (OPTIMIZADO)...")
        
        # Esto es mucho más rápido que usar listas de Python
        variables_tracking = {
            'ingresos_totales': np.zeros((num_simulaciones, anos)),
            'gastos_totales': np.zeros((num_simulaciones, anos)),
            'deficit_superavit': np.zeros((num_simulaciones, anos)),
            'deuda_total': np.zeros((num_simulaciones, anos)),
            'deuda_pib_ratio': np.zeros((num_simulaciones, anos)),
            'rin': np.zeros((num_simulaciones, anos)),
            'rin_meses_importacion': np.zeros((num_simulaciones, anos)),
            'deficit_pib_ratio': np.zeros((num_simulaciones, anos)),
            'presion_tributaria': np.zeros((num_simulaciones, anos)),
            'ing_gas': np.zeros((num_simulaciones, anos)),
            'ing_mineria_total': np.zeros((num_simulaciones, anos)),
            'ing_iva': np.zeros((num_simulaciones, anos)),
            'ing_iue': np.zeros((num_simulaciones, anos)),
            'gasto_subsidio_combustibles': np.zeros((num_simulaciones, anos)),
            'delta_deuda_externa': np.zeros((num_simulaciones, anos)),
            'delta_deuda_interna': np.zeros((num_simulaciones, anos)),
            'deuda_externa_pib': np.zeros((num_simulaciones, anos)),
            'deuda_interna_pib': np.zeros((num_simulaciones, anos)),
            'ratio_externa_total': np.zeros((num_simulaciones, anos)),
            'ratio_interna_total': np.zeros((num_simulaciones, anos)),
            'intereses_ingresos_ratio': np.zeros((num_simulaciones, anos)),
        }
        
        simulacion_representativa = None
        
        for sim_num in range(num_simulaciones):
            # Ejecutar una simulación completa
            resultado = self.simular(anos)
            
            # Extraer solo las métricas necesarias (no todo el objeto)
            for ano_idx, resultado_ano in enumerate(resultado.resultados):
                variables_tracking['ingresos_totales'][sim_num, ano_idx] = resultado_ano.ingresos_totales
                variables_tracking['gastos_totales'][sim_num, ano_idx] = resultado_ano.gastos_totales
                variables_tracking['deficit_superavit'][sim_num, ano_idx] = resultado_ano.deficit_superavit
                variables_tracking['deuda_total'][sim_num, ano_idx] = resultado_ano.deuda_total
                variables_tracking['deuda_pib_ratio'][sim_num, ano_idx] = resultado_ano.deuda_pib_ratio
                variables_tracking['rin'][sim_num, ano_idx] = resultado_ano.rin
                variables_tracking['rin_meses_importacion'][sim_num, ano_idx] = resultado_ano.rin_meses_importacion
                variables_tracking['deficit_pib_ratio'][sim_num, ano_idx] = resultado_ano.deficit_pib_ratio
                variables_tracking['presion_tributaria'][sim_num, ano_idx] = resultado_ano.presion_tributaria
                variables_tracking['ing_gas'][sim_num, ano_idx] = resultado_ano.ing_gas
                variables_tracking['ing_mineria_total'][sim_num, ano_idx] = resultado_ano.ing_mineria_total
                variables_tracking['ing_iva'][sim_num, ano_idx] = resultado_ano.ing_iva
                variables_tracking['ing_iue'][sim_num, ano_idx] = resultado_ano.ing_iue
                variables_tracking['gasto_subsidio_combustibles'][sim_num, ano_idx] = resultado_ano.gasto_subsidio_combustibles
                variables_tracking['delta_deuda_externa'][sim_num, ano_idx] = resultado_ano.delta_deuda_externa
                variables_tracking['delta_deuda_interna'][sim_num, ano_idx] = resultado_ano.delta_deuda_interna
                variables_tracking['deuda_externa_pib'][sim_num, ano_idx] = resultado_ano.deuda_externa_pib
                variables_tracking['deuda_interna_pib'][sim_num, ano_idx] = resultado_ano.deuda_interna_pib
                variables_tracking['ratio_externa_total'][sim_num, ano_idx] = resultado_ano.ratio_externa_total
                variables_tracking['ratio_interna_total'][sim_num, ano_idx] = resultado_ano.ratio_interna_total
                variables_tracking['intereses_ingresos_ratio'][sim_num, ano_idx] = resultado_ano.intereses_ingresos_ratio
            
            # Guardar la simulación del medio como representativa
            if sim_num == num_simulaciones // 2:
                simulacion_representativa = resultado.resultados
            
            if (sim_num + 1) % 50 == 0 or sim_num == 0:
                print(f"  Completadas {sim_num + 1}/{num_simulaciones} simulaciones")
        
        resultados_mc: List[ResultadoMonteCarloAnual] = []
        
        for ano_idx in range(anos):
            ano_actual = 2020 + ano_idx
            
            def calcular_estadisticas_rapido(datos_col: np.ndarray) -> EstadisticasVariable:
                return EstadisticasVariable(
                    promedio=float(np.mean(datos_col)),
                    mediana=float(np.median(datos_col)),
                    desviacion_estandar=float(np.std(datos_col)),
                    percentil_5=float(np.percentile(datos_col, 5)),
                    percentil_25=float(np.percentile(datos_col, 25)),
                    percentil_75=float(np.percentile(datos_col, 75)),
                    percentil_95=float(np.percentile(datos_col, 95)),
                    minimo=float(np.min(datos_col)),
                    maximo=float(np.max(datos_col))
                )
            
            resultado_mc_ano = ResultadoMonteCarloAnual(
                ano=ano_actual,
                ingresos_totales=calcular_estadisticas_rapido(variables_tracking['ingresos_totales'][:, ano_idx]),
                gastos_totales=calcular_estadisticas_rapido(variables_tracking['gastos_totales'][:, ano_idx]),
                deficit_superavit=calcular_estadisticas_rapido(variables_tracking['deficit_superavit'][:, ano_idx]),
                deuda_total=calcular_estadisticas_rapido(variables_tracking['deuda_total'][:, ano_idx]),
                deuda_pib_ratio=calcular_estadisticas_rapido(variables_tracking['deuda_pib_ratio'][:, ano_idx]),
                rin=calcular_estadisticas_rapido(variables_tracking['rin'][:, ano_idx]),
                rin_meses_importacion=calcular_estadisticas_rapido(variables_tracking['rin_meses_importacion'][:, ano_idx]),
                deficit_pib_ratio=calcular_estadisticas_rapido(variables_tracking['deficit_pib_ratio'][:, ano_idx]),
                presion_tributaria=calcular_estadisticas_rapido(variables_tracking['presion_tributaria'][:, ano_idx]),
                ing_gas=calcular_estadisticas_rapido(variables_tracking['ing_gas'][:, ano_idx]),
                ing_mineria_total=calcular_estadisticas_rapido(variables_tracking['ing_mineria_total'][:, ano_idx]),
                ing_iva=calcular_estadisticas_rapido(variables_tracking['ing_iva'][:, ano_idx]),
                ing_iue=calcular_estadisticas_rapido(variables_tracking['ing_iue'][:, ano_idx]),
                gasto_subsidio_combustibles=calcular_estadisticas_rapido(variables_tracking['gasto_subsidio_combustibles'][:, ano_idx]),
                # Distribuciones completas para histogramas (convertir a lista)
                distribucion_deficit=variables_tracking['deficit_superavit'][:, ano_idx].tolist(),
                distribucion_deuda_pib=variables_tracking['deuda_pib_ratio'][:, ano_idx].tolist(),
                distribucion_rin=variables_tracking['rin'][:, ano_idx].tolist(),
                distribucion_delta_deuda_externa=variables_tracking['delta_deuda_externa'][:, ano_idx].tolist(),
                distribucion_delta_deuda_interna=variables_tracking['delta_deuda_interna'][:, ano_idx].tolist(),
                distribucion_deuda_externa_pib=variables_tracking['deuda_externa_pib'][:, ano_idx].tolist(),
                distribucion_deuda_interna_pib=variables_tracking['deuda_interna_pib'][:, ano_idx].tolist(),
                distribucion_ratio_externa_total=variables_tracking['ratio_externa_total'][:, ano_idx].tolist(),
                distribucion_ratio_interna_total=variables_tracking['ratio_interna_total'][:, ano_idx].tolist(),
                distribucion_intereses_ingresos_ratio=variables_tracking['intereses_ingresos_ratio'][:, ano_idx].tolist(),
            )
            
            resultados_mc.append(resultado_mc_ano)
        
        print(f"✓ Monte Carlo completado: {num_simulaciones} simulaciones")
        
        return ResultadoMonteCarloComplete(
            num_simulaciones=num_simulaciones,
            resultados_estadisticos=resultados_mc,
            simulacion_representativa=simulacion_representativa,
            metodo="Monte Carlo optimizado con NumPy"
        )

def aplicar_volatilidad_precios(precio_base: float, volatilidad_pct: float) -> float:
    """
    Aplica un cambio estocástico al precio usando volatilidad porcentual.
    precio_base: precio inicial
    volatilidad_pct: porcentaje de volatilidad (ej. 5 para ±5%)
    """
    cambio = precio_base * volatilidad_pct / 100
    return precio_base + random.uniform(-cambio, cambio)
