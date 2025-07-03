// src/hooks/useTemperatureTable.ts
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface TableRow {
    time: string;
    city: string;
    temperature: number;
}

const cities = [
    { name: 'Madrid', latitude: 40.4168, longitude: -3.7038 },
    { name: 'Barcelona', latitude: 41.3784, longitude: 2.1925 },
    { name: 'Valencia', latitude: 39.4699, longitude: -0.3763 },
    { name: 'Bilbao', latitude: 43.2630, longitude: -2.9340 },
    { name: 'Zaragoza', latitude: 41.6488, longitude: -0.8891 },
];

const API_URL =
    'https://api.open-meteo.com/v1/forecast?latitude=40.4168,41.3784,39.4699,43.263,41.6488' +
    '&longitude=-3.7038,2.1925,-0.3763,-2.934,-0.8891&minutely_15=temperature_2m&forecast_days=14';

export const useTemperatureTable = () => {
    const [rows, setRows] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(API_URL);      // ← array de 5 objetos
            const times = data[0].minutely_15.time as string[];

            // “aplanar” la estructura → filas {time, city, temperature}
            const tableRows: TableRow[] = [];
            times.forEach((t, idx) => {
                data.forEach((cityBlock: any, cityIdx: number) => {
                    tableRows.push({
                        time: t,
                        city: cities[cityIdx].name,
                        temperature: cityBlock.minutely_15.temperature_2m[idx],
                    });
                });
            });
            setRows(tableRows);
        } catch {
            setError('Error obteniendo datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 15 * 60 * 1000);  // 15 min
        return () => clearInterval(id);
    }, []);

    return { rows, loading, error };
};