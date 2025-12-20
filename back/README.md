# Backend - Simulador Fiscal Boliviano

Backend en Python con FastAPI para simulaciones fiscales precisas y eficientes.

## Características

- **FastAPI**: API REST de alto rendimiento
- **Cálculos precisos**: Python para simulaciones numéricas complejas
- **Modelos validados**: Pydantic para validación de datos
- **Simulación estocástica**: Volatilidad y shocks económicos
- **Documentación automática**: Swagger UI en `/docs`

## Instalación

```bash
cd back
pip install -r requirements.txt
```

## Ejecutar servidor

```bash
# Desarrollo
python main.py

# Producción
uvicorn main:app --host 0.0.0.0 --port 8000
```

El servidor estará disponible en `http://localhost:8000`

## Endpoints

- `GET /` - Información de la API
- `GET /health` - Health check
- `GET /api/parametros-default` - Parámetros por defecto
- `POST /api/simular` - Ejecutar simulación fiscal

## Documentación

Swagger UI: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

## Estructura

- `main.py` - Aplicación FastAPI y endpoints
- `simulator.py` - Motor de simulación fiscal
- `fiscal_model.py` - Ecuaciones fiscales y cálculos
- `stochastic.py` - Procesos estocásticos y shocks
- `schemas.py` - Modelos Pydantic (input/output)
- `parameters.py` - Parámetros por defecto (PGE 2020)
