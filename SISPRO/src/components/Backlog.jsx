import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Table, Button, Space, Avatar, Badge, Input, Tooltip } from 'antd';
import { 
  DragOutlined, 
  PlusOutlined, 
  FileTextOutlined,
  SaveOutlined,
  CloseOutlined,
  CaretRightOutlined
} from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';


const initialData = [
    {
      key: '1',
      order: 1,
      id: 'DENSO-NSR-158559',
      type: 'Epic',
      title: '1. Login',
      status: '',
      priority: 'BAJA',
      level: 0,
      assigned: {
        name: 'Cynthia Plata',
        avatar: '/api/placeholder/32/32'
      },
      sprint: 'Sprint 0 | Análisis',
      children: [
        {
          key: '1-1',
          order: 1,
          id: 'DENSO-NSR-158564',
          type: 'User Story',
          title: '1. Login',
          status: 'Liberada',
          priority: 'BAJA',
          level: 1,
          assigned: {
            name: 'Cynthia Plata',
            avatar: '/api/placeholder/32/32'
          },
          sprint: 'Sprint 0 | Análisis',
          children: [
            {
              key: '1-1-1',
              order: 1,
              id: 'DENSO-NSR-169759',
              type: 'Task',
              title: 'DESARROLLO | 1. LOGIN',
              status: 'Liberada',
              priority: 'BAJA',
              level: 2,
              assigned: {
                name: 'Gerardo Velazquez',
                avatar: '/api/placeholder/32/32'
              },
              sprint: 'Sprint 1'
            }
          ]
        }
      ]
    },
    {
      key: '2',
      order: 2,
      id: 'DENSO-NSR-158561',
      type: 'Epic',
      title: '2. Catálogo',
      status: '',
      priority: 'BAJA',
      level: 0,
      assigned: {
        name: 'Cynthia Plata',
        avatar: '/api/placeholder/32/32'
      },
      sprint: 'Sprint 0 | Análisis',
      children: []
    }
  ];


const DraggableBodyRow = ({
    record,
    index,
    moveRow,
    className,
    style,
    ...restProps
  }) => {
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: 'row',
      collect: (monitor) => {
        const { dragRecord } = monitor.getItem() || {};
        if (dragRecord?.key === record.key) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragRecord?.type === record.type ? 'drop-over' : 'drop-over-disabled'
        };
      },
      canDrop: (item) => {
        // Solo permitir drop en elementos del mismo tipo y mismo nivel
        return item.dragRecord.type === record.type && 
               item.dragRecord.parentKey === record.parentKey;
      },
      drop: (item) => {
        moveRow(item.dragRecord, record);
      },
    });
  
    const [{ isDragging }, drag] = useDrag({
      type: 'row',
      item: { 
        dragRecord: record,
        index
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const rowStyles = {
      cursor: 'move',
      opacity: isDragging ? 0.5 : 1,
      backgroundColor: isOver ? '#f0f0f0' : 'inherit',
      ...style,
    };
  
    return (
      <tr
        ref={node => drag(drop(node))}
        className={`${className} ${isOver ? dropClassName : ''}`}
        style={rowStyles}
        {...restProps}
      />
    );
  };


const getTypeIcon = (type) => {
  switch (type) {
    case 'Epic':
      return <DragOutlined style={{ color: '#FFB200' }} />;
    case 'User Story':
      return <FileTextOutlined style={{ color: '#1890ff' }} />;
    case 'Task':
      return <FileTextOutlined style={{ color: '#52c41a' }} />;
    default:
      return null;
  }
};

const Backlog = () => {
  const [hierarchicalData, setHierarchicalData] = useState(initialData);

  const [expandedKeys, setExpandedKeys] = useState([]);

  const [editingKey, setEditingKey] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const inputRef = useRef(null);
//   const flatData = useMemo(() => {
//     const flatten = (items, parentKey = null, level = 0) => {
//       return items.reduce((acc, item, index) => {
//         const flatItem = {
//           ...item,
//           parentKey,
//           level,
//           tableKey: item.key,
//           children: item.children?.length > 0 ? [] : undefined // Mantener children vacío pero existente si hay hijos
//         };
//         acc.push(flatItem);
//         if (item.children?.length > 0) {
//           acc.push(...flatten(item.children, item.key, level + 1));
//         }
//         return acc;
//       }, []);
//     };
//     return flatten(hierarchicalData);
//   }, [hierarchicalData]);

const [data, setData] = useState(initialData);


// const transformDataWithAddRows = (items) => {
//     const transformItems = (itemsArray, parentType = null) => {
//       const result = [];
//       itemsArray.forEach(item => {
//         // Agregar el item original
//         result.push(item);
        
//         // Si tiene hijos, procesarlos recursivamente
//         if (item.children?.length > 0) {
//           item.children = transformItems(item.children, item.type);
//         }

//         // Si el tipo puede tener hijos, agregar fila "Agregar"
//         if (canAddChildren(item.type)) {
//           const addRow = {
//             key: `add-${item.key}`,
//             isAddRow: true,
//             parentKey: item.key,
//             parentType: item.type,
//             level: item.level + 1,
//             children: []
//           };
//           if (!item.children) {
//             item.children = [addRow];
//           } else {
//             item.children.push(addRow);
//           }
//         }
//       });

//       // Agregar fila "Agregar" al final del nivel actual
//       if (parentType) {
//         const nextType = getNextType(parentType);
//         if (nextType) {
//           result.push({
//             key: `add-${parentType}-${result.length}`,
//             isAddRow: true,
//             parentType,
//             level: result[0]?.level || 0,
//             children: []
//           });
//         }
//       }

//       return result;
//     };

// const transformedData = transformItems(items);
// // Agregar fila "Agregar Epic" al final del nivel raíz
// transformedData.push({
//   key: 'add-root',
//   isAddRow: true,
//   parentType: null,
//   level: 0,
//   children: []
// });

// return transformedData;
// };

// const transformDataWithAddRows = (items) => {
//     const transformItems = (itemsArray, parentType = null) => {
//       const result = [];
//       itemsArray.forEach(item => {
//         // Agregar el item original
//         result.push(item);
        
//         // Si tiene hijos, procesarlos recursivamente
//         if (item.children?.length > 0) {
//           item.children = transformItems(item.children, item.type);
//         }

//         // Si el tipo puede tener hijos, agregar fila "Agregar"
//         if (canAddChildren(item.type)) {
//           const addRow = {
//             key: `add-${item.key}`,
//             isAddRow: true,
//             parentKey: item.key,
//             parentType: item.type,
//             level: item.level + 1,
//             children: []
//           };
//           if (!item.children) {
//             item.children = [addRow];
//           } else {
//             item.children.push(addRow);
//           }
//         }
//       });

//       // Agregar fila "Agregar" al final del nivel actual
//       if (parentType) {
//         const nextType = getNextType(parentType);
//         if (nextType) {
//           result.push({
//             key: `add-${parentType}-${result.length}`,
//             isAddRow: true,
//             parentType,
//             level: result[0]?.level || 0,
//             children: []
//           });
//         }
//       }

//       return result;
//     };

//     const transformedData = transformItems(items);
//     // Agregar fila "Agregar Epic" al final del nivel raíz
//     transformedData.push({
//       key: 'add-root',
//       isAddRow: true,
//       parentType: null,
//       level: 0,
//       children: []
//     });

//     return transformedData;
//   };


// const transformDataWithAddRows = (items) => {
//     const transformItems = (itemsArray, parentType = null) => {
//       const result = [];
//       itemsArray.forEach(item => {
//         // Agregar el item original
//         result.push(item);
        
//         // Si tiene hijos, procesarlos recursivamente
//         if (item.children?.length > 0) {
//           item.children = transformItems(item.children, item.type);
//         }

//         // Si el tipo puede tener hijos, agregar fila "Agregar"
//         if (canAddChildren(item.type)) {
//           const addRow = {
//             key: `add-${item.key}`,
//             isAddRow: true,
//             parentKey: item.key,
//             parentType: item.type,
//             level: item.level + 1,
//             children: []
//           };
//           if (!item.children) {
//             item.children = [addRow];
//           } else {
//             item.children.push(addRow);
//           }
//         }
//       });

//       // Agregar fila "Agregar" al final del nivel actual
//       if (parentType) {
//         const nextType = getNextType(parentType);
//         if (nextType) {
//           result.push({
//             key: `add-${parentType}-${result.length}`,
//             isAddRow: true,
//             parentType,
//             level: result[0]?.level || 0,
//             children: []
//           });
//         }
//       }

//       return result;
//     };

//     const transformedData = transformItems(items);
//     // Agregar fila "Agregar Epic" al final del nivel raíz
//     transformedData.push({
//       key: 'add-root',
//       isAddRow: true,
//       parentType: null,
//       level: 0,
//       children: []
//     });

//     return transformedData;
//   };


//   const handleAddItem = (addRow) => {
//     const type = addRow.parentType === null ? 'Epic' : getNextType(addRow.parentType);
//     const newId = Date.now().toString();
//     const newItem = {
//       key: `new-${newId}`,
//       order: data.length + 1,
//       id: `DENSO-NSR-${newId}`,
//       type,
//       title: `New ${type}`,
//       status: '',
//       priority: 'BAJA',
//       level: addRow.level,
//       assigned: {
//         name: 'Unassigned',
//         avatar: '/api/placeholder/32/32'
//       },
//       sprint: 'Unassigned',
//       children: []
//     };

//     setData(prevData => {
//       const addItemToData = (items, parentKey = null) => {
//         if (!parentKey) {
//           return [...items, newItem];
//         }

//         return items.map(item => {
//           if (item.key === parentKey) {
//             return {
//               ...item,
//               children: [...(item.children || []).filter(child => !child.isAddRow), newItem]
//             };
//           }
//           if (item.children) {
//             return {
//               ...item,
//               children: addItemToData(item.children, parentKey)
//             };
//           }
//           return item;
//         });
//       };

//       return addItemToData(prevData, addRow.parentKey);
//     });
//   };

// const handleAddItem = (addRow) => {
//     const type = addRow.parentType === null ? 'Epic' : getNextType(addRow.parentType);
//     const newId = Date.now().toString();
//     const newItem = {
//       key: `new-${newId}`,
//       order: data.length + 1,
//       id: `DENSO-NSR-${newId}`,
//       type,
//       title: `New ${type}`,
//       status: '',
//       priority: 'BAJA',
//       level: addRow.level,
//       assigned: {
//         name: 'Unassigned',
//         avatar: '/api/placeholder/32/32'
//       },
//       sprint: 'Unassigned',
//       children: []
//     };

//     setData(prevData => {
//       const addItemToData = (items, parentKey = null) => {
//         if (!parentKey) {
//           return [...items, newItem];
//         }

//         return items.map(item => {
//           if (item.key === parentKey) {
//             return {
//               ...item,
//               children: [...(item.children || []).filter(child => !child.isAddRow), newItem]
//             };
//           }
//           if (item.children) {
//             return {
//               ...item,
//               children: addItemToData(item.children, parentKey)
//             };
//           }
//           return item;
//         });
//       };

//       return addItemToData(prevData, addRow.parentKey);
//     });
//   };

// const moveRow = useCallback((dragRecord, hoverRecord) => {
//     setData(prevData => {
//       const newData = [...prevData];
      
//       // Función para encontrar y remover un item
//       const findAndRemove = (items, key) => {
//         for (let i = 0; i < items.length; i++) {
//           if (items[i].key === key) {
//             return items.splice(i, 1)[0];
//           }
//           if (items[i].children?.length) {
//             const found = findAndRemove(items[i].children, key);
//             if (found) return found;
//           }
//         }
//         return null;
//       };

//       // Función para insertar un item
//       const findAndInsert = (items, targetKey, itemToInsert) => {
//         for (let i = 0; i < items.length; i++) {
//           if (items[i].key === targetKey) {
//             items.splice(i, 0, itemToInsert);
//             return true;
//           }
//           if (items[i].children?.length) {
//             if (findAndInsert(items[i].children, targetKey, itemToInsert)) {
//               return true;
//             }
//           }
//         }
//         return false;
//       };

//       const itemToMove = findAndRemove(newData, dragRecord.key);
//       if (itemToMove) {
//         findAndInsert(newData, hoverRecord.key, itemToMove);
//       }

//       return newData;
//     });
//   }, []);
// const moveRow = useCallback((dragRecord, hoverRecord) => {
//     setData(prevData => {
//       const newData = [...prevData];
      
//       const findAndRemove = (items, key) => {
//         for (let i = 0; i < items.length; i++) {
//           if (items[i].key === key) {
//             return items.splice(i, 1)[0];
//           }
//           if (items[i].children?.length) {
//             const found = findAndRemove(items[i].children, key);
//             if (found) return found;
//           }
//         }
//         return null;
//       };

//       const findAndInsert = (items, targetKey, itemToInsert) => {
//         for (let i = 0; i < items.length; i++) {
//           if (items[i].key === targetKey) {
//             items.splice(i, 0, itemToInsert);
//             return true;
//           }
//           if (items[i].children?.length) {
//             if (findAndInsert(items[i].children, targetKey, itemToInsert)) {
//               return true;
//             }
//           }
//         }
//         return false;
//       };

//       const itemToMove = findAndRemove(newData, dragRecord.key);
//       if (itemToMove) {
//         findAndInsert(newData, hoverRecord.key, itemToMove);
//       }

//       // Actualizar órdenes después del movimiento
//       return updateOrders(newData);
//     });
//   }, []);

const transformDataWithAddRows = (items) => {
    const transformItems = (itemsArray, parentType = null) => {
      const result = [];
      itemsArray.forEach(item => {
        // Agregar el item original
        result.push(item);
        
        // Si tiene hijos, procesarlos recursivamente
        if (item.children?.length > 0) {
          item.children = transformItems(item.children, item.type);
        }

        // Si el tipo puede tener hijos, agregar fila "Agregar"
        if (canAddChildren(item.type)) {
          const addRow = {
            key: `add-${item.key}`,
            isAddRow: true,
            parentKey: item.key,
            parentType: item.type,
            level: item.level + 1,
            children: []
          };
          if (!item.children) {
            item.children = [addRow];
          } else {
            item.children.push(addRow);
          }
        }
      });

      // Agregar fila "Agregar" al final del nivel actual
      if (parentType) {
        const nextType = getNextType(parentType);
        if (nextType) {
          result.push({
            key: `add-${parentType}-${result.length}`,
            isAddRow: true,
            parentType,
            level: result[0]?.level || 0,
            children: []
          });
        }
      }

      return result;
    };

    const transformedData = transformItems(items);
    // Agregar fila "Agregar Epic" al final del nivel raíz
    transformedData.push({
      key: 'add-root',
      isAddRow: true,
      parentType: null,
      level: 0,
      children: []
    });

    return transformedData;
  };

// const handleAddItem = (addRow) => {
//     const type = addRow.parentType === null ? 'Epic' : getNextType(addRow.parentType);
//     const newId = Date.now().toString();
//     const newItem = {
//       key: `new-${newId}`,
//       order: data.length + 1,
//       id: `DENSO-NSR-${newId}`,
//       type,
//       title: `New ${type}`,
//       status: '',
//       priority: 'BAJA',
//       level: addRow.level,
//       assigned: {
//         name: 'Unassigned',
//         avatar: '/api/placeholder/32/32'
//       },
//       sprint: 'Unassigned',
//       children: []
//     };

//     setData(prevData => {
//       const addItemToData = (items, parentKey = null) => {
//         if (!parentKey) {
//           return [...items, newItem];
//         }

//         return items.map(item => {
//           if (item.key === parentKey) {
//             return {
//               ...item,
//               children: [...(item.children || []).filter(child => !child.isAddRow), newItem]
//             };
//           }
//           if (item.children) {
//             return {
//               ...item,
//               children: addItemToData(item.children, parentKey)
//             };
//           }
//           return item;
//         });
//       };

//       return addItemToData(prevData, addRow.parentKey);
//     });
//   };
const handleAddItem = (addRow) => {
    const type = addRow.parentType === null ? 'Epic' : getNextType(addRow.parentType);
    const newId = Date.now().toString();
    const newItem = {
      key: `new-${newId}`,
      order: data.length + 1,
      id: `DENSO-NSR-${newId}`,
      type,
      title: `New ${type}`,
      status: '',
      priority: 'BAJA',
      level: addRow.level,
      assigned: {
        name: 'Unassigned',
        avatar: '/api/placeholder/32/32'
      },
      sprint: 'Unassigned',
      children: []
    };

    setData(prevData => {
      const addItemToData = (items, parentKey = null) => {
        if (!parentKey) {
          return [...items, newItem];
        }

        return items.map(item => {
          if (item.key === parentKey) {
            return {
              ...item,
              children: [...(item.children || []).filter(child => !child.isAddRow), newItem]
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addItemToData(item.children, parentKey)
            };
          }
          return item;
        });
      };

      return addItemToData(prevData, addRow.parentKey);
    });
  };


const moveRow = useCallback((dragRecord, hoverRecord) => {
    // No permitir mover filas de tipo "Agregar"
    if (dragRecord.isAddRow || hoverRecord.isAddRow) return;
    
    setData(prevData => {
      const newData = [...prevData];
      
      // Función para encontrar y remover un item del árbol
      const findAndRemove = (items, key) => {
        for (let i = 0; i < items.length; i++) {
          // Si encontramos el item a mover
          if (items[i].key === key) {
            // Solo removemos si no es una fila de tipo "Agregar"
            if (!items[i].isAddRow) {
              return items.splice(i, 1)[0];
            }
            return null;
          }
          // Buscar recursivamente en los hijos
          if (items[i].children?.length) {
            const found = findAndRemove(items[i].children, key);
            if (found) return found;
          }
        }
        return null;
      };
  
      // Función para insertar un item en el árbol
      const findAndInsert = (items, targetKey, itemToInsert) => {
        for (let i = 0; i < items.length; i++) {
          // Si encontramos donde insertar
          if (items[i].key === targetKey) {
            // Verificamos que no sea una fila de tipo "Agregar"
            if (!items[i].isAddRow) {
              items.splice(i, 0, itemToInsert);
              return true;
            }
            return false;
          }
          // Buscar recursivamente en los hijos
          if (items[i].children?.length) {
            if (findAndInsert(items[i].children, targetKey, itemToInsert)) {
              return true;
            }
          }
        }
        return false;
      };
  
      // Movimiento del item
      const itemToMove = findAndRemove(newData, dragRecord.key);
      if (itemToMove) {
        // Solo insertar si encontramos el item y no es una fila de tipo "Agregar"
        findAndInsert(newData, hoverRecord.key, itemToMove);
      }
  
      // Actualizar los números de orden después del movimiento
      const updateOrders = (items, startOrder = 1) => {
        return items.map((item, index) => {
          // Solo actualizar orden si no es una fila de tipo "Agregar"
          if (!item.isAddRow) {
            const newItem = { ...item, order: startOrder + index };
            if (item.children?.length > 0) {
              newItem.children = updateOrders(
                item.children.filter(child => !child.isAddRow), 
                startOrder
              );
            }
            return newItem;
          }
          return item;
        });
      };
  
      return updateOrders(newData);
    });
  }, []);

  const getItemPath = (data, targetKey, path = []) => {
    for (const item of data) {
      if (item.key === targetKey) {
        return [...path, item.key];
      }
      if (item.children?.length) {
        const childPath = getItemPath(item.children, targetKey, [...path, item.key]);
        if (childPath) return childPath;
      }
    }
    return null;
  };

  const handleExpand = (expanded, record) => {
    const keys = expanded ? 
      [...expandedKeys, record.key] : 
      expandedKeys.filter(k => k !== record.key);
    
    setExpandedKeys(keys);
    
    // Solo mostrar el input para Epic y User Story cuando no tienen hijos
    if (expanded && (!record.children || record.children.length === 0) && 
        (record.type === 'Epic' || record.type === 'User Story')) {
      setEditingKey(record.key);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const getNextType = (currentType) => {
    switch (currentType) {
      case 'Epic':
        return 'User Story';
      case 'User Story':
        return 'Task';
      case 'Task':
        return null;
      default:
        return null;
    }
  };

  const canAddChildren = (type) => {
    return type === 'Epic' || type === 'User Story';
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'Liberada':
        return 'success';
      case 'Revisión':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'BAJA':
        return 'success';
      case 'ALTA':
        return 'error';
      default:
        return 'default';
    }
  };

  const updateOrders = (items, startOrder = 1) => {
    return items.map((item, index) => {
      const newItem = { ...item, order: startOrder + index };
      if (item.children?.length > 0) {
        newItem.children = updateOrders(item.children, startOrder);
      }
      return newItem;
    });
  };

  const addNewItemToParent = (parentRecord, type) => {
    const newId = Date.now().toString();
    const newItem = {
      key: `new-${newId}`,
      order: 0, // Se actualizará después
      id: `DENSO-NSR-${newId}`,
      type,
      title: `New ${type}`,
      status: '',
      priority: 'BAJA',
      level: parentRecord ? parentRecord.level + 1 : 0,
      assigned: {
        name: 'Unassigned',
        avatar: '/api/placeholder/32/32'
      },
      sprint: 'Unassigned',
      children: []
    };

    setData(prevData => {
      const updateChildren = (items) => {
        if (!parentRecord) {
          const newItems = [...items, newItem];
          return updateOrders(newItems);
        }

        return items.map(item => {
          if (item.key === parentRecord.key) {
            const newChildren = [...(item.children || []), newItem];
            return {
              ...item,
              children: updateOrders(newChildren)
            };
          }
          if (item.children) {
            return {
              ...item,
              children: updateChildren(item.children)
            };
          }
          return item;
        });
      };
      
      return updateChildren(prevData);
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Epic':
        return 'warning';
      case 'User Story':
        return 'processing';
      case 'Task':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleNewItemSubmit = (parentRecord) => {
    const nextType = getNextType(parentRecord.type);
    if (!nextType || !newItemText.trim()) return;

    const newId = Date.now().toString();
    const newItem = {
      key: `new-${newId}`,
      order: data.length + 1,
      id: `DENSO-NSR-${newId}`,
      type: nextType,
      title: newItemText,
      status: '',
      priority: 'BAJA',
      level: parentRecord.level + 1,
      assigned: {
        name: 'Unassigned',
        avatar: '/api/placeholder/32/32'
      },
      sprint: 'Unassigned',
      children: []
    };

    setData(prevData => {
      const updateChildren = (items) => {
        return items.map(item => {
          if (item.key === parentRecord.key) {
            return {
              ...item,
              children: [...(item.children || []), newItem]
            };
          }
          if (item.children) {
            return {
              ...item,
              children: updateChildren(item.children)
            };
          }
          return item;
        });
      };
      return updateChildren(prevData);
    });

    setNewItemText('');
    setEditingKey('');
  };

  const handleCancelNewItem = () => {
    setNewItemText('');
    setEditingKey('');
    setExpandedKeys(expandedKeys.filter(k => k !== editingKey));
  };


  const columns = [
    // {
    //     title: '',
    //     key: 'expand',
    //     width: 50,
    //     render: (_, record) => null // Esta columna será usada por el expandable
    //   },
    // {
    //     title: '',
    //     key: 'actions',
    //     width: 50,
    //     fixed: 'left',
    //     render: (_, record) => (
    //       <Space>
    //         {canAddChildren(record.type) && (
    //           <Tooltip title={`Add ${getNextType(record.type)}`}>
    //             <Button
    //               type="text"
    //               size="small"
    //               icon={<PlusOutlined />}
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 addNewItemToParent(record, getNextType(record.type));
    //               }}
    //             />
    //           </Tooltip>
    //         )}
    //       </Space>
    //     )
    // },      
      {
        title: 'Order',
        dataIndex: 'order',
        width: 60,
      },
    // {
    //   title: 'Item',
    //   dataIndex: 'id',
    //   width: 200,
    // },
    {
        title: 'Item',
        dataIndex: 'id',
        width: 200,
        render: (text, record) => {
          if (record.isAddRow) {
            return (
              <div
                style={{ 
                  marginLeft: record.level * 24,
                  color: '#888',
                  cursor: 'pointer',
                  padding: '4px 0'
                }}
                onClick={() => handleAddItem(record)}
                className="hover:bg-gray-50"
              >
                <PlusOutlined style={{ marginRight: 8 }} />
                Agregar {record.parentType ? getNextType(record.parentType) : 'Epic'}
              </div>
            );
          }
          return (
            <Space style={{ marginLeft: record.level * 24 }}>
              {text}
            </Space>
          );
        }
      },
    {
        title: 'Type',
        dataIndex: 'type',
        width: 120,
        render: (type, record) => (
          <Space style={{ marginLeft: record.level * 24 }}>
            <Badge
              status={getTypeColor(type)}
              text={type}
            />
          </Space>
        )
      },
      {
        title: 'Title',
        dataIndex: 'title',
        render: (text, record) => {
          if (record.isAddRow) return null;
          return (
            <div style={{ 
              marginLeft: record.level * 24,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {record.children && record.children.some(child => !child.isAddRow) && (
                <CaretRightOutlined
                  className={expandedKeys.includes(record.key) ? 'rotate-90' : ''}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (expandedKeys.includes(record.key)) {
                      setExpandedKeys(expandedKeys.filter(k => k !== record.key));
                    } else {
                      setExpandedKeys([...expandedKeys, record.key]);
                    }
                  }}
                />
              )}
              {getTypeIcon(record.type)}
              {text}
            </div>
          );
        }
      },

    //   {
    //     title: 'Title',
    //     dataIndex: 'id',
    //     width: 200,
    //     render: (text, record) => (
    //         <div style={{ 
    //           marginLeft: record.level * 24,
    //           display: 'flex',
    //           alignItems: 'center',
    //           gap: '8px'
    //         }}>
    //           {record.children && record.children.length > 0 ? (
    //             <CaretRightOutlined
    //               className={expandedKeys.includes(record.key) ? 'rotate-90' : ''}
    //               style={{ 
    //                 cursor: 'pointer',
    //                 transition: 'transform 0.2s'
    //               }}
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 if (expandedKeys.includes(record.key)) {
    //                   setExpandedKeys(expandedKeys.filter(k => k !== record.key));
    //                 } else {
    //                   setExpandedKeys([...expandedKeys, record.key]);
    //                 }
    //               }}
    //             />
    //           ) : canAddChildren(record.type) ? (
    //             <div style={{ width: '14px' }} /> // Espaciador para alineación
    //           ) : null}
    //           {getTypeIcon(record.type)}
    //           {text}
    //         </div>
    //       )
    //     },
    //     render: (text, record) => (
    //       <Space style={{ marginLeft: record.level * 24 }}>
    //         {text}
    //         {canAddChildren(record.type) && (
    //           <Tooltip title={`Add ${getNextType(record.type)}`}>
    //             <Button
    //               type="text"
    //               size="small"
    //               icon={<PlusOutlined />}
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 addNewItemToParent(record, getNextType(record.type));
    //               }}
    //             />
    //           </Tooltip>
    //         )}
    //       </Space>
    //     )
    //   },
    //   {
    //     title: 'Title',
    //     dataIndex: 'title',
    //     render: (text, record) => {
    //       if (editingKey === record.key && canAddChildren(record.type)) {
    //         const nextType = getNextType(record.type);
    //         return (
    //           <div style={{ 
    //             marginLeft: record.level * 24,
    //             display: 'flex',
    //             gap: '8px',
    //             alignItems: 'center'
    //           }}>
    //             <Input
    //               ref={inputRef}
    //               placeholder={`Add new ${nextType}`}
    //               value={newItemText}
    //               onChange={e => setNewItemText(e.target.value)}
    //               onPressEnter={() => handleNewItemSubmit(record)}
    //               style={{ width: '200px' }}
    //             />
    //             <Button
    //               type="text"
    //               icon={<SaveOutlined />}
    //               onClick={() => handleNewItemSubmit(record)}
    //               disabled={!newItemText.trim()}
    //             />
    //             <Button
    //               type="text"
    //               icon={<CloseOutlined />}
    //               onClick={handleCancelNewItem}
    //             />
    //           </div>
    //         );
    //       }
    //       return (
    //         <Space style={{ marginLeft: record.level * 24 }}>
    //           {getTypeIcon(record.type)}
    //           {text}
    //         </Space>
    //       );
    //     }
    //   },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (status) => (
        status && (
          <Badge
            status={getStatusColor(status)}
            text={status}
          />
        )
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 100,
      render: (priority) => (
        <Badge
          status={getPriorityColor(priority)}
          text={priority}
        />
      )
    },
    {
      title: 'Assigned',
      dataIndex: 'assigned',
      width: 200,
      render: (assigned, record) => {
        if (record.isAddRow || !assigned) return null;
        return (
          <Space>
            <Avatar src={assigned.avatar} size="small" />
            {assigned.name}
          </Space>
        );
      }
    },
    {
      title: 'Sprint',
      dataIndex: 'sprint',
      width: 150,
    },
  ];

  const addNewItem = (type) => {
    const newId = Date.now().toString();
    const newItem = {
      key: `new-${newId}`,
      order: data.length + 1,
      id: `DENSO-NSR-${newId}`,
      type,
      title: `New ${type}`,
      status: '',
      priority: 'BAJA',
      level: type === 'Epic' ? 0 : type === 'User Story' ? 1 : 2,
      assigned: {
        name: 'Unassigned',
        avatar: '/api/placeholder/32/32'
      },
      sprint: 'Unassigned',
      children: []
    };

    setData(prevData => [...prevData, newItem]);
  };

  const transformedData = transformDataWithAddRows(data);

  return (
//     <DndProvider backend={HTML5Backend}>
//     <div className="w-full p-4">
//       <div className="mb-4 space-x-2">
//         <Button 
//           type="primary" 
//           icon={<PlusOutlined />}
//           onClick={() => addNewItem('Epic')}
//         >
//           New Epic
//         </Button>
//         <Button 
//           icon={<PlusOutlined />}
//           onClick={() => addNewItem('User Story')}
//         >
//           New User Story
//         </Button>
//         <Button 
//           icon={<PlusOutlined />}
//           onClick={() => addNewItem('Task')}
//         >
//           New Task
//         </Button>
//       </div>
//       <Table
//           rowKey="key"
//           columns={columns}
//           dataSource={data}
//           components={{
//             body: {
//               row: DraggableBodyRow
//             }
//           }}
//           onRow={(record, index) => ({
//             index,
//             record,
//             moveRow
//           })}
//           pagination={false}
//           expandable={{
//             expandedRowKeys: expandedKeys,
//             onExpand: handleExpand,
//             defaultExpandAllRows: false,
//             showExpandColumn: false 
//           }}
//           childrenColumnName="children"
//         />
//     </div>
//   </DndProvider>

<DndProvider backend={HTML5Backend}>
<div className="w-full p-4">
  <style>
    {`
      .rotate-90 {
        transform: rotate(90deg);
      }
    `}
  </style>
  <Table
    rowKey="key"
    columns={columns}
    dataSource={transformedData}
    components={{
      body: {
        row: DraggableBodyRow
      }
    }}
    onRow={(record, index) => ({
      index,
      record,
      moveRow: !record.isAddRow ? moveRow : undefined
    })}
    pagination={false}
    expandable={{
      expandedRowKeys: expandedKeys,
      onExpandedRowsChange: setExpandedKeys,
      showExpandColumn: false
    }}
    childrenColumnName="children"
  />
</div>
</DndProvider>
  );
};

export default Backlog;