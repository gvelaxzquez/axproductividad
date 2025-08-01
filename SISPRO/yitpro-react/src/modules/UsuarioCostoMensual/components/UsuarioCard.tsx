import { Avatar, Card, Divider, List, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import type { UsuarioNodo } from '../../../model/UsuarioCostoMensual.model';
import { formatMoney, getInitials, imageUrl } from '../../../utils/format.util';
import { useUsuarioCostoStore } from '../store/usuarioCostoMensual.store';
import DistribucionBar from './DistribucionBar';
import DistribucionCostoModal from './DistribucionCosto.modal';
import { CloseOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Props {
    usuario: UsuarioNodo;
    distribucion?: UsuarioNodo['lstDistrbucion'];
    vistaAnalitica?: boolean;
}

const UsuarioCard: React.FC<Props> = ({
    usuario,
    distribucion = usuario.lstDistrbucion ?? [],
    vistaAnalitica = true
}) => {
    const {
        leerDistribucionCostos,
        eliminarDistribucionUsuario
    } = useUsuarioCostoStore();
    const esLiderReal = Array.isArray(usuario.hijos) && usuario.hijos.length > 0;
    const [modalOpen, setModalOpen] = useState(false);

    const onClick = () => {
        leerDistribucionCostos(usuario.idUsuario).then(() =>
            setTimeout(() => {
                setModalOpen(true); // Abrir modal después de cargar la distribución
            }, 150));
    }
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        eliminarDistribucionUsuario(usuario.idUsuario);
    };
    return (
        <>
            <div style={{ position: 'relative', minWidth: 240, height: '100%' }}>
                {distribucion.length === 0 && (
                    <CloseOutlined
                        onClick={handleRemove}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: 16,
                            color: '#999',
                            cursor: 'pointer',
                            zIndex: 2
                        }}
                    />
                )}

                <Card
                    hoverable
                    onClick={onClick}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        minWidth: 240
                    }}
                >
                    <Card.Meta
                        avatar={
                            <Avatar
                                src={imageUrl(usuario.clave)}
                                style={{
                                    width: 42,
                                    height: 42,
                                    fontSize: 16,
                                    background: '#d9d9d9',
                                    color: '#444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    userSelect: 'none'
                                }}
                            >
                                {getInitials(usuario.nombre)}
                            </Avatar>
                        }
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Title level={5} style={{ margin: 0 }}>
                                    {usuario.clave} - {usuario.nombre}
                                </Title>
                                {usuario.idULider == null ? (
                                    <Tag color="purple">MGR</Tag>
                                ) : (
                                    esLiderReal && <Tag color="gold">Líder</Tag>
                                )}
                            </div>
                        }
                        description={
                            <Text>
                                💰{formatMoney(usuario.costoMensual)}
                            </Text>
                        }
                    />

                    {distribucion.length > 0 && (
                        <>
                            <Divider style={{ margin: '12px 0' }} />
                            {vistaAnalitica ? (
                                <DistribucionBar distribucion={distribucion} />
                            ) : (
                                <div style={{ minHeight: 136 }}>

                                    <Text type="secondary">Distribución:</Text>
                                    <List
                                        size="small"
                                        dataSource={distribucion.slice(0, 3)}
                                        renderItem={(item) => (
                                            <List.Item style={{ padding: '4px 0' }}>
                                                <Text>{item.proyecto}</Text>
                                                <Tag color="blue" style={{ marginLeft: 'auto' }}>
                                                    {item.porcentaje.toFixed(2)}%
                                                </Tag>
                                            </List.Item>
                                        )}
                                    />
                                    {distribucion.length > 3 && (
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            ... y {distribucion.length - 3} más
                                        </Text>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </Card>
                <DistribucionCostoModal
                    usuario={usuario}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
            </div>
        </>
    );
};

export default UsuarioCard;
