import { Button, Modal, Space, Typography } from "antd";
import { getMonthName } from "../../../../utils/format.util";
import { useUsuarioCostoStore } from "../../store/usuarioCostoMensual.store";
import DistribucionCard from "./DistribucionMasiva.card";
import { useEffect, useState } from "react";
const { Text } = Typography;


interface Props {
    open: boolean;
    onClose: () => void;
}

const DistribucionMasiva: React.FC<Props> = ({ open, onClose }) => {
    const {
        mes,
        anio,
        data,
        distribucionesPorUsuario,
        usuariosConfirmados,
        guardarDistribucionCostosMasiva
    } = useUsuarioCostoStore();
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        if (open) setResetKey((prev) => prev + 1);
    }, [open]);
    const handleGuardar = () => {
        guardarDistribucionCostosMasiva();
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={[
                <Space style={{ justifyContent: 'space-between', width: '100%' }} key="footer">
                    <Text>{usuariosConfirmados.length}/{Object.keys(distribucionesPorUsuario).length} Usuarios confirmados</Text>
                    <Button disabled={usuariosConfirmados.length !== Object.keys(distribucionesPorUsuario).length} type="primary" onClick={handleGuardar}>
                        Guardar
                    </Button>
                </Space>
            ]}
            width="100%"
            style={{ top: 16 }}
            styles={{
                body: {
                    padding: 24,
                    overflowY: 'hidden',
                    overflowX: 'visible',
                    maxHeight: '85vh'
                },
                content: {
                    maxHeight: "50%"

                }
            }}
            title={`Distribución Masiva de Costos - ${getMonthName(mes, anio)} ${anio}`}
        >
            {<div
                style={{
                    display: 'flex',
                    gap: 16,
                    // height: '50%',
                }}
            >
                {data.map((usuario) => {
                    const distribucion = distribucionesPorUsuario[usuario.idUsuario] ?? [];
                    return (
                        <DistribucionCard
                            key={`${usuario.idUsuario}-${resetKey}`}
                            usuario={usuario}
                            initialDist={distribucion}
                            open={open}
                            resetKey={resetKey}
                        />
                    )

                })}
            </div>}
        </Modal>
    );
};
export default DistribucionMasiva;