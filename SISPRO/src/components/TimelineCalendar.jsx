import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, Button, Badge, Space, Tooltip as AntTooltip, Typography } from 'antd';
import { FilterOutlined, SyncOutlined } from '@ant-design/icons';
import _ from 'lodash';

const { Text } = Typography;

const Timeline = ({ 
  tasks = [], 
  onRefresh, 
  onFilterClick, 
  groupBy, 
  onGroupByChange, 
  activeFiltersCount = 0 
}) => {
  // Procesamiento de datos para el gráfico
  const chartData = useMemo(() => {
    if (!tasks.length) return [];
    
    // Agrupar tareas según el criterio seleccionado
    const groupedTasks = _.groupBy(tasks, task => {
      switch (groupBy) {
        case 'historia':
          return task.HU || 'Sin HU';
        case 'sprint':
          return task.Sprint || 'Sin Sprint';
        case 'usuario':
          return task.AsignadoStr || 'Sin Asignar';
        case 'fase':
          return task.TipoActividadStr || 'Sin Fase';
        default:
          return 'Sin Grupo';
      }
    });

    // Convertir los grupos en datos para el gráfico
    return Object.entries(groupedTasks).map(([group, tasks]) => ({
      name: group,
      tasks: tasks.map(task => ({
        id: task.IdActividad,
        title: task.BR,
        start: new Date(task.FechaInicio).getTime(),
        end: new Date(task.FechaSolicitado).getTime(),
        color: task.ColorW || '#1890ff',
        textColor: task.ColorTexto || '#ffffff',
        estatus: task.Estatus
      }))
    }));
  }, [tasks, groupBy]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    
    const data = payload[0].payload;
    return (
      <div style={{ 
        backgroundColor: 'white', 
        padding: '12px', 
        border: '1px solid #f0f0f0',
        borderRadius: '2px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <Text strong>{data.name}</Text>
        <div style={{ marginTop: '8px' }}>
          {data.tasks.map(task => (
            <div
              key={task.id}
              style={{
                padding: '4px 8px',
                marginBottom: '4px',
                backgroundColor: task.color,
                color: task.textColor,
                borderRadius: '2px',
                textDecoration: task.estatus === 'L' ? 'line-through' : 'none'
              }}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header con controles */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Space>
          <Text strong>Agrupar por:</Text>
          <Select
            value={groupBy}
            onChange={onGroupByChange}
            style={{ width: 200 }}
            options={[
              { value: 'historia', label: 'Historia de Usuario' },
              { value: 'sprint', label: 'Sprint' },
              { value: 'usuario', label: 'Usuario' },
              { value: 'fase', label: 'Fase' }
            ]}
          />
        </Space>
        
        <Space>
          <AntTooltip title="Filtros">
            <Badge count={activeFiltersCount} offset={[-15, 0]}>
              <Button
                type="text"
                icon={<FilterOutlined />}
                onClick={onFilterClick}
              />
            </Badge>
          </AntTooltip>
          
          <Button
            type="text"
            icon={<SyncOutlined />}
            onClick={onRefresh}
          />
        </Space>
      </div>

      {/* Gráfico de línea temporal */}
      <div style={{ height: '600px', width: '100%' }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            barSize={20}
            margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={timestamp => new Date(timestamp).toLocaleDateString()}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="tasks"
              fill="#8884d8"
              shape={({ x, y, width, height, payload }) => {
                const tasks = payload.tasks || [];
                const minTime = Math.min(...tasks.map(t => t.start));
                const maxTime = Math.max(...tasks.map(t => t.end));
                const timeRange = maxTime - minTime;
                
                return (
                  <g>
                    {tasks.map((task, i) => {
                      const taskStart = (task.start - minTime) / timeRange * width + x;
                      const taskWidth = Math.max(
                        (task.end - task.start) / timeRange * width,
                        10 // Ancho mínimo para visibilidad
                      );
                      
                      return (
                        <rect
                          key={task.id}
                          x={taskStart}
                          y={y + (height / tasks.length) * i}
                          width={taskWidth}
                          height={height / tasks.length - 1}
                          fill={task.color}
                          rx={2}
                          ry={2}
                          style={{
                            cursor: 'pointer',
                            textDecoration: task.estatus === 'L' ? 'line-through' : 'none'
                          }}
                        />
                      );
                    })}
                  </g>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Timeline;