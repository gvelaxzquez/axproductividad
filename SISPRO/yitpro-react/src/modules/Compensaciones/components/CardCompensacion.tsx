import React from 'react';
import { Card, Avatar, Row, Col, Typography, Tag, Tooltip } from 'antd';
import type { CompensacionEncabezado } from '../../../model/compensaciones.model';
import { formatMoney } from '../../../utils/format.util';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Props {
    compensacion: CompensacionEncabezado;
    onClick: () => void;
}

const getNivelColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
        case 'básico':
            return 'blue';
        case 'intermedio':
            return 'geekblue';
        case 'avanzado':
            return 'purple';
        default:
            return 'default';
    }
};

const CardCompensacion: React.FC<Props> = ({ compensacion, onClick }) => {
    const avatarUrl = `http://app.yitpro.com/Archivos/Fotos/${compensacion.clave}.jpg`;

    // Limpiar y convertir la productividad para la comparación
    const productividadValue = parseFloat(compensacion.productividad.replace('%', ''));

    return (
        <Card style={{ marginBottom: '16px' }} hoverable onClick={onClick}>
            <Row gutter={[16, 16]} align="middle">
                {/* Primera Fila: Avatar y Nombre */}
                <Col span={4}>
                    <Avatar src={avatarUrl} size={60}>
                        {compensacion.clave}
                    </Avatar>
                </Col>
                <Col span={8}>
                    <Title level={4}>{compensacion.recurso}</Title>
                </Col>
                <Col span={12}>
                    {+compensacion.total > 0 && (
                        <Row gutter={[8, 8]} style={{ marginTop: 0 }}>
                            <Col span={24}>
                                <Row justify="space-between" align="middle">
                                    <Col span={10} style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'block', alignItems: 'center' }}>
                                            <Tooltip title={`Horas adicionales: ${compensacion.horasAdicionales}`}>
                                                <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer', marginRight: 4 }} />
                                            </Tooltip>
                                            <Text strong >Bono Horas:</Text>
                                        </div>
                                        <Tag color="green" style={{ marginLeft: 4 }}>{formatMoney(+compensacion.bonoHoras)}</Tag>
                                    </Col>

                                    <Col span={14} style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'block', alignItems: 'center' }}>
                                            <Tooltip title={`Bono Horas + ${formatMoney(+compensacion.bonoCumplimiento)}`}>
                                                <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer', marginRight: 4 }} />
                                            </Tooltip>
                                            <Text strong >Total:</Text>
                                        </div>
                                        <Tag color="gold" style={{ marginLeft: 4 }}>{formatMoney(+compensacion.total)}</Tag>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )}

                </Col>
            </Row>

            {/* Segunda Fila: Nivel, Estándar, Solicitadas */}
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                    <Text strong>Nivel:</Text> <Tag color={getNivelColor(compensacion.nivel)}>{compensacion.nivel}</Tag>
                </Col>
                <Col span={8}>
                    <Text strong>Estándar Mes:</Text> <Text>{compensacion.estandarMes}</Text>
                </Col>
                <Col span={8}>
                    <Text strong>Horas Solicitadas:</Text> <Text>{compensacion.horasSolicitadas}</Text>
                </Col>
            </Row>

            {/* Tercera Fila: Liberadas, Productividad, Líder */}
            <Row gutter={[16, 16]} style={{ marginTop: '8px' }}>
                <Col span={8}>
                    <Text strong>Horas Liberadas:</Text> <Text>{compensacion.horasLiberadas}</Text>
                </Col>
                <Col span={8}>
                    <Text strong>Productividad:</Text>{' '}
                    <Tag color={
                        productividadValue < 50
                            ? 'error'
                            : productividadValue >= 95
                                ? 'success'
                                : 'warning'
                    }>
                        {compensacion.productividad}
                    </Tag>
                </Col>
                <Col span={8}>
                    <Text strong>Líder:</Text> <Text>{compensacion.lider}</Text>
                </Col>
            </Row>
        </Card>
    );
};

export default CardCompensacion;
