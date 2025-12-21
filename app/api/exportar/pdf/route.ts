import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { parametros_iniciales, resultados, pasos } = data

        // Crear un nuevo documento PDF
        const doc = new jsPDF()
        let yPosition = 20

        // Título del documento
        doc.setFontSize(18)
        doc.setTextColor(40, 40, 40)
        doc.text("Simulación Fiscal - Estado Plurinacional de Bolivia", 105, yPosition, { align: "center" })
        yPosition += 10

        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Fecha: ${new Date().toLocaleDateString("es-BO")}`, 105, yPosition, { align: "center" })
        yPosition += 15

        // Sección 1: Parámetros Iniciales
        doc.setFontSize(14)
        doc.setTextColor(40, 40, 40)
        doc.text("Parámetros de la Simulación", 14, yPosition)
        yPosition += 8

        const parametrosData = [
            ["Años de simulación", parametros_iniciales.anos.toString()],
            ["PIB Inicial (MM Bs)", parametros_iniciales.pib_inicial.toLocaleString()],
            ["Crecimiento PIB (%)", parametros_iniciales.crecimiento_pib.toString()],
            ["Inflación (%)", parametros_iniciales.inflacion.toString()],
            ["Tipo de Cambio", parametros_iniciales.tipo_cambio.toString()],
            ["Deuda Inicial (MM Bs)", parametros_iniciales.deuda_inicial.toLocaleString()],
            ["RIN Inicial (MM USD)", parametros_iniciales.rin_inicial.toLocaleString()],
        ]

        autoTable(doc, {
            startY: yPosition,
            head: [["Parámetro", "Valor"]],
            body: parametrosData,
            theme: "grid",
            headStyles: { fillColor: [41, 128, 185] },
            margin: { left: 14 },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15

        // Sección 2: Resultados Anuales Principales
        if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
        }

        doc.setFontSize(14)
        doc.text("Resultados Anuales", 14, yPosition)
        yPosition += 8

        const resultadosData = resultados.map((r: any) => [
            r.ano.toString(),
            r.pib.toLocaleString(),
            r.ingresos_totales.toLocaleString(),
            r.gastos_totales.toLocaleString(),
            r.deficit_superavit.toLocaleString(),
            `${r.deuda_pib_ratio.toFixed(1)}%`,
        ])

        autoTable(doc, {
            startY: yPosition,
            head: [["Año", "PIB", "Ingresos", "Gastos", "Déficit/S", "Deuda/PIB"]],
            body: resultadosData,
            theme: "striped",
            headStyles: { fillColor: [52, 152, 219] },
            margin: { left: 14 },
            styles: { fontSize: 9 },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15

        // Sección 3: Ingresos Detallados
        doc.addPage()
        yPosition = 20

        doc.setFontSize(14)
        doc.text("Ingresos Detallados (MM Bs)", 14, yPosition)
        yPosition += 8

        const ingresosData = resultados.map((r: any) => [
            r.ano.toString(),
            r.ing_gas.toLocaleString(),
            r.ing_zinc.toLocaleString(),
            r.ing_litio.toLocaleString(),
            r.ing_iva.toLocaleString(),
            r.ing_iue.toLocaleString(),
            r.ingresos_totales.toLocaleString(),
        ])

        autoTable(doc, {
            startY: yPosition,
            head: [["Año", "Gas", "Zinc", "Litio", "IVA", "IUE", "Total"]],
            body: ingresosData,
            theme: "grid",
            headStyles: { fillColor: [46, 204, 113] },
            margin: { left: 14 },
            styles: { fontSize: 9 },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15

        // Sección 4: Gastos Detallados
        if (yPosition > 200) {
            doc.addPage()
            yPosition = 20
        }

        doc.setFontSize(14)
        doc.text("Gastos Detallados (MM Bs)", 14, yPosition)
        yPosition += 8

        const gastosData = resultados.map((r: any) => [
            r.ano.toString(),
            r.gasto_sueldos.toLocaleString(),
            r.gasto_inversion.toLocaleString(),
            r.gasto_subsidio_combustibles.toLocaleString(),
            r.intereses_totales.toLocaleString(),
            r.gastos_totales.toLocaleString(),
        ])

        autoTable(doc, {
            startY: yPosition,
            head: [["Año", "Sueldos", "Inversión", "Subsidios", "Intereses", "Total"]],
            body: gastosData,
            theme: "grid",
            headStyles: { fillColor: [231, 76, 60] },
            margin: { left: 14 },
            styles: { fontSize: 9 },
        })

        // Sección 5: Indicadores de Sostenibilidad
        doc.addPage()
        yPosition = 20

        doc.setFontSize(14)
        doc.text("Indicadores de Sostenibilidad Fiscal", 14, yPosition)
        yPosition += 8

        const sostenibilidadData = resultados.map((r: any) => [
            r.ano.toString(),
            `${r.deuda_pib_ratio.toFixed(1)}%`,
            `${r.presion_tributaria.toFixed(1)}%`,
            `${r.deficit_pib_ratio.toFixed(1)}%`,
            `${r.rin_meses_importacion.toFixed(1)} meses`,
        ])

        autoTable(doc, {
            startY: yPosition,
            head: [["Año", "Deuda/PIB", "Presión Trib.", "Déficit/PIB", "RIN/Import"]],
            body: sostenibilidadData,
            theme: "striped",
            headStyles: { fillColor: [155, 89, 182] },
            margin: { left: 14 },
            styles: { fontSize: 9 },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15

        // Pie de página con información adicional
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setTextColor(150, 150, 150)
            doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: "center" })
            doc.text("Simulador Fiscal - Estado Plurinacional de Bolivia", 14, 285)
        }

        // Convertir el PDF a buffer
        const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

        // Retornar el archivo PDF
        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=reporte_fiscal_bolivia_${new Date().toISOString().split("T")[0]}.pdf`,
            },
        })
    } catch (error) {
        console.error("Error generando PDF:", error)
        return NextResponse.json({ error: "Error al generar archivo PDF" }, { status: 500 })
    }
}
