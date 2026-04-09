import { AMENITY_ICONS } from "./amenityIcons";

// Single amenity chip — shows icon if available, else a compact text badge
const AmenityChip = ({ name, size = "sm" }) => {
    const icon = AMENITY_ICONS[name];
    const isSmall = size === "sm";
    return (
        <div
            className={`flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 ${
                isSmall ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
            } font-medium`}
        >
            {icon ? (
                <span
                    className={
                        isSmall
                            ? "w-3.5 h-3.5 flex items-center justify-center"
                            : "w-4 h-4 flex items-center justify-center"
                    }
                >
                    {icon}
                </span>
            ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
            )}
            <span>{name}</span>
        </div>
    );
};

export default AmenityChip;
