import { Tooltip } from 'antd'; // Using Ant Design Tooltip for better UX
import React, { useState } from 'react';
import { ResponsiveContainer } from 'recharts'; // We still use ResponsiveContainer for SVG sizing
import type { SemanaData } from './GraficaProductividadSemanal.v1';
import DetalleModal from './DetalleModal';
import type { CompensacionEncabezado } from '../../../model/compensaciones.model';
import type { ActividadesModel } from '../../../model/Actividad.model';

type Props = {
    semanas: SemanaData[];
};

const ProductivityHeatmapTab: React.FC<Props> = ({ semanas }) => {
    const [selectedRecurso, setRecurso] = useState<CompensacionEncabezado | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [actividades, setActividades] = useState<ActividadesModel[]>([]);

    if (!semanas || semanas.length === 0) {
        return <p>No hay datos de productividad para mostrar el mapa de calor.</p>;
    }

    // Extract all unique individual names
    // Extract all unique individuals with their clave and nombre
    const allIndividuals = Array.from(
        new Map(
            semanas
                .flatMap(semana => semana.datos.map(d => ({ clave: d.clave, nombre: d.nombre })))
                .map(ind => [ind.clave, ind])
        ).values()
    ).sort((a, b) => a.nombre.localeCompare(b.nombre)); // Sort by name for consistency

    // Determine cell dimensions
    const cellWidth = 100; // Fixed width per week column
    const cellHeight = 30; // Fixed height per individual row
    const padding = 5;

    const svgWidth = (semanas.length * cellWidth) + 150; // Add space for names
    const svgHeight = (allIndividuals.length * cellHeight) + 50; // Add space for week headers

    // Function to get color based on productivity (Green scale)
    const getColor = (productivity: number) => {
        // Simple linear interpolation from light green to dark green
        // #E6FFED (very light green for 0%) to #1890FF (Ant Design Blue, or pick a darker green like #006400)
        // Let's use a green scale that highlights performance
        const r = Math.round(230 - (productivity / 100) * (230 - 0)); // From light to dark
        const g = Math.round(255 - (productivity / 100) * (255 - 100)); // Adjust green component
        const b = Math.round(237 - (productivity / 100) * (237 - 0)); // Adjust blue component
        // Simpler, just interpolate between two specific hex colors
        // From a very light green to a strong green
        const colorLow = [r, g, b]; // Light pastel green
        const colorHigh = [40, 150, 40];  // Darker green

        const getChannel = (channelLow: number, channelHigh: number) => {
            return Math.round(channelLow + (productivity / 100) * (channelHigh - channelLow));
        };

        const r_final = getChannel(colorLow[0], colorHigh[0]);
        const g_final = getChannel(colorLow[1], colorHigh[1]);
        const b_final = getChannel(colorLow[2], colorHigh[2]);

        return `rgb(${r_final},${g_final},${b_final})`;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (payload: any) => {
        if (payload) {
            setRecurso({ recurso: payload.nombre } as CompensacionEncabezado);
            setActividades(payload.actividades || []);
            setOpen(true);
        }
    };
    const hideModal = () => {
        setActividades([]);
        setOpen(false);
        setRecurso(null);
    };
    return (
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <ResponsiveContainer width={Math.max(svgWidth, 600)} height={Math.max(svgHeight, 300)}>
                <svg width={svgWidth} height={svgHeight}>
                    {/* Y-Axis Labels (Individual Names) */}
                    {allIndividuals.map(({ nombre, clave }, i) => {
                        const avatarUrl = `http://app.yitpro.com/Archivos/Fotos/${clave}.jpg`;
                        const avatarSize = 24;
                        const yCenter = cellHeight * (i + 1) + cellHeight / 2 + padding;

                        return (
                            <g key={`row-${nombre}`}>
                                <image
                                    href={avatarUrl}
                                    x={padding}
                                    y={yCenter - avatarSize / 2}
                                    width={avatarSize}
                                    height={avatarSize}
                                    clipPath={`url(#avatarClip-${clave})`}
                                />
                                <clipPath id={`avatarClip-${clave}`}>
                                    <circle
                                        cx={padding + avatarSize / 2}
                                        cy={yCenter}
                                        r={avatarSize / 2}
                                    />
                                </clipPath>
                                <text
                                    x={padding + avatarSize + 8}
                                    y={yCenter}
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                    fontSize="12"
                                    fill="#333"
                                >
                                    {nombre}
                                </text>
                            </g>
                        );
                    })}

                    {/* X-Axis Labels (Weeks) */}
                    {semanas.map((semanaData, weekIndex) => (
                        <text
                            key={`week-${semanaData.semana}`}
                            x={150 + cellWidth * weekIndex + cellWidth / 2}
                            y={padding + 15}
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="12"
                            fill="#333"
                        >
                            {semanaData.semana.replace('Semana ', 'S.')}
                            <title>{semanaData.rangoFechas}</title> {/* Full date range on hover */}
                        </text>
                    ))}

                    {/* Heatmap Cells */}
                    {semanas.map((semanaData, weekIndex) => {
                        return semanaData.datos.map((individualData) => {
                            const individualIndex = allIndividuals.findIndex(
                                ind => ind.clave === individualData.clave && ind.nombre === individualData.nombre
                            );
                            if (individualIndex === -1) return null; // Should not happen if allIndividuals is correct

                            const xPos = 150 + weekIndex * cellWidth;
                            const yPos = (individualIndex + 1) * cellHeight + padding; // +1 to account for week header row

                            const productivity = individualData.productividad;
                            const fillColor = getColor(productivity);

                            return (
                                <Tooltip
                                    key={`cell-${semanaData.semana}-${individualData.nombre}`}
                                    title={
                                        <div>
                                            <strong>{individualData.nombre}</strong><br />
                                            {semanaData.semana} ({semanaData.rangoFechas})<br />
                                            Productividad: {productivity.toFixed(1)}%
                                        </div>
                                    }
                                >
                                    <rect
                                        onClick={() => handleClick(individualData)}
                                        x={xPos + padding}
                                        y={yPos + padding}
                                        width={cellWidth - 2 * padding}
                                        height={cellHeight - 2 * padding}
                                        fill={fillColor}
                                        stroke="#ccc"
                                        strokeWidth="0.5"
                                        rx="3" // Rounded corners
                                        ry="3"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Tooltip>
                            );
                        });
                    })}
                </svg>
            </ResponsiveContainer>
            <DetalleModal
                visible={open}
                onClose={hideModal}
                recurso={selectedRecurso}
                actividades={actividades}
            />
        </div>
    );
};

export default ProductivityHeatmapTab;