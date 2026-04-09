"use client";
import { MinusIcon, PlusIcon } from "./icons";

// ─── PassengerCounter ────────────────────────────────────────────────────────
export default function PassengerCounter({ count, setCount }) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            {/* Label */}
            <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    Passenger Count <span className="text-red-400">*</span>
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                    Total guests
                </p>
            </div>

            {/* Counter controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                <button
                    onClick={() => setCount(Math.max(1, count - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex-shrink-0"
                >
                    <MinusIcon s={14} />
                </button>
                <input
                    type="number"
                    min="1"
                    value={count}
                    onChange={(e) =>
                        setCount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-14 text-center border border-slate-200 rounded-xl py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
                />
                <button
                    onClick={() => setCount(count + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-200 active:scale-95 flex-shrink-0"
                >
                    <PlusIcon s={14} />
                </button>
            </div>
        </div>
    );
}
