export interface ProyectoDistribucion {
    proyecto: string;
    porcentaje: number;
}

export interface UsuarioCosto {
    clave: string;
    nombre: string;
    nombreMes: string;
    anio: number;
    costoMensual: number;
    lstDistrbucion: ProyectoDistribucion[];
    idUsuario: number;
    idULider?: number | null;
    idUsuarioCosto: number;
    costoHora: number;
}

export interface UsuarioNodo extends UsuarioCosto {
    hijos?: UsuarioNodo[];
}

export interface UsuarioCostoDistribucion {
    idUsuarioCostoD: number;
    anio: number;
    mes: number;
    idUsuario: number;
    idProyecto: number;
    proyecto: string;
    porcentaje: number;
    idUCreo: number | null;
    fechaCreo: string | null;
    claveProy: string;
    nombreMes: string;
    clave: string;
    recurso: string;
    totalMes: number;
}
export interface CostoAnualModel {
    mes: number;
    nombreMes: string;
    totalCosto: number;
    totalRecursos: number;
}