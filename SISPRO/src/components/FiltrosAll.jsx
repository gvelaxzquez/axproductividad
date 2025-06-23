import React, { useState,useEffect } from 'react';
import { Modal, Row, Col, Select, DatePicker, Form, Button  } from 'antd';
import axios from "axios";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Filtros = ({ 
  isOpen,
  onClose,
  filters,
  setFilters,
  setSelectedProject,
  setSelectedType,
}) => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [resources, setResources] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [fases, setFases] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [estatus, setEstatus] = useState([]);
  const [IdProyecto, setIdProyecto] = useState(null);
  useEffect(() => {

    fetchFilters();

      if (filters.Proyecto != null) {
 
        fetchAllFilters(filters.Proyecto);
      }
      // const startDate = dayjs().subtract(1, "month");
      // const endDate = dayjs();
  
      // handleFilterChange("Fechas", [startDate, endDate]);

  }, []);

  useEffect(()=> {

    if (filters.Proyecto != null) {
 
      fetchAllFilters(filters.Proyecto);
    }

  }, [filters])



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


         const resWI = await axios.post("/Actividades/CargaListaTipoActividad"); 
         var typesData = jQuery.parseJSON(resWI.data.LstWorkItems)
         if (resWI.data.Exito) {
            setTaskTypes(typesData);

           }
            else {
          message.error(resProjects.data.Mensaje);
            }    
   
        
    } catch (error) {
      console.error('Error al cargar filtros:', error);
    } finally {

    }
  };

  const fetchAllFilters = async (projectId) => {
    try {
      const response = await axios.post('/Board/CargaFiltros', { IdProyecto: projectId } ); // Cambia la ruta según tu API
      if (response.data.Exito) {
        setIdProyecto(projectId);
        setResources(jQuery.parseJSON(response.data.LstUsuarios)); 
        setSprints(jQuery.parseJSON(response.data.LstSprint)); 
        setFases(jQuery.parseJSON(response.data.LstFase)); 
        setClasificaciones(jQuery.parseJSON(response.data.LstClasificacion)); 
        setPrioridades(jQuery.parseJSON(response.data.LstPrioridad)); 


      } else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      console.error('Error al información:', error);
      message.error('No se pudo cargar información.');
    }
  };

  const fetchEstatus = async (IdActividadTipo) => {
    try {

      if(IdProyecto){
        const res = await axios.post("/Workspace/CargaEstados"); 

        var data = jQuery.parseJSON(res.data.LstPrLstWorkflowoyectos);
    
        if (res.data.Exito) {
          setEstatus(data);
          }
           else {
         message.error(res.data.Mensaje);
           }    
  

      }
 
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
      setSelectedType(filters.Tipo);
 
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
                  onChange={(value) => fetchAllFilters(value)}  
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
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Tipo *</div>
              <Form.Item
                name="Tipo"
                rules={[{ required: true, message: 'Por favor seleccione al menos un tipo' }]}
              >
                <Select
                  placeholder="Seleccionar tipo"
                  style={{ width: '100%' }}
                  onChange={(value) => fetchEstatus(value)}  
                >
                        {taskTypes.map((type) => (
                          <Select.Option key={type.ActividadTipoId} value={type.ActividadTipoId}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={
                                  '/Content/Project/Imagenes/' + type.Url || '/Archivos/Fotos/default.jpg'
                                }
                                alt={type.Nombre}
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  marginRight: 10,
                                }}
                              />
                              {type.Nombre}
                            </div>
                          </Select.Option>
                        ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
          <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Fechas *</div>
              <Form.Item
                name="Fechas"
                rules={[{ required: true, message: 'Por favor seleccione las fechas' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Sprint</div>
              <Form.Item name="LstSprints">
                <Select
                  mode="multiple"
                  placeholder="Seleccionar sprint"
                  style={{ width: '100%' }}
                >
                  <Select.Option key={-1} value={-1}>Sin sprint</Select.Option>
                  {sprints?.map((sprint) => (
                    <Select.Option key={sprint.IdCatalogo} value={sprint.IdCatalogo}>
                      {sprint.DescLarga}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Asignado</div>
              <Form.Item name="LstAsignado">
                <Select
                  mode="multiple"
                  placeholder="Seleccionar asignado"
                  style={{ width: '100%' }}
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
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Responsable</div>
              <Form.Item name="LstResponsable">
                <Select
                  mode="multiple"
                  placeholder="Seleccionar responsable"
                  style={{ width: '100%' }}
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
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Fase</div>
              <Form.Item name="LstTipoActividad">
                <Select
                  mode="multiple"
                  placeholder="Seleccionar fase"
                  style={{ width: '100%' }}
                >
                  <Select.Option key={-1} value={-1}>Sin fase</Select.Option>
                  {fases?.map((fase) => (
                    <Select.Option key={fase.IdCatalogo} value={fase.IdCatalogo}>
                      {fase.DescLarga}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Clasificación</div>
              <Form.Item name="LstClasificacion">
                <Select
                  mode="multiple"
                  placeholder="Seleccionar clasificación"
                  style={{ width: '100%' }}
                >
                  <Select.Option key={-1} value={-1}>Sin clasificación</Select.Option>
                  {clasificaciones?.map((clasificacion) => (
                    <Select.Option key={clasificacion.IdCatalogo} value={clasificacion.IdCatalogo}>
                      {clasificacion.DescLarga}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Prioridad</div>
              <Form.Item name="LstPrioridad">
                <Select
                  mode="multiple"
                  placeholder="Seleccionar prioridad"
                  style={{ width: '100%' }}
                >
                  <Select.Option key={-1} value={-1}>Sin prioridad</Select.Option>
                  {prioridades?.map((prioridad) => (
                    <Select.Option key={prioridad.IdCatalogo} value={prioridad.IdCatalogo}>
                      {prioridad.DescLarga}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>Estatus</div>
              <Form.Item name="LstEstatus">
                <Select
                  mode="multiple"
                  placeholder="Seleccionar estatus"
                  style={{ width: '100%' }}
                >
                  <Select.Option key={-1} value={-1}>Sin prioridad</Select.Option>
                  {estatus?.map((estatus) => (
                    <Select.Option key={estatus.IdWorkFlow} value={estatus.IdWorkFlow}>
                      {estatus.Nombre}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default Filtros;