import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { CompensacionEncabezado } from '../../model/compensaciones.model';
import type { ActividadesModel } from '../../model/Actividad.model';

export function exportarCompensacionesExcel(encabezados: CompensacionEncabezado[], detalle: ActividadesModel[], fileName: string) {
    const columnasResumen = [
        { key: 'clave', label: 'Clave' },
        { key: 'recurso', label: 'Recurso' },
        { key: 'lider', label: 'Líder' },
        { key: 'estandarMes', label: 'Estandár mes' },
        { key: 'horasSolicitadas', label: 'Horas solicitadas' },
        { key: 'horasLiberadas', label: 'Horas liberadas' },
        { key: 'bonoCumplimiento', label: 'Bono cumplimiento' },
        { key: 'horasAdicionales', label: 'Horas adicionales' },
        { key: 'bonoHoras', label: 'Bono horas' },
        { key: 'total', label: 'Total' },
        { key: 'productividad', label: 'Productividad' },
    ];

    const wb = XLSX.utils.book_new();

    // Hoja resumen
    const resumen = encabezados.map(item =>
        columnasResumen.reduce((acc, col) => {
            acc[col.label] = item[col.key] ?? '';
            return acc;
        }, {} as Record<string, CompensacionEncabezado>)
    );
    const wsResumen = XLSX.utils.json_to_sheet(resumen);
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

    // Hojas por recurso
    encabezados.forEach(recurso => {
        const tareas = detalle.filter(d => d.idUsuarioAsignado === recurso.idUsuario);
        if (tareas.length === 0) return;

        const detalleData = tareas.map((tarea: ActividadesModel) => ({
            'ID Actividad': tarea.idActividadStr,
            'Tipo Actividad': tarea.tipoActividadStr,
            'Clasificación': tarea.clasificacionStr,
            'Descripción': tarea.descripcion,
            'H. Asignadas': tarea.horasAsignadas,
            'H. Finales': tarea.horasFinales,
            'Fecha Término': tarea.fechaTermino
                ? XLSX.SSF.format('dd/mm/yyyy', new Date(tarea.fechaTermino))
                : '',
        }));

        const nombreHoja = `${recurso.clave} - ${recurso.recurso}`.substring(0, 31);
        const wsDetalle = XLSX.utils.json_to_sheet(detalleData);
        XLSX.utils.book_append_sheet(wb, wsDetalle, nombreHoja);
    });

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
}
