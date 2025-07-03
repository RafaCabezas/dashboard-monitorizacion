// src/components/Modulo3/TemperatureTable.tsx
import React, { useMemo, useState } from 'react';
import { useTemperatureTable, type TableRow } from '../../hooks/useTemperatureTable';

interface TemperatureTableProps {
    unit: 'celsius' | 'fahrenheit';
}

const TemperatureTable: React.FC<TemperatureTableProps> = ({ unit }) => {

    const { rows, loading, error } = useTemperatureTable();

    // estado de filtros
    const [cityFilter, setCityFilter] = useState<string>('ALL');
    const [onlyAlarms, setOnlyAlarms] = useState(false);

    // aplicar filtros con useMemo para evitar renders costosos
    const filtered = useMemo(() => {
        return rows.filter(r => {
            const cityOk = cityFilter === 'ALL' || r.city === cityFilter;
            const alarmOk = !onlyAlarms || r.temperature > 25;
            return cityOk && alarmOk;
        });
    }, [rows, cityFilter, onlyAlarms]);

    if (loading) return <p className="p-4">Cargando datos…</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-start text-2xl font-bold text-gray-800 mb-4">Histórico de Temperaturas</h2>

            {/* Controles */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                {/* Selector de ciudad */}
                <select
                    className="border rounded p-2"
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                >
                    <option value="ALL">Todas las ciudades</option>
                    <option value="Madrid">Madrid</option>
                    <option value="Barcelona">Barcelona</option>
                    <option value="Valencia">Valencia</option>
                    <option value="Bilbao">Bilbao</option>
                    <option value="Zaragoza">Zaragoza</option>
                </select>

                {/* Checkbox de alarmas */}
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={onlyAlarms}
                        onChange={e => setOnlyAlarms(e.target.checked)}
                        className="accent-red-600"
                    />
                    Mostrar solo alarmas (&gt; 25 °C)
                </label>

                {/* Resumen rápido */}
                <span className="text-sm text-gray-600 ml-auto">
                    {filtered.length} registros
                </span>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto h-[400px]">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 text-left">Fecha / Hora</th>
                            <th className="px-4 py-2 text-left">Ciudad</th>
                            <th className="px-4 py-2 text-left">Temperatura</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row: TableRow, idx: number) => (
                            <tr
                                key={idx}
                                className={
                                    row.temperature > 25
                                        ? 'bg-red-100 text-red-700'
                                        : idx % 2 === 0
                                            ? 'bg-white'
                                            : 'bg-gray-50'
                                }
                            >
                                <td className="px-4 py-1 whitespace-nowrap">{row.time}</td>
                                <td className="px-4 py-1">{row.city}</td>
                                <td className="px-4 py-1">
                                    {row.temperature.toFixed(1)} °C
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TemperatureTable;