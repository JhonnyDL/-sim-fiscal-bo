import math
import random
from typing import Tuple

def box_muller() -> float:
    """
    Implementación de la transformación Box-Müller para generar
    variables aleatorias con distribución normal estándar N(0,1)
    
    Formula: Z = sqrt(-2 * ln(R1)) * cos(2π * R2)
    
    Returns:
        float: Variable aleatoria con distribución N(0,1)
    """
    R1 = random.random()
    R2 = random.random()
    
    # Evitar ln(0)
    while R1 == 0:
        R1 = random.random()
    
    Z = math.sqrt(-2 * math.log(R1)) * math.cos(2 * math.pi * R2)
    return Z

def generar_normal(mu: float, sigma: float) -> float:
    """
    Genera variable aleatoria con distribución Normal(μ, σ)
    
    Formula: X ∈ Normal(μ, σ) = μ + σ*Z
    
    Args:
        mu: Media de la distribución
        sigma: Desviación estándar
        
    Returns:
        float: Variable aleatoria Normal(μ, σ)
    """
    Z = box_muller()
    return mu + sigma * Z

def aplicar_shock(valor: float, shock_pct: float = 0.0) -> float:
    """
    Aplica shock porcentual a un valor
    
    Args:
        valor: Valor base
        shock_pct: Porcentaje de shock (ej: 10 para +10%, -15 para -15%)
        
    Returns:
        float: Valor ajustado por shock
    """
    return valor * (1 + shock_pct / 100)

def aplicar_volatilidad_precios(precio_base: float, volatilidad_pct: float) -> float:
    """
    Aplica un cambio estocástico al precio usando volatilidad porcentual.
    precio_base: valor inicial
    volatilidad_pct: porcentaje de volatilidad (ej. 5 = ±5%)
    """
    cambio = precio_base * volatilidad_pct / 100
    return precio_base + random.uniform(-cambio, cambio)

def simular_shock(valor_base: float, shock_pct: float) -> float:
    """
    Aplica un shock simple porcentual al valor
    """
    return valor_base * (1 + shock_pct / 100)
