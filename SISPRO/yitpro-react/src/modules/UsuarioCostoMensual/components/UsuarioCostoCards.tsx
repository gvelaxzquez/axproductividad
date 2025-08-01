import { ApartmentOutlined, LineChartOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Row, Segmented, Space, Switch, Typography } from 'antd';
import { useEffect, useState } from 'react';
import type { UsuarioCosto, UsuarioNodo } from '../../../model/UsuarioCostoMensual.model';
import { useUsuarioCostoStore } from '../store/usuarioCostoMensual.store';
import NodoJerarquia from './NodoJerarquia';
import UsuarioCard from './UsuarioCard';
import './usuarioCosto.styles.css';
import DistribucionMasiva from './DistribucionMasiva/DistribucionMasiva.modal';

const { Text } = Typography;


const UsuarioCostoCards = () => {
    const {
        data,
        cargarDistribucionUsuarios,
    } = useUsuarioCostoStore();
    const [vistaAnalitica, setVistaAnalitica] = useState(true);
    const [openF, setOpenF] = useState(false);
    const [criterioOrden, setCriterioOrden] = useState<'Nombre' | 'Costo' | 'Lider'>('Nombre');
    const [_data, setData] = useState<UsuarioCosto[]>([]);


    function construirArbolJerarquico(data: UsuarioCosto[]): UsuarioNodo[] {
        const mapa = new Map<number, UsuarioNodo>();

        // Inicializar nodos
        data.forEach((u) => mapa.set(u.idUsuario, { ...u, hijos: [] }));

        const raiz: UsuarioNodo[] = [];

        data.forEach((u) => {
            if (u.idULider == null) {
                raiz.push(mapa.get(u.idUsuario)!);
            } else {
                const padre = mapa.get(u.idULider);
                if (padre) {
                    padre.hijos!.push(mapa.get(u.idUsuario)!);
                }
            }
        });
        return raiz;
    }
    const sortData = () => {
        let nuevaLista: UsuarioCosto[] = [];

        if (criterioOrden === 'Costo') {
            nuevaLista = [...data].sort((a, b) => b.costoMensual - a.costoMensual);
        } else if (criterioOrden === 'Nombre') {
            nuevaLista = [...data].sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
        setData(nuevaLista);
    };
    useEffect(() => {
        sortData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, criterioOrden]);


    const handleAbrirDistribucionMasiva = async () => {
        await cargarDistribucionUsuarios();
        setOpenF(true);
    };

    if (!data || data.length === 0)
        return <Empty
            description="Importa la información de costos del mes para iniciar con la distribución o selecciona otro periodo."
        />

    return (
        <div style={{ marginLeft: 16, marginRight: 24 }}>
            <Row justify="end" style={{ marginBottom: 16 }}>
                <Col>
                    <Button style={{ marginRight: 8 }} type="primary" onClick={handleAbrirDistribucionMasiva}>
                        Distribución Masiva
                    </Button>
                    <Space style={{ marginRight: 8 }}>
                        <Text strong>Vista analítica</Text>
                        <Switch checked={vistaAnalitica} onChange={setVistaAnalitica} />
                    </Space>
                    <Segmented
                        size="large"
                        options={[
                            { label: 'Nombre', value: 'Nombre', icon: <SortAscendingOutlined /> },
                            { label: 'Costo', value: 'Costo', icon: <LineChartOutlined /> },
                            { label: 'Líder', value: 'Lider', icon: <ApartmentOutlined /> }
                        ]}
                        value={criterioOrden}
                        onChange={(val) => setCriterioOrden(val as "Nombre" | "Costo" | "Lider")}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {criterioOrden === 'Lider' ? (
                    <div className="jerarquia-scroll-wrapper">
                        <div className="jerarquia-contenedor">
                            {construirArbolJerarquico(data).map((nodo) => (
                                <NodoJerarquia key={nodo.idUsuario} nodo={nodo} vistaAnalitica={vistaAnalitica} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <Row gutter={[16, 16]} style={{ marginBottom: 16, width: "100%" }}>
                        {_data.map((usuario) => {
                            const distribucion = usuario.lstDistrbucion ?? [];
                            return (
                                <Col xs={24} sm={12} md={8} lg={6} key={usuario.idUsuarioCosto}>
                                    <UsuarioCard usuario={usuario}
                                        distribucion={distribucion}
                                        vistaAnalitica={vistaAnalitica} />
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Row>
            <DistribucionMasiva
                open={openF}
                onClose={() => setOpenF(false)}
            />

        </div>
    );
};

export default UsuarioCostoCards;