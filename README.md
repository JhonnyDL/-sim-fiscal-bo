# Simulación Fiscal del Estado Plurinacional de Bolivia

Herramienta Web Interactiva y Adaptativa para simular la dinámica del sistema fiscal boliviano (2020-2025) bajo incertidumbre.

## 🏗️ Arquitectura

### Backend (Python + FastAPI)
- **Motor de simulación**: Python con cálculos científicos precisos
- **API REST**: FastAPI con validación automática de datos
- **Modelos estocásticos**: Procesos estocásticos y volatilidad de precios
- **Documentación**: Swagger UI automática en `/docs`

### Frontend (Next.js + React)
- **Interfaz intuitiva**: Next.js 16 con React 19
- **Visualización**: Recharts para gráficos interactivos
- **Comunicación API**: Llamadas asíncronas al backend Python
- **UI moderna**: Tailwind CSS + shadcn/ui

## 🎯 Requisitos Funcionales Implementados

### ✅ RF1: Módulo de Configuración de Parámetros Iniciales
- ✅ Configuración de deuda inicial (Interna/Externa)
- ✅ RIN inicial
- ✅ Tasas de crecimiento base del PIB
- ✅ Tasa de interés promedio de la deuda externa

### ✅ RF2: Generación de Shocks Estocásticos
- ✅ Simulación de precios internacionales de commodities (Gas, Minerales)
- ✅ Proceso Estocástico para generar trayectorias variables en el tiempo
- ✅ Configuración de volatilidad por commodity
- ✅ Implementación en Python para mayor precisión

### ✅ RF3: Simulación de Escenarios Fiscales
- ✅ Sistema de ecuaciones del modelo fiscal completo
- ✅ Horizonte de tiempo configurable (default: 6 años, máximo: 20 años)
- ✅ Cálculo paso a paso con relaciones causa-efecto
- ✅ Motor Python optimizado para cálculos complejos

### ✅ RF4: Análisis de Sensibilidad de Subsidios
- ✅ Configuración de % de reducción del subsidio a combustibles
- ✅ Configuración de % de reducción del subsidio a alimentos
- ✅ Impacto directo en Gasto Corriente y Déficit Fiscal
- ✅ Visualización comparativa de escenarios

### ✅ RF5: Visualización de Resultados (Dashboard)
- ✅ Gráficos dinámicos de series de tiempo
- ✅ Trayectoria de Deuda Pública Total y ratio Deuda/PIB
- ✅ Evolución de las RIN
- ✅ Distribución probabilística del Déficit Fiscal
- ✅ Comparación de ingresos vs gastos
- ✅ Análisis del sector externo (exportaciones, importaciones, saldo comercial)
- ✅ Navegación año por año con controles interactivos

### ✅ RF6: Descarga de Datos
- ✅ Exportación a Excel (XLSX)
- ✅ Exportación a PDF con gráficos

## 📊 Requisitos No Funcionales Implementados

### ✅ RNF1: Rendimiento
- ✅ Motor Python ejecuta simulaciones complejas eficientemente
- ✅ Interfaz responsiva con feedback visual durante cálculos
- ✅ API REST de alta performance con FastAPI

### ✅ RNF2: Soporte Tecnológico
- ✅ Backend Python con FastAPI y NumPy
- ✅ Frontend Next.js con TypeScript
- ✅ Comunicación asíncrona via API REST

### ✅ RNF3: Usabilidad
- ✅ Diseño intuitivo con navegación por pestañas
- ✅ Landing page explicativa con información del modelo
- ✅ Parametrización clara y organizada
- ✅ Gráficos interactivos con tooltips informativos
- ✅ Colores de la bandera boliviana en la UI

### ✅ RNF4: Documentación
- ✅ Código backend documentado con docstrings
- ✅ Código frontend con comentarios explicativos
- ✅ README completo con instrucciones
- ✅ Swagger UI automática para API

## 🚀 Requisitos del Sistema

### Backend
- Python 3.8+
- pip

### Frontend
- Node.js 18+
- npm o yarn

## 📦 Instalación

### Backend (Python)
```bash
cd back
pip install -r requirements.txt
```

### Frontend (Next.js)
```bash
npm install
```

## 💻 Ejecución

### 1. Iniciar Backend (Puerto 8000)
```bash
cd back
python main.py
```

El backend estará disponible en `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Iniciar Frontend (Puerto 3000)
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📂 Estructura del Proyecto

```
├── back/                         # Backend Python
│   ├── main.py                   # API FastAPI
│   ├── simulator.py              # Motor de simulación
│   ├── fiscal_model.py           # Ecuaciones fiscales
│   ├── stochastic.py             # Procesos estocásticos
│   ├── schemas.py                # Modelos Pydantic
│   ├── parameters.py             # Parámetros por defecto
│   └── requirements.txt          # Dependencias Python
│
├── app/                          # Frontend Next.js
│   ├── page.tsx                  # Página principal
│   ├── layout.tsx                # Layout
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes React
│   ├── tabla-resultados.tsx      # Tabla de resultados
│   ├── graficos-interactivos.tsx # Gráficos Recharts
│   ├── graficas-detalladas.tsx   # Gráficas por categoría
│   ├── diagrama-relaciones.tsx   # Diagrama causa-efecto
│   ├── landing-page.tsx          # Landing page
│   └── ui/                       # Componentes shadcn/ui
│
└── lib/
    ├── api.ts                    # Cliente API
    └── utils.ts                  # Utilidades
```

## 📊 Modelo Matemático Implementado

El simulador implementa un modelo estocástico dinámico basado en las siguientes ecuaciones:

### 1. Evolución del PIB
```
PIB(t) = PIB(t-1) × (1 + g) + Contribución_inversión + Contribución_exportaciones
```

### 2. Ingresos por Exportaciones (con volatilidad estocástica)
```
P_gas(t) = P_base × (1 + ε)  donde ε ~ U(-5%, +5%)
Ingresos_gas = P_gas × Volumen × 0.50  (IDH 32% + Regalías 18%)
Ingresos_minerales = P_mineral × Volumen × 0.05  (Regalías 5%)
```

### 3. Déficit Fiscal
```
Déficit(t) = Gastos_totales(t) - Ingresos_totales(t)
Resultado_primario(t) = Déficit(t) + Intereses(t)
```

### 4. Dinámica de Deuda
```
Deuda(t+1) = Deuda(t) + Déficit(t)
  Si Déficit > 0: +60% externa, +40% interna
  Si Superávit: -60% externa, -40% interna
```

### 5. Reservas Internacionales
```
RIN(t+1) = RIN(t) + 0.3×Saldo_comercial(t) - 0.5×Intereses_externa(t)
RIN_meses = (RIN / Importaciones) × 12
```

### 6. Indicadores de Sostenibilidad
```
Deuda/PIB = (Deuda_total / PIB) × 100
Déficit/PIB = (Déficit / PIB) × 100
Presión_tributaria = (Impuestos / PIB) × 100
Capacidad_pago = Ingresos_totales / Intereses_totales
```

Para más detalles matemáticos, consulte:
- Backend: `back/simulator.py` y `back/fiscal_model.py`
- Frontend: `lib/api.ts`

## 🔌 API Endpoints

### `POST /api/simular`
Ejecuta una simulación fiscal completa

**Request Body:**
```json
{
  "anos": 6,
  "precio_gas": 4.2,
  "volumen_gas": 2800,
  "precio_zinc": 2850,
  ...
}
```

**Response:**
```json
{
  "resultados": [...],
  "pasos": [...]
}
```

### `GET /api/parametros-default`
Obtiene los parámetros por defecto basados en PGE 2020

### `GET /health`
Verifica el estado del backend

## 📝 Fuentes de Datos

El modelo se basa en:
- **Ministerio de Economía y Finanzas Públicas**: PGE 2020-2025
- **Banco Central de Bolivia**: Reportes de política monetaria
- **YPFB**: Estadísticas de exportación de hidrocarburos
- **AJAM/SERGEOMIN**: Datos de producción minera
- **SIN**: Recaudación tributaria

## 👥 Uso

1. **Iniciar Backend**: Ejecutar servidor Python con `python back/main.py`
2. **Iniciar Frontend**: Ejecutar Next.js con `npm run dev`
3. **Landing Page**: Revisar información del modelo
4. **Configuración**: Ajustar parámetros iniciales, commodities, impuestos, gastos
5. **Simulación**: Ejecutar simulación con backend Python
6. **Resultados**: Analizar gráficos interactivos año por año
7. **Exportación**: Descargar datos en Excel o PDF

## 🎓 Características Académicas

Este simulador fue desarrollado como herramienta académica para:
- Análisis de política fiscal
- Evaluación de sostenibilidad de deuda
- Simulación de shocks externos
- Análisis de sensibilidad de políticas públicas

## 🛠️ Tecnologías

### Backend
- Python 3.8+
- FastAPI 0.115+
- Pydantic 2.10+
- NumPy 2.2+
- Uvicorn (ASGI server)

### Frontend
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Recharts
- jsPDF + autoTable
- shadcn/ui

## 📄 Licencia

Proyecto académico para simulación fiscal del Estado Plurinacional de Bolivia.
