import { Button, Card, Col, ConfigProvider, DatePicker, Divider, Row, Space, Statistic, Typography } from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // importa el idioma que necesitas
import { useEffect, useState } from 'react';
import { useUsuarioCostoStore } from '../store/usuarioCostoMensual.store';
import ImportarCostosModal from './ImportarCostos.modal';
import { CloudUploadOutlined, FileExcelTwoTone, ReloadOutlined } from '@ant-design/icons';
const { Text } = Typography;

const FiltrosUsuarioCosto = () => {
  const {
    anio,
    mes,
    setAnio,
    setMes,
    fetchCostos,
    fetchCostosAnual,
    exportCostos,
    total,
    data
  } = useUsuarioCostoStore();
  const fechaFiltro = dayjs(`${anio}-${mes}-01`);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    fetchCostos();
    fetchCostosAnual();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeFecha = (fecha) => {
    if (!fecha) return;
    const originalAnio = anio;
    setAnio(fecha.year());
    setMes(fecha.month() + 1);
    fetchCostos();
    if (originalAnio != fecha.year())
      fetchCostosAnual();
  };
  dayjs.locale('es');
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('month');
  };

  return (
    <div style={{ marginRight: 16 }}>
      <Row gutter={16} align="middle" style={{ marginBottom: 0 }}>
        <Col xs={24} sm={24} md={16} lg={12}>
          <Card
            variant='outlined'
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginLeft: 8, width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                💰 Total Costo Mensual
              </span>
              <Space>

                <ConfigProvider locale={esES}>
                  <DatePicker
                    picker="month"
                    format="MMMM - YYYY"
                    allowClear={false}
                    value={fechaFiltro}
                    onChange={onChangeFecha}
                    style={{ minWidth: 130 }}
                    size="middle"
                    disabledDate={disabledDate}
                  />
                </ConfigProvider>
                <Button
                  type="default"
                  size="small"
                  shape='circle'
                  icon={<ReloadOutlined />}
                  onClick={() => onChangeFecha(fechaFiltro)}
                />
              </Space>
            </div>
            <Statistic
              value={total}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#3f8600', fontWeight: 600, marginTop: 8 }}
              style={{ marginTop: 16 }}
            />
            <Text style={{ float: "left" }}>({data.length} {`${data.length === 1 ? "Recurso" : "Recursos"}`})</Text>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={12}>
          <Space style={{ float: "right" }}>
            <Button
              icon={<CloudUploadOutlined />}
              onClick={() => setModalOpen(true)}>
              Importar
            </Button>
            <Button
              icon={<FileExcelTwoTone twoToneColor="#3d7520ff" />}
              style={{ borderColor: '#3d7520ff', color: '#3d7520ff' }}
              onClick={() => exportCostos()}>
              Exportar
            </Button>

          </Space>
        </Col>
      </Row>
      <Divider />
      <ImportarCostosModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      // anio={anio}
      // mes={mes}
      // onSuccess={() => fetchCostos()}
      />
    </div>
  );
};

export default FiltrosUsuarioCosto;
