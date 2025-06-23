import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Dropdown, Space, Typography , Progress, message,Tooltip , Badge, Row,Col, Skeleton, Card } from 'antd';
import {
    PlusOutlined,
    CaretRightOutlined,
    HolderOutlined,
    FilterOutlined,
    SyncOutlined
  } from '@ant-design/icons';
import ButtonGroup from 'antd/es/button/button-group';
import axios from "axios";
import WelcomeScreenTab from './WelcomeTabScreen';
import FiltrosBL from './FiltrosBL';
const { Text, Link } = Typography;

const ITEM_TYPES_CONFIG = [
    { 
      key: 'epic',
      level: 1, 
      label: 'Épica', 
      image: '/Content/Project/Imagenes/epic.png'
    },
    { 
      key: 'feature',
      level: 2, 
      label: 'Feature', 
      image: '/Content/Project/Imagenes/feature.png'
    },
    { 
      key: 'user-story',
      level: 3, 
      label: 'Historia de Usuario', 
      image: '/Content/Project/Imagenes/hu.png'
    },
    { 
      key: 'task',
      level: 4, 
      label: 'Tarea', 
      image: '/Content/Project/Imagenes/task.png'
    },
    { 
      key: 'bug',
      level: 4, 
      label: 'Bug', 
      image: '/Content/Project/Imagenes/bug.png'
    },
    { 
      key: 'test-case',
      level: 4, 
      label: 'Caso de Prueba', 
      image: '/Content/Project/Imagenes/testcase.png'
    }
  ];
  

const BacklogTable = ({IdWorkSpaceTab}) => {

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filters, setFilters] = useState({ 
    Proyecto: null,
    Tipo: null,
  });
const [showFilters, setShowFilters] = useState(false);
const { Option } = Select;
const buildTreeFromFlatData = (flatData) => {
    const sortedFlatData = [...flatData].sort((a, b) => a.Orden - b.Orden);
    
    const treeMap = {};
    const tree = [];

    sortedFlatData.forEach(item => {
      treeMap[item.IdActividad] = {
        ...item,
        key: item.IdActividad.toString(),
        children: []
      };
    });

    sortedFlatData.forEach(item => {
      if (item.IdActividadRelacionada === null) {
        tree.push(treeMap[item.IdActividad]);
      } else {
        // Es un hijo
        const parent = treeMap[item.IdActividadRelacionada];
        if (parent) {
          parent.children.push(treeMap[item.IdActividad]);
          // Ordenamos los hijos por orden
          parent.children.sort((a, b) => a.Orden - b.Orden);
        }
      }
    });


    

    return tree;
 };

  //   {
  //     IdActividad: 1,
  //     IdActividadRelacionada: null,
  //     taskId: 'EPIC-001',
  //     type: 'epic',
  //     title: 'Sistema de Autenticación',
  //     status: 'in-progress',
  //     priority: 'high',
  //     assignee: 'Juan',
  //     dueDate: '2025-02-01',
  //     Orden: 1,
  //     Sprint : 'Sprint 1',
  //     TipoId : 2
  //   },
  //   {
  //     IdActividad: 4,
  //     IdActividadRelacionada: null,
  //     taskId: 'EPIC-002',
  //     type: 'epic',
  //     title: 'EPICA 2',
  //     status: 'in-progress',
  //     priority: 'high',
  //     assignee: 'Juan',
  //     dueDate: '2025-02-01',
  //     Orden: 2,
  //     Sprint : 'Sprint 1',
  //     TipoId : 2

  //   },
  //   {
  //     IdActividad: 2,
  //     IdActividadRelacionada: 1,
  //     taskId: 'HU-001',
  //     type: 'user-story',
  //     title: 'Login de Usuario',
  //     status: 'in-progress',
  //     priority: 'high',
  //     assignee: 'María',
  //     dueDate: '2025-01-20',
  //     Orden: 1,
  //     Sprint : 'Sprint 2',
  //     TipoId : 4
  //   },
  //   {
  //     IdActividad: 3,
  //     IdActividadRelacionada: 2,
  //     taskId: 'TASK-001',
  //     type: 'task',
  //     title: 'Implementar UI de login',
  //     status: 'completed',
  //     priority: 'medium',
  //     assignee: 'Pedro',
  //     dueDate: '2025-01-15',
  //     Orden: 1,
  //     Sprint : 'Sprint 3',
  //     TipoId : 1
  //   }
  // ]);

  const [flatData, setFlatData] = useState([]);
  const [items, setItems] = useState(() => buildTreeFromFlatData(flatData));
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [taskTypes, setTaskTypes] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [WorkSpaceTab, setWorkSpaceTab] = useState(0);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [draggingKey, setDraggingKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    fetchItemsTypes();

  }, []);

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

  const fetchItemsTypes = async () => {
    try {


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

  useEffect(() => {
    if (filters.Proyecto != null && filters.Tipo != null) {
      fetchBacklog(filters);
      const count = Object.values(filters).filter(value => 
        Array.isArray(value) ? value.length > 0 : value !== null
      ).length;
      setActiveFiltersCount(count);
    }
  }, [filters]);


  const fetchBacklog = async (filters) => {
    try {
      setIsLoading(true);
      const Filtros = {
        IdProyecto: filters.Proyecto,
        Tipo: filters.Tipo
      };

      const result = await axios.post("/Backlog/ConsultaBacklogWS", { 
        IdWorkSpaceTab: WorkSpaceTab, 
        Filtros 
      });

      if (result.data.Exito) {
        const Backlog = JSON.parse(result.data.Backlog);
        setFlatData(Backlog);
        setItems(buildTreeFromFlatData(JSON.parse(result.data.Backlog)));

      } else {
        message.error(result.data.Mensaje);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const RefreshBacklog = () => {
    fetchBacklog(filters);
  };


  const getItemLevel = (type) => {
    const itemConfig = taskTypes.find(item => item.ActividadTipoId === type);
    return itemConfig ? itemConfig.Jerarquia : 0;
  };

  const handleExpand = (expanded, record) => {
    const key = record.IdActividad.toString();
    if (expanded) {
      setExpandedKeys(prevKeys => {
        if (!prevKeys.includes(key)) {
          return [...prevKeys, key];
        }
        return prevKeys;
      });
    } else {
      setExpandedKeys(prevKeys => prevKeys.filter(k => k !== key));
    }
  };
  const isEditing = (record) => record.IdActividad.toString() === editingKey;

  const edit = (record) => {
    setEditingKey(record.IdActividad.toString());
  };

  const calculateBacklogOrder = (record) => {
    if (!record) return '';
    

    if (record.IdActividadRelacionada === null) {
      return record.backlogOrder?.toString() || '';
    }

    const parent = flatData.find(item => item.IdActividad === record.IdActividadRelacionada);
    const parentOrder = calculateBacklogOrder(parent);
    return parentOrder ? `${parentOrder}.${record.backlogOrder || ''}` : record.backlogOrder?.toString() || '';
  };

  const findPathAndParent = (items, key, parent = null) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.key === key) {
        return { path: [i], parent };
      }
      if (item.children) {
        const result = findPathAndParent(item.children, key, item);
        if (result) {
          return { path: [i, 'children', ...result.path], parent: result.parent };
        }
      }
    }
    return null;
  };


  const findPath = (items, key, path = []) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.key === key) {
        return [...path, i];
      }
      if (item.children) {
        const childPath = findPath(item.children, key, [...path, i, 'children']);
        if (childPath) return childPath;
      }
    }
    return null;
  };



  const onDragStart = (e, record) => {
    e.dataTransfer.setData('dragKey', record.IdActividad.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggingKey(record.IdActividad.toString());
  };


  const onDragEnd = () => {
    setDraggingKey(null);
    setDragOverKey(null);
  };

  const onDragEnter = (e, record) => {
    e.preventDefault();
    e.stopPropagation();
    if (record.IdActividad.toString() !== draggingKey) {
      setDragOverKey(record.IdActividad.toString());
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

const onDrop = (e, dropRecord) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    if (!draggingKey) {
      return;
    }

    const dragId = parseInt(draggingKey);
    const dragItem = flatData.find(item => item.IdActividad === dragId);
    
    if (!dragItem) {
      return;
    }

    if (dragId === dropRecord.IdActividad) {
      return;
    }
 
      const sourceParentId = dragItem.IdActividadRelacionada;
      const targetParentId = dropRecord.IdActividadRelacionada;
      const currentOrder = dragItem.Orden;
      const targetOrder = dropRecord.Orden;


      const newData = [...flatData];

      const changedItems = new Set(); 

      console.log(sourceParentId, targetParentId, dragId);

      // 1. Reordenar elementos en el grupo origen (si el elemento sale del grupo)
      if (sourceParentId !== targetParentId) {
        // Reordenar elementos en el grupo origen
        newData.forEach(item => {
          if (item.IdActividadRelacionada === sourceParentId && item.Orden > currentOrder) {
            item.Orden = item.Orden - 1;
            changedItems.add(item.IdActividad);
          }
        });
      }

      // 2. Reordenar elementos en el grupo destino
      newData.forEach(item => {
        if (item.IdActividadRelacionada === targetParentId) {
          if (item.Orden >= targetOrder && item.IdActividad !== dragId) {
            item.Orden = item.Orden + 1;
            changedItems.add(item.IdActividad);
          }
        }
      });

      // 3. Actualizar el elemento arrastrado
      const dragItemIndex = newData.findIndex(item => item.IdActividad === dragId);
      if (dragItemIndex !== -1) {
        newData[dragItemIndex] = {
          ...newData[dragItemIndex],
          IdActividadRelacionada: targetParentId,
          Orden: targetOrder
        };
        changedItems.add(dragId);
      }

      // 4. Normalizar órdenes en ambos grupos para evitar huecos
      const normalizeOrders = (items, parentId) => {
        const groupItems = items
          .filter(item => item.IdActividadRelacionada === parentId)
          .sort((a, b) => a.Orden - b.Orden);
        
        groupItems.forEach((item, index) => {
          const itemIndex = items.findIndex(x => x.IdActividad === item.IdActividad);
          if (itemIndex !== -1) {
            items[itemIndex] = { ...items[itemIndex], Orden: index + 1 };
          }
        });
      };

      // Normalizar órdenes en ambos grupos
      normalizeOrders(newData, sourceParentId);
      if (sourceParentId !== targetParentId) {
        normalizeOrders(newData, targetParentId);
      }


      const updates = Array.from(changedItems).map(itemId => {
        const item = newData.find(x => x.IdActividad === itemId);
        return {
          IdActividad: item.IdActividad,
          IdActividadRelacionada: item.IdActividadRelacionada,
          Orden: item.Orden
        };
      });

      // console.log(updates);
    ActualizaRelacionesBL (sourceParentId, targetParentId, dragId);
    ActualizarOrdenBL (updates);
    console.log('Actualizando estado con nuevo orden');
    setFlatData(newData);
    setItems(buildTreeFromFlatData(newData));
    setDraggingKey(null);
    setDragOverKey(null);

  } catch (error) {
    console.error('Error en onDrop:', error);
  } finally {
    setDraggingKey(null);
    setDragOverKey(null);
  }
};


const ActualizarOrdenBL = async (updates) => {
  try {
   
    const response = await axios.post('/Backlog/ActualizaOrdenBacklog', {
      LstUpdates: updates,
    });

    if (response.data.Exito) {

    }
    else {

        message.error(response.data.Mensaje);
    }

    
  } catch (error) {
    message.error('Error al actualizar:', error);
    throw error; // Re-lanzar el error para manejarlo en onDrop
  }
};
const ActualizaRelacionesBL = async (IdRelOrigen, IdRelDestino, IdActividad) => {
  try {
   
    const response = await axios.post('/Backlog/ActualizaRelacionesBacklog', {
      IdRelOrigen: IdRelOrigen,
      IdRelDestino: IdRelDestino,
      IdActividad: IdActividad
    });

    if (response.data.Exito) {

    }
    else {

        message.error(response.data.Mensaje);
    }

    
  } catch (error) {
    message.error('Error al actualizar:', error);
    throw error; // Re-lanzar el error para manejarlo en onDrop
  }
};

const save = async (IdActividad,  values) => {
  try {
    const response = await axios.post('/Board/ActualizaDatoActividad', {
      IdActividad: IdActividad,
      campo: "BR",
      dato1: values.BR
    });

    if (response.data.Exito) {

      const newFlatData = flatData.map(item => {
        if (item.IdActividad === IdActividad) {
          return { ...item, ...values };
        }
        return item;
      });
      
      setFlatData(newFlatData);
      setItems(buildTreeFromFlatData(newFlatData));
      setEditingKey('');
 
    } else {
      message.error(response.data.Mensaje);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    message.error('Failed to update task');
  }

};


const handleAddChild = (parentId, type) => {
 


  // Encontrar el último orden en el grupo de destino
  const siblings = flatData.filter(item => 
    item.IdActividadRelacionada === ( parentId == null ? parentId:  parseInt(parentId))
  );

  // Obtener el máximo orden actual en el grupo
  const maxOrder = siblings.length > 0 
    ? Math.max(...siblings.map(item => item.Orden || 0))
    : 0;

  // voy a guardar la actividad 


      const Act = {
        IdActividad: 0,
        IdActividadR1:  parentId == null ? parentId:  parseInt(parentId),
        BR: 'Nuevo elemento', 
        IdProyecto: filters.Proyecto,
        TipoId: filters.Tipo, 
        TipoId: type,
        Prioridad: maxOrder + 1 // Asignar siguiente orden
      };

      axios.post('/Workspace/GuardarActividadList', { A:Act})
      .then((response) => {
        if (response.data.Exito) {
        
      
          const newTask = typeof response.data.Actividad === "string" 
          ? JSON.parse(response.data.Actividad) 
          : response.data.Actividad;
          newTask.IdActividadRelacionada = parentId == null ? parentId:  parseInt(parentId);

          const NewId= newTask.IdActividad;
  // Crear una copia del array y agregar el nuevo elemento
  const newData = [...flatData, newTask];
  
  // Expandir toda la cadena de padres hasta la raíz
  const parentsToExpand = new Set(expandedKeys);
  let currentParentId = parentId;
  while (currentParentId) {
    parentsToExpand.add(currentParentId.toString());
    const parent = flatData.find(item => item.IdActividad === currentParentId);
    currentParentId = parent?.IdActividadRelacionada;
  }

  // Actualizar estados
  setFlatData(newData);
  setItems(buildTreeFromFlatData(newData));
  setExpandedKeys(Array.from(parentsToExpand));
  setEditingKey(NewId.toString());

  // Enfocar el input del título
  setTimeout(() => {
    const titleInput = document.querySelector(`input[data-id="${NewId}"]`);
    if (titleInput) {
      titleInput.focus();
    }
  }, 100);


   
      
        }
        else {
          message.error(response.data.Mensaje);
        }
      }).catch((error) => {
        console.error('Error al guardar la tarea:', error);
        message.error('No se pudo guardar la tarea.');
      }); 
}


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

 

const AddItemButton = ({ record, parentLevel }) => {
 

   const availableTypes = taskTypes.filter(item => item.Jerarquia > parentLevel );


 
    const menuItems = availableTypes.map(item => ({
      key: item.ActividadTipoId,
      icon: <img 
        src={`/Content/Project/Imagenes/${item.Url}`}
        alt={item.Nombre}
        style={{ width: '16px', height: '16px', marginRight: '8px' }}
      />,
      label: item.Nombre,
      onClick: () => handleAddChild(record?.IdActividad || null, item.ActividadTipoId)
    }));

    const menu = {
      items: menuItems
    };

    return availableTypes.length > 0 ? (
      <Dropdown menu={menu} trigger={['click']}>
        <Button 
          type={record ? "text" : "dashed"}
          icon={<PlusOutlined />}
          className={!record ? "mt-4" : ""}
        >
          {record ? "" : "Agregar"}
        </Button>
      </Dropdown>
    ) : null;
  };

const columns = [
    {
        title: '',
        key: 'sort',
        width: 30,
        render: (_, record) => {
            const level = getItemLevel(record.TipoId);
           

            const availableTypes = taskTypes.filter(item => item.Jerarquia > level );
            const canAddChildren =  availableTypes.length > 0  ? true : false;

          return (
            <Space  style={{ marginLeft: `${getIndentLevel(record)}px` }}>
             <Button 
                  type="text" 
                 icon={<HolderOutlined />} 
                  className="text-gray-400 cursor-move" 
               
                   title="Mover"
                 >
                 </Button>
              {canAddChildren && (
              <AddItemButton record={record} parentLevel={level} />
            )}


            </Space>
          );
        },
      },
      {
        title: 'Orden',
        dataIndex: 'Orden',
        width: 30,
        render: (text, record) => (
          <div style={{ marginLeft: `${getIndentLevel(record)}px` }}>
            {text}
          </div>
        ),
      },
    {
        title: 'ID',
        dataIndex: 'IdActividadStr',
        width: 100,
        onFilter: (value, record) => record.IdActividadStr === value,
        sorter: (a, b) => a.IdActividadStr.localeCompare(b.IdActividadStr),
        render: (text, record) => (
          <Link onClick={() => clickalerta(record.IdActividad)}>
            {text}
          </Link>
        ),
      },
    {
        title: 'Tipo',
        dataIndex: 'TipoNombre',
        width: 70,
        filters: taskTypes.map(type => ({ 
          text: type.Nombre, 
          value: type.ActividadTipoId 
        })),
        onFilter: (value, record) => record.TipoId === value,
        sorter: (a, b) => a.TipoNombre.localeCompare(b.TipoNombre),
        render: (type, record) => {
          
          return (
            <div>
                {type}
                
            </div>
          );
        },
      },
      
      {
        title: 'Título',
        dataIndex: 'BR',
   
        sorter: (a, b) => a.BR.localeCompare(b.BR),
        filterSearch: true,
        onFilter: (value, record) => record.BR.toLowerCase().includes(value.toLowerCase()),
        width: 350,
        render: (text, record) => {
          const editable = isEditing(record);
          const hasChildren = record.children && record.children.length > 0;
          const isExpanded = expandedKeys.includes(record.IdActividad.toString());
          const level = getItemLevel(record.type);
          const typeConfig = taskTypes.find(item => item.ActividadTipoId === record.TipoId);
          return (
            <div style={{ marginLeft: `${getIndentLevel(record)}px`, display: 'flex', alignItems: 'center' }}>
               <Space>
                <img 
                  src={`/Content/Project/Imagenes/${typeConfig?.Url}`}
                  alt={typeConfig?.Nombre}
                  style={{ width: '16px', height: '16px' }}
                />
              </Space>

              {hasChildren && (
                <CaretRightOutlined
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    color: '#999',
                    marginRight: '8px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand(!isExpanded, record);
                  }}
                />
              )}
              {editable ? (
                <Input
                  autoFocus
                  defaultValue={text}
                  placeholder="Ingrese el título"
                  data-id={record.IdActividad}
                  style={{ width: '100%', minWidth: '200px' }}
                  onPressEnter={(e) => {
                    if (e.target.value.trim()) {
                      save(record.IdActividad, { BR: e.target.value });
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value.trim() && e.target.value !== text) {
                      save(record.IdActividad, { BR: e.target.value });
                    }
                  }}
                />
              ) : (
                
                  <Typography.Text
                    style={{ cursor: 'pointer', flex: 1 }}
                    onClick={() => edit(record)}
                  >
                    {text}
                  </Typography.Text>
               
                
              )}
            </div>
          );
        },
      },
    {
      title: 'Estado',
      dataIndex: 'WorkFlow',
      width: 120,
      render: (text, record) => (
        <Badge 
                 color={record.ColorW} 
                 text={text} 
       />)
    },

    {
      title: 'Prioridad',
      dataIndex: 'PrioridadStr',
      width: 120,
    },
    {
      title: 'Asignado',
      dataIndex: 'AsignadoStr',
      width: 120,
      render: (text, record) => {
        return (
        <div >
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
        );
      }
    },
    {
      title: 'Sprint',
      dataIndex: 'Sprint',
      width: 120,
      filterSearch: true,
      onFilter: (value, record) => record.BR.toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => a.Sprint.localeCompare(b.Sprint),
    },
    {
      title: 'Progreso',
      key: 'progress',
      width: 130,
      render: (_, record) => {
        // if (record.Jerarquia > 3) {
        //   return null;
        // }
    
        const progressStatus = record.AvanceDependencia >=  100 ? 'success' : 
                                 record.AvanceDependencia > 0 ? 'active' : 'normal';
    
        return (
          <Progress 
            percent={record.AvanceDependencia} 
            size="small" 
            status={progressStatus}
            style={{ marginRight: 8, width: 100 }}
          />
        );
      },
    },

  ];

  const getIndentLevel = (record) => {
    let level = 0;
    let currentItem = record;

    // Recorrer hacia arriba la cadena de relaciones hasta llegar a la raíz
    while (currentItem.IdActividadRelacionada !== null) {
      level++;
      // Buscar el padre del elemento actual
      currentItem = flatData.find(item => item.IdActividad === currentItem.IdActividadRelacionada);
      if (!currentItem) break; // Por seguridad, en caso de no encontrar el padre
    }

    // Multiplicamos por 24px por cada nivel de indentación
    return level * 24;
  };




  const getAllTasks = (items) => {
    return items.reduce((acc, item) => {
      if (!item.children) {
        return [...acc, item];
      }
      return [...acc, ...getAllTasks(item.children)];
    }, []);
  }


  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };


  return (
    <>
        <FiltrosBL
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        setSelectedProject={setSelectedProject}
        setSelectedType={setSelectedType}
      />
      
      {filters.Proyecto ? (
    <div className="backlog-table">



    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <Space direction="horizontal" size={8}  style={{ width: '50%'}}>
        <AddItemButton parentLevel={0} /> 
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
                         onClick={RefreshBacklog}
                        style={{ fontSize: '16px', marginRight: '10px' }}
              />

              </ButtonGroup>


          </Space>

      </div>

      {isLoading ?(
            renderLoadingSkeleton(1)
      ):(
        <>
    <Table
      dataSource={items}
      columns={columns}
      pagination={false}
      rowClassName={(record) => {
        const classes = [`level-${record.type}`];
        if (record.IdActividad.toString() === dragOverKey) {
          classes.push('drop-target');
        }
        if (record.IdActividad.toString() === draggingKey) {
          classes.push('dragging');
        }
        if (dragOverKey && record.children?.some(child => child.key === dragOverKey)) {
          classes.push('parent-drop-target');
        }
        return classes.join(' ');
      }}
      expandable={{
        expandedRowKeys: expandedKeys,
        onExpand: handleExpand,
        showExpandColumn: false
      }}
      onRow={(record) => ({
        draggable: true,
        onDragStart: (e) => onDragStart(e, record),
        onDragOver: (e) => onDragOver(e, record),
        onDragEnter: (e) => onDragEnter(e, record),
        onDragEnd: onDragEnd,
        onDrop: (e) => onDrop(e, record)
      })}
    />
     <AddItemButton parentLevel={0} /> 
       </>

      )}
      </div>
      ): (

        <WelcomeScreenTab setShowFilters={setShowFilters} />


      )}

    <style jsx global>{`
        .editable-row td {
          padding: 8px 16px !important;
        }
        .level-epic {
          background: rgba(128, 0, 128, 0.02);
        }
        .level-user-story {
          background: rgba(0, 0, 255, 0.02);
        }
        .level-task {
          background: rgba(0, 255, 255, 0.02);
        }
        .drop-target {
          border: 2px dashed #1890ff !important;
          background-color: rgba(24, 144, 255, 0.05) !important;
        }
        .parent-drop-target {
          border-bottom: 2px dashed #1890ff !important;
        }
        .dragging {
          opacity: 0.5;
          background-color: #fafafa !important;
        }
        .ant-table-row-level-1 {
          padding-left: 24px;
        }
        .ant-table-row-level-2 {
          padding-left: 48px;
        }
      `}</style>


  </>
  );
};

export default BacklogTable;
