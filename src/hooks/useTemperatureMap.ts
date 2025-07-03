// src/hooks/useTemperatureMap.ts
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface CityMapData {
    name: string;
    latitude: number;
    longitude: number;
    temperature: number;
    isHot: boolean; // true si temperatura > 25°C
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

export const useTemperatureMap = () => {
    const [cityData, setCityData] = useState<CityMapData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTemperatureData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<WeatherApiResponse[]>(API_URL);
            const cityDataArray = response.data;

            // Verificar que son datos válidos
            if (!cityDataArray || cityDataArray.length === 0) {
                throw new Error('No se recibieron datos válidos del endpoint');
            }

            // Procesar datos para cada ciudad
            const processedCityData: CityMapData[] = cityDataArray.map((cityObj, index) => {
                if (index >= cities.length) {
                    throw new Error(`Índice de ciudad fuera de rango: ${index}`);
                }

                const temperatures = cityObj.minutely_15.temperature_2m;

                // Verificar que hay datos de temperatura
                if (!temperatures || temperatures.length === 0) {
                    throw new Error(`No hay datos de temperatura para la ciudad ${cities[index].name}`);
                }

                // Obtener la última temperatura disponible
                const latestTemperature = temperatures[temperatures.length - 1];

                return {
                    name: cities[index].name,
                    latitude: cities[index].latitude,
                    longitude: cities[index].longitude,
                    temperature: latestTemperature,
                    isHot: latestTemperature > 25 // Determinar si es "alarma"
                };
            });

            setCityData(processedCityData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los datos del mapa';
            setError(errorMessage);
            console.error('Error fetching temperature map data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemperatureData();
        const interval = setInterval(fetchTemperatureData, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { cityData, loading, error, cities, refetch: fetchTemperatureData };
};