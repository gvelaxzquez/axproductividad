/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Divider, Modal, Select, Tabs } from 'antd';
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
const CustomXAxisTick: React.FC<{ x: number; y: number; payload: any; clave?: string }> = ({ x, y, payload, clave }) => {
    const imageUrl = clave
        ? `http://app.yitpro.com/Archivos/Fotos/${clave}.jpg`
        : undefined;

    // Función para obtener iniciales
    const getInitials = (nombre: string) => {
        if (!nombre) return '';
        const parts = nombre.trim().split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Usar Avatar de AntD siempre, con src para intentar cargar la imagen, y fallback a iniciales
    return (
        <g transform={`translate(${x},${y})`}>
            <foreignObject x={-16} y={0} width={32} height={32}>
                <Avatar
                    src={imageUrl}
                    style={{
                        width: 32,
                        height: 32,
                        fontSize: 16,
                        background: '#d9d9d9',
                        color: '#444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none'
                    }}
                >
                    {getInitials(payload.value)}
                </Avatar>
            </foreignObject>
            <text
                x={0}
                y={40}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize={12}
                fill="#333"
                style={{ pointerEvents: 'none' }}
            >
                {payload.value}
            </text>
        </g>
    );
}
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    const productividad = item.productividad?.toFixed(2) || '0.00';

    const labelMap: Record<string, string> = {
        diasLaborados: 'Días Laborados',
        diasIncidencias: 'Días Incidencia',
        estandarPeriodo: 'Estándar',
        horasSolicitadas: 'Asignadas',
        horasBugs: 'Bugs',
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
    const [bugs, setBugs] = useState<ActividadesModel[]>([]);
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
            console.log(payload);
            setRecurso({ recurso: payload.nombre, estandarPeriodo: payload.estandarPeriodo, productividad: payload.productividad } as CompensacionEncabezado);
            setActividades(payload.actividades || []);
            setIncidencias(payload.incidencias || []);
            setBugs(payload.bugs || []);
            setOpen(true);
        }
    };
    const hideModal = () => {
        setActividades([]);
        setBugs([]);
        setIncidencias([]);
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
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => handleClick(e.activePayload[0]?.payload)}
                                            key={`${modo}-${semana}`}
                                            data={datos}
                                            margin={{ top: 60, bottom: 80 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            {/* <XAxis dataKey="nombre" angle={-30} textAnchor="end" height={60} /> */}
                                            <XAxis
                                                dataKey="nombre"
                                                angle={-30}
                                                textAnchor="end"
                                                height={90}
                                                tick={props => (
                                                    <CustomXAxisTick
                                                        {...props}
                                                        clave={datos.find(d => d.nombre === props.payload.value)?.clave}
                                                    />
                                                )}
                                            />
                                            <YAxis
                                                domain={[0, Math.ceil(maxValue * 1.5)]}
                                                tickFormatter={(v) => `${v} hrs`}
                                            />
                                            <Tooltip content={<CustomTooltip />} />

                                            <Bar dataKey="diasLaborados"
                                                barSize={16}
                                                stackId="a"
                                                fill="#008cdd"
                                            />
                                            <Bar dataKey="diasIncidencias"
                                                barSize={16}
                                                stackId="a" fill="#6990a7ff" />
                                            <Bar
                                                dataKey="estandarPeriodo"
                                                fill="#7c2424ff"
                                                barSize={16} />
                                            <Bar
                                                dataKey="horasSolicitadas"
                                                fill="#69c0ff"
                                                barSize={16}
                                            // shape={<CustomAvatarBar semana={semana} />}
                                            />
                                            <Bar
                                                dataKey="horasLiberadas"
                                                fill="#82ca9d"
                                                stackId="b"
                                                barSize={16}
                                            />
                                            <Bar
                                                dataKey="horasBugs"
                                                fill="#ff4d4f"
                                                stackId="b"
                                                barSize={16}
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
                                            datos: tranformLista(lista, response[1][semana] || [], response[3][semana] || [], response[2][semana] || []),
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
                bugs={bugs}
            />
        </Modal>
    );
};

export default GraficaProductividadSemanal;
