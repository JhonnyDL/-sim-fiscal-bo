from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import ParametrosSimulacion, ResultadoSimulacion, ResultadoMonteCarloComplete
from simulator import SimuladorFiscalBolivia
import uvicorn

app = FastAPI(
    title="Simulador Fiscal Boliviano API",
    description="Backend de simulación fiscal con Python para cálculos precisos y eficientes",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Simulador Fiscal Boliviano API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/simular", response_model=ResultadoSimulacion)
async def simular(parametros: ParametrosSimulacion):
    """
    Ejecuta una simulación fiscal completa con los parámetros proporcionados
    
    Args:
        parametros: Objeto ParametrosSimulacion con todos los parámetros de entrada
        
    Returns:
        ResultadoSimulacion: Resultados año por año y pasos de simulación
    """
    try:
        # Crear simulador con los parámetros
        simulador = SimuladorFiscalBolivia(parametros)
        
        # Ejecutar simulación
        resultado = simulador.simular(parametros.anos)
        
        return resultado
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la simulación: {str(e)}")

@app.post("/api/simular-monte-carlo")
async def simular_monte_carlo(parametros: ParametrosSimulacion, num_simulaciones: int = 1000):
    """
    Ejecuta simulación Monte Carlo con múltiples iteraciones para obtener distribuciones de probabilidad
    
    Args:
        parametros: Objeto ParametrosSimulacion con todos los parámetros de entrada
        num_simulaciones: Número de simulaciones a ejecutar (default: 1000)
        
    Returns:
        ResultadoMonteCarloComplete: Estadísticas y distribuciones de resultados
    """
    try:
        # Validar número de simulaciones
        if num_simulaciones < 100:
            raise HTTPException(status_code=400, detail="El número mínimo de simulaciones es 100")
        if num_simulaciones > 10000:
            raise HTTPException(status_code=400, detail="El número máximo de simulaciones es 10000")
        
        # Crear simulador con los parámetros
        simulador = SimuladorFiscalBolivia(parametros)
        
        # Ejecutar simulación Monte Carlo
        resultado = simulador.simular_monte_carlo(parametros.anos, num_simulaciones)
        
        return resultado
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la simulación Monte Carlo: {str(e)}")

@app.get("/api/parametros-default")
def obtener_parametros_default():
    """Retorna los parámetros por defecto basados en PGE Bolivia 2020"""
    from parameters import PARAMETROS_DEFAULT
    return PARAMETROS_DEFAULT

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
