import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, Card, List, Avatar, Typography, Alert, Spin, Drawer, FloatButton } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined,   } from '@ant-design/icons';

const { Text } = Typography;

const ChatBotOpenAI = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
    if (!hasShownWelcome) {
      const welcomeMessage = {
        text: "¡Hola! Soy tu YITPRIN tu asistente virtual 🤖. Estoy aquí para ayudarte a encontrar información sobre tareas y proyectos. ¿En qué puedo ayudarte hoy?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
      setHasShownWelcome(true);
    }
  };



  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando mensaje:', inputMessage);
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Error en la respuesta del servidor');
      }

      // Agregar respuesta del bot
      const botMessage = {
        text: data.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <FloatButton
        icon={<RobotOutlined    style={{fontSize:'24px'}}/>}
        type="primary"
        style={{ right: 28, bottom: 20, width:'50px', height:'50px'}}
        onClick={handleDrawerOpen}
      />


      <Drawer
        title="🤖 YITPRIN"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={600}
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 55px)' 
          }
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          padding: '16px'
        }}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              closable
              onClose={() => setError(null)}
            />
          )}

          <List
            style={{
              flex: 1,
              overflow: 'auto',
              marginBottom: 16
            }}
            split={false}
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                style={{
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: message.isUser ? 'row-reverse' : 'row',
                  }}
                >

                 <Avatar
                    icon={message.isUser ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: message.isUser ? '#1890ff' : '#8f12ce',
                      margin: message.isUser ? '0 0 0 8px' : '0 8px 0 0',
                      width: '32px',  
                      height: '32px', 
                      minWidth: '32px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'  
                    }}
                  />

                  <div
                    style={{
                      background: message.isUser ? '#1890ff' : '#f0f2f5',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      color: message.isUser ? 'white' : 'black',
                      wordBreak: 'break-word'
                    }}
                  >
                    <Text style={{ color: message.isUser ? 'white' : 'rgba(0, 0, 0, 0.85)' }}>
                      {message.text}
                    </Text>
                    <div>
                      <Text type="secondary" style={{ 
                        fontSize: '12px', 
                        color: message.isUser ? 'rgba(255, 255, 255, 0.75)' : '' 
                      }}>
                        {message.timestamp}
                      </Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />

          <div style={{ 
            display: 'flex', 
            gap: 8,
            marginTop: 'auto',
            padding: '16px 0'
          }}>
            <Input.TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              style={{ height: 'auto' }}
            >
            </Button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', margin: '8px 0' }}>
              <Spin /> <Text type="secondary">El bot está escribiendo...</Text>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default ChatBotOpenAI;

