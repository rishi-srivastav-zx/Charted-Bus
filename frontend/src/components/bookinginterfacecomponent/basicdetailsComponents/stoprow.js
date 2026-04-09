"use client";
import { useState, useRef } from "react";
import { GripIcon, XIcon, PlusIcon } from "./icons";
import { inputCls } from "./formprimitives";
import { searchLocations } from "../../../services/locationService";

// ─── StopRow ──────────────────────────────────────────────────────────────────
export function StopRow({ index, value, onChange, onRemove }) {
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
                const results = await searchLocations(query);
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
        <div className="flex items-center gap-2">
            <div className="text-slate-300 cursor-grab flex-shrink-0">
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
                    placeholder={`Stop ${index + 1} Address *`}
                    className={inputCls + " bg-slate-50/80 text-xs sm:text-sm"}
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                )}
                {showSuggestions && suggestions.length > 0 && (
                    <div 
                        className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-48 sm:max-h-60 overflow-y-auto"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {suggestions.map((s, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectSuggestion(s);
                                }}
                                className="w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-blue-50 bg-white border-b border-slate-100 last:border-0 transition-colors"
                            >
                                {s.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={onRemove}
                className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors border border-red-100"
            >
                <XIcon s={12} />
            </button>
        </div>
    );
}

// ─── AddStopBtn ───────────────────────────────────────────────────────────────
export function AddStopBtn({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-bold transition-colors group"
        >
            <span className="w-5 h-5 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                <PlusIcon s={9} />
            </span>
            Add Stop
        </button>
    );
}
