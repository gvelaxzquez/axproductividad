import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space,  Modal, Input, Spin, Slider, Alert, message, Row, Col, Skeleton } from 'antd';
import { PlusOutlined, SettingOutlined, EditOutlined, DeleteOutlined, FilterOutlined,ClearOutlined  , SyncOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import axios from 'axios';
import Filtros from './Filtros';
import PanelWidget from './PanelWidget';
import dayjs from 'dayjs';
import ButtonGroup from 'antd/es/button/button-group';

const EditableTitle = ({ title, onTitleChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleSave = () => {
    onTitleChange(tempTitle);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        value={tempTitle}
        onChange={e => setTempTitle(e.target.value)}
        onPressEnter={handleSave}
        onBlur={handleSave}
        autoFocus
        onClick={e => e.stopPropagation()}
        style={{ width: '200px' }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
      <span className="drag-handle" style={{ cursor: 'move', marginRight: '8px' }}>☰</span>
      <span>{title}</span>
      <EditOutlined 
        style={{ cursor: 'pointer' }} 
        onClick={() => setIsEditing(true)} 
      />
    </div>
  );
};

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Array de colores por defecto
  const defaultColors = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc'
  ];

  const initChart = () => {
    // Verificar si data existe y es un array
    if (chartRef.current && Array.isArray(data) && data.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      
      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;

      // Verificación segura de colores definidos
      const hasDefinedColors = Array.isArray(data) && data.some(item => item?.color);
      
      const option = {
        // legend: {
        //   top: 'bottom'
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        // Si ningún elemento tiene color definido, usamos el array de colores por defecto
        ...(hasDefinedColors ? {} : { color: defaultColors }),
        series: [{
          type: 'pie',
          radius: '50%',
          data: data.map((item, index) => ({
            ...item,
            // Solo agregamos itemStyle si el elemento tiene color definido
            ...(item?.color && {
              itemStyle: {
                color: item.color
              }
            })
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{b}: {c}'
          }
        }]
      };
      
      chart.setOption(option);
    }
  };

  useEffect(() => {
    initChart();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data]);

  useEffect(() => {
    const container = chartRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Si no hay datos, mostrar un mensaje o un estado vacío
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div 
        ref={chartRef}
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: 0,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: 0,
        flex: 1
      }} 
    />
  );
};

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const initChart = () => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      
      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '10%',
          right: '3%',
          left: '3%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data?.categories || [],
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data?.values || [],
          type: 'bar'
        }]
      };
      
      chart.setOption(option);
    }
  };

  useEffect(() => {
    initChart();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data]);

  useEffect(() => {
    const container = chartRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: 0,
        flex: 1
      }} 
    />
  );
};

const NumericIndicator = ({ data }) => (
  <div style={{ 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px'
  }}>
    <h1 style={{ margin: '16px 0' }}>{data?.value?.toString() || '0'}</h1>
  </div>
);

const PercentageIndicator = ({ data }) => (
  <div style={{ 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px'
  }}>
    <h3 style={{ margin: 0 }}>{data?.title || 'Porcentaje'}</h3>
    <h1 style={{ margin: '16px 0' }}>{data?.value || '0'}%</h1>
    {data?.change !== undefined && (
      <div style={{ 
        color: data.change >= 0 ? '#52c41a' : '#f5222d',
        fontSize: '16px'
      }}>
        {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change)}%
        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
          vs valor anterior: {data.previousValue}%
        </div>
      </div>
    )}
  </div>
);

const WidgetComponents = {
  'pie': PieChart,
  'bar': BarChart,
  'number': NumericIndicator,
  'percentage': PercentageIndicator
};


const PanelTab = ({ 
IdWorkSpaceTab

}) => {

   const [WorkSpaceTab, setWorkSpaceTab] = useState(0);
   const [layout, setLayout] = useState([]);
   const [widgets, setWidgets] = useState([]);
   
  const [nextId, setNextId] = useState(1);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [tempSize, setTempSize] = useState({ width: 6, height: 12 });
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [filters, setFilters] = useState({ 
      Proyecto:null,
      Tipo:null,
      Fechas:  [dayjs().subtract(1, "month"), dayjs()],
      LstSprints: [] ,
      LstAsignado: [] ,
      LstResponsable: [] ,
      LstTipoActividad: [] ,
      LstClasificacion: [] ,
      LstPrioridad: [] ,
      LstEstatusW: [] ,
      });

  const [showFilters, setShowFilters] = useState(false);
  const layoutInitializedRef = useRef(false);
  const dataLoadedRef = useRef(false);
  const [widgetTypes, setWidgetTypes] = useState([]);

const [isTypesLoading, setIsTypesLoading] = useState(true);
const [isDataLoading, setIsDataLoading] = useState(true);
const typesLoadedRef = useRef(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        if (newWidth !== containerWidth) {
          setContainerWidth(newWidth);
        }
      }
    };
  
    updateWidth();
    
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
  
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
  
    return () => resizeObserver.disconnect();
  }, []);
  

  useEffect(() => {
    if (layoutInitializedRef.current && !isLoading && widgets.length > 0) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [widgets, layout, isLoading]);

  //   if (containerRef.current) {
  //     const updateWidth = () => {
  //       const newWidth = containerRef.current.offsetWidth;
  //       setContainerWidth(newWidth);
  //     };
  
  //     updateWidth();
      
  //     const resizeObserver = new ResizeObserver(() => {
  //       updateWidth();
  //       window.dispatchEvent(new Event('resize'));
  //     });
  
  //     resizeObserver.observe(containerRef.current);
  //     return () => resizeObserver.disconnect();
  //   }
  // }, []);

  // const [isVisible, setIsVisible] = useState(true);
  // const observerRef = useRef(null);
  // const initialLoadRef = useRef(true);

  //   // Configurar el IntersectionObserver
  //   observerRef.current = new IntersectionObserver(
  //     (entries) => {
  //       const [entry] = entries;
  //       if (entry.isIntersecting) {
  //         console.log('Tab visible - recalculando grid');
  //         setIsVisible(true);
  //         // Recalcular dimensiones cuando el elemento se vuelve visible
  //         if (containerRef.current) {
  //           const newWidth = containerRef.current.offsetWidth;
  //           setContainerWidth(newWidth);
            
  //           // Reiniciar el grid
  //           setIsGridReady(false);
  //           setTimeout(() => {
  //             setIsGridReady(true);
  //             setTimeout(() => {
  //               window.dispatchEvent(new Event('resize'));
  //             }, 100);
  //           }, 50);
  //         }
  //       } else {
  //         setIsVisible(false);
  //       }
  //     },
  //     {
  //       threshold: 0.1 // 10% de visibilidad es suficiente para activar
  //     }
  //   );

  //   // Empezar a observar el contenedor
  //   if (containerRef.current) {
  //     observerRef.current.observe(containerRef.current);
  //   }

  //   return () => {
  //     if (observerRef.current) {
  //       observerRef.current.disconnect();
  //     }
  //   };
  // }, []);
  // useEffect(() => {
  //   if (initialLoadRef.current && containerRef.current) {
  //     const newWidth = containerRef.current.offsetWidth;
  //     setContainerWidth(newWidth);
  //     setIsGridReady(true);
  //     initialLoadRef.current = false;
  //   }
  // }, []);
  // useEffect(() => {
  //   if (!containerRef.current) return;

  //   const handleVisibilityChange = (entries) => {
  //     const [entry] = entries;
  //     const wasVisible = isVisible;
  //     const nowVisible = entry.isIntersecting;

  //     if (!wasVisible && nowVisible) {
  //       console.log('Tab se volvió visible');
  //       setIsVisible(true);
  //       setTimeout(() => {
  //         if (containerRef.current) {
  //           const newWidth = containerRef.current.offsetWidth;
  //           setContainerWidth(newWidth);
  //           window.dispatchEvent(new Event('resize'));
  //         }
  //       }, 100);
  //     }
  //   };

  //   observerRef.current = new IntersectionObserver(handleVisibilityChange, {
  //     threshold: [0, 0.1, 1],
  //     rootMargin: '0px'
  //   });

  //   observerRef.current.observe(containerRef.current);

  //   return () => {
  //     if (observerRef.current) {
  //       observerRef.current.disconnect();
  //     }
  //   };
  // }, [isVisible]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (containerRef.current && isVisible) {
  //       const newWidth = containerRef.current.offsetWidth;
  //       setContainerWidth(newWidth);
  //     }
  //   };

  //   const resizeObserver = new ResizeObserver(handleResize);

  //   if (containerRef.current) {
  //     resizeObserver.observe(containerRef.current);
  //   }

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     resizeObserver.disconnect();
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [isVisible]);

  // useEffect(() => {
  //   if (isVisible && isGridReady) {
  //     setTimeout(() => {
  //       window.dispatchEvent(new Event('resize'));
  //     }, 100);
  //   }
  // }, [widgets, isVisible, isGridReady]);
  useEffect(() => {
    fetchWidgets();
  }, []);
  useEffect(() => {
    if (!typesLoadedRef.current) return;
    if (!IdWorkSpaceTab) return;
    
    fetchDataFromTab(IdWorkSpaceTab);
  }, [IdWorkSpaceTab, typesLoadedRef.current]);


  const fetchDataFromTab = async (IdWorkSpaceTab) => {
    if (!IdWorkSpaceTab) return;
    if (!typesLoadedRef.current) return;
  
    setIsLoading(true);
    try {
      const response = await axios.post('/Workspace/ConsultaWorkspaceTab', { IdWorkSpaceTab });
  
      if (response.data.Exito) {
        const wst = JSON.parse(response.data.WorkSpaceTab);
        const savedWidgets = JSON.parse(wst.Widgets);
        const savedLayout = JSON.parse(wst.LayoutConfig);
        const savedNextId = wst.NextId;
  
        // Validar el layout
        const validatedLayout = savedLayout.map(item => ({
          ...item,
          w: Number(item.w) || 4,
          h: Number(item.h) || 8,
          x: Number(item.x) || 0,
          y: Number(item.y) || 0,
        }));
  
        const widgetsWithDataPromises = savedWidgets.map(async widget => {
          try {
            const data = await loadGraphicData(
              widget.type,
              widget.group,
              widget.filterConfig?.filters || null
            );
  
            return {
              ...widget,
              data,
              isLoading: false,
              error: null,
              lastUpdated: new Date().toLocaleString()
            };
          } catch (error) {
            console.error('Error loading widget data:', error);
            return {
              ...widget,
              data: null,
              isLoading: false,
              error: 'Error al cargar los datos',
              lastUpdated: new Date().toLocaleString()
            };
          }
        });
  
        // Esperar a que todos los widgets carguen sus datos
        const widgetsWithData = await Promise.all(widgetsWithDataPromises);
        
        setWidgets(widgetsWithData);
        setLayout(validatedLayout);
        setNextId(savedNextId);
        layoutInitializedRef.current = true;
  
      } else {
       
      }
    } catch (error) {
  
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWidgets =  async () => {

    try {
      const response = await axios.post('/Workspace/ConsultaWidgets');

      if (response.data.Exito) {

        const  widgets =  JSON.parse(response.data.Lst);
        setWidgetTypes(widgets);
        typesLoadedRef.current = true;

      } else {
        message.error('Error al cargar la el tab');
      }
    } catch (error) {
      // console.error('Error fetching filters:', error);
       message.error('Error al cargar la el tab');
      // setShowFilters(true);
    } 
  };

  const getWidgetComponent = (type) => {
    return WidgetComponents[type] || null;
  };


  const loadGraphicData= async (type, group, filters) => {
    switch (type) {
      case 'pie':
        try {
     
          if(filters) {

     

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
  
            const response = await axios.post("/Workspace/GraficaPie", { 
              Filtros: Filtros ,
              group:  group
            });
    
            // Asegurarnos de que tenemos datos válidos
            if (!response.data || !response.data.Datos) {
              throw new Error('No se recibieron datos válidos de la API');
            }
    
            // Parsear los datos
            const parsedData = JSON.parse(response.data.Datos);
        
            
            return parsedData;
  
          }
          else {

          return  null
          }

    
       } catch (error) {
    
       }
      case 'bar':
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        return {
          categories: months,
          values: months.map(() => Math.floor(Math.random() * 1000))
        };
      case 'number':
      if(filters) {



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


        if(group == "count")
        {
          const response = await axios.post("/Workspace/IndicadorConteo", { 
            Filtros: Filtros 
          });
  
          // Asegurarnos de que tenemos datos válidos
          if (!response.data || !response.data.Datos) {
            throw new Error('No se recibieron datos válidos de la API');
          }
  
          // Parsear los datos
          const Data = response.data.Datos;

          return {
            value: Data
          };
  

        }
        else {
          const response = await axios.post("/Workspace/IndicadorSuma", { 
            Filtros: Filtros,
            group: group
          });
  
          // Asegurarnos de que tenemos datos válidos
          if (!response.data || !response.data.Datos) {
            throw new Error('No se recibieron datos válidos de la API');
          }
  
          // Parsear los datos
          const Data = response.data.Datos;

          return {
            value: Data
          };
  

        }
 
      }
      else {

        return {
          value: Math.floor(Math.random() * 10000),
          title: 'Datos de ejemplo',
          change: Math.floor(Math.random() * 100) - 50
        };
      }
      case 'percentage':
        return {
          value: Math.floor(Math.random() * 100),
          title: 'Porcentaje de Conversión',
          previousValue: Math.floor(Math.random() * 100),
          change: Math.floor(Math.random() * 20) - 10
        };
      default:
        return null;
    }
  };

  const calculatePosition = () => {
    if (widgets.length === 0) return { x: 0, y: 0 };
    
    // Crear una matriz que represente el grid
    const grid = Array(50).fill().map(() => Array(12).fill(false));
    
    // Marcar las posiciones ocupadas
    layout.forEach(item => {
      for (let y = item.y; y < item.y + item.h; y++) {
        for (let x = item.x; x < item.x + item.w; x++) {
          if (grid[y] && x < 12) {
            grid[y][x] = true;
          }
        }
      }
    });
    
    // Buscar el primer espacio disponible para un widget de 6x12
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x <= 12 - 6; x++) {
        let spaceAvailable = true;
        
        // Verificar si hay espacio suficiente en esta posición
        for (let dy = 0; dy < 12 && spaceAvailable; dy++) {
          for (let dx = 0; dx < 6 && spaceAvailable; dx++) {
            if (grid[y + dy] && grid[y + dy][x + dx]) {
              spaceAvailable = false;
            }
          }
        }
        
        if (spaceAvailable) {
          return { x, y };
        }
      }
    }
    
    // Si no se encuentra espacio, colocar debajo de todo
    const maxY = Math.max(...layout.map(item => item.y + item.h));
    return { x: 0, y: maxY };
  };


  const addWidget = async (Id) => {
    const { x, y } = calculatePosition();
    const id = `widget-${nextId}`;
    
    const widget = widgetTypes.find(w => w.IdWidget === Id);
    const initialData = loadGraphicData(widget.type, widget.group, null);
  
    const newWidget = {
      id,
      type: widget.type,
      IdGraph: widget.IdWidget, 
      group: widget.group,
      title: widget.defaultTitle,
      data: initialData,
      isConfigured: true,
      lastUpdated: 'Datos de ejemplo',
      isDemo: true
    };
  

    const newLayoutItem = {
      i: id,
      x,
      y,
      w: 4,
      h: 9,
      isDraggable: true,
      isResizable: true  // Permitimos que sea redimensionable
    };
    
    // setWidgets([...widgets, newWidget]);
    // setLayout([...layout, newLayoutItem]);
    // setNextId(nextId + 1);
  
    // localStorage.setItem('dashboard_widgets', JSON.stringify([...widgets, newWidget]));
    // localStorage.setItem('dashboard_layout', JSON.stringify([...layout, newLayoutItem]));

    const updatedData = {
      widgets: [...widgets, newWidget],
      layout: [...layout, newLayoutItem],
      nextId: nextId + 1
    };
  
    try {
      await savePanelTabs(updatedData);
      setShowChartSelector(false);
    } catch (error) {
      // El error ya fue manejado en savePanelTabs
    }

   
 // Esperamos a que React procese las actualizaciones de estado
  // await new Promise(resolve => setTimeout(resolve, 0));
  // console.log(widgets);
  // console.log(layout);
  // // Ahora guardamos con los estados actualizados usando savePanelTabs
  // await savePanelTabs();

  };

  const removeWidget = async (id) => {
   
    const widgetToRemove = widgets.find(widget => widget.id === id);
    
    if (!widgetToRemove) {
      return;
    }
  
    Modal.confirm({
      title: `¿Estás seguro de que deseas eliminar ${widgetToRemove.title}?`,
      content: "El elemento no se podrá recuperar.",
      okText: "Sí, Eliminar",
      cancelText: "No",
      onOk: async () => {
        try {
          // Filtrar el widget específico
          const newWidgets = widgets.filter(widget => widget.id !== id);
          
          // Filtrar el layout correspondiente
          const newLayout = layout.filter(item => item.i !== id);
  

          
          const dataToSave = {
            widgets: newWidgets,
            layout: newLayout,
            nextId: nextId
          };
  
          await savePanelTabs(dataToSave);
          
 
        } catch (error) {
          message.error('Error al eliminar el widget');
        }
      }
    });
  };
  //   try {
  //     // Validar el layout
  //     const validatedLayout = newLayout.map(item => ({
  //       ...item,
  //       w: parseInt(item.w) || 6,
  //       h: parseInt(item.h) || 12,
  //       x: parseInt(item.x) || 0,
  //       y: parseInt(item.y) || 0,
  //       maxY: 100 // Permitir más espacio vertical
  //     }));
  
  //     // Actualizar los widgets con el nuevo layout
  //     const updatedWidgets = widgets.map(widget => {
  //       const layoutItem = validatedLayout.find(item => item.i === widget.id);
  //       return {
  //         ...widget,
  //         layout: layoutItem ? {
  //           w: layoutItem.w,
  //           h: layoutItem.h,
  //           x: layoutItem.x,
  //           y: layoutItem.y
  //         } : null
  //       };
  //     });
  
  //     // Preparar los datos para guardar
  //     const dataToSave = {
  //       widgets: updatedWidgets,
  //       layout: validatedLayout,
  //       nextId: nextId
  //     };
  
  //     // Guardar todos los cambios en una sola operación
  //     await savePanelTabs(dataToSave);
  
  //   } catch (error) {
  //     console.error('Error al actualizar el layout:', error);
  //     message.error('Error al guardar la disposición del panel');
  //   }
  // };
  const handleLayoutChange = async(newLayout) => {
    try {
      const validatedLayout = newLayout.map(item => ({
        ...item,
        w: parseInt(item.w) || 4,
        h: parseInt(item.h) || 8,
        x: parseInt(item.x) || 0,
        y: parseInt(item.y) || 0,
        maxY: 100
      }));

      const updatedWidgets = widgets.map(widget => {
        const layoutItem = validatedLayout.find(item => item.i === widget.id);
        return {
          ...widget,
          layout: layoutItem ? {
            w: layoutItem.w,
            h: layoutItem.h,
            x: layoutItem.x,
            y: layoutItem.y
          } : null
        };
      });

      const dataToSave = {
        widgets: updatedWidgets,
        layout: validatedLayout,
        nextId: nextId
      };

      await savePanelTabs(dataToSave);

      // Forzar actualización del grid después de guardar
      setTimeout(() => {
        const event = new Event('resize');
        window.dispatchEvent(event);
      }, 100);

    } catch (error) {
      message.error('Error al guardar la disposición del panel');
    }
  };

  
  const openFilterModal = (widget) => {
    setCurrentWidget(widget);
    if(widget.filters){
      const newFilters = {
        Proyecto: widget.filters.Proyecto,
        Tipo: widget.filters.Tipo,
        Fechas: widget.filters.Fechas 
          ? [dayjs(widget.filters.Fechas[0]), dayjs(widget.filters.Fechas[1])]
          : [dayjs().subtract(1, "month"), dayjs()],
        LstSprints: widget.filters.LstSprints || [],
        LstAsignado: widget.filters.LstAsignado || [],
        LstResponsable: widget.filters.LstResponsable || [],
        LstTipoActividad: widget.filters.LstTipoActividad || [],
        LstClasificacion: widget.filters.LstClasificacion || [],
        LstPrioridad: widget.filters.LstPrioridad || [],
        LstEstatusW: widget.filters.LstEstatusW || [],
      };
      setFilters(newFilters);
  
    }
    setTimeout(() => {
      setShowFilters(true);
    }, 30);

   
  };


  const openSizeConfigModal = (widget) => {
    const currentLayout = layout.find(item => item.i === widget.id);
    setTempSize({ width: currentLayout.w, height: currentLayout.h });
    setCurrentWidget(widget);
    setIsSizeModalVisible(true);
  };

  const handleSizeSubmit = async () => {
    const newLayout = layout.map(item => 
      item.i === currentWidget.id
        ? { ...item, w: tempSize.width, h: tempSize.height }
        : item
    );
    
    const dataToSave = {
      widgets: widgets,
      layout: newLayout,
      nextId: nextId
    };
  
    try {
      await savePanelTabs(dataToSave);
      setIsSizeModalVisible(false);
  
      setTimeout(() => {
        const event = new Event('resize');
        window.dispatchEvent(event);
      }, 100);
    } catch (error) {
      message.error('Error al actualizar el tamaño');
    }

    // setLayout(newLayout);
    // // localStorage.setItem('dashboard_layout', JSON.stringify(newLayout));
    
    // setIsSizeModalVisible(false);

    // setTimeout(async () => {
    //   const event = new Event('resize');
    //   window.dispatchEvent(event);
       
    //    await savePanelTabs();
      // Asegurarse de que los cambios se guarden
      // localStorage.setItem('dashboard_layout', JSON.stringify(newLayout));
    // }, 100);
  };

  const UpdateFiltersData = async() => {
    
    let dateRange;

    dateRange = [
      dayjs(filters.Fechas[0]),
      dayjs(filters.Fechas[1])
    ];

   filters.Fechas = dateRange;

    if(currentWidget){
      try {
     
        setWidgets(prevWidgets => 
          prevWidgets.map(widget => 
            widget.id === currentWidget.id 
              ? { ...widget, isLoading: true }
              : widget
          )
        );
    
      
        const newData =  await loadGraphicData(currentWidget.type,currentWidget.group,  filters);

        const updatedWidgets = widgets.map(widget =>
          widget.id === currentWidget.id
            ? {
                ...widget,
                data: newData,
                isConfigured: true,
                isLoading: false,
                lastUpdated: new Date().toLocaleString(),
                filters: filters,
                filterConfig: {
                  filters: filters,
                  lastUpdated: new Date().toISOString(),
                  isConfigured: true
                },
                isDemo: false
              }
            : widget
        );
    
        const dataToSave = {
          widgets: updatedWidgets,
          layout: layout,  
          nextId: nextId   
        };
    
        await savePanelTabs(dataToSave);

    
      } catch (error) {

        setWidgets(prevWidgets => 
          prevWidgets.map(widget => 
            widget.id === currentWidget.id 
              ? { 
                  ...widget, 
                  isLoading: false,
                  error: 'Error al cargar los datos'
                }
              : widget
          )
        );
    
        if (typeof message !== 'undefined') {
          message.error('Error al cargar los datos del gráfico');
        }
      }
     }

  } 
 
   useEffect(() => {

     UpdateFiltersData();

    }, [filters]);


    const loadWidgetWithSavedFilters = async (widget) => {
      if (!dataLoadedRef.current) return null;
      
      try {
        if (widget.filterConfig?.filters) {
          return await loadGraphicData(widget.type, widget.group, widget.filterConfig.filters);
        }
        return await loadGraphicData(widget.type, widget.group, null);
      } catch (error) {
        return null;
      }
    };
    
  const handleTitleChange = async (id, newTitle) => {
    const newWidgets = widgets.map(widget =>
      widget.id === id ? { ...widget, title: newTitle } : widget
    );
    const dataToSave = {
      widgets: newWidgets,
      layout: layout,
      nextId: nextId
    };
  
    try {
      await savePanelTabs(dataToSave);
    } catch (error) {
      message.error('Error al actualizar el título');
    }

    // setWidgets(newWidgets);

    // await savePanelTabs();
    // localStorage.setItem('dashboard_widgets', JSON.stringify(newWidgets));
  };

  const clearDashboard = async () => {

    Modal.confirm({
      title: "¿Estás seguro de que deseas todo el contenido del panel ?",
      content: "Los elementos no se podra recuperar.",
      okText: "Sí, Eliminar",
      cancelText: "No",
      onOk: async () => {
        const dataToSave = {
          widgets: [],
          layout: [],
          nextId: 1
        };
  
        try {
          await savePanelTabs(dataToSave);
        } catch (error) {
          message.error('Error al limpiar el panel');
        }
        // Lógica para manejar la cancelación
      },
      onCancel: () => {
        
      },
    });

  };

  const refreshAllWidgets = async () => {
    try {
      setWidgets(prevWidgets => 
        prevWidgets.map(w => ({ ...w, isLoading: true }))
      );
  
      const updatedWidgets = await Promise.all(
        widgets.map(async (widget) => {
          try {
            const newData = await loadGraphicData(
              widget.type,
              widget.group,
              widget.filterConfig?.filters || null
            );
  
            return {
              ...widget,
              data: newData,
              isLoading: false,
              lastUpdated: new Date().toLocaleString(),
              error: null
            };
          } catch (error) {
            return {
              ...widget,
              isLoading: false,
              error: 'Error al actualizar'
            };
          }
        })
      );
  
      setWidgets(updatedWidgets);
    } catch (error) {
  
    }
  };

  const refreshWidget = async (widgetId) => {
    try {
      const widget = widgets.find(w => w.id === widgetId);
      if (!widget) return;
  
      setWidgets(prevWidgets => 
        prevWidgets.map(w => 
          w.id === widgetId 
            ? { ...w, isLoading: true }
            : w
        )
      );
  
      const newData = await loadGraphicData(
        widget.type, 
        widget.group, 
        widget.filterConfig?.filters || null
      );
  
      setWidgets(prevWidgets => 
        prevWidgets.map(w => 
          w.id === widgetId 
            ? { 
                ...w, 
                data: newData,
                isLoading: false,
                lastUpdated: new Date().toLocaleString()
              }
            : w
        )
      );
    } catch (error) {
  
      setWidgets(prevWidgets => 
        prevWidgets.map(w => 
          w.id === widgetId 
            ? { ...w, isLoading: false, error: 'Error al actualizar' }
            : w
        )
      );
    }
  };
  
  const savePanelTabs = async (newData = null) => {
  
    try {

      const dataToSave = newData || {
        widgets: widgets,
        layout: layout,
        nextId: nextId
      };
  
      const result = await saveToAPI(
        dataToSave.widgets,
        dataToSave.layout,
        dataToSave.nextId,
        IdWorkSpaceTab
      );
  
      if (newData && result) {
        setWidgets(dataToSave.widgets);
        setLayout(dataToSave.layout);
        setNextId(dataToSave.nextId);
      }
  
      return result;
    } catch (error) {
      throw error;
    }

  };

  const saveToAPI = async (widgetsData, layoutData, nextIdValue, workspaceTabId) => {
    try {
      const wst = {
        IdWorkSpaceTab: workspaceTabId,
        Widgets: JSON.stringify(widgetsData),
        LayoutConfig: JSON.stringify(layoutData),
        NextId: nextIdValue
      };
  
      const response = await axios.post('/Workspace/ActualizaPanelWidgets', { wst });
      
      if (!response.data.Exito) {
        throw new Error('Error al guardar el estado del dashboard');
      }
      
      return response.data;
    } catch (error) {
 
      message.error('Error al guardar el estado del dashboard');
      throw error;
    }
  };

  const renderLoadingSkeleton = (columns = 6) => (
    <>
    <Row gutter={16}>
      {Array.from({ length: columns }).map((_, index) => (
        <Col key={index} span={24 / columns}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
      ))}
    </Row>
    <Row gutter={16}>
       {Array.from({ length: columns }).map((_, index) => (
         <Col key={index} span={24 / columns}>
           <Card>
             <Skeleton active />
           </Card>
         </Col>
       ))}
     </Row>
     </>
  );

  return (
    // (isLoading ?(

    //   renderLoadingSkeleton(3)
    // ):(

    

      <div ref={containerRef} style={{ padding: '0px',width: '100%' }}>
  
      
              <Space direction="horizontal"  size={0} style={{ width: '100%', justifyContent: 'flex-end' }}>
  
              <ButtonGroup>
                  <Button
                    type="text"
                    size='small'
                    icon={<PlusOutlined />}
                    onClick={() => setShowChartSelector(true)}
                    title="Agregar widget"
                    style={{ fontSize: '12px', marginRight: '10px' }}
                  />
  
  
  
              <Button
                  title='Actualizar'
                  type="text"
                   size='small'
                  icon={<SyncOutlined />}
                  onClick={refreshAllWidgets}
                  style={{ fontSize: '12px', marginRight: '10px' }}
                />
              <Button
                  title='Limpiar panel'
                  type="text"
                  size='small'
                  icon={<ClearOutlined />}
                  onClick={clearDashboard}
                  style={{ fontSize: '12px', marginRight: '10px' }}
                />
  
  
              </ButtonGroup>
              </Space>
  
              <div style={{
              width: '100%',
              minHeight: '800px',  
              position: 'relative',
              overflow: 'visible'  
              }}>
             
              <GridLayout
              className="layout layoutgridpanel"
              layout={layout}
              cols={12}
              rowHeight={30}
              width={containerWidth - 32}
              onLayoutChange={handleLayoutChange}
              draggableHandle=".drag-handle"
              style={{ width: '100%' }}
              margin={[16, 16]}
              containerPadding={[16, 16]}
              autoSize={false}
              maxRows={100}
              verticalCompact={false}    
              compactType={null}         
              preventCollision={true} 
              useCSSTransforms={true}
              isBounded={false}
              >
              {widgets.map((widget) => {
      

                const widgetType = widgetTypes.find(t => t.IdWidget === widget.IdGraph);
                if (!widgetType) {
                  console.error(`Widget type not found for ID: ${widget.IdGraph}`);
                  return null;
                }
          
                // Obtener el componente correspondiente
                const WidgetComponent = getWidgetComponent(widgetType.type);
                if (!WidgetComponent) {
                  console.error(`Component not found for type: ${widgetType.type}`);
                  return null;
                }
          

                return (
                  <div key={widget.id}>
                    <Card
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      bodyStyle={{
                        flex: 1,
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      title={
                        <EditableTitle
                          title={widget.title}
                          onTitleChange={(newTitle) => handleTitleChange(widget.id, newTitle)}
                        />
                      }
                      extra={
                        <Space>
                        <ButtonGroup>
                        <Button 
                                icon={<SyncOutlined />}
                                onClick={() => refreshWidget(widget.id)}
                                loading={widget.isLoading}
                              />
                          <Button 
                            icon={<FilterOutlined />} 
                            onClick={() => openFilterModal(widget)}
                          />
                          <Button 
                            icon={<SettingOutlined />}
                            onClick={() => openSizeConfigModal(widget)}
                          />
                          <Button 
                            onClick={() => removeWidget(widget.id)}
                            icon={<DeleteOutlined />}
                          />
                          </ButtonGroup>
                        </Space>
                      }
                    >
                      <div style={{ 
                        flex: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: 0
                      }}>
                        {widget.isLoading ? (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.8)'
                          }}>
                            <Spin size="large" />
                          </div>
                        ) : (
                          <>
                            <WidgetComponent data={widget.data} />
                            {widget.lastUpdated && (
                              <div style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                right: 0,
                                fontSize: '12px',
                                color: widget.isDemo ? '#ff4d4f' : '#8c8c8c',
                                padding: '4px'
                              }}>
                                {widget.isDemo && '⚠️ '}{widget.lastUpdated}
                              </div>
                            )}
                            {widget.isDemo && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  background: 'rgba(255, 255, 255, 0.9)',
                                  padding: '8px 16px',
                                  borderRadius: '4px',
                                  border: '1px solid #ff4d4f',
                                  color: '#ff4d4f',
                                  cursor: 'pointer',
                                  zIndex: 1
                                }}
                                onClick={() => openFilterModal(widget)}
                              >
                                Haga clic para configurar datos reales
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
              </GridLayout>
            
              </div>
        <Modal
          title="Configurar tamaño"
          open={isSizeModalVisible}
          onOk={handleSizeSubmit}
          onCancel={() => setIsSizeModalVisible(false)}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <div style={{ marginBottom: 8 }}>Ancho (1-12 columnas):</div>
              <Slider
                min={1}
                max={12}
                value={tempSize.width}
                onChange={value => setTempSize(prev => ({ ...prev, width: value }))}
                marks={{
                  1: '1',
                  3: '3',
                  6: '6',
                  9: '9',
                  12: '12'
                }}
              />
            </div>
            <div>
              <div style={{ marginBottom: 8 }}>Alto (unidades de grid):</div>
              <Slider
                min={4}
                max={20}
                value={tempSize.height}
                onChange={value => setTempSize(prev => ({ ...prev, height: value }))}
                marks={{
                  4: '4',
                  8: '8',
                  12: '12',
                  16: '16',
                  20: '20'
                }}
              />
            </div>
            <Alert
              message={`El widget ocupará ${tempSize.width} columnas de ancho y ${tempSize.height} unidades de alto.`}
              type="info"
              showIcon
            />
          </Space>
        </Modal>
        <PanelWidget
            visible={showChartSelector}
            onClose={() => setShowChartSelector(false)}
            onSelect={addWidget}
            widgetTypes={widgetTypes}
          />
  
  

    <Filtros
      isOpen={showFilters}
      onClose={() => setShowFilters(false)}
      filters={filters}
     // filters={currentWidget?.filters || {}}  // Añadimos un fallback
      setFilters={setFilters}
      setSelectedProject={setSelectedProject}
      setSelectedType={setSelectedType}
    />

      </div>
    

  );
};

export default PanelTab;
