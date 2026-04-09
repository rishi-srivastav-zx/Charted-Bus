import { useState } from "react";
import {
    Users,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Check,
    Fuel,
    Briefcase,
    MapPin,
    Shield,
    Star,
} from "lucide-react";
import { cn } from "../../../../app/lib/uitls";
import { formatCurrency } from "./formatters";
import AmenityChip from "./AmenityChip";
import AmenitiesPopup from "./AmenitiesPopup";
import CollapsibleSection from "./CollapsibleSection";

const VehicleCard = ({ vehicle, isSelected, onSelect }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const totalPrice = (vehicle?.price || 0) + (vehicle?.taxes || 0);
    const allAmenities = vehicle?.amenities || [];
    const MAX_VISIBLE = 3;
    const visibleAmenities = allAmenities.slice(0, MAX_VISIBLE);
    const hiddenCount = allAmenities.length - MAX_VISIBLE;

    if (!vehicle) return null;

    return (
        <div
            className={cn(
                "group bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300",
                isSelected
                    ? "border-blue-600 shadow-xl shadow-blue-100"
                    : "border-slate-200 hover:shadow-lg hover:border-blue-200",
            )}
        >
            {/* Main Card Content */}
            <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Left: Image */}
                    <div className="relative w-full lg:w-48 h-40 sm:h-32 lg:h-32 flex-shrink-0">
                        <img
                            src={
                                vehicle?.image ||
                                "https://via.placeholder.com/400x300"
                            }
                            alt={vehicle?.name || "Vehicle"}
                            className="w-full h-full object-cover rounded-xl"
                        />
                        {vehicle?.badge && (
                            <div
                                className={cn(
                                    "absolute -top-2 -right-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-md flex items-center gap-1",
                                    vehicle.badge === "Best Value"
                                        ? "bg-green-500"
                                        : vehicle.badge === "Premium"
                                          ? "bg-purple-600"
                                          : "bg-blue-600",
                                )}
                            >
                                {vehicle.badge === "Best Value" && (
                                    <Star className="w-3 h-3 fill-current" />
                                )}
                                {vehicle.badge}
                            </div>
                        )}
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-grow min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                                    {vehicle?.name || "Charter Bus"}
                                </h3>
                                <p className="text-slate-500 text-xs sm:text-sm mb-2 sm:mb-3">
                                    or equivalent | {vehicle?.passengers || 0}{" "}
                                    seater AC Cab
                                </p>

                                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                                        <span>Driver allowance included</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-slate-600">
                                    <Fuel className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                    <span className="font-medium text-slate-700">
                                        {vehicle?.includedKms || 0} kms included
                                    </span>
                                    <span className="text-slate-400 hidden sm:inline">
                                        |
                                    </span>
                                    <span className="w-full sm:w-auto">
                                        Post limit:{" "}
                                        {formatCurrency(
                                            vehicle?.extraKmRate || 0,
                                            vehicle?.currency,
                                        )}
                                        /km
                                    </span>
                                </div>
                            </div>

                            {/* Right: Pricing */}
                            <div className="text-left sm:text-right flex-shrink-0">
                                {(vehicle?.discount || 0) > 0 && (
                                    <div className="flex items-center sm:justify-end gap-2 mb-1">
                                        <span className="text-green-600 text-xs sm:text-sm font-semibold flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            {vehicle?.discount || 0}% OFF
                                        </span>
                                        <span className="text-slate-400 line-through text-xs sm:text-sm">
                                            {formatCurrency(
                                                vehicle?.originalPrice || 0,
                                                vehicle?.currency,
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                                    {formatCurrency(
                                        vehicle?.price || 0,
                                        vehicle?.currency,
                                    )}
                                </div>

                                <div className="text-slate-500 text-xs sm:text-sm mt-1">
                                    +{" "}
                                    {formatCurrency(
                                        vehicle?.taxes || 0,
                                        vehicle?.currency,
                                    )}{" "}
                                    Charges and Taxes
                                </div>

                                <div className="text-xs text-slate-400 mt-1">
                                    Total:{" "}
                                    {formatCurrency(
                                        totalPrice,
                                        vehicle?.currency,
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Amenities Row */}
                        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                            {visibleAmenities.map((amenity) => (
                                <AmenityChip
                                    key={amenity}
                                    name={amenity}
                                    size="sm"
                                />
                            ))}

                            {hiddenCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAllAmenities(true);
                                    }}
                                    className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-dashed border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-[10px] sm:text-[11px] font-semibold"
                                >
                                    +{hiddenCount} more
                                </button>
                            )}
                        </div>

                        {/* Amenities Popup */}
                        {showAllAmenities && (
                            <AmenitiesPopup
                                amenities={allAmenities}
                                onClose={() => setShowAllAmenities(false)}
                            />
                        )}
                    </div>

                    {/* Select Button - Desktop (hidden on mobile) */}
                    <div className="hidden lg:flex flex-col justify-center gap-3 flex-shrink-0">
                        <button
                            onClick={() => onSelect(vehicle.id)}
                            className={cn(
                                "px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200 min-w-[120px] sm:min-w-[140px] text-sm sm:text-base",
                                isSelected
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5",
                            )}
                        >
                            {isSelected ? "SELECTED" : "SELECT BUS"}
                        </button>

                        {isSelected && (
                            <div className="flex items-center justify-center gap-1 text-green-600 text-xs sm:text-sm font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>Added</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile/Tablet Select Button - Always Visible */}
                <div className="lg:hidden mt-4 flex items-center justify-between gap-3">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
                    >
                        {showDetails ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                        Inclusions
                    </button>

                    <button
                        onClick={() => onSelect(vehicle.id)}
                        className={cn(
                            "px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-bold transition-all duration-200 text-xs sm:text-sm",
                            isSelected
                                ? "bg-green-500 text-white"
                                : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md",
                        )}
                    >
                        {isSelected ? (
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                SELECTED
                            </span>
                        ) : (
                            "SELECT BUS"
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Details Section */}
            {showDetails && (
                <div className="border-t border-slate-200 bg-slate-50 animate-in slide-in-from-top-2 duration-200">
                    {/* New Car Promise Banner */}
                    <div className="bg-blue-100 px-4 sm:px-6 py-2 flex items-center gap-2 text-blue-800 text-xs sm:text-sm">
                        <div className="bg-blue-600 text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                        </div>
                        <span className="font-medium">
                            New Car Promise - Model that is 2023 or newer @ $249
                        </span>
                    </div>

                    <div className="p-4 sm:p-6 grid md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Inclusions with Show More/Less */}
                        <CollapsibleSection
                            title="Inclusions"
                            items={vehicle?.inclusions || []}
                            type="check"
                            maxVisible={4}
                        />

                        {/* Exclusions with Show More/Less */}
                        <CollapsibleSection
                            title="Exclusions"
                            items={vehicle?.exclusions || []}
                            type="exclude"
                            maxVisible={4}
                        />
                    </div>

                    {/* Additional Info */}
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200">
                            <h5 className="font-semibold text-slate-900 mb-2 text-xs sm:text-sm">
                                Additional Information
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                    <span>
                                        {vehicle?.luggage || 0} bags included
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                    <span>GPS Tracking</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                    <span>Insurance included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleCard;
