
import React from 'react';
import { Typography,  Button } from 'antd';
const { Text } = Typography;
const WelcomeScreenTab = ({
                     setShowFilters

}) =>{ 
    
    
    return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '20px',
      textAlign: 'center'
    }}>

      
      
       <Text type="secondary" style={{ 
        fontSize: '16px',
        marginBottom: '24px',
        maxWidth: '600px'
      }}>
          Selecciona los filtros de información
      </Text> 

      <Button 
        type="primary"
        size="large"
        onClick={() => setShowFilters(true)}
      >
        Filtrar
      </Button>
    </div>
  )
};


  export default WelcomeScreenTab;