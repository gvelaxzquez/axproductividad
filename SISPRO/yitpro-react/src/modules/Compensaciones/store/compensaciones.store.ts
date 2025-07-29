import axios from 'axios';
import dayjs from 'dayjs';
import { create } from 'zustand';
import type { ActividadesModel } from '../../../model/Actividad.model';
import type { CompensacionEncabezado, FiltrosCompensaciones, ProductivitySummaryModel, UsuarioIncidencia } from '../../../model/compensaciones.model';
import { convertFromPascalCase } from '../../../utils/convertPascal';
import { withLoading } from '../../../utils/withLoading';

// --- Interfaces del Store ---
interface CompensacionesState {
    filtros: FiltrosCompensaciones;
    encabezado: CompensacionEncabezado[];
    detalle: ActividadesModel[];
    loading: boolean;
    error: string | null;
    isModalVisible: boolean;
    selectedRecurso: CompensacionEncabezado | null;
    productivitySummary: ProductivitySummaryModel | null; // Nueva propiedad
    incidencias: UsuarioIncidencia[]; // Nueva propiedad
    setFiltros: (nuevosFiltros: Partial<FiltrosCompensaciones>) => void;
    generarCompensaciones: () => Promise<void>;
    showModal: (recurso: CompensacionEncabezado) => void;
    hideModal: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analisisSemanal: (period?: number) => Promise<any>;
}

// --- Rutas de la API ---
const urlGeneraCompensaciones = '/Compensaciones/GeneraCompensaciones';
const urlAnalisisSemanal = '/Compensaciones/AnalisisSemanal';


// --- Implementación del Store ---
export const useCompensacionesStore = create<CompensacionesState>((set, get) => {
    const lastMonth = dayjs().subtract(1, 'month');
    const initialAnio = lastMonth.year();
    const initialMes = lastMonth.month() + 1; // dayjs months are 0-indexed
    const initialFechaCorte = lastMonth.endOf('month').format('YYYY-MM-DD');

    return {
        // --- Estado Inicial ---
        filtros: {
            anio: initialAnio,
            mes: initialMes,
            fechaCorte: initialFechaCorte,
            guardar: true,
            period: 1,
        },
        encabezado: [],
        detalle: [],
        incidencias: [],
        loading: false,
        error: null,
        isModalVisible: false,
        selectedRecurso: null,
        productivitySummary: null, // Inicializar el summary

        // --- Acciones ---
        setFiltros: (nuevosFiltros) => set(state => ({ filtros: { ...state.filtros, ...nuevosFiltros } })),

        generarCompensaciones: async () => {
            const { filtros } = get();
            if (!filtros.anio || !filtros.mes) {
                set({ error: 'El año y el mes son requeridos.' });
                return;
            }

            try {
                const { data } = await withLoading(() =>
                    axios.post(urlGeneraCompensaciones, filtros)
                );

                if (data.Exito) {
                    const encabezadoData = convertFromPascalCase<CompensacionEncabezado[]>(JSON.parse(data.LstEncabezado));
                    const detalleData = convertFromPascalCase<ActividadesModel[]>(JSON.parse(data.LstDetalle));

                    // Calcular el summary
                    const summary: ProductivitySummaryModel = encabezadoData.reduce(
                        (acc, curr) => {
                            const productividadValue = parseFloat(curr.productividad.replace('%', ''));
                            acc.totalHorasSolicitadas += +curr.horasSolicitadas;
                            acc.totalHorasLiberadas += +curr.horasLiberadas;
                            acc.totalBonoCumplimiento += +curr.bonoCumplimiento;
                            acc.totalHorasAdicionales += +curr.horasAdicionales;
                            acc.totalBonoHoras += +curr.bonoHoras;
                            acc.totalGeneral += +curr.total;
                            acc.productividadPromedio += productividadValue; // Sumar para luego promediar
                            acc.totalRecursos += 1; // Contar recursos
                            return acc;
                        },
                        {
                            totalHorasSolicitadas: 0,
                            totalHorasLiberadas: 0,
                            totalBonoCumplimiento: 0,
                            totalHorasAdicionales: 0,
                            totalBonoHoras: 0,
                            totalGeneral: 0,
                            productividadPromedio: 0,
                            totalRecursos: 0
                        }
                    );

                    if (encabezadoData.length > 0) {
                        summary.productividadPromedio = summary.productividadPromedio / encabezadoData.length;
                    }

                    set({
                        encabezado: encabezadoData,
                        detalle: detalleData,
                        productivitySummary: summary,
                        error: null,
                    });
                } else {
                    set({ error: data.Mensaje, encabezado: [], detalle: [], productivitySummary: null });
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                set({ error: error.message, encabezado: [], detalle: [], productivitySummary: null });
                throw error;
            }
        },
        analisisSemanal: async (period?: number) => {
            const { filtros } = get();
            if (!filtros.anio || !filtros.mes) {
                set({ error: 'El año y el mes son requeridos.' });
                return;
            }
            filtros.period = period ?? 1;
            try {
                const { data } = await withLoading(() =>
                    axios.post(urlAnalisisSemanal, filtros)
                );

                if (data.Exito) {
                    const encabezadoDictRaw = JSON.parse(data.LstEncabezado);
                    const detalleDictRaw = JSON.parse(data.LstDetalle);
                    const bugsDictRaw = JSON.parse(data.LstBugs);
                    const incidenciasDictRaw = JSON.parse(data.LstIncidencias);

                    // Convertir propiedades PascalCase → camelCase por cada entrada del diccionario
                    const encabezadoDict: Record<string, CompensacionEncabezado[]> = {};
                    for (const [semana, lista] of Object.entries(encabezadoDictRaw)) {
                        encabezadoDict[semana] = convertFromPascalCase<CompensacionEncabezado[]>(lista);
                    }

                    const detalleDict: Record<string, ActividadesModel[]> = {};
                    for (const [semana, lista] of Object.entries(detalleDictRaw)) {
                        detalleDict[semana] = convertFromPascalCase<ActividadesModel[]>(lista);
                    }
                    const detalleBugs: Record<string, ActividadesModel[]> = {};
                    for (const [semana, lista] of Object.entries(bugsDictRaw)) {
                        detalleBugs[semana] = convertFromPascalCase<ActividadesModel[]>(lista);
                    }
                    const incidencias: Record<string, UsuarioIncidencia[]> = {};
                    for (const [semana, lista] of Object.entries(incidenciasDictRaw)) {
                        incidencias[semana] = convertFromPascalCase<UsuarioIncidencia[]>(lista);
                    }

                    return [encabezadoDict, detalleDict, detalleBugs, incidencias];
                } else {
                    set({ error: data.Mensaje, encabezado: [], detalle: [], incidencias: [], productivitySummary: null });
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                set({ error: error.message, encabezado: [], detalle: [], incidencias: [], productivitySummary: null });
                throw error;
            }
        },

        showModal: (recurso) => set({ isModalVisible: true, selectedRecurso: recurso }),
        hideModal: () => set({ isModalVisible: false, selectedRecurso: null }),
    };
});
