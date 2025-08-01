import React from 'react';
import { Tooltip } from 'antd';
import type { ProyectoDistribucion } from '../../../model/UsuarioCostoMensual.model';

// Paleta más suave y neutra, se repite si hay más de 12 proyectos
const colorPalette = [
    '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
    '#EDC949', '#AF7AA1', '#FF9DA7', '#9C755F', '#BAB0AC',
    '#D37295', '#FABFD2', '#8CD17D', '#B6992D', '#499894',
    '#D4A6C8', '#A0CBE8', '#F1CE63'
];

const hashString = (str: string): number =>
    str.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

const proyectoColorMap: Record<string, string> = {};

const getProyectoColor = (proyecto: string): string => {
    if (proyectoColorMap[proyecto]) return proyectoColorMap[proyecto];

    const index = Math.abs(hashString(proyecto)) % colorPalette.length;
    const color = colorPalette[index];

    proyectoColorMap[proyecto] = color;
    return color;
};
const DistribucionBar: React.FC<{ distribucion: ProyectoDistribucion[] }> = ({ distribucion }) => {
    // Si hay más de 12 proyectos, los colores se repiten
    return (
        <div
            style={{
                display: 'flex',
                height: 12,
                width: '100%',
                overflow: 'hidden',
                borderRadius: 999,
                border: '1px solid #636363ff',
                backgroundColor: '#fff'
            }}
        >
            {distribucion.map((item) => (
                <Tooltip
                    key={item.proyecto}
                    title={`${item.proyecto}: ${item.porcentaje.toFixed(2)}%`}
                >
                    <div
                        style={{
                            width: `${item.porcentaje}%`,
                            backgroundColor: getProyectoColor(item.proyecto),
                            height: '100%',
                            transition: 'width 0.3s ease-in-out',
                            minWidth: item.porcentaje > 0 && item.porcentaje < 3 ? 8 : undefined, // para que los segmentos pequeños sean visibles
                        }}
                    />
                </Tooltip>
            ))}
        </div>
    );
};

export default DistribucionBar;
