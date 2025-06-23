import React, { useRef, useState,useCallback, useEffect  } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button,message, FloatButton, Input, Space, Row,Col, Skeleton, Card, Badge,Tooltip, Typography} from 'antd';
import { LeftOutlined ,SyncOutlined , PlusOutlined, FilterOutlined, SettingOutlined   } from '@ant-design/icons';
import TaskCard from './TaskCard';
import Filtros from './Filtros';
import axios from "axios";
import dayjs from 'dayjs';
import ColumnConfig from './ColumnConfig';
import TextArea from 'antd/es/input/TextArea';
import { styleRuleByName } from 'craco-less/lib/utils';
import ButtonGroup from 'antd/es/button/button-group';
import WelcomeScreenTab from './WelcomeTabScreen';

const { Text } = Typography;
// import { Badge } from 'antd';
const KanbanBoard =React.memo( ({ 
                                 IdWorkSpaceTab
                               }) => {

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [newTaskTextKanban, setNewTaskTextKanban] = useState(''); 
  const [activeColumn, setActiveColumn] = useState(null); 
  const [activeFilter, setActiveFilter] = useState(null); 
  const [filterstext, setFilterText] = useState({}); 
  const [isLoading, setIsLoading] = useState(false); 
  const [columns, setColumns] = useState([]); 
  const [tasksboard, setTasksboard] = useState([]); 
  const [showFilters, setShowFilters] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [WorkSpaceTab, setWorkSpaceTab] = useState(0);
  const [filtersboard, setFiltersboard] = useState({ 
    Proyecto:null,
    Tipo:null,
    Fechas: [null, null],
    LstSprints: [] ,
    LstAsignado: [] ,
    LstResponsable: [] ,
    LstTipoActividad: [] ,
    LstClasificacion: [] ,
    LstPrioridad: [] ,
    LstEstatusW: [] 
    });
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [resources, setResources] = useState([]);
  const [sprints, setSprints] = useState([]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters); 
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplica por 2 para ajustar la velocidad
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const toggleCollapse = useCallback((columnId) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, []);


  const onDragEndKanban = async (result) => {


    const { source, destination } = result;

  
    // Si no hay destino, o es el mismo lugar, no hacemos nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
  
    // Encontrar la tarea que se mueve
    const taskToMove = tasksboard.find((task) => task.IdActividadStr === result.draggableId);
  

    // Contar las tareas actuales en la columna de destino
    const destinationColumnTasks = tasksboard.filter((task) => task.IdWorkFlow === destination.droppableId);
    const destinationColumn = columns.find((col) => col.IdWorkFlow === destination.droppableId);

     // Validar si excede el límite WIP
    if (destinationColumn && destinationColumn.WIP > 0 && destinationColumnTasks.length >= destinationColumn.WIP) {
      message.warning(`No se puede mover la tarea. Se excede el límite WIP (${destinationColumn.WIP}) de la columna.`);
      return;
    }


    // Actualizar la columna origen y destino
    const updatedTasks = tasksboard.map((task) => {
      if (task.IdActividadStr === taskToMove.IdActividadStr) {
        return { ...task, IdWorkFlow: destination.droppableId };
      }
      return task;
    });
  
    setTasksboard(updatedTasks);

    try {
      const payload = {
        IdActividad: taskToMove.IdActividad,
        IdWorkFlow: destination.droppableId,

      };
  
      const response = await axios.post('/Board/ActualizaEstatusWF', payload);
  
      if (response.data.Exito) {
        console.log('Actualización exitosa:', response.data.Mensaje);
        // Aquí puedes manejar mensajes de éxito si es necesario
      } else {
        // Si la actualización falla, revertimos el cambio en la UI
        console.error('Error en la actualización:', response.data.Mensaje);
        message.error(response.data.Mensaje);
        
        // Revertir el cambio de columna en la UI (volver a la columna original)
        const revertedTasks = tasksboard.map((task) => {
          if (task.IdActividadStr === taskToMove.IdActividadStr) {
            return originalTask; // Restauramos la tarea original
          }
          return task;
        });
  
        setTasksboard(revertedTasks); // Actualizamos el estado con la tarea restaurada
      }
    } catch (error) {
      console.error('Error al actualizar la base de datos:', error);
      message.error('Error al actualizar la base de datos');
      
      // Revertir el cambio de columna en la UI si hubo un error
      const revertedTasks = tasksboard.map((task) => {
        if (task.IdActividadStr === taskToMove.IdActividadStr) {
          return originalTask; // Restauramos la tarea original
        }
        return task;
      });
  
      setTasksboard(revertedTasks); // Actualizamos el estado con la tarea restaurada
    }


  };
  const handleFilterChangeboard = (filterKey, value) => {
    setFiltersboard((prevFilters) => ({ ...prevFilters, [filterKey]: value }));
  };


  const fetchLists = async () => {
    try {
      const response = await axios.post('/Board/CargaFiltros', { IdProyecto: filtersboard.Proyecto } ); // Cambia la ruta según tu API
      if (response.data.Exito) {
        setResources(jQuery.parseJSON(response.data.LstUsuarios)); 
        setSprints(jQuery.parseJSON(response.data.LstSprint)); 
        setPriorities(jQuery.parseJSON(response.data.LstPrioridad)); 
  
  
      } else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      console.error('Error al información:', error);
      message.error('No se pudo cargar información.');
    }
  };

  const renderCard = (task) => (
    <TaskCard
      sprints={sprints}
      priorities={priorities}
      resources={resources}
      task={task}
      Proyecto={filtersboard.Proyecto}
      clickalerta={clickalerta}
      setTasks={setTasksboard}
      CapturaTrabajo={CapturaTrabajo}
    />
  );

  useEffect(() => {

    setWorkSpaceTab(IdWorkSpaceTab);
    fetchDataFromTab(IdWorkSpaceTab);
    // if (filtersboard.Proyecto != null && filtersboard.Tipo != null) {

    //   fetchColumns(filtersboard.Proyecto ,filtersboard.Tipo);
    //   fetchTasksBoard(filtersboard.Proyecto , filtersboard.Tipo, filtersboard);

    //   const count = Object.values(filtersboard).filter(value => 
    //     Array.isArray(value) ? value.length > 0 : value !== null
    //   ).length;
    //   setActiveFiltersCount(count);

    //   //fetchResources(selectedProject);
    // }
    // else {

    //   setShowFilters(true);
      
    // }

    // if (selectedProject != "") {
 
    //   fetchResources(selectedProject);
    // }
    // else {
    //   setResources([]); // Limpia los recursos si no hay proyecto seleccionado
    // }

  }, [IdWorkSpaceTab]);


  useEffect(() => {
    if (filtersboard.Proyecto != null && filtersboard.Tipo != null) {

      fetchColumns(filtersboard.Proyecto ,filtersboard.Tipo);
      fetchTasksBoard(filtersboard.Proyecto , filtersboard.Tipo, filtersboard);
      fetchLists();

      const count = Object.values(filtersboard).filter(value => 
        Array.isArray(value) ? value.length > 0 : value !== null
      ).length;
      setActiveFiltersCount(count);

      //fetchResources(selectedProject);
    }
    // else {

    //   setShowFilters(true);
      
    // }

    // if (selectedProject != "") {
 
    //   fetchResources(selectedProject);
    // }
    // else {
    //   setResources([]); // Limpia los recursos si no hay proyecto seleccionado
    // }

  }, [selectedProject, selectedType, filtersboard]);


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
          setFiltersboard({
            Proyecto: filterData.IdProyecto || null,
            Tipo: filterData.Tipo || null,
            Fechas: filterData.FechaSolIni ? [
              dayjs(filterData.FechaSolIni),
              dayjs(filterData.FechaSolFin)
            ] : [dayjs().subtract(1, "month"), dayjs()],
            LstSprints: filterData.LstSprints || [],
            LstAsignado: filterData.LstAsignado || [],
            LstResponsable: filterData.LstResponsable || [],
            LstTipoActividad: filterData.LstTipoActividad || [],
            LstClasificacion: filterData.LstClasificacion || [],
            LstPrioridad: filterData.LstPrioridad || [],
            LstEstatusW: filterData.LstEstatusW || [],
          });

          // Update selected project and type
          setSelectedProject(filterData.IdProyecto || '');
          setSelectedType(filterData.Tipo || '');
        } 
        // else {
        //   // If no filters exist, show the filter modal
        //   setShowFilters(true);
        // }
      } else {
        // message.error(response.data.Mensaje || 'Error al cargar filtros');
        // setShowFilters(true);
      }
    } catch (error) {
      // console.error('Error fetching filters:', error);
      // message.error('Error al cargar los filtros');
      // setShowFilters(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchColumns = async (projectId, taskType) => {
    try {
       setIsLoading(true);

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
     setIsLoading(false);
    }
  };

  const fetchTasksBoard = async (projectId, taskType, filtersboard) => {
    try {
       setIsLoading(true);

      const Filtros = {
        IdProyecto: filtersboard.Proyecto,
        Tipo: filtersboard.Tipo,
        LstSprints: filtersboard.LstSprints,
        FechaSolIni : filtersboard.Fechas?.[0],
        FechaSolFin : filtersboard.Fechas?.[1],
        LstAsignado : filtersboard.LstAsignado,
        LstResponsable: filtersboard.LstResponsable,
        LstTipoActividad : filtersboard.LstTipoActividad,
        LstClasificacion: filtersboard.LstClasificacion,
        LstPrioridad: filtersboard.LstPrioridad,
        LstEstatusW: filtersboard.LstEstatusW

      };

      const resTask = await axios.post("/Workspace/ConsultaActividadesTablero", { IdWorkSpaceTab: WorkSpaceTab,  Filtros:Filtros}); 

      var taskData = jQuery.parseJSON(resTask.data.Actividades);
  
      if (resTask.data.Exito) {
 
        setTasksboard(taskData);
        }
         else {
       message.error(resTask.data.Mensaje);
         }  

    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
     setIsLoading(false);
    }
  };

  const SaveTaskKanban = (IdWorkFlow, Title) => {
    if(Title== undefined){
          message.error('El título no puede estar vacío.');
          return;
     }

    if (Title == null || Title.trim() === "" ) {
      message.error('El título no puede estar vacío.');
      return;
    }
    else {

      setIsLoading(true);
      const Act = {
        IdActividad: 0,
        IdWorkFlow: IdWorkFlow, 
        IdProyecto: filtersboard.Proyecto,
        TipoId: filtersboard.Tipo,
        BR: Title,


      }
      axios.post('/Board/GuardarActividadList', { A:Act})
      .then((response) => {
        if (response.data.Exito) {
          message.success('Se agregó el elemento.');
          setNewTaskTextKanban({ ...newTaskTextKanban, [IdWorkFlow]: "" });


          const newTask = typeof response.data.Actividad === "string" 
          ? JSON.parse(response.data.Actividad) 
          : response.data.Actividad;
          setTasksboard((prevTasks) => [...prevTasks,  newTask ]);
          setActiveColumn(null); 

          setIsLoading(false);
 
        }
        else {
          message.error(response.data.Mensaje);
        }
      }).catch((error) => {
        message.error('No se pudo guardar la tarea.');
      }); 
    }

  };
  const handleFilterChange = (columnId, value) => {
    setFilterText((prev) => ({
      ...prev,
      [columnId]: value.toLowerCase(), // Save filter in lowercase for case-insensitive comparison
    }));
  };

  const toggleDrawer = () => {
    setIsDrawerVisible((prev) => !prev);
  };

  const RefreshTask =async  () => {
    fetchTasksBoard (filtersboard.Proyecto, filtersboard.Tipo,filtersboard );
  };
  const RefreshAll =async  () => {
    fetchColumns(filtersboard.Proyecto, filtersboard.Tipo);
    fetchTasksBoard (filtersboard.Proyecto, filtersboard.Tipo, filtersboard);
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

  // const WelcomeScreenTab = () => (
  //     <div style={{ 
  //       display: 'flex', 
  //       flexDirection: 'column',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       minHeight: '400px',
  //       padding: '20px',
  //       textAlign: 'center'
  //     }}>

        
        
  //        <Text type="secondary" style={{ 
  //         fontSize: '16px',
  //         marginBottom: '24px',
  //         maxWidth: '600px'
  //       }}>
  //           Selecciona los filtros de información
  //       </Text> 
  
  //       <Button 
  //         type="primary"
  //         size="large"
  //         onClick={() => setShowFilters(true)}
  //       >
  //         Filtrar
  //       </Button>
  //     </div>
  //   );


  return (
    <>


         <Filtros
         isOpen={showFilters}
         onClose={() => setShowFilters(false)}
         filters={filtersboard}
         setFilters={setFiltersboard}
         setSelectedProject={setSelectedProject}
         setSelectedType={setSelectedType}  

         />
         
     <ColumnConfig
         columns={columns}
           RefreshAll={RefreshAll}
          isDrawerVisible={isDrawerVisible}
          toggleDrawer={toggleDrawer}
          selectedProject={filtersboard.Proyecto}
          selectedType={filtersboard.Tipo}
          tasks={tasksboard}

      />

   {filtersboard.Proyecto ? (
             (isLoading ? (
              renderLoadingSkeleton(6)
            ) : (
              <>
              <Space direction="horizontal" style={{ width: '100%', justifyContent: 'flex-end' }}>

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
                  onClick={RefreshTask}
                  style={{ fontSize: '16px', marginRight: '10px' }}
                />
    
                <Button
                  title='Configuración de flujo'
                  type="text"
                  icon={<SettingOutlined />}
                  onClick={toggleDrawer}
                  style={{ fontSize: '16px' }}
                />
          </ButtonGroup>
        </Space>

              <div
        ref={scrollContainerRef}
        className="kanban-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          overflowX: 'auto',
          height: '100%',
          whiteSpace: 'nowrap',
          cursor: isDragging ? 'grabbing' : 'grab',
          padding: '8px',
       
        }}
      >
    
    
    
        <div
          style={{
            display: 'flex',
            gap: '12px', // Espaciado entre columnas
            padding: '8px',
            width: 'max-content', // Asegura que el contenedor se ajuste al contenido total
          }}
        >
          <DragDropContext onDragEnd={onDragEndKanban}>
            {columns.map((column) => {
              const filterText = filterstext[column.IdWorkFlow] || ''; 
              const columnTasks = tasksboard
                                  .filter((task) => task.IdWorkFlow === column.IdWorkFlow)
                                  .filter((task) => {
                                    const columnFilter = filterstext[column.IdWorkFlow] || '';
                                    return task.Descripcion?.toLowerCase().includes(columnFilter.toLowerCase());
                                  })
                                  .sort((a, b) => a.Prioridad - b.Prioridad);
              const isCollapsed = collapsedColumns[column.IdWorkFlow];
    
              // console.log('Column tasks:', columnTasks);
    
              return (
                <div
                  key={column.IdWorkFlow}
                  className="kanban-column"
                  style={{
                    flexShrink: 0,
                    minWidth: isCollapsed ? '50px' : '250px',
                    maxWidth: isCollapsed ? '50px' : '250px',
                    transition: 'all 0.5s ease-in-out', 
                  }}
                >
                  <div
                    style={{
                      backgroundColor: column.Color,
                      padding: '8px',
                      color: column.ColorTexto,
                      fontSize: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      position: 'sticky', 
                      top: 0, 
                      zIndex: 1,
                    }}
                   
                  >
    
    
    
                    {isCollapsed ? (
                      <div
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                          minHeight: '200px',
                        }}
                      >
                        {column.Nombre} ({column.WIP > 0 ? `${columnTasks.length}/${column.WIP}` : columnTasks.length})
                      <Button
                                type="text"
                               icon={<LeftOutlined  />}
                               onClick={() => toggleCollapse(column.IdWorkFlow)}
                               style={{ fontSize: '14px', 
                                color: column.ColorTexto,
                                justifyContent: 'end'
                                }}
                        
                              />
                      </div>
                                              
                    ) : (
                      <>
                        <span>
                          {column.Nombre} ({column.WIP > 0 ? `${columnTasks.length}/${column.WIP}` : columnTasks.length})
                        </span>
                        <Button
                                type="text"
                               icon={<PlusOutlined   />}
                               onClick={() => setActiveColumn(column.IdWorkFlow)}
                               style={{ fontSize: '14px', 
                                padding: '2px',
                                color: column.ColorTexto,
                                 justifyContent: 'end'
                                }}
                        
                              />
                               <Button
                                type="text"
                               icon={<FilterOutlined   />}
                               onClick={() => setActiveFilter(column.IdWorkFlow)}
                               style={{ fontSize: '14px', 
                                padding: '2px',
                                color: column.ColorTexto,
                                 justifyContent: 'end'
                                }}
                        
                              />
                             <Button
                                type="text"
                               icon={<LeftOutlined />}
                               onClick={() => toggleCollapse(column.IdWorkFlow)}
                               style={{ fontSize: '12px',
                                      color: column.ColorTexto,
                                       marginRight: '4px' }}
                              />
                      </>
                    )}
    
                  </div>
                  {!isCollapsed && (
                    <>
                   
    
                   <div style={{ padding: '4px', borderTop: '1px solid #eaeaea' }}>
                    {activeColumn === column.IdWorkFlow ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Input
                          placeholder="Agregar elemento"
                          style={{ flex: 1 , fontSize: '12px'}}
                          mazeLength={100}
                          loading={isLoading} 
    
                          onPressEnter={(e) => SaveTaskKanban(column.IdWorkFlow, e.target.value)}
                        
                        />
                        
                      </div>
                    ) 
                    
                    : (
                       ""
                    )}
                  </div>
                     {/* Filter Input */}
                     <div style={{ padding: '4px' }}>
    
                     {activeFilter === column.IdWorkFlow ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Input
                           style={{ fontSize: '12px' }}
                          placeholder="Filtrar..."
                          onChange={(e) => handleFilterChange(column.IdWorkFlow, e.target.value)}
                          allowClear
                        />
                        
                      </div>
                    ) 
                    
                    : (
                       ""
                    )}
    
    
                      </div>
                    <Droppable droppableId={column.IdWorkFlow}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            flex: 1,
                            background: '#f9fbfd',
                            overflowY: 'auto',
                            padding: 8,
                            height: '850px',
                            minHeight: 400,
                          }}
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable key={task.IdActividadStr} draggableId={task.IdActividadStr} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    marginBottom: 8,
                                  }}
                                >
                                  {renderCard(task)}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
    
                    </>
                  )}
                </div>
              );
            })}
          </DragDropContext>
        </div>
        <FloatButton.BackTop />
             </div>
    
            </>
            )
    
          )
      ) : (
        <WelcomeScreenTab 
        setShowFilters={setShowFilters}
        />
)}
     

    </>
  );


});

export default KanbanBoard;

