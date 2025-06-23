
import React from 'react';
import { Modal, Row, Col, Select, DatePicker } from 'antd';

const { RangePicker } = DatePicker;




const TaskFilter = ({ 
  isOpen,
  onClose,
  sprints,
  resources,
  fases,
  clasificaciones,
  prioridades,
  proyectos,
  tipos,
  handleFilterChange,
  filters
}) => {
  return (
    <Modal
      title="Filtros"
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <div style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Fechas</div>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.Fechas || []}
              onChange={(dates, dateStrings) => handleFilterChange('Fechas', dateStrings)}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Sprint</div>
            <Select
              mode="multiple"
              placeholder="Seleccionar sprint"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('LstSprints', value)}
            >
              <Select.Option key={-1} value={-1}>Sin sprint</Select.Option>
              {sprints?.map((sprint) => (
                <Select.Option key={sprint.IdCatalogo} value={sprint.IdCatalogo}>
                  {sprint.DescLarga}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Asignado</div>
            <Select
              mode="multiple"
              placeholder="Seleccionar asignado"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('LstAsignado', value)}
            >
              <Select.Option key={-1} value={-1}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                  <img
                    src="/Archivos/Fotos/default.jpg"
                    alt="SA"
                    style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 10 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/Archivos/Fotos/default.jpg";
                    }}
                  />
                  Sin asignar
                </div>
              </Select.Option>
              {resources?.map((resource) => (
                <Select.Option key={resource.IdCatalogo} value={resource.IdCatalogo}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                    <img
                      src={`/Archivos/Fotos/${resource.DescCorta}.jpg`}
                      alt={resource.DescCorta}
                      style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 10 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/Archivos/Fotos/default.jpg";
                      }}
                    />
                    {resource.DescLarga}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Responsable</div>
            <Select
              mode="multiple"
              placeholder="Seleccionar responsable"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('LstResponsable', value)}
            >
              <Select.Option key={-1} value={-1}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                  <img
                    src="/Archivos/Fotos/default.jpg"
                    alt="SA"
                    style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 10 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/Archivos/Fotos/default.jpg";
                    }}
                  />
                  Sin responsable
                </div>
              </Select.Option>
              {resources?.map((resource) => (
                <Select.Option key={resource.IdCatalogo} value={resource.IdCatalogo}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                    <img
                      src={`/Archivos/Fotos/${resource.DescCorta}.jpg`}
                      alt={resource.DescCorta}
                      style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 10 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/Archivos/Fotos/default.jpg";
                      }}
                    />
                    {resource.DescLarga}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Fase</div>
            <Select
              mode="multiple"
              placeholder="Seleccionar fase"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('LstTipoActividad', value)}
            >
              <Select.Option key={-1} value={-1}>Sin fase</Select.Option>
              {fases?.map((fase) => (
                <Select.Option key={fase.IdCatalogo} value={fase.IdCatalogo}>
                  {fase.DescLarga}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Clasificación</div>
            <Select
              mode="multiple"
              placeholder="Seleccionar clasificación"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('LstClasificacion', value)}
            >
              <Select.Option key={-1} value={-1}>Sin clasificación</Select.Option>
              {clasificaciones?.map((clasificacion) => (
                <Select.Option key={clasificacion.IdCatalogo} value={clasificacion.IdCatalogo}>
                  {clasificacion.DescLarga}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Prioridad</div>
            <Select
              mode="multiple"
              placeholder="Seleccionar prioridad"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('LstPrioridad', value)}
            >
              <Select.Option key={-1} value={-1}>Sin prioridad</Select.Option>
              {prioridades?.map((prioridad) => (
                <Select.Option key={prioridad.IdCatalogo} value={prioridad.IdCatalogo}>
                  {prioridad.DescLarga}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default TaskFilter;