"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings2, RotateCcw, Sparkles, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export interface ParametrosModeloCompleto {
  // Parámetros básicos (RF1 - Parámetros Iniciales Clave)
  anos: number
  pib_inicial: number
  crecimiento_pib: number
  deuda_externa_inicial: number
  deuda_interna_inicial: number
  tasa_interes_externa: number
  tasa_interes_interna: number
  rin_inicial: number

  // Compatibilidad con versiones anteriores
  deuda_inicial?: number
  tasa_interes?: number

  // Shocks (RF2 - Shocks Externos)
  shock_tc: number
  shock_precio_gas: number
  shock_precio_oro: number
  shock_precio_plata: number
  shock_precio_zinc: number
  shock_precio_estano: number
  shock_precio_plomo: number

  // NUEVOS: Coeficientes del Tipo de Cambio (RF3)
  tc_base: number
  tc_coef_z: number

  // NUEVOS: Coeficientes Gas Natural (RF4)
  gas_volumen_base: number
  gas_volumen_coef_z: number
  gas_precio_base: number
  gas_precio_coef_z: number
  gas_tasa_idh: number
  gas_tasa_regalias: number

  // NUEVOS: Coeficientes Oro (RF4)
  oro_volumen_base: number
  oro_volumen_coef_z: number
  oro_precio_base: number
  oro_precio_coef_z: number
  oro_tasa_regalias: number

  // NUEVOS: Coeficientes Plata (RF4)
  plata_volumen_base: number
  plata_volumen_coef_z: number
  plata_precio_base: number
  plata_precio_coef_z: number
  plata_tasa_regalias: number

  // NUEVOS: Coeficientes Zinc (RF4)
  zinc_volumen_base: number
  zinc_volumen_coef_z: number
  zinc_precio_base: number
  zinc_precio_coef_z: number
  zinc_tasa_regalias: number

  // NUEVOS: Coeficientes Estaño (RF4)
  estano_volumen_base: number
  estano_volumen_coef_z: number
  estano_precio_base: number
  estano_precio_coef_z: number
  estano_tasa_regalias: number

  // NUEVOS: Coeficientes Plomo (RF4)
  plomo_volumen_base: number
  plomo_volumen_coef_z: number
  plomo_precio_base: number
  plomo_precio_coef_z: number
  plomo_tasa_regalias: number

  // NUEVOS: Coeficientes Impuestos (RF5)
  iva_mi_base: number
  iva_mi_coef_z: number
  iue_base: number
  iue_coef_z: number
  it_base: number
  it_coef_z: number
  ice_mi_base: number
  ice_mi_coef_z: number
  rc_iva_base: number
  rc_iva_coef_z: number
  itf_base: number
  itf_coef_z: number
  ij_base: number
  ij_coef_z: number
  cv_base: number
  cv_coef_z: number
  ga_base: number
  ga_coef_z: number
  iva_i_base: number
  iva_i_coef_z: number
  ice_i_base: number
  ice_i_coef_z: number
  iehd_mi_base: number
  iehd_mi_coef_z: number
  iehd_i_base: number
  iehd_i_coef_z: number

  // NUEVOS: Coeficientes Gastos (RF6)
  gasto_corriente_base: number
  gasto_corriente_coef_z: number
  subsidio_alimentos_base: number
  subsidio_alimentos_coef_z: number

  // NUEVOS: Coeficientes Subsidio Combustibles (RF7)
  gasolina_precio_importacion_base: number
  gasolina_precio_importacion_coef_z: number
  gasolina_volumen_importacion_base: number
  gasolina_volumen_importacion_coef_z: number
  gasolina_precio_venta_domestico: number

  diesel_precio_importacion_base: number
  diesel_precio_importacion_coef_z: number
  diesel_volumen_importacion_base: number
  diesel_volumen_importacion_coef_z: number
  diesel_precio_venta_domestico: number

  // NUEVOS: Flag para activar/desactivar subsidios a combustibles
  subsidio_combustibles_activo: boolean

  // NUEVOS: Campos para Petróleo y otros Commodities (añadidos implícitamente por las updates)
  petroleo_volumen_base?: number
  petroleo_volumen_coef_z?: number
  petroleo_precio_base?: number
  petroleo_precio_coef_z?: number
  petroleo_tasa_regalias?: number

  // NUEVOS: Campos para Impuestos (añadidos implícitamente por las updates)
  iue_base_coef_z?: number
  it_base_coef_z?: number
  iva_base_coef_z?: number
  ice_base_coef_z?: number
  cv_coef_z?: number
  gasto_corriente_coef_z?: number
  subsidio_alimentos_coef_z?: number
}

// CHANGE: Eliminando PARAMETROS_MODELO_DEFAULT hardcodeado - ahora se carga desde el backend
export type ParametrosModelo = ParametrosModeloCompleto

interface EditorParametrosAvanzadosProps {
  parametros: ParametrosModelo
  onParametrosChange: (parametros: ParametrosModelo) => void
  onResetearParametros?: () => void
  parametrosDefault: ParametrosModelo
}

export function EditorParametrosAvanzados({
  parametros,
  onParametrosChange,
  onResetearParametros,
  parametrosDefault,
}: EditorParametrosAvanzadosProps) {
  const [tab, setTab] = useState("rf1")

  const handleChange = (key: keyof ParametrosModeloCompleto, value: number) => {
    const nuevosParametros = { ...parametros, [key]: value }
    onParametrosChange(nuevosParametros)
  }

  // Modified to accept any key, not just specific ones.
  const handleParameterChange = (key: keyof ParametrosModeloCompleto, value: number | boolean) => {
    const nuevosParametros = { ...parametros, [key]: value }
    onParametrosChange(nuevosParametros)
  }

  const resetearGrupo = (grupo: string) => {
    const defaults: Record<string, Partial<ParametrosModeloCompleto>> = {
      rf1: {
        anos: parametrosDefault.anos,
        pib_inicial: parametrosDefault.pib_inicial,
        crecimiento_pib: parametrosDefault.crecimiento_pib,
        deuda_externa_inicial: parametrosDefault.deuda_externa_inicial,
        deuda_interna_inicial: parametrosDefault.deuda_interna_inicial,
        tasa_interes_externa: parametrosDefault.tasa_interes_externa,
        tasa_interes_interna: parametrosDefault.tasa_interes_interna,
        rin_inicial: parametrosDefault.rin_inicial,
      },
      // RF2: Shocks
      rf2: {
        shock_tc: parametrosDefault.shock_tc,
        shock_precio_gas: parametrosDefault.shock_precio_gas,
        shock_precio_oro: parametrosDefault.shock_precio_oro,
        shock_precio_plata: parametrosDefault.shock_precio_plata,
        shock_precio_zinc: parametrosDefault.shock_precio_zinc,
        shock_precio_estano: parametrosDefault.shock_precio_estano,
        shock_precio_plomo: parametrosDefault.shock_precio_plomo,
      },
      // RF3: Tipo de Cambio
      tc: {
        tc_base: parametrosDefault.tc_base,
        tc_coef_z: parametrosDefault.tc_coef_z,
      },
      // RF4: Recursos Naturales
      commodities: {
        // Gas Natural
        gas_volumen_base: parametrosDefault.gas_volumen_base,
        gas_volumen_coef_z: parametrosDefault.gas_volumen_coef_z,
        gas_precio_base: parametrosDefault.gas_precio_base,
        gas_precio_coef_z: parametrosDefault.gas_precio_coef_z,
        gas_tasa_idh: parametrosDefault.gas_tasa_idh,
        gas_tasa_regalias: parametrosDefault.gas_tasa_regalias,
        // Oro
        oro_volumen_base: parametrosDefault.oro_volumen_base,
        oro_volumen_coef_z: parametrosDefault.oro_volumen_coef_z,
        oro_precio_base: parametrosDefault.oro_precio_base,
        oro_precio_coef_z: parametrosDefault.oro_precio_coef_z,
        oro_tasa_regalias: parametrosDefault.oro_tasa_regalias,
        // Plata
        plata_volumen_base: parametrosDefault.plata_volumen_base,
        plata_volumen_coef_z: parametrosDefault.plata_volumen_coef_z,
        plata_precio_base: parametrosDefault.plata_precio_base,
        plata_precio_coef_z: parametrosDefault.plata_precio_coef_z,
        plata_tasa_regalias: parametrosDefault.plata_tasa_regalias,
        // Zinc
        zinc_volumen_base: parametrosDefault.zinc_volumen_base,
        zinc_volumen_coef_z: parametrosDefault.zinc_volumen_coef_z,
        zinc_precio_base: parametrosDefault.zinc_precio_base,
        zinc_precio_coef_z: parametrosDefault.zinc_precio_coef_z,
        zinc_tasa_regalias: parametrosDefault.zinc_tasa_regalias,
        // Estaño
        estano_volumen_base: parametrosDefault.estano_volumen_base,
        estano_volumen_coef_z: parametrosDefault.estano_volumen_coef_z,
        estano_precio_base: parametrosDefault.estano_precio_base,
        estano_precio_coef_z: parametrosDefault.estano_precio_coef_z,
        estano_tasa_regalias: parametrosDefault.estano_tasa_regalias,
        // Plomo
        plomo_volumen_base: parametrosDefault.plomo_volumen_base,
        plomo_volumen_coef_z: parametrosDefault.plomo_volumen_coef_z,
        plomo_precio_base: parametrosDefault.plomo_precio_base,
        plomo_precio_coef_z: parametrosDefault.plomo_precio_coef_z,
        plomo_tasa_regalias: parametrosDefault.plomo_tasa_regalias,
        // Petroleo (si existe en defaults)
        petroleo_volumen_base: parametrosDefault.petroleo_volumen_base,
        petroleo_volumen_coef_z: parametrosDefault.petroleo_volumen_coef_z,
        petroleo_precio_base: parametrosDefault.petroleo_precio_base,
        petroleo_precio_coef_z: parametrosDefault.petroleo_precio_coef_z,
        petroleo_tasa_regalias: parametrosDefault.petroleo_tasa_regalias,
      },
      // RF5: Impuestos
      impuestos: {
        iva_mi_base: parametrosDefault.iva_mi_base,
        iva_mi_coef_z: parametrosDefault.iva_mi_coef_z,
        iue_base: parametrosDefault.iue_base,
        iue_coef_z: parametrosDefault.iue_coef_z,
        it_base: parametrosDefault.it_base,
        it_coef_z: parametrosDefault.it_coef_z,
        ice_mi_base: parametrosDefault.ice_mi_base,
        ice_mi_coef_z: parametrosDefault.ice_mi_coef_z,
        rc_iva_base: parametrosDefault.rc_iva_base,
        rc_iva_coef_z: parametrosDefault.rc_iva_coef_z,
        itf_base: parametrosDefault.itf_base,
        itf_coef_z: parametrosDefault.itf_coef_z,
        ij_base: parametrosDefault.ij_base,
        ij_coef_z: parametrosDefault.ij_coef_z,
        cv_base: parametrosDefault.cv_base,
        cv_coef_z: parametrosDefault.cv_coef_z,
        ga_base: parametrosDefault.ga_base,
        ga_coef_z: parametrosDefault.ga_coef_z,
        iva_i_base: parametrosDefault.iva_i_base,
        iva_i_coef_z: parametrosDefault.iva_i_coef_z,
        ice_i_base: parametrosDefault.ice_i_base,
        ice_i_coef_z: parametrosDefault.ice_i_coef_z,
        iehd_mi_base: parametrosDefault.iehd_mi_base,
        iehd_mi_coef_z: parametrosDefault.iehd_mi_coef_z,
        iehd_i_base: parametrosDefault.iehd_i_base,
        iehd_i_coef_z: parametrosDefault.iehd_i_coef_z,
        // Nuevos campos de impuestos que podrian estar en defaults
        iue_base_coef_z: parametrosDefault.iue_base_coef_z,
        it_base_coef_z: parametrosDefault.it_base_coef_z,
        iva_base_coef_z: parametrosDefault.iva_base_coef_z,
        ice_base_coef_z: parametrosDefault.ice_base_coef_z,
        cv_coef_z: parametrosDefault.cv_coef_z,
      },
      // RF6: Gastos
      gastos: {
        gasto_corriente_base: parametrosDefault.gasto_corriente_base,
        gasto_corriente_coef_z: parametrosDefault.gasto_corriente_coef_z,
        subsidio_alimentos_base: parametrosDefault.subsidio_alimentos_base,
        subsidio_alimentos_coef_z: parametrosDefault.subsidio_alimentos_coef_z,
      },
      // RF7: Combustibles
      combustibles: {
        gasolina_precio_importacion_base: parametrosDefault.gasolina_precio_importacion_base,
        gasolina_precio_importacion_coef_z: parametrosDefault.gasolina_precio_importacion_coef_z,
        gasolina_volumen_importacion_base: parametrosDefault.gasolina_volumen_importacion_base,
        gasolina_volumen_importacion_coef_z: parametrosDefault.gasolina_volumen_importacion_coef_z,
        gasolina_precio_venta_domestico: parametrosDefault.gasolina_precio_venta_domestico,
        diesel_precio_importacion_base: parametrosDefault.diesel_precio_importacion_base,
        diesel_precio_importacion_coef_z: parametrosDefault.diesel_precio_importacion_coef_z,
        diesel_volumen_importacion_base: parametrosDefault.diesel_volumen_importacion_base,
        diesel_volumen_importacion_coef_z: parametrosDefault.diesel_volumen_importacion_coef_z,
        diesel_precio_venta_domestico: parametrosDefault.diesel_precio_venta_domestico,
        // Nuevo: resetear el flag de subsidio de combustibles
        subsidio_combustibles_activo: parametrosDefault.subsidio_combustibles_activo,
      },
    }

    if (defaults[grupo]) {
      onParametrosChange({ ...parametros, ...defaults[grupo] })
    }
  }

  const handleResetAll = () => {
    if (onResetearParametros) {
      onResetearParametros()
    }
  }

  return (
    <Card className="shadow-lg border-2 overflow-hidden">
      <div className="h-2 gradient-bolivia" />
      <CardHeader className="bg-gradient-to-br from-card to-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Editor de Parámetros</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configura todos los coeficientes del modelo estocástico
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetAll} className="shadow-sm bg-transparent">
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetear Todo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-muted/50 mb-6">
            <TabsTrigger
              value="rf1"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-semibold transition-all"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Básicos
            </TabsTrigger>
            <TabsTrigger
              value="tc"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-semibold"
            >
              Tipo Cambio
            </TabsTrigger>
            <TabsTrigger
              value="commodities"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-semibold"
            >
              Commodities
            </TabsTrigger>
            <TabsTrigger
              value="impuestos"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-semibold"
            >
              Impuestos
            </TabsTrigger>
            <TabsTrigger
              value="gastos"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-semibold"
            >
              Gastos
            </TabsTrigger>
            <TabsTrigger
              value="combustibles"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 font-semibold"
            >
              Combustibles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rf1" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Parámetros Iniciales
              </h3>
              <Button variant="ghost" size="sm" onClick={() => resetearGrupo("rf1")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="anos" className="font-semibold">
                  Años a Simular
                </Label>
                <Input
                  id="anos"
                  type="number"
                  value={parametros.anos}
                  onChange={(e) => handleChange("anos", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pib_inicial" className="font-semibold">
                  PIB Inicial (Bs)
                </Label>
                <Input
                  id="pib_inicial"
                  type="number"
                  value={parametros.pib_inicial}
                  onChange={(e) => handleChange("pib_inicial", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crecimiento_pib" className="font-semibold">
                  Crecimiento PIB (%)
                </Label>
                <Input
                  id="crecimiento_pib"
                  type="number"
                  step="0.1"
                  value={parametros.crecimiento_pib}
                  onChange={(e) => handleChange("crecimiento_pib", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deuda_externa_inicial" className="font-semibold">
                  Deuda Externa Inicial (MM Bs.)
                </Label>
                <Input
                  id="deuda_externa_inicial"
                  type="number"
                  value={parametros.deuda_externa_inicial}
                  onChange={(e) => handleChange("deuda_externa_inicial", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deuda_interna_inicial" className="font-semibold">
                  Deuda Interna Inicial (MM Bs.)
                </Label>
                <Input
                  id="deuda_interna_inicial"
                  type="number"
                  value={parametros.deuda_interna_inicial}
                  onChange={(e) => handleChange("deuda_interna_inicial", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rin_inicial" className="font-semibold">
                  RIN Inicial (MM Bs.)
                </Label>
                <Input
                  id="rin_inicial"
                  type="number"
                  value={parametros.rin_inicial}
                  onChange={(e) => handleChange("rin_inicial", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tasa_interes_externa" className="font-semibold">
                  Tasa Interés Externa (%)
                </Label>
                <Input
                  id="tasa_interes_externa"
                  type="number"
                  step="0.1"
                  value={parametros.tasa_interes_externa}
                  onChange={(e) => handleChange("tasa_interes_externa", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tasa_interes_interna" className="font-semibold">
                  Tasa Interés Interna (%)
                </Label>
                <Input
                  id="tasa_interes_interna"
                  type="number"
                  step="0.1"
                  value={parametros.tasa_interes_interna}
                  onChange={(e) => handleChange("tasa_interes_interna", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shock_tc" className="font-semibold">
                  Shock Tipo de Cambio (%)
                </Label>
                <Input
                  id="shock_tc"
                  type="number"
                  step="0.1"
                  value={parametros.shock_tc}
                  onChange={(e) => handleChange("shock_tc", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
            </div>
          </TabsContent>

          {/* Shocks (RF2) */}
          <TabsContent value="shocks" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Shocks Externos
              </h3>
              <Button variant="ghost" size="sm" onClick={() => resetearGrupo("rf2")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shock_precio_gas" className="font-semibold">
                  Shock Gas (%)
                </Label>
                <Input
                  id="shock_precio_gas"
                  type="number"
                  step="0.1"
                  value={parametros.shock_precio_gas}
                  onChange={(e) => handleChange("shock_precio_gas", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shock_precio_oro" className="font-semibold">
                  Shock Oro (%)
                </Label>
                <Input
                  id="shock_precio_oro"
                  type="number"
                  step="0.1"
                  value={parametros.shock_precio_oro}
                  onChange={(e) => handleChange("shock_precio_oro", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shock_precio_plata" className="font-semibold">
                  Shock Plata (%)
                </Label>
                <Input
                  id="shock_precio_plata"
                  type="number"
                  step="0.1"
                  value={parametros.shock_precio_plata}
                  onChange={(e) => handleChange("shock_precio_plata", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shock_precio_zinc" className="font-semibold">
                  Shock Zinc (%)
                </Label>
                <Input
                  id="shock_precio_zinc"
                  type="number"
                  step="0.1"
                  value={parametros.shock_precio_zinc}
                  onChange={(e) => handleChange("shock_precio_zinc", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shock_precio_estano" className="font-semibold">
                  Shock Estaño (%)
                </Label>
                <Input
                  id="shock_precio_estano"
                  type="number"
                  step="0.1"
                  value={parametros.shock_precio_estano}
                  onChange={(e) => handleChange("shock_precio_estano", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shock_precio_plomo" className="font-semibold">
                  Shock Plomo (%)
                </Label>
                <Input
                  id="shock_precio_plomo"
                  type="number"
                  step="0.1"
                  value={parametros.shock_precio_plomo}
                  onChange={(e) => handleChange("shock_precio_plomo", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
            </div>
          </TabsContent>

          {/* Tipo de Cambio */}
          <TabsContent value="tc" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Tipo de Cambio
              </h3>
              <Button variant="ghost" size="sm" onClick={() => resetearGrupo("tc")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Fórmula: <code className="bg-background px-2 py-1 rounded">TC = Base + Coef_Z × Z</code>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tc_base" className="font-semibold">
                  Base
                </Label>
                <Input
                  id="tc_base"
                  type="number"
                  step="0.0001"
                  value={parametros.tc_base}
                  onChange={(e) => handleChange("tc_base", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tc_coef_z" className="font-semibold">
                  Desviación Estocástica
                </Label>
                <Input
                  id="tc_coef_z"
                  type="number"
                  step="0.0001"
                  value={parametros.tc_coef_z}
                  onChange={(e) => handleChange("tc_coef_z", Number.parseFloat(e.target.value))}
                  className="font-mono"
                />
              </div>
            </div>
          </TabsContent>

          {/* Recursos Naturales */}
          <TabsContent value="commodities" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Recursos Naturales y Commodities
              </h3>
              <Button variant="ghost" size="sm" onClick={() => resetearGrupo("commodities")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>
            {/* Gas Natural */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge>Gas Natural</Badge>
                <span className="text-sm text-muted-foreground">Volumen (Ton), Precio ($/Ton), Tasas (%)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Volumen Base</Label>
                  <Input
                    type="number"
                    step="1000"
                    value={parametros.gas_volumen_base}
                    onChange={(e) => handleChange("gas_volumen_base", Number.parseFloat(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Desviación de Volumen</Label>
                  <Input
                    type="number"
                    step="1000"
                    value={parametros.gas_volumen_coef_z}
                    onChange={(e) => handleChange("gas_volumen_coef_z", Number.parseFloat(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Precio Base ($/Ton)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={parametros.gas_precio_base}
                    onChange={(e) => handleChange("gas_precio_base", Number.parseFloat(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Desviación de Precio</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={parametros.gas_precio_coef_z}
                    onChange={(e) => handleChange("gas_precio_coef_z", Number.parseFloat(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Tasa IDH (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={parametros.gas_tasa_idh}
                    onChange={(e) => handleChange("gas_tasa_idh", Number.parseFloat(e.target.value))}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Tasa Regalías (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={parametros.gas_tasa_regalias}
                    onChange={(e) => handleChange("gas_tasa_regalias", Number.parseFloat(e.target.value))}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Oro */}
            <RecursoMineralEditor
              nombre="Oro"
              volumeBase={parametros.oro_volumen_base}
              volumeCoefZ={parametros.oro_volumen_coef_z}
              precioBase={parametros.oro_precio_base}
              precioCoefZ={parametros.oro_precio_coef_z}
              tasaRegalias={parametros.oro_tasa_regalias}
              onChangeVolumeBase={(v) => handleChange("oro_volumen_base", v)}
              onChangeVolumeCoefZ={(v) => handleChange("oro_volumen_coef_z", v)}
              onChangePrecioBase={(v) => handleChange("oro_precio_base", v)}
              onChangePrecioCoefZ={(v) => handleChange("oro_precio_coef_z", v)}
              onChangeTasaRegalias={(v) => handleChange("oro_tasa_regalias", v)}
            />

            {/* Plata */}
            <RecursoMineralEditor
              nombre="Plata"
              volumeBase={parametros.plata_volumen_base}
              volumeCoefZ={parametros.plata_volumen_coef_z}
              precioBase={parametros.plata_precio_base}
              precioCoefZ={parametros.plata_precio_coef_z}
              tasaRegalias={parametros.plata_tasa_regalias}
              onChangeVolumeBase={(v) => handleChange("plata_volumen_base", v)}
              onChangeVolumeCoefZ={(v) => handleChange("plata_volumen_coef_z", v)}
              onChangePrecioBase={(v) => handleChange("plata_precio_base", v)}
              onChangePrecioCoefZ={(v) => handleChange("plata_precio_coef_z", v)}
              onChangeTasaRegalias={(v) => handleChange("plata_tasa_regalias", v)}
            />

            {/* Zinc */}
            <RecursoMineralEditor
              nombre="Zinc"
              volumeBase={parametros.zinc_volumen_base}
              volumeCoefZ={parametros.zinc_volumen_coef_z}
              precioBase={parametros.zinc_precio_base}
              precioCoefZ={parametros.zinc_precio_coef_z}
              tasaRegalias={parametros.zinc_tasa_regalias}
              onChangeVolumeBase={(v) => handleChange("zinc_volumen_base", v)}
              onChangeVolumeCoefZ={(v) => handleChange("zinc_volumen_coef_z", v)}
              onChangePrecioBase={(v) => handleChange("zinc_precio_base", v)}
              onChangePrecioCoefZ={(v) => handleChange("zinc_precio_coef_z", v)}
              onChangeTasaRegalias={(v) => handleChange("zinc_tasa_regalias", v)}
            />

            {/* Estaño */}
            <RecursoMineralEditor
              nombre="Estaño"
              volumeBase={parametros.estano_volumen_base}
              volumeCoefZ={parametros.estano_volumen_coef_z}
              precioBase={parametros.estano_precio_base}
              precioCoefZ={parametros.estano_precio_coef_z}
              tasaRegalias={parametros.estano_tasa_regalias}
              onChangeVolumeBase={(v) => handleChange("estano_volumen_base", v)}
              onChangeVolumeCoefZ={(v) => handleChange("estano_volumen_coef_z", v)}
              onChangePrecioBase={(v) => handleChange("estano_precio_base", v)}
              onChangePrecioCoefZ={(v) => handleChange("estano_precio_coef_z", v)}
              onChangeTasaRegalias={(v) => handleChange("estano_tasa_regalias", v)}
            />

            {/* Plomo */}
            <RecursoMineralEditor
              nombre="Plomo"
              volumeBase={parametros.plomo_volumen_base}
              volumeCoefZ={parametros.plomo_volumen_coef_z}
              precioBase={parametros.plomo_precio_base}
              precioCoefZ={parametros.plomo_precio_coef_z}
              tasaRegalias={parametros.plomo_tasa_regalias}
              onChangeVolumeBase={(v) => handleChange("plomo_volumen_base", v)}
              onChangeVolumeCoefZ={(v) => handleChange("plomo_volumen_coef_z", v)}
              onChangePrecioBase={(v) => handleChange("plomo_precio_base", v)}
              onChangePrecioCoefZ={(v) => handleChange("plomo_precio_coef_z", v)}
              onChangeTasaRegalias={(v) => handleChange("plomo_tasa_regalias", v)}
            />

            {/* Petroleo */}
            <RecursoMineralEditor
              nombre="Petróleo"
              volumeBase={parametros.petroleo_volumen_base}
              volumeCoefZ={parametros.petroleo_volumen_coef_z}
              precioBase={parametros.petroleo_precio_base}
              precioCoefZ={parametros.petroleo_precio_coef_z}
              tasaRegalias={parametros.petroleo_tasa_regalias}
              onChangeVolumeBase={(v) => handleChange("petroleo_volumen_base", v)}
              onChangeVolumeCoefZ={(v) => handleChange("petroleo_volumen_coef_z", v)}
              onChangePrecioBase={(v) => handleChange("petroleo_precio_base", v)}
              onChangePrecioCoefZ={(v) => handleChange("petroleo_precio_coef_z", v)}
              onChangeTasaRegalias={(v) => handleChange("petroleo_tasa_regalias", v)}
            />
          </TabsContent>

          {/* Impuestos */}
          <TabsContent value="impuestos" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Impuestos
              </h3>
              <Button variant="ghost" size="sm" onClick={() => resetearGrupo("impuestos")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Todos los impuestos siguen:{" "}
                <code className="bg-background px-2 py-1 rounded">I = Base + Coef_Z × Z</code>
              </p>
            </div>
            <div className="grid gap-3">
              <ImpuestoEditor
                nombre="IVA Mercado Interno"
                base={parametros.iva_mi_base}
                coefZ={parametros.iva_mi_coef_z}
                onChangeBase={(v) => handleChange("iva_mi_base", v)}
                onChangeCoefZ={(v) => handleChange("iva_mi_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IUE"
                base={parametros.iue_base}
                coefZ={parametros.iue_coef_z}
                onChangeBase={(v) => handleChange("iue_base", v)}
                onChangeCoefZ={(v) => handleChange("iue_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IT"
                base={parametros.it_base}
                coefZ={parametros.it_coef_z}
                onChangeBase={(v) => handleChange("it_base", v)}
                onChangeCoefZ={(v) => handleChange("it_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="ICE Mercado Interno"
                base={parametros.ice_mi_base}
                coefZ={parametros.ice_mi_coef_z}
                onChangeBase={(v) => handleChange("ice_mi_base", v)}
                onChangeCoefZ={(v) => handleChange("ice_mi_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="RC-IVA"
                base={parametros.rc_iva_base}
                coefZ={parametros.rc_iva_coef_z}
                onChangeBase={(v) => handleChange("rc_iva_base", v)}
                onChangeCoefZ={(v) => handleChange("rc_iva_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="ITF"
                base={parametros.itf_base}
                coefZ={parametros.itf_coef_z}
                onChangeBase={(v) => handleChange("itf_base", v)}
                onChangeCoefZ={(v) => handleChange("itf_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IJ"
                base={parametros.ij_base}
                coefZ={parametros.ij_coef_z}
                onChangeBase={(v) => handleChange("ij_base", v)}
                onChangeCoefZ={(v) => handleChange("ij_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="Conceptos Varios"
                base={parametros.cv_base}
                coefZ={parametros.cv_coef_z}
                onChangeBase={(v) => handleChange("cv_base", v)}
                onChangeCoefZ={(v) => handleChange("cv_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="GA"
                base={parametros.ga_base}
                coefZ={parametros.ga_coef_z}
                onChangeBase={(v) => handleChange("ga_base", v)}
                onChangeCoefZ={(v) => handleChange("ga_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IVA Importaciones"
                base={parametros.iva_i_base}
                coefZ={parametros.iva_i_coef_z}
                onChangeBase={(v) => handleChange("iva_i_base", v)}
                onChangeCoefZ={(v) => handleChange("iva_i_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="ICE Importaciones"
                base={parametros.ice_i_base}
                coefZ={parametros.ice_i_coef_z}
                onChangeBase={(v) => handleChange("ice_i_base", v)}
                onChangeCoefZ={(v) => handleChange("ice_i_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IEHD Mercado Interno"
                base={parametros.iehd_mi_base}
                coefZ={parametros.iehd_mi_coef_z}
                onChangeBase={(v) => handleChange("iehd_mi_base", v)}
                onChangeCoefZ={(v) => handleChange("iehd_mi_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IEHD Importaciones"
                base={parametros.iehd_i_base}
                coefZ={parametros.iehd_i_coef_z}
                onChangeBase={(v) => handleChange("iehd_i_base", v)}
                onChangeCoefZ={(v) => handleChange("iehd_i_coef_z", v)}
              />

              {/* Nuevos campos de impuestos, probablemente con coef_z como desviación estocástica */}
              <ImpuestoEditor
                nombre="IUE (Base)"
                base={parametros.iue_base}
                coefZ={parametros.iue_base_coef_z}
                onChangeBase={(v) => handleChange("iue_base", v)}
                onChangeCoefZ={(v) => handleChange("iue_base_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IT (Base)"
                base={parametros.it_base}
                coefZ={parametros.it_base_coef_z}
                onChangeBase={(v) => handleChange("it_base", v)}
                onChangeCoefZ={(v) => handleChange("it_base_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="IVA (Base)"
                base={parametros.iva_mi_base} // Asumiendo que es IVA MI
                coefZ={parametros.iva_base_coef_z}
                onChangeBase={(v) => handleChange("iva_mi_base", v)}
                onChangeCoefZ={(v) => handleChange("iva_base_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="ICE (Base)"
                base={parametros.ice_mi_base} // Asumiendo que es ICE MI
                coefZ={parametros.ice_base_coef_z}
                onChangeBase={(v) => handleChange("ice_mi_base", v)}
                onChangeCoefZ={(v) => handleChange("ice_base_coef_z", v)}
              />
              <ImpuestoEditor
                nombre="CV (Base)"
                base={parametros.cv_base}
                coefZ={parametros.cv_coef_z}
                onChangeBase={(v) => handleChange("cv_base", v)}
                onChangeCoefZ={(v) => handleChange("cv_coef_z", v)}
              />
            </div>
          </TabsContent>

          {/* Gastos */}
          <TabsContent value="gastos" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Gastos
              </h3>
              <Button variant="ghost" size="sm" onClick={() => resetearGrupo("gastos")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Badge>Gasto Corriente</Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Base (millones Bs)</Label>
                    <Input
                      type="number"
                      step="1000000"
                      value={parametros.gasto_corriente_base}
                      onChange={(e) => handleChange("gasto_corriente_base", Number.parseFloat(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desviación Estocástica</Label>
                    <Input
                      type="number"
                      step="1000000"
                      value={parametros.gasto_corriente_coef_z}
                      onChange={(e) => handleChange("gasto_corriente_coef_z", Number.parseFloat(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Badge>Subsidio Alimentos</Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Base (millones Bs)</Label>
                    <Input
                      type="number"
                      step="1000000"
                      value={parametros.subsidio_alimentos_base}
                      onChange={(e) => handleChange("subsidio_alimentos_base", Number.parseFloat(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desviación Estocástica</Label>
                    <Input
                      type="number"
                      step="1000000"
                      value={parametros.subsidio_alimentos_coef_z}
                      onChange={(e) => handleChange("subsidio_alimentos_coef_z", Number.parseFloat(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Combustibles */}
          <TabsContent value="combustibles" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="h-1 w-6 bg-primary rounded-full" />
                Subsidio Combustibles
              </h3>
              <Button variant="ghost" size="sm" onClick={() => resetearGrupo("combustibles")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-red-50 border-2 border-yellow-500 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-yellow-600" />
                    <h4 className="text-lg font-bold text-gray-900">Control de Subsidios</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-9">
                    Activa o desactiva el subsidio a combustibles para ver el impacto fiscal
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="subsidio-toggle" className="text-base font-semibold">
                    {parametros.subsidio_combustibles_activo !== false ? "Activo" : "Desactivado"}
                  </Label>
                  <Switch
                    id="subsidio-toggle"
                    checked={parametros.subsidio_combustibles_activo !== false}
                    onCheckedChange={(checked) => {
                      handleParameterChange("subsidio_combustibles_activo", checked)
                    }}
                    className="scale-125"
                  />
                </div>
              </div>
              {parametros.subsidio_combustibles_activo === false && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
                  <p className="text-sm font-semibold text-red-800">
                    ⚠️ Subsidios desactivados: Los gastos en combustibles serán eliminados de la simulación
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Badge>Gasolina</Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Precio Import Base ($/Ton)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={parametros.gasolina_precio_importacion_base}
                      onChange={(e) =>
                        handleChange("gasolina_precio_importacion_base", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desviación de Precio Import.</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={parametros.gasolina_precio_importacion_coef_z}
                      onChange={(e) =>
                        handleChange("gasolina_precio_importacion_coef_z", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Volumen Import Base (Ton)</Label>
                    <Input
                      type="number"
                      step="1000"
                      value={parametros.gasolina_volumen_importacion_base}
                      onChange={(e) =>
                        handleChange("gasolina_volumen_importacion_base", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desviación de Volumen Import.</Label>
                    <Input
                      type="number"
                      step="1000"
                      value={parametros.gasolina_volumen_importacion_coef_z}
                      onChange={(e) =>
                        handleChange("gasolina_volumen_importacion_coef_z", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label className="text-xs font-semibold">Precio Venta Doméstico (Bs/Ton)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={parametros.gasolina_precio_venta_domestico}
                      onChange={(e) =>
                        handleChange("gasolina_precio_venta_domestico", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Badge>Diésel</Badge>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Precio Import Base ($/Ton)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={parametros.diesel_precio_importacion_base}
                      onChange={(e) =>
                        handleChange("diesel_precio_importacion_base", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desviación de Precio Import.</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={parametros.diesel_precio_importacion_coef_z}
                      onChange={(e) =>
                        handleChange("diesel_precio_importacion_coef_z", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Volumen Import Base (Ton)</Label>
                    <Input
                      type="number"
                      step="1000"
                      value={parametros.diesel_volumen_importacion_base}
                      onChange={(e) =>
                        handleChange("diesel_volumen_importacion_base", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desviación de Volumen Import.</Label>
                    <Input
                      type="number"
                      step="1000"
                      value={parametros.diesel_volumen_importacion_coef_z}
                      onChange={(e) =>
                        handleChange("diesel_volumen_importacion_coef_z", Number.parseFloat(e.target.value))
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label className="text-xs font-semibold">Precio Venta Doméstico (Bs/Ton)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={parametros.diesel_precio_venta_domestico}
                      onChange={(e) => handleChange("diesel_precio_venta_domestico", Number.parseFloat(e.target.value))}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Componente auxiliar para editar recursos minerales
interface RecursoMineralEditorProps {
  nombre: string
  volumeBase?: number
  volumeCoefZ?: number
  precioBase?: number
  precioCoefZ?: number
  tasaRegalias?: number
  onChangeVolumeBase: (v: number) => void
  onChangeVolumeCoefZ: (v: number) => void
  onChangePrecioBase: (v: number) => void
  onChangePrecioCoefZ: (v: number) => void
  onChangeTasaRegalias: (v: number) => void
}

function RecursoMineralEditor({
  nombre,
  volumeBase,
  volumeCoefZ,
  precioBase,
  precioCoefZ,
  tasaRegalias,
  onChangeVolumeBase,
  onChangeVolumeCoefZ,
  onChangePrecioBase,
  onChangePrecioCoefZ,
  onChangeTasaRegalias,
}: RecursoMineralEditorProps) {
  return (
    <div className="space-y-3">
      <Badge>{nombre}</Badge>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Volumen Base (Ton)</Label>
          <Input
            type="number"
            step="0.01" // Ajustado para ser más flexible
            value={volumeBase ?? 0}
            onChange={(e) => onChangeVolumeBase(Number.parseFloat(e.target.value))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Desviación de Volumen</Label>
          <Input
            type="number"
            step="0.01" // Ajustado para ser más flexible
            value={volumeCoefZ ?? 0}
            onChange={(e) => onChangeVolumeCoefZ(Number.parseFloat(e.target.value))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Precio Base ($/Ton)</Label>
          <Input
            type="number"
            step="0.01"
            value={precioBase ?? 0}
            onChange={(e) => onChangePrecioBase(Number.parseFloat(e.target.value))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Desviación de Precio</Label>
          <Input
            type="number"
            step="0.01"
            value={precioCoefZ ?? 0}
            onChange={(e) => onChangePrecioCoefZ(Number.parseFloat(e.target.value))}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Tasa Regalías (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={tasaRegalias ?? 0}
            onChange={(e) => onChangeTasaRegalias(Number.parseFloat(e.target.value))}
            className="font-mono"
          />
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar para editar impuestos
interface ImpuestoEditorProps {
  nombre: string
  base: number
  coefZ?: number // Ahora puede ser opcional si no aplica para todos los casos
  onChangeBase: (v: number) => void
  onChangeCoefZ: (v: number) => void
}

function ImpuestoEditor({ nombre, base, coefZ, onChangeBase, onChangeCoefZ }: ImpuestoEditorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
      <Badge variant="secondary" className="justify-center col-span-1 md:col-span-1">
        {nombre}
      </Badge>
      <Input
        type="number"
        step="1000000" // Manteniendo el step general para impuestos, se puede ajustar si es necesario
        placeholder="Base"
        value={base}
        onChange={(e) => onChangeBase(Number.parseFloat(e.target.value))}
        className="font-mono"
      />
      <Input
        type="number"
        step="100000" // Default step, puede variar
        placeholder="Desviación Estocástica" // Cambiado a un término más general
        value={coefZ ?? 0} // Asignar 0 si es undefined
        onChange={(e) => onChangeCoefZ(Number.parseFloat(e.target.value))}
        className="font-mono"
      />
    </div>
  )
}
