"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    ArrowRight,
    CheckCircle2,
    MapPin,
    Clock,
    Edit3,
    PhoneCall,
    AlertCircle,
    User,
    ChevronDown,
    ChevronUp,
    Info,
} from "lucide-react";
import { cn } from "@/app/lib/uitls";
import { formatCurrency, formatDisplayDate } from "./formatters";

const TripSummary = ({
    tripDetails: propTripDetails,
    selectedVehicle,
    bookingVehicleData,
    onContinue,
    showError,
    contactData,
    isSaving,
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
            {(selectedVehicle || bookingVehicleData) && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                selectedVehicle?.image ||
                                bookingVehicleData?.image
                            }
                            alt={
                                selectedVehicle?.name ||
                                bookingVehicleData?.name
                            }
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <div className="text-xs text-blue-600 font-bold uppercase mb-1">
                                Selected Vehicle
                            </div>
                            <div className="font-bold text-slate-900">
                                {selectedVehicle?.name ||
                                    bookingVehicleData?.name}
                            </div>
                            <div className="text-sm text-slate-600">
                                {formatCurrency(
                                    selectedVehicle?.price ||
                                        bookingVehicleData?.price ||
                                        0,
                                    selectedVehicle?.currency ||
                                        bookingVehicleData?.currency ||
                                        "USD",
                                )}
                                /trip
                            </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            )}

            {/* ESTIMATED PRICE DISCLAIMER - Visible when bus is selected */}
            {(selectedVehicle || bookingVehicleData) && (
                <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                        <span className="font-bold">Estimated Price:</span> This
                        is your estimated bus price. It may increase or decrease
                        after calculating the final distance and extras.
                    </p>
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
                disabled={!selectedVehicle || isSaving}
                className={cn(
                    "w-full mt-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70",
                    selectedVehicle
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed",
                )}
            >
                {isSaving ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                    </>
                ) : contactData ? (
                    <>
                        Proceed to Next Step
                        <ArrowRight className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        Continue to Next Step
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
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

export default TripSummary;
