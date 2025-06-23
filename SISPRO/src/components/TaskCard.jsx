import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Typography, Badge, Input,DatePicker, InputNumber } from 'antd';
import { ClockCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from "axios";

const { Link } = Typography;
const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const TaskCard = ({ task, 
                     resources, 
                     priorities, 
                     sprints, 
                     Proyecto,
                    clickalerta, 
                    CapturaTrabajo, 
                    setTasks }) => {
const [editableFields, setEditableFields] = useState({});
const [collapsed, setCollapsed] = useState(true); // Estado para controlar el colapso
const [isHovered, setIsHovered] = useState(false); // Estado para controlar el hover de la tarjeta



// useEffect(() => {
//    fetchLists();
// }, []);



  const handleEditCard = (taskId, field) => {
    setEditableFields({ taskId, field });
  };


  const handleFieldChangeCard = (taskId, field, value) => {
    updateTaskFieldCard(taskId, field, value);
    setEditableFields({});
 };

 const handleDatesChangeCard = (taskId, field, value) => {
  if (value[0] && value[1]) {
    updateDatesFieldCard(taskId, field, value);
    setEditableFields({});

  }


};

const updateTaskFieldCard = async (taskId, field, value) => {
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
         ...(field === "Puntos" && { Puntos: value }),
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
const updateDatesFieldCard = async (taskId, field, value) => {
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

  return (
    <Card 
    style={{ 
        borderRadius: '4px', 
        margin: '2px 0', 
        padding: '0px', 
        border: '1px solid #ddd',
        backgroundColor: task.Prioridad === -99 ? '#d4f7d4' : '#ffffff',
        }}
        
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
  
        >

      <strong>
      <Badge color={task.ColorW} 
      style={{marginRight: '4px'}}
      />
        <Link
          style={{
            fontSize: '12px',
            marginBottom: '4px',
            color: 'rgba(0,0,0,0.8)',
            cursor: 'pointer',
          }}
          onClick={() => clickalerta(task.IdActividad)}
        >
          {task.IdActividadStr}
        </Link>
      </strong>

      <div
        style={{
          fontSize: '12px',
          marginBottom: '4px',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
          marginTop: '8px' 
        }}
      >
        {editableFields.taskId === task.IdActividad &&  editableFields.field === "BR" ? (
          <TextArea
            style={{fontSize: '12px'}}
            defaultValue={task.BR}
            onBlur={(e) => handleFieldChangeCard(task.IdActividad, "BR", e.target.value)}
            onPressEnter={(e) => handleFieldChangeCard(task.IdActividad, "BR", e.target.value)}
          />
        ) : (
          <div onClick={() => handleEditCard(task.IdActividad,'BR')}>📝 {task.BR}</div>
        )}
      </div>
      <div style={{ fontSize: '12px', marginBottom: '4px', marginTop: '8px'  }}>
                {editableFields.taskId === task.IdActividad && editableFields.field === "Puntos"  ? (
                  <Input
                    style={{fontSize: '12px'}}
                    defaultValue={task.Puntos}
                    onBlur={(e) => handleFieldChangeCard(task.IdActividad, "Puntos", e.target.value)}
                    onPressEnter={(e) => handleFieldChangeCard(task.IdActividad, "Puntos", e.target.value)}
                  />
                ) : (

                  (task.TipoId === 4 && (
                    <Badge
                      onClick={() => handleEditCard(task.IdActividad,'Puntos')}
                      count={`${task.Puntos} puntos`}
                      style={{
                        backgroundColor: '#1890ff',
                        fontSize: '12px',
                        marginBottom: '4px',
                        cursor: 'pointer', // Opcional: hace que parezca interactivo
                      }}
                    />
                  ))
                  
                )}
         </div>

      <div style={{ marginTop: '8px' }}>
      {editableFields.taskId === task.IdActividad && editableFields.field === "IdUsuarioAsignado" ? (
                                <Select
                                  autoFocus
                                  placeholder="Asignar a"

                                  value={task.IdUsuarioAsignado || undefined}
                                  onChange={(value) => handleFieldChangeCard(task.IdActividad, "IdUsuarioAsignado", value)}
                                  style={{ width: "100%" , fontSize: '12px'}}
                                >
                              {resources.map((resource) => (
                                <Select.Option key={resource.IdCatalogo} value={resource.IdCatalogo}>
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                                        <img
                                        src={"/Archivos/Fotos/" + resource.DescCorta + ".jpg" || "./Archivos/Fotos/default.jpg"}
                                        alt={resource.DescCorta}
                                        style={{ width: 18, height: 18, borderRadius: '50%', marginRight: 10 }}
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
            <Text 
            style={{ fontSize: '12px' }}
            onClick={() => handleEditCard(task.IdActividad, "IdUsuarioAsignado")}>
                  <img
                    src={"/Archivos/Fotos/" + task.ClaveUsuario + ".jpg" || "./Archivos/Fotos/default.jpg"}
                    alt={task.ClaveUsuario}
                    style={{ width: 18, height: 18, borderRadius: '50%', marginRight: 5 }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/Archivos/Fotos/default.jpg";
                    }}/>
              {task.AsignadoStr || "Sin asignar"}
            </Text>
          )}

        </div>


      {!collapsed && (
      <>



      <div style={{ fontSize: '12px', marginBottom: '4px',  marginTop: '8px'  }}>
      
        {editableFields.taskId === task.IdActividad && editableFields.field === "HorasAsignadas" ? (
          <InputNumber
            defaultValue={task.HorasAsignadas}
            style={{ width: "100%", fontSize: '12px' }}
            onBlur={(e) => handleFieldChangeCard(task.IdActividad, "HorasAsignadas", e.target.value)}
            onPressEnter={(e) => handleFieldChangeCard(task.IdActividad, "HorasAsignadas", e.target.value)}
          />
        ) : (
           <span onClick={() => handleEditCard(task.IdActividad,'HorasAsignadas')}> 🕒 {task.HorasAsignadas} horas</span>
        )}
      </div>
      <div style={{ fontSize: '12px', marginBottom: '4px', marginTop: '8px'  }}>
       
        {editableFields.taskId === task.IdActividad && editableFields.field === "Fechas" ? (
          <RangePicker
          //
          value={
            task.FechaInicio && task.FechaSolicitado
              ? [dayjs(task.FechaInicio), dayjs(task.FechaSolicitado)]
              : [dayjs(), dayjs()]
          }
          style={{ width: "100%", fontSize: '12px' }}
          // onBlur={(dates, dateStrings) =>  handleDatesChangeCard(task.IdActividad, "Fechas", dateStrings)}
          onChange={(dates, dateStrings) =>
            handleDatesChangeCard(task.IdActividad, "Fechas", dateStrings)
          }
          format="DD/MM/YYYY"
        />
        ) : (
          <span onClick={() => handleEditCard(task.IdActividad,'Fechas')}>
            📅 {task.FechaInicio && task.FechaSolicitado
                                    ? `${dayjs(task.FechaInicio).format("DD/MM/YYYY")} - ${dayjs(
                                        task.FechaSolicitado
                                      ).format("DD/MM/YYYY")}`
                                    : "Sin fecha"}
          </span>
        )}
      </div>
      <div style={{ fontSize: '12px', marginBottom: '4px', marginTop: '8px'  }}>
        {editableFields.taskId === task.IdActividad &&  editableFields.field === "IdIteracion" ? (

              <Select
              autoFocus
              placeholder="Sprint"
              value={task.IdIteracion || undefined}
              onChange={(value) => handleFieldChangeCard(task.IdActividad, "IdIteracion", value)}
              style={{ width: "75%", fontSize: '12px' }}
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

          <span onClick={() => handleEditCard(task.IdActividad,'IdIteracion')}>
            🚀 {task.Sprint ? task.Sprint : 'Sin sprint'}
          </span>
        )}
      </div>
     
        <div style={{ fontSize: '12px', marginBottom: '4px', marginTop: '8px'  }}>
        {editableFields.taskId === task.IdActividad &&  editableFields.field === "Prioridad" ? (
            <Select
            autoFocus
            placeholder="Prioridad"
            value={task.PrioridadStr || undefined}
            onChange={(value) => handleFieldChangeCard(task.IdActividad, "Prioridad", value)}
            style={{ width: "75%", fontSize: '12px' }}
          >
            {priorities.map((priority) => (
              <Select.Option key={priority.IdCatalogo} value={priority.IdCatalogo}>
                {priority.DescLarga}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <span onClick={() => handleEditCard(task.IdActividad,'Prioridad')}>
            📢 {task.PrioridadStr ? task.PrioridadStr : 'Sin prioridad'}
          </span>
        )}
      </div>

      </>

      )}

       {isHovered && (
        <Button
          type="default"
          size="small" 
          icon={
            collapsed ? (
              <DownOutlined style={{ fontSize: '8px' }} /> // Ajusta el tamaño del icono aquí
            ) : (
              <UpOutlined style={{ fontSize: '8px' }} /> // Ajusta el tamaño del icono aquí
            )
          }
          style={{
            fontSize: '4px',
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
          onClick={() => setCollapsed(!collapsed)}
        />
      )}

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 10,
          }}
        >
          <Button
            type="text"
            title='Capturar tiempo'
            icon={<ClockCircleOutlined />}
            style={{
              alignSelf: 'flex-end',
              marginTop: 'auto',
            }}
            onClick={() => CapturaTrabajo(task.IdActividad, task.PSP, '' +task.BR +'')}
          />
        </div>
      
    </Card>
  );
};

export default TaskCard;
