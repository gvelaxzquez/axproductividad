import { DatePicker, Form, Input } from 'antd';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => Promise<void>;
    tipoFecha: number; // 1: Fecha de dev, 2: Fecha de factura, 3: Fecha programada, 4: Fecha de pago
}

const EditarFechaModal: React.FC<Props> = ({ onSubmit, tipoFecha }) => {
    const [form] = Form.useForm();
    return (
        <Form
            id="formFlujoFecha"
            layout="vertical"
            form={form}
            onFinish={(values) => {
                onSubmit(values);
                form.resetFields();
            }}
        >
            <Form.Item
                name="nuevaFecha"
                label="Nueva fecha"
                rules={[{ required: true, message: 'Seleccione la nueva fecha' }]}
            >
                <DatePicker format="DD/MM/YYYY" />
            </Form.Item>

            {tipoFecha === 2 && (
                <Form.Item
                    name="factura"
                    label="Número de factura"
                    rules={[{ required: true, message: 'Ingrese el número de factura' }]}
                >
                    <Input />

                </Form.Item>
            )}
        </Form>)
};
export default EditarFechaModal;
