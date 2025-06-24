import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FlujoPagoDetModel } from '../../../model/FlujoPago.model';
import { formatMoney } from '../../../utils/format.util';

export const buildColumnsFlujoPago = (
    avanceProyecto: number,
    onEdit: (row: FlujoPagoDetModel) => void,
    onDelete: (row: FlujoPagoDetModel) => void

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
                <a className="BtnEditarFPD" style={{ cursor: 'pointer' }} onClick={() => { onEdit(row) }}>
                    {row.concepto}
                </a>
            ),
        },
        {
            title: '% Avance',
            dataIndex: 'procentaje',
            align: 'right',
            render: (value, row) => {
                const formatted = `${(value ?? 0).toFixed(2)} %`;
                if ((value ?? 0) <= avanceProyecto) {
                    return <span className="btn btn-success btn-small" style={{ width: '80%', textAlign: 'right' }
                    }> {formatted} </span>;
                }
                return row.vencido
                    ? <span className="btn btn-danger btn-small" style={{ width: '80%', textAlign: 'right' }
                    }> {formatted} </span>
                    : <span>{formatted} </span>;
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
            render: val => (
                <span className="btn btn-default btn-small btnFechaDev" style={{ width: '80%', textAlign: 'center' }
                }>
                    {val ? dayjs(val).format('DD/MM/YYYY') : 'Sin asignar'}
                </span>
            ),
        },
        {
            title: 'Fecha factura',
            dataIndex: 'fechaFactura',
            align: 'center',
            render: val => (
                <span className="btn btn-default btn-small btnFechaFactura" style={{ width: '80%', textAlign: 'center' }
                }>
                    {val ? dayjs(val).format('DD/MM/YYYY') : 'Sin asignar'}
                </span>
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
            render: val => (
                <span className="btn btn-default btn-small btnFechaProgramada" style={{ width: '80%', textAlign: 'center' }
                }>
                    {val ? dayjs(val).format('DD/MM/YYYY') : 'Sin asignar'}
                </span>
            ),
        },
        {
            title: 'Fecha pagada',
            dataIndex: 'fechaPagoReal',
            align: 'center',
            render: val => (
                <span className="btn btn-default btn-small btnFechaPago" style={{ width: '80%', textAlign: 'center' }
                }>
                    {val ? dayjs(val).format('DD/MM/YYYY') : 'Sin asignar'}
                </span>
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
                    <Tooltip title="Eliminar">
                        <Button
                            icon={<DeleteOutlined />}
                            className="btnEliminarFlujoDetalle"
                            size="small"
                            danger
                        />
                    </Tooltip>
                </Popconfirm>
            )
        },
    ];
