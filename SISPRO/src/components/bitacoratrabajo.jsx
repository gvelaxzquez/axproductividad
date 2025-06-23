import React, { useState } from "react";
import { Table, Button, message, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX
import Filters from "./Filters"; // Importa el componente de filtros

const BitacoraTrabajo = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState({
    projects: [],
    sprints: [],
    collaborators: [],
    dateRange: [null, null],
  });



  const columns = [
    {
      title: "Recurso",
      dataIndex: "Nombre",
      key: "Nombre",
      onFilter: (value, record) => record.Nombre.includes(value),
    },
    {
      title: "Fecha",
      dataIndex: "Fecha",
      key: "Fecha",
      render: (Fecha) => dayjs(Fecha).format("YYYY-MM-DD"),
      onFilter: (value, record) => record.Fecha.includes(value),
    },
    {
      title: "Horas Totales",
      dataIndex: "Horas",
      key: "Horas",
      render: (Horas) => `${Horas} horas`,
    },
    {
      title: "Total de Tareas",
      dataIndex: "Total",
      key: "Total",
    },
  ];

  const detailColumns = [

    {
        title: "Id",
        dataIndex: "IdActividadStr",  // Usamos IdActividadStr para mostrar el texto en el enlace
        key: "IdActividadStr",
        render: (IdActividadStr, record) => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Previene el comportamiento por defecto
              clickalerta(record.IdActividad); // Enviamos IdActividad al modal
            }}
          >
            {IdActividadStr}  {/* Muestra IdActividadStr como texto */}
          </a>
        ),
      },
    {
      title: "Tarea",
      dataIndex: "Titulo",
      key: "Titulo",
    },
    {
      title: "Horas",
      dataIndex: "Tiempo",
      key: "Tiempo",
    },
    {
      title: "Comentario",
      dataIndex: "Comentario",
      key: "Comentario",
    },
  ];

  // Maneja la búsqueda desde el formulario de filtros
  const handleSearch = async (values) => {
    setLoading(true);
    try {


        setFilters({
            projects: values.projects,
            sprints: values.sprints,
            collaborators: values.collaborators,
            dateRange: values.dateRange,
          });

      const Filtros = {
        LstProyecto: values.projects,
        LstSprint: values.sprints,
        LstAsignado: values.collaborators,
        FechaSolIni : values.dateRange[0].format("YYYY-MM-DD"),
        FechaSolFin: values.dateRange[1].format("YYYY-MM-DD"),
      };

      const response = await axios.post("/Report/ConsultaBitacoraTrabajo", Filtros); // Cambia la URL según tu backend

      if (response.data.Exito) {
           setTableData(jQuery.parseJSON(response.data.LstReporte));
        }
         else {
       message.error(response.data.Mensaje);
         }    





    } catch (error) {
      console.error("Error al cargar tareas:", error);
      message.error("Hubo un error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Preparar los datos en un formato compatible
    const formattedData = tableData.map((row) => ({
      Recurso: row.Nombre,
      Fecha: row.Fecha,
      "Horas Totales": row.Horas,
      "Total de Tareas": row.Total,
    }));

    // Crear un libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bitácora");

    // Generar archivo Excel y disparar la descarga
    XLSX.writeFile(workbook, "bitacora_trabajo.xlsx");
  };


  return (
    <div>
      {/* Componente de Filtros */}
      <Filters onSearch={handleSearch} loading={loading} />

      <Space style={{ marginBottom: 16 }}>
        <Button type="default" onClick={exportToExcel} loading={loading}>
          Exportar a Excel
        </Button>
      </Space>

      {/* Tabla de resultados */}
      <Table
        dataSource={tableData}
        columns={columns}
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              dataSource={record.LstActividades}
              columns={detailColumns}
              pagination={false}
              rowKey="IdKey"
            />
          ),
          rowExpandable: (record) => record.LstActividades && record.LstActividades.length > 0,
        }}
        rowKey="IdKey"
      />



    </div>
  );
};

export default BitacoraTrabajo;
