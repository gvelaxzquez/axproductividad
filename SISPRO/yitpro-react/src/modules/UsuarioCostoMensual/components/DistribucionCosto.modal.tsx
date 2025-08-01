/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, Modal, Popconfirm, Select, Space, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState } from 'react';
import type { UsuarioCosto, UsuarioCostoDistribucion } from '../../../model/UsuarioCostoMensual.model';
import { useUsuarioCostoStore } from '../store/usuarioCostoMensual.store';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;


// const { Text } = Typography;

interface Props {
    usuario: UsuarioCosto;
    open: boolean;
    onClose: () => void;
}

const DistribucionCostoModal: React.FC<Props> = ({ open, onClose, usuario }) => {
    const { distribucion,
        proyectos,
        setDistribucion,
        agregarProyectoDistribucion,
        eliminarProyectoDistribucion,
        recalcularDistribucionAutomatica,
        guardarDistribucionCostos
    } = useUsuarioCostoStore();

    const [calculoAutomatico, setCalculoAutomatico] = useState(false);

    const sumaPorcentajes = useMemo(() => {
        const raw = (distribucion ?? []).reduce((acc, p) => acc + p.porcentaje, 0);
        return Number(raw.toFixed(2)); // redondea a 2 decimales
    }, [distribucion]);
    const esCien = Math.abs(sumaPorcentajes - 100) < 0.01;


    const columns: ColumnsType<UsuarioCostoDistribucion> = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center' }}>

                    <Button
                        shape="circle"
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={() => agregarProyectoDistribucion(usuario.idUsuario)}
                        style={{ marginRight: 8 }}
                    />

                    <span>Proyecto</span>
                </div>
            ),
            dataIndex: 'proyecto',
            key: 'proyecto',
            render: (_: any, record: UsuarioCostoDistribucion) => {
                const editable = record.idUsuarioCostoD === 0;
                const idsUsados = distribucion.map(d => d.idProyecto);
                return editable ? (
                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        optionFilterProp="children"
                        value={record.idProyecto ?? undefined}
                        onChange={(value) => {
                            const proyecto = proyectos.find(p => p.idCatalogo === value);
                            const nueva = distribucion.map((r) =>
                                r === record ? { ...r, idProyecto: value, proyecto: proyecto?.descLarga ?? '' } : r
                            );
                            setDistribucion(nueva);
                        }}
                    >
                        {proyectos.map(p => (
                            <Option
                                key={p.idCatalogo}
                                value={p.idCatalogo}
                                disabled={idsUsados.includes(p.idCatalogo)}
                            >
                                {p.descLarga}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    <span>{record.proyecto}</span>
                );
            }
        },
        {
            title: 'Porcentaje',
            dataIndex: 'porcentaje',
            key: 'porcentaje',
            align: 'right',
            render: (val: number, record: UsuarioCostoDistribucion) => (
                <Input
                    type="number"
                    value={val}
                    suffix="%"
                    // style={{ width: 100 }}
                    onChange={(e) => {
                        const nuevoValor = parseFloat(e.target.value) || 0;

                        if (!calculoAutomatico) {
                            const nueva = distribucion.map((r) =>
                                r === record ? { ...r, porcentaje: nuevoValor } : r
                            );
                            setDistribucion(nueva);
                            return;
                        }

                        // 🔄 Calculo automático activo
                        const otros = distribucion.filter((r) => r !== record);
                        const restante = Math.max(100 - nuevoValor, 0);
                        const partes = otros.length;

                        const nuevaDistribucion = distribucion.map((r) => {
                            if (r === record) return { ...r, porcentaje: nuevoValor };

                            // distribuir restante equitativamente
                            const nuevoPorcentaje = partes > 0 ? parseFloat((restante / partes).toFixed(2)) : 0;
                            return { ...r, porcentaje: nuevoPorcentaje };
                        });

                        // ✅ Ajuste final al último para cerrar el 100% exacto
                        const totalCalculado = nuevaDistribucion.reduce((acc, d) => acc + d.porcentaje, 0);
                        const delta = parseFloat((100 - totalCalculado).toFixed(2));

                        const indexUltimo = nuevaDistribucion.findIndex((r) => r !== record);
                        if (indexUltimo >= 0 && partes > 0) {
                            nuevaDistribucion[indexUltimo].porcentaje += delta;
                        }

                        setDistribucion(nuevaDistribucion);
                    }}
                    min={0}
                    max={100}
                    step="any"
                    inputMode="decimal"
                    style={{
                        width: 100,
                        MozAppearance: 'textfield',
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                />
            )
        },
        {
            title: 'Eliminar',
            key: 'eliminar',
            align: 'center',
            render: (_: any, record: UsuarioCostoDistribucion) => (
                <Popconfirm
                    title="¿Eliminar este proyecto?"
                    onConfirm={() => {
                        eliminarProyectoDistribucion(record.idProyecto).then(() => {
                            if (calculoAutomatico) recalcularDistribucionAutomatica();
                        });
                    }}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];
    const titulo = usuario
        ? `Distribución costo - ${usuario.nombreMes}/${usuario.anio} - ${usuario.nombre}`
        : 'Distribución de Costo';

    const handleSave = () => {
        guardarDistribucionCostos(usuario.idUsuario).then(() => onClose());
    }

    return (
        <Modal
            title={titulo}
            open={open}
            onCancel={onClose}
            footer={[
                <Space style={{ justifyContent: 'space-between', width: '100%' }} key="footer">
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        onClick={() => {
                            const nuevoValor = !calculoAutomatico;
                            setCalculoAutomatico(nuevoValor);
                            if (nuevoValor) recalcularDistribucionAutomatica();
                        }}
                    >
                        <Switch
                            checked={calculoAutomatico}
                        />
                        <span style={{ marginLeft: 8, userSelect: 'none' }}>Cálculo automático</span>
                    </div>
                    <Button
                        disabled={!esCien}
                        type="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Space>
            ]}
            width={600}
        >
            <Table
                rowKey="proyecto"
                className='sticky-summary '
                columns={columns}
                dataSource={distribucion}
                pagination={false}
                size="small"
                tableLayout="fixed"
                scroll={{ y: 55 * 8 }}
                style={{ flex: 1, overflowY: 'auto' }}
                summary={() => {
                    return (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    <strong>{sumaPorcentajes.toFixed(2)} %</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} />
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
            />
        </Modal>
    );
};

export default DistribucionCostoModal;
