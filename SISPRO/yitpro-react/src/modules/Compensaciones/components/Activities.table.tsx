import { Collapse, Switch, Table, Typography } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { ActividadesModel } from "../../../model/Actividad.model";
import type { CompensacionEncabezado } from "../../../model/compensaciones.model";

const { Link } = Typography;
const { Panel } = Collapse;

interface Props {
    actividades?: ActividadesModel[];
    recurso: CompensacionEncabezado | null;
}
const groupByProyecto = (data: ActividadesModel[]) => {
    const grouped: Record<string, ActividadesModel[]> = {};
    data.forEach(item => {
        const proyecto = item.proyectoStr || 'Sin proyecto';
        if (!grouped[proyecto]) grouped[proyecto] = [];
        grouped[proyecto].push(item);
    });
    return grouped;
};

const AcivitiesTable: React.FC<Props> = ({ actividades, recurso }) => {

    const columns = [
        {
            title: 'ID Actividad',
            dataIndex: 'idActividadStr',
            key: 'idActividadStr',
            render: (text: string, record: ActividadesModel) => (
                <Link onClick={() => {
                    if (window.ClickActivity) {
                        window.ClickActivity(record.idActividad);
                    } else {
                        console.warn('clickActivity function not found on window object.', record.idActividad);
                    }
                }}>{text}</Link>
            ),
        },
        {
            title: 'Tipo Actividad',
            dataIndex: 'tipoActividadStr',
            key: 'tipoActividadStr',
        },
        {
            title: 'Clasificación',
            dataIndex: 'clasificacionStr',
            key: 'clasificacionStr',
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
        {
            title: 'H. Asignadas',
            dataIndex: 'horasAsignadas',
            key: 'horasAsignadas',
            align: 'right' as const,
        },
        {
            title: 'H. Finales',
            dataIndex: 'horasFinales',
            key: 'horasFinales',
            align: 'right' as const,
        },
        {
            title: 'Fecha Término',
            dataIndex: 'fechaTermino',
            key: 'fechaTermino',
            align: 'center' as const,
            render: (text: string) => {
                return text ? dayjs(text).format('DD/MM/YYYY') : '';
            },
        },
    ];

    const [group, setGroup] = useState(false);

    const detalles = useMemo(
        () => actividades || [],
        [actividades]
    );

    const grouped = useMemo(() => groupByProyecto(detalles), [detalles]);

    return (<>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, justifyContent: 'flex-end' }}>
            <span
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setGroup(g => !g)}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setGroup(g => !g); }}
                aria-label="Agrupar por proyecto"
                role="button"
            >
                <Switch
                    checked={group}
                    onChange={setGroup}
                    size="small"
                    style={{ marginRight: 8, pointerEvents: 'none' }}
                    tabIndex={-1}
                />
                Agrupar por proyecto
            </span>
        </div>
        {group ? (
            <Collapse
                accordion={false}
                defaultActiveKey={-1}
                style={{ marginBottom: 16, marginTop: 16 }}
            >
                {Object.entries(grouped).map(([proyecto, acts]) => {
                    const totalActividades = detalles.length || 1;
                    const porcentaje = ((acts.length / totalActividades) * 100).toFixed(1);
                    return (
                        <Panel
                            header={
                                <span>
                                    <b>{proyecto}</b>
                                    <span style={{ fontWeight: 'normal', marginLeft: 12, fontSize: 13, color: '#888' }}>
                                        ({porcentaje}% del total)
                                    </span>
                                </span>
                            }
                            key={proyecto}
                        >
                            <AcivitiesTable
                                actividades={acts}
                                recurso={recurso}
                            />
                        </Panel>
                    );
                })}
            </Collapse>
        ) :
            (<Table
                dataSource={actividades}
                columns={columns}
                rowKey="idActividad"
                pagination={false}
                size="small"
                summary={pageData => {
                    const totalAsignadas = pageData.reduce((sum, record) => sum + (record.horasAsignadas || 0), 0);
                    const totalFinales = pageData.reduce((sum, record) => sum + (record.horasFinales || 0), 0);
                    return (
                        <Table.Summary>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3}>
                                    <b>Total de registros: {pageData.length}</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <b>Estandar del periodo: {recurso.estandarPeriodo}</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4} align="right">
                                    <b>{totalAsignadas.toFixed(2)}</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5} align="right">
                                    <b>{totalFinales.toFixed(2)}</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={6} align="right">
                                    <b> {recurso.productividad}%</b>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
            />)}
    </>
    )
};

export default AcivitiesTable;