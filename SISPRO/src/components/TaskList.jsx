import React, { useState, useMemo, useEffect } from "react";
import { Collapse, Typography, Checkbox,  Select, DatePicker, Input,Dropdown,Menu,Button,InputNumber, FloatButton ,message, Modal, Space,Row,Col, Badge, Tooltip } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { EllipsisOutlined, UserOutlined,CloseCircleOutlined , RedoOutlined,GroupOutlined,CalendarOutlined ,  
          SyncOutlined , FilterOutlined  } from '@ant-design/icons';
import dayjs from "dayjs";
import axios from "axios";
import WelcomeScreenTab from './WelcomeTabScreen';
import Filtros from './Filtros';
import ButtonGroup from 'antd/es/button/button-group';

const { Panel } = Collapse;
const { Text } = Typography;
const { Link } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const TaskList =  React.memo( ({ 

                            IdWorkSpaceTab
                    }) => {
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]); // Estado para almacenar el rango de fechas seleccionado
  const [editingField, setEditingField] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [activeSection, setActiveSection] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [groupingCriteria, setGroupingCriteria] = useState('');
  const [WorkSpaceTab, setWorkSpaceTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filters, setFilters] = useState({ 
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
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [priorities, setPriorities] = useState([]);
  const [resources, setResources] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [estatus, setEstatus] = useState([]);
  const [columns, setColumns] = useState([]);

  const [activeKeys, setActiveKeys] = useState([]);
  useEffect(() => {

    setWorkSpaceTab(IdWorkSpaceTab);
    fetchDataFromTab(IdWorkSpaceTab);

  }, [IdWorkSpaceTab]);


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


           setSelectedProject(filterData.IdProyecto || '');
           setSelectedType(filterData.Tipo || '');

            setGroupingCriteria(wst.Agrupador ? ( wst.Agrupador): ( "IdWorkFlow"));
        } 

      } else {

      }
    } catch (error) {
      // console.error('Error fetching filters:', error);
      // message.error('Error al cargar los filtros');
      // setShowFilters(true);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (filters.Proyecto != null && filters.Tipo != null) {

      fetchColumns(filters.Proyecto ,filters.Tipo);
      fetchTasks(filters);
      fetchLists();

      const count = Object.values(filters).filter(value => 
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

  }, [filters]);

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
        setEstatus(ColumnsData);
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

  const fetchTasks = async (filters) => {
    try {
       setIsLoading(true);

      const Filtros = {
        IdProyecto: filters.Proyecto,
        Tipo: filters.Tipo,
        LstSprints: filters.LstSprints,
        FechaSolIni : filters.Fechas?.[0],
        FechaSolFin : filters.Fechas?.[1],
        LstAsignado : filters.LstAsignado,
        LstResponsable: filters.LstResponsable,
        LstTipoActividad : filters.LstTipoActividad,
        LstClasificacion: filters.LstClasificacion,
        LstPrioridad: filters.LstPrioridad,
        LstEstatusW: filters.LstEstatusW

      };

      const resTask = await axios.post("/Workspace/ConsultaActividadesTablero", { IdWorkSpaceTab: WorkSpaceTab,  Filtros:Filtros}); 

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
     setIsLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      const response = await axios.post('/Board/CargaFiltros', { IdProyecto: filters.Proyecto } ); // Cambia la ruta según tu API
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

  const RefreshTask =async  () => {
    fetchTasks(filters);
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters); 
  };
  const getGroupValue = (task) => {
    if (!task) return { id: 'default', name: 'Sin grupo', color: '#d9d9d9' };

    switch (groupingCriteria) {
      case 'IdWorkFlow':
        return {
          id: task.IdWorkFlow,
          name: columns.find(c => c.IdWorkFlow === task.IdWorkFlow)?.Nombre || 'Sin flujo',
          color: columns.find(c => c.IdWorkFlow === task.IdWorkFlow)?.Color || '#d9d9d9',
          wip: columns.find(c => c.IdWorkFlow === task.IdWorkFlow)?.WIP
        };
      case 'AsignadoStr':
        return {
          id: task.IdUsuarioAsignado || 'unassigned',
          name: task.AsignadoStr || 'Sin asignar',
          color: '#1890ff'
        };
      case 'Sprint':
        return {
          id: task.IdIteracion || 'nosprint',
          name: task.Sprint || 'Sin sprint',
          color: '#52c41a'
        };
      case 'DueDate':

        if (!task.FechaSolicitado) {
          return { id: 'unplanned', name: 'Sin planear', color: '#faad14' };
        }
        const dueDate = dayjs(task.FechaSolicitado);
        const today = dayjs();
        
        const isToday = dueDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
        
        if (dueDate.isBefore(today, 'day')) {
          return { id: 'late', name: 'Atrasados', color: '#f5222d' };
        } else if (isToday) {
          return { id: 'today', name: 'Para hoy', color: '#1890ff' };
        } else {
          return { id: 'future', name: 'Próximas', color: '#52c41a' };
        }
      case 'HistoriaUsuario':
        return {
          id: task.HU || 'nohistory',
          name: task.HU || 'Sin HU',
          color: '#722ed1'
        };
      case 'Fase':
        return {
          id: task.TipoActividadStr || 'nophase',
          name: task.TipoActividadStr || 'Sin fase',
          color: '#13c2c2'
        };
      case 'Clasificacion':
        return {
          id: task.ClasificacionStr || 'noclassification',
          name: task.ClasificacionStr || 'Sin clasificación',
          color: '#eb2f96'
        };
      default:
        return { id: 'default', name: 'Sin grupo', color: '#d9d9d9' };
    }
  };
  const groupedTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return {};

    return tasks.reduce((groups, task) => {
      if (!task) return groups;
      
      const groupValue = getGroupValue(task);
      if (!groups[groupValue.id]) {
        groups[groupValue.id] = {
          ...groupValue,
          tasks: [],
          totalHours: 0
        };
      }
      
      groups[groupValue.id].tasks.push(task);
      groups[groupValue.id].totalHours += Number(task.HorasAsignadas) || 0;

      // console.log(groupingCriteria);
      // UpdateGroupTab(groupingCriteria);

      return groups;
    }, {});
  }, [tasks, groupingCriteria, columns]);


  const handleUpdateGroupTab = async (Group) => {
    
    try {
      var wst = {
         IdWorkSpaceTab : IdWorkSpaceTab,
         Agrupador : Group
      }
      const res =  await axios.post("/Workspace/ActualizaAgrupadorTab", {wst:wst}); 
      if (res.data.Exito) {
       setGroupingCriteria(Group);
      }

    } catch (error) {
      console.error('Error updating workspace name:', error);
    }
  };

  const handleCollapseChange = (keys) => {
    setActiveKeys(keys);
  };

  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((Id) => Id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleSelectAllInColumn = (groupId, checked) => {
    // Obtenemos las tareas directamente del grupo actual en groupedTasks
    const tasksInGroup = groupedTasks[groupId]?.tasks || [];
    const taskIdsInGroup = tasksInGroup.map(task => task.IdActividad);
  
    setSelectedTasks(prevSelected => {
      if (checked) {
        // Usar Set para evitar duplicados
        return [...new Set([...prevSelected, ...taskIdsInGroup])];
      } else {
        // Remover todas las tareas del grupo
        return prevSelected.filter(taskId => !taskIdsInGroup.includes(taskId));
      }
    });
  };


  const reassignMenu = (
    <Menu>
      {resources.map((resource) => (
        <Menu.Item
          key={resource.IdCatalogo}
          onClick={() => handleReassignTasks(resource.IdCatalogo, 2)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={`/Archivos/Fotos/${resource.DescCorta}.jpg`}
              alt={resource.DescCorta}
              style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/Archivos/Fotos/default.jpg";
              }}
            />
            {resource.DescLarga}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
  const reassignWorkflow = (
    <Menu>
      {columns.map((column) => (
        <Menu.Item
          key={column.IdWorkFlow}
          onClick={() => handleReassignTasks(column.IdWorkFlow, 1)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge color={column.Color} text={column.Nombre} />
           
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
  const reassignSprint= (
    <Menu>
      {sprints.map((sprint) => (
        <Menu.Item
          key={sprint.IdCatalogo}
          onClick={() => handleReassignTasks(sprint.IdCatalogo,3)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
               {sprint.DescLarga}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleEdit = (taskId, field) => {
    setEditingField({ taskId, field });
  };
  const handleBlur = (taskId, field, value) => {
    updateTaskField(taskId, field, value);
    setEditingField({});
  };

  const handleFieldChange = (taskId, field, value) => {
     updateTaskField(taskId, field, value);
    setEditingField({});
  };

  const handleDatesChange = (taskId, field, value) => {
    updateDatesField(taskId, field, value);
   setEditingField({});
 };

 const handleReassignTasks = async (resourceId, tipo) => {
  try {
    const response = await axios.post('/Board/ActualizacionMasiva', {

      Actividades: selectedTasks,
      Tipo: tipo,
      IdNuevo: resourceId

    });
    if (response.data.Exito) {

      if(tipo===2){
        var res = resources.find(x => x.IdCatalogo === resourceId);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task.IdActividad)
              ? {
                  ...task,
                  IdUsuarioAsignado: resourceId,      // Actualiza el ID del usuario asignado
                  AsignadoStr: res.DescLarga,      // Asignar el nombre del recurso
                  ClaveUsuario: res.DescCorta, // Asignar la clave del recurso
                }
              : task
          )
        );
      }
      else if(tipo===1){
        var est = estatus.find(x => x.IdWorkFlow === resourceId);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task.IdActividad)
              ? {
                  ...task,
                  IdWorkFlow: resourceId,   
                  ColorW: est.Color,
                  WorkFlow: est.Nombre    // Actualiza el ID del usuario asignado
                }
              : task
          )
        );
       }   
       else if(tipo===3){

        var sprint = sprints.find(x => x.IdCatalogo === resourceId);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            selectedTasks.includes(task.IdActividad)
              ? {
                  ...task,
                  IdIteracion: resourceId,      // Actualiza el ID del usuario asignado
                  Sprint: sprint.DescLarga,      // Asignar el nombre del recurso
                }
              : task
          )
        );
       }   
       else if(tipo===4){

         RefreshTask();
         Message.success('Items cancelados con éxito.');
       }
    } 
    
    else {
      message.error(response.data.Mensaje);
    }
  } catch (error) {
     console.error('Error al asignar recurso:', error);
  }
  finally {
    setSelectedTasks([]);
  }


};

  const updateTaskField = async (taskId, field, value) => {
    try {
      const response = await axios.post('/Board/ActualizaDatoActividad', {

        IdActividad: taskId,
        campo: field,
        dato1: value

      });
      if (response.data.Exito) {

        // fetchTasks(selectedProject, selectedType, filters);
        var res = resources.find(x => x.IdCatalogo === value);
         var ite = sprints.find(x => x.IdCatalogo === value);
         var pri = priorities.find(x => x.IdCatalogo === value);
         var est = estatus.find(x => x.IdWorkFlow === value);
        setTasks((prevTasks) => {
          // Encuentra el índice de la tarea a actualizar
          const taskIndex = prevTasks.findIndex((task) => task.IdActividad === taskId);
        
          // Si no encuentra la tarea, regresa las tareas originales
          if (taskIndex === -1) return prevTasks;
        
          // Crea una nueva copia de las tareas
          const updatedTasks = [...prevTasks];
        
          // Actualiza solo la tarea específica
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            ...(field === "BR" && { BR: value }),
            ...(field === "IdUsuarioAsignado" && { IdUsuarioAsignado: value, AsignadoStr: res.DescLarga , ClaveUsuario: res.DescCorta }),
            ...(field === "IdIteracion" && { IdIteracion: value, Sprint: ite.DescLarga }),
            ...(field === "Estatus" && { IdWorkFlow: value, ColorW: est.Color, WorkFlow: est.Nombre }),
            ...(field === "HorasAsignadas" && { HorasAsignadas: value }),
            ...(field === "Prioridad" && { IdPrioridad: value, PrioridadStr: pri.DescLarga }),
          };
        
          return updatedTasks;
        });


      } 
      
      else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      // console.error('Error al asignar recurso:', error);
      // message.error('No se pudo asignar el recurso.');
    }
  };
  const updateDatesField = async (taskId, field, value) => {
    try {
        const A= {
          IdActividad: taskId,  
          FechaInicio: value[0],
          FechaSolicitado: value[1]
        }
      const response = await axios.post('/Board/ActualizaFecha', {A:A });
      if (response.data.Exito) {


        const FechaInicio = value[0] ? dayjs(value[0] , "DD/MM/YYYY").toISOString() : null;
        const FechaSolicitado = value[0] ? dayjs(value[1], "DD/MM/YYYY").toISOString() : null;

        setTasks((prevTasks) => {
          // Encuentra el índice de la tarea a actualizar
          const taskIndex = prevTasks.findIndex((task) => task.IdActividad === taskId);
        
          // Si no encuentra la tarea, regresa las tareas originales
          if (taskIndex === -1) return prevTasks;
        
          // Crea una nueva copia de las tareas
          const updatedTasks = [...prevTasks];
        
          // Actualiza solo la tarea específica
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            ...(field === "Fechas" && { FechaInicio: FechaInicio, FechaSolicitado: FechaSolicitado}),
          };
        
          return updatedTasks;
        });
       } 
      
      else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      // console.error('Error al asignar recurso:', error);
      // message.error('No se pudo asignar el recurso.');
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: "¿Estás seguro de que deseas cancelar los "+ selectedTasks.length   + " elementos seleccionados?",
      content: "Es posible que los elementos no se puedan reactivar.",
      okText: "Sí, cancelar",
      cancelText: "No",
      onOk: () => {
        handleReassignTasks(1,4);
        // Lógica para manejar la cancelación
      },
      onCancel: () => {
        message.warning("No se realizo la cancelación.");
      },
    });
  };

  const handleDateRangeChange  = async (dateStrings) => {
    if (dateStrings[0] && dateStrings[1]) {
      try {
        const response = await axios.post('/Board/ActualizacionMasivaFechas', {
    
          Actividades: selectedTasks,
          FechaInicio: dateStrings[0],
          FechaSolicitado: dateStrings[1]
    
        });
        if (response.data.Exito) {

          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              selectedTasks.includes(task.IdActividad)
                ? {
                    ...task,
                    FechaInicio: dateStrings[0],    
                    FechaSolicitado: dateStrings[1]  
                  }
                : task
            )
          );

        } 
        
        else {
          message.error(response.data.Mensaje);
        }
      } catch (error) {
         console.error('Error al asignar recurso:', error);
        // message.error('No se pudo asignar el recurso.');
      }
      finally {
        setSelectedTasks([]);
      }
    
    }
  };

  const CleanSelected = () => {
    setSelectedTasks([]);
  }

  const CancelAddSection = () => {
    setActiveSection(null); 
  }

  const SaveTask = (IdWorkFlow, Title, e) => {
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
        IdProyecto: selectedProject,
        TipoId: selectedType,
        BR: Title,


      }
      axios.post('/Board/GuardarActividadList', { A:Act})
      .then((response) => {
        if (response.data.Exito) {
          e.target.value = '';

          const newTask = typeof response.data.Actividad === "string" 
          ? JSON.parse(response.data.Actividad) 
          : response.data.Actividad;
          setTasks((prevTasks) => [...prevTasks,  newTask ]);

          setActiveSection(null); 
          setIsLoading(false);
        }
        else {
          message.error(response.data.Mensaje);
        }
      }).catch((error) => {
        console.error('Error al guardar la tarea:', error);
        message.error('No se pudo guardar la tarea.');
      }); 
    }

  };

  const onDragEndList = async (result) => {


    const { source, destination } = result;

  
    // Si no hay destino, o es el mismo lugar, no hacemos nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
  
    // Encontrar la tarea que se mueve
    const taskToMove = tasks.find((task) => task.IdActividadStr === result.draggableId);
  

    // Contar las tareas actuales en la columna de destino
    const destinationColumnTasks = tasks.filter((task) => task.IdWorkFlow === destination.droppableId);
    const destinationColumn = columns.find((col) => col.IdWorkFlow === destination.droppableId);

     // Validar si excede el límite WIP
    if (destinationColumn && destinationColumn.WIP > 0 && destinationColumnTasks.length >= destinationColumn.WIP) {
      message.warning(`No se puede mover la tarea. Se excede el límite WIP (${destinationColumn.WIP}) de la columna.`);
      return;
    }


    // Actualizar la columna origen y destino
    const updatedTasks = tasks.map((task) => {
      if (task.IdActividadStr === taskToMove.IdActividadStr) {
        return { ...task, IdWorkFlow: destination.droppableId };
      }
      return task;
    });
  
    setTasks(updatedTasks);

    try {
      const payload = {
        IdActividad: taskToMove.IdActividad,
        IdWorkFlow: destination.droppableId,

      };
  
      const response = await axios.post('/Board/ActualizaEstatusWF', payload);
  
      if (response.data.Exito) {
        console.log('Actualización exitosa:', response.data.Mensaje);
        // Aquí puedes manejar mensajes de éxito si es necesario
      }   {
        // Si la actualización falla, revertimos el cambio en la UI
        console.error('Error en la actualización:', response.data.Mensaje);
        message.error(response.data.Mensaje);
        
        // Revertir el cambio de columna en la UI (volver a la columna original)
        const revertedTasks = tasks.map((task) => {
          if (task.IdActividadStr === taskToMove.IdActividadStr) {
            return originalTask; // Restauramos la tarea original
          }
          return task;
        });
  
        setTasks(revertedTasks); // Actualizamos el estado con la tarea restaurada
      }
    } catch (error) {
      console.error('Error al actualizar la base de datos:', error);
      message.error('Error al actualizar la base de datos');
      
      // Revertir el cambio de columna en la UI si hubo un error
      const revertedTasks = tasks.map((task) => {
        if (task.IdActividadStr === taskToMove.IdActividadStr) {
          return originalTask; // Restauramos la tarea original
        }
        return task;
      });
  
      setTasks(revertedTasks); // Actualizamos el estado con la tarea restaurada
    }


  };




  return (
    <div style={{ padding: '12px' }}>


      <Filtros
         isOpen={showFilters}
         onClose={() => setShowFilters(false)}
         filters={filters}
         setFilters={setFilters}
         setSelectedProject={setSelectedProject}
         setSelectedType={setSelectedType}  

         />

     {filters.Proyecto? (
        <>
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <Space direction="horizontal" size={8}  style={{ width: '50%'}}>
          <Text strong style={{ marginRight: '8px', width:200 }}>Agrupar por:</Text>
        <Select
          value={groupingCriteria}
          onChange={(value) => handleUpdateGroupTab(value)}
          style={{ width: 200 }}
        >
          <Select.Option value="IdWorkFlow">Estado</Select.Option>
          <Select.Option value="AsignadoStr">Asignado</Select.Option>
          <Select.Option value="Sprint">Sprint</Select.Option>
          <Select.Option value="HistoriaUsuario">Historia de usuario</Select.Option>
          <Select.Option value="Fase">Fase</Select.Option>
          <Select.Option value="Clasificacion">Clasificación</Select.Option>
        </Select>

        </Space>
     
        <Space direction="horizontal"  size={8} style={{ width: '50%', justifyContent: 'flex-end' }}>

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

  
                  </ButtonGroup>
                  </Space>
        </div>

     <DragDropContext onDragEnd={onDragEndList}>
     <Collapse activeKey={activeKeys} onChange={handleCollapseChange} style={{ border: "none" }}>
       {Object.entries(groupedTasks).map(([groupId, group]) => {
         const tasksInGroup = group.tasks.sort((a, b) => a.Prioridad - b.Prioridad);
         const taskCount = tasksInGroup.length;

         const panelHeader = (
           <div style={{ display: "flex", alignItems: "center", background: "#FFFFFF" }}>
             <Badge color={group.color} text={group.name} />
             <Text type="secondary" style={{ marginLeft: "8px" }}>
               ({taskCount}
               {groupingCriteria === 'IdWorkFlow' && group.wip > 0 ? ` / ${group.wip} WIP` : ''}  - {group.totalHours} horas)
             </Text>
           </div>
         );

         return (
           <Panel header={panelHeader} key={groupId} style={{ background: "#FFFFFF", border: "none" }}>
             {taskCount > 0 && (
             <div style={{ display: "flex", padding: "10px" }}>

                 <span style={{ flex: 1 }}>
               <Checkbox
                 checked={tasksInGroup.every((task) => selectedTasks.includes(task.IdActividad))}
                 indeterminate={
                   tasksInGroup.some((task) => selectedTasks.includes(task.IdActividad)) &&
                   !tasksInGroup.every((task) => selectedTasks.includes(task.IdActividad))
                 }
                  onChange={(e) => handleSelectAllInColumn(groupId, e.target.checked)}
               />
               <Text style={{paddingLeft:"5px" }}>Id</Text>
             </span>

               <span style={{ flex: 2 }}>Título</span>
               <span style={{ flex: 1 }}>Estado</span>
               <span style={{ flex: 1 }}>Asignado</span>
               <span style={{ flex: 1 }}>Sprint</span>
               <span style={{ flex: 1 }}>Horas</span>
               <span style={{ flex: 2 }}>Fechas</span>
               <span style={{ flex: 1 }}>Prioridad</span>
               <span style={{ flex: 1 }}></span>
              
             </div>
           )}

           <Droppable droppableId={groupId}>
             {(provided) => (
               <div
                 {...provided.droppableProps}
                 ref={provided.innerRef}
                 style={{
                   minHeight: "50px",
                   backgroundColor: taskCount === 0 ? "#ffffff" : "",
                   border: taskCount === 0 ? "1px dashed #d9d9d9" : "none",
                 }}
               >
                 {groupingCriteria === 'IdWorkFlow' && (
                   <div style={{ padding: '4px', borderTop: '1px solid #eaeaea' }}>
                     {activeSection === groupId ? (
                       <Input 
                         addonBefore={<Badge color={group.color}/>}
                         placeholder="Agregar elemento" 
                         maxLength={100}  
                         width={350}
                         loading={isLoading} 
                         onPressEnter={(e) => SaveTask(groupId, e.target.value, e)}
                       />
                     ) : (
                       <Button
                         type="dashed"
                         onClick={() => setActiveSection(groupId)}
                         style={{ width: '100%' , cursor: 'pointer' }}
                       >
                         + Agregar
                       </Button>
                     )}
                   </div>
                 )}



                 {tasksInGroup.map((task, index) => (
                   <Draggable key={task.IdActividadStr} draggableId={task.IdActividadStr} index={index}>
                     {(provided) => (
                       <div
                         ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}
                         style={{
                           ...provided.draggableProps.style,
                           display: "flex",
                           padding: "8px 16px",
                           margin: "4px 0",
                           alignItems: "center",
                           backgroundColor: 
                                     task.Prioridad === -99 
                                       ? "#d4f7d4" 
                                       : selectedTasks.includes(task.IdActividad) 
                                       ? "#e6f7ff" 
                                       : "transparent", 
                           borderRadius: "4px",
                         }}
                       >

                         <div style={{ flex: 1 }}>
                         <Checkbox
                               checked={selectedTasks.includes(task.IdActividad)}
                               onChange={() => handleCheckboxChange(task.IdActividad)}
                             />
                           <strong>
                             <Link
                               style={{ fontSize: "12px", marginBottom: "4px", paddingLeft:"5px" ,color: "rgba(0,0,0,0.8)" }}
                               onClick={() => clickalerta(task.IdActividad)}
                             >
                               { task.IdActividadStr}
                             </Link>
                           </strong>
                         </div>


                         
                         <div style={{ flex: 2 }}>
                           {editingField.taskId === task.IdActividad && editingField.field === "BR" ? (
                             <TextArea
                               autoFocus
                               defaultValue={task.BR}
                               onBlur={(e) => handleFieldChange(task.IdActividad, "BR", e.target.value)}
                               onPressEnter={(e) => handleFieldChange(task.IdActividad, "BR", e.target.value)}
                               style={{ width: "90%" }}
                             />
                           ) : (
                             <Text onClick={() => handleEdit(task.IdActividad, "BR")}>{task.BR || "Sin descripción"}</Text>
                           )}
                         </div>


                         <div style={{ flex: 1 }}>
                           {editingField.taskId === task.IdActividad && editingField.field === "Estatus" ? (
                             <Select
                               autoFocus
                               placeholder="Estatus"
                               value={task.IdWorkFlow || undefined}
                               // onBlur={handleBlur}
                               onChange={(value) => handleFieldChange(task.IdActividad, "Estatus", value)}
                               style={{ width: "75%" }}
                             >
                           {estatus.map((estatus) => (
                             <Select.Option key={estatus.IdWorkFlow} value={estatus.IdWorkFlow}>
                             <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>

                             <Badge color={estatus.Color} text={estatus.Nombre} />
                             {/* {column.Nombre} */}
                             </div>
                             </Select.Option>
                             ))}
                             </Select>
                           ) : (

                             <Badge  onClick={() => handleEdit(task.IdActividad, "Estatus")} 
                             color={task.ColorW} text={task.WorkFlow} />

 
                           )}
                         </div>




                         <div style={{ flex: 1 }}>
                           {editingField.taskId === task.IdActividad && editingField.field === "IdUsuarioAsignado" ? (
                             <Select
                               autoFocus
                               placeholder="Asignar a"
                               value={task.IdUsuarioAsignado || undefined}
                               onBlur={handleBlur}
                               onChange={(value) => handleFieldChange(task.IdActividad, "IdUsuarioAsignado", value)}
                               style={{ width: "75%" }}
                             >
                           {resources.map((resource) => (
                             <Select.Option key={resource.IdCatalogo} value={resource.IdCatalogo}>
                             <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                                     <img
                                     src={"/Archivos/Fotos/" + resource.DescCorta + ".jpg" || "./Archivos/Fotos/default.jpg"}
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
                           ) : (
                             <Text onClick={() => handleEdit(task.IdActividad, "IdUsuarioAsignado")}>
                                  <img
                                     src={"/Archivos/Fotos/" + task.ClaveUsuario + ".jpg" || "./Archivos/Fotos/default.jpg"}
                                     alt={task.ClaveUsuario}
                                     style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 10 }}
                                     onError={(e) => {
                                         e.target.onerror = null;
                                         e.target.src = "/Archivos/Fotos/default.jpg";
                                     }}/>
                               {task.AsignadoStr || "Sin asignar"}
                             </Text>
                           )}
                         </div>
                         <div style={{ flex: 1}}>
                           {editingField.taskId === task.IdActividad && editingField.field === "IdIteracion" ? (
                             <Select
                               autoFocus
                               placeholder="Sprint"
                               value={task.IdIteracion || undefined}
                               onBlur={handleBlur}
                               onChange={(value) => handleFieldChange(task.IdActividad, "IdIteracion", value)}
                               style={{ width: "75%" }}
                             >
                                   <Select.Option key={-1} value={-1}>
                                   {"Sin sprint"}
                                 </Select.Option>
                                 {sprints.map((sprint) => (
                                   <Select.Option key={sprint.IdCatalogo} value={sprint.IdCatalogo}>
                                     {sprint.DescLarga}
                                   </Select.Option>
                                 ))}
                             </Select>
                           ) : (
                             <Text onClick={() => handleEdit(task.IdActividad, "IdIteracion")}>
                               {task.Sprint || "Sin sprint"}
                             </Text>
                           )}
                         </div>
                         <div style={{ flex: 1 }}>
                           {editingField.taskId === task.IdActividad && editingField.field === "HorasAsignadas" ? (
                             <InputNumber
                               autoFocus
                               defaultValue={task.HorasAsignadas}
                               onBlur={(e) => handleFieldChange(task.IdActividad, "HorasAsignadas", e.target.value)}
                               onPressEnter={(e) => handleFieldChange(task.IdActividad, "HorasAsignadas", e.target.value)}
                               style={{ width: "90%" }}
                             />
                           ) : (
                             <Text onClick={() => handleEdit(task.IdActividad, "HorasAsignadas")}>{task.HorasAsignadas || "Sin horas"}</Text>
                           )}
                         </div>

                         <div style={{ flex: 2 }}>
                           {editingField.taskId === task.IdActividad && editingField.field === "Fechas" ? (
                             <RangePicker
                               autoFocus
                               value={
                                 task.FechaInicio && task.FechaSolicitado
                                   ? [dayjs(task.FechaInicio), dayjs(task.FechaSolicitado)]
                                   : []
                               }
                               style={{ width: "75%" }}
                               onChange={(dates, dateStrings) =>
                                 handleDatesChange(task.IdActividad, "Fechas", dateStrings)
                               }
                               format="DD/MM/YYYY"
                             />
                           ) : (
                             <Text onClick={() => handleEdit(task.IdActividad, "Fechas")}>
                               {task.FechaInicio && task.FechaSolicitado
                                 ? `${dayjs(task.FechaInicio).format("DD/MM/YYYY")} - ${dayjs(
                                     task.FechaSolicitado
                                   ).format("DD/MM/YYYY")}`
                                 : "Sin fecha"}
                             </Text>
                           )}
                         </div>
                         <div style={{ flex: 1 }}>
                           {editingField.taskId === task.IdActividad && editingField.field === "Prioridad" ? (
                             <Select
                               autoFocus
                               placeholder="Prioridad"
                               value={task.PrioridadStr || undefined}
                               onChange={(value) => handleFieldChange(task.IdActividad, "Prioridad", value)}
                               style={{ width: "75%" }}
                             >
                               {priorities.map((priority) => (
                                 <Select.Option key={priority.IdCatalogo} value={priority.IdCatalogo}>
                                   {priority.DescLarga}
                                 </Select.Option>
                               ))}
                             </Select>
                           ) : (
                             <Text onClick={() => handleEdit(task.IdActividad, "Prioridad")}>{
                               task.PrioridadStr || "Sin prioridad"
                             }</Text>
                           )}
                         </div>
                         <div style={{ flex: 1 }}>
                         <Dropdown
                             overlay={
                               <Menu>
                                 <Menu.Item key="1" onClick={() =>CapturaTrabajo(task.IdActividad, task.PSP, '')}>Capturar tiempo</Menu.Item>
                                 <Menu.Item key="2" onClick={() =>Cancelar(task.IdActividad)}>Cancelar tarea</Menu.Item>
                               </Menu>
                             }
                             placement="bottomLeft"
                             arrow
                           >
                             <Button icon={<EllipsisOutlined />} />
                           </Dropdown>
                                               
                          </div>
                       </div>
                     )}
                   </Draggable>
                 ))}
                 {provided.placeholder}
               </div>
             )}
           </Droppable>



           </Panel>
         );
       })}
     </Collapse>
     </DragDropContext>
     </>
     ):(
          <WelcomeScreenTab 
          setShowFilters={setShowFilters}
          />
     ) 
     
    }
 
      {/* Float Button Group - Se mantiene igual */}
      {selectedTasks.length > 0 && (
        <>
          
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)" }}>
            <Text strong>{selectedTasks.length}  seleccionados</Text> <Link  onClick={() => CleanSelected()}> eliminar selección</Link>
          </div>
          <FloatButton.Group 
        
        shape="circle"


        style={{
          position: "fixed",
          top: -200,
          right: 16,
          zIndex: 1000,
        }}
        >

          <Dropdown overlay={reassignWorkflow} placement="bottomRight" arrow>
            <FloatButton
              icon={<GroupOutlined   />}
              type="primary"
              tooltip="Cambiar estatus"
            />
          </Dropdown>
          <Dropdown overlay={reassignMenu} placement="bottomRight" arrow>
            <FloatButton
              icon={<UserOutlined />}
              type="primary"
              tooltip="Reasignar asignado"
            />
            </Dropdown>
            <Dropdown overlay={reassignSprint} placement="bottomRight" arrow>
            <FloatButton
              icon={<RedoOutlined  />}
              type="primary"
              tooltip="Reasignar sprint"
            />
          </Dropdown>
          <Dropdown
              overlay={
                <div style={{ padding: 16 }}>
                  <RangePicker
                    onChange={(dates, dateStrings) => handleDateRangeChange(dateStrings)}

                    value={selectedDateRange[0] && selectedDateRange[1] ? [dayjs(selectedDateRange[0]), dayjs(selectedDateRange[1])] : null}
                    style={{
                      width: 250, 
                    }}
                  />
                </div>
              }
              trigger={['click']}
            >
              <FloatButton
                icon={<CalendarOutlined />}
                type="primary"
                tooltip="Actualizar fechas"
              />
           </Dropdown>

          <FloatButton
            icon={<CloseCircleOutlined />}
            type="primary"
            onClick={() => handleCancel()}
            tooltip="Cancelar"
          />

            
           
          
        </FloatButton.Group>
        </>
      )}
    </div>
  );
});

 

export default TaskList;
