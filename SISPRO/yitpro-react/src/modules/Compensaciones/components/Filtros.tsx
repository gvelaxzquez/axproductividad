/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Row, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useCompensacionesStore } from '../store/compensaciones.store';
import { getPeriodoRange, tranformLista } from '../utils';
import GraficaProductividadSemanal, { type SemanaData } from './GraficaProductividadSemanal.v1';
const { Text } = Typography;

const FiltrosCompensaciones: React.FC = () => {
    const { filtros, setFiltros, generarCompensaciones, loading, analisisSemanal } = useCompensacionesStore();

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
    const [open, setOpen] = useState<boolean>(false);
    const [semanas, setSemanas] = useState<any[]>([]);
    const hideModal = () => {
        setOpen(false);
    };
    const handleAnalisisSemanal = () => {
        analisisSemanal().then(response => {
            const semanasData: SemanaData[] = Object.entries(response[0]).map(
                ([semanaStr, lista]: [string, any[]]) => {
                    const semana = parseInt(semanaStr);
                    return {
                        semana: `Semana ${semana}`,
                        rangoFechas: getPeriodoRange(semana, 'semana', filtros.anio, filtros.mes),
                        datos: tranformLista(lista, response[1][semana] || [], response[2][semana] || [])

                    };
                }
            );
            setSemanas(semanasData);
            setTimeout(() => {
                setOpen(true);
            }, 100);
        });
    }

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
                    <Button
                        type="primary"
                        onClick={handleAnalisisSemanal}
                        loading={loading}
                    >
                        Analisis Semanal
                    </Button>
                </Col>
            </Row>
            <GraficaProductividadSemanal
                visible={open}
                onClose={hideModal}
                semanas={semanas}
            />
        </Card>
    );
};

export default FiltrosCompensaciones;
