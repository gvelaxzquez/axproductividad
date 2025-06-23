import React, { useState, useEffect , useRef} from 'react';
import TimeLineCalendar from 'react-calendar-timeline';
import { Select, Typography  } from 'antd';
import {  Badge,  Tooltip, Space, Button } from 'antd';
import { SyncOutlined , FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';
import axios from 'axios';
import WelcomeScreenTab from './WelcomeTabScreen';
import Filtros from './Filtros';
import ButtonGroup from 'antd/es/button/button-group';




const useIsVisible = (callback) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const hasUpdated = useRef(false); // Flag para controlar si ya se actualizó

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && !hasUpdated.current) { // Solo ejecutar si no se ha actualizado
          callback();
          hasUpdated.current = true; // Marcar como actualizado
        }
      },
      {
        threshold: 0.1
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [callback]);

  // Función para resetear el estado de actualización
  const resetUpdate = () => {
    hasUpdated.current = false;
  };

  return [elementRef, isVisible, resetUpdate];
};


const { Text } = Typography;
const Timeline = ({ 
            IdWorkSpaceTab
}) => {

  const timelineRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);

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
    LstEstatusW: [] ,
    });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [groupBy, setGroupBy] = useState('');

  const [visibleTimeStart, setVisibleTimeStart] = useState(dayjs().subtract(1, "month").valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(dayjs().valueOf());

  const handleVisible = () => {
    if (timelineRef.current) {
      timelineRef.current.setState({
        width: timelineRef.current.container.clientWidth
      });
      setForceRender(prev => prev + 1);
    }
  };

  // Usar el hook de visibilidad
  const [containerRef, isVisible, resetUpdate] = useIsVisible(handleVisible);

  // useEffect(() => {
  //   // Aplicar estilos personalizados al montar el componente
  //   const style = document.createElement('style');
  //   style.textContent = Object.entries(timelineStyles)
  //     .map(([selector, rules]) => 
  //       `${selector} { ${Object.entries(rules)
  //         .map(([property, value]) => `${property}: ${value};`)
  //         .join(' ')} }`
  //     )
  //     .join('\n');
  //   document.head.appendChild(style);

  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);
  useEffect(() => {
    resetUpdate();
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

           setGroupBy(wst.Agrupador ? ( wst.Agrupador): ( "historia"));
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

      fetchTasks(filters);

      const count = Object.values(filters).filter(value => 
        Array.isArray(value) ? value.length > 0 : value !== null
      ).length;
      setActiveFiltersCount(count);

  
    }

  }, [filters]);


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


  const handleUpdateGroup = async (Group) => {
    
    try {
      var wst = {
         IdWorkSpaceTab : IdWorkSpaceTab,
         Agrupador : Group
      }
      const res =  await axios.post("/Workspace/ActualizaAgrupadorTab", {wst:wst}); 
      if (res.data.Exito) {
        setGroupBy(Group);
      }

    } catch (error) {
      console.error('Error updating workspace name:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };
  const handleTimeChange = (visibleTimeStart, visibleTimeEnd) => {
    setVisibleTimeStart(visibleTimeStart);
    setVisibleTimeEnd(visibleTimeEnd);
  };

  const RefreshTask =async  () => {
    fetchTasks(filters);
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters); 
  };

  const getGroups = () => {
    switch (groupBy) {
        case 'historia':
            const storyGroups = _.groupBy(tasks, 'HU');
            return Object.entries(storyGroups).map(([HU]) => ({
              id: HU,
              title: HU === '' ? 'Sin HU' : ` ${HU}`
            }));
            case 'sprint':
                const sprintGroups = _.groupBy(tasks, 'Sprint');
                return Object.entries(sprintGroups).map(([Sprint]) => ({
                  id: Sprint,
                  title: Sprint === '' ? 'Sin sprint' : ` ${Sprint}`
          }));
              
      case 'usuario':
        const userGroups = _.groupBy(tasks, 'AsignadoStr');
        return Object.entries(userGroups).map(([AsignadoStr]) => ({
          id: AsignadoStr,
          title: AsignadoStr === '' ? 'Sin asignar' : ` ${AsignadoStr}`
         
        }));
      
      case 'fase':
        const phaseGroups = _.groupBy(tasks, 'TipoActividadStr');
        return Object.entries(phaseGroups).map(([TipoActividadStr]) => ({
          id: TipoActividadStr,
          title: TipoActividadStr === '' ? 'Sin fase' : ` ${TipoActividadStr}`
        }));


      
      default:
        return [];
    }
  };

  const getGroupId = (task) => {
    switch (groupBy) {
      case 'usuario':
        return task.AsignadoStr;
      case 'fase':
        return task.TipoActividadStr;
      case 'historia':
        return task.HU;
      case 'sprint':
            return task.Sprint;
      default:
        return null;
    }
  };

  const items = tasks.map(task => ({
    id: task.IdActividad,
    group: getGroupId(task),
    title: task.BR,
    start_time: dayjs(task.FechaInicio).valueOf(),
    end_time: dayjs(task.FechaSolicitado || task.FechaSolicitado).add(1, 'day').valueOf(),
    itemProps: {
      style: {
        backgroundColor: task.ColorW,
        borderColor: task.ColorW,   
        color: task.ColorTexto,
        // background: task.Estatus === 'L' ? '#8c8c8c' : 
        //            task.Estatus === 'cancelado' ? '#ff4d4f' :
        //            task.Estatus === 'pending' ? '#ffa940' : '#1890ff',
        // borderColor: task.Estatus === 'L' ? '#8c8c8c' : 
        //             task.Estatus === 'cancelado' ? '#ff4d4f' :
        //             task.Estatus === 'pending' ? '#ffa940' : '#1890ff',
        // color: 'white',
        textDecoration: task.Estatus === 'L' ? 'line-through' : 'none'
      },
    //   onClick: () => handleItemClick(task.IdActividad)
    }
  }));
  const getItems = () => {
    return tasks.map(task => ({
      id: task.IdActividad,
      group: getGroupId(task),
      title: task.BR,
      start_time: dayjs(task.FechaInicio).valueOf(),
      end_time: dayjs(task.FechaSolicitado || task.FechaSolicitado).add(1, 'day').valueOf(),
      itemProps: {
        style: {
          backgroundColor: task.ColorW,
          borderColor: task.ColorW,
          color: task.ColorTexto,
          // textDecoration: task.Estatus === 'L' ? 'line-through' : 'none',
          cursor: 'pointer',
          fontSize: '11px', // Aumentar tamaño de fuente
   
        }
      }
    }));
  };

  return (
    <div ref={containerRef}  style={{ padding: '12px' , minHeight:'500px'}}>
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
    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <Space direction="horizontal" size={8}  style={{ width: '50%'}}>
        <Text strong style={{ marginRight: '8px' }}>Agrupar por:</Text>
        <Select
          style={{ width: 200 }}
          value={groupBy}
  
          onChange={(value) => handleUpdateGroup(value)}
          options={[
            { value: 'historia', label: 'Historia de Usuario' },
            { value: 'sprint', label: 'Sprint' },
            { value: 'usuario', label: 'Usuario' },
            { value: 'fase', label: 'Fase' }
           
          ]}
        />
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
                        onClick={RefreshTask}
                        style={{ fontSize: '16px', marginRight: '10px' }}
              />


              </ButtonGroup>


          </Space>

      </div>

      <div style={{ minHeight: '500px' }}> 

            <TimeLineCalendar
              key={forceRender} // Forzar re-render cuando cambia
              ref={timelineRef}
              groups={getGroups()}
              items={getItems()}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              canMove={false}
              canResize={false}
              stackItems
              itemHeightRatio={0.75}
              sidebarWidth={150}
              onItemClick={(itemId) => clickalerta(itemId)}
              minZoom={24 * 60 * 60 * 1000} // Minimum zoom of 1 day
              maxZoom={365 * 24 * 60 * 60 * 1000} // Maximum zoom of 1 year
              lineHeight={40}
              headerLabelGroupHeight={50}
              headerLabelHeight={50}
            />
      </div>

        </>
  

    )
    :
    (
      <WelcomeScreenTab 
      setShowFilters={setShowFilters}
      />
    )
  }
    </div>
  );
};

export default Timeline;

