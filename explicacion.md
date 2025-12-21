# SIMULADOR FISCAL DINÁMICO DE BOLIVIA - DOCUMENTACIÓN COMPLETA

**Versión:** 1.0.0  
**Fecha:** Diciembre 2025  
**Descripción:** Herramienta web interactiva para simular la dinámica del sistema fiscal boliviano (2020-2025) bajo incertidumbre mediante modelos estocásticos DSGE.

---

## 📋 TABLA DE CONTENIDOS

1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Frontend (Next.js + React)](#frontend-nextjs--react)
4. [Backend (Python + FastAPI)](#backend-python--fastapi)
5. [Modelo Económico Fiscal](#modelo-económico-fiscal)
6. [Flujo de Datos](#flujo-de-datos)
7. [Componentes Principales](#componentes-principales)
8. [Parámetros y Configuración](#parámetros-y-configuración)
9. [Escenarios y Shocks](#escenarios-y-shocks)
10. [Guía de Uso](#guía-de-uso)
11. [Instalación y Ejecución](#instalación-y-ejecución)

---

## 🎯 VISIÓN GENERAL DEL PROYECTO

### Propósito
El **Simulador Fiscal de Bolivia** es una herramienta educativa y analítica que permite visualizar cómo las variables del **Presupuesto General del Estado (PGE)** boliviano se afectan entre sí a lo largo del tiempo, bajo diferentes escenarios económicos.

### Público Objetivo
- Analistas fiscales y economistas
- Tomadores de decisión en política fiscal
- Estudiantes de economía
- Instituciones de investigación económica

### Características Principales
✅ **Modelo estocástico dinámico** basado en relaciones causa-efecto  
✅ **Simulación multi-año** configurable (2-20 años)  
✅ **Análisis de sensibilidad** ante shocks económicos  
✅ **Visualizaciones interactivas** con gráficos detallados  
✅ **Descarga de resultados** en Excel y PDF  
✅ **Interfaz bilingüe** optimizada para España y Bolivia  

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Diagrama Conceptual
```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                            │
│                   (Cliente HTTP/REST)                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   FRONTEND: Next.js + React + TypeScript            │   │
│  │   ┌──────────────────────────────────────────────┐  │   │
│  │   │ Landing Page                                 │  │   │
│  │   │ - Explicación del modelo                     │  │   │
│  │   └──────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │   ┌──────────────────────────────────────────────┐  │   │
│  │   │ Editor de Parámetros                         │  │   │
│  │   │ - Entrada de valores iniciales               │  │   │
│  │   │ - Selección de escenarios de shock           │  │   │
│  │   └──────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │   ┌──────────────────────────────────────────────┐  │   │
│  │   │ Dashboard de Resultados                      │  │   │
│  │   │ - Tabla de resultados                        │  │   │
│  │   │ - Gráficos interactivos (Chart.js)           │  │   │
│  │   │ - Diagramas de relaciones                    │  │   │
│  │   │ - Exportación de datos                       │  │   │
│  │   └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP POST
            API REST (FastAPI - Puerto 8000)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND: PYTHON                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ FastAPI Application (main.py)                       │   │
│  │ - Rutas API: /api/simular, /api/parametros-default │   │
│  │ - Validación de datos con Pydantic                 │   │
│  │ - Middleware CORS para comunicación                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Simulador Fiscal (simulator.py)                     │   │
│  │ - Orquestación de simulación año por año           │   │
│  │ - Gestión de estado entre años                     │   │
│  │ - Generación de alertas e indicadores              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Modelo Fiscal (fiscal_model.py)                     │   │
│  │ - Cálculo de ingresos (commodities e impuestos)     │   │
│  │ - Cálculo de gastos (corrientes y subsidios)        │   │
│  │ - Cálculo de deuda y RIN                            │   │
│  │ - Indicadores fiscales                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Procesos Estocásticos (stochastic.py)               │   │
│  │ - Transformación Box-Müller para N(0,1)             │   │
│  │ - Generación de shocks aleatorios                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Esquemas de Datos (schemas.py)                      │   │
│  │ - ParametrosSimulacion (entrada)                    │   │
│  │ - ResultadoAnual (salida por año)                   │   │
│  │ - ResultadoSimulacion (salida completa)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Parámetros por Defecto (parameters.py)              │   │
│  │ - Valores iniciales del modelo                      │   │
│  │ - Escenarios de shocks predefinidos                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Frontend** | Next.js | 16.0.10 |
| | React | 19.2.0 |
| | TypeScript | Latest |
| | Tailwind CSS | 4.x |
| | Recharts | Latest |
| | Chart.js | 4.5.1 |
| **Backend** | Python | 3.8+ |
| | FastAPI | Latest |
| | Pydantic | Latest |
| | NumPy | (implícito) |
| **API** | HTTP/REST | - |
| | CORS | Habilitado |

---

## 💻 FRONTEND (Next.js + React)

### Estructura de Carpetas
```
app/
├── layout.tsx           # Layout principal con metadatos
├── page.tsx             # Página principal (dashboard)
├── globals.css          # Estilos globales
└── api/
    └── exportar/
        └── excel/
            └── route.ts # API route para exportación Excel

components/
├── landing-page.tsx                    # Página inicial explicativa
├── editor-parametros-avanzados.tsx     # Editor de parámetros
├── tabla-resultados.tsx                # Tabla interactiva de resultados
├── graficos-interactivos.tsx           # Gráficos con Chart.js
├── graficas-detalladas.tsx             # Gráficos con Recharts
├── diagrama-relaciones.tsx             # Diagrama causa-efecto
├── theme-provider.tsx                  # Proveedor de temas
└── ui/                                 # Componentes shadcn/ui
    ├── button.tsx
    ├── card.tsx
    ├── table.tsx
    ├── tabs.tsx
    ├── input.tsx
    ├── label.tsx
    ├── badge.tsx
    ├── select.tsx
    └── ... (50+ componentes UI)

lib/
├── api.ts              # Funciones para llamar al backend
├── types.ts            # Tipos TypeScript compartidos
└── utils.ts            # Utilidades generales

hooks/
├── use-mobile.ts       # Hook para detectar dispositivos móviles
└── use-toast.ts        # Hook para notificaciones toast

public/
└── escudo-bolivia.png  # Logo de Bolivia

styles/
└── globals.css         # Estilos CSS globales
```

### Componentes Principales del Frontend

#### 1. **landing-page.tsx**
**Responsabilidad:** Mostrar página inicial con explicación del modelo

**Características:**
- Explicación visual del sistema fiscal boliviano
- Descripción de relaciones causa-efecto
- Descripción de shocks económicos
- Botón para iniciar simulación

**Datos que consume:** Ninguno (componente estático)

---

#### 2. **editor-parametros-avanzados.tsx**
**Responsabilidad:** Interfaz para configurar parámetros de simulación

**Parámetros configurables:**
- **Temporales:** Años a simular (2-20)
- **Macroeconómicos:** 
  - PIB inicial, tasa de crecimiento
  - Deuda externa/interna inicial
  - Tasas de interés
  - RIN inicial
- **Commodities:** Precios y volúmenes base (gas, oro, zinc, estaño, plata, litio, plomo)
- **Tributarios:** Tasas y bases para cada impuesto
- **Gastos:** Gasto corriente, inversión, subsidios
- **Shocks:** Cambios porcentuales en precios y tipo de cambio

**Datos que consume:** 
- `PARAMETROS_MODELO_DEFAULT` (valores iniciales)
- `ESCENARIOS_SHOCKS` (escenarios predefinidos)

---

#### 3. **tabla-resultados.tsx**
**Responsabilidad:** Mostrar resultados en formato tabular

**Tablas mostradas:**
1. **Tabla principal:** Año, Ingresos, Gastos, Déficit, Deuda, Deuda/PIB%, RIN, PIB, Saldo Comercial
2. **Ingresos desagregados:** Por commodity e impuesto
3. **Gastos desagregados:** Por categoría

**Funcionalidades:**
- Scroll horizontal para muchas columnas
- Código de colores (verde/rojo para valores positivos/negativos)
- Badges de alerta (Deuda alta, RIN bajo)
- Botón para exportar a CSV

**Datos que consume:** 
- `resultados: ResultadoAnual[]`
- `anoActual?: number`

---

#### 4. **graficos-interactivos.tsx**
**Responsabilidad:** Visualizar datos con Chart.js

**Gráficos incluidos:**
1. **Evolución Fiscal:** Línea con Ingresos, Gastos, Déficit
2. **Deuda y Sostenibilidad:** Barras de Deuda + línea de Deuda/PIB
3. **Composición de Ingresos:** Dona del último año
4. **RIN y Sector Externo:** Línea dual con RIN y Saldo Comercial

**Características:**
- Tooltips informativos
- Leyendas interactivas
- Ejes Y duales cuando necesario
- Colores basados en bandera boliviana

**Datos que consume:** 
- `resultados: ResultadoAnual[]`
- `anoActual?: number`

---

#### 5. **graficas-detalladas.tsx**
**Responsabilidad:** Análisis detallado con Recharts

**Gráficos incluidos:**
1. **Composición de Exportaciones:** Pie por commodities
2. **Recaudación por Impuesto:** Barras
3. **Estructura de Gastos:** Pie
4. **Evolución Temporal:** Área apilada
5. **Evolución de Exportaciones:** Área apilada (Gas vs Minería)
6. **Indicadores de Sostenibilidad:** Línea múltiple
7. **Deuda y RIN:** Barras + línea
8. **Capacidad de Pago:** Área

**Datos que consume:** 
- `resultados: ResultadoAnual[]`
- `anoSeleccionado: number`

---

#### 6. **diagrama-relaciones.tsx**
**Responsabilidad:** Visualizar relaciones causa-efecto entre variables

**Niveles de relaciones mostrados:**
1. **Exportaciones → Ingresos Fiscales**
   - Gas → IDH + Regalías
   - Minerales → Regalías
2. **Recaudación Tributaria**
   - IVA, IUE, IT, ICE, ITF, etc.
3. **Balance Fiscal**
   - Ingresos vs Gastos
   - Gastos corrientes vs capital
4. **Déficit Fiscal → Deuda**
   - 70% financiamiento externo
   - 30% financiamiento interno
5. **Sector Externo → RIN**
   - Saldo comercial
   - Meses de importación cubiertos

**Datos que consume:** 
- `resultado: ResultadoAnual`
- `resultadoAnterior?: ResultadoAnual`

---

### Archivo: page.tsx (Página Principal)

**Responsabilidades:**
1. Gestión de estado global de la simulación
2. Orquestación entre componentes
3. Control de navegación entre pestañas
4. AutoPlay para visualizar año por año

**Estado gestiona:**
```typescript
- mostrarLanding: boolean          // Mostrar página inicial
- activeTab: string                // Pestaña activa
- parametros: ParametrosModelo     // Parámetros actuales
- resultados: ResultadoAnual[] | null
- pasos: PasoSimulacion[]
- simulando: boolean               // Flag durante simulación
- anoVisualizacion: number         // Año actual mostrado
- autoPlay: boolean                // AutoPlay activo
- velocidadAutoPlay: number        // Velocidad en ms
- escenarioSeleccionado: string | null
```

**Funciones principales:**
- `ejecutarSimulacion()` - Llama al backend con parámetros
- `resetear()` - Resetea toda la simulación
- `avanzarAno()` / `retrocederAno()` - Navegación temporal
- `aplicarEscenario()` - Aplica escenario predefinido
- `toggleAutoPlay()` - Activa/desactiva reproducción automática

**Pestañas disponibles:**
1. **Parametrización** - Editor de parámetros
2. **Dashboard** - Gráficos principales
3. **Tabla de Resultados** - Datos tabulares
4. **Gráficas Detalladas** - Análisis profundo
5. **Relaciones** - Diagrama causa-efecto

---

### Tipos TypeScript Principales (lib/types.ts)

```typescript
interface ParametrosSimulacion {
  anos: number
  pib_inicial: float
  crecimiento_pib: float
  deuda_externa_inicial: float
  deuda_interna_inicial: float
  tasa_interes_externa: float
  tasa_interes_interna: float
  rin_inicial: float
  
  // Commodities (precios y volúmenes)
  gas_volumen_base: float
  gas_precio_base: float
  // ... (más minerales)
  
  // Shocks
  shock_tc: float
  shock_precio_gas: float
  // ... (más shocks)
  
  // Flags de control
  subsidio_combustibles_activo: bool
}

interface ResultadoAnual {
  ano: number
  
  // Ingresos
  ing_gas: float
  ing_zinc: float
  // ... (más minerales)
  ing_impuestos_total: float
  ingresos_totales: float
  
  // Gastos
  gasto_sueldos: float
  gasto_inversion: float
  gasto_subsidio_combustibles: float
  gasto_subsidio_alimentos: float
  intereses_totales: float
  gastos_totales: float
  
  // Fiscales
  deficit_superavit: float
  deuda_total: float
  deuda_pib_ratio: float
  
  // Externos
  exportaciones: float
  importaciones: float
  saldo_comercial: float
  rin: float
  rin_meses_importacion: float
  
  // Indicadores
  pib: float
  deficit_pib_ratio: float
  presion_tributaria: float
  capacidad_pago: float
}

interface PasoSimulacion {
  paso: number
  descripcion: string
  ano: number
  impacto_en: string[]
}

interface ResultadoSimulacion {
  resultados: ResultadoAnual[]
  pasos: PasoSimulacion[]
}
```

---

## 🐍 BACKEND (Python + FastAPI)

### Estructura de Archivos

```
back/
├── main.py                 # Aplicación FastAPI principal
├── simulator.py            # Motor de simulación
├── fiscal_model.py         # Funciones de cálculo fiscal
├── schemas.py              # Esquemas Pydantic
├── parameters.py           # Parámetros por defecto
├── stochastic.py           # Procesos estocásticos
├── requirements.txt        # Dependencias Python
└── README.md               # Documentación backend
```

---

### 1. **main.py** - Aplicación FastAPI

**Responsabilidades:**
- Definir rutas API
- Validar entrada de datos
- Manejo de errores
- Configuración CORS

**Rutas definidas:**

| Ruta | Método | Descripción |
|------|--------|------------|
| `/` | GET | Información de la API |
| `/health` | GET | Verificación de salud |
| `/api/simular` | POST | Ejecuta simulación fiscal |
| `/api/parametros-default` | GET | Retorna parámetros por defecto |

**Endpoint principal - `/api/simular`:**
```python
@app.post("/api/simular", response_model=ResultadoSimulacion)
async def simular(parametros: ParametrosSimulacion):
    """Ejecuta simulación fiscal completa"""
    try:
        simulador = SimuladorFiscalBolivia(parametros)
        resultado = simulador.simular(parametros.anos)
        return resultado
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
```

---

### 2. **simulator.py** - Motor de Simulación

**Clase principal:** `SimuladorFiscalBolivia`

**Responsabilidades:**
- Orquestar simulación año por año
- Mantener estado entre años
- Registrar pasos de simulación
- Generar alertas

**Métodos principales:**

#### `__init__(parametros: ParametrosSimulacion)`
Inicializa el simulador con parámetros

#### `simular(anos: int) -> ResultadoSimulacion`
Ejecuta simulación completa para múltiples años

**Lógica:**
```
Para cada año (i = 0 hasta anos-1):
  1. Llamar a _simular_anio(i, estado_anterior)
  2. Guardar resultado en lista
  3. Usar resultado como estado_anterior para siguiente año

Retornar ResultadoSimulacion(resultados, pasos)
```

#### `_simular_anio(ano_numero, estado_anterior) -> ResultadoAnual`
Simula un año completo

**Pasos en cada simulación de año:**

1. **Calcular Ingresos**
   ```python
   ingresos = calcular_ingresos(parametros, estado_anterior)
   ```
   Retorna: Ingresos por exportaciones + tributarios

2. **Calcular Gastos**
   ```python
   gastos = calcular_gastos(parametros, estado_anterior, TC, Z)
   ```
   Retorna: Gasto corriente + subsidios + inversión

3. **Calcular Déficit y Deuda**
   ```python
   deficit_deuda = calcular_deficit_deuda(
       ingresos_totales, gastos_totales, 
       deuda_anterior, tasas_interes, exportaciones, rin_anterior, TC
   )
   ```
   Retorna: Déficit, Deuda actualizada, RIN actualizado

4. **Calcular PIB**
   ```python
   pib = pib_anterior * (1 + crecimiento_pib / 100)
   ```

5. **Calcular Indicadores**
   - Deuda/PIB %
   - Déficit/PIB %
   - RIN meses de importación
   - Presión tributaria %
   - Capacidad de pago

6. **Generar Alertas**
   - Si Deuda/PIB > 70%
   - Si Déficit/PIB > 5%
   - Si subsidios > ingresos de gas
   - Si RIN < 3 meses

7. **Construir ResultadoAnual** con todos los datos

---

### 3. **fiscal_model.py** - Cálculos Fiscales

**Funciones principales:**

#### `calcular_tipo_cambio(parametros, Z, shock_pct) -> float`
Calcula tipo de cambio estocástico

**Fórmula:**
$$TC = TC_{base} + TC_{coef\_z} \times Z \pm Shock\%$$

Donde:
- $TC_{base}$ ≈ 12.41 Bs/USD (tipo de cambio base)
- $Z$ ∼ N(0,1) variable aleatoria normal
- $TC_{coef\_z}$ coeficiente de sensibilidad

---

#### `calcular_ingresos_gas(parametros, Z, TC, shock_pct) -> Dict`
Calcula ingresos por gas natural

**Fórmula de volumen:**
$$V_g = V_{g,base} + V_{g,coef\_z} \times Z$$

**Fórmula de precio:**
$$P_g = P_{g,base} + P_{g,coef\_z} \times Z \pm Shock\%$$

**Ingresos brutos:**
$$I_{g,brutos} = V_g \times P_g \times TC$$

**Distribución:**
- **IDH (32%):** Para universidades y fondos universitarios
- **Regalías (18%):** Para gobierno nacional

**Retorna:**
```python
{
    'volumen': Vg,
    'precio_usd': Pg,
    'ingresos_brutos': Vg * Pg * TC,
    'idh': ingresos_brutos * 0.32,
    'regalias': ingresos_brutos * 0.18,
    'total': IDH + regalias
}
```

---

#### `calcular_ingresos_[oro|plata|zinc|estano|plomo](parametros, Z, TC, shock) -> Dict`
Similares a gas, pero con parámetros específicos por mineral

**Regalías:** 12% para todos los minerales

---

#### `calcular_ingresos_tributarios(parametros, Z, ing_gas_brutos) -> Dict`
Calcula todos los impuestos

**Impuestos calculados:**
| Impuesto | Fórmula | Descripción |
|----------|---------|------------|
| IVA MI | Base + coef_Z × Z | IVA Mercado Interno |
| IVA I | Base + coef_Z × Z | IVA Importaciones |
| IUE | Base + coef_Z × Z | Impuesto a Utilidades Empresariales |
| IT | Base + coef_Z × Z | Impuesto a Transacciones |
| ITF | Base + coef_Z × Z | Impuesto a Transacciones Financieras |
| ICE MI | Base + coef_Z × Z | Impuesto a Consumos Específicos MI |
| ICE I | Base + coef_Z × Z | Impuesto a Consumos Específicos I |
| RC-IVA | Base + coef_Z × Z | Recargas IVA |
| IJ | Base + coef_Z × Z | Impuesto a Judiciatura |
| GA | Base + coef_Z × Z | Gravamen Aduanal |
| IEHD | Base + coef_Z × Z | Impuesto a Estaciones Hidrocarburos Domésticos |

**Total Tributario:**
$$I_{Tributario} = \sum_{impuestos} Impuesto_i$$

---

#### `calcular_gastos(parametros, estado_anterior, TC, Z) -> Dict`
Calcula gastos fiscales

**Componentes:**

1. **Gasto Corriente**
   $$GC = GC_{base} + GC_{coef\_z} \times Z$$
   Incluye: Sueldos, bienes/servicios

2. **Subsidios de Hidrocarburos** (si activo)
   
   **Gasolina:**
   $$G_g = (P_{import,gasolina} \times TC - P_{venta,gasolina}) \times V_g$$
   
   **Diésel:**
   $$G_d = (P_{import,diesel} \times TC - P_{venta,diesel}) \times V_d$$
   
   **Total:**
   $$G_{HC} = G_g + G_d$$

3. **Subsidios a Alimentos**
   $$G_A = G_{A,base} + G_{A,coef\_z} \times Z$$

4. **Gasto Total**
   $$GT = GC + G_{HC} + G_A$$

**Retorna:**
```python
{
    'corriente': GC,
    'subsidio_gasolina': Gg,
    'subsidio_diesel': Gd,
    'subsidio_hidrocarburos': GHC,
    'subsidio_alimentos': GA,
    'total': GT
}
```

---

#### `calcular_deficit_deuda(...) -> Dict`
Calcula déficit fiscal y actualiza deuda

**Déficit Fiscal:**
$$Deficit = Ingresos_{totales} - Gastos_{totales}$$

(Positivo = déficit, Negativo = superávit)

**Intereses de Deuda:**
$$I_{externa} = Deuda_{externa(t-1)} \times TIE$$
$$I_{interna} = Deuda_{interna(t-1)} \times TII$$
$$I_{total} = I_{externa} + I_{interna}$$

**Financiamiento del Déficit:**
- 70% Deuda Externa
- 30% Deuda Interna

**Actualización de Deuda:**
$$Deuda_{externa}(t) = Deuda_{externa(t-1)} \times (1 + TIE) - Deficit_{financiado,externo}$$
$$Deuda_{interna}(t) = Deuda_{interna(t-1)} \times (1 + TII) - Deficit_{financiado,interno}$$

**Actualización de RIN:**
$$RIN(t) = RIN(t-1) + (Exportaciones / TC) \times 0.3 - Ajuste_{deficit}$$

**Retorna:**
```python
{
    'deficit': -deficit,  # Positivo = déficit
    'deuda_total': Deuda_externa + Deuda_interna,
    'deuda_externa': Deuda_externa,
    'deuda_interna': Deuda_interna,
    'intereses_externa': I_externa,
    'intereses_interna': I_interna,
    'intereses': I_total,
    'rin': RIN
}
```

---

### 4. **stochastic.py** - Procesos Estocásticos

**Función principal:** `box_muller() -> float`

**Descripción:** Genera variables aleatorias con distribución normal N(0,1)

**Algoritmo - Transformación Box-Müller:**
```
R1, R2 ~ Uniform(0, 1)
Z = sqrt(-2 * ln(R1)) * cos(2π * R2)
```

**Propiedades:**
- Distribución: Normal estándar N(0,1)
- Media: 0
- Desviación estándar: 1
- Evita singularidad en ln(0)

**Uso:**
```python
Z = box_muller()  # Valor estocástico
precio = precio_base + coef_z * Z  # Aplicar a precio
```

---

### 5. **schemas.py** - Esquemas Pydantic

Define la estructura de datos esperada y generada

**Esquemas principales:**

#### `ParametrosSimulacion`
Validación de entrada

**Validaciones:**
- `anos`: 1 ≤ anos ≤ 20
- Todos los valores numéricos ≥ 0
- Tasas de interés 0 ≤ tasa ≤ 100

#### `ResultadoAnual`
Estructura de salida por año

**Campos:** 30+ indicadores fiscales

#### `PasoSimulacion`
Registro del proceso año por año

#### `ResultadoSimulacion`
Salida completa con lista de años

---

### 6. **parameters.py** - Parámetros por Defecto

**Propósito:** Valores iniciales basados en datos reales de Bolivia 2020

**Parámetros macroeconómicos:**
```python
PARAMETROS_DEFAULT = {
    "anos": 6,
    "pib_inicial": 420000,        # millones de Bs (~$60B USD)
    "crecimiento_pib": 3.2,       # %
    "deuda_externa_inicial": 100000,
    "deuda_interna_inicial": 50000,
    "tasa_interes_externa": 4.3,  # %
    "tasa_interes_interna": 3.1,  # %
    "rin_inicial": 3500,          # millones USD
}
```

**Escenarios predefinidos:**

| Escenario | Descripción | Shocks |
|-----------|------------|--------|
| **Sin Shocks** | Caso base sin perturbaciones | Ninguno |
| **Caída de Commodities** | Crisis de precios (-30% gas, -25% minerales) | shock_precio_gas: -30 |
| **Auge de Commodities** | Boom de precios (+40%) | shock_precio_gas: +40 |
| **Devaluación** | Depreciación cambiaria (+15%) | shock_tc: +15 |
| **Crisis Combinada** | Caída commodities + devaluación | shock_tc: +20, shock_precio_gas: -25 |

---

## 📊 MODELO ECONÓMICO FISCAL

### Ecuaciones Fundamentales

#### 1. Identidad Fundamental
$$Ingresos = Gastos + Cambio\_Deuda$$

#### 2. Ingresos Fiscales
$$I_{total} = I_{exportaciones} + I_{tributarios}$$

**Donde:**
$$I_{exportaciones} = I_{gas} + I_{mineria} = \sum_{commodities} I_i$$
$$I_{tributarios} = \sum_{impuestos} I_j$$

#### 3. Gastos Fiscales
$$G_{total} = G_{corriente} + G_{subsidios} + G_{inversión}$$

#### 4. Déficit Fiscal
$$Deficit = G_{total} - I_{total}$$

#### 5. Restricción de Deuda
$$Deuda(t) = Deuda(t-1) \times (1 + i) + Deficit(t)$$

**Donde:**
- $i$ = tasa de interés promedio
- Deuda se divide en: Externa (70%) e Interna (30%)

#### 6. Reservas Internacionales (RIN)
$$RIN(t) = RIN(t-1) + Exportaciones\_USD - Importaciones\_USD - Servicio\_Deuda\_Externa$$

#### 7. Indicadores Clave

**Deuda/PIB:**
$$Ratio_{Deuda/PIB} = \frac{Deuda(t)}{PIB(t)} \times 100$$
- Umbral prudencial: < 70%
- Crítico: > 90%

**Déficit/PIB:**
$$Ratio_{Deficit/PIB} = \frac{Deficit(t)}{PIB(t)} \times 100$$
- Objetivo: < 3%
- Alerta: > 5%

**Cobertura de Importaciones (RIN):**
$$Meses_{Importacion} = \frac{RIN(t)}{Importaciones\_mensuales\_USD}$$
- Objetivo: > 6 meses
- Mínimo: > 3 meses

**Capacidad de Pago:**
$$Capacidad = \frac{Ingresos_{totales}}{Intereses\_deuda}$$
- Saludable: > 2.0x
- Crítico: < 1.5x

---

## 🔄 FLUJO DE DATOS

### Secuencia de una Simulación

```
Usuario en Frontend
        ↓
[Editor de Parámetros]
   - Configura valores
   - Selecciona escenario
        ↓
[POST /api/simular]
   JSON: ParametrosSimulacion
        ↓
Backend (FastAPI)
   1. Valida con Pydantic
   2. Crea SimuladorFiscalBolivia
   3. Llama simular(anos)
        ↓
[Simulación Año 1]
   - box_muller() → Z = 0.45
   - calcular_tipo_cambio(Z) → TC = 12.8
   - calcular_ingresos_gas(Z) → ing_gas = 8,500M
   - calcular_ingresos_tributarios(Z) → ing_trib = 12,000M
   - ingresos_totales = 20,500M
   - calcular_gastos(Z) → gastos_totales = 21,000M
   - calcular_deficit_deuda(...) → deficit = 500M, deuda = 150,500M
   - Calcula indicadores: deuda_pib = 35.8%, etc.
   - Crea ResultadoAnual
        ↓
[Simulación Año 2]
   - Usa estado anterior
   - Repite proceso
   - Genera nuevo ResultadoAnual
        ↓
[... Simulación Años 3-6]
        ↓
[Resultado JSON]
ResultadoSimulacion {
   resultados: [ResultadoAnual, ...],  // 6 años
   pasos: [PasoSimulacion, ...]
}
        ↓
[HTTP 200 + JSON Response]
        ↓
Frontend
[Procesa resultados]
   - Almacena en estado de React
   - Actualiza componentes
        ↓
[Renderiza Dashboard]
   - Tabla de resultados
   - Gráficos interactivos
   - Diagramas de relaciones
        ↓
Usuario visualiza:
   ✓ Evolución fiscal 2020-2025
   ✓ Trayectoria de deuda
   ✓ RIN disponible
   ✓ Alertas de riesgo
```

---

## 🎨 COMPONENTES PRINCIPALES

### Flujo Interactivo en Frontend

```
Landing Page
    ↓ [Iniciar] ↓
Editor Parámetros Avanzados ← Escenarios predefinidos
    ↓ [Simular] ↓
                ← POST → Backend Python
                ← JSON respuesta ←
                ↓
            Dashboard (4 pestañas)
            
    1. Gráficos Interactivos
       - Evolución fiscal
       - Deuda y sostenibilidad
       - Composición ingresos
       - RIN y sector externo
       
    2. Tabla de Resultados
       - Desagregación por año
       - Ingresos por commodity
       - Gastos por categoría
       - Exportar CSV/Excel
       
    3. Gráficas Detalladas
       - Pie charts de composición
       - Bar charts por impuesto
       - Área stacked de tendencias
       - Series temporales
       
    4. Diagrama Relaciones
       - Exportaciones → Ingresos
       - Impuestos desagregados
       - Balance fiscal
       - Déficit → Deuda
       - Sector externo → RIN
```

---

## ⚙️ PARÁMETROS Y CONFIGURACIÓN

### Categorías de Parámetros

#### 1. **Temporales**
- `anos`: Número de años a simular (2-20)

#### 2. **Macroeconómicos**
- `pib_inicial`: PIB en millones de Bs (e.g., 420,000)
- `crecimiento_pib`: Tasa anual (e.g., 3.2%)
- `deuda_externa_inicial`: Millones de Bs
- `deuda_interna_inicial`: Millones de Bs
- `tasa_interes_externa`: Porcentaje anual
- `tasa_interes_interna`: Porcentaje anual
- `rin_inicial`: Millones USD

#### 3. **Commodities** (precios y volúmenes)
Para cada commodity (Gas, Oro, Plata, Zinc, Estaño, Plomo):
- `{commodity}_volumen_base`: Volumen base
- `{commodity}_volumen_coef_z`: Coeficiente de volatilidad en volumen
- `{commodity}_precio_base`: Precio base USD
- `{commodity}_precio_coef_z`: Coeficiente de volatilidad en precio
- `{commodity}_tasa_regalias`: % de royalties

#### 4. **Impuestos**
Para cada impuesto (IVA, IUE, IT, ICE, etc.):
- `{impuesto}_base`: Recaudación base
- `{impuesto}_coef_z`: Coeficiente estocástico

#### 5. **Gastos**
- `corriente_base`: Gasto corriente base
- `corriente_coef_z`: Volatilidad gasto corriente
- `subsidio_alimentos_base`: Subsidio a alimentos base
- `subsidio_alimentos_coef_z`: Volatilidad
- `subsidio_combustibles_activo`: Activa/desactiva subsidios

#### 6. **Shocks (Perturbaciones)**
- `shock_tc`: Shock tipo de cambio (%)
- `shock_precio_gas`: Shock precio gas (%)
- `shock_precio_oro`: Shock precio oro (%)
- `shock_precio_plata`: Shock precio plata (%)
- `shock_precio_zinc`: Shock precio zinc (%)
- `shock_precio_estano`: Shock precio estaño (%)
- `shock_precio_plomo`: Shock precio plomo (%)

---

## 🌩️ ESCENARIOS Y SHOCKS

### Escenarios Predefinidos

#### 1. **Sin Shocks** (Caso Base)
**Descripción:** Simulación con valores base sin perturbaciones

**Shocks:** Ninguno
```python
shock_tc = 0%
shock_precio_gas = 0%
shock_precio_oro = 0%
# ... todos en 0%
```

**Interpretación:**
- Condiciones económicas normales
- Volatilidad estocástica normal (Z ~ N(0,1))
- Baseline para comparación

---

#### 2. **Caída de Commodities**
**Descripción:** Crisis de precios en recursos naturales

**Shocks:**
```python
shock_precio_gas: -30%
shock_precio_oro: -25%
shock_precio_plata: -25%
shock_precio_zinc: -30%
shock_precio_estano: -30%
shock_precio_plomo: -30%
```

**Impacto esperado:**
- ⬇️ Ingresos por exportaciones (-30%)
- ⬇️ Ingresos fiscales totales (-15%)
- ⬆️ Déficit fiscal (300-400M)
- ⬆️ Deuda/PIB (+5%)
- ⬇️ RIN (reducción del fondo)

**Contexto histórico:**
- Similar a 2014-2015 en Bolivia
- Precios internacionales en mínimos

---

#### 3. **Auge de Commodities**
**Descripción:** Boom de precios en mercados internacionales

**Shocks:**
```python
shock_precio_gas: +40%
shock_precio_oro: +35%
shock_precio_plata: +35%
shock_precio_zinc: +40%
shock_precio_estano: +40%
shock_precio_plomo: +40%
```

**Impacto esperado:**
- ⬆️ Ingresos por exportaciones (+40%)
- ⬆️ Ingresos fiscales totales (+25%)
- ⬇️ Déficit fiscal (-500M) o superávit
- ⬇️ Deuda/PIB (-5%)
- ⬆️ RIN (acumulación)

**Contexto histórico:**
- Similar a 2006-2010 en Bolivia
- Demanda alta de materias primas

---

#### 4. **Devaluación Cambiaria**
**Descripción:** Depreciación del tipo de cambio

**Shocks:**
```python
shock_tc: +15%
```

**Impacto esperado:**
- Bs/USD aumenta de 12.4 a ~14.3
- ⬆️ Precios de importaciones en Bs
- ⬆️ Subsidios a combustibles/alimentos
- ⬆️ Gastos en Bs
- Ingresos en Bs suben pero impacto menor

**Contexto histórico:**
- Similar a 2019-2020
- Salida de divisas

---

#### 5. **Crisis Combinada**
**Descripción:** Múltiples shocks simultáneos (peor escenario)

**Shocks:**
```python
shock_tc: +20%
shock_precio_gas: -25%
shock_precio_oro: -20%
shock_precio_plata: -20%
shock_precio_zinc: -25%
shock_precio_estano: -25%
shock_precio_plomo: -25%
```

**Impacto esperado:**
- ⬇️ Ingresos fuerte (-40%)
- ⬆️ Gastos +subsidios (+25%)
- Déficit fiscal > 1,000M
- Deuda/PIB +10%
- RIN crítico

**Contexto histórico:**
- Similar a 2014-2015 con presión cambiaria
- Riesgo sistémico

---

## 📖 GUÍA DE USO

### Para el Usuario

#### Paso 1: Acceder a la Aplicación
```
URL: http://localhost:3000
```

#### Paso 2: Ver Landing Page
- Lee explicación del modelo
- Entiende relaciones causa-efecto
- Haz clic en "Iniciar Simulación"

#### Paso 3: Configurar Parámetros
**Opción A - Usar Escenario Predefinido:**
1. Haz clic en "Escenarios"
2. Selecciona: "Caída de Commodities", "Devaluación", etc.
3. Parámetros se actualizan automáticamente

**Opción B - Configuración Manual:**
1. En pestaña "Parametrización"
2. Sección "Macroeconomía": Configura PIB, deuda, RIN
3. Sección "Commodities": Ajusta precios/volúmenes
4. Sección "Impuestos": Modifica tasas
5. Sección "Gastos": Ajusta gasto corriente
6. Sección "Shocks": Añade perturbaciones

#### Paso 4: Ejecutar Simulación
1. Haz clic en botón "▶️ SIMULAR"
2. Espera mientras se calcula (10-30 segundos)
3. Dashboard se carga automáticamente

#### Paso 5: Analizar Resultados
**En "Gráficos Interactivos":**
- Visualiza evolución fiscal 2020-2025
- Haz hover para ver valores exactos
- Usa leyenda para mostrar/ocultar series

**En "Tabla de Resultados":**
- Desplázate para ver todos los indicadores
- Observa badges de alerta (Deuda ALTO, RIN BAJO)
- Exporta datos a CSV

**En "Gráficas Detalladas":**
- Analiza composición de ingresos
- Compara estructura de gastos
- Observa tendencias de sostenibilidad

**En "Relaciones Causa-Efecto":**
- Sigue flujo: Exportaciones → Ingresos → Gastos → Déficit → Deuda
- Comprende impacto de cada variable
- Identifica puntos de ruptura

#### Paso 6: Comparar Escenarios
1. Resetea simulación
2. Aplica escenario diferente
3. Ejecuta nueva simulación
4. Compara resultados mentalmente

#### Paso 7: Descargar Resultados
- Botón "📥 Exportar CSV" en tabla
- Datos listos para Excel/análisis

---

## 🚀 INSTALACIÓN Y EJECUCIÓN

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm o yarn

### Backend Setup

#### 1. Instalación de dependencias
```bash
cd back
pip install -r requirements.txt
```

**requirements.txt contiene:**
```
fastapi==0.104.0
uvicorn==0.24.0
pydantic==2.4.0
python-multipart==0.0.6
```

#### 2. Ejecutar servidor
```bash
python main.py
```

**Salida esperada:**
```
INFO:     Started server process [1234]
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

#### 3. Verificar salud
```bash
curl http://localhost:8000/health
# Respuesta: {"status": "healthy"}
```

#### 4. Ver documentación API
```
http://localhost:8000/docs  # Swagger UI
http://localhost:8000/redoc # ReDoc
```

---

### Frontend Setup

#### 1. Instalación de dependencias
```bash
npm install
```

#### 2. Configurar variable de entorno
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3. Ejecutar en desarrollo
```bash
npm run dev
```

**Salida esperada:**
```
> next dev
- Local:        http://localhost:3000
- Optimized:   http://localhost:3001 (opcional)
```

#### 4. Acceder a la aplicación
```
http://localhost:3000
```

---

### Troubleshooting

| Problema | Solución |
|----------|----------|
| Error 500 en simulación | Verificar que backend esté corriendo en puerto 8000 |
| CORS error | Verificar `allow_origins` en main.py |
| Importación fallida en Python | Revisar `requirements.txt` y reinstalar |
| Puerto 3000 ocupado | `lsof -i :3000` y matar proceso |
| Módulo no encontrado | `pip install -r requirements.txt` desde carpeta `back` |

---

## 📈 INDICADORES CLAVE

| Indicador | Fórmula | Umbral Saludable | Alerta |
|-----------|---------|------------------|--------|
| **Déficit/PIB** | Déficit / PIB × 100 | < 3% | > 5% |
| **Deuda/PIB** | Deuda / PIB × 100 | < 60% | > 70% |
| **RIN (meses)** | RIN / (Imp mensuales) | > 6 meses | < 3 meses |
| **Presión Tributaria** | Impuestos / PIB × 100 | 15-20% | < 15% |
| **Capacidad de Pago** | Ingresos / Intereses | > 2.0x | < 1.5x |
| **Saldo Comercial** | Exp - Imp | > 0 | < -500M |

---

## 🔐 Validaciones y Restricciones

### Frontend
- Años: 2-20
- Todos los valores numéricos ≥ 0
- Porcentajes: -100 a +100

### Backend
- Validación Pydantic en todos los endpoints
- RIN no puede ser negativo
- Deuda se actualiza según fórmula estricta

---

## 📚 Referencias Académicas

El modelo se basa en:
- **Teoría DSGE (Dynamic Stochastic General Equilibrium)**
- **Procesos de Wiener** para modelar volatilidad
- **Ecuaciones de diferencia finita** para dinámicas anuales
- **Datos reales del PGE de Bolivia 2020**

---

## 👥 Equipo de Desarrollo

Versión 1.0.0 - Diciembre 2025

---

## 📞 Soporte y Contacto

Para reportar bugs o sugerencias:
- Revisar logs en backend: `uvicorn logs`
- Verificar console en DevTools (F12) en frontend
- Checks de validación: endpoint `/api/parametros-default`

---

**Fin de la Documentación Completa**
