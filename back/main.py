from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import ParametrosSimulacion, ResultadoSimulacion
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

@app.get("/api/parametros-default")
def obtener_parametros_default():
    """Retorna los parámetros por defecto basados en PGE Bolivia 2020"""
    from parameters import PARAMETROS_DEFAULT
    return PARAMETROS_DEFAULT

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
