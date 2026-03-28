"use client";
import { MinusIcon, PlusIcon } from "./icons";

// ─── PassengerCounter ────────────────────────────────────────────────────────
export default function PassengerCounter({ count, setCount }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    Passenger Count <span className="text-red-400">*</span>
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    Total number of guests
                </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                <button
                    onClick={() => setCount(Math.max(1, count - 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <MinusIcon s={14} />
                </button>
                <input
                    type="number"
                    value={count}
                    onChange={(e) =>
                        setCount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-12 sm:w-14 text-center border border-slate-200 rounded-xl py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
                />
                <button
                    onClick={() => setCount(count + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-200"
                >
                    <PlusIcon s={14} />
                </button>
            </div>
        </div>
    );
}
