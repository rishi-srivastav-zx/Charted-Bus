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
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind class merging
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- Mock Data (Same as VehicleListing) ---
const VEHICLES = [
    {
        id: 1,
        name: "Mercedes-Benz Sprinter",
        price: 120,
        originalPrice: 140,
        discount: 14,
        passengers: 14,
        luggage: 10,
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/2019_Mercedes-Benz_Sprinter_314_CDi_2.1.jpg",
        amenities: ["Wifi", "AC", "Leather", "TV"],
        badge: "Most Popular",
        category: "small",
        inclusions: [
            "Driver Allowance",
            "Base Fare for 145 km",
            "State Tax & Toll",
            "Only One Pickup and Drop",
            "GST (5%)",
            "10 bags",
            "AC",
        ],
        exclusions: [
            "Parking charges",
            "Night charges (10 PM - 6 AM)",
            "Additional km beyond 145 km @ ₹12/km",
        ],
        extraKmRate: 12,
        includedKms: 145,
        taxes: 400,
    },
    {
        id: 2,
        name: "Luxury Mini Coach",
        price: 180,
        originalPrice: 210,
        discount: 15,
        passengers: 30,
        luggage: 25,
        image: "https://amrutatravel.com/img/amruta.jpeg",
        amenities: ["Wifi", "AC", "TV", "Restroom"],
        badge: null,
        category: "medium",
        inclusions: [
            "Driver Allowance",
            "Base Fare for 200 km",
            "State Tax & Toll",
            "Multiple Pickup Points",
            "GST (5%)",
            "25 bags",
            "AC",
        ],
        exclusions: [
            "Parking charges",
            "Interstate permits",
            "Additional km beyond 200 km @ ₹18/km",
        ],
        extraKmRate: 18,
        includedKms: 200,
        taxes: 600,
    },
    {
        id: 3,
        name: "Premium Motorcoach",
        price: 250,
        originalPrice: 290,
        discount: 14,
        passengers: 55,
        luggage: 50,
        image: "https://canadianfamilyoffices.com/app/uploads/2024/09/Cornerstone-RV-exterior.jpg",
        amenities: ["Wifi", "Power", "Restroom", "TV"],
        badge: "Best Value",
        category: "large",
        inclusions: [
            "Driver Allowance",
            "Base Fare for 250 km",
            "State Tax & Toll",
            "Multiple Pickup Points",
            "GST (5%)",
            "50 bags",
            "AC",
        ],
        exclusions: [
            "Parking charges",
            "Driver accommodation (for multi-day)",
            "Additional km beyond 250 km @ ₹25/km",
        ],
        extraKmRate: 25,
        includedKms: 250,
        taxes: 800,
    },
    {
        id: 4,
        name: "Executive Sleeper",
        price: 350,
        originalPrice: 400,
        discount: 12,
        passengers: 12,
        luggage: 15,
        image: "https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/15m-bus?dpr=off&fit=constrain&qlt=82&ts=1640080438967&wid=1024",
        amenities: ["Beds", "Kitchen", "TV", "Wifi"],
        badge: "Premium",
        category: "small",
        inclusions: [
            "Driver Allowance",
            "Base Fare for 300 km",
            "State Tax & Toll",
            "Overnight accommodation",
            "GST (5%)",
            "15 bags",
            "AC",
        ],
        exclusions: [
            "Parking charges",
            "Meals for passengers",
            "Additional km beyond 300 km @ ₹35/km",
        ],
        extraKmRate: 35,
        includedKms: 300,
        taxes: 1000,
    },
];

const FILTERS = [
    { id: "all", label: "All Vehicles" },
    { id: "small", label: "Small (8-20)" },
    { id: "medium", label: "Medium (20-40)" },
    { id: "large", label: "Large (40+)" },
];

// Currency formatter
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
};

// Amenity Icon Component
const AmenityIcon = ({ name }) => {
    const icons = {
        Wifi: <Wifi className="w-4 h-4" />,
        AC: <Wind className="w-4 h-4" />,
        TV: <Tv className="w-4 h-4" />,
        Leather: <Armchair className="w-4 h-4" />,
        Restroom: <div className="text-[10px] font-bold">WC</div>,
        Power: <div className="text-[10px] font-bold">P</div>,
        Beds: <div className="text-[10px] font-bold">BED</div>,
        Kitchen: <div className="text-[10px] font-bold">KIT</div>,
    };

    return (
        <div className="flex flex-col items-center gap-1 text-slate-500">
            {icons[name] || <div className="w-4 h-4" />}
            <span className="text-[10px] uppercase font-medium">{name}</span>
        </div>
    );
};

// Vehicle Card Component (Integrated from VehicleListing)
const VehicleCard = ({ vehicle, isSelected, onSelect }) => {
    const [showDetails, setShowDetails] = useState(false);

    const totalPrice = vehicle.price + vehicle.taxes;

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
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover rounded-xl"
                        />
                        {vehicle.badge && (
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
                                    {vehicle.name}
                                </h3>
                                <p className="text-slate-500 text-sm mb-3">
                                    or equivalent | {vehicle.passengers} seater
                                    AC Cab
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
                                        {vehicle.includedKms} kms included
                                    </span>
                                    <span className="text-slate-400">|</span>
                                    <span>
                                        Post limit:{" "}
                                        {formatCurrency(vehicle.extraKmRate)}/km
                                    </span>
                                </div>
                            </div>

                            {/* Right: Pricing */}
                            <div className="text-right flex-shrink-0">
                                {vehicle.discount > 0 && (
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                        <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            {vehicle.discount}% OFF
                                        </span>
                                        <span className="text-slate-400 line-through text-sm">
                                            {formatCurrency(
                                                vehicle.originalPrice,
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(vehicle.price)}
                                </div>

                                <div className="text-slate-500 text-sm mt-1">
                                    + {formatCurrency(vehicle.taxes)} Charges
                                    and Taxes
                                </div>

                                <div className="text-xs text-slate-400 mt-1">
                                    Total: {formatCurrency(totalPrice)}
                                </div>
                            </div>
                        </div>

                        {/* Amenities Row */}
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                            {vehicle.amenities.map((amenity) => (
                                <AmenityIcon key={amenity} name={amenity} />
                            ))}
                        </div>
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
                            {isSelected ? "SELECTED" : "SELECT CAR"}
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
                            New Car Promise - Model that is 2023 or newer @ ₹249
                        </span>
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-8">
                        {/* Inclusions */}
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                Inclusions
                            </h4>
                            <ul className="space-y-3">
                                {vehicle.inclusions.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-sm text-slate-700"
                                    >
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Exclusions */}
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                </div>
                                Exclusions
                            </h4>
                            <ul className="space-y-3">
                                {vehicle.exclusions.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-sm text-slate-700"
                                    >
                                        <div className="w-4 h-4 rounded-full border-2 border-red-300 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                                    <span>{vehicle.luggage} bags included</span>
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

// Contact Form Modal Component
const ContactFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
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
                        <div className="flex gap-2">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                                <option value="+1">+1</option>
                                <option value="+44">+44</option>
                                <option value="+61">+61</option>
                                <option value="+91">+91</option>
                                <option value="+81">+81</option>
                            </select>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="(555) 123-4567"
                                className={cn(
                                    "flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                                    errors.phone && touched.phone
                                        ? "border-red-300 focus:border-red-400 bg-red-50"
                                        : "border-slate-200 focus:border-blue-400",
                                )}
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
                                    "w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
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
                                    "w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
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
                                    "w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
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
    tripDetails,
    selectedVehicle,
    onContinue,
    showError,
    contactData,
}) => {
    const router = useRouter();
    const [showStops, setShowStops] = useState(false);

    const tripData = tripDetails?.formData || {};
    const tripType = tripDetails?.tripType || "one-way";
    const isRoundTrip = tripType === "round-trip";
    const isHourly = tripType === "hourly";

    const pickup = isRoundTrip
        ? tripData.outbound?.pickupAddress
        : tripData.pickupAddress;
    const dropoff = isRoundTrip
        ? tripData.outbound?.dropoffAddress
        : tripData.dropoffAddress;
    const datetime = isRoundTrip
        ? tripData.outbound?.datetime
        : tripData.datetime;
    const passengers = isRoundTrip
        ? tripData.outbound?.passengers
        : tripData.passengers;
    const duration = isHourly ? tripData.duration : null;
    const orderType = tripData.orderType || tripData.outbound?.orderType;
    const stops = (
        isRoundTrip ? tripData.outbound?.stops || [] : tripData.stops || []
    ).filter((s) => s);

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
                            {showStops ? "HIDE" : "SHOW"} {stops.length} STOPS
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
                                {formatDisplayDate(tripData.return.datetime)}
                            </div>
                        )}
                        {isRoundTrip && tripData.return?.stops?.length > 0 && (
                            <p className="text-[10px] text-slate-400 italic mt-1 font-medium">
                                + {tripData.return.stops.length} return stops
                                included
                            </p>
                        )}
                    </div>
                </div>
            </div>

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
                                {formatCurrency(selectedVehicle.price)}/trip
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
    const router = useRouter();

    useEffect(() => {
        // Load data from localStorage on mount
        const savedStep1 = localStorage.getItem("bookingStep1");
        if (savedStep1) {
            try {
                setTripDetails(JSON.parse(savedStep1));
            } catch (e) {
                console.error("Error parsing saved step 1 data:", e);
            }
        }

        const savedVehicle = localStorage.getItem("selectedVehicle");
        if (savedVehicle) {
            try {
                const vehicle = JSON.parse(savedVehicle);
                setSelectedVehicleId(vehicle.id);
            } catch (e) {
                console.error("Error parsing saved vehicle:", e);
            }
        }

        const savedContact = localStorage.getItem("bookingContact");
        if (savedContact) {
            try {
                setContactData(JSON.parse(savedContact));
            } catch (e) {
                console.error("Error parsing saved contact:", e);
            }
        }
    }, []);

    const filteredVehicles =
        activeFilter === "all"
            ? VEHICLES
            : VEHICLES.filter((v) => v.category === activeFilter);

    const selectedVehicle = selectedVehicleId
        ? VEHICLES.find((v) => v.id === selectedVehicleId)
        : null;

    const handleVehicleSelect = (vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setShowError(false);

        const vehicle = VEHICLES.find((v) => v.id === vehicleId);
        localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));

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
                            <p className="text-slate-500">
                                Step 2 of 4: Choose the perfect charter bus for
                                your journey.
                            </p>
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

                        {/* Vehicle List (VehicleListing Style) */}
                        <div className="space-y-4">
                            {filteredVehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    isSelected={
                                        selectedVehicleId === vehicle.id
                                    }
                                    onSelect={handleVehicleSelect}
                                />
                            ))}
                        </div>

                        {filteredVehicles.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                <Bus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">
                                    No vehicles found
                                </h3>
                                <p className="text-slate-500">
                                    Try adjusting your filters to see more
                                    options.
                                </p>
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
