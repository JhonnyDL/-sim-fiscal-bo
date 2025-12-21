"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Database, TrendingUp, DollarSign, Building2, ArrowRight, Activity, TrendingDown, ChevronDown } from "lucide-react"

const ROJO_BOLIVIA = "#DA291C"
const AMARILLO_BOLIVIA = "#FCD116"
const VERDE_BOLIVIA = "#007A3D"

// 1. Fondo Ultra-Dinámico corregido para evitar errores de hidratación
const BackgroundDynamic = () => {
  const [mounted, setMounted] = useState(false)
  const [orbs, setOrbs] = useState<any[]>([])

  useEffect(() => {
    // Generamos los valores aleatorios solo en el cliente
    const generatedOrbs = [...Array(5)].map((_, i) => ({
      id: i,
      x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
      y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
      duration: 15 + i * 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: i % 2 === 0 ? VERDE_BOLIVIA : ROJO_BOLIVIA
    }))
    setOrbs(generatedOrbs)
    setMounted(true)
  }, [])

  if (!mounted) return <div className="fixed inset-0 -z-10 bg-slate-50" />

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(0,122,61,0.05)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(218,41,28,0.05)_0%,_transparent_50%)]" />

      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          animate={{
            x: orb.x,
            y: orb.y,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-20"
          style={{
            backgroundColor: orb.color,
            left: orb.left,
            top: orb.top,
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage({ onIniciar }: { onIniciar: () => void }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <div className="relative min-h-screen selection:bg-yellow-200">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 z-50 origin-left" style={{ scaleX }} />

      <BackgroundDynamic />

      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center z-10"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-8 relative"
          >
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
            <Image src="/escudo-bolivia.png" alt="Escudo" width={160} height={160} className="relative drop-shadow-2xl" priority />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-slate-900">
            SIMULADOR <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 tracking-normal">ECONÓMICO</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium"
          >
            Visualiza el futuro fiscal de Bolivia. Ajusta variables, prevé crisis y optimiza el crecimiento en un entorno dinámico.
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="group h-20 px-12 text-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,122,61,0.3)] bg-green-700 hover:bg-green-800 transition-all border-b-4 border-green-900"
              onClick={onIniciar}
            >
              EMPEZAR AHORA
              <ArrowRight className="ml-3 h-8 w-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10"
        >
          <ChevronDown className="h-10 w-10 text-slate-400" />
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10" />}
            title="Bonanza Económica"
            desc="Simula escenarios de altos precios de materias primas y exportaciones récord."
            color={VERDE_BOLIVIA}
          />
          <FeatureCard
            icon={<TrendingDown className="h-10 w-10" />}
            title="Escenarios de Riesgo"
            desc="Analiza el impacto del déficit, la caída de reservas y variaciones del tipo de cambio."
            color={ROJO_BOLIVIA}
          />
          <FeatureCard
            icon={<Activity className="h-10 w-10" />}
            title="Flujo en Vivo"
            desc="Cálculos matemáticos precisos basados en el Presupuesto General del Estado."
            color={AMARILLO_BOLIVIA}
          />
        </div>
      </section>

      <section className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-50 to-transparent opacity-100" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Datos de Grado Gubernamental</h2>
            <div className="h-2 w-40 bg-green-500 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fuentes.map((f, i) => (
              <SourceCard key={i} source={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <footer className="py-40 bg-white flex justify-center items-center overflow-hidden relative">
        <motion.div
          whileInView={{ scale: [0.9, 1.05, 1] }}
          className="text-center z-10"
        >
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 italic">¿LISTO PARA DIRIGIR?</h2>
          <Button
            onClick={onIniciar}
            className="bg-red-600 hover:bg-red-700 text-white text-3xl h-24 px-16 rounded-full shadow-2xl transition-transform hover:scale-110"
          >
            LANZAR SIMULACIÓN
          </Button>
        </motion.div>
        <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-center items-center text-[20vw] font-black text-slate-900 select-none">
          BOLIVIA
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -20, rotate: 1 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="h-full border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-xl group overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: color }} />
        <CardHeader className="pt-8">
          <div className="p-4 rounded-2xl w-fit transition-all group-hover:scale-110 group-hover:rotate-12" style={{ backgroundColor: `${color}15`, color: color }}>
            {icon}
          </div>
          <CardTitle className="text-2xl mt-4">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 leading-relaxed text-lg">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SourceCard({ source, index }: any) {
  return (
    <motion.a
      href={source.url}
      target="_blank"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group block p-8 bg-slate-800/50 hover:bg-green-900/40 border border-slate-700 rounded-3xl transition-all"
    >
      <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform">{source.icono}</div>
      <h3 className="text-xl font-bold text-white mb-2">{source.nombre}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">{source.descripcion}</p>
      <div className="flex items-center text-xs font-bold text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
        VER FUENTE OFICIAL <ExternalLink className="ml-2 h-3 w-3" />
      </div>
    </motion.a>
  )
}

const fuentes = [
  { nombre: "Ministerio de Economía", url: "https://www.economiayfinanzas.gob.bo", icono: <Building2 />, descripcion: "Gestión de deuda y presupuesto TGN." },
  { nombre: "YPFB Corporación", url: "https://www.ypfb.gob.bo", icono: <Activity />, descripcion: "Hidrocarburos y exportación de gas." },
  { nombre: "INE Bolivia", url: "https://www.ine.gob.bo", icono: <Database />, descripcion: "PIB, Inflación y Censo económico." },
  { nombre: "Banco Central (BCB)", url: "https://www.bcb.gob.bo", icono: <DollarSign />, descripcion: "Reservas Internacionales y Política Monetaria." },
]