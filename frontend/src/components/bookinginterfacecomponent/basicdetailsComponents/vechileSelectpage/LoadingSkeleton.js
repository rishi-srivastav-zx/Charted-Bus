export default function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 animate-pulse"
                >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="w-full sm:w-56 h-48 sm:h-32 bg-slate-200 rounded-xl" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 bg-slate-200 rounded w-2/3" />
                            <div className="h-4 bg-slate-100 rounded w-1/2" />
                            <div className="h-4 bg-slate-100 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
