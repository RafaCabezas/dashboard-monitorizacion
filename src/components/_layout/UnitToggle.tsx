import type { TempUnit } from "./Dashboard";

type Props = { unit: TempUnit; setUnit: (u: TempUnit) => void };

export const UnitToggle: React.FC<Props> = ({ unit, setUnit }) => (
    <div className="mb-4 flex items-center gap-2">
        <span className={unit === "celsius" ? "font-bold" : "font-light"}>°C</span>

        <button
            className="bg-gray-200 rounded px-2 py-1 cursor-pointer"
            onClick={() => setUnit(unit === "celsius" ? "fahrenheit" : "celsius")}
        >
            ↔
        </button>

        <span className={unit === "fahrenheit" ? "font-bold" : "font-light"}>°F</span>
    </div>
);