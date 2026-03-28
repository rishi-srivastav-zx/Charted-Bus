"use client";
import { ChevronDown } from "./icons";  

// ─── Shared Input Class ────────────────────────────────────────────────────────
export const inputCls =
    "w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all hover:border-slate-300";

// ─── FieldLabel ───────────────────────────────────────────────────────────────
export const FieldLabel = ({ children }) => (
    <label className="block text-[10px] sm:text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-2">
        {children}
    </label>
);

// ─── SelectInput ──────────────────────────────────────────────────────────────
export const SelectInput = ({ placeholder, options = [], value, onChange }) => (
    <div className="relative">
        <select
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputCls + " cursor-pointer pr-10"}
        >
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown />
        </span>
    </div>
);

// ─── TypeToggle ───────────────────────────────────────────────────────────────
export const TypeToggle = ({ value, onChange, options }) => (
    <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
        {options.map((opt) => (
            <button
                key={opt}
                onClick={() => onChange(opt.toLowerCase())}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold transition-all border-none ${
                    value === opt.toLowerCase()
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:bg-white"
                }`}
            >
                {opt}
            </button>
        ))}
    </div>
);

// ─── FormCard ─────────────────────────────────────────────────────────────────
export const FormCard = ({ children, className = "" }) => (
    <div
        className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${className}`}
    >
        <div className="divide-y divide-slate-100">{children}</div>
    </div>
);

// ─── FormRow ──────────────────────────────────────────────────────────────────
export const FormRow = ({ children }) => (
    <div className="px-4 sm:px-5 py-3 sm:py-4">{children}</div>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider = () => <div className="border-t border-slate-100 my-1" />;
