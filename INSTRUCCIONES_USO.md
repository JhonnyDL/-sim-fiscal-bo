# Instrucciones de Uso del Simulador Fiscal

## Inicio Rápido

### 1. Iniciar el Backend (Python)

```bash
cd back
python main.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Iniciar el Frontend (Next.js)

En otra terminal:

```bash
npm run dev
```

Abre tu navegador en `http://localhost:3000`

## Uso del Simulador

### Paso 1: Configurar Parámetros Básicos

1. **Años de Simulación**: Define cuántos años simular (1-20)
2. **PIB Inicial**: Producto Interno Bruto en millones de Bs
3. **Crecimiento PIB**: Tasa de crecimiento esperada (%)
4. **Deuda Inicial**: Deuda pública total en millones de Bs
5. **Tasa de Interés**: Costo promedio de la deuda (%)

### Paso 2: Configurar Shocks Externos

Los **shocks externos** son cambios porcentuales en variables que Bolivia no controla:

- **Shock Precio Gas**: Variación en el precio internacional del gas natural
- **Shock Precio Oro**: Variación en el precio del oro
- **Shock Precio Plata/Zinc/Estaño/Plomo**: Variación en precios de minerales
- **Shock Tipo de Cambio**: Variación en el tipo de cambio

**Ejemplo:** Un shock de -30% en el precio del gas simula una caída del 30% en el precio internacional.

### Paso 3: Usar Escenarios Predefinidos

El simulador incluye escenarios pre-configurados:

1. **Escenario Normal**: Sin shocks (situación estable)
2. **Crisis de Commodities**: Caída generalizada de precios de exportación
3. **Auge de Minerales**: Aumento de precios de minerales
4. **Crisis Energética**: Aumento significativo en precio del gas

### Paso 4: Ejecutar la Simulación

Haz clic en **"Ejecutar Simulación"**. El simulador:

1. Envía los parámetros al backend Python
2. Calcula año por año con variables aleatorias normales (modelo estocástico)
3. Genera resultados con ingresos, gastos, déficit, deuda, etc.

### Paso 5: Navegar por los Resultados

- **Slider de años**: Navega año por año
- **Botones ◀ ▶**: Avanza o retrocede un año
- **Diagrama de Relaciones**: Muestra cómo las variables se afectan entre sí
- **Gráficas Detalladas**: Visualiza tendencias en el tiempo
- **Tabla de Resultados**: Datos numéricos completos

### Paso 6: Exportar Resultados

- **Excel (.xlsx)**: Descarga todos los datos en formato de hoja de cálculo
- **PDF**: Genera un reporte ejecutivo con gráficos y tablas

## Modelo Matemático

El simulador usa el modelo estocástico descrito en `Relaciones.docx.pdf`:

- **Variables Aleatorias Normales**: Generadas con Box-Müller
- **Ingresos por Exportaciones**: Gas, oro, plata, zinc, estaño, plomo con fórmulas específicas
- **Ingresos Tributarios**: IVA, IUE, IT, RC-IVA, ICE, ITF, IJ, GA, IDH, IEHD
- **Gastos**: Subsidios con importaciones, gastos corrientes e inversión
- **Deuda**: Acumulación con tasa de interés

## Interpretación de Resultados

### Indicadores Clave

- **Déficit/PIB**: < 3% es sostenible según criterios internacionales
- **Deuda/PIB**: < 60% es nivel prudente según FMI
- **RIN (Reservas)**: Debe cubrir al menos 3 meses de importaciones
- **Presión Tributaria**: Ingresos tributarios como % del PIB
- **Capacidad de Pago**: Ingresos totales / Gastos de deuda

### Colores del Diagrama de Relaciones

- **Verde**: Variable mejoró respecto al año anterior
- **Rojo**: Variable empeoró respecto al año anterior
- **Amarillo**: Variable se mantuvo estable
