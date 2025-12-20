import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { parametros_iniciales, resultados, pasos } = data

    // Crear un nuevo libro de Excel
    const workbook = XLSX.utils.book_new()

    // Hoja 1: Parámetros Iniciales
    const parametrosData = Object.entries(parametros_iniciales).map(([key, value]) => ({
      Parámetro: key.replace(/_/g, " ").toUpperCase(),
      Valor: value,
    }))
    const parametrosSheet = XLSX.utils.json_to_sheet(parametrosData)
    XLSX.utils.book_append_sheet(workbook, parametrosSheet, "Parámetros")

    // Hoja 2: Resultados Anuales
    if (resultados && resultados.length > 0) {
      const resultadosData = resultados.map((r: any) => ({
        Año: r.ano,
        "PIB (MM Bs)": r.pib,
        "Ingresos Totales": r.ingresos_totales,
        "Gastos Totales": r.gastos_totales,
        "Déficit/Superávit": r.deficit_superavit,
        "Deuda Total": r.deuda_total,
        "Deuda/PIB (%)": r.deuda_pib_ratio,
        "RIN (MM USD)": r.rin,
        "Presión Tributaria (%)": r.presion_tributaria,
      }))
      const resultadosSheet = XLSX.utils.json_to_sheet(resultadosData)
      XLSX.utils.book_append_sheet(workbook, resultadosSheet, "Resultados")
    }

    // Hoja 3: Ingresos Detallados
    if (resultados && resultados.length > 0) {
      const ingresosData = resultados.map((r: any) => ({
        Año: r.ano,
        "Ing. Gas": r.ing_gas,
        "Ing. Zinc": r.ing_zinc,
        "Ing. Estaño": r.ing_estano,
        "Ing. Oro": r.ing_oro,
        "Ing. Plata": r.ing_plata,
        "Ing. Litio": r.ing_litio,
        IVA: r.ing_iva,
        IUE: r.ing_iue,
        IT: r.ing_it,
        "RC-IVA": r.ing_rc_iva,
        ICE: r.ing_ice,
        GA: r.ing_ga,
      }))
      const ingresosSheet = XLSX.utils.json_to_sheet(ingresosData)
      XLSX.utils.book_append_sheet(workbook, ingresosSheet, "Ingresos")
    }

    // Hoja 4: Gastos Detallados
    if (resultados && resultados.length > 0) {
      const gastosData = resultados.map((r: any) => ({
        Año: r.ano,
        "Sueldos y Salarios": r.gasto_sueldos,
        "Bienes y Servicios": r.gasto_bienes_servicios,
        "Inversión Pública": r.gasto_inversion,
        "Subsidio Combustibles": r.gasto_subsidio_combustibles,
        "Subsidio Alimentos": r.gasto_subsidio_alimentos,
        "Intereses Deuda Externa": r.intereses_deuda_externa,
        "Intereses Deuda Interna": r.intereses_deuda_interna,
      }))
      const gastosSheet = XLSX.utils.json_to_sheet(gastosData)
      XLSX.utils.book_append_sheet(workbook, gastosSheet, "Gastos")
    }

    // Hoja 5: Pasos de Simulación
    if (pasos && pasos.length > 0) {
      const pasosData = pasos.map((p: any) => ({
        Paso: p.paso,
        Año: p.ano,
        Descripción: p.descripcion,
        "Variable Modificada": p.variable_modificada || "N/A",
        "Valor Anterior": p.valor_anterior || "N/A",
        "Valor Nuevo": p.valor_nuevo || "N/A",
        "Impacto En": p.impacto_en.join(", "),
      }))
      const pasosSheet = XLSX.utils.json_to_sheet(pasosData)
      XLSX.utils.book_append_sheet(workbook, pasosSheet, "Pasos Simulación")
    }

    // Convertir el libro a un buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // Retornar el archivo Excel
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=simulacion_fiscal_bolivia_${new Date().toISOString().split("T")[0]}.xlsx`,
      },
    })
  } catch (error) {
    console.error("Error generando Excel:", error)
    return NextResponse.json({ error: "Error al generar archivo Excel" }, { status: 500 })
  }
}
