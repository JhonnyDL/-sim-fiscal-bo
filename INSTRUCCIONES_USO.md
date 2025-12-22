# Simulador Fiscal Dinámico - Bolivia

## ¿Qué hace este simulador?

Este **NO es un simple dashboard con datos históricos**. Es un **simulador DINÁMICO ESTOCÁSTICO** que proyecta el futuro fiscal de Bolivia bajo incertidumbre.

### Capacidades principales:

1. **Evolución temporal dinámica**: Proyecciones año por año (2020-2040) con volatilidad realista
2. **Relaciones causa-efecto**: Cambios en variables se propagan por todo el sistema económico
3. **Modelo estocástico**: Usa algoritmo Box-Müller para generar variables aleatorias normales
4. **Simulación Monte Carlo**: 100-10,000 iteraciones para análisis probabilístico de riesgo
5. **Basado en datos reales**: Parámetros calibrados con PGE (Presupuesto General del Estado) boliviano

## Diferencias con un dashboard tradicional

### ❌ Dashboard estático (LO QUE NO ES)
- Solo muestra datos históricos o promedios
- Sin relación entre variables
- Valores fijos, no se puede experimentar
- Sin incertidumbre ni volatilidad

### ✅ Simulador dinámico estocástico (LO QUE SÍ ES)
- **Proyecta el futuro** con modelos matemáticos
- **Relaciones causales**: Si ↓ precio gas → ↓ ingresos → ↑ déficit → ↑ deuda → ↓ RIN
- **Parametrizable**: Activa/desactiva impuestos, subsidios, aplica shocks
- **Volatilidad realista**: Variables aleatorias normales con Box-Müller
- **Análisis de riesgo**: Monte Carlo con percentiles P5 (optimista), P50 (probable), P95 (pesimista)

## ¿Cómo funciona el modelo?

### 1. Variables Aleatorias (Box-Müller)

Cada año, el simulador genera una variable aleatoria **Z ~ N(0,1)** usando el algoritmo Box-Müller:

```
Z = sqrt(-2 * ln(R1)) * cos(2π * R2)
donde R1, R2 son números aleatorios uniformes
```

Este **Z afecta TODAS las variables del modelo**: tipo de cambio, precios de exportación, volúmenes, impuestos, gastos, etc.

### 2. Relaciones Causa-Efecto Implementadas

#### Sector Externo → Ingresos Fiscales
```
↓ Precio internacional del gas → ↓ Ingresos IDH → ↓ Ingresos totales
↓ Precio de minerales → ↓ Regalías mineras → ↓ Ingresos totales
```

#### Impuestos → Liquidez del Estado
```
❌ Desactivar ITF → ↓ Ingresos tributarios → ↓ Liquidez → ↑ Déficit
```

#### Subsidios → Gasto Público
```
❌ Quitar subsidio combustibles → ↓ Gasto corriente → ↓ Déficit → ↓ Deuda
✅ Mantener subsidios → ↑ Gasto corriente → ↑ Déficit → ↑ Deuda
```

#### Déficit → Deuda → RIN → Sostenibilidad
```
↑ Déficit → ↑ Necesidad financiamiento → ↑ Deuda externa (70%) + interna (30%)
↑ Deuda externa → ↑ Intereses → ↑ Pagos externos → ↓ RIN
↓ RIN → ⚠️ Alerta si RIN < 3 meses de importaciones
```

#### Indicadores de Sostenibilidad
```
Deuda/PIB > 70%  → ⚠️ Riesgo fiscal alto (según FMI)
Déficit/PIB > 5%  → ⚠️ Déficit excesivo (criterio Maastricht)
RIN < 3 meses importaciones → ⚠️ Reservas insuficientes
```

## Ejemplos prácticos de uso

### Ejemplo 1: ¿Qué pasa si el precio del gas cae 30%?

**Configuración**:
1. Método: Box-Müller (simulación única rápida)
2. Shock: Precio gas = -30%
3. Años: 6
4. Simular

**Resultados esperados**:
- ↓ Ingresos por IDH y regalías de hidrocarburos
- ↓ Ingresos totales del Estado
- ↑ Déficit fiscal (menos ingresos, gastos constantes)
- ↑ Deuda pública (financiamiento del déficit)
- ↓ RIN (menos divisas por exportaciones)
- ⚠️ Posible alerta: RIN < 3 meses

**Interpretación**: Bolivia es vulnerable a caídas en precios del gas. Una crisis de commodities deteriora rápidamente la posición fiscal.

---

### Ejemplo 2: ¿Qué pasa si elimino el ITF?

**Configuración**:
1. Pestaña "Ingresos (PGE)"
2. Desactivar switch "ITF activo"
3. Simular

**Resultados esperados**:
- ↓ Ingresos tributarios (~300-500M USD/año)
- ↑ Déficit fiscal inmediato
- ↑ Deuda pública acumulada
- Deterioro de indicadores: ↑ Deuda/PIB, ↑ Déficit/PIB
- ⚠️ Alerta de sostenibilidad fiscal si se combina con otros shocks

**Interpretación**: Eliminar impuestos sin reducir gastos genera déficit estructural. La deuda crece exponencialmente si no se compensa con otros ingresos.

---

### Ejemplo 3: ¿Qué pasa si reduzco subsidios a combustibles?

**Configuración**:
1. Pestaña "Gastos (PGE)"
2. Desactivar "Subsidio combustibles activo"
3. Simular

**Resultados esperados**:
- ↓ Gasto corriente (~1,000-2,000M USD/año)
- ↓ Déficit fiscal (o ↑ superávit)
- ↓ Crecimiento de deuda (o reducción si hay superávit)
- Mejora de indicadores: ↓ Deuda/PIB, ↓ Déficit/PIB
- ↑ Sostenibilidad fiscal

**Interpretación**: Los subsidios representan una carga fiscal significativa. Reducirlos mejora la sostenibilidad, pero tiene impactos sociales (no modelados aquí).

---

### Ejemplo 4: Análisis de riesgo con Monte Carlo

**Configuración**:
1. Método: Monte Carlo
2. Número de simulaciones: 1000
3. Escenario: Crisis de Commodities (precio gas -30%, minerales -20%)
4. Simular (esperar 30-60 segundos)

**Resultados esperados**:
- **Déficit año 2025**:
  - P5 (optimista): -2,000M USD
  - P50 (más probable): -5,000M USD
  - P95 (pesimista): -8,500M USD
- **Deuda/PIB año 2025**:
  - P5: 55%
  - P50: 68%
  - P95: 82% ⚠️ (riesgo alto)
- **RIN año 2025**:
  - P5: 12 meses ✅
  - P50: 5 meses
  - P95: 2 meses ⚠️ (crítico)

**Interpretación**: 
- Hay 95% de probabilidad de que el déficit sea menor a -8,500M USD
- Hay 50% de probabilidad de que Deuda/PIB supere 68%
- Hay 5% de probabilidad de caer en crisis (RIN < 3 meses)

**Uso**: Evaluar riesgo de políticas públicas bajo incertidumbre. ¿Cuál es la probabilidad de una crisis fiscal? ¿Qué tan malo puede ser el peor escenario?

---

### Ejemplo 5: Comparación de políticas

**Escenario A: Status Quo**
- Mantener todos los subsidios
- Sin cambios tributarios
- Simular

**Escenario B: Ajuste Fiscal**
- Reducir subsidio combustibles 50%
- Reducir subsidio alimentos 30%
- Simular

**Comparación**:
- Usar exportación Excel para comparar ambas simulaciones
- Analizar diferencia en Deuda/PIB en año 6
- Evaluar trade-off: sostenibilidad fiscal vs impacto social

---

## Variables parametrizables

### Sector Externo (Shocks y bases)

#### Gas Natural
- Precio internacional base (USD/MBTU)
- Volumen exportado base (millones m³)
- Shock precio gas (% de variación)

#### Minerales (cada uno configurable)
- **Zinc**: Precio (USD/TM), Volumen (TM/año)
- **Estaño**: Precio (USD/TM), Volumen (TM/año)
- **Oro**: Precio (USD/oz), Volumen (oz/año)
- **Plata**: Precio (USD/oz), Volumen (oz/año)
- **Litio**: Precio (USD/TM), Volumen (TM/año)

### Ingresos Fiscales (PGE)

Cada impuesto se puede **activar/desactivar** con un switch:

- **IUE** (Impuesto a Utilidades de Empresas) - ON/OFF
- **IVA** (Impuesto al Valor Agregado) - ON/OFF
- **IT** (Impuesto a las Transacciones) - ON/OFF
- **ITF** (Impuesto a Transacciones Financieras) - ON/OFF
- **RC-IVA** (Régimen Complementario al IVA) - ON/OFF
- **ICE** (Impuestos a Consumos Específicos) - ON/OFF
- **GA** (Gravamen Arancelario) - ON/OFF

### Gastos del Estado (PGE)

- **Gasto corriente**: Sueldos, bienes y servicios, transferencias
- **Gasto de capital**: Inversión pública
- **Subsidios** (activar/desactivar con switch):
  - Combustibles (hidrocarburos) - ON/OFF
  - Alimentos - ON/OFF

### Sector Financiero

- **Deuda externa inicial** (millones USD)
- **Deuda interna inicial** (millones USD)
- **Tasa de interés externa** (%)
- **Tasa de interés interna** (%)
- **RIN inicial** (millones USD)
- **PIB base** (millones Bs)
- **Crecimiento tendencial PIB** (%)

### Configuración de Simulación

- **Horizonte temporal**: 1-20 años
- **Método de simulación**:
  - **Box-Müller único**: 1 trayectoria, rápido (<1s)
  - **Monte Carlo**: 100-10,000 iteraciones, 30s-10min

## Cómo interpretar los gráficos

### Gráficos de Evolución Temporal (Box-Müller)

Muestran cómo cada variable cambia año por año en una trayectoria específica.

**Categorías**:
1. **Ingresos desagregados**: 
   - Hidrocarburos (IDH + Regalías gas)
   - Minería (Regalías minerales)
   - Impuestos directos (IUE, RC-IVA)
   - Impuestos indirectos (IVA, IT, ITF, ICE, GA)
   
2. **Gastos desagregados**:
   - Gasto corriente
   - Gasto de capital
   - Subsidios (combustibles + alimentos)
   - Intereses de la deuda
   
3. **Indicadores fiscales**:
   - Déficit/Superávit (línea sobre eje X)
   - Deuda total (externa + interna)
   - RIN en millones USD
   
4. **Ratios de sostenibilidad**:
   - Deuda/PIB (%) - ⚠️ si > 70%
   - Déficit/PIB (%) - ⚠️ si > 5%
   - RIN en meses de importación - ⚠️ si < 3 meses

**Colores**:
- Verde: Ingresos, valores positivos, sostenibilidad
- Rojo: Gastos, déficit, alertas
- Amarillo: Neutral, transiciones

---

### Gráficos de Distribución (Monte Carlo)

Muestran la **distribución probabilística** de variables tras múltiples simulaciones.

**Card de Estadísticas del Año Actual**:
```
Déficit Fiscal - Año 2025
  P5 (Optimista):     -2,000M USD   [Barra verde]
  P50 (Más Probable): -5,000M USD   [Barra amarilla]
  P95 (Pesimista):    -8,500M USD   [Barra roja]
```

**Interpretación**:
- **P5**: Solo 5% de probabilidad de que sea mejor que esto (muy optimista)
- **P50 (Mediana)**: 50% probabilidad de estar arriba, 50% abajo (escenario central)
- **P95**: Solo 5% de probabilidad de que sea peor que esto (muy pesimista)

**Uso**:
- P5-P95 es la "banda de confianza del 90%"
- Si P95 de Deuda/PIB > 70% → Hay riesgo significativo de insostenibilidad
- Si P5 de RIN < 3 meses → Incluso en escenario optimista hay problemas

---

### Diagrama de Relaciones Causa-Efecto

Visualiza cómo las variables se afectan entre sí en el modelo.

**Interpretación de colores** (en el año seleccionado vs. año anterior):
- 🟢 **Verde**: Variable mejoró (↑ ingresos, ↓ deuda/PIB, ↑ RIN)
- 🔴 **Rojo**: Variable empeoró (↓ ingresos, ↑ deuda/PIB, ↓ RIN)
- 🟡 **Amarillo**: Variable estable (cambio < 5%)

**Flechas**:
- Indican dirección de influencia causal
- Grosor proporcional a la importancia de la relación

**Ejemplo**:
```
[Precio Gas]🟢 → [Ingresos IDH]🟢 → [Ingresos Totales]🟢 → [Déficit]🟢 → [Deuda]🟢
```
Si precio del gas sube, toda la cadena mejora (verde).

```
[Subsidios]🔴 → [Gastos]🔴 → [Déficit]🔴 → [Deuda]🔴 → [RIN]🔴
```
Si subsidios aumentan, toda la cadena empeora (rojo).

---

## Escenarios Predefinidos

### 1. Normal (Sin Shocks)
- Precio gas: estable
- Minerales: estables
- Tipo de cambio: estable
- **Uso**: Proyección base sin eventos externos

### 2. Crisis de Commodities
- Precio gas: -30%
- Oro: -20%
- Plata: -25%
- Zinc/Estaño: -15%
- **Uso**: Simular una crisis como 2008 o 2014-2016

### 3. Auge de Minerales
- Oro: +25%
- Plata: +30%
- Litio: +40%
- Zinc/Estaño: +20%
- **Uso**: Simular boom de materias primas como 2003-2013

### 4. Crisis Energética
- Precio gas: +40%
- Precio petróleo (import): +50%
- **Uso**: Simular crisis energética global (tipo 2022)

---

## Preguntas que puedes responder

### Preguntas de Política Fiscal
1. ¿Qué impacto tiene eliminar el ITF en la sostenibilidad de la deuda?
2. ¿Cuánto mejora el déficit si reduzco subsidios a combustibles 50%?
3. ¿Qué combinación de políticas logra Deuda/PIB < 60% en 6 años?

### Preguntas de Sector Externo
1. ¿Qué tan vulnerable es Bolivia a una caída del precio del gas?
2. Si el precio del oro sube 25%, ¿compensa una caída del gas de 30%?
3. ¿Qué nivel de RIN se alcanza en un escenario de boom exportador?

### Preguntas de Sostenibilidad
1. ¿En cuántos años la Deuda/PIB supera 70% bajo políticas actuales?
2. ¿Cuál es la probabilidad de una crisis de reservas (RIN < 3 meses)?
3. ¿Qué tan sensible es el déficit a cambios en el tipo de cambio?

### Preguntas de Análisis de Riesgo (Monte Carlo)
1. ¿Cuál es el rango de déficit esperado con 90% de confianza?
2. ¿Qué tan probable es que Deuda/PIB supere 80% en 6 años?
3. ¿Cuál es el peor escenario (P95) para RIN en 2025?

---

## Notas técnicas

### Sobre el Modelo
- **Tipo**: Modelo estocástico DSGE (Dynamic Stochastic General Equilibrium) simplificado
- **Horizonte**: Configurable, 1-20 años (default: 6 años)
- **Año base**: 2020 (calibración con PGE 2020)
- **Moneda**: Todos los montos en millones USD (tipo de cambio endógeno en Bs/USD)
- **Crecimiento PIB**: 2.8% tendencial por defecto (basado en promedio histórico 2010-2019)

### Sobre las Simulaciones
- **Box-Müller único**: Genera 1 trayectoria con 1 secuencia de Z(t) ~ N(0,1)
  - Tiempo: <1 segundo
  - Uso: Análisis exploratorio, prueba de escenarios, visualización de relaciones
  
- **Monte Carlo**: Genera N trayectorias (100-10,000) con diferentes secuencias de Z(t)
  - Tiempo: 30s (N=1000) a 10min (N=10,000)
  - Uso: Análisis de riesgo, bandas de confianza, probabilidades de eventos

### Limitaciones
1. **Modelo simplificado**: No captura todas las relaciones macroeconómicas de la realidad
2. **Parámetros estáticos**: Bases y coeficientes Z calibrados con datos 2020, no se actualizan
3. **Sin feedback loops complejos**: Por ejemplo, no modela efecto de inflación en gasto público
4. **Sin sector real detallado**: No desagrega sectores productivos (agricultura, industria, servicios)
5. **Supuestos de financiamiento fijos**: 70% externo, 30% interno (en realidad varía)
6. **Sin impactos sociales**: No modela pobreza, desempleo, desigualdad

### Validación
- Compara proyecciones del simulador con datos históricos 2020-2024 para calibración
- Revisa si las relaciones causa-efecto son consistentes con teoría económica
- Analiza sensibilidad: pequeños cambios en parámetros no deben causar cambios extremos

---

## Conclusión

Este simulador cumple con los objetivos académicos de un modelo dinámico:

- ✅ **Evolución temporal**: Proyecta año por año, no solo promedios
- ✅ **Relaciones causales**: Cambios se propagan por el sistema (Δ precio gas → Δ ingresos → Δ déficit → Δ deuda → Δ RIN)
- ✅ **Parametrizable**: Cada variable se puede modificar (impuestos, subsidios, shocks)
- ✅ **Basado en instrumentos reales**: Estructura del PGE boliviano (IDH, IUE, IVA, IT, subsidios, etc.)
- ✅ **Visualización dinámica**: Gráficos interactivos que muestran cambios en el tiempo
- ✅ **Variables desagregadas**: Gas, Zinc, Estaño, Oro, Plata, Litio (no genéricos)
- ✅ **Análisis de riesgo**: Monte Carlo con distribuciones probabilísticas (P5, P50, P95)
- ✅ **Alertas automáticas**: Sistema de warnings cuando indicadores superan umbrales críticos

**Es una herramienta para experimentar con políticas fiscales y entender sus consecuencias dinámicas bajo incertidumbre**, no un simple dashboard con datos históricos.
