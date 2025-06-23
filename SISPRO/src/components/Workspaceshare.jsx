import React, { useState, useEffect } from 'react';
import { Avatar, Button, Modal, Form, Select, Space, Tooltip, message } from 'antd';
import { PlusOutlined, UserOutlined, CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';


const WorkspaceShare = React.memo ( ({
              IdWorkSpace
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
//     { 
//       id: 1, 
//       name: 'Usuario 1', 
//       role: 'editor',
//       avatarUrl: 'https://ejemplo.com/avatar1.jpg'
//     },
//     { 
//       id: 2, 
//       name: 'Usuario 2', 
//       role: 'viewer',
//       avatarUrl: 'https://ejemplo.com/avatar2.jpg'
//     }
//   ]);

//   const availableUsers = [
//     { 
//       id: 3, 
//       name: 'Ana García', 
//       department: 'Ventas',
//       avatarUrl: 'https://ejemplo.com/ana.jpg'
//     },
//     { 
//       id: 4, 
//       name: 'Carlos López', 
//       department: 'TI',
//       avatarUrl: 'https://ejemplo.com/carlos.jpg'
//     },
//     { 
//       id: 5, 
//       name: 'María Rodríguez', 
//       department: 'Marketing',
//       avatarUrl: 'https://ejemplo.com/maria.jpg'
//     },
//     { 
//       id: 6, 
//       name: 'Juan Pérez', 
//       department: 'Desarrollo',
//       avatarUrl: 'https://ejemplo.com/juan.jpg'
//     }
//   ];

  const [availableUsers, setAvailableUsers] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);

  const [localIdWorkSpace, setlocalIdWorkSpace] = useState(IdWorkSpace);
  const [form] = Form.useForm();


  useEffect(() => {
      fetchUsers()
      fetchSharedUsers();

  }, [localIdWorkSpace]);

  const fetchUsers = async () => {
    try {
      const response = await axios.post('/Workspace/CargaUsuariosTodos'); 
      if (response.data.Exito) {
        setAvailableUsers(jQuery.parseJSON(response.data.Users)); 
      } else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      message.error('No se pudo cargar información.' +  error);
    }
  };
  const fetchSharedUsers = async () => {
    try {
      const response = await axios.post('/Workspace/ConsultaUsuariosWS', {IdWorkSpace: localIdWorkSpace}); 
      if (response.data.Exito) {
        setSharedUsers(jQuery.parseJSON(response.data.Users)); 
      } else {
        message.error(response.data.Mensaje);
      }
    } catch (error) {
      message.error('No se pudo cargar información.' +  error);
    }
  };




  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleShare = async (values) => {
    try {

         const ws =  {
            IdWorkSpace: localIdWorkSpace,
            IdUsuario: values.IdUsuario
         }
        const response = await axios.post('/Workspace/GuardaWorkSpaceShare', {ws: ws}); 
        if (response.data.Exito) {
               
            if( response.data.IdWorkSpaceShare != 0){
                const selectedUser = availableUsers.find(user => user.IdCatalogo === values.IdUsuario);
                    if (selectedUser) {
                    const newUser = {
                        IdWorkSpaceShare: response.data.IdWorkSpaceShare,
                        IdUsuario: selectedUser.IdCatalogo,
                        Nombre: selectedUser.DescLarga,
                        NumEmpleado: selectedUser.DescCorta
                    };
                    setSharedUsers(prev => [...prev, newUser]);

            }

            
            }
            handleModalClose();

        } else {
          message.error(response.data.Mensaje);
        }
      } catch (error) {
        message.error('No se pudo cargar información.' +  error);
      }

  };

const handleRemoveUser = async (IdWorkSpaceShare) => {
    try {
  const selectedUser = sharedUsers.find(user => user.IdWorkSpaceShare === IdWorkSpaceShare);

   Modal.confirm({
      title: "¿Estás seguro de que deseas eliminar "+ selectedUser.Nombre  + "?",
      content: "El elemento no se podra recuperar.",
      okText: "Sí, Eliminar",
      cancelText: "No",
      onOk: async () => {
        const response = await axios.post('/Workspace/EliminaWorkSpaceShare', {IdWorkSpaceShare: IdWorkSpaceShare}); 
        if (response.data.Exito) {
            setSharedUsers(prev => prev.filter(user => user.IdWorkSpaceShare !== IdWorkSpaceShare));
        } else {
          message.error(response.data.Mensaje);
        }
        // Lógica para manejar la cancelación
      },
      onCancel: () => {
        
      },
    });


     
      } catch (error) {
        message.error('No se pudo cargar información.' +  error);
      }

  
  };

  const renderAvatars = () => {
    return sharedUsers.map(user => (
      <div key={user.IdUsuario} className="avatar-container" style={{ position: 'relative' }}>
        <Tooltip title={`${user.Nombre}`}>
          <Avatar
            src={"/Archivos/Fotos/" + user.NumEmpleado + ".jpg" || "./Archivos/Fotos/default.jpg"}
            icon={<UserOutlined />}
            alt={user.Nombre}
            fallback="/Archivos/Fotos/default.jpg"
          />
        </Tooltip>
        <Tooltip title="Eliminar usuario">
          <CloseCircleFilled
            className="remove-user-button delete-btn-tab"
         
            onClick={() => handleRemoveUser(user.IdWorkSpaceShare)}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              fontSize: '12px',
              color: '#a9aba9',
              backgroundColor: 'white',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 1,
            //   transition: 'all 0.3s',
              opacity: 0,
             transition: 'opacity 0.2s'
            }}
          />
        </Tooltip>
      </div>
    ));
  };



  return (
    <div className="workspace-share">
      <style>
        {`
          .avatar-container {
            margin-right: 8px;
          }
          .remove-user-button:hover {
            color: #ff7875;
            transform: scale(1.1);
          }
          .workspace-share {
            position: relative;
          }
        `}
      </style>
      <Space size={8} align="center">
        <div style={{ display: 'flex', gap: '4px' }}>
            <Avatar.Group>
            {renderAvatars()}
            </Avatar.Group>
         
        </div>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={handleModalOpen}
        >
        </Button>
      </Space>

      <Modal
        title="Compartir"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleShare}
          preserve={false}
        >
          <Form.Item
            name="IdUsuario"
            label="Usuario"
            rules={[{ required: true, message: 'Por favor seleccione un usuario' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar usuario"
              optionFilterProp="children"
              onChange={(value) => onChange?.(value)}
              filterOption={(input, option) =>
                option?.props?.children?.props?.children?.[1]
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
           {availableUsers.map((resource) => (
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
          </Form.Item>


          <Form.Item>
            <Space>
              <Button onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Compartir
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default WorkspaceShare;

