/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';
import dayjs from 'dayjs';
import type { ProyectosModel } from '../../../model/Project.model';
import { convertFromPascalCase } from '../../../utils/convertPascal';
import type { FlujoPagoDetModel, FlujoPagoModel } from '../../../model/FlujoPago.model';
import { withLoading } from '../../../utils/withLoading';
// Definición de las interfaces de datos
export interface FlujoDetalle {
    id: number;
    fecha: string;
    monto: number;
    pagado: boolean;
    relacionId?: number | null;
}

interface FlujoPagosState {
    idFlujo: number | null;
    idPoliza: number | null;
    flujo: FlujoPagoModel | null;
    detalles: FlujoDetalle[];
    porcentajePagado: number;
    loading: boolean;
    error: string | null;
    indicadores: ProyectosModel | null,
    cargarFlujoDetalle: () => Promise<void>;
    guardarDatosFPD: (detalle: FlujoPagoDetModel) => Promise<void>;
    eliminarFPD: (idDetalle: number) => Promise<void>;


    guardarDatosFP: (datos: { fechaInicio?: string }) => Promise<void>;
    actualizarFecha: (idDetalle: number, nuevaFecha: Date) => Promise<void>;
    actualizarRelacion: (idDetalle: number, idRelacion: number) => Promise<void>;
}

// Función auxiliar para obtener el valor de inputs ocultos en el HTML
const getInputValue = (id: string): string => {
    const element = document.getElementById(id) as HTMLInputElement;
    return element ? element.value : '';
};

// Recuperar valores iniciales de inputs ocultos (rutas y IDs) del documento HTML
const initialFlujoIdValue = getInputValue('idFlujo');
const initialFlujoId = initialFlujoIdValue ? Number(initialFlujoIdValue) : null;
const initialPolizaIdValue = getInputValue('idPoliza');
const initialPolizaId = initialPolizaIdValue ? Number(initialPolizaIdValue) : null;

// Rutas de API (asumimos que existen elementos ocultos con estos IDs en la página Razor original)
const urlObtieneFlujoDetalle = '/Proyectos/ObtieneFlujoDetalle';
const urlGuardaFlujoPagoDetalle = '/Proyectos/GuardaFlujoPagoDetalle';
const urlEliminarFlujoPagoDetalle = '/Proyectos/EliminarFlujoPagoDetalle';


const urlGuardarFlujo = '/Proyectos/GuardaFlujoPago';
const urlGuardarFlujoPagoFechas = '/Proyectos/GuardaFlujoPagoFecha';


// Definición del store Zustand
const useFlujoPagosStore = create<FlujoPagosState>((set, get) => ({
    // Estado inicial
    indicadores: null,
    idFlujo: initialFlujoId && initialFlujoId !== 0 ? initialFlujoId : null,
    idPoliza: initialPolizaId || null,
    flujo: null,
    detalles: [],
    porcentajePagado: 0,
    loading: false,
    error: null,
    // Cargar datos generales del flujo de pagos (encabezado o resumen)
    cargarFlujoDetalle: async (): Promise<void> => {
        try {
            set({ loading: true });
            const idFlujo = get().idFlujo;
            if (!idFlujo) {
                // Si no hay idFlujo, no hay flujo que cargar
                set({ loading: false });
                return;
            }
            const { data } = await withLoading(
                () => axios.post(urlObtieneFlujoDetalle, { idFlujo }));
            const _indicadores = JSON.parse(data.Indicadores);
            const _flujo = JSON.parse(data.Flujo);
            const indicadores = convertFromPascalCase<ProyectosModel>(_indicadores);
            const flujo = convertFromPascalCase<FlujoPagoModel>(_flujo);

            set({
                indicadores,
                flujo,
                // flujoDetalle: flujo.FlujoDetalle ?? []
            });
        } catch (error: any) {
            set({ loading: false });
            // Si el flujo no existe, marcar idFlujo null; de lo contrario, guardar mensaje de error
            if (error.response && error.response.status === 404) {
                set({ flujo: null, idFlujo: null });
            } else {
                set({ error: error.message, flujo: null });
            }
            throw error;
        }
    },

    // Guardar (agregar) un nuevo pago al flujo de pagos (detalle)
    guardarDatosFPD: async (detalle: FlujoPagoDetModel): Promise<void> => {
        try {
            set({ loading: true });
            const idFlujo = get().idFlujo;
            if (!idFlujo) throw new Error('No hay un flujo de pagos seleccionado');
            await withLoading(
                () => axios.post(urlGuardaFlujoPagoDetalle, detalle),
                'Datos guardados correctamente',
                'Ocurrió un error al guardar el registro'
            );
            await get().cargarFlujoDetalle();
            set({ loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },
    eliminarFPD: async (idDetalle: number): Promise<void> => {
        try {
            set({ loading: true });
            const idFlujo = get().idFlujo;
            if (!idFlujo) throw new Error('No hay un flujo de pagos seleccionado');
            await withLoading(
                () => axios.post(urlEliminarFlujoPagoDetalle, { IdFlujoPagoDet: idDetalle }),
                'Registro eliminado correctamente',
                'Ocurrió un error al eliminar el registro'
            );
            await get().cargarFlujoDetalle();
            set({ loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },

    // Guardar (crear) un nuevo flujo de pagos
    guardarDatosFP: async (datos: { fechaInicio?: string }): Promise<void> => {
        try {
            set({ loading: true });
            const idPoliza = get().idPoliza;
            const payload = { idPoliza, ...datos };
            const response = await axios.post(urlGuardarFlujo, payload);
            const nuevoFlujo = response.data;
            // Asumimos que la respuesta incluye el ID del nuevo flujo creado
            if (nuevoFlujo && nuevoFlujo.id) {
                set({ idFlujo: nuevoFlujo.id, flujo: nuevoFlujo });
            }
            set({ loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },

    // Actualizar la fecha programada de un pago (detalle) existente
    actualizarFecha: async (idDetalle: number, nuevaFecha: Date): Promise<void> => {
        try {
            set({ loading: true });
            const fechaStr = dayjs(nuevaFecha).format('YYYY-MM-DD');
            await axios.post(urlGuardarFlujoPagoFechas, { idDetalle, nuevaFecha: fechaStr });
            // Actualizar la fecha en el estado local
            set(state => ({
                loading: false,
                detalles: state.detalles.map(d =>
                    d.id === idDetalle ? { ...d, fecha: fechaStr } : d
                )
            }));
        } catch (error: any) {
            set({ loading: false, error: error.message });
            throw error;
        }
    },

    // Actualizar la relación de un pago (vincular un detalle con un pago real efectuado)
    actualizarRelacion: async (idDetalle: number, idRelacion: number): Promise<void> => {
        try {
            set({ loading: true });
            await axios.post(urlEliminarFlujoPagoDetalle, { idDetalle, idRelacion });
            // Marcar el detalle como pagado en el estado local y recalcular el porcentaje
            set(state => {
                const detallesActualizados = state.detalles.map(d =>
                    d.id === idDetalle ? { ...d, relacionId: idRelacion, pagado: true } : d
                );
                const total = detallesActualizados.reduce((sum, d) => sum + d.monto, 0);
                const totalPagado = detallesActualizados.filter(d => d.pagado).reduce((sum, d) => sum + d.monto, 0);
                const porcentaje = total > 0 ? Math.round((totalPagado / total) * 100) : 0;
                return { detalles: detallesActualizados, porcentajePagado: porcentaje, loading: false };
            });
        } catch (error: any) {
            set({ loading: false, error: error.message });
            throw error;
        }
    }
}));

export default useFlujoPagosStore;
