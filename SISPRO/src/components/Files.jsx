import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Upload,
  Space,
  Modal,
  Input,
  message,
  Dropdown,
  Tooltip,
  Typography,
  Col, 
  Row,
  Card,
  Skeleton
} from "antd";
import {
  UploadOutlined,
  LinkOutlined,
  PlusOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  InboxOutlined,
  DeleteOutlined,
  DownloadOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
const { Dragger } = Upload;
const { Text, Link } = Typography;
const Files = ({ IdWorkSpaceTab }) => {
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isUrlModalVisible, setIsUrlModalVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    if (!IdWorkSpaceTab) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "/Workspace/ConsultaArchivosWorkspaceTab",
        { IdWorkSpaceTab: IdWorkSpaceTab }
      );

      if (response.data.Exito) {
        const files = JSON.parse(response.data.Files);

        setFiles(files);
      } else {
        console.log(response);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fileExtensions = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
  ];

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: fileExtensions.join(","),
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("IdWorkSpaceTab", IdWorkSpaceTab);

        const response = await fetch("/Files/Upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          onSuccess("ok");
          message.success("Archivo subido correctamente");
          // Cerrar el modal
          setIsUploadModalVisible(false);
          // Limpiar el control de upload
          setFileList([]);

          fetchFiles();
        } else {
          onError(result.message);
          message.error(result.message);
        }
      } catch (error) {
        onError(error);
        message.error("Error al subir el archivo");
      }
    },
    fileList: fileList,
    onChange(info) {
      setFileList(info.fileList);
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  // const handleDelete = (record) => {
  //   Modal.confirm({
  //     title: "¿Estás seguro que deseas eliminar este archivo?",
  //     content: `${record.name} será eliminado permanentemente.`,
  //     okText: "Sí",
  //     okType: "danger",
  //     cancelText: "No",
  //     onOk() {
  //       // Implementar lógica de eliminación
  //       message.success(`${record.name} ha sido eliminado`);
  //     },
  //   });
  // };

  const handleDownload = async (record) => {
    try {

      if(record.BlobId)
      {
      // Primero hacemos una petición al API para obtener la URL o el archivo
     
      const response = await fetch("/Files/Download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdWorkSpaceTab: IdWorkSpaceTab,
          Nombre: record.Nombre,
          BlobId: record.BlobId
        }),
      });

      // Verificar el tipo de contenido de la respuesta
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }
  
      // Si es una URL directa (en caso de archivos externos)
      if (contentType === 'application/json') {
        const data = await response.json();
        if (data.url) {
          window.open(data.url, '_blank');
        } else {
          message.error('Error: URL no disponible');
        }
        return;
      }
  
      // Si es un archivo, procesar el blob y descargarlo
      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let fileName = record.name; // Usar el nombre del registro por defecto
  
      // Intentar obtener el nombre del archivo del header
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1].replace(/['"]/g, ''));
        }
      }
  
      // Crear una URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      message.success('Archivo descargado correctamente');

      }
      else {

        window.open(record.URL, '_blank', 'noopener,noreferrer')

      }

    } catch (error) {
      console.error('Error en la descarga:', error);
      message.error('Error al descargar el archivo');
    }
  };

  const handleDelete = async (record) => {
    try {
      // Mostrar confirmación antes de eliminar
      Modal.confirm({
        title: '¿Estás seguro que deseas eliminar este archivo?',
        content: `El archivo "${record.Nombre}" será eliminado permanentemente.`,
        okText: 'Sí, eliminar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk: async () => {
          try {
           
            const response = await fetch("/Files/Delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                IdWorkSpaceTab: IdWorkSpaceTab,
                IdWorkSpaceTabFile: record.IdWorkSpaceTabFile,
                BlobId: record.BlobId
              }),
            });
            const result = await response.json();
  
            if (result.success) {
              message.success('Archivo eliminado correctamente');

              fetchFiles();
            } else {
              message.error(result.message || 'Error al eliminar el archivo');
            }
          } catch (error) {
            console.error('Error en la eliminación:', error);
            message.error('Error al eliminar el archivo');
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al procesar la solicitud');
    }
  };


  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Función para manejar el envío de URL
  const handleUrlSubmit = async () => {
    // Validar que la URL sea válida
    if (!isValidUrl(fileUrl)) {
      message.error("Por favor ingrese una URL válida");
      return;
    }

    if (!fileName.trim()) {
      message.error('Por favor ingrese un nombre para el archivo');
      return;
    }
  
    try {
      const response = await fetch("/Files/SaveUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdWorkSpaceTab: IdWorkSpaceTab,
          Url: fileUrl,
          Nombre: fileName
        }),
      });

      const result = await response.json();

      if (result.success) {
        message.success("URL guardada correctamente");
        setFileUrl(""); 
        setFileName('');
        setIsUrlModalVisible(false); // Cerrar el modal
        fetchFiles();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("Error al guardar la URL");
    }
  };

  // Menú de opciones para el botón Agregar
  const addMenuItems = [
    {
      key: "upload",
      icon: <UploadOutlined />,
      label: "Cargar archivo",
      onClick: () => setIsUploadModalVisible(true),
    },
    {
      key: "url",
      icon: <LinkOutlined />,
      label: "Agregar por URL",
      onClick: () => setIsUrlModalVisible(true),
    },
  ];

  // Columnas de la tabla
  const columns = [
    {
      title: "Nombre",
      dataIndex: "Nombre",
      key: "Nombre",
      render: (text, record) => (
        <div className="file-name-cell" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Space>
              {getFileIcon(record.Tipo)}
              <Link
                className="file-link"
                onClick={(e) => handleDownload(record, e)}
                style={{
                  color: "#000",
                  maxWidth: "500px", // ajusta según necesites
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {record.Nombre == "" ? record.URL : text}
              </Link>
            </Space>

            {/* Botones de acción en hover */}
            <div
              className="hover-actions"
              style={{
                display: "none",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#fff",
                padding: "0 8px",
              }}
            >
              <Space>
                <Tooltip title="Descargar">
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={(e) => handleDownload(record, e)}
                  />
                </Tooltip>
                <Tooltip title="Eliminar">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => handleDelete(record, e)}
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "FechaCreo",
      key: "FechaCreo",
      width: 200,
      render: (_, record) => (
        <Text>
          {record.FechaCreo
            ? `${dayjs(record.FechaCreo).format("DD/MM/YYYY")}`
            : "Sin fecha"}
        </Text>
      ),
    },
    {
      title: "Creado por",
      dataIndex: "Creo",
      key: "Creo",
      width: 200,
    },
  ];

  // Función para obtener el ícono según el tipo de archivo
  const getFileIcon = (type) => {
    switch (type) {
      case "docx":
        return <FileWordOutlined style={{ color: "#2B579A" }} />;
      case "xlsx":
        return <FileExcelOutlined style={{ color: "#217346" }} />;
      case "pdf":
        return <FilePdfOutlined style={{ color: "#FF0000" }} />;
      case "image/jpg":
      case "image/png":
        return <FileImageOutlined style={{ color: "#FFB400" }} />;
      case "web":
        return <GlobalOutlined style={{ color: "#1677FF" }} />;
      default:
        return <FileOutlined style={{ color: "#1677FF" }} />;
    }
  };

  
    const renderLoadingSkeleton = (columns = 6) => (
      <Row gutter={16}>
        {Array.from({ length: columns }).map((_, index) => (
          <Col key={index} span={24 / columns}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
        ))}
      </Row>
    );
    

  return (
    <div className="file-manager">
      {isLoading ? (

          renderLoadingSkeleton(1)
      ): (
       <>
      <div className="p-4 border-b">
        <Dropdown menu={{ items: addMenuItems }} placement="bottomLeft">
          <Button type="default" icon={<PlusOutlined />}>
            Agregar
          </Button>
        </Dropdown>
      </div>

      {/* Tabla de archivos */}
      <Table columns={columns} dataSource={files} pagination={false} />

      {/* Modal de carga de archivos */}
      <Modal
        title="Cargar archivo"
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          setFileList([]);
        }}
        afterClose={() => setFileList([])}
        footer={null}
        width={600}
      >
        <Dragger {...uploadProps} className="mt-4">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Haz clic o arrastra archivos a esta área para cargarlos
          </p>
          <p className="ant-upload-hint">
            Tipos permitidos: PDF, JPG, PNG, Word, Excel
          </p>
        </Dragger>
      </Modal>

      {/* Modal para agregar URL */}
      <Modal
        title="Agregar por URL"
        open={isUrlModalVisible}
        onCancel={() => {
          setIsUrlModalVisible(false);
          setFileUrl("");
        }}
        onOk={handleUrlSubmit}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <div style={{ marginBottom: "8px" }}>Nombre del archivo</div>
            <Input
              placeholder="Ingrese el nombre del archivo"
              value={fileName}
              maxLength={200}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>URL del archivo</div>
            <Input
              placeholder="https://ejemplo.com/archivo.pdf"
              value={fileUrl}
              maxLength={2000}
              onChange={(e) => setFileUrl(e.target.value)}
              onPressEnter={handleUrlSubmit}
            />
          </div>
        </Space>
      </Modal>
       </>

      ) }

      <style jsx>{`
        .file-name-cell {
          padding-right: 100px; /* Espacio para los botones */
        }
        .file-name-cell:hover .hover-actions {
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default Files;
