/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider, Modal, Select, Tabs } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from 'recharts';
import type { ActividadesModel } from '../../../model/Actividad.model';
import type { CompensacionEncabezado, UsuarioIncidencia } from '../../../model/compensaciones.model';
import { useCompensacionesStore } from '../store/compensaciones.store';
import { getPeriodoName, getPeriodoRange, getPeriodoRangeName, tranformLista } from '../utils';
import DetalleModal from './DetalleModal';
import ProductivityHeatmapTab from './ProductivityHeatmapTab';

export type SemanaData = {
    semana: string; // Ej: "Semana 27"
    rangoFechas: string; // Ej: "01 Jul - 07 Jul"
    datos: {
        id: number;
        nombre: string;
        productividad: number;
        clave: string;
        actividades: ActividadesModel[];
        estandarPeriodo: number;
        horasSolicitadas: number;
        horasLiberadas: number;
        incidencias?: UsuarioIncidencia[];
    }[];
};

type Props = {
    visible: boolean;
    onClose: () => void;
    semanas: SemanaData[];
};
const CustomAvatarBar = (props: any) => {
    const { x, y, width, height, payload, semana, viewBox } = props;
    const _semana = semana.split(' ')[1];
    const imageUrl = `http://app.yitpro.com/Archivos/Fotos/${payload.clave}.jpg`;

    const pinOffset = 38;
    const radius = 21;
    if (x == null || y == null || isNaN(x) || isNaN(y)) return null;
    const centerX = width > 0 ? x + width / 2 : viewBox?.x || x;
    if (!payload || !payload.clave || !Number.isFinite(x) || !Number.isFinite(y)) return null;


    return (
        <>
            <rect x={x} y={y} width={width} height={height} fill="#82ca9d" />
            <g style={{ cursor: 'pointer' }}>
                <circle
                    cx={centerX}
                    cy={y - pinOffset}
                    r={radius}
                    fill="#fff"
                    stroke="#82ca9d"
                    strokeWidth={3}
                />
                <clipPath id={`avatarClip-${payload.clave}-${_semana}`}>
                    <circle cx={centerX} cy={y - pinOffset} r={radius} />
                </clipPath>
                <image
                    href={imageUrl}
                    x={centerX - radius}
                    y={y - pinOffset - radius}
                    width={radius * 2}
                    height={radius * 2}
                    clipPath={`url(#avatarClip-${payload.clave}-${_semana})`}
                    preserveAspectRatio="xMidYMid slice"
                />
            </g>
            <polygon
                points={`
                    ${centerX - 8},${y - pinOffset + radius}
                    ${centerX + 8},${y - pinOffset + radius}
                    ${centerX},${y - pinOffset + radius + 16}
                `}
                fill="#82ca9d"
            />
        </>
    );
};
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    const productividad = item.productividad?.toFixed(2) || '0.00';

    console.log(item.estandarDiario)

    const labelMap: Record<string, string> = {
        diasLaborados: 'Días Laborados',
        diasIncidencias: 'Días Incidencia',
        estandarPeriodo: 'Estándar',
        horasSolicitadas: 'Solicitadas',
        horasLiberadas: 'Liberadas'
    };

    return (
        <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: 10 }}>
            <strong>{label}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0' }}>
                {payload.slice(0, 2).map((entry, index) => {
                    const dias = entry.value / item.estandarDiario;
                    return (dias > 0 &&
                        <li key={index} style={{ color: entry.color }}>
                            {labelMap[entry.name] || entry.name} : {dias} {`${dias === 1 ? 'día' : 'días'}`}
                        </li>
                    )
                })}
                <Divider />
                {payload.slice(2).map((entry, index) => (
                    <li key={index} style={{ color: entry.color }}>
                        {labelMap[entry.name] || entry.name} : {entry.value} hrs
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: 4 }}>
                <b>Productividad:</b> {productividad}%
            </div>
        </div>
    );
};

const GraficaProductividadSemanal: React.FC<Props> = ({ semanas, visible, onClose }) => {
    const { filtros, analisisSemanal } = useCompensacionesStore();
    const [selectedRecurso, setRecurso] = useState<CompensacionEncabezado | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [actividades, setActividades] = useState<ActividadesModel[]>([]);
    const [incidencias, setIncidencias] = useState<UsuarioIncidencia[]>([]);
    const [_semanas, setSemanas] = useState<SemanaData[]>(semanas);
    const [modo, setModo] = useState(1);
    useEffect(() => {
        setSemanas(semanas);
        return () => {
            setSemanas([]);
            setModo(1);
        }
    }, [semanas]);
    const handleClick = (payload: any) => {
        if (payload) {
            setRecurso({ recurso: payload.nombre, estandarPeriodo: payload.estandarPeriodo, productividad: payload.productividad } as CompensacionEncabezado);
            setActividades(payload.actividades || []);
            setIncidencias(payload.incidencias || []);
            setOpen(true);
        }
    };
    const hideModal = () => {
        setActividades([]);
        setOpen(false);
        setRecurso(null);
    };
    const items = [
        {
            key: 'bar_charts',
            label: `Productividad ${getPeriodoRangeName(modo)} (Gráficos de Barras)`,
            children: (
                <>
                    {_semanas && _semanas.map(({ semana, rangoFechas, datos }) => {
                        // Calcular el máximo valor entre los campos relevantes
                        const maxValue = Math.max(
                            ...datos.flatMap(d => [
                                d.estandarPeriodo ?? 0,
                                d.horasSolicitadas ?? 0,
                                d.horasLiberadas ?? 0
                            ])
                        );
                        return (
                            <div key={semana} style={{ width: '100%', height: 400, marginBottom: 40 }}>
                                <h3>{semana} <span style={{ fontWeight: 'normal' }}>({rangoFechas})</span></h3>
                                {datos.length > 0 && (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            key={`${modo}-${semana}`}
                                            data={datos}
                                            margin={{ top: 60, bottom: 80 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="nombre" angle={-30} textAnchor="end" height={60} />
                                            <YAxis
                                                domain={[0, Math.ceil(maxValue * 1.5)]}
                                                tickFormatter={(v) => `${v} hrs`}
                                            />
                                            <Tooltip content={<CustomTooltip />} />

                                            <Bar dataKey="diasIncidencias"
                                                barSize={16}
                                                stackId="a" fill="#6990a7ff" />
                                            <Bar dataKey="diasLaborados"
                                                barSize={16}
                                                stackId="a"
                                                fill="#008cdd"
                                            />
                                            <Bar
                                                dataKey="estandarPeriodo"
                                                fill="#7c2424ff"
                                                barSize={16}
                                                onClick={(e) => handleClick(e)} />
                                            <Bar
                                                dataKey="horasSolicitadas"
                                                fill="#82ca9d"
                                                barSize={16}
                                                onClick={(e) => handleClick(e)}
                                                shape={<CustomAvatarBar semana={semana} />}
                                            />
                                            <Bar
                                                dataKey="horasLiberadas"
                                                fill="#69c0ff"
                                                barSize={16}
                                                onClick={(e) => handleClick(e)}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        );
                    })}
                </>
            ),
        },
        {
            key: 'heatmap',
            label: 'Movimiento de Productividad (Mapa de Calor)',
            children: <ProductivityHeatmapTab semanas={_semanas} />,
        },
    ];

    return (
        <Modal
            title={
                <div style={{ width: '95%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>Análisis de productividad</Title>
                    <Select
                        value={modo}
                        onChange={(nuevoModo) => {
                            setModo(nuevoModo);
                            analisisSemanal(nuevoModo).then(response => {
                                const periodo = getPeriodoName(nuevoModo);
                                const semanasData: SemanaData[] = Object.entries(response[0]).map(
                                    ([semanaStr, lista]: [string, any[]]) => {
                                        const semana = parseInt(semanaStr);
                                        return {
                                            semana: `${periodo} ${semana}`,
                                            rangoFechas: getPeriodoRange(semana, periodo.toLocaleLowerCase() as 'semana' | 'quincena' | 'mes', filtros.anio, filtros.mes),
                                            datos: tranformLista(lista, response[1][semana] || [], response[2][semana] || [])
                                        };
                                    }
                                );
                                setSemanas(semanasData);
                            });
                        }}
                        options={[
                            { value: 1, label: 'Semanal' },
                            { value: 2, label: 'Quincenal' },
                            { value: 3, label: 'Mensual' },
                        ]}
                        style={{ width: 150 }}
                    />
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={"80%"}
        >
            <Tabs defaultActiveKey="bar_charts" items={items} />
            <DetalleModal
                visible={open}
                onClose={hideModal}
                recurso={selectedRecurso}
                actividades={actividades}
                incidencias={incidencias}
            />
        </Modal>
    );
};

export default GraficaProductividadSemanal;
