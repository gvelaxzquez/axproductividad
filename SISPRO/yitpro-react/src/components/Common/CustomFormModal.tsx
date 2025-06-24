import { Modal, Button, Space } from 'antd';
import React from 'react';

interface CustomFormModalProps {
    open: boolean;
    title: string;
    formId: string;
    onCancel: () => void;
    children?: React.ReactNode;
}

const CustomFormModal: React.FC<CustomFormModalProps> = ({ open, title, formId, onCancel, children }) => {
    const handleSave = () => {
        const form = document.getElementById(formId) as HTMLFormElement | null;
        if (form) {
            form.requestSubmit(); // lanza submit del formulario con ese ID
        }
    };

    return (
        <Modal
            open={open}
            title={title}
            onCancel={onCancel}
            footer={
                <Space>
                    <Button onClick={onCancel}>Cancelar</Button>
                    <Button type="primary" onClick={handleSave}>Guardar</Button>
                </Space>
            }
        >
            {children}
        </Modal>
    );
};

export default CustomFormModal;
