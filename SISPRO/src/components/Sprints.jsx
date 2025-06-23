import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Progress, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Tag, 
  Drawer,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Tooltip,
  Badge,
  Skeleton
} from 'antd';
import { PlusOutlined, CalendarOutlined, FilterOutlined, SyncOutlined } from '@ant-design/icons';
import ButtonGroup from 'antd/es/button/button-group';
import FiltrosSprints from './FiltrosSprints';
import WelcomeScreenTab from './WelcomeTabScreen';
import axios from "axios";
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Sprints = ({IdWorkSpaceTab}) => {

 const [selectedProject, setSelectedProject] = useState('');
 const [selectedType, setSelectedType] = useState('');
 const [showFilters, setShowFilters] = useState(false);
 const [drawerVisible, setDrawerVisible] = useState(false);
 const [isLoading, setIsLoading] = useState(false); 
 const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [WorkSpaceTab, setWorkSpaceTab] = useState(0);
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ 
    Proyecto: null,
    LstEstatus: []
  });
  // Mock data - Reemplazar con datos reales de tu API/Backend
//   const sprints = [
//     {
//       id: 1,
//       name: "Sprint 1",
//       objective: "Implementar autenticación de usuarios y dashboard principal",
//       startDate: "2025-01-20",
//       endDate: "2025-02-03",
//       progress: 75,
//       status: "progreso",
//       projectId: 1
//     },
//     {
//       id: 2,
//       name: "Sprint 2",
//       objective: "Desarrollo de módulo de gestión de proyectos",
//       startDate: "2025-02-04",
//       endDate: "2025-02-18",
//       progress: 30,
//       status: "abierto",
//       projectId: 2
//     }
//   ];

  // Mock data para la lista de proyectos
//   const projects = [
//     { id: 1, name: "Proyecto A" },
//     { id: 2, name: "Proyecto B" },
//     { id: 3, name: "Proyecto C" },
//   ];


useEffect(() => {

    fetchProjects();

 }, []);



  useEffect(() => {

     setWorkSpaceTab(IdWorkSpaceTab);
     fetchDataFromTab(IdWorkSpaceTab);


  }, [IdWorkSpaceTab]);


  const fetchProjects = async () => {
    try {


      const resProjects = await axios.post("/Proyectos/CargaListaProyectos"); 

      var projectsData = jQuery.parseJSON(resProjects.data.LstProyectos);
  
      if (resProjects.data.Exito) {
        setProjects(projectsData);
        }
         else {
       message.error(resProjects.data.Mensaje);
         }    
        
    } catch (error) {
      console.error('Error al cargar filtros:', error);
    } finally {

    }
  };

  useEffect(() => {
    if (filters.Proyecto != null && filters.LstEstatus != null) {
        fetchSprints(filters);
      const count = Object.values(filters).filter(value => 
        Array.isArray(value) ? value.length > 0 : value !== null
      ).length;
      setActiveFiltersCount(count);
    }
  }, [filters]);

  const fetchSprints = async (filters) => {
    try {
      setIsLoading(true);
      const Filtros = {
        IdProyecto: filters.Proyecto,
        LstEstatus: filters.LstEstatus
      };

      const result = await axios.post("/Proyectos/ConsultarSprintsWS", { 
        IdWorkSpaceTab: WorkSpaceTab, 
        Filtros 
      });

      if (result.data.Exito) {
        const Sprints = JSON.parse(result.data.Sprints);
        setSprints(Sprints);

      } else {
        message.error(result.data.Mensaje);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const RefreshSprints = () => {
    fetchSprints(filters);
  };


  const fetchDataFromTab =  async (IdWorkSpaceTab) => {
    if (!IdWorkSpaceTab) return;

     setIsLoading(true);
    try {
      const response = await axios.post('/Workspace/ConsultaWorkspaceTab', { IdWorkSpaceTab: IdWorkSpaceTab});

      if (response.data.Exito) {

        const  wst =  JSON.parse(response.data.WorkSpaceTab);
   
        const filterData = typeof wst.Filtros === 'string' 
          ? JSON.parse(wst.Filtros) 
          : wst.Filtros;

        if (filterData) {
          // Update filters state with received data
          setFilters({
            Proyecto: filterData.IdProyecto || null,
            LstEstatus: filterData.LstEstatus || null,
          });

           setSelectedProject(filterData.IdProyecto || '');
           setSelectedType(filterData.Tipo || '');
        } 

      } else {

      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };


const getStatusTag = (status) => {
    const statusConfig = {
      Abierto: { color: '#1890ff', text: 'Abierto' },
      Progreso: { color: '#faad14', text: 'En Progreso' },
      Terminado: { color: '#52c41a', text: 'Terminado' },
      Cancelado: { color: '#8c8c8c', text: 'Cancelado' }
    };


    const config = statusConfig[status] || statusConfig.abierto;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleSprintClick = (sprintId) => {

    window.open(`/Proyectos/SprintReport/${sprintId}`, '_blank', 'noopener,noreferrer')

  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onDrawerClose = () => {
    setDrawerVisible(false);
    form.resetFields();
  };

  const GuardarSprint = async (values) => {

    try {
        const newSprint = {
            ...values,
            FechaInicio: values.sprintDates[0].format('YYYY-MM-DD'),
            FechaFin: values.sprintDates[1].format('YYYY-MM-DD'),
          };
          

        const res = await axios.post("/Proyectos/GuardarSprint", {Sprint: newSprint}); 
        if (res.data.Exito) {
    
           fetchSprints(filters);

          message.success('Sprint creado exitosamente');
          onDrawerClose();

        } else {
          message.error(res.data.Mensaje);
        }
      } catch (error) {
 
        message.error('No se pudo crear el espacio de trabajo.');
      }


  };

  const renderLoadingSkeleton = (columns = 6) => (
    <Row gutter={16}>
      {Array.from({ length: columns }).map((_, index) => (
        <Col key={index} span={24 / columns}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
      ))}
    </Row>
  );
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (

    <>
    <FiltrosSprints
    isOpen={showFilters}
    onClose={() => setShowFilters(false)}
    filters={filters}
    setFilters={setFilters}
    setSelectedProject={setSelectedProject}
    setSelectedType={setSelectedType}
  />
   
   {filters.Proyecto ? (
    <div style={{ padding: 10 }}>
   
      

      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <Space direction="horizontal" size={8}  style={{ width: '50%'}}>
        <Button 
          type="default" 
          icon={<PlusOutlined />}
          onClick={showDrawer}
        >
          Nuevo Sprint
        </Button>
        </Space>
        <Space direction="horizontal" style={{ width: '50%', justifyContent: 'flex-end' }}>

          <ButtonGroup>
          <Tooltip title="Filtros">
                      <Badge count={activeFiltersCount} offset={[-15, 0]} size="middle" color='#3FBAE4'>
                        <Button
                          type="text"
                         icon={<FilterOutlined />}
                           onClick={toggleFilters}
                          style={{ fontSize: '16px', marginRight: '10px' }}
                        />
                      </Badge>
                    </Tooltip>

          <Button
                        title='Actualizar'
                        type="text"
                         icon={<SyncOutlined />}
                         onClick={RefreshSprints}
                        style={{ fontSize: '16px', marginRight: '10px' }}
              />

              </ButtonGroup>


          </Space>

      </div>

    {isLoading ? (
     renderLoadingSkeleton(1)

    ):(
      <Row gutter={[16, 16]}>
        {sprints.map((sprint) => (
          <Col xs={24} sm={12} lg={8} key={sprint.IdIteracion}>
            <Card
              hoverable
              onClick={() => handleSprintClick(sprint.IdIteracion)}
              title={
                <Row justify="space-between" align="middle">
                  <Typography.Text strong>{sprint.Nombre}</Typography.Text>
                  {getStatusTag(sprint.EstatusStr)}
                </Row>
              }
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Typography.Paragraph 
                    ellipsis={{ rows: 2 }}
                    style={{ marginBottom: 16 }}
                  >
                    {sprint.Objetivo}
                  </Typography.Paragraph>
                </div>
                
                <Space>
                  <CalendarOutlined />
                  <Typography.Text type="secondary">
                    {new Date(sprint.FechaInicio).toLocaleDateString()} - {new Date(sprint.FechaFin).toLocaleDateString()}
                  </Typography.Text>
                </Space>

                <Progress 
                  percent={sprint.Avance} 
                  status={sprint.Avance >= 100 ? 'success' : 'active'}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    )}
      <Drawer
        title="Crear Nuevo Sprint"
        width={520}
        onClose={onDrawerClose}
        open={drawerVisible}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={GuardarSprint}
        >
          <Form.Item
            name="IdProyecto"
            label="Proyecto"
            rules={[{ required: true, message: 'Por favor selecciona un proyecto' }]}
          >
            <Select placeholder="Selecciona un proyecto">
               {projects.map((proyecto) => (
                                 <Select.Option key={proyecto.IdCatalogo} value={proyecto.IdCatalogo}>
                                   {proyecto.DescLarga}
                                 </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="Nombre"
            label="Nombre del Sprint"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del sprint' }]}
          >
            <Input placeholder="Ej: Sprint 1" />
          </Form.Item>

          <Form.Item
            name="sprintDates"
            label="Fechas del Sprint"
            rules={[{ required: true, message: 'Por favor selecciona las fechas del sprint' }]}
          >
            <RangePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="Objetivo"
            label="Objetivo del Sprint"
            rules={[{ required: true, message: 'Por favor ingresa el objetivo del sprint' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe el objetivo principal del sprint..."
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Space size="middle" style={{ float: 'right' }}>
          
              <Button type="primary" htmlType="submit">
                Crear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
   ):(    
     <WelcomeScreenTab setShowFilters={setShowFilters} />
     ) }

 </>
     
  );
};

export default Sprints;


// import { Card, Button, Progress, Row, Col, Typography, Space } from 'antd';
// import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';

// const { Title } = Typography;

// const Sprints= () => {
//   // Mock data - Reemplazar con datos reales de tu API/Backend
//   const sprints = [
//     {
//       id: 1,
//       name: "Sprint 1",
//       objective: "Implementar autenticación de usuarios y dashboard principal",
//       startDate: "2025-01-20",
//       endDate: "2025-02-03",
//       progress: 75
//     },
//     {
//       id: 2,
//       name: "Sprint 2",
//       objective: "Desarrollo de módulo de gestión de proyectos",
//       startDate: "2025-02-04",
//       endDate: "2025-02-18",
//       progress: 30
//     }
//   ];

//   const handleSprintClick = (sprintId) => {
//     // Implementar navegación al detalle del sprint
//     console.log(`Navegando al sprint ${sprintId}`);
//   };

//   const handleCreateSprint = () => {
//     // Implementar lógica para crear nuevo sprint
//     console.log('Crear nuevo sprint');
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
//         <Title level={2}>Sprints del Proyecto</Title>
//         <Button 
//           type="primary" 
//           icon={<PlusOutlined />}
//           onClick={handleCreateSprint}
//         >
//           Nuevo Sprint
//         </Button>
//       </Row>

//       <Row gutter={[16, 16]}>
//         {sprints.map((sprint) => (
//           <Col xs={24} sm={12} lg={8} key={sprint.id}>
//             <Card
//               hoverable
//               onClick={() => handleSprintClick(sprint.id)}
//               title={sprint.name}
//               extra={<Progress type="circle" percent={sprint.progress} width={30} />}
//             >
//               <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//                 <div>
//                   <Typography.Paragraph 
//                     ellipsis={{ rows: 2 }}
//                     style={{ marginBottom: 16 }}
//                   >
//                     {sprint.objective}
//                   </Typography.Paragraph>
//                 </div>
                
//                 <Space>
//                   <CalendarOutlined />
//                   <Typography.Text type="secondary">
//                     {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
//                   </Typography.Text>
//                 </Space>

//                 <Progress 
//                   percent={sprint.progress} 
//                   status={sprint.progress >= 100 ? 'success' : 'active'}
//                   strokeColor={{
//                     '0%': '#108ee9',
//                     '100%': '#87d068',
//                   }}
//                 />
//               </Space>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default Sprints;