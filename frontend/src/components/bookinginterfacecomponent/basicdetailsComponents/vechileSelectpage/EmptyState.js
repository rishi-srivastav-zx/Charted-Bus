import { Bus, AlertCircle } from "lucide-react";

export function ErrorEmptyState({ error, onRetry }) {
    return (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-300">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
                Error Loading Buses
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-4">{error}</p>
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}

export function NoBusesEmptyState() {
    return (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <Bus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
                No buses available
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
                There are currently no buses available for this category. Please
                check back later or contact support.
            </p>
        </div>
    );
}
