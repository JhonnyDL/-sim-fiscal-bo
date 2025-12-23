"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Minimize2,
    Maximize2,
    GripVertical,
    Pin,
    PinOff,
} from "lucide-react"

const VERDE_BOLIVIA = "#007749"

interface ControlSimulacionFlotanteProps {
    resultados: any[]
    anoVisualizacion: number
    autoPlay: boolean
    toggleAutoPlay: () => void
    avanzarAno: () => void
    retrocederAno: () => void
    irAlAno: (ano: number) => void
}

export function ControlSimulacionFlotante({
    resultados,
    anoVisualizacion,
    autoPlay,
    toggleAutoPlay,
    avanzarAno,
    retrocederAno,
    irAlAno,
}: ControlSimulacionFlotanteProps) {
    const [isFloating, setIsFloating] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [position, setPosition] = useState({ x: 20, y: 20 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const controlRef = useRef<HTMLDivElement>(null)

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isFloating) return
        if ((e.target as HTMLElement).closest("button")) return
        setIsDragging(true)
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        })
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y

        // Keep within viewport bounds
        const maxX = window.innerWidth - (controlRef.current?.offsetWidth || 0)
        const maxY = window.innerHeight - (controlRef.current?.offsetHeight || 0)

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
            return () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
            }
        }
    }, [isDragging, dragStart])

    if (!resultados || resultados.length === 0) return null

    const controlContent = (
        <Card className={`border-2 gradient-bolivia ${isFloating ? "backdrop-blur-sm bg-white/95" : ""}`}>
            <CardContent className="p-4">
                {!isMinimized ? (
                    <div className="space-y-4">
                        {/* Header with drag handle, float toggle and minimize button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isFloating && <GripVertical className="h-5 w-5 text-gray-400" />}
                                <h3 className="text-xl font-bold">
                                    Año {resultados[anoVisualizacion].ano}
                                    <Badge className="ml-2 text-sm px-2 py-1" style={{ backgroundColor: VERDE_BOLIVIA }}>
                                        {anoVisualizacion + 1} / {resultados.length}
                                    </Badge>
                                </h3>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsFloating(!isFloating)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    title={isFloating ? "Fijar control (estático)" : "Hacer control flotante"}
                                >
                                    {isFloating ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsMinimized(true)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    title="Minimizar"
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Progress info */}
                        <p className="text-sm text-muted-foreground">
                            Avance: {Math.round(((anoVisualizacion + 1) / resultados.length) * 100)}% completado
                        </p>

                        {/* Control buttons */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    irAlAno(0)
                                }}
                                disabled={anoVisualizacion === 0}
                                variant="outline"
                                size="sm"
                                title="Ir al inicio"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    retrocederAno()
                                }}
                                disabled={anoVisualizacion === 0}
                                variant="outline"
                                size="sm"
                                title="Año anterior"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleAutoPlay()
                                }}
                                size="lg"
                                className="px-4"
                                style={{ backgroundColor: autoPlay ? "#EF4444" : VERDE_BOLIVIA }}
                            >
                                {autoPlay ? (
                                    <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pausar
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Simular
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    avanzarAno()
                                }}
                                disabled={anoVisualizacion === resultados.length - 1}
                                variant="outline"
                                size="sm"
                                title="Año siguiente"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    irAlAno(resultados.length - 1)
                                }}
                                disabled={anoVisualizacion === resultados.length - 1}
                                variant="outline"
                                size="sm"
                                title="Ir al final"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full transition-all duration-500 ease-out gradient-bolivia"
                                style={{ width: `${((anoVisualizacion + 1) / resultados.length) * 100}%` }}
                            />
                        </div>

                        {/* Key metrics */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                                <p className="text-xs text-green-700 font-medium">Ingresos</p>
                                <p className="text-sm font-bold text-green-900">
                                    Bs. {resultados[anoVisualizacion].ingresos_totales.toFixed(0)}M
                                </p>
                            </div>
                            <div className="bg-red-50 p-2 rounded-lg border border-red-200">
                                <p className="text-xs text-red-700 font-medium">Gastos</p>
                                <p className="text-sm font-bold text-red-900">
                                    Bs. {resultados[anoVisualizacion].gastos_totales.toFixed(0)}M
                                </p>
                            </div>
                            <div
                                className={`p-2 rounded-lg border ${resultados[anoVisualizacion].deficit_superavit > 0
                                    ? "bg-red-50 border-red-200"
                                    : "bg-green-50 border-green-200"
                                    }`}
                            >
                                <p
                                    className={`text-xs font-medium ${resultados[anoVisualizacion].deficit_superavit > 0 ? "text-red-700" : "text-green-700"
                                        }`}
                                >
                                    {resultados[anoVisualizacion].deficit_superavit > 0 ? "Déficit" : "Superávit"}
                                </p>
                                <p
                                    className={`text-sm font-bold ${resultados[anoVisualizacion].deficit_superavit > 0 ? "text-red-900" : "text-green-900"
                                        }`}
                                >
                                    Bs. {Math.abs(resultados[anoVisualizacion].deficit_superavit).toFixed(0)}M
                                </p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700 font-medium">RIN</p>
                                <p className="text-sm font-bold text-blue-900">Bs. {resultados[anoVisualizacion].rin.toFixed(0)}M</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Minimized view - only essential controls
                    <div className="flex items-center gap-2">
                        {isFloating && <GripVertical className="h-4 w-4 text-gray-400" />}
                        <Badge className="text-xs px-2 py-1" style={{ backgroundColor: VERDE_BOLIVIA }}>
                            Año {resultados[anoVisualizacion].ano}
                        </Badge>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                retrocederAno()
                            }}
                            disabled={anoVisualizacion === 0}
                            variant="outline"
                            size="sm"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleAutoPlay()
                            }}
                            size="sm"
                            className="px-3"
                            style={{ backgroundColor: autoPlay ? "#EF4444" : VERDE_BOLIVIA }}
                        >
                            {autoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                avanzarAno()
                            }}
                            disabled={anoVisualizacion === resultados.length - 1}
                            variant="outline"
                            size="sm"
                        >
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsMinimized(false)
                            }}
                            variant="ghost"
                            size="sm"
                            title="Expandir"
                        >
                            <Maximize2 className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )

    if (isFloating) {
        return (
            <div
                ref={controlRef}
                className="fixed z-50 shadow-2xl"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={handleMouseDown}
            >
                {controlContent}
            </div>
        )
    }

    // Modo estático (por defecto)
    return <div className="w-full">{controlContent}</div>
}
