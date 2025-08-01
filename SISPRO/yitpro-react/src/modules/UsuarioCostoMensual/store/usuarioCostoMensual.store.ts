import axios from 'axios';
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { saveAs } from 'file-saver';
import { create } from "zustand";
import type { CatalogoGeneralModel } from "../../../model/CatalogoGeneral.model";
import type { CostoAnualModel, UsuarioCosto, UsuarioCostoDistribucion } from "../../../model/UsuarioCostoMensual.model";
import { convertFromPascalCase } from "../../../utils/convertPascal";
import { withLoading } from "../../../utils/withLoading";

dayjs.locale('es');

export const apiRoutes = {
    obtenerCostos: "/Usuarios/ObtieneUsuarioCostoMensual",
    obtenerCostosAnual: "/Usuarios/ObtieneUsuarioCostoAnual",
    obtenerUsuariosFaltantes: "/Usuarios/LeerUsuarioCostoFaltante",
    crearCosto: "/Usuarios/CrearUsuarioCosto",
    editarCosto: "/Usuarios/EditarUsuarioCosto",
    descargarCostos: "/Usuarios/DescargarExcelUsuarioCostoMensual",
    descargarFormato: "/Usuarios/DescargarExcelEjemploUsuarioCostoMensual",
    importarCostos: "/Usuarios/ImportarUsuarioCostoMensual",
    obtenerDistribucion: "/Usuarios/ObtieneDistribucionCosto",
    guardarDistribucion: "/Usuarios/GuardarDistribucionCosto",
    eliminarDistribucionUsuario: "/Usuarios/EliminaDistribucionCosto",

};

interface UsuarioCostoState {
    anio: number;
    mes: number;
    total: number;
    totalAnual: number;
    data: UsuarioCosto[];
    dataAnual: CostoAnualModel[];
    distribucion: UsuarioCostoDistribucion[];
    proyectos: CatalogoGeneralModel[];
    error: string | null;

    distribucionesPorUsuario: Record<number, UsuarioCostoDistribucion[]>;
    usuariosConfirmados: number[];
    setUsuariosConfirmados: (idUsuario: number, toAdd: boolean) => void;
    cargarDistribucionUsuarios: () => Promise<void>;
    setDistribucionPorUsuario: (idUsuario: number, distribucion: UsuarioCostoDistribucion[]) => void;


    setAnio: (anio: number) => void;
    setMes: (mes: number) => void;
    fetchCostos: () => Promise<void>;
    fetchCostosAnual: () => Promise<void>;
    exportCostos: () => Promise<void>;
    importCostos: (formData: FormData) => Promise<void>;
    eliminarDistribucionUsuario: (idUsuario: number) => Promise<void>;
    setProyectos: (proyectos: CatalogoGeneralModel[]) => void;
    leerDistribucionCostos: (idUsuario: number) => Promise<void>;
    guardarDistribucionCostos: (idUsuario: number) => Promise<void>;
    setDistribucion: (data: UsuarioCostoDistribucion[]) => void;
    agregarProyectoDistribucion: (idUsuario: number) => void;
    eliminarProyectoDistribucion: (idProyecto: number) => Promise<void>;
    recalcularDistribucionAutomatica: () => void;
    guardarDistribucionCostosMasiva: () => Promise<void>;

}

const fechaReferencia = new Date();
fechaReferencia.setMonth(fechaReferencia.getMonth() - 1);

export const useUsuarioCostoStore = create<UsuarioCostoState>((set, get) => ({
    anio: fechaReferencia.getFullYear(),
    mes: fechaReferencia.getMonth() + 1,
    total: 0,
    totalAnual: 0,
    data: [],
    dataAnual: [],
    distribucion: [],
    proyectos: [],
    error: null,
    distribucionesPorUsuario: {},
    usuariosConfirmados: [],
    setAnio: (anio) => set({ anio }),
    setMes: (mes) => set({ mes }),
    setProyectos: (proyectos) => set({ proyectos }),
    fetchCostos: async () => {
        const { anio, mes } = get();
        set({ error: null });

        try {
            const { data } = await withLoading(() =>
                axios.post(apiRoutes.obtenerCostos, { Anio: anio, Mes: mes })
            );
            const parsedData = convertFromPascalCase<UsuarioCosto[]>(data.LstCostosUsuario);
            const res = parsedData;


            if (data.Exito) {
                set({ data: res, total: data.Total, usuariosConfirmados: [], distribucionesPorUsuario: {} });
            } else {
                set({ error: "Error obteniendo costos" });
            }
        } catch (err) {
            console.error(err);
            set({ error: 'Error en el servidor' });
        }
    },
    fetchCostosAnual: async () => {
        const { anio } = get();
        set({ error: null });

        try {
            const { data } = await withLoading(() =>
                axios.post(apiRoutes.obtenerCostosAnual, { Anio: anio })
            );
            const parsedData = convertFromPascalCase<CostoAnualModel[]>(data.LstCostosUsuario);
            const res = parsedData;


            if (data.Exito) {
                set({ dataAnual: res, totalAnual: data.Total });
            } else {
                set({ error: "Error obteniendo costos" });
            }
        } catch (err) {
            console.error(err);
            set({ error: 'Error en el servidor' });
        }
    },
    importCostos: async (formData: FormData) => {
        const { fetchCostos, fetchCostosAnual } = get();
        try {
            await withLoading(() =>
                axios.postForm(apiRoutes.importarCostos, formData),
                "Costos cargados correctamente"
            );
            await fetchCostos();
            await fetchCostosAnual();

        } catch (err) {
            console.error(err);
            set({ error: 'Error en el servidor' });
        }
    },
    eliminarDistribucionUsuario: async (idUsuario: number) => {
        const { fetchCostos, fetchCostosAnual } = get();
        const { anio, mes } = get();
        try {
            const payload = {
                Anio: anio,
                Mes: mes,
                IdUsuario: idUsuario
            };
            await withLoading(() =>
                axios.postForm(apiRoutes.eliminarDistribucionUsuario, payload),
                "Registro eliminado correctamente"
            );
            await fetchCostos();
            await fetchCostosAnual();

        } catch (err) {
            console.error(err);
            set({ error: 'Error en el servidor' });
        }
    },
    exportCostos: async () => {
        const { anio, mes } = get();
        set({ error: null });

        try {
            const nombreMes = dayjs(`${anio}-${mes}-01`).format('MMMM');
            const fileName = `Costos ${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${anio}.xlsx`;

            const { data } = await withLoading(() =>
                axios.postForm(apiRoutes.descargarCostos,
                    { Anio: anio, Mes: mes },
                    { responseType: 'blob' }),
                "Costos cargados correctamente"
            );
            saveAs(data, fileName);
        } catch (err) {
            console.error(err);
            set({ error: 'Error en el servidor' });
        }
    },

    leerDistribucionCostos: async (idUsuario: number) => {
        try {
            const { anio, mes } = get();
            const payload = {
                Anio: anio,
                Mes: mes,
                IdUsuario: idUsuario
            };
            const { data } = await withLoading(() =>
                axios.post(apiRoutes.obtenerDistribucion, payload)
            );
            const parsedData = convertFromPascalCase<UsuarioCostoDistribucion[]>(data.LstCosto);

            if (data.Exito) {
                set({ distribucion: parsedData });
            } else {
                set({ error: "Error obteniendo costos" });
            }
        } catch (error) {
            console.error('Error en el servidor al obtener distribución:', error);
        }
    },
    guardarDistribucionCostos: async (idUsuario: number) => {
        try {
            const { anio, mes, distribucion, fetchCostos } = get();
            const payload = {
                Anio: anio,
                Mes: mes,
                IdUsuario: idUsuario,
                LstCosto: distribucion
            };
            const { data } = await withLoading(() =>
                axios.post(apiRoutes.guardarDistribucion, payload),
                "Distribución guardada correctamente"
            );

            if (data.Exito) {
                set({ distribucion: [] });
                await fetchCostos();
            } else {
                set({ error: "Error obteniendo costos" });
            }

        } catch (error) {
            console.error('Error en el servidor al obtener distribución:', error);
        }
    },
    setDistribucion: (data) => set({ distribucion: data }),
    agregarProyectoDistribucion: (idUsuario: number) => {
        const ctx = get();
        if (!ctx) return;

        const nuevaDistribucion: UsuarioCostoDistribucion = {
            idUsuarioCostoD: 0,
            anio: ctx.anio,
            mes: ctx.mes,
            idUsuario: idUsuario,
            idProyecto: null,
            proyecto: '',
            porcentaje: 0,
            idUCreo: null,
            fechaCreo: null,
            claveProy: '',
            nombreMes: '',
            clave: '',
            recurso: '',
            totalMes: 0
        };

        set((state) => ({
            distribucion: [...state.distribucion, nuevaDistribucion]
        }));
    },
    eliminarProyectoDistribucion: async (idProyecto: number) =>
        set((state) => ({
            distribucion: state.distribucion.filter(p => p.idProyecto !== idProyecto)
        })),
    recalcularDistribucionAutomatica: () =>
        set((state) => {
            const proyectos = state.distribucion;
            const total = 100;
            const n = proyectos.length;

            if (n === 0) return {};

            const base = Math.floor((total / n) * 100) / 100; // 2 decimales truncados
            const acumulado = base * (n - 1);
            const restante = parseFloat((total - acumulado).toFixed(2)); // último valor compensado

            const nuevaDistribucion = proyectos.map((p, index) => ({
                ...p,
                porcentaje: index === n - 1 ? restante : base
            }));

            return { distribucion: nuevaDistribucion };
        }),

    cargarDistribucionUsuarios: async () => {
        const store = get();

        const promesas: Promise<void>[] = [];
        store.usuariosConfirmados = [];
        for (const u of store.data) {
            if (store.distribucionesPorUsuario[u.idUsuario]) continue;

            const promesa = axios.post(apiRoutes.obtenerDistribucion, {
                Anio: store.anio,
                Mes: store.mes,
                IdUsuario: u.idUsuario
            }).then(({ data }) => {
                const parsedData = convertFromPascalCase<UsuarioCostoDistribucion[]>(data.LstCosto);

                if (data.Exito) {
                    set((state) => ({
                        distribucionesPorUsuario: {
                            ...state.distribucionesPorUsuario,
                            [u.idUsuario]: parsedData
                        }
                    }));
                }
            }).catch(err => {
                console.error(`Error cargando distribución para ${u.nombre}`, err);
            });

            promesas.push(promesa);
        }

        // Ejecutamos todas las peticiones con un solo withLoading
        await withLoading(() => Promise.all(promesas));
    },
    guardarDistribucionCostosMasiva: async () => {
        try {
            const { anio, mes, distribucionesPorUsuario, fetchCostos } = get();

            // Creamos un arreglo de promesas de guardado por usuario
            const promesas: Promise<void>[] = [];

            for (const [idUsuario, distribucion] of Object.entries(distribucionesPorUsuario)) {
                if (!distribucion || distribucion.length === 0) continue;

                const payload = {
                    Anio: anio,
                    Mes: mes,
                    IdUsuario: Number(idUsuario),
                    LstCosto: distribucion
                };

                const promesa = axios.post(apiRoutes.guardarDistribucion, payload)
                    .then(({ data }) => {
                        if (!data.Exito) {
                            console.warn(`Error al guardar distribución del usuario ${idUsuario}`);
                        }
                    })
                    .catch(err => {
                        console.error(`Error al guardar distribución del usuario ${idUsuario}:`, err);
                    });

                promesas.push(promesa);
            }

            await withLoading(() => Promise.all(promesas), "Distribuciones guardadas correctamente");

            set({ distribucionesPorUsuario: {} });
            await fetchCostos();

        } catch (error) {
            console.error("Error en el guardado masivo de distribuciones:", error);
        }
    },

    setDistribucionPorUsuario: (idUsuario, distribucion) =>
        set((state) => ({
            distribucionesPorUsuario: {
                ...state.distribucionesPorUsuario,
                [idUsuario]: distribucion
            }
        })),
    setUsuariosConfirmados: (idUsuario, toAdd) => set(state => {
        const exists = state.usuariosConfirmados.includes(idUsuario)
        return {
            usuariosConfirmados: toAdd
                // si queremos añadir y aún no existe, lo agregamos
                ? exists
                    ? state.usuariosConfirmados
                    : [...state.usuariosConfirmados, idUsuario]
                // si queremos quitar, lo filtramos
                : exists
                    ? state.usuariosConfirmados.filter(id => id !== idUsuario)
                    : state.usuariosConfirmados
        }
    }),
}));