from typing import List, Dict, Optional
import random
from schemas import ParametrosSimulacion, ResultadoAnual, PasoSimulacion, ResultadoSimulacion
from fiscal_model import calcular_ingresos, calcular_gastos, calcular_deficit_deuda

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
        
        deficit_deuda = calcular_deficit_deuda(
            ingresos['total'],
            gastos['total'],
            deuda_externa_anterior,
            deuda_interna_anterior,
            self.parametros.tasa_interes_externa / 100,
            self.parametros.tasa_interes_interna / 100,
            ingresos['gas_ingresos_brutos'] + ingresos['exportaciones_total'],
            rin_anterior,
            ingresos['tipo_cambio']
        )
        
        # PASO 4: Calcular PIB (simplificado)
        pib_anterior = estado_anterior.pib if estado_anterior else self.parametros.pib_inicial
        pib = pib_anterior * (1 + self.parametros.crecimiento_pib / 100)
        
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
