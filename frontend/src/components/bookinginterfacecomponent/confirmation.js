"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
    Bus,
    Users,
    Wifi,
    Briefcase,
    MapPin,
    Calendar,
    Clock,
    Star,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Edit3,
    ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { confirmBooking, getBooking } from "@/services/bookingservice";

// Utility for cleaner tailwind classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const InfoRow = ({ label, value, subValue }) => (
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

const SectionCard = ({
    title,
    icon: Icon,
    children,
    actionLabel = "Edit",
    onAction,
}) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
            <button
                onClick={onAction}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1"
            >
                <Edit3 className="w-4 h-4" />
                {actionLabel}
            </button>
        </div>
        {children}
    </div>
);

const PriceBreakdown = ({ vehiclePrice = 0, pricing = null, isProcessing, onConfirm }) => {
    // Use pricing from backend if available
    const items = pricing
        ? [
              { label: "Base Fare", value: `$${pricing.baseFare?.toLocaleString() || 0}.00` },
              { label: "Fuel Surcharge", value: `$${pricing.fuelSurcharge?.toFixed(2) || 0}` },
              { label: "Driver Gratuity", value: `$${pricing.driverGratuity?.toFixed(2) || 0}` },
              { label: "Service Fees", value: `$${pricing.serviceFees?.toFixed(2) || 0}` },
          ]
        : [
              { label: "Base Fare", value: `$${vehiclePrice.toLocaleString()}.00` },
              { label: "Fuel Surcharge", value: "$45.00" },
              {
                  label: "Driver Gratuity",
                  value: `$${(vehiclePrice * 0.1).toFixed(2)}`,
              },
              { label: "Service Fees", value: "$12.50" },
          ];

    const total = pricing?.totalAmount || (vehiclePrice + 45 + vehiclePrice * 0.1 + 12.5);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-28">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
                Price Details
            </h3>

            <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="text-slate-900 font-medium">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-100 pt-6 mb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-black tracking-wider mb-1">
                            Total Estimate
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                            ALL TAXES INCLUDED
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">
                        $
                        {total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                </div>
            </div>

            <button
                onClick={onConfirm}
                disabled={isProcessing}
                className={cn(
                    "w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group mb-4",
                    isProcessing && "opacity-70 cursor-not-allowed",
                )}
            >
                {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Confirm & Book Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed font-medium">
                By confirming, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                    Terms
                </a>{" "}
                &{" "}
                <a href="#" className="text-blue-600 hover:underline">
                    Policies
                </a>
            </p>

            <div className="mt-8 bg-slate-50 rounded-2xl p-4 flex gap-3 items-start border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1 leading-none">
                        Secure Checkout
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Your booking is encrypted and protected. 24/7 priority
                        support.
                    </p>
                </div>
            </div>
        </div>
    );
};

const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    Booking Success!
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm font-medium">
                    We have received your trip details. Our dispatch team will
                    review it and notify you via email with the final
                    confirmation and payment link shortly.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Back to Home
                    </button>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        Check your email for step-by-step updates
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function ReviewItineraryPage() {
    const [tripDetails, setTripDetails] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [backendBooking, setBackendBooking] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") return;
        
        async function fetchBookingData() {
            try {
                const bookingId = localStorage.getItem("bookingId");
                console.log("Fetching booking with ID:", bookingId);
                
                // Try to fetch from backend first
                if (bookingId) {
                    const response = await getBooking(bookingId);
                    console.log("Backend response:", response);
                    const booking = response.data?.booking;
                    console.log("Backend booking:", booking);
                    
                    if (booking) {
                        setBackendBooking(booking);
                        
                        // Format trip details from backend
                        setTripDetails({
                            tripType: booking.tripType,
                            formData: {
                                pickupAddress: booking.pickupAddress,
                                dropoffAddress: booking.dropoffAddress,
                                datetime: booking.datetime,
                                passengers: booking.passengers,
                                duration: booking.duration,
                                orderType: booking.orderType,
                                stops: booking.stops,
                                outbound: booking.tripType === "round-trip" ? {
                                    pickupAddress: booking.pickupAddress,
                                    dropoffAddress: booking.dropoffAddress,
                                    datetime: booking.datetime,
                                    passengers: booking.passengers,
                                    stops: booking.stops,
                                } : null,
                                return: booking.tripType === "round-trip" ? {
                                    datetime: booking.returnDate,
                                    stops: booking.returnStops,
                                } : null,
                            },
                        });
                        
                        // Format vehicle and contact from backend
                        setBookingDetails({
                            vehicle: booking.busDetails || {},
                            contact: booking.contact || {},
                        });
                        
                        // Also load from localStorage as fallback
                        const step2 = localStorage.getItem("bookingStep2");
                        if (step2) {
                            try {
                                const step2Data = JSON.parse(step2);
                                // Merge with backend data (localStorage as backup)
                                if (!booking.busDetails && step2Data.vehicle) {
                                    setBookingDetails(prev => ({
                                        ...prev,
                                        vehicle: step2Data.vehicle
                                    }));
                                }
                                if (!booking.contact && step2Data.contact) {
                                    setBookingDetails(prev => ({
                                        ...prev,
                                        contact: step2Data.contact
                                    }));
                                }
                            } catch (e) {
                                console.error("Error parsing step2:", e);
                            }
                        }
                        return;
                    }
                }
                
                // Fallback to localStorage
                console.log("No bookingId, using localStorage");
                const step1 = localStorage.getItem("bookingStep1");
                const step2 = localStorage.getItem("bookingStep2");
                if (step1) {
                    try {
                        setTripDetails(JSON.parse(step1));
                    } catch (e) {
                        console.error("Error loading step 1:", e);
                    }
                }
                if (step2) {
                    try {
                        setBookingDetails(JSON.parse(step2));
                    } catch (e) {
                        console.error("Error loading step 2:", e);
                    }
                }
            } catch (err) {
                console.error("Error fetching booking:", err);
            } finally {
                setIsLoaded(true);
                setIsLoading(false);
            }
        }
        
        fetchBookingData();
    }, []);

    const handleConfirm = async () => {
        setIsProcessing(true);

        const bookingId = localStorage.getItem("bookingId");
        const vehicleData = bookingDetails?.vehicle || backendBooking?.busDetails || {};

        // Calculate pricing (use backend pricing if available)
        let finalPricing = backendBooking?.pricing;
        
        if (!finalPricing) {
            const baseFare = vehicleData.price || 0;
            const fuelSurcharge = 45;
            const driverGratuity = baseFare * 0.1;
            const serviceFees = 12.5;
            const totalAmount = baseFare + fuelSurcharge + driverGratuity + serviceFees;

            finalPricing = {
                baseFare,
                fuelSurcharge,
                driverGratuity,
                serviceFees,
                totalAmount,
                currency: vehicleData.currency || "USD",
            };
        }

        try {
            if (bookingId) {
                const response = await confirmBooking({
                    bookingId,
                    pricing: finalPricing,
                });

                if (response.data?.booking) {
                    // Store confirmation details
                    localStorage.setItem("confirmedBooking", JSON.stringify(response.data.booking));
                }
            }

            setShowSuccess(true);
            // Clear all booking related localStorage
            localStorage.removeItem("bookingStep1");
            localStorage.removeItem("bookingStep2");
            localStorage.removeItem("selectedVehicle");
            localStorage.removeItem("bookingContact");
            localStorage.removeItem("bookingId");
        } catch (error) {
            console.error("Error confirming booking:", error);
            // Still show success even if API fails (offline fallback)
            setShowSuccess(true);
            localStorage.removeItem("bookingStep1");
            localStorage.removeItem("bookingStep2");
            localStorage.removeItem("selectedVehicle");
            localStorage.removeItem("bookingContact");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        router.push("/");
    };

    const tripData = tripDetails?.formData || {};
    const tripType = tripDetails?.tripType || backendBooking?.tripType || "one-way";
    const isRoundTrip = tripType === "round-trip";
    const isHourly = tripType === "hourly";
    
    // Use state values directly (loaded in useEffect)
    const vehicle = bookingDetails?.vehicle || backendBooking?.busDetails || {};
    const vehiclePrice = vehicle?.price || 0;
    const contact = bookingDetails?.contact || backendBooking?.contact || {};
    
    // Use pricing from backend if available
    const pricing = backendBooking?.pricing || null;

    const formatReviewDate = (dateStr) => {
        if (!dateStr) return "Not set";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatReviewTime = (dateStr) => {
        if (!dateStr) return "Not set";
        const d = new Date(dateStr);
        return d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const stops = (
        isRoundTrip ? tripData.outbound?.stops || [] : tripData.stops || []
    ).filter((s) => s);

    // Show loading while data is being fetched
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading booking details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 mt-20">
            <Head>
                <title>Review Booking | LuxCharter</title>
            </Head>

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Review Details */}
                    <div className="lg:col-span-8">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-8 h-1 bg-blue-600 rounded-full" />
                                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                                    Final Step
                                </p>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                Review Itinerary
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Please double check your booking details before
                                we finalize your request.
                            </p>
                        </div>

                        {/* Trip Details Card */}
                        <SectionCard
                            title="Trip Details"
                            icon={MapPin}
                            onAction={() => router.push("/bookingform")}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6">
                                <InfoRow
                                    label="Pick-up Point"
                                    value={
                                        isRoundTrip
                                            ? tripData.outbound?.pickupAddress
                                            : tripData.pickupAddress
                                    }
                                />
                                <InfoRow
                                    label="Date & Departure"
                                    value={formatReviewDate(
                                        isRoundTrip
                                            ? tripData.outbound?.datetime
                                            : tripData.datetime,
                                    )}
                                    subValue={formatReviewTime(
                                        isRoundTrip
                                            ? tripData.outbound?.datetime
                                            : tripData.datetime,
                                    )}
                                />
                                <InfoRow
                                    label="Drop-off Point"
                                    value={
                                        isRoundTrip
                                            ? tripData.outbound?.dropoffAddress
                                            : tripData.dropoffAddress
                                    }
                                />
                                <InfoRow
                                    label="Charter Details"
                                    value={tripType
                                        .replace("-", " ")
                                        .toUpperCase()}
                                    subValue={`${isRoundTrip ? tripData.outbound?.passengers : tripData.passengers || 0} Passengers · ${isHourly ? `${tripData.duration} Hours` : "One Way"}`}
                                />
                            </div>

                            {/* Stops display */}
                            {stops.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                        Intermediate Stops ({stops.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {stops.map((stop, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50"
                                            >
                                                <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {i + 1}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {stop}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isRoundTrip && (
                                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <Calendar className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">
                                                Return Trip
                                            </div>
                                            <div className="text-sm font-bold text-slate-700">
                                                {formatReviewDate(
                                                    tripData.return?.datetime,
                                                )}{" "}
                                                at{" "}
                                                {formatReviewTime(
                                                    tripData.return?.datetime,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                        Round Trip
                                    </span>
                                </div>
                            )}
                        </SectionCard>

                        {/* Selected Vehicle Card */}
                        <SectionCard
                            title="Selected Vehicle"
                            icon={Bus}
                            actionLabel="Change"
                            onAction={() =>
                                router.push("/bookingform/vechileselect")
                            }
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-64 h-40 bg-slate-100 rounded-3xl overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                                    <img
                                        src={
                                            vehicle.image ||
                                            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600"
                                        }
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow py-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
                                                {vehicle.name ||
                                                    "No vehicle selected"}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className="w-3.5 h-3.5 fill-current"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-400">
                                                    4.9/5 (240+ Reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 mt-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Users className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                                                    Capacity
                                                </p>
                                                <p className="text-xs font-bold text-slate-700">
                                                    {vehicle.passengers} Seats
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Wifi className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                                                    Onboard
                                                </p>
                                                <p className="text-xs font-bold text-slate-700">
                                                    Free WiFi
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Briefcase className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                                                    Luggage
                                                </p>
                                                <p className="text-xs font-bold text-slate-700">
                                                    24 Bags
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Primary Passenger Card */}
                        <SectionCard
                            title="Primary Passenger"
                            icon={Users}
                            onAction={() =>
                                router.push("/bookingform/vechileselect")
                            }
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoRow
                                    label="Full Name"
                                    value={`${contact.firstName || "N/A"} ${contact.lastName || ""}`}
                                />
                                <InfoRow
                                    label="Email Address"
                                    value={contact.email || "N/A"}
                                />
                                <InfoRow
                                    label="Phone Number"
                                    value={`${contact.countryCode} ${contact.phone || "N/A"}`}
                                />
                                <InfoRow
                                    label="Contact Type"
                                    value="Primary Point of Contact"
                                    subValue="Will receive all updates"
                                />
                            </div>
                        </SectionCard>
                    </div>

                    {/* Right Column: Price & Actions */}
                    <div className="lg:col-span-4">
                        <PriceBreakdown
                            vehiclePrice={vehiclePrice}
                            pricing={pricing}
                            isProcessing={isProcessing}
                            onConfirm={handleConfirm}
                        />
                    </div>
                </div>
            </main>

            <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 mt-20 py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">
                        LuxCharter Premium Fleet Services
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                        © 2024 LuxCharter Inc. All rights reserved. Managed and
                        operated in USA.
                    </p>
                </div>
            </footer>
        </div>
    );
}
