/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Empty, Form, Modal, Progress, Row, Select, Table, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import CustomFormModal from '../components/Common/CustomFormModal';
import type { FlujoPagoDetModel } from '../model/FlujoPago.model';
import { convertToPascalCase } from '../utils/convertPascal';
import { formatMoney, formatNumber } from '../utils/format.util';
import type { FlujoDetalle } from './Proyectos/FlujoDePagos/flujoPagoDetalle.store';
import useFlujoPagosStore from './Proyectos/FlujoDePagos/flujoPagoDetalle.store';
import { buildColumnsFlujoPago } from './Proyectos/FlujoDePagos/flujoPagoDetalles.columns';
import EditarProyectoModal from './Proyectos/FlujoDePagos/forms/editarProyecto.form';
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
        importarFPD,
        eliminarFPD,
        guardarDatosProyecto,

        actualizarFecha,
        actualizarRelacion
    } = useFlujoPagosStore();

    // Estados locales para control de formularios y modales
    const [formRelacion] = Form.useForm();
    const [formEditarFecha] = Form.useForm();
    const [modalEditarVisible, setModalEditarVisible] = useState(false);
    const [modalRelacionVisible, setModalRelacionVisible] = useState(false);
    const [modalFechaVisible, setModalFechaVisible] = useState(false);
    const [detalleParaRelacion, setDetalleParaRelacion] = useState<FlujoDetalle | null>(null);
    const [opcionesPago, setOpcionesPago] = useState<{ value: number; label: string }[]>([]);

    const [detalleSeleccionado, setDetalleSeleccionado] = useState<FlujoPagoDetModel | null>(null);
    const [pagosExcel, setPagosExcel] = useState<any[]>([]);
    const [modalPagosVisible, setModalPagosVisible] = useState(false);


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
    const handleEditarProyecto = async (data: any) => {
        try {
            const _res = {
                ...data,
                IdFlujoPago: idFlujo,
                IdProyecto: flujo.idProyecto ?? 0,
                activo: data.activo === undefined ? false : data.activo
            };
            await guardarDatosProyecto(convertToPascalCase(_res));
            setModalEditarVisible(false);
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



    const handleCargarExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = (evt: any) => {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets['Anexo 2 - Flujo de pago'];
                if (!sheet) return message.error('Hoja "Flujo Pagos" no encontrada');

                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

                // Buscar fila de encabezados (col 4 === 'No de Pago')
                const headerRowIndex = rows.findIndex(row => row[4]?.toString().toLowerCase().includes('no de pago'));
                if (headerRowIndex === -1) return message.error('Encabezado "No de Pago" no encontrado');
                console.log('Encabezados encontrados:', rows[headerRowIndex]);
                // Procesar filas desde ahí hacia abajo
                const dataRows = rows.slice(headerRowIndex + 1).filter(row => !isNaN(Number(row[4])));

                const pagos = dataRows.map(row => {
                    const monto = parseFloat((row[17] + '').replace(/[^0-9.-]+/g, '')) || 0;
                    const iva = monto * ((flujo?.porcIVA ?? 0) / 100);
                    const total = monto + iva;
                    return ({
                        secuencia: Number(row[4]),                         // No de Pago
                        porcentaje: Math.round(row[9] * 100),                      // % Avance
                        horas: Number(row[12]),                             // Horas
                        monto,
                        concepto: row[21] || '',                            // Concepto
                        amortizadas: 0,
                        id: 0,
                        iva,
                        total,
                        IdFlujoPago: idFlujo,
                        IdFlujoPagoDet: 0

                    })
                });
                setPagosExcel(pagos);
                setModalPagosVisible(true);
                (document.getElementById('excelInput') as HTMLInputElement).value = '';
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error);
            message.error('Error al procesar el archivo');
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
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Title level={4} style={{ margin: 0 }}>{flujo.nombreProy}</Title>
                                        <Button size="small" type="default" icon={<EditOutlined />} onClick={() => setModalEditarVisible(true)} />
                                    </div>
                                }
                            >
                                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                    <Text><strong>Horas totales:</strong> {flujo.horasTotales}</Text>
                                    <Text><strong>Precio hora:</strong> {formatMoney(flujo.precioHora)}</Text>
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
                                            format={(value) => value < 100 ? `${value}%` : <ExclamationCircleTwoTone style={{fontSize:42}} twoToneColor={colorDesfase(indicadores?.desfaseProc ?? 0)} />}
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
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Button
                                            type="default"
                                            onClick={() => {
                                                const input = document.getElementById('excelInput') as HTMLInputElement;
                                                if (input) input.click();
                                            }}
                                        >
                                            Cargar archivo Excel
                                        </Button>
                                        <input
                                            id="excelInput"
                                            type="file"
                                            accept=".xlsx"
                                            onChange={handleCargarExcel}
                                            style={{ display: 'none' }}
                                        />
                                        <Button type="primary" onClick={() => handleNuevoDetalle()}>
                                            Agregar pago
                                        </Button>
                                    </div>
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
            <CustomFormModal
                open={modalEditarVisible}
                title={"Editar Flujo de pagos | " + flujo?.nombreProy}
                formId={"formFlujoProyecto"}
                onCancel={() => setModalEditarVisible(false)}
            >
                <EditarProyectoModal onSubmit={handleEditarProyecto} />
            </CustomFormModal>




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
            <Modal
                open={modalPagosVisible}
                onCancel={() => setModalPagosVisible(false)}
                onOk={() => {
                    importarFPD(pagosExcel.map(convertToPascalCase)).then(() => {
                        setModalPagosVisible(false);
                        setPagosExcel([]);
                    });
                }}
                okText="Guardar"
                cancelText="Cancelar"
                width={1000}
            >
                <Title level={5}>Pagos cargados desde Excel</Title>
                <Table
                    dataSource={pagosExcel}
                    rowKey="secuencia"
                    pagination={false}
                    columns={[
                        { title: 'Secuencia', dataIndex: 'secuencia' },
                        { title: 'Concepto', dataIndex: 'concepto' },
                        { title: '% Avance', dataIndex: 'porcentaje' },
                        { title: 'Horas', dataIndex: 'horas' },
                        { title: 'Subtotal', dataIndex: 'monto', render: formatMoney },
                        { title: 'IVA', dataIndex: 'iva', render: formatMoney },
                        { title: 'Total', dataIndex: 'total', render: formatMoney },
                    ]}
                    summary={pageData => {
                        const totalHoras = pageData.reduce((sum, row) => sum + (Number(row.horas) || 0), 0);
                        const totalSubtotal = pageData.reduce((sum, row) => sum + (Number(row.monto) || 0), 0);
                        const totalIva = pageData.reduce((sum, row) => sum + (Number(row.iva) || 0), 0);
                        const totalTotal = pageData.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
                        return (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3}><b>Totales</b></Table.Summary.Cell>
                                <Table.Summary.Cell index={3}><b>{formatNumber(totalHoras)}</b></Table.Summary.Cell>
                                <Table.Summary.Cell index={4}><b>{formatMoney(totalSubtotal)}</b></Table.Summary.Cell>
                                <Table.Summary.Cell index={4}><b>{formatMoney(totalIva)}</b></Table.Summary.Cell>
                                <Table.Summary.Cell index={4}><b>{formatMoney(totalTotal)}</b></Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
                <Text type="secondary" style={{ marginTop: "25px" }}>
                    Asegúrese de que los datos sean correctos antes de guardar. Los pagos reemplazarán el flujo de pagos actual.
                </Text>
            </Modal>

        </div>
    );
};

export default FlujoPagos;
