"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Star,
    Check,
    X,
    Wifi,
    Tv,
    Armchair,
    Wind,
    Zap,
    Shield,
    Music,
    Snowflake,
    Toilet,
    Luggage,
    Phone,
    Info,
    ChevronRight,
    Heart,
    Share2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { getBusById } from "@/services/busservices";

// Feature configuration with icons and descriptions
const featureConfig = {
    wifi: {
        icon: Wifi,
        label: "Free WiFi",
        description: "High-speed internet throughout your journey",
    },
    tv: {
        icon: Tv,
        label: "Entertainment System",
        description: "Individual screens with movies & shows",
    },
    ac: {
        icon: Wind,
        label: "Climate Control",
        description: "Adjustable air conditioning & heating",
    },
    charging: {
        icon: Zap,
        label: "USB Charging",
        description: "Power outlets at every seat",
    },
    restroom: {
        icon: Toilet,
        label: "Onboard Restroom",
        description: "Clean, accessible restroom facilities",
    },
    luggage: {
        icon: Luggage,
        label: "Extra Luggage",
        description: "Generous storage space for bags",
    },
    reclining: {
        icon: Armchair,
        label: "Reclining Seats",
        description: "Comfortable seats with ample legroom",
    },
    entertainment: {
        icon: Music,
        label: "Audio System",
        description: "Premium sound system",
    },
    safety: {
        icon: Shield,
        label: "Advanced Safety",
        description: "GPS tracking & safety equipment",
    },
    phone: {
        icon: Phone,
        label: "PA System",
        description: "Driver communication system",
    },
    default: {
        icon: CheckCircle2,
        label: "Feature",
        description: "Available on this vehicle",
    },
};

const getFeatureDetails = (feature) => {
    if (typeof feature === "string") {
        const key = feature.toLowerCase().replace(/\s+/g, "");
        return (
            featureConfig[key] || { ...featureConfig.default, label: feature }
        );
    }
    if (typeof feature === "object" && feature !== null) {
        const key = (feature.icon || feature.key || "").toLowerCase();
        return (
            featureConfig[key] || {
                ...featureConfig.default,
                label: feature.name || feature.label || "Feature",
                description: feature.description || "",
            }
        );
    }
    return featureConfig.default;
};

function BusDetailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [bus, setBus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchBus = async () => {
            const id = searchParams.get('id');
            console.log("Bus ID:", id);    
            if (!id) {
                setError("No bus ID provided");
                setLoading(false);
                return;
            }
        
            try {
                setLoading(true);
                const res = await getBusById(id);
                const data = res?.data?.data ?? res?.data ?? null;
                setBus(data);
            } catch (err) {
                setError(err.message || "Failed to load bus details");
            } finally {
                setLoading(false);
            }
        };
        fetchBus();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-full" />
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
            </div>
        );
    }

    if (error || !bus) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Bus Not Found
                    </h2>
                    <p className="text-slate-600 mb-6">
                        {error || "The bus you're looking for doesn't exist."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-orange-500 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Fleet
                    </button>
                </div>
            </div>
        );
    }

    const images = bus.images || [bus.image].filter(Boolean);
    const mainImage =
        images[selectedImage] || bus.image || "/placeholder-bus.jpg";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Fleet
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-2 rounded-full transition-colors ${isFavorite ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >
                                <Heart
                                    size={20}
                                    fill={isFavorite ? "currentColor" : "none"}
                                />
                            </button>
                            <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold uppercase tracking-wider">
                                    {bus.category}
                                </span>
                                {bus.availability === "available" && (
                                    <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                                        <CheckCircle2 size={16} />
                                        Available Now
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                                {bus.name}
                            </h1>
                            <div className="flex items-center gap-4 text-slate-600">
                                <div className="flex items-center gap-1.5">
                                    <Users
                                        size={18}
                                        className="text-orange-500"
                                    />
                                    <span className="font-semibold">
                                        {bus.seatCapacity} Passengers
                                    </span>
                                </div>
                                <span className="text-slate-300">|</span>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={16}
                                            className="fill-orange-400 text-orange-400"
                                        />
                                    ))}
                                    <span className="ml-1 text-sm">(4.9)</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500 mb-1">
                                Starting from
                            </p>
                            <p className="text-4xl font-bold text-slate-900">
                                ${bus.pricePerDay || bus.price || "299"}
                            </p>
                            <p className="text-sm text-slate-500">per day</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                            <div className="relative aspect-video bg-slate-100">
                                <img
                                    src={mainImage}
                                    alt={bus.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                                    {selectedImage + 1} / {images.length}
                                </div>
                            </div>
                            {images.length > 1 && (
                                <div className="p-4 flex gap-3 overflow-x-auto">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setSelectedImage(idx)
                                            }
                                            className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                                                selectedImage === idx
                                                    ? "border-orange-500 ring-2 ring-orange-200"
                                                    : "border-transparent hover:border-slate-300"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="flex border-b border-slate-200">
                                {[
                                    "overview",
                                    "features",
                                    "specs",
                                    "reviews",
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 px-6 text-sm font-semibold capitalize transition-colors relative ${
                                            activeTab === tab
                                                ? "text-orange-600"
                                                : "text-slate-500 hover:text-slate-700"
                                        }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {activeTab === "overview" && (
                                        <motion.div
                                            key="overview"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                                    About this Vehicle
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed">
                                                    {bus.description ||
                                                        `The ${bus.name} is a premium ${bus.category?.toLowerCase()} designed for comfort and reliability. 
                          Perfect for ${bus.seatCapacity > 30 ? "large groups and long-distance travel" : "small groups and city tours"}, 
                          this vehicle combines modern amenities with professional-grade safety features.`}
                                                </p>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <Clock className="h-6 w-6 text-orange-500 mb-2" />
                                                    <p className="font-semibold text-slate-900">
                                                        24/7 Service
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        Round the clock
                                                        availability
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <MapPin className="h-6 w-6 text-orange-500 mb-2" />
                                                    <p className="font-semibold text-slate-900">
                                                        Nationwide
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        Service across all
                                                        states
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <Shield className="h-6 w-6 text-orange-500 mb-2" />
                                                    <p className="font-semibold text-slate-900">
                                                        Licensed
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        DOT certified drivers
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "features" && (
                                        <motion.div
                                            key="features"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="grid sm:grid-cols-2 gap-4"
                                        >
                                            {bus.features?.map(
                                                (feature, idx) => {
                                                    const details =
                                                        getFeatureDetails(
                                                            feature,
                                                        );
                                                    const Icon = details.icon;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-orange-50 transition-colors group"
                                                        >
                                                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                                                                <Icon
                                                                    size={20}
                                                                    className="text-orange-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-slate-900">
                                                                    {
                                                                        details.label
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-slate-500 mt-1">
                                                                    {
                                                                        details.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === "specs" && (
                                        <motion.div
                                            key="specs"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            {[
                                                {
                                                    label: "Seating Capacity",
                                                    value: `${bus.seatCapacity} passengers`,
                                                },
                                                {
                                                    label: "Luggage Capacity",
                                                    value:
                                                        bus.luggageCapacity ||
                                                        "2 bags per person",
                                                },
                                                {
                                                    label: "Vehicle Year",
                                                    value:
                                                        bus.year || "2020-2023",
                                                },
                                                {
                                                    label: "Transmission",
                                                    value:
                                                        bus.transmission ||
                                                        "Automatic",
                                                },
                                                {
                                                    label: "Fuel Type",
                                                    value:
                                                        bus.fuelType ||
                                                        "Diesel",
                                                },
                                                {
                                                    label: "Accessibility",
                                                    value:
                                                        bus.accessibility ||
                                                        "Wheelchair lift available",
                                                },
                                                {
                                                    label: "Entertainment",
                                                    value:
                                                        bus.entertainment ||
                                                        "TV, WiFi, PA System",
                                                },
                                                {
                                                    label: "Safety Features",
                                                    value: "GPS, Seatbelts, First Aid Kit",
                                                },
                                            ].map((spec, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"
                                                >
                                                    <span className="text-slate-600">
                                                        {spec.label}
                                                    </span>
                                                    <span className="font-semibold text-slate-900">
                                                        {spec.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activeTab === "reviews" && (
                                        <motion.div
                                            key="reviews"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="text-5xl font-bold text-slate-900">
                                                    4.9
                                                </div>
                                                <div>
                                                    <div className="flex gap-1 mb-1">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (star) => (
                                                                <Star
                                                                    key={star}
                                                                    size={18}
                                                                    className="fill-orange-400 text-orange-400"
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500">
                                                        Based on 128 reviews
                                                    </p>
                                                </div>
                                            </div>

                                            {[1, 2, 3].map((review) => (
                                                <div
                                                    key={review}
                                                    className="border-b border-slate-100 last:border-0 pb-6 last:pb-0"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
                                                                JD
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">
                                                                    John Doe
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    2 weeks ago
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    size={14}
                                                                    className="fill-orange-400 text-orange-400"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 text-sm leading-relaxed">
                                                        Excellent service! The
                                                        bus was clean,
                                                        comfortable, and the
                                                        driver was very
                                                        professional. Perfect
                                                        for our corporate event.
                                                        Highly recommended!
                                                    </p>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Policies */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Rental Policies
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            Free Cancellation
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Up to 48 hours before pickup
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            Instant Booking
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Confirm availability in real-time
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            Professional Driver
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Licensed & experienced chauffeur
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            Full Insurance
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Comprehensive coverage included
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Price Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Daily Rate
                                        </p>
                                        <p className="text-3xl font-bold text-slate-900">
                                            $
                                            {bus.pricePerDay ||
                                                bus.price ||
                                                "299"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">
                                            Hourly
                                        </p>
                                        <p className="text-xl font-semibold text-slate-900">
                                            ${bus.pricePerHour || "75"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowBookingModal(true)}
                                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mb-4"
                                >
                                    Book Now
                                </button>

                                <button className="w-full py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-900 hover:text-slate-900 transition-colors">
                                    Request Quote
                                </button>

                                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Base rate (1 day)
                                        </span>
                                        <span className="font-medium text-slate-900">
                                            ${bus.pricePerDay || "299"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Driver & fuel
                                        </span>
                                        <span className="font-medium text-slate-900">
                                            Included
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Insurance
                                        </span>
                                        <span className="font-medium text-slate-900">
                                            Included
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-100">
                                        <span className="text-slate-900">
                                            Total
                                        </span>
                                        <span className="text-orange-600">
                                            ${bus.pricePerDay || "299"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-slate-900 text-white rounded-2xl p-6">
                                <h3 className="font-bold text-lg mb-4">
                                    Need Help?
                                </h3>
                                <p className="text-slate-300 text-sm mb-4">
                                    Our team is available 24/7 to assist with
                                    your booking
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href="tel:+18005550199"
                                        className="flex items-center gap-3 text-sm hover:text-orange-400 transition-colors"
                                    >
                                        <Phone size={16} />
                                        1-800-555-0199
                                    </a>
                                    <button className="w-full py-3 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
                                        Live Chat
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-4 text-slate-400">
                                <div className="flex items-center gap-2 text-xs">
                                    <Shield size={16} />
                                    <span>Secure</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <CheckCircle2 size={16} />
                                    <span>Verified</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Star size={16} />
                                    <span>Top Rated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowBookingModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    Book {bus.name}
                                </h3>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Pickup Date
                                    </label>
                                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                                        <Calendar
                                            size={20}
                                            className="text-slate-400"
                                        />
                                        <input
                                            type="date"
                                            className="flex-1 outline-none text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Duration
                                    </label>
                                    <select className="w-full p-3 border border-slate-200 rounded-xl outline-none text-slate-900">
                                        <option>1 Day</option>
                                        <option>2 Days</option>
                                        <option>3 Days</option>
                                        <option>1 Week</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
                                Continue to Payment
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function BusDetailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-slate-200 rounded-full" />
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                </div>
            </div>
        }>
            <BusDetailContent />
        </Suspense>
    );
}
