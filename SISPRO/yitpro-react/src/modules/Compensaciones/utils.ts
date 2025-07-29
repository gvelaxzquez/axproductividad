/* eslint-disable @typescript-eslint/no-explicit-any */
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
export function getPeriodoName(tipoPeriodo: number): 'Semana' | 'Quincena' | 'Mes' {
    return tipoPeriodo === 1 ? 'Semana' : tipoPeriodo === 2 ? 'Quincena' : 'Mes';
}
export function getPeriodoRangeName(tipoPeriodo: number): string {
    return tipoPeriodo === 1 ? 'Semanal' : tipoPeriodo === 2 ? 'Quincenal' : 'Mensual';
}
export function getPeriodoRange(
    periodo: number,
    tipo: 'semana' | 'quincena' | 'mes',
    year: number,
    month?: number
): string {
    const formatRangeSameMonth = (start: Date, end: Date): string => {
        const dayFormat = (d: Date) =>
            d.toLocaleDateString("es-MX", { day: "2-digit" });

        const monthFormat = (d: Date) =>
            d.toLocaleDateString("es-MX", { month: "long" }).replace('.', '');

        return `${dayFormat(start)}-${dayFormat(end)} ${capitalize(monthFormat(end))}`;
    };

    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);


    if (tipo === 'semana') {
        // Obtener lunes de la semana 1 (basado en el 4 de enero)
        const jan4 = new Date(year, 0, 4);
        const dayOfWeek = jan4.getDay(); // 0 (domingo) a 6 (sábado)
        const dayOffset = (dayOfWeek + 6) % 7; // 0 (lunes) a 6 (domingo)
        const week1Start = new Date(jan4);
        week1Start.setDate(jan4.getDate() - dayOffset);
        // Ajustar el rango para que start y end estén dentro del mes especificado (si se proporciona)
        const start = new Date(week1Start);
        start.setDate(week1Start.getDate() + (periodo - 1) * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        if (month !== undefined) {
            // month: 1-based (enero = 1)
            const mes = month - 1;
            const mesStart = new Date(year, mes, 1);
            const mesEnd = new Date(year, mes + 1, 0);

            // Si start es antes del inicio del mes, ajusta al primer día del mes
            if (start < mesStart) {
                start.setTime(mesStart.getTime());
            }
            // Si end es después del último día del mes, ajusta al último día del mes
            if (end > mesEnd) {
                end.setTime(mesEnd.getTime());
            }
        }

        return `${formatRangeSameMonth(start, end)}`;
    }

    if (tipo === 'quincena') {
        const mes = Math.floor((periodo - 1) / 2); // 0-based month
        const esPrimera = periodo % 2 === 1;

        const start = new Date(year, mes, esPrimera ? 1 : 16);
        const end = esPrimera
            ? new Date(year, mes, 15)
            : new Date(year, mes + 1, 0); // Día 0 del mes siguiente = último del mes actual

        return `${formatRangeSameMonth(start, end)}`;
    }

    if (tipo === 'mes') {
        const mes = periodo - 1; // 0-based
        const start = new Date(year, mes, 1);
        const end = new Date(year, mes + 1, 0);

        return `${formatRangeSameMonth(start, end)}`;
    }

    return '';
}

export function tranformLista(lista: any[], actividades: any[], incidencias: any[], bugs: any[]): any[] {
    return lista.map(item => { 
        return ({
        nombre: item.recurso,
        estandarPeriodo: item.estandarPeriodo,
        estandarDiario: item.estandarDiario,
        horasLiberadas: item.horasLiberadas,
        horasSolicitadas: item.horasSolicitadas,
        horasBugs: item.horasBugs ?? 0,
        productividad: parseFloat(item.productividad?.replace('%', '') || '0'),
        diasLaborados: +item.estandarDiario * (item.diasLaborales - item.incidencias || 0),
        diasIncidencias: (item.incidencias || 0) * +item.estandarDiario,
        clave: item.clave,
        id: item.idUsuario,
        actividades: actividades.filter((actividad: any) => actividad.idUsuarioAsignado === item.idUsuario),
        incidencias: incidencias.filter((incidencia: any) => incidencia.idUsuario === item.idUsuario),
        bugs: bugs.filter((bug: any) => bug.idUsuarioAsignado === item.idUsuario),
    })})
}
