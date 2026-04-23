import { cn } from "@/app/lib/uitls";
import { FILTERS } from "./options";

export default function FilterBar({ activeFilter, onFilterChange }) {
    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {FILTERS.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all border",
                        activeFilter === filter.id
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600",
                    )}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
