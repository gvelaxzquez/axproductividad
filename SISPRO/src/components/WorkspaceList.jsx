import React, { useState, useEffect } from 'react';
import { List, Button, Typography, Space, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


import axios from 'axios';

const { Title, Text } = Typography;
const WorkspaceList = () => {

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
        const response = await axios.post('/Workspace/ConsultaWorkspaceList'); 
        if (response.data.Exito) {
          setWorkspaces(jQuery.parseJSON(response.data.Lst));

        } else {
          message.error(response.data.Mensaje);
        }
     
    } catch (error) {
     
      message.error('No se pudieron cargar los workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = () => {
    window.location.href = '/workspace/W';
  };


  return (
    <div style={{ padding: 24 }}>
      {/* Header con botón de nuevo workspace */}
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={2}>Mis Workspaces</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateWorkspace}
        >
          Crear
        </Button>
      </Space>

      {/* Lista de workspaces
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={workspaces}
        renderItem={(workspace) => (
          <List.Item
            style={{ cursor: 'pointer' }}
            onClick={() => handleWorkspaceClick(workspace.IdUnique)}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span>{workspace.name}</span>
                  <Tag color={workspace.Propietario ? 'blue' : 'default'}>
                    {workspace.Propietario ? 'Propietario' : 'Compartido'}
                  </Tag>
                </Space>
              }
              description={workspace.Nombre}
        
            />
          </List.Item>
        )}
      /> */}

         <List
        loading={loading}
        itemLayout="vertical"
        size="large"
        dataSource={workspaces}
        renderItem={(workspace) => (
          <List.Item
            key={workspace.id}
            style={{ 
              cursor: 'pointer',
              background: '#fff',
              borderRadius: '8px',
              marginBottom: '16px',
              padding: '20px',
              border: '1px solid #f0f0f0'
            }}
            onClick={() => window.location.href = `/workspace/w/${workspace.IdUnique}`}

            extra={
              <div style={{ 
                fontSize: '16px',
                color: workspace.Propietario ? '#1890ff' : '#8c8c8c',
                fontWeight: 500
              }}>
                {workspace.Propietario ? 'Propietario' : 'Compartido'}
              </div>
            }
          >
            <List.Item.Meta
              title={<Title level={4} style={{ margin: 0 }}>{workspace.Nombre}</Title>}
              description={
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {workspace.Descripcion || 'Sin descripción'}
                </Text>
              }
            />
          </List.Item>
        )}
      />

    </div>
  );
};

export default WorkspaceList;