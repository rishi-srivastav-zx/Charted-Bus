"use client";
import {
    Check,
    Users,
    MapPin,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/app/lib/uitls";


export default function VehicleCard({ vehicle, isSelected, onSelect }) {
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const displayAmenities = showAllAmenities
        ? vehicle.amenities
        : vehicle.amenities?.slice(0, 3) || [];
    const hiddenCount = (vehicle.amenities?.length || 0) - 3;

    const handleSelect = () => {
        onSelect(vehicle.id);
    };

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                isSelected
                    ? "border-blue-500 shadow-lg shadow-blue-100 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md",
            )}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Image Section */}
                <div className="relative w-full sm:w-56 md:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
                    <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/400x300?text=Bus";
                        }}
                    />
                    {/* Badge */}
                    {vehicle.badge && (
                        <div
                            className={cn(
                                "absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white",
                                vehicle.badge === "Most Popular"
                                    ? "bg-blue-600"
                                    : "bg-amber-500",
                            )}
                        >
                            {vehicle.badge}
                        </div>
                    )}
                    {/* Selected Overlay */}
                    {isSelected && (
                        <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                                <Check className="w-4 h-4" />
                                Selected
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        {/* Left: Info */}
                        <div className="flex-1 min-w-0">
                            {/* Title - exactly 2 lines max */}
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug line-clamp-2 min-h-[3.5rem]">
                                {vehicle.name}
                            </h3>

                            {/* Subtitle - single line, perfect symmetry */}
                            <p className="text-sm text-slate-500 mt-1 truncate">
                                or equivalent | {vehicle.passengers} seater AC
                                Cab
                            </p>

                            {/* Driver info - aligned perfectly */}
                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Driver allowance included</span>
                            </div>

                            {/* Distance info - aligned with above */}
                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>
                                    {vehicle.includedKms || 0} kms included
                                </span>
                                <span className="text-slate-300">|</span>
                                <span>
                                    Post limit: ${vehicle.extraKmRate || 0}/km
                                </span>
                            </div>
                        </div>

                        {/* Right: Price & CTA */}
                        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                            {/* Discount Badge */}
                            {vehicle.discount > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-600 text-sm font-semibold">
                                        {vehicle.discount}% OFF
                                    </span>
                                    <span className="text-slate-400 text-sm line-through">
                                        $
                                        {vehicle.originalPrice?.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="text-right">
                                <p className="text-3xl font-black text-blue-600 tracking-tight">
                                    ${vehicle.price?.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    + ${vehicle.taxes || 0} Charges and Taxes
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Total: $
                                    {(
                                        vehicle.price + (vehicle.taxes || 0)
                                    )?.toLocaleString()}
                                </p>
                            </div>

                            {/* Select Button */}
                            <button
                                onClick={handleSelect}
                                className={cn(
                                    "px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 min-w-[140px]",
                                    isSelected
                                        ? "bg-slate-100 text-slate-500 cursor-default"
                                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 active:scale-95",
                                )}
                                disabled={isSelected}
                            >
                                {isSelected ? "Selected" : "SELECT BUS"}
                            </button>
                        </div>
                    </div>

                    {/* Amenities - perfectly aligned pills */}
                    <div className="mt-5 pt-5 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                            {displayAmenities.map((amenity, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                    {amenity}
                                </span>
                            ))}

                            {hiddenCount > 0 && !showAllAmenities && (
                                <button
                                    onClick={() => setShowAllAmenities(true)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-orange-300 text-xs font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
                                >
                                    +{hiddenCount} more
                                </button>
                            )}

                            {showAllAmenities &&
                                vehicle.amenities?.length > 3 && (
                                    <button
                                        onClick={() =>
                                            setShowAllAmenities(false)
                                        }
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                                    >
                                        Show less
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
