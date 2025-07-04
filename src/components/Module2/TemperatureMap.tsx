// src/components/Modulo2/TemperatureMap.tsx
import { Icon } from 'leaflet';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useTemperatureMap } from '../../hooks/useTemperatureMap';

interface TemperatureMapProps {
    unit: 'celsius' | 'fahrenheit';
}

const TemperatureMap: React.FC<TemperatureMapProps> = ({ }) => {
    const { cityData, loading, error, refetch } = useTemperatureMap();

    // Función para crear iconos de diferentes colores
    const createIcon = (color: 'green' | 'red'): Icon => {
        const iconUrl = color === 'green'
            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
            : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

        return new Icon({
            iconUrl,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Mapa de Temperaturas por Ciudad
                </h2>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg text-gray-600">Cargando mapa...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Mapa de Temperaturas por Ciudad
                </h2>
                <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-sm font-medium text-red-800">Error al cargar el mapa</h3>
                    </div>
                    <p className="mt-2 text-sm text-red-700">{error}</p>
                    <button
                        onClick={refetch}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Mapa de Temperaturas por Ciudad
                </h2>
                <div className="flex items-center space-x-4">
                    {/* Leyenda */}
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                            <span>≤ 25°C</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                            <span>&gt; 25°C</span>
                        </div>
                    </div>
                    <button
                        onClick={refetch}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                        Actualizar
                    </button>
                </div>
            </div>

            <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                <MapContainer
                    center={[40.4168, -3.7038]} // Centrado en Madrid
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {cityData.map((city, index) => {
                        const icon = createIcon(city.isHot ? 'red' : 'green');

                        return (
                            <Marker
                                key={`${city.name}-${index}`}
                                position={[city.latitude, city.longitude]}
                                icon={icon}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                                            {city.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Temperatura:</strong> {city.temperature.toFixed(1)}°C
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <strong>Coordenadas:</strong> {city.latitude.toFixed(3)}, {city.longitude.toFixed(3)}
                                        </p>
                                        {city.isHot && (
                                            <div className="bg-red-100 border border-red-300 text-red-700 px-2 py-1 rounded text-sm">
                                                🚨 ¡Alerta! Temperatura alta
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Información adicional */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {cityData.map((city, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border-2 transition-colors ${city.isHot
                            ? 'border-red-300 bg-red-50'
                            : 'border-green-300 bg-green-50'
                            }`}
                    >
                        <div className="text-sm font-medium text-gray-800">{city.name}</div>
                        <div className={`text-lg font-bold ${city.isHot ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {city.temperature.toFixed(1)}°C
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemperatureMap;