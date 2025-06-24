import React, { useState } from 'react';
import { Modal, Form, Input, Switch, Button } from 'antd';

const CreateWorkspace = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        onSubmit(values);
        form.resetFields();
        onClose();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Crea un espacio de trabajo"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Crear
        </Button>
      ]}
    >
      <div className="space-modal-content">
        <p style={{ color: '#666', marginBottom: '24px' }}>
            Los espacios de trabajo son áreas donde puedes organizar tus proyectos. 
            Puedes crear tantos como necesites y personalizarlos a tu gusto.
        </p>

        <Form
          form={form}
          layout="vertical"
          name="create_space_form"
        >
          <Form.Item
            label="Nombre"
            name="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese un nombre' }]}
          >
            <Input 
              placeholder="p. ej. Sprint 1, Defectos, Diseño, etc."
              maxLength={50}
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="Descripcion"
            extra="(opcional)"
          >
            <Input.TextArea rows={4} maxLength={200} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateWorkspace;
