// CostoAnualChart.tsx
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    type TooltipProps
} from 'recharts';
import { useUsuarioCostoStore } from '../store/usuarioCostoMensual.store';
import { formatMoney } from '../../../utils/format.util';
import { Card, Col, Divider, Row, Statistic } from 'antd';
import { useMemo } from 'react';
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;


    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            padding: 8,
            borderRadius: 4,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
            {payload.reverse().map((entry, idx) => {
                const { dataKey, value, color } = entry;
                if (dataKey === 'totalCosto') {
                    return (
                        <p key={idx} style={{ color, margin: '4px 0' }}>
                            Costo: {formatMoney(value)}
                        </p>
                    );
                }
                if (dataKey === 'totalRecursos') {
                    return (
                        <p key={idx} style={{ color, margin: '4px 0' }}>
                            Recursos: {value}
                        </p>
                    );
                }
                return null;
            })}
        </div>
    );
};
const CostoAnualChart = () => {
    const {
        dataAnual: data,
        totalAnual: total
    } = useUsuarioCostoStore();
    const { average, maxMonth, minMonth } = useMemo(() => {

        const positiveMonths = data.filter((m) => m.totalCosto > 0);
        const average =
            positiveMonths.length > 0
                ? total / positiveMonths.length
                : 0;

        const maxMonth = data.reduce((prev, curr) =>
            curr.totalCosto > prev.totalCosto ? curr : prev,
            data[0]
        );
        const minMonth = positiveMonths.length
            ? positiveMonths.reduce((prev, curr) =>
                curr.totalCosto < prev.totalCosto ? curr : prev,
                positiveMonths[0]
            )
            : null;

        return { total, average, maxMonth, minMonth };
    }, [data, total]);


    return (
        <>
            <Card title="Estadísticas Anuales" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Total Anual"
                            value={formatMoney(total)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Promedio Mensual"
                            value={formatMoney(average)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Mes Más Costoso"
                            value={maxMonth.nombreMes}
                            prefix="💰"
                            valueStyle={{ fontSize: 14 }}
                            suffix={formatMoney(maxMonth.totalCosto)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Mes Menos Costoso"
                            value={minMonth ? minMonth.nombreMes : '-'}
                            prefix="📉"
                            valueStyle={{ fontSize: 14 }}
                            suffix={minMonth ? formatMoney(minMonth.totalCosto) : ''}
                        />
                    </Col>
                </Row>
            </Card>
            <Divider />
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombreMes" />
                    <YAxis
                        yAxisId="left"
                        label={{ value: 'Costo ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Recursos', angle: 30, position: 'insideRight' }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                        yAxisId="right"
                        dataKey="totalRecursos"
                        name="Total Recursos"
                        barSize={20}
                        fill="#008cdd"

                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="totalCosto"
                        name="Total Costo"
                        stroke="#ff7300"
                        strokeWidth={3}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </>
    );
};

export default CostoAnualChart;
