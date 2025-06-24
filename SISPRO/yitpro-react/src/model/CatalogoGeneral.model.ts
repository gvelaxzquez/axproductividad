export interface CatalogoGeneralModel {
    idCatalogo: number;
    idCatalogoN: number | null;
    idTabla: number;
    descCorta: string;
    descLarga: string;
    datoEspecial: string;
    cabecera: boolean;
    protegido: boolean;
    activo: boolean;
}