import { Form, Input } from 'antd';
import type { FlujoPagoDetModel } from '../../../../model/FlujoPago.model';
import useFlujoPagosStore from '../flujoPagoDetalle.store';

interface FormFlujoDetalleProps {
    detalle: FlujoPagoDetModel | null;
    onSubmit: (values: FlujoPagoDetModel) => void;
}

const FormFlujoDetalle: React.FC<FormFlujoDetalleProps> = ({ detalle, onSubmit }) => {
    const {
        flujo,
    } = useFlujoPagosStore();
    const [form] = Form.useForm();

    return (
        <Form
            id="formFlujoDetalle"
            layout="vertical"
            form={form}
            onFinish={onSubmit}
            initialValues={{
                concepto: detalle?.concepto,
                horas: detalle?.horas,
                procentaje: detalle?.procentaje,
                monto: detalle?.monto,
                amortizadas: detalle?.amortizadas,
                secuencia: detalle?.secuencia ?? (flujo?.flujoDetalle ?? []).length + 1,
                id: detalle?.idFlujoPagoDet
            }}
        >
            <Form.Item label="Secuencia" name="secuencia">
                <Input readOnly/>
            </Form.Item>

            <Form.Item label="Concepto" name="concepto">
                <Input />
            </Form.Item>

            <Form.Item label="Horas" name="horas">
                <Input type="number" />
            </Form.Item>

            <Form.Item label="Porcentaje" name="procentaje">
                <Input type="number" />
            </Form.Item>

            <Form.Item label="Monto" name="monto">
                <Input type="number" />
            </Form.Item>

            <Form.Item label="Amortizadas" name="amortizadas">
                <Input type="number" />
            </Form.Item>
        </Form>
    );
};

export default FormFlujoDetalle;
