import React from 'react';
import { Modal, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import type { ActividadesModel } from '../../../model/Actividad.model';
import type { CompensacionEncabezado } from '../../../model/compensaciones.model';
import { useCompensacionesStore } from '../store/compensaciones.store';

const { Title, Link } = Typography;

interface Props {
    visible: boolean;
    onClose: () => void;
    recurso: CompensacionEncabezado | null;
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

const DetalleModal: React.FC<Props> = ({ visible, onClose, recurso }) => {
    const { detalle } = useCompensacionesStore();
    const detalles = detalle.filter(d => d.idUsuarioAsignado === recurso?.idUsuario);

    if (!recurso) return null;

    return (
        <Modal
            title={<Title level={4}>Detalle de Actividades: {recurso.recurso}</Title>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={"80%"}
        >
            <Table
                dataSource={detalles}
                columns={columns}
                rowKey="idActividad"
                pagination={false}
                size="small"
            />
        </Modal>
    );
};

export default DetalleModal;