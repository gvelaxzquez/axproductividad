import React, { useMemo, useState } from 'react';
import { Modal, Table, Typography, Switch, Collapse } from 'antd';
import dayjs from 'dayjs';
import type { ActividadesModel } from '../../../model/Actividad.model';
import type { CompensacionEncabezado, UsuarioIncidencia } from '../../../model/compensaciones.model';
import { useCompensacionesStore } from '../store/compensaciones.store';
import DetalleIncidencias from './DetalleIncidencias';

const { Title, Link } = Typography;
const { Panel } = Collapse;

interface Props {
    visible: boolean;
    onClose: () => void;
    recurso: CompensacionEncabezado | null;
    actividades?: ActividadesModel[];
    incidencias?: UsuarioIncidencia[];
}

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

const groupByProyecto = (data: ActividadesModel[]) => {
    const grouped: Record<string, ActividadesModel[]> = {};
    data.forEach(item => {
        const proyecto = item.proyectoStr || 'Sin proyecto';
        if (!grouped[proyecto]) grouped[proyecto] = [];
        grouped[proyecto].push(item);
    });
    return grouped;
};

const DetalleModal: React.FC<Props> = ({ visible, onClose, recurso, actividades, incidencias }) => {
    const { detalle } = useCompensacionesStore();
    const [group, setGroup] = useState(false);

    const detalles = useMemo(
        () => actividades || detalle.filter(d => d.idUsuarioAsignado === recurso?.idUsuario),
        [actividades, detalle, recurso]
    );

    const grouped = useMemo(() => groupByProyecto(detalles), [detalles]);


    const incidenciasDelUsuario = useMemo(() => {
        if (!recurso || !incidencias) return [];
        return incidencias;
    }, [incidencias, recurso]);

    if (!recurso) return null;
    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Title level={4} style={{ margin: 0, flex: 1 }}>
                        Detalle de Actividades: {recurso.recurso}
                    </Title>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={"80%"}
        >
            {incidenciasDelUsuario.length > 0 &&
                <DetalleIncidencias incidencias={incidenciasDelUsuario} />}

            <span
                style={{ display: 'flex', alignItems: 'center', marginBottom: 16, float: 'right', cursor: 'pointer', userSelect: 'none' }}
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
                                <Table
                                    dataSource={acts}
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
                                />
                            </Panel>
                        );
                    })}
                </Collapse>
            ) : (
                <Table
                    dataSource={detalles}
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
                                    <Table.Summary.Cell index={6} align="right" >
                                        <b>{recurso.productividad}%</b>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />
            )}
        </Modal>
    );
};

export default DetalleModal;