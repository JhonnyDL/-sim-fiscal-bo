// Escenarios predefinidos de shocks
// Estos son configuraciones de UI para facilitar la prueba de diferentes escenarios
export const ESCENARIOS_SHOCKS = {
    normal: {
        nombre: "Escenario Normal",
        descripcion: "Sin shocks externos",
        shocks: {
            shock_tc: 0,
            shock_precio_gas: 0,
            shock_precio_oro: 0,
            shock_precio_plata: 0,
            shock_precio_zinc: 0,
            shock_precio_estano: 0,
            shock_precio_plomo: 0,
        },
    },
    crisis_commodities: {
        nombre: "Crisis de Commodities",
        descripcion: "Caída de precios internacionales",
        shocks: {
            shock_tc: 5,
            shock_precio_gas: -30,
            shock_precio_oro: -20,
            shock_precio_plata: -25,
            shock_precio_zinc: -30,
            shock_precio_estano: -25,
            shock_precio_plomo: -28,
        },
    },
    auge_minerales: {
        nombre: "Auge de Minerales",
        descripcion: "Aumento de precios de minerales",
        shocks: {
            shock_tc: 0,
            shock_precio_gas: 0,
            shock_precio_oro: 25,
            shock_precio_plata: 30,
            shock_precio_zinc: 20,
            shock_precio_estano: 22,
            shock_precio_plomo: 18,
        },
    },
    crisis_energetica: {
        nombre: "Crisis Energética",
        descripcion: "Aumento de precios de hidrocarburos",
        shocks: {
            shock_tc: 0,
            shock_precio_gas: 40,
            shock_precio_oro: 0,
            shock_precio_plata: 0,
            shock_precio_zinc: 0,
            shock_precio_estano: 0,
            shock_precio_plomo: 0,
        },
    },
}
