/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    LeftOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Interfaces
interface FlujoDetalle {
    IdFlujoPagoDet: number;
    Secuencia: number;
    Concepto: string;
    Procentaje: number;
    FechaDevOriginal: string | null;
    FechaDev: string | null;
    FechaFactura: string | null;
    Factura: string;
    FechaProgramadaPago: string | null;
    FechaPagoReal: string | null;
    Amortizadas: number;
    Horas: number;
    Monto: number;
    IVA: number;
    Total: number;
    Vencido: boolean;
}

interface Proyecto {
    IdCatalogo: number;
    DescLarga: string;
}

interface FlujoPago {
    IdFlujoPago: number;
    IdProyecto: number;
    NombreProy: string;
    PrecioHora: number;
    HorasTotales: number;
    PorcIVA: number;
    TotalProyecto: number;
    TotalFacturado: number;
    TotalPagado: number;
    Saldo: number;
    SaldoAmortizar: number;
    TotalAmortizadas: number;
    TotalProyectoHoras: number;
    TotalFacturadoHoras: number;
    TotalPagadoHoras: number;
    SaldoHoras: number;
    SaldoAmortizarHoras: number;
    TotalAmortizadoHoras: number;
    HorasAmortizar: number;
    Activo: boolean;
    FlujoDetalle: FlujoDetalle[];
}

interface Indicadores {
    AvanceRealPorc: number;
    AvanceCompPorc: number;
    DesfaseProc: number;
}

interface ActividadRelacionada {
    IdActividad: number;
    IdActividadStr: string;
    Descripcion: string;
    TipoNombre: string;
    TipoUrl: string;
    BR: string;
    IdActividadR1: number;
}

interface DetallePagosProps {
    idFlujo: number;
    proyectos: Proyecto[];
}

const DetallePagosComponent: React.FC<DetallePagosProps> = ({ idFlujo, proyectos }) => {
    // Estados
    const [flujoData, setFlujoData] = useState<FlujoPago | null>(null);
    const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalFlujoVisible, setModalFlujoVisible] = useState(false);
    const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
    const [modalFechaVisible, setModalFechaVisible] = useState(false);
    const [modalFacturaVisible, setModalFacturaVisible] = useState(false);
    const [actividadesRelacionadas, setActividadesRelacionadas] = useState<ActividadRelacionada[]>([]);
    const [avanceProy, setAvanceProy] = useState(0);

    // Forms
    const [formFlujo] = Form.useForm();
    const [formDetalle] = Form.useForm();
    const [formFecha] = Form.useForm();
    const [formFactura] = Form.useForm();

    // Estados para modales
    const [editingDetalle, setEditingDetalle] = useState<FlujoDetalle | null>(null);
    const [tipoFecha, setTipoFecha] = useState(0);
    const [idFlujoDetFecha, setIdFlujoDetFecha] = useState(0);
    const [secuenciaActual, setSecuenciaActual] = useState(1);

    // Cargar datos iniciales
    useEffect(() => {
        if (idFlujo === 0) {
            setModalFlujoVisible(true);
        } else {
            cargarFlujoDetalle();
        }
    }, [idFlujo]);

    // Función para cargar flujo detalle
    const cargarFlujoDetalle = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/Proyectos/ObtieneFlujoDetalle', {
                IdFlujo: idFlujo
            });

            if (response.data) {
                const datos = JSON.parse(response.data.Flujo);
                const indicadoresData = JSON.parse(response.data.Indicadores);

                setFlujoData(datos);
                setIndicadores(indicadoresData);
                setAvanceProy(indicadoresData.AvanceRealPorc);
                setSecuenciaActual(datos.FlujoDetalle.length + 1);
            }
        } catch {
            message.error('Error al cargar los datos del flujo');
        } finally {
            setLoading(false);
        }
    };

    // Función para guardar flujo principal
    const guardarFlujoPrincipal = async (values: any) => {
        try {
            const flujo = {
                IdFlujoPago: idFlujo,
                IdProyecto: values.IdProyecto,
                PrecioHora: values.PrecioHora,
                PorcIVA: values.PorcIVA,
                HorasTotales: values.HorasTotales,
                HorasAmortizar: values.HorasAmortizar,
                Activo: values.Activo || false
            };

            const response = await axios.post('/Proyectos/GuardaFlujoPago', flujo);

            if (response.data.Exito) {
                message.success(response.data.Mensaje);
                setModalFlujoVisible(false);

                if (response.data.Respuesta) {
                    // Redireccionar al nuevo flujo
                    window.location.href = `/Proyectos/DetallePagos/${response.data.Respuesta}`;
                }
            } else {
                message.warning(response.data.Mensaje);
            }
        } catch {
            message.error('Error al guardar el flujo');
        }
    };

    // Función para guardar detalle
    const guardarDetalle = async (values: any) => {
        try {
            const detalle = {
                IdFlujoPago: idFlujo,
                IdFlujoPagoDet: editingDetalle?.IdFlujoPagoDet || 0,
                Secuencia: secuenciaActual,
                Concepto: values.Concepto,
                Horas: values.Horas,
                Amortizadas: values.Amortizadas,
                Procentaje: values.Procentaje,
                Monto: values.Monto
            };

            const response = await axios.post('/Proyectos/GuardaFlujoPagoDetalle', detalle);

            if (response.data.Exito) {
                message.success(response.data.Mensaje);
                setModalDetalleVisible(false);
                cargarFlujoDetalle();
                limpiarFormDetalle();
            } else {
                message.warning(response.data.Mensaje);
            }
        } catch {
            message.error('Error al guardar el detalle');
        }
    };

    // Función para guardar fecha
    const guardarFecha = async (values: any) => {
        try {
            const fechaData = {
                IdFlujoPagoDet: idFlujoDetFecha,
                TipoFecha: tipoFecha,
                Fecha: values.Fecha.format('DD/MM/YYYY')
            };

            const response = await axios.post('/Proyectos/GuardaFlujoPagoFecha', fechaData);

            if (response.data.Exito) {
                message.success(response.data.Mensaje);
                setModalFechaVisible(false);
                cargarFlujoDetalle();
            } else {
                message.warning(response.data.Mensaje);
            }
        } catch {
            message.error('Error al guardar la fecha');
        }
    };

    // Función para guardar fecha factura
    const guardarFechaFactura = async (values: any) => {
        try {
            const facturaData = {
                IdFlujoPagoDet: idFlujoDetFecha,
                TipoFecha: tipoFecha,
                Factura: values.Factura,
                Fecha: values.Fecha.format('DD/MM/YYYY')
            };

            const response = await axios.post('/Proyectos/GuardaFlujoPagoFecha', facturaData);

            if (response.data.Exito) {
                message.success(response.data.Mensaje);
                setModalFacturaVisible(false);
                cargarFlujoDetalle();
            } else {
                message.warning(response.data.Mensaje);
            }
        } catch {
            message.error('Error al guardar la fecha de factura');
        }
    };

    // Función para eliminar detalle
    const eliminarDetalle = async (idDetalle: number) => {
        try {
            const response = await axios.post('/Proyectos/EliminarFlujoPagoDetalle', {
                IdFlujoPagoDet: idDetalle
            });

            if (response.data.Exito) {
                message.success('Registro eliminado correctamente');
                cargarFlujoDetalle();
            } else {
                message.warning(response.data.Mensaje);
            }
        } catch {
            message.error('Error al eliminar el registro');
        }
    };

    // Función para limpiar form detalle
    const limpiarFormDetalle = () => {
        setEditingDetalle(null);
        formDetalle.resetFields();
        setActividadesRelacionadas([]);
    };

    // Función para abrir modal detalle
    const abrirModalDetalle = (detalle?: FlujoDetalle) => {
        if (detalle) {
            setEditingDetalle(detalle);
            formDetalle.setFieldsValue({
                Concepto: detalle.Concepto,
                Horas: detalle.Horas,
                Amortizadas: detalle.Amortizadas,
                Procentaje: detalle.Procentaje,
                Monto: detalle.Monto
            });
            consultarActividadRelaciones(detalle.IdFlujoPagoDet);
        } else {
            limpiarFormDetalle();
            setSecuenciaActual(flujoData?.FlujoDetalle.length ? flujoData.FlujoDetalle.length + 1 : 1);
        }
        setModalDetalleVisible(true);
    };

    // Función para consultar actividades relacionadas
    const consultarActividadRelaciones = async (idFlujoDet: number) => {
        try {
            const response = await axios.post('/actividades/ConsultaActividadRelacionesFPD', {
                IdFlujoPagoDet: idFlujoDet
            });

            if (response.data.Activitys) {
                setActividadesRelacionadas(response.data.Activitys);
            }
        } catch (error) {
            console.error('Error al consultar actividades relacionadas:', error);
        }
    };

    // Función para exportar
    const exportarExcel = () => {
        const formData = new FormData();
        formData.append('IdFlujo', idFlujo.toString());

        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = `/Proyectos/DescargarExcelFlujoPagosDetalle`;
        link.download = 'DetalleFlujoPago.xlsx';
        link.click();
    };

    // Renderizado del componente de avance circular
    const renderCircularProgress = (value: number, color: string, title: string) => {
        const getColor = () => {
            if (title === 'Desfase') {
                if (value <= 5) return '#08C127';
                if (value <= 15) return '#fea223';
                return '#D12106';
            }
            return color;
        };

        return (
            <div style={{ textAlign: 'center' }}>
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        border: `8px solid ${getColor()}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        backgroundColor: '#f0f0f0'
                    }}
                >
                    <Text strong style={{ fontSize: 16 }}>{value}%</Text>
                </div>
                <Text style={{ marginTop: 8, display: 'block' }}>{title}</Text>
            </div>
        );
    };

    // Columnas de la tabla
    const columns: ColumnsType<FlujoDetalle> = [
        {
            title: '#',
            dataIndex: 'Secuencia',
            key: 'Secuencia',
            align: 'center',
            width: 60,
        },
        {
            title: 'Concepto',
            dataIndex: 'Concepto',
            key: 'Concepto',
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => abrirModalDetalle(record)}
                    style={{ padding: 0, textAlign: 'left' }}
                >
                    {text}
                </Button>
            ),
        },
        {
            title: '%Avance',
            dataIndex: 'Procentaje',
            key: 'Procentaje',
            align: 'right',
            render: (value, record) => {
                if (avanceProy >= value) {
                    return <Tag color="success">{value.toFixed(2)}%</Tag>;
                } else if (record.Vencido) {
                    return <Tag color="error">{value.toFixed(2)}%</Tag>;
                }
                return `${value.toFixed(2)}%`;
            },
        },
        {
            title: 'Fecha planeada',
            dataIndex: 'FechaDevOriginal',
            key: 'FechaDevOriginal',
            align: 'center',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '',
        },
        {
            title: 'Fecha compromiso',
            dataIndex: 'FechaDev',
            key: 'FechaDev',
            align: 'center',
            render: (date, record) => (
                <Button
                    size="small"
                    onClick={() => {
                        setTipoFecha(1);
                        setIdFlujoDetFecha(record.IdFlujoPagoDet);
                        setModalFechaVisible(true);
                    }}
                >
                    {date ? dayjs(date).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            ),
        },
        {
            title: 'Fecha factura',
            dataIndex: 'FechaFactura',
            key: 'FechaFactura',
            align: 'center',
            render: (date, record) => (
                <Button
                    size="small"
                    onClick={() => {
                        setTipoFecha(2);
                        setIdFlujoDetFecha(record.IdFlujoPagoDet);
                        setModalFacturaVisible(true);
                    }}
                >
                    {date ? dayjs(date).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            ),
        },
        {
            title: 'Factura',
            dataIndex: 'Factura',
            key: 'Factura',
        },
        {
            title: 'Fecha programada',
            dataIndex: 'FechaProgramadaPago',
            key: 'FechaProgramadaPago',
            align: 'center',
            render: (date, record) => (
                <Button
                    size="small"
                    onClick={() => {
                        setTipoFecha(3);
                        setIdFlujoDetFecha(record.IdFlujoPagoDet);
                        setModalFechaVisible(true);
                    }}
                >
                    {date ? dayjs(date).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            ),
        },
        {
            title: 'Fecha pagada',
            dataIndex: 'FechaPagoReal',
            key: 'FechaPagoReal',
            align: 'center',
            render: (date, record) => (
                <Button
                    size="small"
                    onClick={() => {
                        setTipoFecha(4);
                        setIdFlujoDetFecha(record.IdFlujoPagoDet);
                        setModalFechaVisible(true);
                    }}
                >
                    {date ? dayjs(date).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            ),
        },
        {
            title: 'Amortizadas',
            dataIndex: 'Amortizadas',
            key: 'Amortizadas',
            align: 'right',
            render: (value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
        },
        {
            title: 'Horas',
            dataIndex: 'Horas',
            key: 'Horas',
            align: 'right',
            render: (value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
        },
        {
            title: 'Subtotal',
            dataIndex: 'Monto',
            key: 'Monto',
            align: 'right',
            render: (value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
        },
        {
            title: 'IVA',
            dataIndex: 'IVA',
            key: 'IVA',
            align: 'right',
            render: (value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
        },
        {
            title: 'Total',
            dataIndex: 'Total',
            key: 'Total',
            align: 'right',
            render: (value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="¿Desea eliminar este registro?"
                    onConfirm={() => eliminarDetalle(record.IdFlujoPagoDet)}
                    okText="Sí"
                    cancelText="No"
                >
                    <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div style={{ padding: 24 }}>
            {/* Header del proyecto */}
            <Card>
                <Row gutter={24}>
                    <Col span={12}>
                        <Space direction="vertical" size="small">
                            <div>
                                <Title level={4}>
                                    Proyecto: {flujoData?.NombreProy}
                                    {flujoData?.Activo && <Text type="secondary"> (Archivado)</Text>}
                                    <Button
                                        icon={<EditOutlined />}
                                        style={{ marginLeft: 8 }}
                                        onClick={() => setModalFlujoVisible(true)}
                                    />
                                </Title>
                            </div>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Text>Precio por hora: <strong>${flujoData?.PrecioHora.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></Text>
                                </Col>
                                <Col span={8}>
                                    <Text>Horas totales: <strong>{flujoData?.HorasTotales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></Text>
                                </Col>
                                <Col span={8}>
                                    <Text>IVA(%): <strong>{flujoData?.PorcIVA.toFixed(2)}</strong></Text>
                                </Col>
                            </Row>

                            <div style={{ marginTop: 16 }}>
                                <Text>Estatus de proyecto</Text>
                                <Row gutter={24} style={{ marginTop: 8 }}>
                                    <Col span={8}>
                                        {renderCircularProgress(indicadores?.AvanceRealPorc || 0, '#000070', 'Avance actual')}
                                    </Col>
                                    <Col span={8}>
                                        {renderCircularProgress(indicadores?.AvanceCompPorc || 0, '#000070', 'Avance esperado')}
                                    </Col>
                                    <Col span={8}>
                                        {renderCircularProgress(indicadores?.DesfaseProc || 0, '', 'Desfase')}
                                    </Col>
                                </Row>
                            </div>
                        </Space>
                    </Col>

                    <Col span={11}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th style={{ textAlign: 'right' }}><strong>Monto</strong></th>
                                    <th style={{ textAlign: 'right' }}><strong>Horas</strong></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Total proyecto:</strong></td>
                                    <td style={{ textAlign: 'right' }}>${flujoData?.TotalProyecto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ textAlign: 'right' }}>{flujoData?.TotalProyectoHoras.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total facturado:</strong></td>
                                    <td style={{ textAlign: 'right' }}>${flujoData?.TotalFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ textAlign: 'right' }}>{flujoData?.TotalFacturadoHoras.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Amortizado:</strong></td>
                                    <td style={{ textAlign: 'right' }}>${flujoData?.TotalAmortizadas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ textAlign: 'right' }}>{flujoData?.TotalAmortizadoHoras.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total pagado:</strong></td>
                                    <td style={{ textAlign: 'right' }}>${flujoData?.TotalPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ textAlign: 'right' }}>{flujoData?.TotalPagadoHoras.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td><strong>Saldo amortizar:</strong></td>
                                    <td style={{ textAlign: 'right' }}>${flujoData?.SaldoAmortizar.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ textAlign: 'right' }}>{flujoData?.SaldoAmortizarHoras.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                </tr>
                                <tr style={{ fontWeight: 'bold' }}>
                                    <td><strong>Saldo:</strong></td>
                                    <td style={{ textAlign: 'right' }}>${flujoData?.Saldo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ textAlign: 'right' }}>{flujoData?.SaldoHoras.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>

                    <Col span={1}>
                        <Button
                            icon={<LeftOutlined />}
                            href="/Proyectos/FlujoPagos"
                        >
                            Regresar
                        </Button>
                    </Col>
                </Row>

                <Row style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <div style={{ textAlign: 'right' }}>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => abrirModalDetalle()}
                                >
                                    Nuevo
                                </Button>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={exportarExcel}
                                >
                                    Exportar
                                </Button>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Tabla de detalles */}
            <Card style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={flujoData?.FlujoDetalle || []}
                    rowKey="IdFlujoPagoDet"
                    pagination={false}
                    scroll={{ x: 1500 }}
                />
            </Card>

            {/* Modal Flujo Principal */}
            <Modal
                title="Configuración del Flujo"
                open={modalFlujoVisible}
                onCancel={() => setModalFlujoVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={formFlujo}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={guardarFlujoPrincipal}
                    initialValues={flujoData ? {
                        IdProyecto: flujoData.IdProyecto,
                        PrecioHora: flujoData.PrecioHora,
                        PorcIVA: flujoData.PorcIVA,
                        HorasTotales: flujoData.HorasTotales,
                        HorasAmortizar: flujoData.HorasAmortizar,
                        Activo: flujoData.Activo
                    } : {}}
                >
                    <Form.Item
                        label="Proyecto"
                        name="IdProyecto"
                        rules={[{ required: true, message: 'Seleccione un proyecto' }]}
                    >
                        <Select placeholder="-- Seleccionar --" showSearch>
                            {proyectos.map(p => (
                                <Option key={p.IdCatalogo} value={p.IdCatalogo}>
                                    {p.DescLarga}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Precio por hora"
                        name="PrecioHora"
                        rules={[{ required: true, message: 'Ingrese el precio por hora' }]}
                    >
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="IVA(%)"
                        name="PorcIVA"
                        rules={[{ required: true, message: 'Ingrese el porcentaje de IVA' }]}
                    >
                        <InputNumber min={0} max={100} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Total horas"
                        name="HorasTotales"
                        rules={[{ required: true, message: 'Ingrese el total de horas' }]}
                    >
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Horas amortizar"
                        name="HorasAmortizar"
                        rules={[{ required: true, message: 'Ingrese las horas a amortizar' }]}
                    >
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Archivar"
                        name="Activo"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Guardar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Detalle */}
            <Modal
                title="Detalle del Flujo"
                open={modalDetalleVisible}
                onCancel={() => {
                    setModalDetalleVisible(false);
                    limpiarFormDetalle();
                }}
                footer={null}
                width={1000}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Form
                            form={formDetalle}
                            layout="horizontal"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            onFinish={guardarDetalle}
                        >
                            <Form.Item label="Secuencia">
                                <Text>{editingDetalle?.Secuencia || secuenciaActual}</Text>
                            </Form.Item>

                            <Form.Item
                                label="Concepto"
                                name="Concepto"
                                rules={[{ required: true, message: 'Ingrese el concepto' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Horas"
                                name="Horas"
                                rules={[{ required: true, message: 'Ingrese las horas' }]}
                            >
                                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Horas amortizar"
                                name="Amortizadas"
                                rules={[{ required: true, message: 'Ingrese las horas a amortizar' }]}
                            >
                                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Porcentaje"
                                name="Procentaje"
                                rules={[{ required: true, message: 'Ingrese el porcentaje' }]}
                            >
                                <InputNumber min={0} max={100} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Monto"
                                name="Monto"
                                rules={[{ required: true, message: 'Ingrese el monto' }]}
                            >
                                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                                <Button type="primary" htmlType="submit">
                                    Guardar
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col span={8}>
                        <Collapse defaultActiveKey={['1']}>
                            <Panel header="Items relacionados" key="1">
                                <div style={{ minHeight: 200 }}>
                                    {actividadesRelacionadas.map((actividad) => (
                                        <div key={actividad.IdActividadR1} style={{ marginBottom: 16 }}>
                                            <Card size="small">
                                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <img
                                                            src={`/Content/Project/Imagenes/${actividad.TipoUrl}`}
                                                            alt={actividad.TipoNombre}
                                                            title={actividad.TipoNombre}
                                                            style={{ width: 18, height: 18 }}
                                                        />
                                                        <a
                                                            href={`/Share/s/${actividad.IdActividad}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {actividad.IdActividadStr}
                                                        </a>
                                                        <Popconfirm
                                                            title="¿Desea eliminar esta actividad?"
                                                            onConfirm={() => eliminarActividadRelacion(actividad.IdActividadR1)}
                                                            okText="Sí"
                                                            cancelText="No"
                                                        >
                                                            <Button
                                                                type="text"
                                                                danger
                                                                size="small"
                                                                icon={<DeleteOutlined />}
                                                                style={{ marginLeft: 'auto' }}
                                                            />
                                                        </Popconfirm>
                                                    </div>
                                                    <Text style={{ fontSize: 12 }}>
                                                        {actividad.BR?.split('\n').map((line, i) => (
                                                            <div key={i}>{line}</div>
                                                        ))}
                                                    </Text>
                                                </Space>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </Modal>

            {/* Modal Capturar Fecha */}
            <Modal
                title={`Ingresar fecha - ${getTituloFecha()}`}
                open={modalFechaVisible}
                onCancel={() => setModalFechaVisible(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={formFecha}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={guardarFecha}
                >
                    <Form.Item
                        label="Fecha"
                        name="Fecha"
                        rules={[{ required: true, message: 'Seleccione una fecha' }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                            placeholder="Seleccionar fecha"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Guardar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Capturar Fecha Factura */}
            <Modal
                title="Ingresar fecha de factura"
                open={modalFacturaVisible}
                onCancel={() => setModalFacturaVisible(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={formFactura}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={guardarFechaFactura}
                >
                    <Form.Item
                        label="Factura"
                        name="Factura"
                        rules={[{ required: true, message: 'Ingrese el número de factura' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Fecha"
                        name="Fecha"
                        rules={[{ required: true, message: 'Seleccione una fecha' }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                            placeholder="Seleccionar fecha"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Guardar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );

    // Función auxiliar para obtener el título según el tipo de fecha
    function getTituloFecha(): string {
        switch (tipoFecha) {
            case 1: return 'fecha dev';
            case 3: return 'fecha programada de pago';
            case 4: return 'fecha pago';
            default: return 'fecha';
        }
    }

    // Función para eliminar actividad relacionada
    async function eliminarActividadRelacion(idActividadR1: number) {
        try {
            const response = await axios.post('/actividades/EliminaRelacionActividadFPD', {
                IdFlujoPagoDetAct: idActividadR1
            });

            if (response.data.Exito) {
                message.success('Se eliminó la relación');
                if (editingDetalle) {
                    consultarActividadRelaciones(editingDetalle.IdFlujoPagoDet);
                }
            } else {
                message.warning(response.data.Mensaje);
            }
        } catch {
            message.error('Error al eliminar la relación');
        }
    }
};

export default DetallePagosComponent;