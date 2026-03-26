"use client";

import { X, Navigation, MapPin, ArrowDown, Ruler, Clock } from "lucide-react";

const RoutePopup = ({ lead, onClose }) => {
    const formatDate = (d) => {
        if (!d) return "N/A";
        try {
            return new Date(d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "N/A";
        }
    };

    const formatTime = (d) => {
        if (!d) return "N/A";
        try {
            return new Date(d).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "N/A";
        }
    };

    // Get stops from different possible field names
    const stops = lead.stops || lead.intermediateStops || lead.additionalStops || [];
    const hasStops = stops && stops.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Route Details
                            </h2>
                            <p className="text-xs text-gray-400">
                                #{lead.confirmationNumber || "N/A"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Route Visual */}
                <div className="px-6 py-5 space-y-2">
                    {/* Pickup */}
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center pt-1">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                            <div className={`w-0.5 ${hasStops ? 'h-16' : 'h-10'} bg-gradient-to-b from-emerald-400 to-amber-400 mt-1`} />
                        </div>
                        <div className="flex-1 pb-2">
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                                Pickup
                            </p>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                                <p className="text-sm font-semibold text-gray-800">
                                    {lead.pickupAddress || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Intermediate Stops */}
                    {hasStops && stops.map((stop, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="flex flex-col items-center pt-1">
                                <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                                {index < stops.length - 1 && (
                                    <div className="w-0.5 h-12 bg-gradient-to-b from-amber-400 to-amber-400 mt-1" />
                                )}
                            </div>
                            <div className="flex-1 pb-2">
                                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
                                    Stop {index + 1}
                                </p>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {stop.address || stop.name || stop || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Arrow */}
                    <div className="flex items-center gap-3 pl-1.5">
                        <ArrowDown className="w-4 h-4 text-gray-300 shrink-0" />
                        {lead.distance && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Ruler className="w-3 h-3" />
                                {lead.distance} miles
                            </span>
                        )}
                    </div>

                    {/* Dropoff */}
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center pt-1">
                            <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                                Dropoff
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-sm font-semibold text-gray-800">
                                    {lead.dropoffAddress || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Meta */}
                <div className="px-6 pb-5 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" /> Date
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                                {formatDate(lead.datetime)}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" /> Time
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                                {formatTime(lead.datetime)}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                                <MapPin className="w-3 h-3" /> Vehicle
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                                {lead.vehicleType || "Standard"}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400 mb-1">
                                Luggage
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                                {lead.luggage || "Standard"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoutePopup;
