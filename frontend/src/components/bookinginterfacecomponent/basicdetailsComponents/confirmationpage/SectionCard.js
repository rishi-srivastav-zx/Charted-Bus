import { Edit3 } from "lucide-react";

export default function SectionCard({
    title,
    icon: Icon,
    children,
    actionLabel = "Edit",
    onAction,
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm mb-6">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {title}
                    </h3>
                </div>
                <button
                    onClick={onAction}
                    className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                    <Edit3 className="w-4 h-4" />
                    {actionLabel}
                </button>
            </div>
            {children}
        </div>
    );
}
