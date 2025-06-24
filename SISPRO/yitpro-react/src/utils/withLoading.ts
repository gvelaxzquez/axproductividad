/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd';

declare global {
    interface Window {
        CargaLoading: () => void;
        FinalizaLoading: () => void;
    }
}

/**
 * Ejecuta una promesa envuelta con loading visual y manejo de errores.
 * 
 * @param asyncFn función que retorna una promesa
 * @param showSuccess mensaje de éxito (opcional)
 * @param showError mensaje de error (si la promesa falla)
 * @returns resultado de la promesa original
 */
export async function withLoading<T>(
    asyncFn: () => Promise<T>,
    showSuccess?: string,
    showError?: string
): Promise<T | undefined> {
    try {
        window.CargaLoading();
        const result = await asyncFn();
        if (showSuccess) {
            notification.success({ message: showSuccess });
        }
        return result;
    } catch (error: any) {
        console.error(error);
        if (showError) {
            notification.error({ message: showError });
        }
        return undefined;
    } finally {
        window.FinalizaLoading();
    }
}
