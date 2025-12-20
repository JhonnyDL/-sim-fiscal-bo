# Simulador Macroeconómico Dinámico - Bolivia

## ¿Qué hace este simulador?

Este NO es un simple resumen estadístico. Es un **simulador DINÁMICO** que muestra:

1. **Evolución temporal**: Cómo cambian las variables año por año (2020-2026+)
2. **Relaciones causa-efecto**: Cómo una variable afecta a otras
3. **Interacciones del PGE**: Basado en el Presupuesto General del Estado real

## Diferencias con el simulador anterior

### ❌ ANTES (Lo que NO quería el ingeniero)
- Solo mostraba resultados finales
- Datos estáticos (promedios 2020-2025)
- Sin relación entre variables
- Valores fijos, no parametrizables

### ✅ AHORA (Lo que SÍ quiere el ingeniero)
- **Dinámica temporal**: Gráficos que muestran evolución año por año
- **Causa → Efecto**: Si modificas un impuesto, ves cómo afecta ingresos, liquidez, déficit, deuda, RIN, etc.
- **Parametrizable**: Activa/desactiva impuestos, subsidios, cambia precios, volúmenes
- **Variables desagregadas**: No "minerales" genéricos, sino Zinc, Estaño, Oro, Plata, Litio por separado
- **Instrumentos reales**: Basado en estructura del PGE boliviano

## Ejemplos de uso

### Ejemplo 1: ¿Qué pasa si quito el ITF?
1. Ve a la pestaña "Ingresos (PGE)"
2. Desactiva el switch del ITF
3. Ve a "Simular" y haz clic en "Simular Evolución Temporal"
4. **Resultado**: Verás cómo:
   - Los ingresos totales BAJAN
   - El déficit fiscal AUMENTA
   - La deuda pública CRECE más rápido
   - Las RIN se REDUCEN
   - La liquidez del Estado DISMINUYE

### Ejemplo 2: ¿Qué pasa si reduzco subsidios a combustibles?
1. Ve a "Gastos (PGE)"
2. Desactiva el subsidio a combustibles
3. Simula
4. **Resultado**: 
   - Gastos totales BAJAN
   - Déficit fiscal MEJORA (se reduce)
   - La deuda crece más lento
   - Mejor sostenibilidad fiscal

### Ejemplo 3: Comparar escenarios
1. Modifica varios parámetros (ej: quitar ITF + reducir subsidios)
2. Haz clic en "Comparar con Escenario Base"
3. **Resultado**: Verás gráficos comparativos que muestran la diferencia entre:
   - Tu escenario modificado
   - El escenario base de Bolivia
   - Variables afectadas año por año

## Variables parametrizables

### Sector Externo
- **Gas**: Precio internacional, volumen exportado
- **Minerales**: Zinc, Estaño, Oro, Plata, Litio (cada uno con precio y volumen)
- **Importaciones**: Base y crecimiento
- **Demanda interna**

### Ingresos Fiscales (PGE)
Cada impuesto se puede **activar o desactivar** y modificar su monto:
- IUE (Impuesto a las Utilidades)
- IVA (Impuesto al Valor Agregado)
- IT (Impuesto a las Transacciones)
- ITF (Impuesto a Transacciones Financieras)
- RC-IVA (Régimen Complementario)
- ICE (Impuestos a Consumos Específicos)
- GA (Gravamen Arancelario)

### Gastos del Estado (PGE)
- **Gasto corriente**: Sueldos, bienes y servicios, transferencias
- **Gasto de capital**: Inversión pública
- **Subsidios** (activar/desactivar):
  - Combustibles
  - Alimentos
  - Electricidad
- **Gasto sectorial**: Salud, Educación, Agropecuario, Defensa

### Sector Financiero
- Deuda externa e interna
- Tasas de interés
- RIN (Reservas Internacionales)
- PIB y crecimiento tendencial

## Cómo interpretar los gráficos

### Gráficos de Evolución Temporal
Muestran cómo cada variable cambia año por año. Puedes ver:
- **Ingresos desagregados**: Hidrocarburos, minería, impuestos directos e indirectos
- **Gastos desagregados**: Corriente, capital, subsidios, intereses
- **Indicadores fiscales**: Déficit, deuda, RIN
- **Sostenibilidad**: Ratios Deuda/PIB, Déficit/PIB, RIN en meses de importación

### Gráficos de Comparación
Muestran las DIFERENCIAS (Δ) entre tu escenario y el base:
- Δ Ingresos: Si es positivo → aumentaron los ingresos
- Δ Déficit: Si es positivo → empeoró el déficit
- Δ Deuda: Si es positivo → aumentó la deuda
- Δ RIN: Si es positivo → mejoraron las reservas

### Variables Afectadas
Un resumen año por año de qué variables experimentaron cambios significativos (>100 MM USD) debido a tus modificaciones.

## Relaciones causa-efecto implementadas

El simulador implementa las siguientes relaciones económicas:

1. **Exportaciones → Ingresos fiscales**: 
   - Gas genera IDH + Regalías (50% del precio)
   - Minerales generan Regalías mineras (5%)

2. **Impuestos → Ingresos totales**:
   - Si desactivas un impuesto, los ingresos bajan inmediatamente
   - Los impuestos crecen con el PIB

3. **Ingresos + Gastos → Déficit**:
   - Déficit = Gastos - Ingresos
   - Si hay superávit, la deuda no crece

4. **Déficit → Deuda**:
   - El déficit se financia con deuda (60% externa, 40% interna)
   - La deuda genera intereses que aumentan los gastos

5. **Saldo comercial → RIN**:
   - Exportaciones - Importaciones afectan las reservas
   - Pago de intereses externos reduce RIN

6. **Exportaciones + Gasto público + Consumo → PIB**:
   - El PIB crece por múltiples factores
   - Inversión pública tiene efecto multiplicador

7. **Subsidios → Gastos**:
   - Reducir subsidios disminuye el gasto corriente
   - Mejora automáticamente el déficit

## Preguntas que puedes responder

1. ¿Qué pasa si el precio del gas cae?
2. ¿Cómo afecta eliminar el ITF a la liquidez del Estado?
3. ¿Cuánto mejora el déficit si reduzco subsidios?
4. ¿Qué impacto tiene en el RIN un aumento de importaciones?
5. ¿Cómo evoluciona la deuda si aumento la inversión pública?
6. ¿Qué combinación de políticas mejora la sostenibilidad fiscal?

## Notas técnicas

- **Horizonte temporal**: Configurable (default 6 años)
- **Año base**: 2020
- **Valores iniciales**: Basados en datos reales de Bolivia
- **Crecimiento PIB**: 2.8% tendencial
- **Todos los montos**: En millones de USD

## Conclusión

Este simulador cumple con lo que el ingeniero pidió:
- ✅ Muestra EVOLUCIÓN en el tiempo
- ✅ Relaciones CAUSA-EFECTO entre variables
- ✅ Sistema PARAMETRIZABLE (activar/desactivar)
- ✅ Basado en instrumentos REALES (PGE)
- ✅ Visualización DINÁMICA
- ✅ Variables DESAGREGADAS (no genéricas)
