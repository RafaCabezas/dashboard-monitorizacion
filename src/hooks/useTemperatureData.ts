// src/hooks/useTemperatureData.ts
import axios from 'axios';
import { useEffect, useState } from 'react';

interface CityTemperature {
    time: string;
    [city: string]: number | string;
}

interface WeatherApiResponse {
    latitude: number;
    longitude: number;
    minutely_15: {
        time: string[];
        temperature_2m: number[];
    };
}

const cities = [
    { name: 'Madrid', latitude: 40.4168, longitude: -3.7038 },
    { name: 'Barcelona', latitude: 41.3784, longitude: 2.1925 },
    { name: 'Valencia', latitude: 39.4699, longitude: -0.3763 },
    { name: 'Bilbao', latitude: 43.263, longitude: -2.934 },
    { name: 'Zaragoza', latitude: 41.6488, longitude: -0.8891 }
];

const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=40.4168,41.3784,39.4699,43.263,41.6488&longitude=-3.7038,2.1925,-0.3763,-2.934,-0.8891&minutely_15=temperature_2m&forecast_days=14';

export const useTemperatureData = () => {
    const [data, setData] = useState<CityTemperature[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<WeatherApiResponse[]>(API_URL);
            const cityDataArray = response.data;

            // Verificar que son datos válidos
            if (!cityDataArray || cityDataArray.length === 0) {
                throw new Error('No se han recibido datos válidos');
            }

            // Asumir que todas las ciudades tienen los mismos tiempos
            const times = cityDataArray[0].minutely_15.time;

            // Definir el array para la gráfica
            const chartData: CityTemperature[] = times.map((time: string, idx: number) => {
                const entry: CityTemperature = { time };

                cityDataArray.forEach((cityObj: WeatherApiResponse, cIdx: number) => {
                    if (cIdx < cities.length) {
                        entry[cities[cIdx].name] = cityObj.minutely_15.temperature_2m[idx];
                    }
                });

                return entry;
            });

            setData(chartData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los datos';
            setError(errorMessage);
            console.error('Error fetching temperature data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error, cities, refetch: fetchData };
};