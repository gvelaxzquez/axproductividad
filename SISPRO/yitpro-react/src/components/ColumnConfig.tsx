import React, { useState, useEffect }  from 'react';
import { Drawer, Row, Col, Button, Card, Form, Input, Select, InputNumber, Badge,ColorPicker, message } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from "axios";

const { Option } = Select;

const ColumnConfig = ({
   columns,
   RefreshAll,
   isDrawerVisible,
   toggleDrawer,
   selectedProject,
   selectedType,
   tasks
}) => {


  const [localcolumns, setlocalColumns] = useState([]);

  useEffect(() => {
    setlocalColumns(columns);
  }, [columns]); 

 
  const handleColumnChange = (id, field, value) => {
    const updatedColumns = localcolumns.map((column) =>
      column.IdWorkFlow === id ? { ...column, [field]: value } : column
    );
    setlocalColumns(updatedColumns);
  };

  const handleAddColumn = () => {
     const newColumn = {
        IdWorkFlow: Date.now().toString(),
        Orden: localcolumns.length + 1,
        Nombre: 'Nueva columna',
        TipoNotificacion: 0,
        WIP: 0,
        EstatusR :'A',
        Editable: true,
        Color: '#360eb4', 
        ColorTexto: '#FFFFFF', 
      };
      setlocalColumns([...localcolumns, newColumn]);
    };
   const handleDragEndCols = (result) => {
      if (!result.destination) return;
    
      const updatedColumns = Array.from(localcolumns);
      const [movedColumn] = updatedColumns.splice(result.source.index, 1);
      updatedColumns.splice(result.destination.index, 0, movedColumn);
    
      // Actualizar los valores de Orden
      updatedColumns.forEach((column, index) => {
        column.Orden = index + 1; // Nuevo valor basado en la posición
      });
    
      setlocalColumns(updatedColumns);
    };

    const handleSaveColumns = async () => {
      try {
         const response = await axios.post('/Workspace/GuardarWorkflow', { IdProyecto: selectedProject, IdTipo:selectedType, Lst: localcolumns  });

        if (response.data.Exito) {
          message.success('Se ha actualizado la configuración');
          RefreshAll();


        } else {
          message.error(response.data.Mensaje);
        }
      } catch (error) {
  
        message.error('Hubo un error al guardar las columnas');
      }
    };
  
   const handleDeleteColumn =async (IdWorkFlow) => {

      const columnTasks = tasks.filter((task) => task.IdWorkFlow === IdWorkFlow);

      if(columnTasks.length >  0){
        message.warning('No se puede eliminar la columna ya que contiene tareas');
      }
      else {

        try {
          const response = await axios.post('/Workspace/EliminarWorkFlow', { IdWorkFlow: IdWorkFlow });
 
         if (response.data.Exito) {
           message.success('Se elimino la columna ');

           const updatedColumns = localcolumns.filter((col) => col.IdWorkFlow !== IdWorkFlow);
           setlocalColumns(updatedColumns);
          
           RefreshAll();
 
         } else {
           message.error(response.data.Mensaje);
         }
       } catch (error) {
        message.error('Hubo un error al guardar las columnas');
       }
      }
     
    };

  return (
    <Drawer
      title="Configuración de flujo de trabajo"
      placement="right"
      onClose={toggleDrawer}
      visible={isDrawerVisible}
      width={1200}
    >
      <Row justify="end" style={{ marginTop: '20px' }}>
        <Col>
          <Button type="default" onClick={handleSaveColumns}>
            Guardar
          </Button>
        </Col>
      </Row>

      <Button type="dashed" onClick={handleAddColumn} block style={{ margin: '10px' }}>
        + Agregar columna
      </Button>

      <DragDropContext onDragEnd={handleDragEndCols}>
        <Droppable direction="horizontal" droppableId="columns">
          {(provided) => (
            <Row gutter={8} {...provided.droppableProps} ref={provided.innerRef}>
              {localcolumns.map((column, index) => (
                <Draggable key={column.IdWorkFlow} draggableId={column.IdWorkFlow.toString()} index={index}>
                  {(provided) => (
                    <Col
                      span={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <h3
                        style={{
                          backgroundColor: column.Color,
                          padding: 5,
                          cursor: 'grab',
                          color: column.ColorTexto,
                          fontSize: '14px',
                          textAlign: 'left',
                        }}
                      >
                        {column.Nombre}
                      </h3>
                      <Card
                        style={{
                          borderRadius: '4px',
                          margin: '2px 0',
                          padding: '0px',
                          border: '1px solid #ddd',
                          fontSize: '12px',
                        }}
                      >
                        <Form layout="vertical">
                          <Form.Item label="Nombre">
                            <Input
                              value={column.Nombre}
                              maxLength={20}
                              onChange={(e) =>
                                handleColumnChange(column.IdWorkFlow, 'Nombre', e.target.value)
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Color de Fondo">
                            <ColorPicker
                              value={column.Color}
                              onChange={(color) =>
                                handleColumnChange(column.IdWorkFlow, 'Color', color.toHexString())
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Color de Letra">
                            <ColorPicker
                              value={column.ColorTexto}
                              onChange={(color) =>
                                handleColumnChange(column.IdWorkFlow, 'ColorTexto', color.toHexString())
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Estatus">
                            <Select
                              value={column.EstatusR}
                              onChange={(value) =>
                                handleColumnChange(column.IdWorkFlow, 'EstatusR', value)
                              }
                            >
                              <Option value="A" key="A">
                                <Badge color="#3fbae4" text="Abierto" />
                              </Option>
                              <Option value="P" key="P">
                                <Badge color="#ffCC00" text="En Progreso" />
                              </Option>
                              <Option value="R" key="R">
                                <Badge color="#ff9900" text="Revisión" />
                              </Option>
                              <Option value="L" key="L">
                                <Badge color="#08C127" text="Terminado" />
                              </Option>
                              <Option value="X" key="X">
                                <Badge color="#b64645" text="Rechazado" />
                              </Option>
                              <Option value="C" key="C">
                                <Badge color="#CCD0D9" text="Cancelado" />
                              </Option>
                            </Select>
                          </Form.Item>
                          <Form.Item label="Tipo de Notificación">
                            <Select
                              value={column.TipoNotificacion.toString()}
                              onChange={(value) =>
                                handleColumnChange(column.IdWorkFlow, 'TipoNotificacion', value)
                              }
                            >
                              <Option value="0">Ninguna</Option>
                              <Option value="1">Responsable</Option>
                              <Option value="2">Asignado</Option>
                              <Option value="3">Líder proyecto</Option>
                              <Option value="3">Todos</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item label="WIP">
                            <InputNumber
                              min={0}
                              max={10000}
                              value={column.WIP}
                              onChange={(value) =>
                                handleColumnChange(column.IdWorkFlow, 'WIP', value)
                              }
                            />
                          </Form.Item>
                        </Form>
                        <Button
                          type="primary"
                          danger
                          disabled={!column.Editable}
                          onClick={() => handleDeleteColumn(column.IdWorkFlow)}
                          style={{ marginTop: '10px' }}
                        >
                          Eliminar
                        </Button>
                      </Card>
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Row>
          )}
        </Droppable>
      </DragDropContext>
    </Drawer>
  );
};

export default ColumnConfig;