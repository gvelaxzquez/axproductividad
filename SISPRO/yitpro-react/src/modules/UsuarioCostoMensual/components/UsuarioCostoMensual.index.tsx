/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, Tabs } from 'antd';
import FiltrosUsuarioCosto from './FiltrosUsuarioCosto';
import UsuarioCostoCards from './UsuarioCostoCards';
import { useEffect } from 'react';
import type { CatalogoGeneralModel } from '../../../model/CatalogoGeneral.model';
import { convertFromPascalCase } from '../../../utils/convertPascal';
import { useUsuarioCostoStore } from '../store/usuarioCostoMensual.store';
import { getMonthName } from '../../../utils/format.util';
import CostoAnualChart from './UsuarioCostoAnual.chart';

const { Content } = Layout;
const { TabPane } = Tabs;

const UsuarioCostoMensual: React.FC<{ proyectos: any[] }> = ({ proyectos }) => {
    const { setProyectos, mes, anio } = useUsuarioCostoStore();
    useEffect(() => {
        const proyectosConvertidos = convertFromPascalCase<CatalogoGeneralModel[]>(proyectos);
        setProyectos(proyectosConvertidos);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proyectos]);
    return (
        <Content>
            <FiltrosUsuarioCosto />
            <Tabs defaultActiveKey="1" style={{ marginLeft: 16 }}>
                <TabPane tab={`Distribución de costos ${getMonthName(mes, anio)} ${anio}`} key="1">
                    <UsuarioCostoCards />
                </TabPane>
                <TabPane tab={`Historico anual ${anio}`} key="2">
                    <CostoAnualChart />
                </TabPane>
            </Tabs>
        </Content>
    );
};
export default UsuarioCostoMensual;