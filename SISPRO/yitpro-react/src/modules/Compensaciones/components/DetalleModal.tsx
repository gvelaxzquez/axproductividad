import { Modal, Tabs, Typography } from 'antd';
import React, { useMemo } from 'react';
import type { ActividadesModel } from '../../../model/Actividad.model';
import type { CompensacionEncabezado, UsuarioIncidencia } from '../../../model/compensaciones.model';
import { useCompensacionesStore } from '../store/compensaciones.store';
import AcivitiesTable from './Activities.table';
import DetalleIncidencias from './DetalleIncidencias';

const { Title } = Typography;

interface Props {
    visible: boolean;
    onClose: () => void;
    recurso: CompensacionEncabezado | null;
    actividades?: ActividadesModel[];
    bugs?: ActividadesModel[];
    incidencias?: UsuarioIncidencia[];
}



const DetalleModal: React.FC<Props> = ({ visible, onClose, recurso, actividades, incidencias, bugs }) => {
    const { detalle } = useCompensacionesStore();
    // const [group, setGroup] = useState(false);

    const detalles = useMemo(
        () => actividades || detalle.filter(d => d.idUsuarioAsignado === recurso?.idUsuario),
        [actividades, detalle, recurso]
    );

    // const grouped = useMemo(() => groupByProyecto(detalles), [detalles]);


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

            {bugs && bugs.length > 0 ? (
                <Tabs defaultActiveKey="actividades" style={{ marginTop: 16 }}>
                    <Tabs.TabPane tab="Actividades" key="actividades">
                        <AcivitiesTable
                            actividades={detalles}
                            recurso={recurso}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Bugs" key="bugs">
                        <AcivitiesTable
                            actividades={bugs}
                            recurso={recurso}
                        />
                    </Tabs.TabPane>
                </Tabs>
            ) :
                <AcivitiesTable
                    actividades={detalles}
                    recurso={recurso}
                />

            }
        </Modal>
    );
};

export default DetalleModal;