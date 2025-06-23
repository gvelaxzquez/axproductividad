import React, { useState,useEffect } from 'react';
import { Modal, Row, Col, Select, DatePicker, Form, Button , Badge } from 'antd';
import axios from "axios";

const { RangePicker } = DatePicker;

const FiltrosSprints = ({ 
  isOpen,
  onClose,
  filters,
  setFilters,
  setSelectedProject,
  setSelectedType,
}) => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);


  useEffect(() => {

    fetchFilters();

  }, []);


  const fetchFilters = async () => {
    try {


      const resProjects = await axios.post("/Proyectos/CargaListaProyectos"); 

      var projectsData = jQuery.parseJSON(resProjects.data.LstProyectos);
  
      if (resProjects.data.Exito) {
        setProjects(projectsData);
        }
         else {
       message.error(resProjects.data.Mensaje);
         }    


        //  const resWI = await axios.post("/Actividades/CargaListaTipoActividad"); 
        //  var typesData = jQuery.parseJSON(resWI.data.LstWorkItems)
        //  if (resWI.data.Exito) {
        //     setTaskTypes(typesData);

        //    }
        //     else {
        //   message.error(resProjects.data.Mensaje);
        //     }    
   
        
    } catch (error) {
      console.error('Error al cargar filtros:', error);
    } finally {

    }
  };



  const handleFilter = async () => {
    try {
      const values = await form.validateFields();
      setFilters({
        ...filters,
        ...values
      });
      setSelectedProject(filters.Proyecto);
  
      onClose();

    } catch (error) {
      console.error('Error en validación:', error);
    }
  };




  return (
    <Modal
      title="Filtros"
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="filter" type="primary" onClick={handleFilter}>
          Filtrar
        </Button>
      ]}
    >
      <Form
        form={form}
        initialValues={filters}
      >
        <div style={{ padding: '20px' }}>
          <Row gutter={[16, 16]}>
          
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Proyecto *</div>
              <Form.Item
                name="Proyecto"
                rules={[{ required: true, message: 'Por favor seleccione al menos un proyecto' }]}
              >
                <Select
               
                  placeholder="Seleccionar proyecto"
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {projects.map((proyecto) => (
                    <Select.Option key={proyecto.IdCatalogo} value={proyecto.IdCatalogo}>
                      {proyecto.DescLarga}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Estatus *</div>
              <Form.Item
                name="LstEstatus"
                rules={[{ required: true, message: 'Por favor seleccione un estatus' }]}
              >
                <Select
                  placeholder="Seleccionar estatus"
                  style={{ width: '100%' }}
                  mode="multiple"
                >
                              <Option value="A" key="A">
                                <Badge color="#1890ff" text="Abierto" />
                              </Option>
                              <Option value="P" key="P">
                                <Badge color="#faad14" text="En Progreso" />
                              </Option>
                              <Option value="L" key="L">
                                <Badge color="#52c41a" text="Terminado" />
                              </Option>
                              <Option value="C" key="C">
                                <Badge color="#8c8c8c" text="Cancelado" />
                              </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

        
        </div>
      </Form>
    </Modal>
  );
};

export default FiltrosSprints;