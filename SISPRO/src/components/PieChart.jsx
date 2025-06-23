import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';

const PieChart = () => {
  const data = [
    { name: 'Abierto', value: 58 },
    { name: 'Cancelado', value: 36 },
    { name: 'En progreso', value: 5 },
    { name: 'Liberado', value: 245 },
    { name: 'Rechazado', value: 0 },
    { name: 'Revisión', value: 148 },
    { name: 'Validado', value: 0 }
  ];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      formatter: (name) => {
        const item = data.find(d => d.name === name);
        return `${name} ${item.value}`;
      }
    },
    series: [
      {
        name: 'Tareas',
        type: 'pie',
        radius: '70%',
        center: ['40%', '50%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{c}'
        },
        color: [
          '#1890FF',  // Abierto
          '#D9D9D9',  // Cancelado
          '#FAAD14',  // En progreso
          '#52C41A',  // Liberado
          '#FF4D4F',  // Rechazado
          '#FA8C16',  // Revisión
          '#FAAD14'   // Validado
        ]
      }
    ]
  };

  const totalTareas = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card 
      title={`Tareas (${totalTareas})`}
      style={{ width: '100%', maxWidth: '800px' }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ height: '400px', width: '100%' }}>
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </Card>
  );
};

export default PieChart;