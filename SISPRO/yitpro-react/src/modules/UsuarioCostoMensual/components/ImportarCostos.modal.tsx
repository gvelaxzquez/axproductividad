/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    DeleteOutlined,
    FileExcelTwoTone,
    InboxOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {
    Button,
    Divider,
    Input,
    Modal,
    Popconfirm,
    Table,
    Typography,
    Upload
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { apiRoutes, useUsuarioCostoStore } from '../store/usuarioCostoMensual.store';
import { formatMoney } from '../../../utils/format.util';

const { Dragger } = Upload;
const { Text, Title, Paragraph } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
}

const ImportarCostosModal: React.FC<Props> = ({ open, onClose }) => {
    const { importCostos, anio, mes } = useUsuarioCostoStore();
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const columns: ColumnsType<any> = [
        {
            title: 'Clave',
            dataIndex: 'Clave',
            key: 'Clave',
            width: "25%",
        },
        {
            title: 'Nombre',
            dataIndex: 'Nombre',
            key: 'Nombre',
            width: "40%",
        },
        {
            title: 'Costo',
            dataIndex: 'Costo',
            key: 'Costo',
            width: "25%",
            render: (_: any, record: any, idx: number) => (
                <Input
                    type="number"
                    min={0}
                    value={record.Costo}
                    prefix="$"
                    onChange={val => handleCostoChange(idx, +val.target.value)}
                    style={{ width: '100%' }}
                />
            )
        },
        {
            width: "10%",
            key: 'acciones',
            render: (_: any, _record: any, idx: number) => (
                <Popconfirm title="Eliminar registro?" onConfirm={() => handleDeleteRow(idx)}>
                    <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                </Popconfirm>
            )
        }
    ];

    // 1) Leer y parsear el Excel
    const handleBeforeUpload = async (file: RcFile) => {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });
        setPreviewData(json);

        const uploadFile: UploadFile = {
            uid: file.uid,             // RcFile has uid
            name: file.name,
            status: 'done',
            originFileObj: file
        };
        setFileList([uploadFile]);
        return false; // evita upload automático
    };

    // 2) Editar Costo
    const handleCostoChange = (row: number, val: number) => {
        setPreviewData(prev => {
            const next = [...prev];
            next[row].Costo = val;
            return next;
        });
    };

    // 3) Eliminar fila
    const handleDeleteRow = (row: number) => {
        setPreviewData((prev) => prev.filter((_, i) => i !== row));
    };

    const handleUpload = async () => {
        if (!fileList.length) return;

        const ws = XLSX.utils.json_to_sheet(previewData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        // const newFile = new File([blob], fileList[0].name, { type: fileList[0].type });

        const formData = new FormData();
        const fileName = fileList[0].name;
        const xlsxFile = new File(
            [blob],
            fileName,
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        );
        formData.append('archivo', xlsxFile);
        // formData.append('archivo', newFile);
        formData.append('Anio', anio.toString());
        formData.append('Mes', mes.toString());


        await importCostos(formData);
        onClose();
        setPreviewData([]);
        setFileList([]);


    };

    return (
        <Modal
            open={open}
            title="Carga de costos mensuales"
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {/* Paso 1: Descargar plantilla */}
            <div className="import-step-box">
                <div className="import-step-row">
                    <div className="import-step-number">1</div>
                    <div style={{ flex: 1 }}>
                        <Title level={5}>Descargar Plantilla</Title>
                        <Text>Descarga la plantilla de Excel con el formato requerido</Text>
                    </div>
                    <Button
                        type="default"
                        icon={<FileExcelTwoTone twoToneColor="#3d7520ff" />}
                        href={apiRoutes.descargarFormato}
                        target="_blank"
                        style={{ borderColor: '#3d7520ff', color: '#3d7520ff' }}
                    >
                        Descargar Plantilla
                    </Button>
                </div>
            </div>

            {/* Paso 2: Subir archivo */}
            <div className="import-step-box">
                <div className="import-step-row">
                    <div className="import-step-number">2</div>
                    <div style={{ flex: 1 }}>
                        <Title level={5}>Subir Archivo Excel</Title>
                        <Text>Selecciona o arrastra tu archivo Excel para cargar los datos</Text>
                        <Dragger
                            accept=".xlsx"
                            beforeUpload={handleBeforeUpload}
                            fileList={fileList}
                            onRemove={() => {
                                setFileList([]);
                                setPreviewData([]);
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p>Arrastra tu archivo o haz clic para seleccionarlo</p>
                            <p>Solo archivos .xlsx</p>
                        </Dragger>
                        {/* Paso de PREVIEW */}
                        {previewData.length > 0 && (
                            <>
                                <Title level={5}>Vista previa</Title>
                                <Table
                                    className="sticky-summary"
                                    dataSource={previewData}
                                    columns={columns}
                                    rowKey={(_, idx) => idx}
                                    pagination={false}
                                    scroll={{ y: 300 }}
                                    tableLayout="fixed"
                                    style={{ flex: 1, overflowY: 'auto' }}
                                    size="small"
                                    summary={() => {
                                        const total = previewData.reduce((acc, p) => acc + p.Costo, 0);
                                        return (
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0}><strong>{previewData.length} Recursos</strong></Table.Summary.Cell>
                                                <Table.Summary.Cell index={2} align="right">
                                                    <strong>Total {formatMoney(total.toFixed(2))}</strong>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        );
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Paso 3: Procesar */}
            <div className="import-step-box">
                <div className="import-step-row">
                    <div className="import-step-number">3</div>
                    <div style={{ flex: 1 }}>
                        <Title level={5}>Aceptar y Guardar Carga</Title>
                        <Text>Haz clic para procesar el archivo y cargar los costos</Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        disabled={!fileList.length}
                        onClick={handleUpload}
                    >
                        Guardar Costos
                    </Button>
                </div>
            </div>

            <Divider />

            <div>
                <Text strong>Instrucciones:</Text>
                <Paragraph style={{ marginTop: 8 }}>
                    <ul>
                        <li>Descarga la plantilla de Excel y complétala con los datos</li>
                        <li>Guarda el archivo en formato <b>.xlsx</b></li>
                        <li>Arrástralo o selecciónalo desde tu equipo</li>
                        <li>Valida que los datos sean correctos</li>
                        <li>Presiona <b>Guardar Costos</b> para importar</li>
                        <li>El sistema validará y procesará automáticamente los datos</li>
                    </ul>
                </Paragraph>
            </div>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Button onClick={onClose}>Cerrar</Button>
            </div>
        </Modal>
    );
};

export default ImportarCostosModal;
