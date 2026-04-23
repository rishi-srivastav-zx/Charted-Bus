import { ChevronDown } from "lucide-react";

export default function ShowMoreButton({ remainingCount, onClick }) {
    return (
        <div className="pt-4 sm:pt-6">
            <button
                onClick={onClick}
                className="w-full py-3 sm:py-4 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
                <span className="text-sm sm:text-base">Show More Buses</span>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {remainingCount} remaining
                </span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-0.5 transition-transform" />
            </button>
        </div>
    );
}
