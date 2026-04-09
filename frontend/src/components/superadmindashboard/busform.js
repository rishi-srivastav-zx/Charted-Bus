"use client";

import { useState, useEffect, useRef } from "react";
import {
    Car,
    Plus,
    X,
    Check,
    DollarSign,
    Star,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Trash2,
    Save,
    Sparkles,
    Shield,
    Zap,
    Users,
    Gauge,
    Camera,
    CheckCircle2,
    Loader2,
    Eye,
    Wifi,
    Navigation,
    Bluetooth,
    Usb,
    Snowflake,
    Flame,
    Sun,
    Tv,
    Speaker,
    Baby,
    Accessibility,
    Dog,
    Cigarette,
    Wine,
    Coffee,
    Lightbulb,
    EyeOff,
    Luggage,
    Crown,
    Gem,
    Fan,
    Truck,
    CarFront,
    Droplet,
    Leaf,
    Wind,
    Settings,
    TrendingUp,
    BadgeCheck,
    Moon,
    Fuel,
    Info,
    Bus,
    BusFront,
    Bed,
    XIcon,
} from "lucide-react";
import { createBusWithHandler, updateBusWithHandler, uploadImage } from "../../services/busservices";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENCIES = [{ code: "USD", symbol: "$", label: "US Dollar" }];

const INITIAL_FORM = {
    name: "",
    image: "",
    category: "",
    seatCapacity: "",
    isMostPopular: false,
    isElectric: false,
    isPremium: false,
    licensePlate: "",
    fuelType: "Petrol",
    luggageCapacity: "",
    pricing: {
        price: "",
        originalPrice: "",
        discountPercent: "",
        extraCharges: "0",
        totalPrice: "",
        currency: "USD",
        billingCycle: "per_day",
    },
    distancePolicy: {
        includedKm: "",
        extraKmPrice: "",
    },
    driverAllowanceIncluded: true,
    nightChargesApplicable: false,
    nightChargesStartTime: "22:00",
    nightChargesExtra: "",
    features: [],
    inclusions: [],
    exclusions: [],
    addOns: [],
    additionalInfo: [],
    policies: [],
};

const INITIAL_INPUTS = {
    feature: "",
    inclusion: "",
    exclusion: "",
    addOn: { title: "", price: "", isOptional: true },
    info: { label: "", value: "" },
    policy: { title: "", description: "" },
};

const categories = [
    { name: "Mini Bus", icon: Bus, color: "blue", capacity: "15-25 seats" },
    {
        name: "Luxury Coach",
        icon: BusFront,
        color: "emerald",
        capacity: "35-45 seats",
    },
    {
        name: "Volvo Bus",
        icon: Sparkles,
        color: "violet",
        capacity: "40-50 seats",
    },
    {
        name: "Sleeper Bus",
        icon: Bed,
        color: "amber",
        capacity: "20-30 berths",
    },
    {
        name: "AC Deluxe",
        icon: Snowflake,
        color: "rose",
        capacity: "30-40 seats",
    },
    {
        name: "Non-AC Standard",
        icon: Wind,
        color: "cyan",
        capacity: "30-50 seats",
    },
];

const fuelTypes = [
    { name: "Petrol", icon: Droplet },
    { name: "Diesel", icon: Fuel },
    { name: "Electric", icon: Zap },
    { name: "Hybrid", icon: Leaf },
    { name: "CNG", icon: Wind },
];

const featureSuggestions = [
    { name: "WiFi", icon: Wifi },
    { name: "GPS Navigation", icon: Navigation },
    { name: "Bluetooth", icon: Bluetooth },
    { name: "USB Charging", icon: Usb },
    { name: "Air Conditioning", icon: Snowflake },
    { name: "Heated Seats", icon: Flame },
    { name: "Entertainment System", icon: Tv },
    { name: "Premium Sound", icon: Speaker },
    { name: "Child Seat", icon: Baby },
    { name: "Wheelchair Access", icon: Accessibility },
    { name: "Pet Friendly", icon: Dog },
    { name: "Mini Bar", icon: Wine },
    { name: "Refreshments", icon: Coffee },
    { name: "Ambient Lighting", icon: Lightbulb },
    { name: "Privacy Glass", icon: EyeOff },
    { name: "Luggage Carrier", icon: Luggage },
];

const tabs = [
    { id: "basic", label: "Basic Info", icon: Car, color: "blue" },
    { id: "specs", label: "Specifications", icon: Settings, color: "slate" },
    { id: "pricing", label: "Pricing", icon: DollarSign, color: "emerald" },
    { id: "policy", label: "Policy", icon: Shield, color: "violet" },
    { id: "features", label: "Features", icon: Sparkles, color: "amber" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrencySymbol(code) {
    return CURRENCIES.find((c) => c.code === code)?.symbol ?? "$";
}

function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {msg}
        </p>
    );
}

function SectionHeader({ icon: Icon, title, subtitle, gradient }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div
                className={`p-3 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg`}
            >
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                <p className="text-slate-500 text-sm">{subtitle}</p>
            </div>
        </div>
    );
}

// ─── Build initial form state from existing bus data ─────────────────────────
function buildInitialForm(initialData) {
    if (!initialData) return INITIAL_FORM;
    return {
        name: initialData.name ?? "",
        image: initialData.image ?? "",
        category: initialData.category ?? "",
        seatCapacity: initialData.seatCapacity ?? "",
        isMostPopular: initialData.isMostPopular ?? false,
        isElectric: initialData.isElectric ?? false,
        isPremium: initialData.isPremium ?? false,
        licensePlate: initialData.licensePlate ?? "",
        fuelType: initialData.fuelType ?? "Petrol",
        luggageCapacity: initialData.luggageCapacity ?? "",
        description: initialData.description ?? "",
        pricing: {
            price: initialData.pricing?.price ?? "",
            originalPrice: initialData.pricing?.originalPrice ?? "",
            discountPercent: initialData.pricing?.discountPercent ?? "",
            extraCharges: initialData.pricing?.extraCharges ?? "0",
            totalPrice: initialData.pricing?.totalPrice ?? "",
            currency: initialData.pricing?.currency ?? "USD",
            billingCycle: initialData.pricing?.billingCycle ?? "per_day",
        },
        distancePolicy: {
            includedKm: initialData.distancePolicy?.includedKm ?? "",
            extraKmPrice: initialData.distancePolicy?.extraKmPrice ?? "",
        },
        driverAllowanceIncluded: initialData.driverAllowanceIncluded ?? true,
        nightChargesApplicable: initialData.nightChargesApplicable ?? false,
        nightChargesStartTime: initialData.nightChargesStartTime ?? "22:00",
        nightChargesExtra: initialData.nightChargesExtra ?? "",
        features: initialData.features ?? [],
        inclusions: initialData.inclusions ?? [],
        exclusions: initialData.exclusions ?? [],
        addOns: initialData.addOns ?? [],
        additionalInfo: initialData.additionalInfo ?? [],
        policies: initialData.policies ?? [],
    };
}



export default function BusForm({
    onSuccess,
    initialData = null,
    vehicleId = null,
}) {
    const isEditMode = !!vehicleId;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState(
        initialData?.image ?? null,
    );
    const [isDragging, setIsDragging] = useState(false);
    const [completedTabs, setCompletedTabs] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(() =>
        buildInitialForm(initialData),
    );
    const [inputs, setInputs] = useState(INITIAL_INPUTS);

    // ── Re-hydrate if initialData changes (e.g. modal re-opens for different bus) ──
    useEffect(() => {
        if (initialData) {
            setFormData(buildInitialForm(initialData));
            setImagePreview(initialData.image ?? null);
            setActiveTab("basic");
            setCompletedTabs([]);
            setErrors({});
        }
    }, [initialData?._id ?? initialData?.id]);

    const currencySymbol = getCurrencySymbol(formData.pricing.currency);

    // ── Auto-calculate discount & total ──────────────────────────────────────
    useEffect(() => {
        const p = parseFloat(formData.pricing.price) || 0;
        const op = parseFloat(formData.pricing.originalPrice) || 0;
        const ec = parseFloat(formData.pricing.extraCharges) || 0;
        if (op > 0 && p > 0) {
            const discount = Math.round(((op - p) / op) * 100);
            const total = (p + ec).toFixed(2);
            setFormData((prev) => ({
                ...prev,
                pricing: {
                    ...prev.pricing,
                    discountPercent: discount,
                    totalPrice: total,
                },
            }));
        }
    }, [
        formData.pricing.price,
        formData.pricing.originalPrice,
        formData.pricing.extraCharges,
    ]);

    // ── Tab navigation ────────────────────────────────────────────────────────
    const handleTabChange = (tabId) => {
        setCompletedTabs((prev) =>
            prev.includes(activeTab) ? prev : [...prev, activeTab],
        );
        setActiveTab(tabId);
    };

    const handleNext = () => {
        if (!validateCurrentTab()) return;
        const idx = tabs.findIndex((t) => t.id === activeTab);
        if (idx < tabs.length - 1) {
            setCompletedTabs((prev) =>
                prev.includes(activeTab) ? prev : [...prev, activeTab],
            );
            setActiveTab(tabs[idx + 1].id);
        }
    };

    const handleBack = () => {
        const idx = tabs.findIndex((t) => t.id === activeTab);
        if (idx > 0) setActiveTab(tabs[idx - 1].id);
    };

    // ── Field change ──────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setErrors((prev) => ({ ...prev, [name]: null }));
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // ── Image ─────────────────────────────────────────────────────────────────
    const handleImageUrl = (e) => {
        const url = e.target.value;
        setFormData((prev) => ({ ...prev, image: url }));
        setImagePreview(url);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0] ?? e;
        if (!file || !file.type) return;
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                image: "Please select an image file.",
            }));
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                image: "Image must be under 10 MB.",
            }));
            return;
        }
        setIsUploading(true);
        const fd = new FormData();
        fd.append("image", file);
        try {
            const res = await uploadImage(fd);
            if (res.data.success) {
                const url = res.data.data.secureUrl || res.data.data.url;
                setImagePreview(url);
                setFormData((prev) => ({ ...prev, image: url }));
            } else throw new Error(res.data.message);
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                image: `Upload failed: ${err.message}`,
            }));
        } finally {
            setIsUploading(false);
        }
    };

    // ── List helpers ──────────────────────────────────────────────────────────
    const addItem = (field, value) => {
        const isEmpty =
            !value ||
            (typeof value === "object" &&
                Object.values(value).every((v) => !v));
        if (isEmpty) return;
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], value] }));
        if (field === "features") setInputs((p) => ({ ...p, feature: "" }));
        if (field === "inclusions") setInputs((p) => ({ ...p, inclusion: "" }));
        if (field === "exclusions") setInputs((p) => ({ ...p, exclusion: "" }));
        if (field === "addOns")
            setInputs((p) => ({
                ...p,
                addOn: { title: "", price: "", isOptional: true },
            }));
        if (field === "additionalInfo")
            setInputs((p) => ({ ...p, info: { label: "", value: "" } }));
        if (field === "policies")
            setInputs((p) => ({
                ...p,
                policy: { title: "", description: "" },
            }));
    };

    const removeItem = (field, index) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const addSuggestedFeature = (feature) => {
        if (!formData.features.find((f) => f.name === feature.name)) {
            setFormData((prev) => ({
                ...prev,
                features: [...prev.features, { name: feature.name }],
            }));
        }
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const validateCurrentTab = () => {
        const e = {};
        if (activeTab === "basic") {
            if (!formData.name.trim()) e.name = "Vehicle name is required";
            if (!formData.category) e.category = "Category is required";
            if (!formData.seatCapacity)
                e.seatCapacity = "Seat capacity is required";
        }
        if (activeTab === "specs") {
            if (!formData.licensePlate.trim())
                e.licensePlate = "License plate is required";
            if (!formData.fuelType) e.fuelType = "Fuel type is required";
        }
        if (activeTab === "pricing") {
            if (!formData.pricing.price) e.price = "Selling price is required";
            if (!formData.pricing.originalPrice)
                e.originalPrice = "Original price is required";
        }
        if (activeTab === "policy") {
            if (!formData.distancePolicy.includedKm)
                e.includedKm = "Included KM is required";
            if (!formData.distancePolicy.extraKmPrice)
                e.extraKmPrice = "Extra KM price is required";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateForm = () => {
        const e = {};
        if (!formData.name.trim()) e.name = "Vehicle name is required";
        if (!formData.category) e.category = "Category is required";
        if (!formData.seatCapacity)
            e.seatCapacity = "Seat capacity is required";
        if (!formData.licensePlate.trim())
            e.licensePlate = "License plate is required";
        if (!formData.pricing.price) e.price = "Selling price is required";
        if (!formData.pricing.originalPrice)
            e.originalPrice = "Original price is required";
        if (!formData.distancePolicy.includedKm)
            e.includedKm = "Included KM is required";
        if (!formData.distancePolicy.extraKmPrice)
            e.extraKmPrice = "Extra KM price is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const errorTabMap = {
                basic: ["name", "category", "seatCapacity"],
                specs: ["licensePlate", "fuelType"],
                pricing: ["price", "originalPrice"],
                policy: ["includedKm", "extraKmPrice"],
            };
            const errs = errors;
            const firstTab = tabs.find((t) =>
                (errorTabMap[t.id] || []).some((k) => errs[k]),
            );
            if (firstTab) setActiveTab(firstTab.id);
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await updateBusWithHandler(vehicleId, formData);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onSuccess?.();
                }, 1500);
            } else {
                await createBusWithHandler(formData);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setFormData(INITIAL_FORM);
                    setImagePreview(null);
                    setCompletedTabs([]);
                    setActiveTab("basic");
                    onSuccess?.();
                }, 1500);
            }
        } catch (err) {
            setErrors({
                submit: `Failed to ${isEditMode ? "update" : "create"} vehicle. Please try again.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isTabCompleted = (id) => completedTabs.includes(id);
    const currentTabIdx = tabs.findIndex((t) => t.id === activeTab);
    const [showInclusionInput, setShowInclusionInput] = useState(false);
    const [showExclusionInput, setShowExclusionInput] = useState(false);
    const [distanceUnit, setDistanceUnit] = useState("km");

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* ── Header ── */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-lg mb-4">
                        <div
                            className={`bg-gradient-to-br ${isEditMode ? "from-amber-500 to-orange-500" : "from-blue-600 to-purple-600"} p-3 rounded-xl mr-3`}
                        >
                            <Car className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                {isEditMode
                                    ? "Edit Vehicle"
                                    : "Add New Vehicle"}
                            </h1>
                            {isEditMode && (
                                <p className="text-sm text-amber-600 font-medium mt-0.5">
                                    Editing: {initialData?.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {isEditMode
                            ? "Update the vehicle details below."
                            : "Complete all steps to add a vehicle to your fleet."}{" "}
                        <span className="text-red-500">*</span> fields are
                        required.
                    </p>
                </div>

                {/* ── Success ── */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                        <div className="bg-green-500 p-2 rounded-full">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-green-800">
                                {isEditMode
                                    ? "Vehicle Updated!"
                                    : "Vehicle Created!"}
                            </h3>
                            <p className="text-green-700 text-sm">
                                {isEditMode
                                    ? "Changes have been saved."
                                    : "Your vehicle is now live in the fleet."}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="text-green-600 hover:bg-green-100 p-2 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {errors.submit && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <p className="text-red-700 font-medium">
                            {errors.submit}
                        </p>
                    </div>
                )}

                {/* ── Progress Steps ── */}
                <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-6 h-1 bg-slate-200 -z-10 rounded-full" />
                        <div
                            className="absolute left-0 top-6 h-1 bg-gradient-to-r from-blue-600 to-purple-600 -z-10 rounded-full transition-all duration-500"
                            style={{
                                width: `${(currentTabIdx / (tabs.length - 1)) * 100}%`,
                            }}
                        />
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const isCompleted = isTabCompleted(tab.id);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative flex flex-col items-center gap-2 ${isActive ? "scale-110" : "hover:scale-105"} transition-all duration-300`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isActive ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white ring-4 ring-blue-100" : isCompleted ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" : "bg-white text-slate-400 border-2 border-slate-200"}`}
                                    >
                                        {isCompleted && !isActive ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : (
                                            <Icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs font-semibold hidden sm:block ${isActive ? "text-slate-900" : "text-slate-500"}`}
                                    >
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* ══════════ MAIN FORM ══════════ */}
                    <div className="lg:col-span-2">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                        >
                            {/* ─── TAB: Basic Info ─── */}
                            {activeTab === "basic" && (
                                <div className="p-8 space-y-6">
                                    <SectionHeader
                                        icon={Car}
                                        title="Basic Information"
                                        subtitle="Core details about the vehicle"
                                        gradient="from-blue-500 to-blue-600"
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Vehicle Name */}
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Vehicle Name{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="e.g., Mercedes-Benz Sprinter"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-4 pr-12 rounded-xl border-2 transition-all bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${errors.name ? "border-red-400 bg-red-50/50" : "border-slate-200 focus:border-blue-500 focus:bg-white"}`}
                                                />
                                                <Car className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                                            </div>
                                            <FieldError msg={errors.name} />
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">
                                                Category{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {categories.map((cat) => {
                                                    const Icon = cat.icon;
                                                    const sel =
                                                        formData.category ===
                                                        cat.name;
                                                    return (
                                                        <button
                                                            key={cat.name}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(
                                                                    (p) => ({
                                                                        ...p,
                                                                        category:
                                                                            cat.name,
                                                                    }),
                                                                );
                                                                setErrors(
                                                                    (p) => ({
                                                                        ...p,
                                                                        category:
                                                                            null,
                                                                    }),
                                                                );
                                                            }}
                                                            className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${sel ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                                                        >
                                                            <Icon
                                                                className={`w-5 h-5 ${sel ? "text-blue-600" : "text-slate-400"}`}
                                                            />
                                                            <span className="text-xs font-semibold">
                                                                {cat.name}
                                                            </span>
                                                            {sel && (
                                                                <CheckCircle2 className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-blue-600" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <FieldError msg={errors.category} />
                                        </div>

                                        {/* Seat Capacity */}
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">
                                                    Seat Capacity{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="seatCapacity"
                                                        min="1"
                                                        max="50"
                                                        placeholder="e.g., 14"
                                                        value={
                                                            formData.seatCapacity
                                                        }
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all focus:outline-none ${errors.seatCapacity ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-500"}`}
                                                    />
                                                    <Users className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
                                                </div>
                                                <FieldError
                                                    msg={errors.seatCapacity}
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-slate-700">
                                                Vehicle Image
                                            </label>
                                            <div
                                                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"}`}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(true);
                                                }}
                                                onDragLeave={() =>
                                                    setIsDragging(false)
                                                }
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                    const f =
                                                        e.dataTransfer.files[0];
                                                    if (f)
                                                        handleFileUpload({
                                                            target: {
                                                                files: [f],
                                                            },
                                                        });
                                                }}
                                            >
                                                {imagePreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-auto object-cover rounded-xl shadow"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview(
                                                                    null,
                                                                );
                                                                setFormData(
                                                                    (p) => ({
                                                                        ...p,
                                                                        image: "",
                                                                    }),
                                                                );
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            {isUploading ? (
                                                                <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                                                            ) : (
                                                                <Camera className="w-7 h-7 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <p className="text-slate-600 font-medium text-sm mb-1">
                                                            Drop image here or{" "}
                                                            <span
                                                                className="text-blue-600 cursor-pointer hover:underline"
                                                                onClick={() =>
                                                                    fileInputRef.current?.click()
                                                                }
                                                            >
                                                                browse
                                                            </span>
                                                        </p>
                                                        <p className="text-slate-400 text-xs">
                                                            JPG, PNG, WebP — max
                                                            10 MB
                                                        </p>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleFileUpload
                                                            }
                                                            className="hidden"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="url"
                                                placeholder="Or paste image URL…"
                                                value={formData.image}
                                                onChange={handleImageUrl}
                                                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-sm transition-all"
                                            />
                                            <FieldError msg={errors.image} />
                                        </div>

                                        {/* Toggles */}
                                        <div className="md:col-span-2 grid md:grid-cols-3 gap-3">
                                            {[
                                                {
                                                    key: "isMostPopular",
                                                    label: "Most Popular",
                                                    sub: "Highlight in listings",
                                                    icon: Star,
                                                    color: "amber",
                                                },
                                                {
                                                    key: "isElectric",
                                                    label: "Electric",
                                                    sub: "Eco-friendly vehicle",
                                                    icon: Zap,
                                                    color: "green",
                                                },
                                                {
                                                    key: "isPremium",
                                                    label: "Premium",
                                                    sub: "Luxury category",
                                                    icon: Crown,
                                                    color: "purple",
                                                },
                                            ].map(
                                                ({
                                                    key,
                                                    label,
                                                    sub,
                                                    icon: Icon,
                                                    color,
                                                }) => (
                                                    <label
                                                        key={key}
                                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData[key] ? `border-${color}-400 bg-${color}-50` : "border-slate-200 hover:border-slate-300"}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name={key}
                                                            checked={
                                                                formData[key]
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="w-5 h-5 rounded"
                                                        />
                                                        <div>
                                                            <span className="font-bold text-slate-700 flex items-center gap-1.5 text-sm">
                                                                <Icon
                                                                    className={`w-4 h-4 text-${color}-500`}
                                                                />{" "}
                                                                {label}
                                                            </span>
                                                            <p className="text-xs text-slate-500">
                                                                {sub}
                                                            </p>
                                                        </div>
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ─── TAB: Specifications ─── */}
                            {activeTab === "specs" && (
                                <div className="p-8 space-y-6">
                                    <SectionHeader
                                        icon={Settings}
                                        title="Specifications"
                                        subtitle="Technical details and vehicle identifiers"
                                        gradient="from-slate-500 to-slate-700"
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                License Plate{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="licensePlate"
                                                placeholder="e.g., MH-01-AB-1234"
                                                value={formData.licensePlate}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none uppercase tracking-widest font-mono ${errors.licensePlate ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-slate-500"}`}
                                            />
                                            <FieldError
                                                msg={errors.licensePlate}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Luggage Capacity
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="luggageCapacity"
                                                    min="0"
                                                    placeholder="e.g., 10 bags"
                                                    value={
                                                        formData.luggageCapacity
                                                    }
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-slate-200 focus:border-slate-500 focus:outline-none transition-all"
                                                />
                                                <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-medium">
                                                    bags
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">
                                                Fuel Type{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {fuelTypes.map((fuel) => {
                                                    const Icon = fuel.icon;
                                                    const sel =
                                                        formData.fuelType ===
                                                        fuel.name;
                                                    return (
                                                        <button
                                                            key={fuel.name}
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData(
                                                                    (p) => ({
                                                                        ...p,
                                                                        fuelType:
                                                                            fuel.name,
                                                                    }),
                                                                )
                                                            }
                                                            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${sel ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300"}`}
                                                        >
                                                            <Icon
                                                                className={`w-4 h-4 ${sel ? "text-blue-600" : "text-slate-400"}`}
                                                            />
                                                            <span className="text-sm font-medium">
                                                                {fuel.name}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <FieldError msg={errors.fuelType} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                rows="5"
                                                placeholder="Describe what makes this vehicle special…"
                                                value={
                                                    formData.description || ""
                                                }
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-500 focus:outline-none transition-all resize-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ─── TAB: Pricing ─── */}
                            {activeTab === "pricing" && (
                                <div className="p-8 space-y-6">
                                    <SectionHeader
                                        icon={DollarSign}
                                        title="Pricing Details"
                                        subtitle="Set competitive pricing with auto-calculated discount"
                                        gradient="from-emerald-500 to-emerald-600"
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Currency
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {CURRENCIES.map((cur) => {
                                                    const sel =
                                                        formData.pricing
                                                            .currency ===
                                                        cur.code;
                                                    return (
                                                        <button
                                                            key={cur.code}
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData(
                                                                    (p) => ({
                                                                        ...p,
                                                                        pricing:
                                                                            {
                                                                                ...p.pricing,
                                                                                currency:
                                                                                    cur.code,
                                                                            },
                                                                    }),
                                                                )
                                                            }
                                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${sel ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}
                                                        >
                                                            <span className="text-lg">
                                                                {cur.symbol}
                                                            </span>
                                                            <span>
                                                                {cur.code}
                                                            </span>
                                                            <span className="text-xs font-normal hidden sm:inline">
                                                                {cur.label}
                                                            </span>
                                                            {sel && (
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Original Price{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-4 text-slate-500 font-bold text-lg">
                                                    {currencySymbol}
                                                </span>
                                                <input
                                                    type="number"
                                                    name="pricing.originalPrice"
                                                    placeholder="0.00"
                                                    value={
                                                        formData.pricing
                                                            .originalPrice
                                                    }
                                                    onChange={handleChange}
                                                    className={`w-full !pl-10 pr-4 py-4 rounded-xl border-2 text-lg font-semibold focus:outline-none transition-all ${errors.originalPrice ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-emerald-500"}`}
                                                />
                                            </div>
                                            <FieldError
                                                msg={errors.originalPrice}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Selling Price{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-4 text-slate-500 font-bold text-lg">
                                                    {currencySymbol}
                                                </span>
                                                <input
                                                    type="number"
                                                    name="pricing.price"
                                                    placeholder="0.00"
                                                    value={
                                                        formData.pricing.price
                                                    }
                                                    onChange={handleChange}
                                                    className={`w-full !pl-10 pr-4 py-4 rounded-xl border-2 text-lg font-semibold focus:outline-none transition-all ${errors.price ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-emerald-500"}`}
                                                />
                                            </div>
                                            <FieldError msg={errors.price} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Extra Charges &amp; Taxes
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-4 text-slate-500 font-bold">
                                                    {currencySymbol}
                                                </span>
                                                <input
                                                    type="number"
                                                    name="pricing.extraCharges"
                                                    placeholder="0.00"
                                                    value={
                                                        formData.pricing
                                                            .extraCharges
                                                    }
                                                    onChange={handleChange}
                                                    className="w-full !pl-10 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Billing Cycle
                                            </label>
                                            <select
                                                name="pricing.billingCycle"
                                                value={
                                                    formData.pricing
                                                        .billingCycle
                                                }
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-all bg-white font-medium"
                                            >
                                                <option value="per_hour">
                                                    Per Hour
                                                </option>
                                                <option value="per_day">
                                                    Per Day
                                                </option>
                                                <option value="per_week">
                                                    Per Week
                                                </option>
                                                <option value="per_month">
                                                    Per Month
                                                </option>
                                                <option value="per_km">
                                                    Per Kilometer
                                                </option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Discount (auto-calculated)
                                            </label>
                                            <div
                                                className={`px-4 py-4 rounded-xl border-2 flex items-center justify-between ${formData.pricing.discountPercent > 0 ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}
                                            >
                                                <span
                                                    className={`text-2xl font-bold ${formData.pricing.discountPercent > 0 ? "text-green-700" : "text-slate-400"}`}
                                                >
                                                    {formData.pricing
                                                        .discountPercent || 0}
                                                    %
                                                </span>
                                                {formData.pricing
                                                    .discountPercent > 0 && (
                                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        SAVE
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                                                <div className="relative flex justify-between items-center">
                                                    <div>
                                                        <p className="text-emerald-100 text-sm font-medium mb-1">
                                                            Total Price
                                                        </p>
                                                        <p className="text-4xl font-bold">
                                                            {currencySymbol}
                                                            {formData.pricing
                                                                .totalPrice ||
                                                                "0.00"}
                                                        </p>
                                                        <p className="text-emerald-100 text-sm mt-1">
                                                            {formData.pricing.billingCycle.replace(
                                                                "_",
                                                                " ",
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/20 p-4 rounded-2xl">
                                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                                {formData.pricing
                                                    .discountPercent > 0 && (
                                                    <div className="relative mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-emerald-200" />
                                                        <span className="text-emerald-100 text-sm">
                                                            Customer saves{" "}
                                                            {currencySymbol}
                                                            {(
                                                                parseFloat(
                                                                    formData
                                                                        .pricing
                                                                        .originalPrice,
                                                                ) -
                                                                parseFloat(
                                                                    formData
                                                                        .pricing
                                                                        .price,
                                                                )
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ─── TAB: Policy ─── */}
                            {activeTab === "policy" && (
                                <div className="p-8 space-y-6">
                                    <SectionHeader
                                        icon={Shield}
                                        title="Distance &amp; Policy"
                                        subtitle="Distance limits, night charges, and rental policies"
                                        gradient="from-violet-500 to-purple-600"
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Included Kilometers{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="distancePolicy.includedKm"
                                                    placeholder="e.g., 145"
                                                    value={
                                                        formData.distancePolicy
                                                            .includedKm
                                                    }
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-4 pr-16 rounded-xl border-2 transition-all focus:outline-none ${errors.includedKm ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-violet-500"}`}
                                                />
                                                <span className="absolute right-4 top-4 text-slate-400 font-bold">
                                                    km
                                                </span>
                                            </div>
                                            <FieldError
                                                msg={errors.includedKm}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">
                                                Extra KM Price{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-4 text-slate-500 font-bold">
                                                    {currencySymbol}
                                                </span>
                                                <input
                                                    type="number"
                                                    name="distancePolicy.extraKmPrice"
                                                    placeholder="e.g., 12"
                                                    value={
                                                        formData.distancePolicy
                                                            .extraKmPrice
                                                    }
                                                    onChange={handleChange}
                                                    className={`w-full !pl-10 pr-14 py-4 rounded-xl border-2 transition-all focus:outline-none ${errors.extraKmPrice ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-violet-500"}`}
                                                />
                                                <span className="absolute right-6 top-4 text-slate-400 text-sm font-bold">
                                                    /km
                                                </span>
                                            </div>
                                            <FieldError
                                                msg={errors.extraKmPrice}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label
                                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.driverAllowanceIncluded ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-violet-300"}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="driverAllowanceIncluded"
                                                    checked={
                                                        formData.driverAllowanceIncluded
                                                    }
                                                    onChange={handleChange}
                                                    className="w-5 h-5 text-violet-600 rounded"
                                                />
                                                <div className="flex-1">
                                                    <span className="font-bold text-slate-700">
                                                        Driver Allowance
                                                        Included
                                                    </span>
                                                    <p className="text-xs text-slate-500">
                                                        Food &amp; accommodation
                                                        covered for the driver
                                                    </p>
                                                </div>
                                                <BadgeCheck
                                                    className={`w-5 h-5 ${formData.driverAllowanceIncluded ? "text-violet-600" : "text-slate-300"}`}
                                                />
                                            </label>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label
                                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.nightChargesApplicable ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="nightChargesApplicable"
                                                    checked={
                                                        formData.nightChargesApplicable
                                                    }
                                                    onChange={handleChange}
                                                    className="w-5 h-5 text-indigo-600 rounded"
                                                />
                                                <div className="flex-1">
                                                    <span className="font-bold text-slate-700 flex items-center gap-2">
                                                        <Moon className="w-4 h-4" />{" "}
                                                        Night Charges Applicable
                                                    </span>
                                                    <p className="text-xs text-slate-500">
                                                        Extra charges for
                                                        night-time driving
                                                    </p>
                                                </div>
                                            </label>
                                            {formData.nightChargesApplicable && (
                                                <div className="grid md:grid-cols-2 gap-4 pl-2">
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-bold text-slate-700">
                                                            Night Charge Start
                                                            Time
                                                        </label>
                                                        <input
                                                            type="time"
                                                            name="nightChargesStartTime"
                                                            value={
                                                                formData.nightChargesStartTime
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-bold text-slate-700">
                                                            Extra Charge
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-3.5 text-slate-500 font-bold">
                                                                {currencySymbol}
                                                            </span>
                                                            <input
                                                                type="number"
                                                                name="nightChargesExtra"
                                                                placeholder="e.g., 500"
                                                                value={
                                                                    formData.nightChargesExtra
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* Policies */}
                                        <div className="md:col-span-2 space-y-3">
                                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                                <div className="p-2 bg-violet-100 rounded-lg">
                                                    <Shield className="w-4 h-4 text-violet-600" />
                                                </div>
                                                Rental Policies
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                <input
                                                    value={inputs.policy.title}
                                                    onChange={(e) =>
                                                        setInputs((p) => ({
                                                            ...p,
                                                            policy: {
                                                                ...p.policy,
                                                                title: e.target
                                                                    .value,
                                                            },
                                                        }))
                                                    }
                                                    placeholder="Policy title (e.g., Cancellation)"
                                                    className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none transition-all text-sm"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        value={
                                                            inputs.policy
                                                                .description
                                                        }
                                                        onChange={(e) =>
                                                            setInputs((p) => ({
                                                                ...p,
                                                                policy: {
                                                                    ...p.policy,
                                                                    description:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            }))
                                                        }
                                                        placeholder="Policy details…"
                                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none transition-all text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            addItem(
                                                                "policies",
                                                                inputs.policy,
                                                            )
                                                        }
                                                        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-xl font-bold transition-all"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {formData.policies.map(
                                                    (pol, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex justify-between items-start bg-violet-50 border border-violet-200 px-4 py-3 rounded-xl"
                                                        >
                                                            <div>
                                                                <p className="font-bold text-violet-900 text-sm">
                                                                    {pol.title}
                                                                </p>
                                                                {pol.description && (
                                                                    <p className="text-violet-700 text-xs mt-0.5">
                                                                        {
                                                                            pol.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        "policies",
                                                                        i,
                                                                    )
                                                                }
                                                                className="hover:bg-violet-200 rounded-full p-1.5 ml-3 flex-shrink-0"
                                                            >
                                                                <X className="w-3.5 h-3.5 text-violet-700" />
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ─── TAB: Features ─── */}
                            {activeTab === "features" && (
                                <div className="p-8 space-y-8">
                                    <SectionHeader
                                        icon={Sparkles}
                                        title="Features & Amenities"
                                        subtitle="Features, inclusions, exclusions, add-ons, and extra info"
                                        gradient="from-amber-500 to-orange-600"
                                    />

                                    {/* Quick-add suggestions */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700">
                                            Quick-Add Features
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {featureSuggestions.map((f) => {
                                                const Icon = f.icon;
                                                const isAdded =
                                                    !!formData.features.find(
                                                        (x) =>
                                                            x.name === f.name,
                                                    );
                                                return (
                                                    <button
                                                        key={f.name}
                                                        type="button"
                                                        onClick={() =>
                                                            addSuggestedFeature(
                                                                f,
                                                            )
                                                        }
                                                        disabled={isAdded}
                                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-all ${isAdded ? "bg-green-100 border-green-300 text-green-700 cursor-default" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600"}`}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" />
                                                        {f.name}
                                                        {isAdded && (
                                                            <Check className="w-3 h-3" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <ListSection
                                        title="Custom Features"
                                        icon={Check}
                                        iconBg="bg-blue-100"
                                        iconColor="text-blue-600"
                                        inputValue={inputs.feature}
                                        onInputChange={(v) =>
                                            setInputs((p) => ({
                                                ...p,
                                                feature: v,
                                            }))
                                        }
                                        onAdd={() =>
                                            addItem("features", {
                                                name: inputs.feature,
                                            })
                                        }
                                        placeholder="Add a custom feature…"
                                        btnColor="bg-blue-600 hover:bg-blue-700"
                                        items={formData.features}
                                        renderItem={(f) => f.name}
                                        onRemove={(i) =>
                                            removeItem("features", i)
                                        }
                                        chipStyle="bg-blue-50 text-blue-800 border-blue-200"
                                        chipIcon={
                                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                        }
                                    />

                                    {/* INCLUSIONS - 10 Common Options + Custom Add */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-800">
                                                Inclusions
                                            </h3>
                                        </div>

                                        {/* 10 Common Inclusion Options */}
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                            {[
                                                "Fuel",
                                                "Driver",
                                                "GPS Navigation",
                                                "Insurance",
                                                "Roadside Assistance",
                                                "Airport Pickup",
                                                "Unlimited Mileage",
                                                "Child Seat",
                                                "WiFi Hotspot",
                                                "Toll Pass",
                                            ].map((item) => {
                                                const isSelected =
                                                    formData.inclusions.some(
                                                        (inc) =>
                                                            inc.title === item,
                                                    );
                                                return (
                                                    <button
                                                        key={item}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                const idx =
                                                                    formData.inclusions.findIndex(
                                                                        (inc) =>
                                                                            inc.title ===
                                                                            item,
                                                                    );
                                                                if (idx !== -1)
                                                                    removeItem(
                                                                        "inclusions",
                                                                        idx,
                                                                    );
                                                            } else {
                                                                addItem(
                                                                    "inclusions",
                                                                    {
                                                                        title: item,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                        className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${isSelected ? "bg-green-100 border-green-400 text-green-700" : "border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-600"}`}
                                                    >
                                                        {isSelected && (
                                                            <Check className="w-3 h-3 inline mr-1" />
                                                        )}
                                                        {item}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Custom Add - Short button left, input toggles */}
                                        <div className="flex gap-2 items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowInclusionInput(
                                                        !showInclusionInput,
                                                    )
                                                }
                                                className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${showInclusionInput ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : " text-blue"}`}
                                            >
                                                {showInclusionInput ? (
                                                    <>
                                                        <X className="w-4 h-4" />{" "}
                                                        Cancel
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />{" "}
                                                        Custom Add
                                                    </>
                                                )}
                                            </button>

                                            {showInclusionInput && (
                                                <>
                                                    <input
                                                        value={inputs.inclusion}
                                                        onChange={(v) =>
                                                            setInputs((p) => ({
                                                                ...p,
                                                                inclusion:
                                                                    v.target
                                                                        .value,
                                                            }))
                                                        }
                                                        placeholder="Type custom inclusion..."
                                                        className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-green-500 focus:outline-none text-sm transition-all"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (
                                                                inputs.inclusion.trim()
                                                            ) {
                                                                addItem(
                                                                    "inclusions",
                                                                    {
                                                                        title: inputs.inclusion,
                                                                    },
                                                                );
                                                                setInputs(
                                                                    (p) => ({
                                                                        ...p,
                                                                        inclusion:
                                                                            "",
                                                                    }),
                                                                );
                                                                setShowInclusionInput(
                                                                    false,
                                                                );
                                                            }
                                                        }}
                                                        disabled={
                                                            !inputs.inclusion.trim()
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Selected Inclusions Display */}
                                        {formData.inclusions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {formData.inclusions.map(
                                                    (inc, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 text-green-800 border border-green-200 text-sm font-medium"
                                                        >
                                                            <Check className="w-3.5 h-3.5 text-green-500" />
                                                            {inc.title}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        "inclusions",
                                                                        i,
                                                                    )
                                                                }
                                                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                                            >
                                                                <X className="w-3 h-3 text-green-700" />
                                                            </button>
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* EXCLUSIONS - 10 Common Options + Custom Add */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <XIcon className="w-4 h-4 text-red-600" />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-800">
                                                Exclusions
                                            </h3>
                                        </div>

                                        {/* 10 Common Exclusion Options */}
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                            {[
                                                "Fuel",
                                                "Driver",
                                                "Insurance",
                                                "Parking Fees",
                                                "Tolls",
                                                "Traffic Fines",
                                                "Cleaning Fee",
                                                "Late Return Fee",
                                                "Additional Driver",
                                                "Cross-Border Fee",
                                            ].map((item) => {
                                                const isSelected =
                                                    formData.exclusions.some(
                                                        (exc) =>
                                                            exc.title === item,
                                                    );
                                                return (
                                                    <button
                                                        key={item}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                const idx =
                                                                    formData.exclusions.findIndex(
                                                                        (exc) =>
                                                                            exc.title ===
                                                                            item,
                                                                    );
                                                                if (idx !== -1)
                                                                    removeItem(
                                                                        "exclusions",
                                                                        idx,
                                                                    );
                                                            } else {
                                                                addItem(
                                                                    "exclusions",
                                                                    {
                                                                        title: item,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                        className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${isSelected ? "bg-red-100 border-red-400 text-red-700" : "border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600"}`}
                                                    >
                                                        {isSelected && (
                                                            <Check className="w-3 h-3 inline mr-1" />
                                                        )}
                                                        {item}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Custom Add - Short button left, input toggles */}
                                        <div className="flex gap-2 items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowExclusionInput(
                                                        !showExclusionInput,
                                                    )
                                                }
                                                className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${showExclusionInput ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : " text-blue"}`}
                                            >
                                                {showExclusionInput ? (
                                                    <>
                                                        <X className="w-4 h-4" />{" "}
                                                        Cancel
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />{" "}
                                                        Custom Add
                                                    </>
                                                )}
                                            </button>

                                            {showExclusionInput && (
                                                <>
                                                    <input
                                                        value={inputs.exclusion}
                                                        onChange={(v) =>
                                                            setInputs((p) => ({
                                                                ...p,
                                                                exclusion:
                                                                    v.target
                                                                        .value,
                                                            }))
                                                        }
                                                        placeholder="Type custom exclusion..."
                                                        className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-red-500 focus:outline-none text-sm transition-all"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (
                                                                inputs.exclusion.trim()
                                                            ) {
                                                                addItem(
                                                                    "exclusions",
                                                                    {
                                                                        title: inputs.exclusion,
                                                                    },
                                                                );
                                                                setInputs(
                                                                    (p) => ({
                                                                        ...p,
                                                                        exclusion:
                                                                            "",
                                                                    }),
                                                                );
                                                                setShowExclusionInput(
                                                                    false,
                                                                );
                                                            }
                                                        }}
                                                        disabled={
                                                            !inputs.exclusion.trim()
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Selected Exclusions Display */}
                                        {formData.exclusions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {formData.exclusions.map(
                                                    (exc, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-800 border border-red-200 text-sm font-medium"
                                                        >
                                                            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                                                            {exc.title}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        "exclusions",
                                                                        i,
                                                                    )
                                                                }
                                                                className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                                                            >
                                                                <X className="w-3 h-3 text-red-700" />
                                                            </button>
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Add-ons */}
                                    <div className="space-y-4">
                                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Plus className="w-4 h-4 text-purple-600" />
                                            </div>
                                            Paid Add-ons
                                        </h3>

                                        {/* Input Row */}
                                        <div className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Name
                                                </label>
                                                <input
                                                    value={inputs.addOn.title}
                                                    onChange={(e) =>
                                                        setInputs((p) => ({
                                                            ...p,
                                                            addOn: {
                                                                ...p.addOn,
                                                                title: e.target
                                                                    .value,
                                                            },
                                                        }))
                                                    }
                                                    placeholder="e.g. Extra Driver"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none text-sm"
                                                />
                                            </div>
                                            <div className="w-28">
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Price
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute  left-3 top-2 text-slate-500 text-lg">
                                                        {currencySymbol}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={
                                                            inputs.addOn.price
                                                        }
                                                        onChange={(e) =>
                                                            setInputs((p) => ({
                                                                ...p,
                                                                addOn: {
                                                                    ...p.addOn,
                                                                    price: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            }))
                                                        }
                                                        placeholder="0"
                                                        className="w-full !pl-12 pr-3 py-2 rounded-lg border border-slate-300 focus:border-purple-500 focus:outline-none text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            inputs.addOn
                                                                .isOptional
                                                        }
                                                        onChange={(e) =>
                                                            setInputs((p) => ({
                                                                ...p,
                                                                addOn: {
                                                                    ...p.addOn,
                                                                    isOptional:
                                                                        e.target
                                                                            .checked,
                                                                },
                                                            }))
                                                        }
                                                        className="w-4 h-4 text-purple-600 rounded border-slate-300"
                                                    />
                                                    Optional
                                                </label>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        inputs.addOn.title.trim() &&
                                                        inputs.addOn.price
                                                    ) {
                                                        addItem(
                                                            "addOns",
                                                            inputs.addOn,
                                                        );
                                                        setInputs((p) => ({
                                                            ...p,
                                                            addOn: {
                                                                title: "",
                                                                price: "",
                                                                isOptional: true,
                                                            },
                                                        }));
                                                    }
                                                }}
                                                disabled={
                                                    !inputs.addOn.title.trim() ||
                                                    !inputs.addOn.price
                                                }
                                                className=" bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-4 rounded-lg font-medium text-sm transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {/* List */}
                                        {formData.addOns.length > 0 && (
                                            <div className="border rounded-lg divide-y">
                                                {formData.addOns.map((a, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex justify-between items-center px-4 py-3"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium text-slate-800 text-sm">
                                                                {a.title}
                                                            </span>
                                                            <span
                                                                className={`text-xs px-2 py-0.5 rounded-full ${a.isOptional ? "bg-slate-100 text-slate-600" : "bg-purple-100 text-purple-700"}`}
                                                            >
                                                                {a.isOptional
                                                                    ? "Optional"
                                                                    : "Required"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-medium text-slate-800 text-sm">
                                                                {currencySymbol}
                                                                {a.price}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        "addOns",
                                                                        i,
                                                                    )
                                                                }
                                                                className="text-slate-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <Info className="w-4 h-4 text-slate-600" />
                                            </div>
                                            Additional Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            <input
                                                value={inputs.info.label}
                                                onChange={(e) =>
                                                    setInputs((p) => ({
                                                        ...p,
                                                        info: {
                                                            ...p.info,
                                                            label: e.target
                                                                .value,
                                                        },
                                                    }))
                                                }
                                                placeholder="Label (e.g., Bags included)"
                                                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-500 focus:outline-none text-sm transition-all"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    value={inputs.info.value}
                                                    onChange={(e) =>
                                                        setInputs((p) => ({
                                                            ...p,
                                                            info: {
                                                                ...p.info,
                                                                value: e.target
                                                                    .value,
                                                            },
                                                        }))
                                                    }
                                                    placeholder="Value (e.g., 10 bags)"
                                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-500 focus:outline-none text-sm transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addItem(
                                                            "additionalInfo",
                                                            inputs.info,
                                                        )
                                                    }
                                                    className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 rounded-xl font-bold transition-all"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.additionalInfo.map(
                                                (inf, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex justify-between items-center bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl"
                                                    >
                                                        <div className="text-sm">
                                                            <span className="font-bold text-slate-700">
                                                                {inf.label}:
                                                            </span>{" "}
                                                            <span className="text-slate-600">
                                                                {inf.value}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(
                                                                    "additionalInfo",
                                                                    i,
                                                                )
                                                            }
                                                            className="hover:bg-slate-200 rounded-full p-1.5"
                                                        >
                                                            <X className="w-4 h-4 text-slate-500" />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-6 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <p className="text-sm text-slate-500">
                                            <span className="font-bold text-slate-700">
                                                {formData.features.length}
                                            </span>{" "}
                                            features ·{" "}
                                            <span className="font-bold text-slate-700">
                                                {formData.inclusions.length}
                                            </span>{" "}
                                            inclusions ·{" "}
                                            <span className="font-bold text-slate-700">
                                                {formData.exclusions.length}
                                            </span>{" "}
                                            exclusions ·{" "}
                                            <span className="font-bold text-slate-700">
                                                {formData.addOns.length}
                                            </span>{" "}
                                            add-ons
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full md:w-auto text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:-translate-y-0.5 bg-gradient-to-r ${isEditMode ? "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" : "from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700"}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />{" "}
                                                    {isEditMode
                                                        ? "Saving…"
                                                        : "Creating…"}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />{" "}
                                                    {isEditMode
                                                        ? "Save Changes"
                                                        : "Create Vehicle"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* ─── Nav Buttons ─── */}
                            {activeTab !== "features" && (
                                <div className="px-8 pb-8 flex justify-between items-center border-t border-slate-100 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={activeTab === "basic"}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === "basic" ? "opacity-0 pointer-events-none" : "text-slate-600 hover:bg-slate-100"}`}
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg hover:-translate-y-0.5"
                                    >
                                        Next Step{" "}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* ══════════ SIDEBAR ══════════ */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-white" />
                                    <h3 className="text-white font-bold">
                                        Live Preview
                                    </h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Vehicle"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                <Car className="w-10 h-10 mb-1 opacity-40" />
                                                <p className="text-xs">
                                                    No image
                                                </p>
                                            </div>
                                        )}
                                        {formData.isMostPopular && (
                                            <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" />{" "}
                                                POPULAR
                                            </div>
                                        )}
                                        {formData.pricing.discountPercent >
                                            0 && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                                {
                                                    formData.pricing
                                                        .discountPercent
                                                }
                                                % OFF
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">
                                            {formData.name || "Vehicle Name"}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-500">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded">
                                                {formData.category ||
                                                    "Category"}
                                            </span>
                                            <span>·</span>
                                            <span>
                                                {formData.seatCapacity || "-"}{" "}
                                                seats
                                            </span>
                                            {formData.fuelType && (
                                                <>
                                                    <span>·</span>
                                                    <span>
                                                        {formData.fuelType}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {formData.licensePlate && (
                                            <span className="inline-block mt-1 text-xs font-mono bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                                                {formData.licensePlate}
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-bold text-slate-900">
                                                {currencySymbol}
                                                {formData.pricing.totalPrice ||
                                                    "0"}
                                            </span>
                                            <span className="text-slate-500 text-xs">
                                                /
                                                {formData.pricing.billingCycle.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </span>
                                        </div>
                                        {parseFloat(
                                            formData.pricing.originalPrice,
                                        ) >
                                            parseFloat(
                                                formData.pricing.price,
                                            ) && (
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-slate-400 line-through text-xs">
                                                    {currencySymbol}
                                                    {
                                                        formData.pricing
                                                            .originalPrice
                                                    }
                                                </span>
                                                <span className="text-green-600 text-xs font-medium">
                                                    + {currencySymbol}
                                                    {formData.pricing
                                                        .extraCharges || 0}{" "}
                                                    taxes
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {/* Distance - with km/miles toggle */}
                                        <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDistanceUnit("km")
                                                    }
                                                    className={`text-[10px] px-1.5 py-0.5 rounded ${distanceUnit === "km" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
                                                >
                                                    km
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDistanceUnit("miles")
                                                    }
                                                    className={`text-[10px] px-1.5 py-0.5 rounded ${distanceUnit === "miles" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
                                                >
                                                    miles
                                                </button>
                                            </div>
                                            <p className="text-blue-600 font-bold text-base">
                                                {distanceUnit === "km"
                                                    ? formData.distancePolicy
                                                          .includedKm || "0"
                                                    : Math.round(
                                                          (parseInt(
                                                              formData
                                                                  .distancePolicy
                                                                  .includedKm,
                                                          ) || 0) * 0.621371,
                                                      )}
                                            </p>
                                            <p className="text-blue-700">
                                                {distanceUnit} included
                                            </p>
                                        </div>

                                        {/* Features count */}
                                        <div className="bg-purple-50 rounded-lg p-2.5 text-center">
                                            <p className="text-purple-600 font-bold text-base">
                                                {formData.features.length}
                                            </p>
                                            <p className="text-purple-700">
                                                features
                                            </p>
                                        </div>
                                    </div>

                                    {formData.features.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {formData.features
                                                .slice(0, 4)
                                                .map((f, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                                                    >
                                                        {f.name}
                                                    </span>
                                                ))}
                                            {formData.features.length > 4 && (
                                                <span className="text-xs text-slate-400">
                                                    +
                                                    {formData.features.length -
                                                        4}{" "}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Driver Allowance
                                            </span>
                                            <span
                                                className={
                                                    formData.driverAllowanceIncluded
                                                        ? "text-green-600 font-medium"
                                                        : "text-red-500 font-medium"
                                                }
                                            >
                                                {formData.driverAllowanceIncluded
                                                    ? "Included"
                                                    : "Not Included"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Night Charges
                                            </span>
                                            <span
                                                className={
                                                    formData.nightChargesApplicable
                                                        ? "text-amber-600 font-medium"
                                                        : "text-slate-400"
                                                }
                                            >
                                                {formData.nightChargesApplicable
                                                    ? `From ${formData.nightChargesStartTime}`
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        {formData.luggageCapacity && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    Luggage
                                                </span>
                                                <span className="text-slate-700 font-medium">
                                                    {formData.luggageCapacity}{" "}
                                                    bags
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5">
                                <h4 className="font-bold text-slate-800 mb-3 text-sm">
                                    Completion Status
                                </h4>
                                <div className="space-y-2">
                                    {tabs.map((tab) => {
                                        const isCompleted = isTabCompleted(
                                            tab.id,
                                        );
                                        const isActive = activeTab === tab.id;
                                        const Icon = tab.icon;
                                        return (
                                            <div
                                                key={tab.id}
                                                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${isActive ? "bg-blue-50 border border-blue-200" : "bg-slate-50"}`}
                                            >
                                                <div
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-400"}`}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <Icon className="w-3.5 h-3.5" />
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-sm font-medium flex-1 ${isActive ? "text-blue-900" : isCompleted ? "text-slate-700" : "text-slate-400"}`}
                                                >
                                                    {tab.label}
                                                </span>
                                                {isCompleted && (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Reusable list section ────────────────────────────────────────────────────
function ListSection({
    title,
    icon: Icon,
    iconBg,
    iconColor,
    inputValue,
    onInputChange,
    onAdd,
    placeholder,
    btnColor,
    items,
    renderItem,
    onRemove,
    chipStyle,
    chipIcon,
}) {
    return (
        <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <div className={`p-2 ${iconBg} rounded-lg`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                {title}
            </h3>
            <div className="flex gap-2">
                <input
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), onAdd())
                    }
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-400 focus:outline-none text-sm transition-all"
                />
                <button
                    type="button"
                    onClick={onAdd}
                    className={`${btnColor} text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-md`}
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <span
                            key={i}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium ${chipStyle}`}
                        >
                            {chipIcon}
                            {renderItem(item)}
                            <button
                                type="button"
                                onClick={() => onRemove(i)}
                                className="ml-1 hover:opacity-70 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
