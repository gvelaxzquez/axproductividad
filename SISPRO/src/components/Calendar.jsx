import React, { useState, useEffect } from 'react';
import { Badge, Drawer, Tooltip, Space, Button } from 'antd';
import { SyncOutlined, FilterOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import dayjs from 'dayjs';
import axios from 'axios';
import WelcomeScreenTab from './WelcomeTabScreen';
import Filtros from './Filtros';
import ButtonGroup from 'antd/es/button/button-group';

const TaskCalendar = ({ IdWorkSpaceTab }) => {
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [WorkSpaceTab, setWorkSpaceTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filters, setFilters] = useState({ 
    Proyecto: null,
    Tipo: null,
    Fechas: [null, null],
    LstSprints: [],
    LstAsignado: [],
    LstResponsable: [],
    LstTipoActividad: [],
    LstClasificacion: [],
    LstPrioridad: [],
    LstEstatusW: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setWorkSpaceTab(IdWorkSpaceTab);
    fetchDataFromTab(IdWorkSpaceTab);
  }, [IdWorkSpaceTab]);

  const fetchDataFromTab = async (IdWorkSpaceTab) => {
    if (!IdWorkSpaceTab) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/Workspace/ConsultaWorkspaceTab', { IdWorkSpaceTab });

      if (response.data.Exito) {
        const wst = JSON.parse(response.data.WorkSpaceTab);
        const filterData = typeof wst.Filtros === 'string' 
          ? JSON.parse(wst.Filtros) 
          : wst.Filtros;

        if (filterData) {
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
        }
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
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
        FechaSolIni: filters.Fechas?.[0],
        FechaSolFin: filters.Fechas?.[1],
        LstAsignado: filters.LstAsignado,
        LstResponsable: filters.LstResponsable,
        LstTipoActividad: filters.LstTipoActividad,
        LstClasificacion: filters.LstClasificacion,
        LstPrioridad: filters.LstPrioridad,
        LstEstatusW: filters.LstEstatusW
      };

      const resTask = await axios.post("/Workspace/ConsultaActividadesTablero", { 
        IdWorkSpaceTab: WorkSpaceTab, 
        Filtros 
      });

      if (resTask.data.Exito) {
        const taskData = JSON.parse(resTask.data.Actividades);
        setTasks(taskData);
      } else {
        message.error(resTask.data.Mensaje);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const RefreshTask = () => {
    fetchTasks(filters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleDateClick = (arg) => {
    const clickedDate = dayjs(arg.date).format('YYYY-MM-DD');
    const dayTasks = tasks.filter(task => 
      dayjs(task.FechaSolicitado).format('YYYY-MM-DD') === clickedDate
    );
    
    if (dayTasks.length > 0) {
      setSelectedDayTasks(dayTasks);
      setSelectedDate(arg.date);
      setIsDrawerVisible(true);
    }
  };

  const handleDrawerClose = () => setIsDrawerVisible(false);

  // Transform tasks for FullCalendar
  const getCalendarEvents = () => {
    return tasks.map(task => ({
      id: task.IdActividad,
      title: task.BR,
      start: task.FechaInicio,
      end: task.FechaSolicitado,
      backgroundColor: task.ColorW,
      ColorTexto: task.ColorTexto,
      extendedProps: {
        ...task
      }
    }));
  };

  return (
    <>
      <Filtros
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        setSelectedProject={setSelectedProject}
        setSelectedType={setSelectedType}
      />
      
      {filters.Proyecto ? (
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
            </ButtonGroup>
          </Space>

          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={getCalendarEvents()}
              dateClick={handleDateClick}
              eventClick={(arg) => clickalerta(arg.event.id)}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
              }}
              dayMaxEvents={7}
              eventContent={(arg) => {
                return (
                  <Tooltip title={arg.event.title} style={{ backgroundColor:arg.event.backgroundColor, color:arg.event.ColorTexto  }}>
                    <div 
                      className={`fc-event-main-content ${arg.event.classNames.join(' ')}`}
                      style={{
                        backgroundColor: arg.event.backgroundColor,
                        color: arg.event.ColorTexto,
                        padding: '2px 4px',
                        borderRadius: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        border: `1px solid ${arg.event.backgroundColor}`
                      }}
                    >
                      {arg.event.title}
                    </div>
                  </Tooltip>
                );
              }}
              eventDisplay="block"
              slotEventOverlap={false}
              locale={esLocale}
              buttonText={{
                today: 'Hoy'
              }}
            />
          </div>

          <Drawer
            title={`Tareas del ${selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : ''}`}
            placement="right"
            onClose={handleDrawerClose}
            open={isDrawerVisible}
            width={400}
          >
            <ul className="drawer-tasks-list">
              {selectedDayTasks.map((task) => (
                <li 
                  key={task.IdActividad}
                  className={`drawer-task ${task.Estatus === 'L' ? 'liberado' : ''} ${task.Estatus === 'cancelado' ? 'cancelado' : ''}`}
                  onClick={() => clickalerta(task.IdActividad)}
                >
                  <Badge 
                    color={task.ColorW}
                    text={task.BR} 
                  />
                </li>
              ))}
            </ul>
          </Drawer>
        </>
      ) : (
        <WelcomeScreenTab setShowFilters={setShowFilters} />
      )}
    </>
  );
};

export default TaskCalendar;

