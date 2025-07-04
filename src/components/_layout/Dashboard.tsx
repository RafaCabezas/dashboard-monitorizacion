import React, { useState } from 'react';
import TemperatureChart from '../Module1/TemperatureGraph';
import TemperatureMap from '../Module2/TemperatureMap';
import TemperatureTable from '../Module3/TemperatureTable';
import { UnitToggle } from './UnitToggle';

interface DashboardProps { }

export type TempUnit = "celsius" | "fahrenheit";

const Dashboard: React.FC<DashboardProps> = ({ }) => {

    const [unit, setUnit] = useState<TempUnit>("celsius");

    return (
        <div className="space-y-10 max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-extrabold text-center mb-6">
                Dashboard de Monitorización
            </h1>

            <UnitToggle unit={unit} setUnit={setUnit} />

            <TemperatureChart unit={unit} />
            <TemperatureMap unit={unit} />
            <TemperatureTable unit={unit} />
        </div>
    );
};

export default Dashboard;