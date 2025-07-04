import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, FileTextOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FlujoPagoDetModel } from '../../../model/FlujoPago.model';
import { formatMoney } from '../../../utils/format.util';

export const buildColumnsFlujoPago = (
    avanceProyecto: number,
    onEdit: (row: FlujoPagoDetModel) => void,
    onDelete: (row: FlujoPagoDetModel) => void,
    onFechaDev: (row: FlujoPagoDetModel) => void,
    onFechaFactura: (row: FlujoPagoDetModel) => void,
    onFechaProgramada: (row: FlujoPagoDetModel) => void,
    onFechaPago: (row: FlujoPagoDetModel) => void
): ColumnsType<FlujoPagoDetModel> => [
    {
        title: '#',
        dataIndex: 'secuencia',
        align: 'center'
    },
    {
        title: 'Concepto',
        dataIndex: 'concepto',
        render: (_, row) => (
            <Tooltip title="Editar concepto">
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    style={{ padding: 0, fontWeight: 500 }}
                    onClick={() => onEdit(row)}
                    tabIndex={0}
                    aria-label="Editar concepto"
                >
                    {row.concepto}
                </Button>
            </Tooltip>
        ),
    },
    {
        title: '% Avance',
        dataIndex: 'procentaje',
        align: 'right',
        render: (value, row) => {
            const formatted = `${(value ?? 0).toFixed(2)} %`;
            if ((value ?? 0) <= avanceProyecto) {
                return (
                    <Tooltip title="Avance dentro del proyecto">
                        <span className="btn btn-success btn-small" style={{ width: '80%', textAlign: 'right', display: 'inline-block' }}>
                            {formatted}
                        </span>
                    </Tooltip>
                );
            }
            return row.vencido
                ? (
                    <Tooltip title="Avance vencido">
                        <span className="btn btn-danger btn-small" style={{ width: '80%', textAlign: 'right', display: 'inline-block' }}>
                            {formatted}
                        </span>
                    </Tooltip>
                )
                : <span>{formatted}</span>;
        },
    },
    {
        title: 'Fecha planeada',
        dataIndex: 'fechaDevOriginal',
        align: 'center',
        render: val => val ? dayjs(val).format('DD/MM/YYYY') : '',
    },
    {
        title: 'Fecha compromiso',
        dataIndex: 'fechaDev',
        align: 'center',
        render: (_, row) => (
            <Tooltip title="Editar fecha compromiso">
                <Button
                    type="default"
                    size="small"
                    icon={<CalendarOutlined />}
                    className="btnFechaDev"
                    style={{ width: '80%', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => onFechaDev(row)}
                    tabIndex={0}
                    aria-label="Editar fecha compromiso"
                >
                    {row.fechaDev ? dayjs(row.fechaDev).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            </Tooltip>
        ),
    },
    {
        title: 'Fecha factura',
        dataIndex: 'fechaFactura',
        align: 'center',
        render: (_, row) => (
            <Tooltip title="Editar fecha factura">
                <Button
                    type="default"
                    size="small"
                    icon={<FileTextOutlined />}
                    className="btnFechaFactura"
                    style={{ width: '80%', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => onFechaFactura(row)}
                    tabIndex={0}
                    aria-label="Editar fecha factura"
                >
                    {row.fechaFactura ? dayjs(row.fechaFactura).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            </Tooltip>
        ),
    },
    {
        title: 'Factura',
        dataIndex: 'factura',
        align: 'left',
    },
    {
        title: 'Fecha programada pago',
        dataIndex: 'fechaProgramadaPago',
        align: 'center',
        render: (_, row) => (
            <Tooltip title="Editar fecha programada de pago">
                <Button
                    type="default"
                    size="small"
                    icon={<CalendarOutlined />}
                    className="btnFechaProgramada"
                    style={{ width: '80%', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => onFechaProgramada(row)}
                    tabIndex={0}
                    aria-label="Editar fecha programada de pago"
                >
                    {row.fechaProgramadaPago ? dayjs(row.fechaProgramadaPago).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            </Tooltip>
        ),
    },
    {
        title: 'Fecha pagada',
        dataIndex: 'fechaPagoReal',
        align: 'center',
        render: (_, row) => (
            <Tooltip title="Editar fecha de pago real">
                <Button
                    type="default"
                    size="small"
                    icon={<DollarOutlined />}
                    className="btnFechaPago"
                    style={{ width: '80%', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => onFechaPago(row)}
                    tabIndex={0}
                    aria-label="Editar fecha de pago real"
                >
                    {row.fechaPagoReal ? dayjs(row.fechaPagoReal).format('DD/MM/YYYY') : 'Sin asignar'}
                </Button>
            </Tooltip>
        ),
    },
    {
        title: 'Amortizadas',
        dataIndex: 'amortizadas',
        align: 'right',
        render: val => (val ?? 0).toFixed(2),
    },
    {
        title: 'Horas',
        dataIndex: 'horas',
        align: 'right',
        render: val => (val ?? 0).toFixed(2),
    },
    {
        title: 'Subtotal',
        dataIndex: 'monto',
        align: 'right',
        render: val => formatMoney(val ?? 0),
    },
    {
        title: 'IVA',
        dataIndex: 'iVA',
        align: 'right',
        render: val => formatMoney(val ?? 0),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        align: 'right',
        render: val => formatMoney(val ?? 0),
    },
    {
        title: '',
        align: 'center',
        render: (_, row) => (
            <Popconfirm
                title="¿Desea eliminar este registro?"
                okText="Sí"
                cancelText="No"
                onConfirm={() => onDelete(row)}
            >
                <Tooltip title="Eliminar registro">
                    <Button
                        icon={<DeleteOutlined />}
                        className="btnEliminarFlujoDetalle"
                        size="small"
                        danger
                        tabIndex={0}
                        aria-label="Eliminar registro"
                        style={{ marginLeft: 4 }}
                    />
                </Tooltip>
            </Popconfirm>
        )
    },
];
