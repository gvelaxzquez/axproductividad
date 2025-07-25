import { Collapse, Table } from "antd";
import dayjs from "dayjs";
import type { UsuarioIncidencia } from "../../../model/compensaciones.model";
const { Panel } = Collapse;


interface Props {
    incidencias?: UsuarioIncidencia[];
}

const DetalleIncidencias: React.FC<Props> = ({ incidencias }) => {

    if (!incidencias || incidencias.length === 0) return null;
    const totalDiasInc = incidencias.reduce((acc, i) => acc + i.diasInc, 0);
    return (
        <Collapse
            accordion={false}
            defaultActiveKey={-1}
            style={{ marginBottom: 24 }}
        >
            <Panel
                header='Incidencias'
                key={0}
            >

                <div style={{ display: 'flex', gap: 24 }}>
                    {/* Card con total de días */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            background: '#fafafa',
                            padding: 16,
                            border: '1px solid #eee',
                            borderRadius: 6,
                            fontSize: 24,
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {`Total:`}<br />
                            {totalDiasInc}
                        </div>
                    </div>
                    {/* Listado */}
                    <div style={{ flex: 2, maxHeight:100, overflowY: 'auto' }}>
                        <Table
                            dataSource={incidencias}
                            rowKey={(i) => `${i.incidencia}-${i.fechaInicio}`}
                            pagination={false}
                            size="small"
                            columns={[
                                { title: 'Inicio', dataIndex: 'fechaInicio', render: (v) => dayjs(v).format('DD/MM/YYYY') },
                                { title: 'Fin', dataIndex: 'fechaFin', render: (v) => dayjs(v).format('DD/MM/YYYY') },
                                { title: 'Tipo', dataIndex: 'incidencia' },
                                { title: 'Días', dataIndex: 'diasInc', align: 'center' },
                            ]}
                        />
                    </div>
                </div>
            </Panel>
        </Collapse>
    );
};

export default DetalleIncidencias;
