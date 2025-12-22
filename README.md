# Simulador Fiscal del Estado Plurinacional de Bolivia

Herramienta Web Interactiva y Adaptativa para simular la dinámica del sistema fiscal boliviano (2020-2025+) bajo incertidumbre estocástica.

## 🎯 ¿Por qué este simulador es diferente?

### ❌ NO es un simple dashboard con datos estáticos
Este simulador implementa un **modelo DINÁMICO con relaciones causa-efecto reales**, no solo gráficos de datos históricos.

### ✅ ES un modelo estocástico completo que simula:
- **Evolución temporal año por año**: Proyecciones de 1 a 20 años con volatilidad realista
- **Relaciones causales**: Cambios en impuestos → déficit → deuda → RIN → sostenibilidad fiscal
- **Simulación Monte Carlo**: 100-10,000 iteraciones para análisis probabilístico de riesgo
- **Shocks externos**: Precios internacionales de gas y minerales con volatilidad estocástica
- **Variables aleatorias normales**: Generadas con algoritmo Box-Müller para precisión científica

## 🏗️ Arquitectura

### Backend (Python + FastAPI)
- **Motor de simulación estocástico**: Python con numpy para cálculos científicos de alta precisión
- **API REST**: FastAPI con validación automática Pydantic y documentación Swagger
- **Modelos estocásticos**: Implementación completa de Box-Müller y simulación Monte Carlo
- **Fórmulas fiscales**: Sistema completo de ecuaciones del modelo DSGE (Dynamic Stochastic General Equilibrium)

### Frontend (Next.js + React)
- **Interfaz moderna**: Next.js 16 con React 19 y TypeScript
- **Visualización interactiva**: Recharts para gráficos dinámicos año por año
- **Comunicación asíncrona**: Cliente API con manejo robusto de errores
- **UI responsiva**: Tailwind CSS 4 + shadcn/ui con diseño en colores de Bolivia

## 🚀 Requisitos del Sistema

### Backend
- Python 3.8+
- pip (gestor de paquetes)

### Frontend
- Node.js 18+
- npm o yarn

## 📦 Instalación

### 1. Instalar dependencias del Backend
```bash
cd back
pip install -r requirements.txt
```

### 2. Instalar dependencias del Frontend
```bash
npm install
```

## 💻 Ejecución

### 1. Iniciar Backend (Puerto 8000)
```bash
cd back
python main.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

El backend estará disponible en:
- API: `http://localhost:8000`
- Documentación interactiva (Swagger): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Iniciar Frontend (Puerto 3000)
En otra terminal:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📊 Requisitos Funcionales Implementados

### ✅ RF1: Configuración de Parámetros Iniciales
- Deuda pública inicial (Interna/Externa) con tasas de interés diferenciadas
- RIN (Reservas Internacionales Netas) inicial en millones USD
- Tasa de crecimiento tendencial del PIB configurable
- Horizonte temporal de simulación (1-20 años)

### ✅ RF2: Generación de Shocks Estocásticos
- **Algoritmo Box-Müller**: Genera variables aleatorias con distribución normal N(0,1)
- **Volatilidad de precios**: Gas, Zinc, Estaño, Oro, Plata, Litio con coeficientes estocásticos
- **Volatilidad de volúmenes**: Exportaciones con variabilidad realista
- **Shocks manuales**: Configuración adicional de choques específicos por commodity
- **Tipo de cambio estocástico**: Bs/USD con volatilidad endógena

### ✅ RF3: Simulación de Escenarios Fiscales
- **Modelo estocástico completo** implementado en `back/fiscal_model.py`
- **Sistema de ecuaciones dinámico**: Todas las variables calculadas con relaciones causa-efecto
- **Horizonte configurable**: Default 6 años, máximo 20 años
- **Cálculo paso a paso**: Registro detallado de cada operación matemática
- **Motor Python optimizado**: NumPy para operaciones vectorizadas eficientes

### ✅ RF4: Análisis de Sensibilidad de Subsidios
- Subsidio a combustibles (hidrocarburos) activable/desactivable
- Subsidio a alimentos con configuración de monto
- Impacto directo en Gasto Corriente y Déficit Fiscal
- Visualización comparativa de escenarios con/sin subsidios
- Análisis de sostenibilidad fiscal según políticas de subsidios

### ✅ RF5: Simulación Monte Carlo para Análisis de Riesgo
- **Múltiples iteraciones**: 100-10,000 simulaciones independientes
- **Distribuciones probabilísticas**: Percentiles P5, P25, P50, P75, P95 para cada variable
- **Estadísticas completas**: Promedio, mediana, desviación estándar, mínimo, máximo
- **Análisis de escenarios**: Optimista (P5), probable (P50), pesimista (P95)
- **Bandas de confianza**: Rangos de incertidumbre año por año

### ✅ RF6: Visualización de Resultados (Dashboard Interactivo)
- **Gráficos dinámicos de series temporales**: Evolución año por año con Recharts
- **Diagrama de relaciones causales**: Visualización de impactos entre variables
- **Indicadores de sostenibilidad**: Deuda/PIB, Déficit/PIB, RIN en meses de importación
- **Distribuciones Monte Carlo**: Histogramas y percentiles para variables clave
- **Navegación temporal**: Controles para año por año, auto-play, y saltos directos
- **Gráficos comparativos**: Ingresos vs Gastos, composición sectorial

### ✅ RF7: Exportación de Datos
- **Excel (XLSX)**: Exportación completa de resultados con formato tabular
- **PDF**: Reporte ejecutivo con gráficos y tablas para presentaciones

## 🎓 Requisitos No Funcionales Implementados

### ✅ RNF1: Rendimiento
- Motor Python con NumPy: Simulaciones complejas en <1 segundo (Box-Müller único)
- Simulación Monte Carlo (1000 iteraciones): 30-60 segundos
- Interfaz responsiva: Feedback visual durante cálculos largos con progress bars
- API REST de alta performance: FastAPI con respuestas en <100ms

### ✅ RNF2: Precisión Científica
- **Box-Müller**: Algoritmo estándar para variables aleatorias normales
- **NumPy**: Biblioteca científica de referencia para cálculos numéricos
- **Pydantic**: Validación estricta de tipos y rangos en todos los parámetros
- **Fórmulas documentadas**: Cada ecuación con referencias económicas

### ✅ RNF3: Usabilidad
- Diseño intuitivo con navegación por pestañas (Parametrización, Dashboard, Exportar)
- Landing page explicativa con información del modelo y fuentes oficiales
- Parametrización clara con escenarios predefinidos (Normal, Crisis, Auge)
- Gráficos interactivos con tooltips informativos y leyendas claras
- Esquema de colores de la bandera boliviana (rojo, amarillo, verde)
- Interfaz en español con terminología técnica apropiada

### ✅ RNF4: Documentación Completa
- **Código backend**: Docstrings en todas las funciones con tipo de retorno
- **Código frontend**: Comentarios explicativos en componentes complejos
- **README.md**: Guía completa de instalación y uso
- **INSTRUCCIONES.md**: Tutorial paso a paso del simulador
- **explicacion.md**: Documentación técnica exhaustiva del sistema
- **Swagger UI**: Documentación interactiva automática de la API en `/docs`

### ✅ RNF5: Mantenibilidad
- Separación clara Backend/Frontend con API REST estándar
- Arquitectura modular: Cada función fiscal en módulo independiente
- Tipos estrictos: Pydantic (Python) + TypeScript (Frontend)
- Git-friendly: Estructura de carpetas clara y organizada

## 📂 Estructura del Proyecto

```
├── back/                           # Backend Python (FastAPI)
│   ├── main.py                     # API REST con endpoints
│   ├── simulator.py                # Motor de simulación (Box-Müller y Monte Carlo)
│   ├── fiscal_model.py             # Sistema completo de ecuaciones fiscales
│   ├── stochastic.py               # Algoritmo Box-Müller para variables aleatorias
│   ├── schemas.py                  # Modelos Pydantic de validación
│   ├── parameters.py               # Parámetros por defecto basados en PGE 2020
│   └── requirements.txt            # Dependencias Python
│
├── app/                            # Frontend Next.js
│   ├── page.tsx                    # Página principal con tabs y controles
│   ├── layout.tsx                  # Layout global con metadatos SEO
│   └── globals.css                 # Estilos globales con Tailwind CSS v4
│
├── components/                     # Componentes React
│   ├── landing-page.tsx            # Landing page con información del modelo
│   ├── diagrama-relaciones.tsx     # Diagrama de flujo causa-efecto
│   ├── graficas-detalladas.tsx     # Gráficos de línea por categoría
│   ├── graficos-interactivos.tsx   # Gráficos de barras comparativos
│   ├── tabla-resultados.tsx        # Tabla de datos anuales
│   ├── editor-parametros-avanzados.tsx  # Formulario de configuración
│   └── ui/                         # Componentes shadcn/ui (button, card, input, etc.)
│
├── lib/
│   ├── api.ts                      # Cliente API para comunicación con backend
│   ├── types.ts                    # Tipos TypeScript e interfaces
│   └── utils.ts                    # Utilidades (cn, formatters, etc.)
│
├── public/
│   └── escudo-bolivia.png          # Escudo nacional para la landing page
│
├── README.md                       # Este archivo
├── INSTRUCCIONES.md                # Guía de uso del simulador
├── INSTRUCCIONES_USO.md            # Tutorial paso a paso
├── explicacion.md                  # Documentación técnica completa
├── package.json                    # Dependencias Node.js
└── tsconfig.json                   # Configuración TypeScript
```

## 📊 Modelo Matemático Implementado

El simulador implementa un modelo estocástico DSGE (Dynamic Stochastic General Equilibrium) con las siguientes ecuaciones:

### 1. Variables Aleatorias (Box-Müller)
```
Z = sqrt(-2 * ln(R1)) * cos(2π * R2)
donde R1, R2 ~ U(0,1) → Z ~ N(0,1)
```

### 2. Tipo de Cambio
```
TC(t) = tc_base + tc_coef_z * Z(t) ± shock_tc
```

### 3. Ingresos por Exportaciones

#### Gas Natural (IDH + Regalías)
```
Volumen_gas(t) = gas_volumen_base + gas_volumen_coef_z * Z(t)
Precio_gas(t) = [gas_precio_base + gas_precio_coef_z * Z(t)] * (1 + shock_precio_gas/100)
Ingresos_brutos = Volumen_gas * Precio_gas * TC

IDH = Ingresos_brutos * 0.32      (Impuesto Directo a Hidrocarburos)
Regalías_gas = Ingresos_brutos * 0.18
```

#### Minerales (Zinc, Estaño, Oro, Plata, Litio)
```
Para cada mineral:
  Volumen(t) = volumen_base + volumen_coef_z * Z(t)
  Precio(t) = [precio_base + precio_coef_z * Z(t)] * (1 + shock_precio/100)
  Ingresos_brutos = Volumen * Precio * TC
  Regalías_minerales = Ingresos_brutos * 0.12  (12% regalías mineras)
```

### 4. Ingresos Tributarios
```
Cada impuesto:
  Impuesto(t) = impuesto_base + impuesto_coef_z * Z(t)

Impuestos implementados:
  - IVA (Impuesto al Valor Agregado)
  - IUE (Impuesto a las Utilidades de Empresas)
  - IT (Impuesto a las Transacciones)
  - RC-IVA (Régimen Complementario al IVA)
  - ICE (Impuesto a Consumos Específicos)
  - ITF (Impuesto a Transacciones Financieras)
  - GA (Gravamen Arancelario)

Ingresos_totales = Exportaciones + Tributarios + IDH + Regalías
```

### 5. Gastos del Estado
```
Gasto_corriente(t) = corriente_base + corriente_coef_z * Z(t)

# Subsidio a hidrocarburos (si activo)
Precio_importación = precio_base + precio_coef_z * Z(t)
Volumen_importación = volumen_base + volumen_coef_z * Z(t)
Subsidio_combustibles = (Precio_importación * TC - Precio_venta) * Volumen

# Subsidio a alimentos (si activo)
Subsidio_alimentos = subsidio_alimentos_base + subsidio_alimentos_coef_z * Z(t)

Gastos_totales = Gasto_corriente + Subsidios + Intereses
```

### 6. Déficit y Financiamiento
```
Déficit(t) = Gastos_totales(t) - Ingresos_totales(t)
Resultado_primario(t) = Déficit(t) + Intereses(t)

# Cálculo de intereses
Intereses_externa(t) = Deuda_externa(t-1) * tasa_interes_externa
Intereses_interna(t) = Deuda_interna(t-1) * tasa_interes_interna

# Financiamiento: 70% externo, 30% interno
Si Déficit > 0:
  Deuda_externa(t) = Deuda_externa(t-1) * (1 + tasa_externa) + 0.7 * Déficit
  Deuda_interna(t) = Deuda_interna(t-1) * (1 + tasa_interna) + 0.3 * Déficit
Si Superávit (Déficit < 0):
  Deuda_externa(t) = Deuda_externa(t-1) * (1 + tasa_externa) - 0.7 * |Déficit|
  Deuda_interna(t) = Deuda_interna(t-1) * (1 + tasa_interna) - 0.3 * |Déficit|
```

### 7. Reservas Internacionales (RIN)
```
Exportaciones_USD(t) = Exportaciones(t) / TC(t)
Importaciones_USD(t) = Importaciones(t) / TC(t)
Saldo_comercial(t) = Exportaciones_USD - Importaciones_USD

# Ajuste de RIN
Δ_RIN = 0.3 * Saldo_comercial - 0.5 * Intereses_externa / TC
RIN(t) = RIN(t-1) + Δ_RIN

# Meses de importación
RIN_meses = (RIN / Importaciones_USD) * 12
```

### 8. Indicadores de Sostenibilidad
```
Deuda_total = Deuda_externa + Deuda_interna
Deuda_PIB = (Deuda_total / PIB) * 100
Déficit_PIB = (|Déficit| / PIB) * 100
Presión_tributaria = (Ingresos_tributarios / PIB) * 100
Capacidad_pago = Ingresos_totales / Intereses_totales
```

### 9. Alertas Automáticas
```
- Deuda/PIB > 70%  → Riesgo de sostenibilidad fiscal
- Déficit/PIB > 5%  → Déficit excesivo según Maastricht
- RIN < 3 meses  → Reservas insuficientes según FMI
- Subsidios > Ingresos_gas  → Subsidios no sostenibles con ingresos propios
```

Para detalles completos del modelo, consultar:
- **Backend**: `back/simulator.py` y `back/fiscal_model.py`
- **Documentación técnica**: `explicacion.md`

## 🔌 API Endpoints

### `POST /api/simular`
Ejecuta una simulación Box-Müller única (1 trayectoria)

**Request:**
```json
{
  "anos": 6,
  "shock_precio_gas": -30,
  "shock_precio_oro": 0,
  "subsidio_combustibles_activo": true,
  ...
}
```

**Response:**
```json
{
  "resultados": [
    {
      "ano": 2020,
      "ingresos_totales": 15000,
      "gastos_totales": 18000,
      "deficit_superavit": -3000,
      ...
    },
    ...
  ],
  "pasos": [...]
}
```

### `POST /api/simular-monte-carlo`
Ejecuta simulación Monte Carlo con múltiples iteraciones

**Query Params:**
- `num_simulaciones`: 100-10,000 (default: 1000)

**Request:** Igual que `/api/simular`

**Response:**
```json
{
  "num_simulaciones": 1000,
  "resultados_estadisticos": [
    {
      "ano": 2020,
      "deficit_superavit": {
        "promedio": -5000,
        "mediana": -4800,
        "percentil_5": -2000,
        "percentil_95": -8500,
        "desviacion_estandar": 1200,
        ...
      },
      ...
    },
    ...
  ],
  "simulacion_representativa": [...],
  "metodo": "Monte Carlo con Box-Müller"
}
```

### `GET /api/parametros-default`
Obtiene parámetros por defecto basados en PGE 2020

### `GET /health`
Health check del backend

### `GET /docs`
Documentación interactiva Swagger UI

## 📝 Fuentes de Datos

El modelo se basa en fuentes oficiales del Estado Plurinacional de Bolivia:

- **Ministerio de Economía y Finanzas Públicas**: Presupuesto General del Estado (PGE) 2020-2025
- **Banco Central de Bolivia (BCB)**: Reportes de política monetaria, RIN, tipo de cambio
- **YPFB Corporación**: Estadísticas de exportación de hidrocarburos y precios del gas
- **AJAM/SERGEOMIN**: Datos de producción y exportación minera
- **SIN (Servicio de Impuestos Nacionales)**: Recaudación tributaria histórica
- **INE (Instituto Nacional de Estadística)**: PIB, inflación, índices macroeconómicos

## 👥 Guía de Uso Rápido

1. **Iniciar Backend**: `cd back && python main.py`
2. **Iniciar Frontend**: `npm run dev` (en otra terminal)
3. **Landing Page**: Revisar información del modelo y fuentes
4. **Parametrización**: 
   - Seleccionar método de simulación (Box-Müller único o Monte Carlo)
   - Elegir escenario predefinido o configurar parámetros manualmente
   - Ajustar shocks externos, impuestos, subsidios
5. **Simulación**: Ejecutar cálculo (100-500ms Box-Müller, 30-60s Monte Carlo)
6. **Dashboard**: 
   - Navegar año por año con controles temporales
   - Analizar gráficos y diagrama de relaciones
   - Revisar estadísticas Monte Carlo (percentiles P5, P50, P95)
7. **Exportación**: Descargar resultados en Excel o PDF

Para instrucciones detalladas, consultar:
- **INSTRUCCIONES.md**: Explicación de qué hace el simulador y cómo usarlo
- **INSTRUCCIONES_USO.md**: Tutorial paso a paso
- **explicacion.md**: Documentación técnica completa

## 🎓 Características Académicas

Este simulador fue desarrollado como herramienta académica avanzada para:

- **Análisis de política fiscal**: Evaluación de impacto de cambios tributarios y de gasto
- **Sostenibilidad de deuda**: Proyección de ratios Deuda/PIB bajo diferentes escenarios
- **Simulación de shocks externos**: Análisis de vulnerabilidad a precios de commodities
- **Análisis de sensibilidad**: Evaluación de políticas de subsidios y inversión pública
- **Análisis de riesgo**: Simulación Monte Carlo para distribuciones probabilísticas
- **Didáctica económica**: Visualización de relaciones macroeconómicas causa-efecto

## 🛠️ Tecnologías

### Backend
- **Python** 3.8+
- **FastAPI** 0.115+ (framework web moderno y rápido)
- **Pydantic** 2.10+ (validación de datos)
- **NumPy** 2.2+ (cálculos científicos)
- **Uvicorn** (servidor ASGI de alta performance)

### Frontend
- **Next.js** 16 (framework React con SSR)
- **React** 19 (biblioteca UI)
- **TypeScript** 5 (tipado estático)
- **Tailwind CSS** 4 (estilos utility-first)
- **Recharts** (visualización de datos)
- **jsPDF** + **jspdf-autotable** (exportación PDF)
- **XLSX** (exportación Excel)
- **shadcn/ui** (componentes UI modernos)
- **Lucide React** (iconos)
- **Framer Motion** (animaciones)

## 🤝 Contribuciones

Este es un proyecto académico. Para sugerencias o mejoras:
1. Revisar la documentación técnica en `explicacion.md`
2. Consultar las ecuaciones del modelo en `back/fiscal_model.py`
3. Proponer cambios con justificación económica

## 📄 Licencia

Proyecto académico para simulación fiscal del Estado Plurinacional de Bolivia.
Uso educativo y de investigación.

## 🔧 Troubleshooting

### El backend no inicia
- Verificar que Python 3.8+ esté instalado: `python --version`
- Instalar dependencias: `pip install -r back/requirements.txt`
- Verificar puerto 8000 disponible: `lsof -i :8000` (Mac/Linux) o `netstat -ano | findstr :8000` (Windows)

### El frontend no se conecta al backend
- Verificar que el backend esté corriendo en `http://localhost:8000`
- Probar endpoint de health: `curl http://localhost:8000/health`
- Revisar console del navegador para errores CORS

### Simulación Monte Carlo muy lenta
- Reducir número de simulaciones (100-500 para pruebas rápidas)
- Verificar recursos del sistema (CPU, RAM)
- Considerar usar Box-Müller único para análisis exploratorio rápido

### Errores de validación Pydantic
- Revisar que los parámetros estén en rangos válidos
- Consultar `back/schemas.py` para ver restricciones de cada campo
- Probar con parámetros por defecto: `GET /api/parametros-default`

## 📧 Soporte

Para consultas académicas o técnicas sobre el modelo, referirse a:
- Documentación técnica: `explicacion.md`
- Código fuente documentado en `back/fiscal_model.py`
- API interactiva: `http://localhost:8000/docs`
