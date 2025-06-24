import React, { useState, useMemo, useEffect } from 'react';
import { 
  Table, Typography, Badge, Select, DatePicker, Input, 
  Dropdown, Menu, Button, InputNumber, message, Modal , FloatButton, Drawer, Checkbox,
  Tooltip, Space
} from 'antd';
import { 
  EllipsisOutlined, UserOutlined, CloseCircleOutlined,
  RedoOutlined, GroupOutlined, CalendarOutlined,SettingOutlined,MenuOutlined,
  FileExcelOutlined ,SyncOutlined , FilterOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as XLSX from 'xlsx';
import ButtonGroup from 'antd/es/button/button-group';
import WelcomeScreenTab from './WelcomeTabScreen';
import Filtros from './Filtros';


const { Text, Link } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;


const DEFAULT_COLUMN_WIDTH = 150;



const TaskTable = ({ 
  IdWorkSpaceTab

}) => {
  const [editingField, setEditingField] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]); // Estado para almacenar el rango de fechas seleccionado
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [currentData, setCurrentData] = useState({
    data: tasks,
    pagination: {},
    filters: {},
    sorter: {}
  });

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
    const [priorities, setPriorities] = useState([]);
    const [resources, setResources] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [estatus, setEstatus] = useState([]);
    const [fases, setFases] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);
  
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
     


          if (wst.Columnas != null) {
            const config = JSON.parse(wst.Columnas);
            // Asegúrate de que las columnas por defecto estén visibles
            setColumnConfig(config);
            // return config.map(conf => ({
            //   ...conf,
            //   visible: conf.key === 'id' || conf.key === 'title' || conf.key === 'status' ? true : conf.visible
            // }));
          }
          else {

           const NewColumnConfig= baseColumns.map((col => ({
               title: col.title,
               dataIndex: col.dataIndex,
               key: col.key,
               width: col.width,
               visible: col.visible,
               fixed: col.fixed,
               sortDirections:["ascend","descend"],
              filterSearch:true,
              filters:[]
          })));

               setColumnConfig(NewColumnConfig);

          }

          // const filterData = typeof wst.Filtros === 'string' 
          //   ? JSON.parse(wst.Filtros) 
          //   : wst.Filtros;
  

          //   // const columns = typeof wst.Columnas === 'string' 
          //   // ? JSON.parse(wst.Columnas) 
          //   // : wst.Columnas;
  

            


          if (wst.Filtros.length > 0) {

            const filterData = JSON.parse(wst.Filtros);
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
         console.error('Error fetching filters:', error);
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
  
        if (!columnConfig) {
          setColumnConfig(baseColumns);
        }

      }

  
    }, [filters]);
  
    const fetchColumns = async (projectId, taskType) => {
      try {
         setIsLoading(true);
  
        const Filtros = {
          IdProyecto: filters.Proyecto,
          Tipo: filters.Tipo,
        };
       
        const resColumns = await axios.post("/Board/ConsultaWorkFlow", Filtros); 
  
        var ColumnsData = jQuery.parseJSON(resColumns.data.Workflow);
    
        if (resColumns.data.Exito) {
          // setColumns(ColumnsData);
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
          setFases(jQuery.parseJSON(response.data.LstFase)); 
          setClasificaciones(jQuery.parseJSON(response.data.LstClasificacion)); 
    
    
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

const getUniqueValues = (dataIndex) => {
  const values = new Set(tasks.map(item => item[dataIndex]));
  return Array.from(values).map(value => ({ text: value, value: value }));
};

const baseColumns =[

  {
    title: 'ID',
    dataIndex: 'IdActividadStr',
    key: 'id',
    width: 130,
    visible: true,
    fixed:true,
    sorter: (a, b) => a.IdActividadStr.localeCompare(b.IdActividadStr),
      sortDirections: ['ascend', 'descend'],
      filterSearch: true,
      filters: getUniqueValues('IdActividadStr'),
      onFilter: (value, record) => record.IdActividadStr.includes(value),
    render: (text, record) => (
      <Link onClick={() => clickalerta(record.IdActividad)}>
        {text}
      </Link>
    ),
  },
  // {
  //   title: 'Tipo',
  //   dataIndex: 'TipoNombre',
  //   key: 'Tipo',
  //   visible: true,
  //   width: DEFAULT_COLUMN_WIDTH,
  //   // filters: types.map(type => ({
  //   //   text: type.Nombre,
  //   //   value: type.ActividadTipoId
  //   // })),
  //   // onFilter: (value, record) => record.TipoId === value,
  //   sorter: (a, b) => a.TipoNombre.localeCompare(b.TipoNombre),
  //   render: (text, record) => (
  //     editingField.taskId === record.IdActividad && editingField.field === 'Tipo' ? (
  //       <Select
  //         autoFocus
  //         value={record.TipoId}
  //         // defaultValue={record.TipoId}
  //         onChange={(value) => handleFieldChange(record.IdActividad, 'Tipo', value)}
  //         style={{ width: '100%' }}
  //       >
  //         {taskTypes.map(type => (
  //           <Select.Option key={type.ActividadTipoId} value={type.Nombre}>
  //             <div style={{ display: 'flex', alignItems: 'center' }}>
  //               <img
  //                 src={`/Content/Project/Imagenes/${type.Url}`}
  //                 alt={type.Nombre}
  //                 style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
  //                 onError={(e) => {
  //                   e.target.onerror = null;
  //                   e.target.src = "/Content/Project/Imagenes/task.png";
  //                 }}
  //               />
  //               {type.Nombre}
  //             </div>
  //           </Select.Option>
  //         ))}
  //       </Select>
  //     ) : (
  //       <div onClick={() => handleEdit(record.IdActividad, 'Tipo')}>
  //         <img
  //                 src={`/Content/Project/Imagenes/${record.TipoUrl}`}
  //                 alt={record.TipoNombre}
  //                 style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
  //                 onError={(e) => {
  //                   e.target.onerror = null;
  //                   e.target.src = "/Content/Project/Imagenes/task.png";
  //                 }}
  //          />
  //         {text || ''}
  //       </div>
  //     )
  //   ),
  // },

  {
    title: 'Título',
    dataIndex: 'BR',
    width: 200,
    key: 'title',
    visible: true,
    sorter: (a, b) => a.BR.localeCompare(b.BR),
    sortDirections: ['ascend', 'descend'],
    filterSearch: true,
    filters: getUniqueValues('BR'),
    onFilter: (value, record) => record.BR.includes(value),
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'BR' ? (
        <TextArea
          autoFocus
          defaultValue={text}
          // onBlur={(e) => handleFieldChange(record.IdActividad, 'BR', e.target.value)}
          // onPressEnter={(e) => handleFieldChange(record.IdActividad, 'BR', e.target.value)}

          onBlur={(e) => handleFieldChange(record.IdActividad, 'BR', e.target.value)}
          onPressEnter={(e) => {
            e.preventDefault();
            handleFieldChange(record.IdActividad, 'BR', e.target.value);
          }}

        />
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'BR')}>
          {text || 'Sin descripción'}
        </Text>
      )
    ),
  },
  {
    title: 'Estado',
    dataIndex: 'WorkFlow',
    width: DEFAULT_COLUMN_WIDTH,
    key: 'status',
    visible: true,
    filters: estatus.map(status => ({
      text: status.Nombre,
      value: status.IdWorkFlow
    })),
    onFilter: (value, record) => record.IdWorkFlow === value,
    sorter: (a, b) => a.WorkFlow.localeCompare(b.WorkFlow),
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'Estatus' ? (
        <Select
          autoFocus
          defaultValue={record.IdWorkFlow}
          onChange={(value) => handleFieldChange(record.IdActividad, 'Estatus', value)}
          style={{ width: '100%' }}
        >
          {estatus.map(status => (
            <Select.Option key={status.IdWorkFlow} value={status.IdWorkFlow}>
              <Badge color={status.Color} text={status.Nombre} />
            </Select.Option>
          ))}
        </Select>
      ) : (
        <Badge 
          onClick={() => handleEdit(record.IdActividad, 'Estatus')}
          color={record.ColorW} 
          text={text} 
        />
      )
    ),
  },

  {
    title: 'Puntos',
    dataIndex: 'Puntos',
    key: 'Puntos',
    visible: false,
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => (a.Puntos || 0) - (b.Puntos || 0),
    filters: Array.from(new Set(tasks.map(task => task.Puntos)))
      .filter(points => points !== null && points !== undefined)
      .sort((a, b) => a - b)
      .map(points => ({ text: points.toString(), value: points })),
    onFilter: (value, record) => record.Puntos === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'Puntos' ? (
        <InputNumber
          autoFocus
          defaultValue={text}
          onChange={(value) => handleFieldChange(record.IdActividad, 'Puntos', value)}
          style={{ width: '100%' }}
        />
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'Puntos')}>
          {text || 'Sin puntos'}
        </Text>
      )
    ),
  },


  {
    title: 'Asignado',
    dataIndex: 'AsignadoStr',
    key: 'assigned',
    visible: true,
    width: DEFAULT_COLUMN_WIDTH,
    filters: resources.map(resource => ({
      text: resource.DescLarga,
      value: resource.IdCatalogo
    })),
    onFilter: (value, record) => record.IdUsuarioAsignado === value,
    sorter: (a, b) => a.AsignadoStr.localeCompare(b.AsignadoStr),
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'IdUsuarioAsignado' ? (
        <Select
          autoFocus
          defaultValue={record.IdUsuarioAsignado}
          onChange={(value) => handleFieldChange(record.IdActividad, 'IdUsuarioAsignado', value)}
          style={{ width: '100%' }}
        >
          {resources.map(resource => (
            <Select.Option key={resource.IdCatalogo} value={resource.IdCatalogo}>
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
            </Select.Option>
          ))}
        </Select>
      ) : (
        <div onClick={() => handleEdit(record.IdActividad, 'IdUsuarioAsignado')}>
          <img
            src={`/Archivos/Fotos/${record.ClaveUsuario}.jpg`}
            alt={record.ClaveUsuario}
            style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/Archivos/Fotos/default.jpg";
            }}
          />
          {text || 'Sin asignar'}
        </div>
      )
    ),
  },
  {
    title: 'Responsable',
    dataIndex: 'ResponsableStr',
    key: 'Responsable',
    visible: false,
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => a.ResponsableStr.localeCompare(b.ResponsableStr),
      filters: resources.map(resource => ({
        text: resource.DescLarga,
        value: resource.IdCatalogo
      })),
      onFilter: (value, record) => record.IdUsuarioResponsable === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'Responsable' ? (
        <Select
          autoFocus
          defaultValue={record.IdUsuarioResponsable}
          onChange={(value) => handleFieldChange(record.IdActividad, 'Responsable', value)}
          style={{ width: '100%' }}
        >
          {resources.map(resource => (
            <Select.Option key={resource.IdCatalogo} value={resource.IdCatalogo}>
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
            </Select.Option>
          ))}
        </Select>
      ) : (
        <div onClick={() => handleEdit(record.IdActividad, 'Responsable')}>
          <img
            src={`/Archivos/Fotos/${record.ClaveResponsable}.jpg`}
            alt={record.ClaveResponsable}
            style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/Archivos/Fotos/default.jpg";
            }}
          />
          {text || 'Sin responsable'}
        </div>
      )
    ),
  },
  {
    title: 'Sprint',
    dataIndex: 'Sprint',
    key: 'sprint',
    visible: false,
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => (a.Sprint || '').localeCompare(b.Sprint || ''),
      filters: [
        { text: 'Sin sprint', value: null },
        ...sprints.map(sprint => ({
          text: sprint.DescLarga,
          value: sprint.IdCatalogo
        }))
      ],
      onFilter: (value, record) => 
        value === null ? !record.IdIteracion : record.IdIteracion === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'IdIteracion' ? (
        <Select
          autoFocus
          defaultValue={record.IdIteracion}
          onChange={(value) => handleFieldChange(record.IdActividad, 'IdIteracion', value)}
          style={{ width: '100%' }}
        >
          <Select.Option key={-1} value={-1}>Sin sprint</Select.Option>
          {sprints.map(sprint => (
            <Select.Option key={sprint.IdCatalogo} value={sprint.IdCatalogo}>
              {sprint.DescLarga}
            </Select.Option>
          ))}
        </Select>
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'IdIteracion')}>
          {text || 'Sin sprint'}
        </Text>
      )
    ),
  },
  {
    title: 'Prioridad',
    dataIndex: 'PrioridadStr',
    key: 'prioridad',
    visible: false,
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => (a.IdPrioridad || 0) - (b.IdPrioridad || 0),
    filters: priorities.map(priority => ({
      text: priority.DescLarga,
      value: priority.IdCatalogo
    })),
    onFilter: (value, record) => record.IdPrioridad === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'Prioridad' ? (
        <Select
          autoFocus
          defaultValue={record.PrioridadId}
          onChange={(value) => handleFieldChange(record.IdActividad, 'Prioridad', value)}
          style={{ width: '100%' }}
        >
          {priorities.map(priority => (
            <Select.Option key={priority.IdCatalogo} value={priority.IdCatalogo}>
              {priority.DescLarga}
            </Select.Option>
          ))}
        </Select>
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'Prioridad')}>
          {text || 'Sin prioridad'}
        </Text>
      )
    ),
  },

  {
    title: 'Fase',
    dataIndex: 'TipoActividadStr',
    key: 'Fase',
    visible: false,
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => a.TipoActividadStr.localeCompare(b.TipoActividadStr),
    filters: fases.map(fase => ({
      text: fase.DescLarga,
      value: fase.IdCatalogo
    })),
    onFilter: (value, record) => record.TipoActividadId === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'Fase' ? (
        <Select
        autoFocus
        defaultValue={record.TipoActividadId}
        onChange={(value) => handleFieldChange(record.IdActividad, 'Fase', value)}
        style={{ width: '100%' }}
      >
        {fases.map(fase => (
          <Select.Option key={fase.IdCatalogo} value={fase.IdCatalogo}>
            {fase.DescLarga}
          </Select.Option>
        ))}
      </Select>
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'Fase')}>
          {text || 'Sin fase'}
        </Text>
      )
    ),
  },
  {
    title: 'Clasificación',
    dataIndex: 'ClasificacionStr',
    key: 'Clasificacion',
    visible: false,
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => a.ClasificacionStr.localeCompare(b.ClasificacionStr),
      filters: clasificaciones.map(clas => ({
        text: clas.DescLarga,
        value: clas.IdCatalogo
      })),
      onFilter: (value, record) => record.ClasificacionId === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'Clasificacion' ? (
        <Select
        autoFocus
        defaultValue={record.ClasificacionId}
        onChange={(value) => handleFieldChange(record.IdActividad, 'Clasificacion', value)}
        style={{ width: '100%' }}
      >
        {clasificaciones.map(clas => (
          <Select.Option key={clas.IdCatalogo} value={clas.IdCatalogo}>
            {clas.DescLarga}
          </Select.Option>
        ))}
      </Select>
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'Clasificacion')}>
          {text || 'Sin fase'}
        </Text>
      )
    ),
  },
  {
    title: 'Estimado',
    dataIndex: 'HorasFacturables',
    key: 'HorasFacturables',
    visible: false,
    align: 'right',
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => (a.HorasAsignadas || 0) - (b.HorasAsignadas || 0),
      filters: Array.from(new Set(tasks.map(task => task.HorasAsignadas)))
        .filter(hours => hours !== null && hours !== undefined)
        .sort((a, b) => a - b)
        .map(hours => ({ text: hours.toString(), value: hours })),
    onFilter: (value, record) => record.HorasAsignadas === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'HorasFacturables' ? (
        <InputNumber
          autoFocus
          defaultValue={text}
          onChange={(value) => handleFieldChange(record.IdActividad, 'HorasFacturables', value)}
          style={{ width: '100%' }}
        />
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'HorasFacturables')}>
          {text || 'Sin horas'}
        </Text>
      )
    ),
  },
  {
    title: 'Asignado',
    dataIndex: 'HorasAsignadas',
    key: 'HorasAsignadas',
    visible: false,
    align: 'right',
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => (a.HorasAsignadas || 0) - (b.HorasAsignadas || 0),
      filters: Array.from(new Set(tasks.map(task => task.HorasAsignadas)))
        .filter(hours => hours !== null && hours !== undefined)
        .sort((a, b) => a - b)
        .map(hours => ({ text: hours.toString(), value: hours })),
    onFilter: (value, record) => record.HorasAsignadas === value,
    render: (text, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'HorasAsignadas' ? (
        <InputNumber
          autoFocus
          defaultValue={text}
          onChange={(value) => handleFieldChange(record.IdActividad, 'HorasAsignadas', value)}
          style={{ width: '100%' }}
        />
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'HorasAsignadas')}>
          {text || 'Sin horas'}
        </Text>
      )
    ),
  },

  {
    title: 'Real',
    dataIndex: 'HorasFinales',
    key: 'HorasFinales',
    visible: false,
    align: 'right',
    width: DEFAULT_COLUMN_WIDTH,
    sorter: (a, b) => (a.HorasFinales || 0) - (b.HorasFinales || 0),
      filters: Array.from(new Set(tasks.map(task => task.HorasFinales)))
        .filter(hours => hours !== null && hours !== undefined)
        .sort((a, b) => a - b)
        .map(hours => ({ text: hours.toString(), value: hours })),
      onFilter: (value, record) => record.HorasFinales === value
  },
  {
    title: 'Fechas',
    key: 'dates',
    visible: false,
    width: DEFAULT_COLUMN_WIDTH,
    filters: Array.from(new Set(tasks.map(task => 
      task.FechaInicio ? dayjs(task.FechaInicio).format('YYYY-MM-DD') : null
    )))
    .filter(date => date !== null)
    .sort()
    .map(date => ({
      text: dayjs(date).format('DD/MM/YYYY'),
      value: date
    })),
    onFilter: (value, record) => 
      record.FechaInicio ? dayjs(record.FechaInicio).format('YYYY-MM-DD') === value : false,
    render: (_, record) => (
      editingField.taskId === record.IdActividad && editingField.field === 'Fechas' ? (
        <RangePicker
          autoFocus
          value={[
            record.FechaInicio ? dayjs(record.FechaInicio) : null,
            record.FechaSolicitado ? dayjs(record.FechaSolicitado) : null
          ]}
          onChange={(dates) => handleDateChange(record.IdActividad, dates)}
          format="DD/MM/YYYY"
        />
      ) : (
        <Text onClick={() => handleEdit(record.IdActividad, 'Fechas')}>
          {record.FechaInicio && record.FechaSolicitado
            ? `${dayjs(record.FechaInicio).format('DD/MM/YYYY')} - ${dayjs(record.FechaSolicitado).format('DD/MM/YYYY')}`
            : 'Sin fecha'}
        </Text>
      )
    ),
  },
  {
    title: 'Acciones',
    key: 'actions',
    visible: true,
    width: 80,
    render: (_, record) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="1" onClick={() => CapturaTrabajo(record.IdActividad, record.PSP, '')}>
              Capturar tiempo
            </Menu.Item>
            <Menu.Item key="2" onClick={() => Cancelar(record.IdActividad)}>
              Cancelar tarea
            </Menu.Item>
          </Menu>
        }
        trigger={['click']}
      >
        <Button icon={<EllipsisOutlined />} />
      </Dropdown>
    ),
  },

];

const [columnConfig, setColumnConfig] = useState([]);

 // Guarda la configuración en localStorage
 const saveColumnConfig = async (newConfig) => {
  // localStorage.setItem('tableColumnConfig', JSON.stringify(newConfig));
  try {
    var wst = {
       IdWorkSpaceTab : IdWorkSpaceTab,
       Columnas : JSON.stringify(newConfig)
    }
    const res =  await axios.post("/Workspace/ActualizaColumnasTab", {wst:wst}); 
    if (res.data.Exito) {
      //localStorage.setItem('tableColumnConfig', JSON.stringify(newConfig));
      setColumnConfig(newConfig);
    }

  } catch (error) {
    console.error('Error updating workspace name:', error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }

};

const onDragEnd = (result) => {
  if (!result.destination || result.draggableId === 'id') return;
  
  const newConfig = Array.from(columnConfig);
  const [removed] = newConfig.splice(result.source.index, 1);
  newConfig.splice(result.destination.index, 0, removed);
  
  saveColumnConfig(newConfig.map((conf, index) => ({
    ...conf,
    order: index
  })));
};

// Toggle visibilidad de columnas
const toggleColumnVisibility = (key) => {
  if (key === 'id') return;
  
  const newConfig = columnConfig.map(conf => 
    conf.key === key ? { ...conf, visible: !conf.visible } : conf
  );
  saveColumnConfig(newConfig);
};


  const getProcessedColumns = () => {
    return baseColumns
      .map(col => ({
        ...col,
        visible: columnConfig.find(conf => conf.key === col.key)?.visible ?? true,
        order: columnConfig.find(conf => conf.key === col.key)?.order ?? 0
      }))
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  };



  const reassignMenu = (
    <Menu>
      {resources.map((resource) => (
        <Menu.Item
          key={resource.IdCatalogo}
          onClick={() => handleReassignTasksTable(resource.IdCatalogo, 2)}
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
      {estatus.map((est) => (
        <Menu.Item
          key={est.IdWorkFlow}
          onClick={() => handleReassignTasksTable(est.IdWorkFlow, 1)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge color={est.Color} text={est.Nombre} />
           
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
          onClick={() => handleReassignTasksTable(sprint.IdCatalogo,3)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
               {sprint.DescLarga}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
  const handleReassignTasksTable = async (resourceId, tipo) => {
    try {
      const response = await axios.post('/Board/ActualizacionMasiva', {
  
        Actividades: selectedRowKeys,
        Tipo: tipo,
        IdNuevo: resourceId
  
      });
      if (response.data.Exito) {
  
        if(tipo===2){
          var res = resources.find(x => x.IdCatalogo === resourceId);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              selectedRowKeys.includes(task.IdActividad)
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
              selectedRowKeys.includes(task.IdActividad)
                ? {
                    ...task,
                    IdWorkFlow: resourceId,  
                    ColorW: est.Color,
                    WorkFlow: est.Nombre     // Actualiza el ID del usuario asignado
                  }
                : task
            )
          );
         }   
         else if(tipo===3){
  
          var sprint = sprints.find(x => x.IdCatalogo === resourceId);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              selectedRowKeys.includes(task.IdActividad)
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
      setSelectedRowKeys([]);
    }
  
  
  };

  const handleCancelTable = () => {
    Modal.confirm({
      title: "¿Estás seguro de que deseas cancelar los "+ selectedRowKeys.length   + " elementos seleccionados?",
      content: "Es posible que los elementos no se puedan reactivar.",
      okText: "Sí, cancelar",
      cancelText: "No",
      onOk: () => {
        handleReassignTasksTable(1,4);
        // Lógica para manejar la cancelación
      },
      onCancel: () => {
        message.warning("No se realizo la cancelación.");
      },
    });
  };
  const handleDateRangeChangeTable  = async (dateStrings) => {
    if (dateStrings[0] && dateStrings[1]) {
      try {
        const response = await axios.post('/Board/ActualizacionMasivaFechas', {
    
          Actividades: selectedRowKeys,
          FechaInicio: dateStrings[0],
          FechaSolicitado: dateStrings[1]
    
        });
        if (response.data.Exito) {

          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              selectedRowKeys.includes(task.IdActividad)
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
        setSelectedRowKeys([]);
      }
    
    }
  };

  const handleEdit = (taskId, field) => {
    setEditingField({ taskId, field });
  };

  const handleFieldChange = async (taskId, field, value) => {
    try {
      const response = await axios.post('/Board/ActualizaDatoActividad', {
        IdActividad: taskId,
        campo: field,
        dato1: value
      });

      if (response.data.Exito) {
        const res = resources.find(x => x.IdCatalogo === value);
        const ite = sprints.find(x => x.IdCatalogo === value);
        const pri = priorities.find(x => x.IdCatalogo === value);
        const est = estatus.find(x => x.IdWorkFlow === value);
        const fase = fases.find(x => x.IdCatalogo === value);
        const clas = clasificaciones.find(x => x.IdCatalogo === value);

        setTasks((prevTasks) => {
          return prevTasks.map((task) => {
            if (task.IdActividad === taskId) {
              return {
                ...task,
                ...(field === "BR" && { BR: value }),
                ...(field === "IdUsuarioAsignado" && { 
                  IdUsuarioAsignado: value, 
                  AsignadoStr: res.DescLarga, 
                  ClaveUsuario: res.DescCorta 
                }),
                ...(field === "Responsable" && { 
                  IdUsuarioResponsable: value, 
                  ResponsableStr: res.DescLarga, 
                  ClaveResponsable: res.DescCorta 
                }),
                ...(field === "IdIteracion" && { 
                  IdIteracion: value, 
                  Sprint: ite.DescLarga 
                }),
                ...(field === "Estatus" && { 
                  IdWorkFlow: value, 
                  ColorW: est.Color, 
                  WorkFlow: est.Nombre 
                }),
                ...(field === "HorasAsignadas" && { HorasAsignadas: value }),
                ...(field === "HorasFacturables" && { HorasFacturables: value }),
                ...(field === "Prioridad" && { 
                  IdPrioridad: value, 
                  PrioridadStr: pri.DescLarga 
                }),
                ...(field === "Fase" && { 
                  TipoActividadId: value, 
                  TipoActividadStr: fase.DescLarga 
                }),
                ...(field === "Clasificacion" && { 
                  ClasificacionId: value, 
                  ClasificacionStr: clas.DescLarga 
                }),
                ...(field === "Puntos" && { Puntos: value }),
              };
            }
            return task;
          });
        });
      } else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      message.error('Failed to update task');
    }
    setEditingField({});
  };

  const handleDateChange = async (taskId, dates) => {
    if (!dates || !dates[0] || !dates[1]) return;

    try {
      const response = await axios.post('/Board/ActualizaFecha', {
        A: {
          IdActividad: taskId,
          FechaInicio: dates[0].format('YYYY-MM-DD'),
          FechaSolicitado: dates[1].format('YYYY-MM-DD')
        }
      });

      if (response.data.Exito) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.IdActividad === taskId
              ? {
                  ...task,
                  FechaInicio: dates[0].toISOString(),
                  FechaSolicitado: dates[1].toISOString()
                }
              : task
          )
        );
      } else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      console.error('Error updating dates:', error);
      message.error('Failed to update dates');
    }
    setEditingField({});
  };


  const SaveTaskTable = (Title, e) => {
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
        // IdWorkFlow: IdWorkFlow, 
        IdProyecto: filters.Proyecto,
        TipoId: filters.Tipo,
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


  const NewTaskInput = () => (
    <div 
      style={{ 
        padding: '8px 16px',
        border: '1px solid #f0f0f0',
        borderTop: 'none',
        backgroundColor: '#fafafa'
      }}
    >
      <Input
        placeholder="Agregar, ingresa el título y presiona Enter"
        // value={newTaskName}
        // onChange={(e) => setNewTaskName(e.target.value)}
        // onKeyDown={handleKeyPress}
        onPressEnter={(e) => SaveTaskTable(e.target.value, e)}
        style={{ 
          border: 'none',
          backgroundColor: 'transparent',
          padding: '8px 0',
          width: '100%',
          fontSize: '12px'
        }}
      />

    </div>
  );
  const TableSummary = () => {
    const totals = {
      HorasAsignadas: Number(currentData.data.reduce((sum, record) => sum + (record.HorasAsignadas || 0), 0)).toFixed(2),
      HorasFinales: Number(currentData.data.reduce((sum, record) => sum + (record.HorasFinales || 0), 0)).toFixed(2),
      HorasFacturables: Number(currentData.data.reduce((sum, record) => sum + (record.HorasFacturables || 0), 0)).toFixed(2)
    };


    const processedColumns = getProcessedColumns();

    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          {/* Celda para la columna de selección */}
          <Table.Summary.Cell index={0} />
          
          {processedColumns.map((column, index) => {
            // Primera columna (después de la selección)
            if (index === 0) {
              return (
                <Table.Summary.Cell 
                  key={column.key} 
                  index={index + 2} // +1 por la columna de selección
                  align="left"
                >
                  <Text strong>Total</Text>
                </Table.Summary.Cell>
              );
            }

            if (column.dataIndex === 'HorasAsignadas' || column.dataIndex === 'HorasFinales' ||column.dataIndex === 'HorasFacturables'  ) {
              return (
                <Table.Summary.Cell 
                  key={column.key} 
                  index={index + 1} // +1 por la columna de selección
                  align="right"
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {totals[column.dataIndex]}
                </Table.Summary.Cell>
              );
            }

            return (
              <Table.Summary.Cell 
                key={column.key} 
                index={index + 1} 
                align={column.align}
              />
            );
          })}
        </Table.Summary.Row>
      </Table.Summary>
    );
  };


  const totalHours = useMemo(() => {
    if (!selectedRowKeys.length) return 0;
    return tasks
      .filter(task => selectedRowKeys.includes(task.IdActividad))
      .reduce((sum, task) => sum + (Number(task.HorasAsignadas) || 0), 0);
  }, [selectedRowKeys, tasks]);
  const CleanSelected = () => {
    setSelectedRowKeys([]);
  }

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.Prioridad === -99 && b.Prioridad === -99) return 0;
      if (a.Prioridad === -99) return -1;
      if (b.Prioridad === -99) return 1;
      return 0;
    });
  }, [tasks]);

  useEffect(() => {
    setCurrentData(prev => ({
      ...prev,
      data: tasks
    }));
  }, [tasks]);

  const handleTableChange = (pagination, filters, sorter, extra) => {
    setCurrentData({
      data: extra.currentDataSource,
      pagination,
      filters,
      sorter
    });
  };


  const exportToExcel = (data, fileName) => {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
  
    const finaldata = data.data.map(({ IdActividadStr, BR, WorkFlow,PrioridadStr, Sprint, AsignadoStr,
                                       ResponsableStr, HorasAsignadas, HorasFinales,FechaInicio, FechaSolicitado,
                                       TipoActividadStr, ClasificacionStr }) =>
                                     ({ Id: IdActividadStr, Titulo: BR, Estado: WorkFlow, 
                                        Prioridad: PrioridadStr, Sprint: Sprint,Asignado:AsignadoStr, 
                                        Responsable: ResponsableStr,
                                        Fase: TipoActividadStr, Clasificacion: ClasificacionStr,
                                        'Horas asignadas': HorasAsignadas, 'Horas reales': HorasFinales,
                                        FechaInicio: (FechaInicio ? dayjs(FechaInicio).format('DD/MM/YYYY') : '')  , 
                                        FechaFinPlan:(FechaSolicitado ? dayjs(FechaSolicitado).format('DD/MM/YYYY') : '')  
                                    
                                    }));

                                    

    // Convertir los datos de la tabla a una hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(finaldata);
  
    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Exportar el libro de trabajo a un archivo .xlsx
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  return (
    <div style={{ padding: '10px',paddingTop:'10px' }}>
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

                    <Button
                    icon={<SettingOutlined />}
                         type="text"
                    onClick={() => setDrawerVisible(true)}
                    title='Configurar columnas de la tabla'
                    style={{ fontSize: '16px', marginRight: '10px' }}
                  >
                   
                    </Button>
                  <Button 
                  icon={<FileExcelOutlined />}
                       type="text"
                    title='Exportar a Excel'
                    onClick={() => exportToExcel(currentData, "Workitems")}
                    style={{ fontSize: '16px', marginRight: '10px' }}
                    >
                   
                      </Button>
            </ButtonGroup>


        </Space>



        <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px' }}>
        <NewTaskInput />
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            fixed: true
          }}
          columns={getProcessedColumns()}
          dataSource={sortedTasks}
          rowKey="IdActividad"
          size="middle"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
          style={{ marginBottom: 0 }}
          summary={() => <TableSummary />}
          onChange={handleTableChange}
          onRow={(record) => ({
            style: record.Prioridad === -99 ? {
              backgroundColor: '#d4f7d4',  // Verde claro
            } : {}
          })}
        />

        </div>

        <Drawer
        title="Configuración de columnas"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={300}
        >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="column-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {columnConfig.map((conf, index) => (
                  <Draggable
                    key={conf.key}
                    draggableId={conf.key}
                    index={index}
                    isDragDisabled={conf.key === 'id'}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          padding: '8px',
                          marginBottom: '8px',
                          background: '#fff',
                          borderRadius: '4px',
                          border: '1px solid #f0f0f0',
                          ...provided.draggableProps.style
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {conf.key !== 'id' && (
                            <div {...provided.dragHandleProps} style={{ marginRight: '8px' }}>
                              <MenuOutlined style={{ color: '#999' }} />
                            </div>
                          )}
                          <Checkbox
                            checked={conf.visible}
                            onChange={() => toggleColumnVisibility(conf.key)}
                            disabled={conf.key === 'id'}
                          >
                            {baseColumns.find(col => col.key === conf.key)?.title}
                          </Checkbox>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        </Drawer>

        </>

  ):(

        <WelcomeScreenTab 
        setShowFilters={setShowFilters}
        />
  )}


      {selectedRowKeys.length > 0 && (
        <>
          
          <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)" }}>
            <Text >  { selectedRowKeys.length } 
               seleccionados</Text> 
               <Link  onClick={() => CleanSelected()}> eliminar selección</Link>
                {' - '}
               <Text > {totalHours} Horas
               </Text>  
           
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
                    onChange={(dates, dateStrings) => handleDateRangeChangeTable(dateStrings)}

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
            onClick={() => handleCancelTable()}
            tooltip="Cancelar"
          />

            
          
          
        </FloatButton.Group>
        </>
      )}
    </div>
  );
};

export default TaskTable;

