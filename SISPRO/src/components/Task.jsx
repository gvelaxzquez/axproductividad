import React, { useState, useEffect } from 'react';
import { 
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Tabs,
  Switch,
  message,
  Space,
  Typography,
  Card,
  Upload
} from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import {
  SaveOutlined,
  UserAddOutlined,
  ShareAltOutlined,
  SendOutlined,
  CopyOutlined,
  PrinterOutlined,
  PlayCircleOutlined,
  EditOutlined,
  InboxOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Task = ({
  activityId,
  initialData = {},
  onSave,
  className = ''
}) => {
  // Estados principales
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Estados para las diferentes secciones
  const [showPeerReview, setShowPeerReview] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);

  // Configuración del Editor TinyMCE
  const editorConfig = {
    plugins: 'powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap tinycomments linkchecker emoticons advtable export print',
    toolbar: 'undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat',
    height: '700px'
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (activityId) {
      loadActivityData();
    }
    loadInitialData();
  }, [activityId]);

  const loadActivityData = async () => {
    setLoading(true);
    try {
      // Aquí iría la llamada a tu API
      const response = await fetch(`/api/activities/${activityId}`);
      const data = await response.json();
      setActivity(data);
      form.setFieldsValue({
        title: data.title,
        project: data.projectId,
        sprint: data.sprintId,
        assignedTo: data.assignedUserId,
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
        // ... otros campos
      });
      setEditorContent(data.description);
    } catch (error) {
      message.error('Error al cargar los datos de la actividad');
    }
    setLoading(false);
  };

  const loadInitialData = async () => {
    try {
      // Cargar proyectos, usuarios, sprints, etc.
      const [projectsRes, usersRes, sprintsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/users'),
        fetch('/api/sprints')
      ]);
      
      setProjects(await projectsRes.json());
      setUsers(await usersRes.json());
      setSprints(await sprintsRes.json());
    } catch (error) {
      message.error('Error al cargar datos iniciales');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const activityData = {
        ...values,
        description: editorContent,
        // ... más campos
      };
      
      setLoading(true);
      // Aquí iría tu lógica de guardado
      await fetch('/api/activities', {
        method: activityId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      
      message.success('Actividad guardada exitosamente');
      if (onSave) onSave(activityData);
    } catch (error) {
      message.error('Error al guardar la actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>
          {activity?.id ? `Actividad #${activity.id}` : 'Nueva Actividad'}
        </Title>
        <Space>
          <Button 
            icon={<SaveOutlined />} 
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            Guardar
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="flex-grow"
      >
        <div className="grid grid-cols-12 gap-4">
          {/* Columna Principal */}
          <div className="col-span-8">
            <Form.Item
              name="title"
              label="Título"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Card className="mb-4">
              <div className="mb-2 flex justify-between items-center">
                <Text strong>Descripción</Text>
                <Button 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(!editMode)}
                />
              </div>
              <Editor
                disabled={!editMode}
                value={editorContent}
                onEditorChange={handleEditorChange}
                init={editorConfig}
              />
            </Card>

            {/* Sección de Comentarios */}
            <Card title="Comentarios" className="mb-4">
              {comments.map(comment => (
                <div key={comment.id} className="mb-3 p-3 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <Text strong>{comment.user}</Text>
                    <Text type="secondary">{dayjs(comment.date).format('DD/MM/YYYY HH:mm')}</Text>
                  </div>
                  <Text>{comment.content}</Text>
                </div>
              ))}
              <Form.Item name="newComment">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Button type="primary">Agregar Comentario</Button>
            </Card>
          </div>

          {/* Columna de Detalles */}
          <div className="col-span-4">
            <Card title="Clasificación" className="mb-4">
              <Form.Item 
                name="project" 
                label="Proyecto"
                rules={[{ required: true }]}
              >
                <Select>
                  {projects.map(project => (
                    <Option key={project.id} value={project.id}>
                      {project.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="sprint"
                label="Sprint"
              >
                <Select>
                  {sprints.map(sprint => (
                    <Option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="assignedTo"
                label="Asignado a"
                rules={[{ required: true }]}
              >
                <Select>
                  {users.map(user => (
                    <Option key={user.id} value={user.id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Space direction="vertical" className="w-full">
                <Form.Item 
                  name="startDate" 
                  label="Fecha Inicio"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item 
                  name="endDate" 
                  label="Fecha Fin"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>
              </Space>

              <div className="flex justify-between items-center mt-4">
                <Text>Peer Review</Text>
                <Switch 
                  checked={showPeerReview}
                  onChange={setShowPeerReview}
                />
              </div>
            </Card>

            {/* Archivos Adjuntos */}
            <Card title="Archivos Adjuntos" className="mb-4">
              <Upload.Dragger multiple>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click o arrastra archivos aquí
                </p>
              </Upload.Dragger>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Task;