"use client";
import { useState, useRef } from "react";
import { GripIcon, EditIcon } from "./icons";
import { TypeToggle, inputCls } from "./formprimitives";
import { searchLocation } from "@/services/locationService";

// ─── AddressRow ───────────────────────────────────────────────────────────────
export default function AddressRow({
    label,
    isDropoff = false,
    value,
    onChange,
    type,
    onTypeChange,
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    const handleInputChange = (e) => {
        const query = e.target.value;
        onChange?.(query);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const results = await searchLocation(query);
                setSuggestions(results || []);
                setShowSuggestions(results?.length > 0);
            } catch (err) {
                console.error("Location search error:", err);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSelectSuggestion = (suggestion) => {
        onChange?.(suggestion.display_name);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return (
        <div className="space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    {label}
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <TypeToggle
                        value={type}
                        onChange={onTypeChange}
                        options={["Address", "Airport"]}
                    />
                    {isDropoff && (
                        <button className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-slate-200">
                            <EditIcon s={12} />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-slate-300 cursor-grab flex-shrink-0 mt-0.5">
                    <GripIcon s={16} />
                </div>
                <div className="relative flex-1 min-w-0">
                    <input
                        type="text"
                        value={value || ""}
                        onChange={handleInputChange}
                        onFocus={() =>
                            suggestions.length > 0 && setShowSuggestions(true)
                        }
                        onBlur={() =>
                            setTimeout(() => setShowSuggestions(false), 200)
                        }
                        placeholder={
                            type === "airport"
                                ? "Search Airport or City *"
                                : "Enter address or city *"
                        }
                        className={inputCls}
                    />
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    )}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-48 sm:max-h-60 overflow-y-auto">
                            {suggestions.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectSuggestion(s)}
                                    className="w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0"
                                >
                                    {s.display_name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
