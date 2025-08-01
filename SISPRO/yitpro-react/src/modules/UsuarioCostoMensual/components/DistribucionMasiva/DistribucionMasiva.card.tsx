/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined } from '@ant-design/icons';
import {
    Avatar, Button, Card, Checkbox, Divider, Input, Popconfirm, Select,
    Switch, Table, Typography
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import type { UsuarioCosto, UsuarioCostoDistribucion } from '../../../../model/UsuarioCostoMensual.model';
import { formatNumber, getInitials, getMonthName, imageUrl } from '../../../../utils/format.util';
import { useUsuarioCostoStore } from '../../store/usuarioCostoMensual.store';
import { PlusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;

interface Props {
    usuario: UsuarioCosto;
    initialDist: UsuarioCostoDistribucion[];
    open: boolean;
    resetKey: number;
}

const DistribucionCard: React.FC<Props> = React.memo(({ usuario, initialDist, resetKey }) => {
    const [dist, setDist] = useState<UsuarioCostoDistribucion[]>(initialDist);
    const [auto, setAuto] = useState(false);
    const [confirmado, setConfirmado] = useState(false);
    const {
        mes,
        anio,
        proyectos,
        setDistribucionPorUsuario,
        setUsuariosConfirmados
    } = useUsuarioCostoStore();

    useEffect(() => {
        setDist(initialDist);
        setAuto(false);
        setConfirmado(false);
    }, [resetKey]);

    const total = dist.reduce((s, p) => s + p.porcentaje, 0);
    const canConfirm = total.toFixed(2) === '100.00';

    // ➌ Handlers memorizados
    const recalc = useCallback((arr: UsuarioCostoDistribucion[]) => {
        const n = arr.length;
        const base = Math.floor((100 / n) * 100) / 100;
        const restante = 100 - base * (n - 1);
        const nueva = arr.map((p, i) => ({
            ...p,
            porcentaje: i === n - 1 ? parseFloat(restante.toFixed(2)) : base
        }));
        setDist(nueva);
    }, []);

    const handleAdd = useCallback(() => {
        const nuevo: UsuarioCostoDistribucion = {
            idUsuarioCostoD: 0, anio, mes, idUsuario: usuario.idUsuario,
            idProyecto: null, proyecto: '', porcentaje: 0,
            idUCreo: null, fechaCreo: null,
            claveProy: '', nombreMes: getMonthName(mes, anio),
            clave: '', recurso: '', totalMes: 0
        };
        const updated = [...dist, nuevo];
        setDist(updated);
        if (auto) recalc(updated);
    }, [dist, usuario, auto, recalc]);

    const handleDelete = useCallback((idProyecto: number) => {
        const updated = dist.filter((d) => d.idProyecto !== idProyecto);
        setDist(updated);
        if (auto) recalc(updated);
    }, [dist, auto, recalc]);

    const handleProyectoChange = useCallback((record: UsuarioCostoDistribucion, value: number) => {
        const nombre = proyectos.find(p => p.idCatalogo === value)?.descLarga ?? '';
        const updated = dist.map((r) =>
            r === record ? { ...r, idProyecto: value, proyecto: nombre } : r
        );
        setDist(updated);
        if (auto) recalc(updated);
    }, [dist, proyectos, auto, recalc]);

    const handlePorcentajeChange = useCallback((index: number, val: number) => {
        let updated = [...dist];
        updated[index].porcentaje = val;
        if (auto) {
            const restantes = updated.filter((_, i) => i !== index);
            const resto = Math.max(100 - val, 0);
            const partes = restantes.length;
            updated = updated.map((item, i) =>
                i === index
                    ? { ...item, porcentaje: val }
                    : { ...item, porcentaje: partes ? parseFloat((resto / partes).toFixed(2)) : 0 }
            );
            const suma = updated.reduce((s, d) => s + d.porcentaje, 0);
            const delta = parseFloat((100 - suma).toFixed(2));
            const idxAjuste = updated.findIndex((_, i) => i !== index);
            if (idxAjuste >= 0 && partes) updated[idxAjuste].porcentaje += delta;
        }
        setDist(updated);
    }, [dist, auto]);

    const handleConfirm = (value: boolean) => {
        setConfirmado(value);
        if (value)
            setDistribucionPorUsuario(usuario.idUsuario, dist);
        setUsuariosConfirmados(usuario.idUsuario, value);
    }

    return (
        <Card
            style={{
                borderColor: confirmado ? '#52fa78' : undefined,
                borderWidth: confirmado ? 2 : undefined,
                maxHeight: "75vh"
            }}
            styles={{
                body: {
                    padding: 12,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 425,
                    minWidth: 425,
                },
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <Avatar src={imageUrl(usuario.clave)} size={64}>
                    {getInitials(usuario.nombre)}
                </Avatar>
            </div>
            <Title level={5} style={{ textAlign: 'center', margin: 8 }}>{usuario.nombre}</Title>
            <Text style={{ textAlign: 'center' }}>
                💰 ${usuario.costoMensual.toLocaleString()} ({dist.length} proyectos)
            </Text>

            <Table
                className='sticky-summary '
                size="small"
                pagination={false}
                rowKey="idProyecto"
                dataSource={dist}
                tableLayout="fixed"
                scroll={{ y: 55 * 8 }}
                style={{ flex: 1, overflowY: 'auto' }}
                columns={[
                    {
                        title: (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {!confirmado && (
                                    <Button
                                        shape="circle"
                                        icon={<PlusOutlined />}
                                        size="small"
                                        onClick={handleAdd}
                                        style={{ marginRight: 8 }}
                                    />
                                )}
                                <span>Proyecto</span>
                            </div>
                        ),
                        dataIndex: 'proyecto',
                        width: confirmado ? "75%" : "55%",
                        render: (_: any, record: UsuarioCostoDistribucion) => {
                            const usados = dist.map(d => d.idProyecto);
                            return !confirmado ? (
                                <Select
                                    style={{ width: '100%' }}
                                    value={record.idProyecto ?? undefined}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children as any).toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(v) => handleProyectoChange(record, v)}
                                >
                                    {proyectos.map(p => (
                                        <Option key={p.idCatalogo} value={p.idCatalogo} disabled={usados.includes(p.idCatalogo)}>
                                            {p.descLarga}
                                        </Option>
                                    ))}
                                </Select>
                            ) : (
                                <Text>{record.proyecto}</Text>
                            );
                        }
                    },
                    {
                        title: 'Porcentaje',
                        dataIndex: 'porcentaje',
                        align: 'right',
                        width: "25%",
                        render: (val: any, __: any, idx: number) => {
                            return (confirmado ? `${formatNumber(val)}%` :
                                <Input
                                    type="number"
                                    value={Number.isNaN(dist[idx].porcentaje) ? '' : dist[idx].porcentaje}
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        // Permitir cadena vacía (en edición) o número válido
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            const num = parseFloat(val);
                                            handlePorcentajeChange(idx, isNaN(num) ? 0 : num);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const num = parseFloat(e.target.value);
                                        handlePorcentajeChange(idx, isNaN(num) ? 0 : num);
                                    }}
                                    suffix="%"
                                    style={{ width: 80 }}
                                />)
                        }
                    },
                    {
                        key: 'eliminar',
                        align: 'center',
                        width: "10%",
                        hidden: confirmado,
                        render: (_: any, record: UsuarioCostoDistribucion) => (
                            <Popconfirm
                                title="¿Eliminar este proyecto?"
                                onConfirm={() => handleDelete(record.idProyecto!)}
                            >
                                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                            </Popconfirm>
                        )
                    }
                ]}
                summary={() => {
                    const total = dist.reduce((acc, p) => acc + p.porcentaje, 0);
                    return (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    <strong>{total.toFixed(2)} %</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} />
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
            />
            <Divider style={{ margin: 0 }} />
            <div style={{
                marginTop: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1 }}>
                    {!confirmado && (
                        <div
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => {
                                const nuevoValor = !auto;
                                setAuto(nuevoValor);
                                if (nuevoValor) recalc(dist);
                            }}
                        >
                            <Switch checked={auto} />
                            <span style={{ marginLeft: 8, userSelect: 'none' }}>Cálculo automático</span>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <Popconfirm
                        title={confirmado ? "¿Editar distribución?" : "¿Confirmar distribución?"}
                        onConfirm={() => handleConfirm(!confirmado)}
                    >
                        <Checkbox disabled={!canConfirm} checked={confirmado}>Confirmado</Checkbox>
                    </Popconfirm>
                </div>
            </div>

        </Card>
    );
});

export default DistribucionCard;
