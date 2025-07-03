import { Form, InputNumber, Switch } from 'antd';
import useFlujoPagosStore from '../flujoPagoDetalle.store';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => Promise<void>;
}

const EditarProyectoModal: React.FC<Props> = ({ onSubmit }) => {
    const {
        flujo,
    } = useFlujoPagosStore();
    const [form] = Form.useForm();


    return (
        <Form
            id="formFlujoProyecto"
            layout="vertical"
            form={form}
            onFinish={(values) => {
                onSubmit(values);
                form.resetFields();
            }}
            initialValues={{
                precioHora: flujo?.precioHora,
                porcIVA: flujo?.porcIVA,
                horasTotales: flujo?.horasTotales,
                horasAmortizar: flujo?.horasAmortizar,
                activo: flujo?.activo ?? false
            }}
        >
            <Form.Item
                name="precioHora"
                label="Precio por hora"
                rules={[{ required: true, message: 'Ingrese el precio por hora' }]}
            >
                <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="porcIVA"
                label="Porcentaje de IVA"
                rules={[{ required: true, message: 'Ingrese el IVA' }]}
            >
                <InputNumber min={0} max={100} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="horasTotales"
                label="Horas totales"
                rules={[{ required: true, message: 'Ingrese las horas totales' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="horasAmortizar"
                label="Horas amortizar"
                rules={[{ required: true, message: 'Ingrese las horas a amortizar' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="activo" label="Archivar" valuePropName="checked">
                <Switch />
            </Form.Item>
        </Form>)
};
export default EditarProyectoModal;
