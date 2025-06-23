import React, { useEffect, useState } from "react";
import { Drawer, Button, Form, Select, DatePicker, Space, message } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import axios from "axios";

const { RangePicker } = DatePicker;

const Filters = ({ onSearch, loading }) => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    // Cargar los proyectos al montar el componente
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/Report/CargaFiltrosLista"); // Reemplaza con tu endpoint
     //  const   data  = await response.data.json();
        if (response.data.Exito) {
             const LstProy =   jQuery.parseJSON(response.data.LstProyectos);
             const LstColab =   jQuery.parseJSON(response.data.LstUsuarios);
             setProjects(LstProy);
             setCollaborators(LstColab);
        }
        else {
            setIsLoading(false);
            message.error(data.Mensaje);
        }
     
      } catch (error) {
        message.error("Error al cargar proyectos");
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = async (selectedProjects) => {
    if (selectedProjects.length === 0) {
      setSprints([]);
  
      return;
    }

    try {
      // Cargar sprints relacionados
      const sprintResponse = await axios.post("/Querys/CargaFiltroSprintLista", { LstProyectos: selectedProjects });

      const LstSprints =   jQuery.parseJSON(sprintResponse.data.LstSprints);
      setSprints(LstSprints);

    } catch (error) {
      message.error("Error al cargar datos relacionados");
      console.error(error);
    }
  };

  const handleFinish = (values) => {
    onSearch(values);
    setIsDrawerVisible(false); // Ocultar el Drawer después de filtrar
  };

  const toggleDrawer = () => {
    setIsDrawerVisible((prev) => !prev);
  };

  return (
    <>
      {/* Botón flotante para abrir el Drawer */}
      <Button
        type="default"
        shape="circle"
        icon={<FilterOutlined />}
        size="large"
        onClick={toggleDrawer}
        style={{
          position: "fixed",
          top: 50,
          right: 16,
          zIndex: 1000,
        }}
      />

      {/* Drawer para los Filtros */}
      <Drawer
        title="Filtros de Búsqueda"
        placement="right"
        onClose={toggleDrawer}
        visible={isDrawerVisible}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Campo de Rango de Fechas */}
            <Form.Item
              name="dateRange"
              label="Rango de Fechas"
              rules={[{ required: true, message: "El rango de fechas es obligatorio" }]}
            >
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* Campo de Proyectos */}
            <Form.Item name="projects" label="Proyectos">
              <Select
                mode="multiple"
                placeholder="Selecciona uno o varios proyectos"
                onChange={handleProjectChange}
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {projects.map((project) => (
                  <Select.Option key={project.IdCatalogo} value={project.IdCatalogo}>
                    {project.DescLarga}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Campo de Sprints */}
            <Form.Item name="sprints" label="Sprints">
              <Select
                mode="multiple"
                placeholder="Selecciona uno o varios sprints"
                allowClear
                disabled={sprints.length === 0}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {sprints.map((sprint) => (
                  <Select.Option key={sprint.IdCatalogo} value={sprint.IdCatalogo}>
                    {sprint.DescLarga}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Campo de Colaboradores */}
            <Form.Item name="collaborators" label="Colaboradores">
              <Select
                mode="multiple"
                placeholder="Selecciona uno o varios colaboradores"
                allowClear
                disabled={collaborators.length === 0}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.props?.children?.props?.children?.[1]
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {collaborators.map((collaborator) => (
                  <Select.Option key={collaborator.IdCatalogo} value={collaborator.IdCatalogo}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={ "http://app.yitpro.com/Archivos/Fotos/" + collaborator.DescCorta + ".jpg" || "./Archivos/Fotos/default.jpg"} // Usa una foto predeterminada si no tiene una
                        alt={collaborator.DescCorta}
                        style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
                      />
                      {collaborator.DescLarga}
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Botón de Filtrar */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Filtrar
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Drawer>
    </>
  );
};

export default Filters;
