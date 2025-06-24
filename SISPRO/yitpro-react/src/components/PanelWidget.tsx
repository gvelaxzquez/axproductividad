import React from 'react';
import { Modal, Card, Typography, Row, Col } from 'antd';
import {
  PieChartOutlined,
  BarChartOutlined,
  NumberOutlined,
  PercentageOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const PanelWidget = ({ visible, onClose, onSelect, widgetTypes }) => {
  // Agrupar los tipos de widgets por su tipo
  const groupedWidgets = widgetTypes.reduce((acc, widget) => {
    const type = widget.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(widget);
    return acc;
  }, {});

  // Función para obtener el icono correspondiente
  const getIcon = (type) => {
    switch (type) {
      case 'pie':
        return <PieChartOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
      case 'bar':
        return <BarChartOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
      case 'number':
        return <NumberOutlined style={{ fontSize: '32px', color: '#722ed1' }} />;
      case 'percentage':
        return <PercentageOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />;
      default:
        return null;
    }
  };

  // Función para obtener el título del grupo
  const getGroupTitle = (type) => {
    switch (type) {
      case 'pie':
        return 'Gráficos de pastel';
      case 'bar':
        return 'Gráficos de barras';
      case 'number':
        return 'Indicadores numéricos';
      case 'percentage':
        return 'Indicadores de porcentaje';
      default:
        return type;
    }
  };

  return (
    <Modal
      title="Seleccionar tipo de gráfico"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div style={{ padding: '20px 0' }}>
        {Object.entries(groupedWidgets).map(([type, widgets]) => (
          <div key={type} style={{ marginBottom: 32 }}>
            <Title level={4} style={{ marginBottom: 16 }}>
              {getGroupTitle(type)}
            </Title>
            
            <Row gutter={[16, 16]}>
              {widgets.map((widget) => (
                <Col key={widget.IdWidget} xs={24} sm={12} md={8}>
                  <Card
                    hoverable
                    onClick={() => {
                      onSelect(widget.IdWidget);
                      onClose();
                    }}
                    style={{ 
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                    bodyStyle={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '24px'
                    }}
                  >
                    {getIcon(widget.type)}
                    <Typography.Text strong style={{ fontSize: '16px' }}>
                      {widget.defaultTitle}
                    </Typography.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default PanelWidget;