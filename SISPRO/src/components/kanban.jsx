import React, { useState, useEffect } from 'react';
import { Button, Select ,message , Skeleton, Row, Card, Col, Tabs, Drawer ,Dropdown, Menu, Typography} from 'antd';
import { FilterOutlined, SettingOutlined,SyncOutlined ,MoreOutlined, PlusOutlined,  } from '@ant-design/icons';
import * as AntdIcons from "@ant-design/icons";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from "axios";
import dayjs from "dayjs";
import ColumnConfig from './ColumnConfig';
import KanbanBoard from './KanbanBoard';
import TaskFilter from './TaskFilter';
import TaskList from './TaskList';
import Calendar from './Calendar';
import TaskTable from './TaskTable';
import Timeline from './Timeline';
import Task from './Task';
import TaskGraficas from './TaskGraficas';


const { Option } = Select;
const { TabPane } = Tabs;

// const defaultTabItems = [
//   { id: "1", key: "1", label: "Kanban" },
//   { id: "2", key: "2", label: "Lista" },
//   { id: "3", key: "3", label: "Tabla"  },
//   { id: "4", key: "4", label: "Calendario" },
//   { id: "5", key: "5", label: "Cronograma" },
//   { id: "6", key: "6", label: "Graficas" }
// ];

// const ALL_TAB_ITEMS = [
//   { id: "1", key: "1", label: "Kanban", permanent: true },
//   { id: "2", key: "2", label: "Lista" },
//   { id: "3", key: "3", label: "Tabla" },
//   { id: "4", key: "4", label: "Calendario" },
//   { id: "5", key: "5", label: "Cronograma" },
//   { id: "6", key: "6", label: "Graficas" }
// ];

const ALL_TAB_ITEMS = [
  { id: "1", key: "1", label: "Kanban", type: "kanban", permanent: true },
  { id: "2", key: "2", label: "Lista", type: "list" },
  { id: "3", key: "3", label: "Tabla", type: "table" },
  { id: "4", key: "4", label: "Calendario", type: "calendar" },
  { id: "5", key: "5", label: "Cronograma", type: "timeline" },
  { id: "6", key: "6", label: "Graficas", type: "charts" }
];


const defaultActiveKey= "1";
const STORAGE_KEY = 'yt-items-taborder';
const STORAGE_KEY_tab = 'yt-items-key';

const Kanban = () => {
 const [columns, setColumns] = useState([]); // Columnas del Kanban
  const [tasks, setTasks] = useState([]); // Tareas del Kanban
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [resources, setResources] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [fases, setFases] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ Fechas: [null, null],
                                           LstSprints: [] ,
                                           LstAsignado: [] ,
                                           LstResponsable: [] ,
                                           LstTipoActividad: [] ,
                                           LstClasificacion: [] ,
                                           LstPrioridad: [] ,
                                           });
   const [selectedActivity, setSelectedActivity] = useState(null);
   const [modalVisible, setModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [tabItems, setTabItems] = useState(() => {
    try {
      const savedTabs = localStorage.getItem(STORAGE_KEY);
      return savedTabs ? JSON.parse(savedTabs) : ALL_TAB_ITEMS;
    } catch (error) {
      console.error('Error loading tabs from localStorage:', error);
      return ALL_TAB_ITEMS;
    }
  });

  const [visibleTabItems, setVisibleTabItems] = useState();

  // const [visibleTabItems, setVisibleTabItems] = useState(() => {
  //   try {
  //     const saved = localStorage.getItem(STORAGE_KEY);
  //     if (saved) {
  //       const parsed = JSON.parse(saved);
  //       return Array.isArray(parsed) ? parsed : (parsed.tabs || [ALL_TAB_ITEMS[0]]);
  //     }
  //     return [ALL_TAB_ITEMS[0]];
  //   } catch (error) {
  //     console.error('Error loading tabs:', error);
  //     return [ALL_TAB_ITEMS[0]];
  //   }
  // });


  const handleRenameTab = (tabKey, newName) => {
    setVisibleTabItems(prev => 
      prev.map(tab => 
        tab.key === tabKey ? { ...tab, label: newName } : tab
      )
    );
  };

  // const [activeKey, setActiveKey] = useState(() => {
  //   try {
     
  //     const savedTabs = localStorage.getItem(STORAGE_KEY);
  //     const  orden=   savedTabs ? JSON.parse(savedTabs) : defaultTabItems;
  //     return orden[0].key;
           
  //   } catch (error) {
  //     console.error('Error loading tabs from localStorage:', error);
  //     return defaultActiveKey;
  //   }
  // });

  const [activeKey, setActiveKey] = useState(() => {
    try {
      return visibleTabItems[0]?.key || "1";
    } catch (error) {
      console.error('Error loading active tab:', error);
      return "1";
    }
  });



  // const [visibleTabItems, setVisibleTabItems] = useState(() => {
  //   try {
  //     const savedTabs = localStorage.getItem(STORAGE_KEY);
  //     return savedTabs ? JSON.parse(savedTabs) : [ALL_TAB_ITEMS[0]];
  //   } catch (error) {
  //     console.error('Error loading tabs from localStorage:', error);
  //     return [ALL_TAB_ITEMS[0]];
  //   }
  // });


  const [isTabSelectVisible, setIsTabSelectVisible] = useState(false);




  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tabs: visibleTabItems,
      activeKey
    }));
  }, [visibleTabItems, activeKey]);

  const handleAddTabClick = (event) => {
    setTabMenuAnchorEl(event.currentTarget);
  };

  const handleTabMenuClose = () => {
    setTabMenuAnchorEl(null);
  };

  const handleAddTab = () => {
    setIsTabSelectVisible(true);
  };

  const handleStartEditing = (tabKey) => {
    setVisibleTabItems(prev =>
      prev.map(tab => ({
        ...tab,
        editing: tab.key === tabKey
      }))
    );
  };

  // const handleTabSelect = (selectedTab) => {
  //   if (!visibleTabItems.find(tab => tab.key === selectedTab.key)) {
  //     setVisibleTabItems(prev => [...prev, selectedTab]);
  //   }
  //   setIsTabSelectVisible(false);
  // };

  const handleRemoveTab = (tabKey) => {
    if (tabKey === "1") return; // Prevent removing Kanban tab
    setVisibleTabItems(prev => prev.filter(tab => tab.key !== tabKey));
    if (activeKey === tabKey) {
      setActiveKey("1");
    }
  };

  // const getAvailableTabs = () => {
  //   return ALL_TAB_ITEMS.filter(
  //     tab => !visibleTabItems.find(visibleTab => visibleTab.key === tab.key)
  //   );
  // };

  // const getAvailableTabs = () => {
  //   const availableTabs = ALL_TAB_ITEMS.filter(
  //     tab => !visibleTabItems.some(visibleTab => visibleTab.key === tab.key)
  //   );
  //   return availableTabs.length ? availableTabs : ALL_TAB_ITEMS.slice(1); // Exclude Kanban tab
  // };

  const getAvailableTabs = () => {
    return ALL_TAB_ITEMS;
  };

  const handleCreate = () => {
    setSelectedActivity(null);
    setModalVisible(true);
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

  const generateUniqueId = (type) => {
    const existingIds = visibleTabItems.filter(item => item.type === type).length;
    return `${type}-${existingIds + 1}`;
  };
  
  const handleTabSelect = (selectedTab) => {
    const newTab = {
      ...selectedTab,
      id: generateUniqueId(selectedTab.type),
      key: generateUniqueId(selectedTab.type),
      label: `${selectedTab.label} ${visibleTabItems.filter(item => item.type === selectedTab.type).length + 1}`,
      permanent: false
    };
    setVisibleTabItems(prev => [...prev, newTab]);
  };

  const renderTabContent = (type, key) => {
    switch (type) {
      case 'kanban':
        return (
            <KanbanBoard
            />

        );
      case 'list':
        return (
          <TaskList
            tasks={tasks}
            columns={columns}
            estatus={columns}
            resources={resources}
            priorities={prioridades}
            sprints={sprints}
            setTasks={setTasks}
            RefreshTask={RefreshTask}
            selectedProject={selectedProject}
            selectedType={selectedType}
          />
        );
      case 'table':
        return (
          <TaskTable
            tasks={tasks}
            estatus={columns}
            resources={resources}
            priorities={prioridades}
            sprints={sprints}
            fases={fases}
            clasificaciones={clasificaciones}
            taskTypes={taskTypes}
            setTasks={setTasks}
            RefreshTask={RefreshTask}
            selectedProject={selectedProject}
            selectedType={selectedType}
          />
        );
      case 'calendar':
        return <Calendar tasks={tasks} />;
      case 'timeline':
        return <Timeline tasks={tasks} />;
      case 'charts':
        return <TaskGraficas/>;
      default:
        return null;
    }
  };


  // const renderTabBar = (props, DefaultTabBar) => (
 
  //   <DragDropContext onDragEnd={onDragEndTabs}>
  //     <Droppable droppableId="tabs" direction="horizontal">
  //       {(provided) => (
  //         <div
  //           ref={provided.innerRef}
  //           {...provided.droppableProps}
  //           style={{ display: 'flex', width: '100%' }}
  //         >
  //           {tabItems.map((item, index) => {
  //             const IconComponent = getIconForTab(item.label);
  //             return (
  //               <Draggable key={item.id} draggableId={item.id} index={index}>
  //               {(provided, snapshot) => (
  //                 <div
  //                   ref={provided.innerRef}
  //                   {...provided.draggableProps}
  //                   //  {...provided.dragHandleProps}
  //                   onClick={() => setActiveKey(item.key)}
  //                      style={{
  //                             ...provided.draggableProps.style,
  //                             // cursor: snapshot.isDragging ? 'grabbing' : 'grab',
  //                             backgroundColor: snapshot.isDragging ? '#fafafa' : 'transparent',
  //                             padding: '8px 16px',
  //                             margin: '0 4px',
  //                             borderBottom: `1px solid ${activeKey === item.key ? '#1890ff' : '#d9d9d9'}`,
  //                             borderRadius: '2px',
  //                             userSelect: 'none',
  //                             fontSize: '12px',
  //                           }}

  //                 >
                   
  //                  <span>
  //                      {IconComponent ? <IconComponent style={{marginRight:5}} /> : ""}
  //                    </span>
              
  //                   { item.label}
  //                     {/* Botón de arrastre */}
  //                         <Button
  //                           //  size="small" 
  //                           // {...provided.draggableProps}
  //                           {...provided.dragHandleProps}
  //                           icon={<MoreOutlined  />}
  //                           type="text"
                         
  //                            style={{ marginleft: 12, 
                              
  //                             cursor: snapshot.isDragging ? 'grabbing' : 'grab',
  //                           }}
  //                         />
                    
  //                 </div>
  //               )}
  //               </Draggable>
  //             );
  //           })}
  //           {provided.placeholder}
  //         </div>
  //       )}
  //     </Droppable>
  //   </DragDropContext>
  // );

  // const renderTabBar = (props, DefaultTabBar) => (
  //   <DragDropContext onDragEnd={onDragEndTabs}>
  //     <Droppable droppableId="tabs" direction="horizontal">
  //       {(provided) => (
  //         <div
  //           ref={provided.innerRef}
  //           {...provided.droppableProps}
  //           style={{ display: 'flex', width: '100%' }}
  //         >
  //           {visibleTabItems.map((item, index) => {
  //             const IconComponent = getIconForTab(item.label);
  //             return (
  //               <Draggable key={item.id} draggableId={item.id} index={index}>
  //                 {(provided, snapshot) => (
  //                   <div
  //                     ref={provided.innerRef}
  //                     {...provided.draggableProps}
  //                     onClick={() => setActiveKey(item.key)}
  //                     style={{
  //                       ...provided.draggableProps.style,
  //                       backgroundColor: snapshot.isDragging ? '#fafafa' : 'transparent',
  //                       padding: '8px 16px',
  //                       margin: '0 4px',
  //                       borderBottom: `1px solid ${activeKey === item.key ? '#1890ff' : '#d9d9d9'}`,
  //                       borderRadius: '2px',
  //                       userSelect: 'none',
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       fontSize: '12px'
  //                     }}
  //                   >
  //                     {IconComponent && <IconComponent style={{ marginRight: 5, fontSize:'12px' }} />}
  //                     {item.label}
  //                     <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
  //                     {!item.permanent && (
  //                   <Button
  //                   type="text"
  //                   icon={<AntdIcons.DeleteOutlined style={{ fontSize: '12px' }} />}
  //                   onClick={(e) => {
  //                     e.stopPropagation();
  //                     handleRemoveTab(item.key);
  //                   }}
  //                   style={{ 
  //                     padding: '0 4px',
  //                     height: '20px',
  //                     minWidth: '20px',
  //                     opacity: 0,
  //                     display: 'inline-flex'
  //                   }}
  //                   className="delete-btn-tab"
  //                 />
  //                       )}
  //                       <Button
  //                         {...provided.dragHandleProps}
  //                         icon={<MoreOutlined />}
  //                         type="text"
  //                         style={{
  //                           cursor: snapshot.isDragging ? 'grabbing' : 'grab',
  //                         }}
  //                       />

  //                     </div>
  //                   </div>
  //                 )}
  //               </Draggable>
  //             );
  //           })}
  //           {provided.placeholder}
  //           <Dropdown
  //             overlay={
  //               <Menu>
  //                 {/* {getAvailableTabs().map(tab => (
  //                   <Menu.Item 
  //                     key={tab.key}
  //                     onClick={() => handleTabSelect(tab)}
  //                     icon={getIconForTab(tab.label)}
  //                   >
  //                     {tab.label}
  //                   </Menu.Item>
  //                 ))} */}
  //               {getAvailableTabs().map(tab => (
  //                 <Menu.Item 
  //                   key={tab.key}
  //                   onClick={() => handleTabSelect(tab)}
  //                 >
  //                   {getIconForTab(tab.label) && React.createElement(getIconForTab(tab.label))}
  //                   <span style={{ marginLeft: 8 }}>{tab.label}</span>
  //                 </Menu.Item>
  //               ))}

  //               </Menu>
  //             }
  //             trigger={['click']}
  //           >
  //             <Button
  //               type="text"
  //               icon={<PlusOutlined />}
  //               onClick={e => e.preventDefault()}
  //               style={{ marginLeft: 8 }}
  //             />
  //           </Dropdown>
  //         </div>
  //       )}
  //     </Droppable>
  //   </DragDropContext>
  // );

  const renderTabBar = (props, DefaultTabBar) => (
    <DragDropContext onDragEnd={onDragEndTabs}>
      <Droppable droppableId="tabs" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: 'flex', width: '100%' }}
          >
            {visibleTabItems.map((item, index) => {
              // const IconComponent = getIconForTab(item.label);
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      onClick={() => setActiveKey(item.key)}
                      className="tab-item hover:bg-gray-50"
                      style={{
                        ...provided.draggableProps.style,
                        backgroundColor: snapshot.isDragging ? '#fafafa' : 'transparent',
                        padding: '8px 16px',
                        margin: '0 4px',
                        borderBottom: `1px solid ${activeKey === item.key ? '#1890ff' : '#d9d9d9'}`,
                        borderRadius: '2px',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        position: 'relative'
                      }}
                    >
                     {getIconForTab(item.type) && React.createElement(getIconForTab(item.type))}
                      {/* {item.label} */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginLeft: 8,
                        opacity: snapshot.isDragging ? 1 : undefined
                      }}>
                        <Typography.Text
                           editable={{
                            onChange: (newName) => handleRenameTab(item.key, newName),
                            // triggerType: ['text'],
                            // editing: item.editing,
                            //   icon: <AntdIcons.EditOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                              
                              
                            //   />

                              triggerType: ['text'],
                              enterIcon: <AntdIcons.EditOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }}/>,
                              onStart: () => item.editing
                          }}
                          style={{ marginRight: 8 }}
                          onDoubleClick={() => handleStartEditing(item.key)}
                        >
                          {item.label}
                        </Typography.Text>
                        {!item.permanent && (
                          <Button
                            type="text"
                            icon={<AntdIcons.DeleteOutlined style={{ fontSize: '12px' }} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTab(item.key);
                            }}
                            style={{ 
                              padding: '0 4px',
                              height: '20px',
                              minWidth: '20px',
                              opacity: 0,
                              display: 'inline-flex'
                            }}
                            className="delete-btn-tab"
                          />
                        )}
                        <Button
                          {...provided.dragHandleProps}
                          icon={<MoreOutlined />}
                          type="text"
                          style={{
                            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                            padding: '0 4px',
                          
                          }}
                        />

                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            <Dropdown
              overlay={
                <Menu>
                  {getAvailableTabs().map(tab => (
                    <Menu.Item 
                      key={tab.key}
                      onClick={() => handleTabSelect(tab)}
                    >
                      {getIconForTab(tab.label) && React.createElement(getIconForTab(tab.label))}
                      <span style={{ marginLeft: 8 }}>{tab.label}</span>
                    </Menu.Item>
                  ))}
                </Menu>
              }
              trigger={['click']}
            >
              <Button
                type="text"
                icon={<PlusOutlined   style={{ fontSize: '10px' }}/>}
                onClick={e => e.preventDefault()}
                style={{ marginLeft: 8 }}
              />
            </Dropdown>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  const onDragEndTabs = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = Array.from(visibleTabItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setVisibleTabItems(newItems);
  };

  const getIconForTab = (type) => {
    switch (type) {
      case "kanban":
        return  AntdIcons.GroupOutlined;
      case "list":
        return AntdIcons.BarsOutlined;
      case "table":
        return AntdIcons.TableOutlined;
      case "calendar":
        return AntdIcons.CalendarOutlined;
      case "timeline":
          return AntdIcons.FieldTimeOutlined;
      case "charts":
          return AntdIcons.BarChartOutlined;
      default:
        return null; // O un icono por defecto
    }
  };



  // Guardar en localStorage cuando cambie el orden
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleTabItems));
      localStorage.setItem(STORAGE_KEY_tab, activeKey);
    } catch (error) {
      console.error('Error saving tabs to localStorage:', error);
    }
  }, [visibleTabItems]);

  const fetchFilters = async () => {
    try {
      setIsLoading(true);


      const resProjects = await axios.post("/Proyectos/CargaListaProyectos"); 

      var projectsData = jQuery.parseJSON(resProjects.data.LstProyectos);
  
      if (resProjects.data.Exito) {
        setProjects(projectsData);
        setSelectedProject(projectsData[0].IdCatalogo);
        }
         else {
       message.error(resProjects.data.Mensaje);
         }    


         const resWI = await axios.post("/Actividades/CargaListaTipoActividad"); 
         var typesData = jQuery.parseJSON(resWI.data.LstWorkItems)
         if (resWI.data.Exito) {
            setTaskTypes(typesData);
            setSelectedType(1);

           }
            else {
          message.error(resProjects.data.Mensaje);
            }    
   
        
    } catch (error) {
      console.error('Error al cargar filtros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchColumns = async (projectId, taskType) => {
    try {
      setIsLoadingColumns(true);

      const Filtros = {
        IdProyecto: projectId,
        Tipo: taskType,
      };
     
      const resColumns = await axios.post("/Board/ConsultaWorkFlow", Filtros); 

      var ColumnsData = jQuery.parseJSON(resColumns.data.Workflow);
  
      if (resColumns.data.Exito) {
        setColumns(ColumnsData);
        }
         else {
       message.error(resColumns.data.Mensaje);
         }   
    } catch (error) {
      console.error('Error al cargar columnas:', error);
    } finally {
      setIsLoadingColumns(false);
    }
  };

  const fetchResources = async (projectId) => {
    try {
      const response = await axios.post('/Board/CargaFiltros', { IdProyecto: projectId } ); // Cambia la ruta según tu API
      if (response.data.Exito) {
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

  // Cargar tareas del Kanban
  const fetchTasks = async (projectId, taskType, filters) => {
    try {
      setIsLoadingTasks(true);

      const Filtros = {
        IdProyecto: projectId,
        Tipo: taskType,
        LstSprints: filters.LstSprints,
        FechaSolIni : filters.Fechas?.[0],
        FechaSolFin : filters.Fechas?.[1],
        LstAsignado : filters.LstAsignado,
        LstResponsable: filters.LstResponsable,
        LstTipoActividad : filters.LstTipoActividad,
        LstClasificacion: filters.LstClasificacion,
        LstPrioridad: filters.LstPrioridad

      };

      const resTask = await axios.post("/Board/ConsultaActividadesTablero", Filtros); 

      var taskData = jQuery.parseJSON(resTask.data.Actividades);
  
      if (resTask.data.Exito) {
 
        setTasks(taskData);
        }
         else {
       message.error(resTask.data.Mensaje);
         }  

    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterKey]: value }));
  };

  const RefreshTask =async  () => {
    fetchTasks (selectedProject, selectedType, filters);
  };

  const RefreshAll =async  () => {
    fetchColumns(selectedProject,selectedType);
    fetchTasks (selectedProject, selectedType, filters);
  };

 

  useEffect(() => {
    fetchFilters();
      const startDate = dayjs().subtract(1, "month");
      const endDate = dayjs();
  
      handleFilterChange("Fechas", [startDate, endDate]);

  }, []);

  useEffect(() => {
    if (selectedProject != "" && selectedType != "") {


      fetchColumns(selectedProject,selectedType);
      fetchTasks(selectedProject, selectedType, filters);
      //fetchResources(selectedProject);
    }

    if (selectedProject != "") {
 
      fetchResources(selectedProject);
    }
    else {
      setResources([]); // Limpia los recursos si no hay proyecto seleccionado
    }

  }, [selectedProject, selectedType,filters]);

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Alternar visibilidad de los filtros
  };

    const toggleDrawer = () => {
      setIsDrawerVisible((prev) => !prev);
    };



  return (
    <div>


        {/* <div
          style={{
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >

          <div style={{ flex: 1 }}>
            <Select
              placeholder="Filtrar por proyecto"
              style={{ width: '60%' }}
              onChange={(value) => setSelectedProject(value)}
              value={selectedProject}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {projects.map((project) => (
                <Option key={project.IdCatalogo} value={project.IdCatalogo}>
                  {project.DescLarga}
                </Option>
              ))}
            </Select>
          </div>

    
          <div style={{ width: '16px' }}></div>


  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Select
      placeholder="Tipo de actividad"
      onChange={(value) => setSelectedType(value)}
      value={selectedType}
      style={{
        width: 200,
        border: 'none',
        background: 'none',
        marginRight: '10px',
      }}
      dropdownStyle={{ zIndex: 2000 }}
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


    <Button
      type="text"
      icon={<FilterOutlined />}
      onClick={toggleFilters}
      style={{ fontSize: '16px', marginRight: '10px' }}
    />


    <Button
      type="text"
      icon={<SyncOutlined />}
      onClick={RefreshTask}
      style={{ fontSize: '16px', marginRight: '10px' }}
    />


    <Button
      type="text"
      icon={<SettingOutlined />}
      onClick={toggleDrawer}
      style={{ fontSize: '16px' }}
    />
   <Button
      type="text"
      title='Nueva actividad'
      icon={<SettingOutlined />}
      onClick={handleCreate}
      style={{ fontSize: '16px' }}
    />

  </div>
      </div> */}
    {/* Sección de Filtros */}

         {/* <TaskFilter
         isOpen={showFilters}
         onClose={() => setShowFilters(false)}
         sprints={sprints}
         resources={resources}
         fases={fases}
         clasificaciones={clasificaciones}
         prioridades={prioridades}
         handleFilterChange={handleFilterChange}
         filters={filters}
       /> */}
   

{/* 
<ColumnConfig
         columns={columns}
         RefreshAll={RefreshAll}
          isDrawerVisible={isDrawerVisible}
          toggleDrawer={toggleDrawer}
          selectedProject={selectedProject}
          selectedType={selectedType}

      /> */}

{/* <Drawer 
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      width="40%"
      placement="right"
    >
      <Task 
        // activityId={activityId}
        onSave={() => {
          // Lógica después de guardar
          onClose();
        }}
      />
    </Drawer>
{/*  */}
   {/* <Task
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
      //activityId={123} // opcional, para edición
    /> } */}

<div style={{ width: '100%' }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        renderTabBar={renderTabBar}
        style={{ paddingLeft: '16px', paddingRight: '16px' }}
      >
        {/* {tabItems.map(item => ( */}

        {visibleTabItems.map(item => (
          <TabPane key={item.key} tab={item.label}>
            {renderTabContent(item.type, item.key)}
          </TabPane>
        ))}

        <Dropdown
        overlay={
          <Menu>
            {getAvailableTabs().map(tab => (
              <Menu.Item 
                key={tab.key}
                onClick={() => handleTabSelect(tab)}
              >
                {getIconForTab(tab.type) && React.createElement(getIconForTab(tab.type))}
                <span style={{ marginLeft: 8 }}>{tab.label}</span>
              </Menu.Item>
            ))}
          </Menu>
        }
        trigger={['click']}
      >
        <Button
          type="text"
          icon={<PlusOutlined />}
          style={{ marginLeft: 8 }}
        />
      </Dropdown>
        {/* ))} */}
      </Tabs>
    </div>
    </div>
  );

};

export default Kanban;
