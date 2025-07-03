// src/components/Modulo1/TemperatureChart.tsx
import React from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { useTemperatureData } from '../../hooks/useTemperatureData';
import { stringToColor } from '../../utils/stringFunctions';

interface TemperatureChartProps {
    unit: 'celsius' | 'fahrenheit';
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ unit }) => {

    const { data, loading, error, cities, refetch } = useTemperatureData();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg text-gray-600">Cargando datos...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-sm font-medium text-red-800">Error al cargar los datos</h3>
                </div>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                    onClick={refetch}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Evolución de la Temperatura por Ciudad
                </h2>
                <button
                    onClick={refetch}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                    Actualizar
                </button>
            </div>

            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="time"
                            minTickGap={30}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            unit="°C"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            labelFormatter={(label) => `Fecha: ${label}`}
                            formatter={(value: number, name: string) => [
                                `${value.toFixed(1)}°C`,
                                name
                            ]}
                        />
                        <Legend />
                        {cities.map(city => (
                            <Line
                                key={city.name}
                                type="monotone"
                                dataKey={city.name}
                                stroke={stringToColor(city.name)}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TemperatureChart;