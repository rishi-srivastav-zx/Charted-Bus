import { X } from "lucide-react";
import AmenityChip from "./AmenityChip";

const AmenitiesPopup = ({ amenities, onClose }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-fadeInDown"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                    All Amenities
                </h3>
                <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            {/* Grid of chips */}
            <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                    <AmenityChip key={a} name={a} size="md" />
                ))}
            </div>
        </div>
    </div>
);

export default AmenitiesPopup;
