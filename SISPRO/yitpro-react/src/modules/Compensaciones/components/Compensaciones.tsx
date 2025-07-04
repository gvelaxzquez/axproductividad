import { Button, Col, Empty, Layout, Row, Segmented } from 'antd';
import React, { useEffect, useState } from 'react';
import type { CompensacionEncabezado } from '../../../model/compensaciones.model';
import { useCompensacionesStore } from '../store/compensaciones.store';
import { exportarCompensacionesExcel } from '../utils';
import CardCompensacion from './CardCompensacion';
import DetalleModal from './DetalleModal';
import FiltrosCompensaciones from './Filtros';
import ProductivitySummary from './ProductivitySummary';
import { FileExcelTwoTone, LineChartOutlined, SortAscendingOutlined } from '@ant-design/icons';


const { Content } = Layout;

const Compensaciones: React.FC = () => {
    const { encabezado, detalle, productivitySummary, filtros } = useCompensacionesStore();
    const [_encabezado, setEncabezado] = useState<CompensacionEncabezado[]>([]);
    const [selectedRecurso, setRecurso] = useState<CompensacionEncabezado | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [ordenPorProductividad, setOrdenPorProductividad] = useState(false);

    useEffect(() => {
        const nuevaLista = [...encabezado].sort((a, b) => {
            if (ordenPorProductividad) {
                const prodA = parseFloat(a.productividad?.replace('%', '') || '0');
                const prodB = parseFloat(b.productividad?.replace('%', '') || '0');
                return prodB - prodA;
            } else {
                return a.recurso.localeCompare(b.recurso);
            }
        });
        setEncabezado(nuevaLista);
    }, [encabezado, ordenPorProductividad]);
    const handleCardClick = (recursoClave: string) => {
        const recurso = encabezado.find(r => r.clave === recursoClave);
        if (recurso) {
            setRecurso(recurso);
            setOpen(true);
        }
    };
    const hideModal = () => {
        setOpen(false);
        setRecurso(null);
    };

    const renderContent = () => {
        if (_encabezado.length === 0) {
            return <Empty description="No hay datos para mostrar. Por favor, ajuste los filtros y haga clic en Filtrar." />;
        }
        return (
            <Row gutter={[16, 24]}>
                {_encabezado.map(item => (
                    <Col key={item.clave} xs={24} sm={12} lg={8}>
                        <CardCompensacion compensacion={item} onClick={() => handleCardClick(item.clave)} />
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Layout style={{ padding: '24px' }}>
            <Content>
                <FiltrosCompensaciones />
                <ProductivitySummary summary={productivitySummary} />
                <div style={{ marginTop: '24px' }}>
                    {_encabezado.length > 0 && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}>
                        <Segmented
                            size='large'
                            options={[{
                                label: 'Nombre',
                                value: 'Nombre',
                                icon: <SortAscendingOutlined />
                            },
                            {
                                label: 'Productividad',
                                value: 'Productividad',
                                icon: <LineChartOutlined />
                            }]}
                            value={ordenPorProductividad ? 'Productividad' : 'Nombre'}
                            onChange={(val) => {
                                const ordenarPorProd = val === 'Productividad';
                                const nuevaLista = [..._encabezado].sort((a, b) => {
                                    if (ordenarPorProd) {
                                        const prodA = parseFloat(a.productividad?.replace('%', '') || '0');
                                        const prodB = parseFloat(b.productividad?.replace('%', '') || '0');
                                        return prodB - prodA;
                                    } else {
                                        return a.recurso.localeCompare(b.recurso);
                                    }
                                });
                                setEncabezado(nuevaLista);
                                setOrdenPorProductividad(ordenarPorProd);
                            }}
                        />
                        <Button
                            type="default"
                            icon={<FileExcelTwoTone twoToneColor="#52c41a" />}
                            onClick={() => exportarCompensacionesExcel(
                                _encabezado,
                                detalle,
                                `Compensaciones_${new Date(0, filtros.mes - 1).toLocaleString('es-ES', { month: 'long' })}_${filtros.anio}`
                            )}
                            style={{ borderColor: '#52c41a', color: '#52c41a' }}
                            disabled={_encabezado.length === 0}
                        >
                            Descargar Excel
                        </Button>
                    </div>}
                    {renderContent()}
                </div>
                <DetalleModal
                    visible={open}
                    onClose={hideModal}
                    recurso={selectedRecurso}
                />
            </Content>
        </Layout>
    );
};

export default Compensaciones;