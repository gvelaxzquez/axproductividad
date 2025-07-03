export interface CompensacionEncabezado {
    idUsuario: number;
    clave: string;
    recurso: string;
    lider: string;
    nivel: string;
    estandarMes: string;
    horasSolicitadas: string;
    horasLiberadas: string;
    bonoCumplimiento: string;
    horasAdicionales: string;
    bonoHoras: string;
    productividad: string;
    total: string;
    proyectos: number;
    proyecto: string;
    cumpleCriterioAvance: number;
    cumpleCriterioCosto: number;
    cumpleCriterioRentabilidad: number;
    cumpleCriterioCaptura: number;
    facturado: string;
    bonoPotencial: string;
    mesAnio: string;
    bono: number;
    productividadMes: string;
    productividadTotal: number;
}

export interface FiltrosCompensaciones {
    anio: number | null;
    mes: number | null;
    fechaCorte: string | null;
    guardar: boolean;
}
export interface ProductivitySummaryModel {
    totalRecursos: number;
    totalHorasSolicitadas: number;
    totalHorasLiberadas: number;
    totalBonoCumplimiento: number;
    totalHorasAdicionales: number;
    totalBonoHoras: number;
    totalGeneral: number;
    productividadPromedio: number;
}