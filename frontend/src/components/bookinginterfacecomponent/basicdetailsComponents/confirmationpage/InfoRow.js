export default function InfoRow({ label, value, subValue }) {
    return (
        <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {label}
            </span>
            <span className="text-gray-900 font-medium truncate">{value}</span>
            {subValue && (
                <span className="text-gray-500 text-sm mt-0.5 truncate">
                    {subValue}
                </span>
            )}
        </div>
    );
}
