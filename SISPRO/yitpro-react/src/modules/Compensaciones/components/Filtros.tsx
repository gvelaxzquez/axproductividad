import React from 'react';
import { DatePicker, Button, Space, Card, Row, Col, Typography } from 'antd';
import { useCompensacionesStore } from '../store/compensaciones.store';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const FiltrosCompensaciones: React.FC = () => {
    const { filtros, setFiltros, generarCompensaciones, loading } = useCompensacionesStore();

    const handleDateChange = (date: Dayjs | null, dateString: string) => {
        setFiltros({
            fechaCorte: dateString,
            anio: date ? date.year() : null,
            mes: date ? date.month() + 1 : null,
        });

        // Ejecutar automáticamente el filtrado al cambiar fecha
        setFiltros({ guardar: false });
        generarCompensaciones();
    };

    const handleFiltrar = () => {
        setFiltros({ guardar: false }); // Explícitamente establecer guardar en false
        generarCompensaciones();
    };

    const handleFiltrarAndGuardar = () => {
        setFiltros({ guardar: true }); // Explícitamente establecer guardar en true
        generarCompensaciones();
    };

    return (
        <Card title="Filtros" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
                <Col span={18}> {/* Columna de ancho completo para el DatePicker y su label */}
                    <Space>
                        <Text strong>Mes de consulta:</Text>
                        <DatePicker
                            onChange={handleDateChange}
                            picker="month"
                            placeholder="Seleccionar Mes y Año"
                            // style={{ width: '33%' }} // DatePicker ocupa el 33% del ancho de su contenedor
                            value={filtros.fechaCorte ? dayjs(filtros.fechaCorte) : null}
                        />
                        <Button
                            type="default"
                            size="small"
                            shape='circle'
                            icon={<ReloadOutlined />}
                            onClick={handleFiltrar}
                            loading={loading}
                        />
                    </Space>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24} style={{ textAlign: 'left' }}> {/* Columna de ancho completo para los botones, alineados a la izquierda */}
                    <Button
                        type="default"
                        onClick={handleFiltrarAndGuardar}
                        loading={loading}
                    >
                        Guardar
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default FiltrosCompensaciones;
