import React, { useState } from 'react';
import { Modal, Upload, Radio, Button, message, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

const TaskImport = ({ visible, onCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [importType, setImportType] = useState("1");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        message.error('Solo se permiten archivos XLSX!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // Prevenir la carga automática
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleSubmit = async () => {

    if (!importType) {
        message.warning('Por favor seleccione un tipo de importación');
        return;
      }

    if (fileList.length === 0) {
      message.warning('Por favor seleccione un archivo');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('Archivo', fileList[0]);
      formData.append('Tipo', importType);

      // Reemplaza esta URL con tu endpoint de .NET
      const response = await axios.post('/Actividades/ImportaActividadesV2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        var Resultado =  response.data.split('|');
        if(Resultado[0] == "E" )
        {
            message.success('Archivo importado exitosamente, actualice para ver los nuevos elementos');
            onCancel();
        }
        else {

            message.error(Resultado[1]);
        }
       
      }
    } catch (error) {
      message.error('Error al importar el archivo: ' + (error.response?.data?.Mensaje || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Importar elementos en XLSX"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          loading={loading}
          disabled={fileList.length === 0 || loading}
        >
          Importar
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Radio.Group 
          value={importType} 
          onChange={(e) => setImportType(e.target.value)}
          disabled={loading}
        >
          <Radio value="1">Carga</Radio>
          <Radio value="2">Actualización</Radio>
        </Radio.Group>
      </div>

      <Dragger {...uploadProps} disabled={loading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Haga clic o arrastre el archivo a esta área para cargarlo
        </p>
        <p className="ant-upload-hint">
          Solo se permiten archivos XLSX
        </p>
      </Dragger>

      {uploadProgress > 0 && (
        <Progress 
          percent={uploadProgress} 
          status="active" 
          style={{ marginTop: 16 }}
        />
      )}

     <div style={{ marginTop: 16 }}>
        {/* Reemplaza esta URL con la ubicación de tu plantilla */}
        <a href="/Archivos/Formatos/Layout_act.xlsx" download>
          Descargar ejemplo formato XLSX
        </a>
        <span style={{ marginLeft: 8, color: '#888' }}>
          para ver el formato requerido
        </span>
      </div>
    </Modal>
  );
};

export default TaskImport;

