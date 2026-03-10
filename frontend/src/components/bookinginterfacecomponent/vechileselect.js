"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
    Bus,
    Users,
    Wifi,
    Wind,
    Tv,
    Armchair,
    ArrowRight,
    CheckCircle2,
    MapPin,
    Calendar,
    Clock,
    Edit3,
    Phone,
    Star,
    ChevronRight,
    Home,
    AlertCircle,
    User,
    Mail,
    PhoneCall,
    X,
    ChevronDown,
    ChevronUp,
    Check,
    Fuel,
    Briefcase,
    Shield,
    Zap,
    Coffee,
    Plug,
    BedDouble,
    UtensilsCrossed,
    Music2,
    Thermometer,
    MonitorPlay,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAllBuses } from "@/services/busservices";

// Utility for tailwind class merging
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const FILTERS = [
    { id: "all", label: "All Vehicles" },
    { id: "small", label: "Small (8-20)" },
    { id: "medium", label: "Medium (20-40)" },
    { id: "large", label: "Large (40+)" },
];

// Currency formatter
const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Amenity icon map — add as many as needed; unknown ones get a text badge
const AMENITY_ICONS = {
    Wifi:               <Wifi className="w-4 h-4" />,
    AC:                 <Wind className="w-4 h-4" />,
    "Air Conditioning": <Wind className="w-4 h-4" />,
    TV:                 <Tv className="w-4 h-4" />,
    Leather:            <Armchair className="w-4 h-4" />,
    Seats:              <Armchair className="w-4 h-4" />,
    Restroom:           <MonitorPlay className="w-4 h-4" />,
    WC:                 <MonitorPlay className="w-4 h-4" />,
    Power:              <Plug className="w-4 h-4" />,
    "USB Charging":     <Plug className="w-4 h-4" />,
    USB:                <Plug className="w-4 h-4" />,
    Outlet:             <Zap className="w-4 h-4" />,
    Beds:               <BedDouble className="w-4 h-4" />,
    Bed:                <BedDouble className="w-4 h-4" />,
    Kitchen:            <UtensilsCrossed className="w-4 h-4" />,
    Food:               <UtensilsCrossed className="w-4 h-4" />,
    Music:              <Music2 className="w-4 h-4" />,
    Entertainment:      <Music2 className="w-4 h-4" />,
    Heating:            <Thermometer className="w-4 h-4" />,
    Coffee:             <Coffee className="w-4 h-4" />,
    Refreshments:       <Coffee className="w-4 h-4" />,
};

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
            {icon
                ? <span className={isSmall ? "w-3.5 h-3.5 flex items-center justify-center" : "w-4 h-4 flex items-center justify-center"}>
                    {icon}
                  </span>
                : <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />}
            <span>{name}</span>
        </div>
    );
};

// Amenity Icon Component (kept for backwards compat if used elsewhere)
const AmenityIcon = ({ name }) => <AmenityChip name={name} />;

// Collapsible Section Component
const CollapsibleSection = ({
    title,
    items,
    type = "check",
    maxVisible = 4,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMore = items.length > maxVisible;
    const visibleItems = isExpanded ? items : items.slice(0, maxVisible);
    const hiddenCount = items.length - maxVisible;

    return (
        <div>
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        type === "check" ? "bg-green-100" : "bg-red-100",
                    )}
                >
                    {type === "check" ? (
                        <Check className="w-4 h-4 text-green-600" />
                    ) : (
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </div>
                {title}
            </h4>
            <ul className="space-y-3">
                {visibleItems.map((item, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-slate-700"
                    >
                        {type === "check" ? (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-red-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show {hiddenCount} More
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

// ─── Amenities All-View Popup ───────────────────────────────────────────────
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
                <h3 className="text-base font-bold text-slate-900">All Amenities</h3>
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

// Vehicle Card Component
const VehicleCard = ({ vehicle, isSelected, onSelect }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const totalPrice = (vehicle?.price || 0) + (vehicle?.taxes || 0);
    const allAmenities   = vehicle?.amenities || [];
    const MAX_VISIBLE    = 3;
    const visibleAmenities = allAmenities.slice(0, MAX_VISIBLE);
    const hiddenCount    = allAmenities.length - MAX_VISIBLE;

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
            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Image */}
                    <div className="relative w-full lg:w-48 h-32 lg:h-32 flex-shrink-0">
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
                                    "absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1",
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
                    <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                    {vehicle?.name || "Charter Bus"}
                                </h3>
                                <p className="text-slate-500 text-sm mb-3">
                                    or equivalent | {vehicle?.passengers || 0}{" "}
                                    seater AC Cab
                                </p>

                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span>Driver allowance included</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                    <Fuel className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-slate-700">
                                        {vehicle?.includedKms || 0} kms included
                                    </span>
                                    <span className="text-slate-400">|</span>
                                    <span>
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
                            <div className="text-right flex-shrink-0">
                                {(vehicle?.discount || 0) > 0 && (
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                        <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            {vehicle?.discount || 0}% OFF
                                        </span>
                                        <span className="text-slate-400 line-through text-sm">
                                            {formatCurrency(
                                                vehicle?.originalPrice || 0,
                                                vehicle?.currency,
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(
                                        vehicle?.price || 0,
                                        vehicle?.currency,
                                    )}
                                </div>

                                <div className="text-slate-500 text-sm mt-1">
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
                        <div className="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                            {visibleAmenities.map((amenity) => (
                                <AmenityChip key={amenity} name={amenity} size="sm" />
                            ))}

                            {hiddenCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAllAmenities(true);
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-[11px] font-semibold"
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

                    {/* Select Button - Desktop */}
                    <div className="hidden lg:flex flex-col justify-center gap-3 flex-shrink-0">
                        <button
                            onClick={() => onSelect(vehicle.id)}
                            className={cn(
                                "px-8 py-3 rounded-xl font-bold transition-all duration-200 min-w-[140px]",
                                isSelected
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5",
                            )}
                        >
                            {isSelected ? "SELECTED" : "SELECT BUS"}
                        </button>

                        {isSelected && (
                            <div className="flex items-center justify-center gap-1 text-green-600 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Added</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toggle Details Button */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-4 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                    {showDetails ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                    Inclusions and Exclusions
                </button>
            </div>

            {/* Expanded Details Section */}
            {showDetails && (
                <div className="border-t border-slate-200 bg-slate-50 animate-in slide-in-from-top-2 duration-200">
                    {/* New Car Promise Banner */}
                    <div className="bg-blue-100 px-6 py-2 flex items-center gap-2 text-blue-800 text-sm">
                        <div className="bg-blue-600 text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                        </div>
                        <span className="font-medium">
                            New Car Promise - Model that is 2023 or newer @ $249
                        </span>
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-8">
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
                    <div className="px-6 pb-6">
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <h5 className="font-semibold text-slate-900 mb-2 text-sm">
                                Additional Information
                            </h5>
                            <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    <span>
                                        {vehicle?.luggage || 0} bags included
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span>GPS Tracking</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    <span>Insurance included</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Select Button */}
                    <div className="lg:hidden px-6 pb-6">
                        <button
                            onClick={() => onSelect(vehicle.id)}
                            className={cn(
                                "w-full py-3 rounded-xl font-bold transition-all duration-200",
                                isSelected
                                    ? "bg-green-500 text-white"
                                    : "bg-orange-500 text-white",
                            )}
                        >
                            {isSelected ? "SELECTED" : "SELECT CAR"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Country codes (module-level static list) ───────────────────────────────
const COUNTRY_CODES = [
    { code: "+1",   name: "USA / Canada" },
    { code: "+7",   name: "Russia" },
    { code: "+20",  name: "Egypt" },
    { code: "+27",  name: "South Africa" },
    { code: "+30",  name: "Greece" },
    { code: "+31",  name: "Netherlands" },
    { code: "+32",  name: "Belgium" },
    { code: "+33",  name: "France" },
    { code: "+34",  name: "Spain" },
    { code: "+36",  name: "Hungary" },
    { code: "+39",  name: "Italy" },
    { code: "+40",  name: "Romania" },
    { code: "+41",  name: "Switzerland" },
    { code: "+43",  name: "Austria" },
    { code: "+44",  name: "United Kingdom" },
    { code: "+45",  name: "Denmark" },
    { code: "+46",  name: "Sweden" },
    { code: "+47",  name: "Norway" },
    { code: "+48",  name: "Poland" },
    { code: "+49",  name: "Germany" },
    { code: "+52",  name: "Mexico" },
    { code: "+55",  name: "Brazil" },
    { code: "+60",  name: "Malaysia" },
    { code: "+61",  name: "Australia" },
    { code: "+62",  name: "Indonesia" },
    { code: "+63",  name: "Philippines" },
    { code: "+64",  name: "New Zealand" },
    { code: "+65",  name: "Singapore" },
    { code: "+66",  name: "Thailand" },
    { code: "+81",  name: "Japan" },
    { code: "+82",  name: "South Korea" },
    { code: "+84",  name: "Vietnam" },
    { code: "+86",  name: "China" },
    { code: "+90",  name: "Turkey" },
    { code: "+91",  name: "India" },
    { code: "+92",  name: "Pakistan" },
    { code: "+93",  name: "Afghanistan" },
    { code: "+94",  name: "Sri Lanka" },
    { code: "+95",  name: "Myanmar" },
    { code: "+98",  name: "Iran" },
    { code: "+212", name: "Morocco" },
    { code: "+213", name: "Algeria" },
    { code: "+216", name: "Tunisia" },
    { code: "+234", name: "Nigeria" },
    { code: "+254", name: "Kenya" },
    { code: "+255", name: "Tanzania" },
    { code: "+351", name: "Portugal" },
    { code: "+352", name: "Luxembourg" },
    { code: "+353", name: "Ireland" },
    { code: "+358", name: "Finland" },
    { code: "+380", name: "Ukraine" },
    { code: "+420", name: "Czech Republic" },
    { code: "+421", name: "Slovakia" },
    { code: "+971", name: "UAE" },
    { code: "+972", name: "Israel" },
    { code: "+973", name: "Bahrain" },
    { code: "+974", name: "Qatar" },
    { code: "+975", name: "Bhutan" },
    { code: "+976", name: "Mongolia" },
    { code: "+977", name: "Nepal" },
    { code: "+998", name: "Uzbekistan" },
];

// Contact Form Modal Component
const ContactFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        countryCode: "+1",
        phone: "",
        email: "",
        firstName: "",
        lastName: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen]);

    const validateField = (name, value) => {
        switch (name) {
            case "phone":
                return value.trim().length >= 10
                    ? ""
                    : "Please enter a valid phone number";
            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ""
                    : "Please enter a valid email address";
            case "firstName":
                return value.trim().length >= 2 ? "" : "First name is required";
            case "lastName":
                return value.trim().length >= 2 ? "" : "Last name is required";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        let hasErrors = false;

        Object.keys(formData).forEach((key) => {
            if (key !== "countryCode") {
                const error = validateField(key, formData[key]);
                if (error) {
                    newErrors[key] = error;
                    hasErrors = true;
                }
            }
        });

        setErrors(newErrors);
        setTouched({
            phone: true,
            email: true,
            firstName: true,
            lastName: true,
        });

        if (!hasErrors) {
            onSubmit(formData);
            onClose();
            // Navigate to confirmation page from inside the modal
            router.push("/bookingform/vechileselect/confirmation");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Booking Contact
                        </h2>
                        <p className="text-sm text-slate-500">
                            Please provide your contact details
                        </p> 
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="gap-2">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="w-36 shrink-0 py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                                {COUNTRY_CODES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.code} ({c.name})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="flex-1 py-2.5 px-3 mt-3  bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        {errors.phone && touched.phone && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="john.doe@example.com"
                                className={cn(
                                    "w-full !pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                                    errors.email && touched.email
                                        ? "border-red-300 focus:border-red-400 bg-red-50"
                                        : "border-slate-200 focus:border-blue-400",
                                )}
                            />
                        </div>
                        {errors.email && touched.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="John"
                                className={cn(
                                    "w-full !pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                                    errors.firstName && touched.firstName
                                        ? "border-red-300 focus:border-red-400 bg-red-50"
                                        : "border-slate-200 focus:border-blue-400",
                                )}
                            />
                        </div>
                        {errors.firstName && touched.firstName && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Doe"
                                className={cn(
                                    "w-full !pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                                    errors.lastName && touched.lastName
                                        ? "border-red-300 focus:border-red-400 bg-red-50"
                                        : "border-slate-200 focus:border-blue-400",
                                )}
                            />
                        </div>
                        {errors.lastName && touched.lastName && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.lastName}
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            Continue to Checkout
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full mt-3 py-2.5 text-slate-500 font-medium hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Not set";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Invalid Date";
        return (
            d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }) +
            " • " +
            d.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
        );
    } catch (e) {
        return "Not set";
    }
};

const TripSummary = ({
    tripDetails: propTripDetails,
    selectedVehicle,
    onContinue,
    showError,
    contactData,
}) => {
    const router = useRouter();
    const [showStops, setShowStops] = useState(false);
    const [localTripDetails, setLocalTripDetails] = useState(null);

    // Load from localStorage if prop not provided
    useEffect(() => {
        if (!propTripDetails) {
            try {
                const storedBooking = localStorage.getItem("bookingStep1");
                const storedTrip = localStorage.getItem("tripDetails");

                if (storedBooking) {
                    const parsed = JSON.parse(storedBooking);
                    setLocalTripDetails({
                        formData: parsed,
                        tripType: parsed.tripType || "one-way",
                        timestamp: parsed.timestamp,
                    });
                } else if (storedTrip) {
                    const parsed = JSON.parse(storedTrip);
                    setLocalTripDetails({
                        formData: parsed,
                        tripType: parsed.tripType || "one-way",
                    });
                }
            } catch (e) {
                console.error(
                    "Error loading trip details from localStorage:",
                    e,
                );
            }
        }
    }, [propTripDetails]);

    // Use prop data if available, otherwise use localStorage data
    const tripDetails = propTripDetails || localTripDetails;

    const tripData = tripDetails?.formData || {};
    const tripType = tripDetails?.tripType || "one-way";
    const isRoundTrip = tripType === "round-trip";
    const isHourly = tripType === "hourly";

    // Handle different data structures (direct or nested)
    const getValue = (field, nestedField = null) => {
        // Try direct access first
        if (tripData[field]) return tripData[field];

        // Try nested access (for round-trip structure)
        if (isRoundTrip && tripData.outbound) {
            return tripData.outbound[field] || tripData.outbound[nestedField];
        }

        return null;
    };

    const pickup = isRoundTrip
        ? tripData.outbound?.pickupAddress || tripData.pickupAddress
        : tripData.pickupAddress;

    const dropoff = isRoundTrip
        ? tripData.outbound?.dropoffAddress || tripData.dropoffAddress
        : tripData.dropoffAddress;

    const datetime = isRoundTrip
        ? tripData.outbound?.datetime || tripData.datetime
        : tripData.datetime;

    const passengers = isRoundTrip
        ? tripData.outbound?.passengers || tripData.passengers
        : tripData.passengers;

    const duration = isHourly ? tripData.duration : null;

    const orderType =
        tripData.orderType ||
        tripData.outbound?.orderType ||
        tripData.bookingType;

    const stops = (
        isRoundTrip
            ? tripData.outbound?.stops || tripData.stops || []
            : tripData.stops || []
    ).filter((s) => s && s.trim());

    // Check if we have any valid trip data
    const hasTripData = pickup || dropoff || datetime;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        Trip Summary
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {tripType.replace("-", " ")} Charter
                    </p>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {orderType ? orderType.replace("-", " ") : "In Progress"}
                </span>
            </div>

            {!hasTripData ? (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                        No trip details found
                    </p>
                    <button
                        onClick={() => router.push("/bookingform")}
                        className="text-blue-600 font-medium text-sm hover:underline"
                    >
                        Start New Booking
                    </button>
                </div>
            ) : (
                <div className="space-y-6 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-slate-200" />

                    {/* Pickup */}
                    <div className="relative flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center shrink-0 z-10 mt-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Pickup
                            </div>
                            <div className="font-bold text-slate-900 truncate">
                                {pickup || "Enter Pickup Location"}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                                {formatDisplayDate(datetime)}
                            </div>
                        </div>
                    </div>

                    {/* Intermediate Stops Dropdown */}
                    {stops.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowStops(!showStops)}
                                className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:text-blue-700 transition-all ml-8 py-1 px-2 bg-blue-50 rounded-lg border border-blue-100 mb-1"
                            >
                                {showStops ? (
                                    <ChevronUp className="w-3 h-3" />
                                ) : (
                                    <ChevronDown className="w-3 h-3" />
                                )}
                                {showStops ? "HIDE" : "SHOW"} {stops.length}{" "}
                                STOPS
                            </button>

                            {showStops && (
                                <div className="space-y-6 mt-6 animate-in slide-in-from-top-2 duration-300">
                                    {stops.map((stop, index) => (
                                        <div
                                            key={index}
                                            className="relative flex gap-4"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center shrink-0 z-10 mt-1">
                                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-0.5">
                                                    Stop {index + 1}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-700 truncate">
                                                    {stop}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dropoff */}
                    <div className="relative flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center shrink-0 z-10 mt-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Dropoff
                            </div>
                            <div className="font-bold text-slate-900 truncate">
                                {dropoff || "Enter Dropoff Location"}
                            </div>
                            {isRoundTrip && tripData.return?.datetime && (
                                <div className="text-sm text-blue-600 font-medium mt-3 flex items-center gap-1">
                                    <span className="bg-blue-100 px-1.5 py-0.5 rounded text-[10px] font-black mr-1">
                                        RETURN
                                    </span>
                                    {formatDisplayDate(
                                        tripData.return.datetime,
                                    )}
                                </div>
                            )}
                            {isRoundTrip &&
                                tripData.return?.stops?.length > 0 && (
                                    <p className="text-[10px] text-slate-400 italic mt-1 font-medium">
                                        + {tripData.return.stops.length} return
                                        stops included
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            )}

            {hasTripData && (
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                            <Users className="w-3 h-3" /> Passengers
                        </div>
                        <div className="font-semibold text-slate-900">
                            {passengers || 1} People
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase mb-1">
                            {isHourly ? (
                                <Clock className="w-3 h-3" />
                            ) : (
                                <MapPin className="w-3 h-3" />
                            )}
                            {isHourly ? "Duration" : "Distance"}
                        </div>
                        <div className="font-semibold text-slate-900">
                            {isHourly
                                ? duration
                                    ? `${duration} Hours`
                                    : "Not set"
                                : "Est. Total Trip"}
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Vehicle Display */}
            {selectedVehicle && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                        <img
                            src={selectedVehicle.image}
                            alt={selectedVehicle.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <div className="text-xs text-blue-600 font-bold uppercase mb-1">
                                Selected Vehicle
                            </div>
                            <div className="font-bold text-slate-900">
                                {selectedVehicle.name}
                            </div>
                            <div className="text-sm text-slate-600">
                                {formatCurrency(
                                    selectedVehicle.price,
                                    selectedVehicle.currency,
                                )}
                                /trip
                            </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            )}

            {/* Contact Info Display */}
            {contactData && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-green-600 font-bold uppercase mb-1">
                                Contact Info
                            </div>
                            <div className="font-bold text-slate-900 truncate">
                                {contactData.firstName} {contactData.lastName}
                            </div>
                            <div className="text-xs text-slate-600 truncate">
                                {contactData.email}
                            </div>
                            <div className="text-xs text-slate-600">
                                {contactData.countryCode} {contactData.phone}
                            </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    </div>
                </div>
            )}

            {/* Error Message */}
            {showError && !selectedVehicle && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Please select a vehicle to continue</span>
                </div>
            )}

            {/* Continue Button */}
            <button
                onClick={onContinue}
                className={cn(
                    "w-full mt-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    selectedVehicle
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed",
                )}
                disabled={!selectedVehicle}
            >
                {contactData ? "Proceed to Payment" : "Continue to Checkout"}
                <ArrowRight className="w-4 h-4" />
            </button>

            <button
                onClick={() => router.push("/bookingform")}
                className="w-full mt-3 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
            >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Trip Details
            </button>

            {/* Help Box */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PhoneCall className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Need Help?</h4>
                <p className="text-xs text-slate-500 mb-3">
                    Our charter experts are available 24/7 to assist you.
                </p>
                <a
                    href="#"
                    className="text-blue-600 font-semibold text-sm hover:underline"
                >
                    Call (888) 123-4567
                </a>
            </div>
        </div>
    );
};

export default function SelectVehiclePage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [tripDetails, setTripDetails] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchBuses() {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllBuses();
                console.log("API Response:", response);

                const buses = response?.data?.data ?? response?.data ?? [];
                console.log("Buses data:", buses);

                if (!Array.isArray(buses)) {
                    throw new Error("Invalid data format received");
                }

                if (buses.length === 0) {
                    setVehicles([]);
                    setLoading(false);
                    return;
                }

                const mappedBuses = buses.map((bus) => {
                    const inclusionsList = (bus.inclusions || [])
                        .map((i) => i.title)
                        .filter(Boolean);
                    const exclusionsList = (bus.exclusions || [])
                        .map((i) => i.title)
                        .filter(Boolean);
                    const currency = bus.pricing?.currency || "USD";

                    return {
                        id: bus._id?.toString() || bus.id,
                        name: bus.name || "Charter Bus",
                        price: bus.pricing?.price || 0,
                        originalPrice: bus.pricing?.originalPrice || 0,
                        discount: bus.pricing?.discountPercent || 0,
                        passengers: bus.seatCapacity || 0,
                        luggage: bus.luggageCapacity || 0,
                        image:
                            bus.image || "https://via.placeholder.com/400x300",
                        amenities: (bus.features || []).map((f) => f.name),
                        badge: bus.isMostPopular
                            ? "Most Popular"
                            : bus.isPremium
                              ? "Premium"
                              : null,
                        category:
                            bus.category === "Mini Bus"
                                ? "small"
                                : bus.category === "Luxury Coach" ||
                                    bus.category === "Volvo Bus"
                                  ? "large"
                                  : "medium",
                        inclusions:
                            inclusionsList.length > 0
                                ? inclusionsList
                                : [
                                      "Driver Allowance",
                                      "GST (5%)",
                                      "State Tax & Toll",
                                  ],
                        exclusions:
                            exclusionsList.length > 0
                                ? exclusionsList
                                : [
                                      "Parking charges",
                                      "Night charges (10 PM - 6 AM)",
                                  ],
                        extraKmRate: bus.distancePolicy?.extraKmPrice || 0,
                        includedKms: bus.distancePolicy?.includedKm || 0,
                        taxes: bus.pricing?.extraCharges || 0,
                        currency: currency,
                        billingCycle: bus.pricing?.billingCycle,
                    };
                });

                setVehicles(mappedBuses);
            } catch (err) {
                console.error("Error fetching buses:", err);
                setError(err.message || "Failed to load buses");
                setVehicles([]);
            } finally {
                setLoading(false);
            }
        }
        fetchBuses();
    }, []);

    const filteredVehicles = Array.isArray(vehicles)
        ? activeFilter === "all"
            ? vehicles
            : vehicles.filter((v) => v.category === activeFilter)
        : [];

    const selectedVehicle = selectedVehicleId
        ? vehicles?.find((v) => v.id === selectedVehicleId)
        : null;

    const handleVehicleSelect = (vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setShowError(false);

        const vehicle = vehicles?.find((v) => v.id === vehicleId);
        if (vehicle) {
            localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));
        }

        // Reset contact data when vehicle changes
        if (selectedVehicleId !== vehicleId) {
            setContactData(null);
        }
    };

    const handleContinueClick = () => {
        if (!selectedVehicleId) {
            setShowError(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // If contact data not filled, show modal
        if (!contactData) {
            setShowContactModal(true);
            return;
        }

        // If everything is filled, proceed
        handleFinalProceed();
    };

    const handleContactSubmit = (data) => {
        setContactData(data);
        localStorage.setItem("bookingContact", JSON.stringify(data));

        // Auto proceed after contact form submission
        setTimeout(() => {
            handleFinalProceed();
        }, 500);
    };

    const handleFinalProceed = () => {
        if (!selectedVehicleId || !contactData) {
            return;
        }

        // Store complete booking data
        const bookingData = {
            vehicle: selectedVehicle,
            contact: contactData,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem("bookingStep2", JSON.stringify(bookingData));

        // Navigate to confirmation page
        router.push("/bookingform/vechileselect/confirmation");
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 mt-20">
            <Head>
                <title>Select Vehicle | LuxCharter</title>
            </Head>

            <main className="max-w-7xl mx-auto px-6 py-8 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Vehicle Selection */}
                    <div className="lg:col-span-8">
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Select Your Vehicle
                            </h1>
                        </div>

                        {/* Error Banner */}
                        {showError && !selectedVehicleId && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-red-800">
                                        Vehicle Required
                                    </p>
                                    <p className="text-sm text-red-600">
                                        Please select a vehicle from the options
                                        below to continue with your booking.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact Required Notice */}
                        {selectedVehicleId && !contactData && (
                            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                                <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-blue-800">
                                        Contact Information Required
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        Please click "Continue to Checkout" and
                                        provide your contact details to proceed.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all border",
                                        activeFilter === filter.id
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600",
                                    )}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Vehicle List */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse"
                                    >
                                        <div className="flex gap-6">
                                            <div className="w-48 h-32 bg-slate-200 rounded-xl" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-6 bg-slate-200 rounded w-1/3" />
                                                <div className="h-4 bg-slate-100 rounded w-1/4" />
                                                <div className="h-4 bg-slate-100 rounded w-1/2" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-300">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    Error Loading Buses
                                </h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-4">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredVehicles.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                <Bus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    No buses available
                                </h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    There are currently no buses available for
                                    this category. Please check back later or
                                    contact support.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredVehicles.map((vehicle, idx) => (
                                    <VehicleCard
                                        key={`${vehicle.id}-${idx}`}
                                        vehicle={vehicle}
                                        isSelected={
                                            selectedVehicleId === vehicle.id
                                        }
                                        onSelect={handleVehicleSelect}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Mobile Continue Button (visible only on small screens) */}
                        <div className="lg:hidden mt-8">
                            <button
                                onClick={handleContinueClick}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                                    selectedVehicleId
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed",
                                )}
                                disabled={!selectedVehicleId}
                            >
                                {contactData
                                    ? "Proceed to Payment"
                                    : "Continue to Checkout"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            {showError && !selectedVehicleId && (
                                <p className="text-center text-red-600 text-sm mt-2">
                                    Please select a vehicle first
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4">
                        <TripSummary
                            tripDetails={tripDetails}
                            selectedVehicle={selectedVehicle}
                            onContinue={handleContinueClick}
                            showError={showError}
                            contactData={contactData}
                        />
                    </div>
                </div>
            </main>

            {/* Contact Form Modal */}
            <ContactFormModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                onSubmit={handleContactSubmit}
                initialData={contactData}
            />

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-20 py-8">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© 2023 LuxCharter Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-900">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-slate-900">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
