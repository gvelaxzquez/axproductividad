import React, { useState, useEffect } from 'react';
import { Button ,message ,  Modal, Space ,Dropdown, Menu, Typography} from 'antd';
import { MoreOutlined, PlusOutlined,UploadOutlined  } from '@ant-design/icons';
import * as AntdIcons from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from "axios";

import KanbanBoard from '../components/KanbanBoard';
import ButtonGroup from 'antd/es/button/button-group';
import TaskList from '../components/TaskList';
import Calendar from '../components/Calendar';
import TaskTable from '../components/TaskTable';
import Timeline from '../components/Timeline';
import PanelTab from '../components/PanelTab';
import CreateWorkspace from '../components/CreateWorkspace';
import Workspaceshare from '../components/Workspaceshare';
import TaskImport from '../components/TaskImport';
import BacklogTable from '../components/BacklogTable';
import Sprints from '../components/Sprints';
import Files from '../components/Files';

const { Title, Text } = Typography;
const styles = `
  .ant-tabs-tabpane {
    display: block !important;
    visibility: visible !important;
  }
  .ant-tabs-tabpane-hidden {
    display: block !important;
    visibility: visible !important;
  }
`;

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
    case "backlogtable":
        return AntdIcons.OrderedListOutlined;
    case "sprints":
          return AntdIcons.RedoOutlined;
    case "files":
          return AntdIcons.LinkOutlined;
    default:
      return null;
  }
};

// const getColorForTab = (type) => {
//   switch (type) {
//     case "kanban":
//       return  "#277da1";
//     case "list":
//       return "#ffba08";
//     case "table":
//       return "#390099";
//     case "calendar":
//       return "#6a994e";
//     case "timeline":
//         return "#ff0054";
//     case "charts":
//         return "#f3722c";
//     default:
//       return "#CCC";
//   }
// };

const getColorForTab = (type) => {
  switch (type) {
    case "kanban":
      return  "#000";
    case "list":
      return  "#000";
    case "table":
      return  "#000";
    case "calendar":
      return  "#000";
    case "timeline":
      return  "#000";
    case "charts":
      return  "#000";
    default:
      return  "#000";
  }
};



const SortableTab = ({ tab, isActive, onActivate, onRename, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tab.IdWorkSpaceTab.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    // backgroundColor: isActive ? '#e6f7ff' : 'transparent',
    borderBottom: isActive ? '2px solid #1890ff' : '1px solid #d9d9d9',
    padding: '4px 4px',
    margin: '0 4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none'
  };

  const Icon = tab.Tipo && getIconForTab(tab.Tipo);
  const color = tab.Tipo && getColorForTab(tab.Tipo);

  return (
    <div ref={setNodeRef} style={style} onClick={onActivate} {...attributes}>
      {Icon && <Icon style={{ marginRight: 8 , color: color}} />}
      <Text
        editable={{
          onChange: onRename,
          triggerType: ['text'],
          enterIcon: null
        }}
      >
        {tab.Nombre}
      </Text>
      {!tab.Defecto && (
             <Button
             type="text"
             icon={<AntdIcons.DeleteOutlined style={{ fontSize: '12px' }} />}
             onClick={(e) => {
               e.stopPropagation();
               onRemove();
             }}
             style={{ 
               padding: '0 4px',
               marginLeft: 8,
               height: '20px',
               minWidth: '20px',
               opacity: 0,
               transition: 'opacity 0.2s'
             }}
             className="delete-btn-tab"
           />
      )}
      <Button
        {...listeners}
        icon={<MoreOutlined />}
        type="text"
        style={{ cursor: 'move', padding: '0 4px' }}
      />
    </div>
  );
};

const WorkSpace = () => {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

    useEffect(() => {
        const path = window.location.pathname; // Obtiene todo el path
        const segments = path.split("/"); // Divide por "/"
        const id = segments[segments.length - 1]; // Último segmento

        if(id=== "w" || id === "W"){

            setIsModalOpen(true);
        }
        else {
          ConsultaWorkSpace(id);
        }
      }, []);
   useEffect(() => {
        // Inyectar estilos
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        
        return () => {
          document.head.removeChild(styleSheet);
        };
      }, [visibleTabItems]);

      useEffect(() => {
        if (WorkspaceInfo?.Nombre) {
          document.title =    ` YITPRO - ${WorkspaceInfo.Nombre}`;
        } else {
          document.title = 'Workspace';
        }
      }, [WorkspaceInfo]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTaskImportVisible, setModalTaskImportVisible] = useState(false);
  const [visibleTabItems, setVisibleTabItems] = useState([]);
  const [WorkspaceInfo, setWorkspaceInfo] = useState(null);
  const [AvailableTabs, setAvailableTabs] = useState(null);
  const [activeKey, setActiveKey] = useState("1");
  const [editingTabId, setEditingTabId] = useState(null);
 const CrearWorkSpace = async ( values) => {
      try {
        const res = await axios.post("/WorkSpace/CrearWorkSpace", values); 
        if (res.data.Exito) {
    
          var workspace = jQuery.parseJSON(res.data.WorkSpace);

          window.location.href = `/workspace/w/${workspace.IdUnique}`;
        } else {
          message.error(res.data.Mensaje);
        }
      } catch (error) {
 
        message.error('No se pudo crear el espacio de trabajo.');
      }
    };
 const ConsultaWorkSpace = async (Id) =>{
  try {
    const res =  await axios.post("/Workspace/ConsultaWorkspace", {Id:Id}); 
    if (res.data.Exito) {
      var workspace = jQuery.parseJSON(res.data.WorkSpace);
      document.title =    ` YITPRO - ${workspace.Nombre}`;

      setWorkspaceInfo(workspace);
      const sortedTabs = [...workspace.WorkSpaceTabs].sort((a, b) => a.Orden - b.Orden);
      setVisibleTabItems(sortedTabs);
      setAvailableTabs(jQuery.parseJSON(res.data.Views))

       handleTabChange(workspace.WorkSpaceTabs[0].IdWorkSpaceTab.toString());
    } else {
      message.error(res.data.Mensaje);
    }
  } catch (error) {
  
    message.error('No se pudo acceder al espacio de trabajo.');
  }

 }

  const handleRenameTab = async (tabKey, newName) => {
    try {

      const ws= {

         IdWorkSpaceTab: tabKey,
         Nombre : newName
      }
      const res =  await axios.post("/Workspace/ActualizaNombreTab", {ws:ws}); 
      if (res.data.Exito) {

        const updatedTabs = visibleTabItems.map(tab => 
          tab.IdWorkSpaceTab === tabKey ? { ...tab, Nombre: newName } : tab
        );
        setVisibleTabItems(updatedTabs);
        
        if (activeKey === tabKey) {
          setActiveKey(tabKey);
        }

      } else {
        message.error(res.data.Mensaje);
      }





    } catch (error) {
      message.error('Error updating workspace  tab  name:', error);

    }


  
  };

  useEffect(() => {
    if (visibleTabItems.length > 0 && !activeKey) {

      const sortedTabs = [...workspace.WorkSpaceTabs].sort((a, b) => a.Orden - b.Orden);
      setActiveKey(sortedTabs[0].IdWorkSpaceTab.toString());
    }

  }, [visibleTabItems]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setVisibleTabItems((items) => {
        const oldIndex = items.findIndex(
          (item) => item.IdWorkSpaceTab.toString() === active.id
        );
        const newIndex = items.findIndex(
          (item) => item.IdWorkSpaceTab.toString() === over.id
        );
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order in backend
        const Lst = newItems.map((item, index) => ({
          IdWorkSpaceTab: item.IdWorkSpaceTab,
          Orden: index + 1
        }));
        
        axios.post("/Workspace/ActualizarOrdenTabs", { Lst })
          .catch(error => {
        
            message.error('Error al actualizar el orden de las pestañas');
          });
        
        return newItems;
      });
    }
  };

  const handleCreateWorkspace = () => {
    window.location.href = '/workspace/W';
  };

  const handleRemoveTab = (tabKey,Nombre) => {

  
    if(visibleTabItems.length == 1){

      message.warning("No se puede eliminar, ya que el workspace debe de tener minimo un elemento");
      return;
    }


    Modal.confirm({
      title: "¿Estás seguro de que deseas eliminar "+ Nombre  + "?",
      content: "El elemento no se podra recuperar.",
      okText: "Sí, Eliminar",
      cancelText: "No",
      onOk: () => {
        EliminarTab(tabKey);
        // Lógica para manejar la cancelación
      },
      onCancel: () => {
        
      },
    });
  }

  const EliminarTab = async (IdWorkSpaceTab) => {
    try {

      const res =  await axios.post("/Workspace/EliminaTab", {IdWorkSpaceTab:IdWorkSpaceTab}); 
      if (res.data.Exito) {
        setVisibleTabItems(prev => prev.filter(tab => tab.IdWorkSpaceTab !== IdWorkSpaceTab));
        setActiveKey(visibleTabItems[0].IdWorkSpaceTab.toString())
      } else {
   
        message.error(res.data.Mensaje);
      }

    } catch (error) {
      //message.error('Error updating workspace name:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleEliminarWorkspace = () => {



    Modal.confirm({
      title: "¿Estás seguro de que deseas eliminar  el workspace "+ WorkspaceInfo.Nombre  + "?",
      content: "El elemento no se podra recuperar.",
      okText: "Sí, Eliminar",
      cancelText: "No",
      onOk: () => {
        EliminarWorkspace();
        // Lógica para manejar la cancelación
      },
      onCancel: () => {
        
      },
    });
  }

  const EliminarWorkspace = async () => {
    try {

      const res =  await axios.post("/Workspace/EliminaWorkspace", {IdWorkSpace:WorkspaceInfo.IdWorkSpace}); 
      if (res.data.Exito) {
        window.location.href = '/workspace';
        
      } else {
 
        message.error(res.data.Mensaje);
      }

    } catch (error) {
  //    message.error('Error updating workspace name:', error);
  
    }
  };


  const handleTabChange = (key) => {
    if (!editingTabId) {
      setActiveKey(key);
    }
  };
  const handleTabSelect = async (selectedTab) => {
    try {

    const wst= {

        IdWorkSpace: WorkspaceInfo.IdWorkSpace,
        IdView : selectedTab.IdView
     }

      const res =  await axios.post("/Workspace/AgregaNuevoTab", {wst:wst}); 
      if (res.data.Exito) {

        var workspacetab = jQuery.parseJSON(res.data.WorkSpaceTab);
        setVisibleTabItems(prev => [...prev, workspacetab]);

        setActiveKey(workspaceTab.IdWorkSpaceTab.toString());

  
      } else {
        message.error(res.data.Mensaje);
      }

    } catch (error) {
    //  message.error('Error updating workspace name:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }

  };


  //   // if (activeKey !== key) {
  //   //   return null; // No renderizar contenido si no coincide con el activeKey
  //   // }
    

  //   const content = {
  //     'kanban': <KanbanBoard IdWorkSpaceTab={key} />,
  //     'list': <TaskList />,
  //     'table': <TaskTable />,
  //     'calendar': <Calendar />,
  //     'timeline': <Timeline />,
  //     'charts': <TaskGraficas />
  //   }[type];

  //   return (
  //   <div style={{ display: activeKey === key ? 'block' : 'none' }}>
  //         <div style={{ display: activeKey === key ? 'block' : 'none' }}></div>
  //     {content}
  //   </div>
  // );
  // };

  const renderTabContent = (type, key) => {
    const components = {
      'kanban': KanbanBoard,
      'list': TaskList,
      'table': TaskTable,
      'calendar': Calendar,
      'timeline': Timeline,
      'charts': PanelTab,
      'backlogtable' : BacklogTable,
      'sprints' : Sprints,
      'files' : Files,
    };

    const Component = components[type];
    return Component ? <Component IdWorkSpaceTab={key} /> : null;
  };


  const TabsContainer = () => (
    <div className="tabs-container" style={{ display: 'flex', borderBottom: '1px solid #d9d9d9', padding: '0px' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleTabItems.map(item => item.IdWorkSpaceTab.toString())}
          strategy={horizontalListSortingStrategy}
        >
          {visibleTabItems.map((tab) => (
            <SortableTab
              key={tab.IdWorkSpaceTab}
              tab={tab}
              isActive={activeKey === tab.IdWorkSpaceTab.toString()}
              onActivate={() => handleTabChange(tab.IdWorkSpaceTab.toString())}
              onRename={(newName) => handleRenameTab(tab.IdWorkSpaceTab, newName)}
              onRemove={() => handleRemoveTab(tab.IdWorkSpaceTab, tab.Nombre)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Dropdown
        overlay={
          <Menu>
            {AvailableTabs?.map(tab => (

              <Menu.Item
                key={tab.IdView}
                onClick={() => handleTabSelect(tab)}
              >

               {getIconForTab(tab.Tipo) && React.createElement(getIconForTab(tab.Tipo),  { style: { color: getColorForTab(tab.Tipo) } })} 
                <span style={{ marginLeft: 8 }}>{tab.Nombre}</span>
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
    </div>
  );



  const handleWorkspaceNameChange = async (newName) => {
      try {
        // Llamada al API para actualizar el nombre
        const ws= {

           IdWorkSpace: WorkspaceInfo.IdWorkSpace,
           Nombre : newName
        }
        const res =  await axios.post("/Workspace/ActualizaNombreWS", {ws:ws}); 
        if (res.data.Exito) {
          setWorkspaceInfo({
            ...WorkspaceInfo,
            Nombre: newName
          });
        } else {
          message.error(res.data.Mensaje);
        }

      } catch (error) {
       // message.error('Error updating workspace name:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    };
  
  const WelcomeScreen = () => (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <img 
            src="/Content/Project/Imagenes/workspace.png" 
            alt="Workspace"
            style={{ 
              width: '200px',
              height: 'auto',
              marginBottom: '24px'
            }}
          />
        </div>
        
        <Title level={2} style={{ marginBottom: '16px' }}>
          Bienvenido a espacios de trabajo
        </Title>
        
        <Text type="secondary" style={{ 
          fontSize: '16px',
          marginBottom: '24px',
          maxWidth: '600px'
        }}>
          Crea tu espacio de trabajo para empezar a colaborar con tus proyectos y tu equipo
        </Text>
  
        <Button 
          type="primary"
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Crear
        </Button>
      </div>
    );


  const WorkspaceHeader = React.memo( () => (
        <Typography.Text
          style={{ 
            fontSize: '20px',
            fontWeight: 600,
            margin: 0,
            padding: '15px'
          }}
          editable={{
            tooltip: 'Click para editar',
            onChange: handleWorkspaceNameChange,
            triggerType: ['text'],
            enterIcon: null,
            maxLength: 50,
            autoSize: { maxRows: 1 },
            style:{ padding: '10px'}
          }}
        >
          {WorkspaceInfo?.Nombre || 'Loading...'}
        </Typography.Text>
  ));

  return (
    <div>
      <CreateWorkspace
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={CrearWorkSpace}
      />
    
    <TaskImport
        visible={isModalTaskImportVisible}
        onCancel={() => setModalTaskImportVisible(false)}

      />

      {visibleTabItems.length === 0 ? (
        <WelcomeScreen setIsModalOpen={setIsModalOpen} />
      ) : (
        <div style={{ width: '100%' , padding:'5px'}}>

      <div style={{ 
      // padding:'0px 8px 8px 8px',
      padding:'0px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
     <Space direction="horizontal" size={8} style={{ width: '50%' }}>
            <WorkspaceHeader
            WorkspaceInfo={WorkspaceInfo}
            onNameChange={handleWorkspaceNameChange}
          />
             <Workspaceshare
          IdWorkSpace={WorkspaceInfo.IdWorkSpace}
             />
    </Space>
   <Space direction="horizontal"  size={8} style={{ width: '50%', justifyContent: 'flex-end' }}>
   <ButtonGroup>

     <Button
             type="text"
             title='Crear'
             onClick={handleCreateWorkspace}
             icon={<AntdIcons.PlusOutlined />}
      />
       <Button
             type="text"
             title='Importar'
             onClick={() => setModalTaskImportVisible(true)}
             icon={<AntdIcons.UploadOutlined  />}
        />

         <Button
             type="text"
             title='Eliminar Workspace'
             onClick={handleEliminarWorkspace}
        icon={<AntdIcons.DeleteOutlined />}
 
      />
     </ButtonGroup>
   </Space>
 

      </div>
          <TabsContainer />
          <div className="tab-content" style={{ padding: '8px' }}>
            {visibleTabItems.map(item => (
             <div
             key={item.IdWorkSpaceTab}
             style={{
               display: activeKey === item.IdWorkSpaceTab.toString() ? 'block' : 'none',
               width: '100%',
               height: '100%'
             }}
           >
             <div style={{ visibility: activeKey === item.IdWorkSpaceTab.toString() ? 'visible' : 'hidden' }}>
               {renderTabContent(item.Tipo, item.IdWorkSpaceTab)}
             </div>
           </div>
            ))}
          </div>
        </div>
      )}
    </div>

  );

};

export default WorkSpace;
