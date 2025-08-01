import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');


export const formatMoney = (value: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

export const formatNumber = (value: number) =>
    new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

export const imageUrl = (clave: string | null | undefined) => clave
    ? `http://app.yitpro.com/Archivos/Fotos/${clave}.jpg`
    : undefined;

// Función para obtener iniciales
export const getInitials = (nombre: string) => {
    if (!nombre) return '';
    const parts = nombre.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD/MM/YYYY');
};

export const getMonthName = (month: number, year: number) => {
    const nombreMes= dayjs(`${year}-${month}-01`).format('MMMM');
    return `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}`;
};
