import { BusIcon } from "./icons";
import { SERVICES } from "./constant";

// ─── ServicesBanner ───────────────────────────────────────────────────────────
export default function ServicesBanner() {
    return (
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 sm:p-4 mb-3">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <BusIcon s={11} /> What We Serve
            </p>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {SERVICES.map((s) => (
                    <div
                        key={s.label}
                        className="bg-white rounded-xl p-1.5 sm:p-2 text-center shadow-sm border border-blue-50 hover:border-blue-200 transition-colors cursor-default"
                    >
                        <div className="text-sm sm:text-base mb-0.5">
                            {s.icon}
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 leading-tight">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
