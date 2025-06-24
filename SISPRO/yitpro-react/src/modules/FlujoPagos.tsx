/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, DatePicker, Empty, Form, Modal, Progress, Row, Select, Table, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CustomFormModal from '../components/Common/CustomFormModal';
import type { FlujoPagoDetModel } from '../model/FlujoPago.model';
import { convertToPascalCase } from '../utils/convertPascal';
import { formatMoney, formatNumber } from '../utils/format.util';
import type { FlujoDetalle } from './Proyectos/FlujoDePagos/flujoPagoDetalle.store';
import useFlujoPagosStore from './Proyectos/FlujoDePagos/flujoPagoDetalle.store';
import { buildColumnsFlujoPago } from './Proyectos/FlujoDePagos/flujoPagoDetalles.columns';
import FormFlujoDetalle from './Proyectos/FlujoDePagos/forms/flujoPagoDetalle.form';

const { Title, Text } = Typography;

const FlujoPagos: React.FC = () => {
    // Obtener estado y acciones desde el store de Zustand
    const {
        idFlujo,
        flujo,
        indicadores,
        cargarFlujoDetalle,
        guardarDatosFPD: guardarDetalle,
        eliminarFPD,

        guardarDatosFP,
        actualizarFecha,
        actualizarRelacion
    } = useFlujoPagosStore();

    // Estados locales para control de formularios y modales
    const [formNuevoFlujo] = Form.useForm();
    const [formRelacion] = Form.useForm();
    const [formEditarFecha] = Form.useForm();
    const [modalNuevoFlujoVisible, setModalNuevoFlujoVisible] = useState(false);
    const [modalRelacionVisible, setModalRelacionVisible] = useState(false);
    const [modalFechaVisible, setModalFechaVisible] = useState(false);
    const [detalleParaRelacion, setDetalleParaRelacion] = useState<FlujoDetalle | null>(null);
    const [opcionesPago, setOpcionesPago] = useState<{ value: number; label: string }[]>([]);

    const [detalleSeleccionado, setDetalleSeleccionado] = useState<FlujoPagoDetModel | null>(null);

    // Efecto: cargar datos al montar (si existe un flujo de pagos para la póliza actual)
    useEffect(() => {
        if (idFlujo) {
            cargarFlujoDetalle()
        }
    }, [cargarFlujoDetalle, idFlujo]);

    // Función para buscar pagos realizados (reemplaza la funcionalidad AJAX de select2)
    const buscarPagos = async (term: string) => {
        if (!term) return;
        try {
            const url = (document.getElementById('urlBuscarPago') as HTMLInputElement)?.value;
            if (!url) return;
            const resp = await axios.get(url, { params: { term } });
            // Suponemos que resp.data es una lista de pagos con {id, nombre/descripcion}
            const opciones = resp.data.map((p: any) => ({
                value: p.id,
                label: p.nombre ?? p.descripcion ?? `Pago ${p.id}`
            }));
            setOpcionesPago(opciones);
        } catch (error) {
            console.error('Error buscando pagos:', error);
        }
    };

    // Maneja la confirmación de creación de nuevo flujo
    const handleCrearFlujo = async () => {
        try {
            const valores = await formNuevoFlujo.validateFields();
            const fecha = valores.fechaInicio ? dayjs(valores.fechaInicio).format('YYYY-MM-DD') : undefined;
            await guardarDatosFP({ fechaInicio: fecha });
            message.success('Flujo de pagos creado correctamente');
            setModalNuevoFlujoVisible(false);
            formNuevoFlujo.resetFields();
            // El efecto useEffect cargará automáticamente los datos del nuevo flujo (idFlujo cambió)
        } catch (error) {
            if ((error as any).errorFields) {
                // Error de validación del formulario (antd se encarga de mostrarlo)
            } else {
                message.error('Error al crear el flujo de pagos');
            }
        }
    };
    // Maneja la confirmación para relacionar (vincular) un pago realizado con el detalle seleccionado
    const handleRelacionarPago = async () => {
        try {
            const valores = await formRelacion.validateFields();
            const idPago = valores.idPago;
            if (detalleParaRelacion) {
                await actualizarRelacion(detalleParaRelacion.id, idPago);
                message.success('Pago relacionado correctamente');
            }
            setModalRelacionVisible(false);
            formRelacion.resetFields();
            setDetalleParaRelacion(null);
        } catch (error) {
            if ((error as any).errorFields) {
                // Error de validación en formulario
            } else {
                message.error('Error al relacionar el pago');
            }
        }
    };

    // Maneja la confirmación para actualizar la fecha de un pago programado
    const handleActualizarFecha = async () => {
        try {
            const valores = await formEditarFecha.validateFields();
            const nuevaFecha = valores.nuevaFecha; // objeto Dayjs de DatePicker
            if (detalleSeleccionado && nuevaFecha) {
                await actualizarFecha(detalleSeleccionado.idFlujoPago, nuevaFecha.toDate());
                message.success('Fecha de pago actualizada');
            }
            setModalFechaVisible(false);
            formEditarFecha.resetFields();
            setDetalleSeleccionado(null);
        } catch (error) {
            if ((error as any).errorFields) {
                // Error de validación en formulario
            } else {
                message.error('Error al actualizar la fecha');
            }
        }
    };

















    const [modalConfig, setModalConfig] = useState<{
        visible: boolean;
        title: string;
        formId: string;
        content: React.ReactNode;
        onCancel: () => void;
    }>({
        visible: false,
        title: '',
        formId: '',
        content: null,
        onCancel: () => { },
    });

    const colorDesfase = (valor: number) => {
        if (valor <= 5) return '#08C127';      // verde
        if (valor <= 15) return '#fea223';     // amarillo
        return '#D12106';                      // rojo
    };

    const handleNuevoDetalle = () => {
        setDetalleSeleccionado(null);
        setModalConfig({
            visible: true,
            title: `Nuevo detalle`,
            formId: 'formFlujoDetalle',
            content: <FormFlujoDetalle detalle={null} onSubmit={(values) => handleSubmitFlujoDetalle(values, null)} />,
            onCancel: () => setModalConfig(prev => ({ ...prev, visible: false }))
        })
    }

    const handleEditarFlujoDetalle = (row: FlujoPagoDetModel) => {
        setModalConfig({
            visible: true,
            title: `Editar detalle #${row?.secuencia}`,
            formId: 'formFlujoDetalle',
            content: <FormFlujoDetalle detalle={row} onSubmit={(values) => handleSubmitFlujoDetalle(values, row)} />,
            onCancel: () => setModalConfig(prev => ({ ...prev, visible: false }))
        });
    };
    const handleSubmitFlujoDetalle = (values: any, row: FlujoPagoDetModel) => {
        const _res = {
            ...values,
            IdFlujoPago: idFlujo,
            IdFlujoPagoDet: row?.idFlujoPagoDet ?? 0
        };
        guardarDetalle(convertToPascalCase(_res));
        setModalConfig(prev => ({ ...prev, visible: false }));
    };
    const handleDeleteFlujoDetalle = async (row: FlujoPagoDetModel) => {
        try {
            eliminarFPD(row.idFlujoPagoDet)
        } catch {
            message.error('Error al eliminar el registro');
        }
    };

    const useColumns = buildColumnsFlujoPago(indicadores?.avanceRealPorc ?? 0, handleEditarFlujoDetalle, handleDeleteFlujoDetalle);
    return (

        <div style={{ padding: '1rem' }}>
            {/* Fila superior */}
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    {flujo && (
                        <>
                            <Card
                                style={{ marginBottom: '1rem' }}
                                title={<Title level={4} style={{ margin: 0 }}>{flujo.nombreProy}</Title>}
                            >
                                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                    <Text><strong>Horas totales:</strong> {flujo.horasTotales}</Text>
                                    <Text><strong>Precio hora:</strong> ${flujo.precioHora}</Text>
                                    <Text><strong>IVA:</strong> {flujo.porcIVA}%</Text>
                                </div>
                            </Card>

                            <Card
                                style={{ marginBottom: '2rem' }}
                                title={<Title level={4} style={{ margin: 0 }}>Estatus del proyecto</Title>}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '2rem',
                                        justifyContent: 'space-between',
                                        marginBottom: '2rem',
                                        width: '100%',
                                    }}
                                >
                                    {/* Avance Actual */}
                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                        <Progress
                                            type="circle"
                                            percent={indicadores?.avanceRealPorc ?? 0}
                                            strokeColor="#000070"
                                            size={100}
                                        />
                                        <br />
                                        <Text strong>Avance actual</Text>
                                    </div>

                                    {/* Avance Esperado */}
                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                        <Progress
                                            type="circle"
                                            percent={indicadores?.avanceCompPorc ?? 0}
                                            strokeColor="#000070"
                                            size={100}
                                        />
                                        <br />
                                        <Text strong>Avance esperado</Text>
                                    </div>

                                    {/* Desfase */}
                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                        <Progress
                                            type="circle"
                                            percent={indicadores?.desfaseProc ?? 0}
                                            strokeColor={colorDesfase(indicadores?.desfaseProc ?? 0)}
                                            size={100}
                                        />
                                        <br />
                                        <Text strong>Desfase</Text>
                                    </div>
                                </div>
                            </Card>
                        </>
                    )}
                </Col>
                <Col xs={24} md={12}>
                    {idFlujo && flujo && (
                        <div style={{ marginBottom: '2rem' }}>
                            <Card
                                title={<Text strong>Resumen financiero</Text>}
                                // bordered={false}
                                style={{ boxShadow: '0 2px 8px #f0f1f2' }}
                            // bodyStyle={{ padding: '1.5rem' }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text type="secondary">Total proyecto</Text>
                                            <div style={{ fontSize: 18, fontWeight: 600 }}>{formatMoney(flujo.totalProyecto)}</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Horas: {formatNumber(flujo.totalProyectoHoras)}</Text>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text type="secondary">Total facturado</Text>
                                            <div style={{ fontSize: 18, fontWeight: 600 }}>{formatMoney(flujo.totalFacturado)}</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Horas: {formatNumber(flujo.totalFacturadoHoras)}</Text>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text type="secondary">Total amortizado</Text>
                                            <div style={{ fontSize: 18, fontWeight: 600 }}>{formatMoney(flujo.totalAmortizadas)}</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Horas: {formatNumber(flujo.totalAmortizadoHoras)}</Text>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text type="secondary">Total pagado</Text>
                                            <div style={{ fontSize: 18, fontWeight: 600 }}>{formatMoney(flujo.totalPagado)}</div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Horas: {formatNumber(flujo.totalPagadoHoras)}</Text>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong style={{ color: '#faad14' }}>Saldo amortizar</Text>
                                            <div style={{ fontSize: 18, fontWeight: 700, color: '#faad14' }}>{formatMoney(flujo.saldoAmortizar)}</div>
                                            <Text strong style={{ fontSize: 12, color: '#faad14' }}>Horas: {formatNumber(flujo.saldoAmortizarHoras)}</Text>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong style={{ color: '#1890ff' }}>Saldo</Text>
                                            <div style={{ fontSize: 18, fontWeight: 700, color: '#1890ff' }}>{formatMoney(flujo.saldo)}</div>
                                            <Text strong style={{ fontSize: 12, color: '#1890ff' }}>Horas: {formatNumber(flujo.saldoHoras)}</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Fila inferior */}
            <Row style={{ marginTop: '2rem' }}>
                <Col span={24}>
                    {idFlujo ? (
                        <Card
                            style={{ width: '100%' }}
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Pagos del flujo</span>
                                    <Button type="primary" onClick={() => handleNuevoDetalle()}>
                                        Agregar pago
                                    </Button>
                                </div>
                            }
                        >
                            <Table<FlujoPagoDetModel>
                                style={{ marginTop: '1rem' }}
                                columns={useColumns}
                                dataSource={flujo?.flujoDetalle ?? []}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    ) : (
                        <Empty description="No existe un flujo de pagos para esta póliza">
                            <Button type="primary" onClick={() => handleNuevoDetalle()}>
                                Crear flujo de pagos
                            </Button>
                        </Empty>
                    )}
                </Col>
            </Row>
            {modalConfig.visible && (
                <CustomFormModal
                    open={modalConfig.visible}
                    title={modalConfig.title}
                    formId={modalConfig.formId}
                    onCancel={modalConfig.onCancel}
                >
                    {modalConfig.content}
                </CustomFormModal>
            )}

            <Modal
                title="Nuevo Flujo de Pagos"
                visible={modalNuevoFlujoVisible}
                onOk={handleCrearFlujo}
                onCancel={() => {
                    setModalNuevoFlujoVisible(false);
                    formNuevoFlujo.resetFields();
                }}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form form={formNuevoFlujo} layout="vertical">
                    <Form.Item
                        name="fechaInicio"
                        label="Fecha inicial"
                        rules={[{ required: true, message: 'Ingrese la fecha inicial' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>



            <Modal
                title="Relacionar Pago Realizado"
                visible={modalRelacionVisible}
                onOk={handleRelacionarPago}
                onCancel={() => {
                    setModalRelacionVisible(false);
                    setDetalleParaRelacion(null);
                    formRelacion.resetFields();
                }}
                okText="Relacionar"
                cancelText="Cancelar"
            >
                <Form form={formRelacion} layout="vertical">
                    <Form.Item
                        name="idPago"
                        label="Pago realizado"
                        rules={[{ required: true, message: 'Seleccione un pago' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Buscar y seleccionar pago"
                            filterOption={false}
                            onSearch={buscarPagos}
                            options={opcionesPago}
                            notFoundContent="Sin resultados"
                        />
                    </Form.Item>
                    {detalleParaRelacion && (
                        <Text>
                            Vinculando al pago programado el {dayjs(detalleParaRelacion.fecha).format('DD/MM/YYYY')}{' '}
                            por{' '}
                            {new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            }).format(detalleParaRelacion.monto)}
                        </Text>
                    )}
                </Form>
            </Modal>

            <Modal
                title="Actualizar Fecha de Pago"
                visible={modalFechaVisible}
                onOk={handleActualizarFecha}
                onCancel={() => {
                    setModalFechaVisible(false);
                    setDetalleSeleccionado(null);
                    formEditarFecha.resetFields();
                }}
                okText="Actualizar"
                cancelText="Cancelar"
            >
                <Form form={formEditarFecha} layout="vertical">
                    <Form.Item
                        name="nuevaFecha"
                        label="Nueva fecha"
                        rules={[{ required: true, message: 'Seleccione la nueva fecha' }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FlujoPagos;
