import { Card, Col, Collapse, Row, Statistic, type CollapseProps } from 'antd';
import React from 'react';
import type { ProductivitySummaryModel } from '../../../model/compensaciones.model';

interface Props {
    summary: ProductivitySummaryModel | null;
}

const ProductivitySummary: React.FC<Props> = ({ summary }) => {
    if (!summary) {
        return null; // No renderizar si no hay datos de resumen
    }
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Resumen de Productividad',
            children: <Card title="" style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic title="Horas Solicitadas" value={summary.totalHorasSolicitadas} precision={2} />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic title="Horas Liberadas" value={summary.totalHorasLiberadas} precision={2} />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic title="Bono Cumplimiento" value={summary.totalBonoCumplimiento} precision={2} />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic title="Horas Adicionales" value={summary.totalHorasAdicionales} precision={2} />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic title="Bono Horas" value={summary.totalBonoHoras} precision={2} />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic title="Total General" value={summary.totalGeneral} precision={2} />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Statistic title="Productividad Promedio" value={summary.productividadPromedio} suffix="%" precision={2} />
                    </Col>
                </Row>
            </Card>,
        }
    ];
    return (
        <Collapse ghost items={items} defaultActiveKey={['1']} />
    );
};

export default ProductivitySummary;
