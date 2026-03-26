"use client";

import {
    ChevronDown,
    X,
    User,
    Mail,
    Phone,
    Navigation,
    FileText,
    Send,
    Users,
} from "lucide-react";
import StatusBadge from "./statusbadge";

const LeadDetailModal = ({ lead, onClose, onConfirm }) => {
    const fmt = (d, type = "date") => {
        if (!d) return "N/A";
        try {
            return type === "date"
                ? new Date(d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  })
                : new Date(d).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                  });
        } catch {
            return "N/A";
        }
    };

    const formatCurrency = (amount = 0, currency = "USD") => {
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }).format(amount);
        } catch {
            return `$${amount}`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-start justify-between z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {lead.contact?.firstName || "N/A"}{" "}
                            {lead.contact?.lastName || ""}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            #{lead.confirmationNumber || "N/A"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status="pending" />
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Contact */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-blue-500" />{" "}
                                Contact
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <span className="break-all">
                                        {lead.contact?.email || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{lead.contact?.phone || "N/A"}</span>
                                </div>
                                {lead.contact?.alternatePhone && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>
                                            Alt: {lead.contact.alternatePhone}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Users className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>
                                        {lead.passengers || 0} passengers
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Route */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Navigation className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Route
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1">
                                        Pickup
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {lead.pickupAddress || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <ChevronDown className="w-4 h-4 text-gray-300" />
                                </div>
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1">
                                        Dropoff
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {lead.dropoffAddress || "N/A"}
                                    </p>
                                </div>
                                {lead.distance && (
                                    <p className="text-xs text-gray-400 text-center">
                                        {lead.distance} miles
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Booking */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-purple-500" />{" "}
                                Booking
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Vehicle:</span>
                                    <span className="font-medium text-gray-900">
                                        {lead.vehicleType || "Standard"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-medium text-gray-900">
                                        {fmt(lead.datetime)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="font-medium text-gray-900">
                                        {fmt(lead.datetime, "time")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Luggage:</span>
                                    <span className="font-medium text-gray-900">
                                        {lead.luggage || "Standard"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Booked On:</span>
                                    <span className="font-medium text-gray-900">
                                        {fmt(lead.createdAt)}
                                    </span>
                                </div>
                                {lead.pricing && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                                        {lead.pricing.breakdown?.base !=
                                            null && (
                                            <div className="flex justify-between text-xs">
                                                <span>Base fare:</span>
                                                <span>
                                                    {formatCurrency(
                                                        lead.pricing.breakdown
                                                            .base,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {lead.pricing.breakdown?.tax > 0 && (
                                            <div className="flex justify-between text-xs">
                                                <span>Tax:</span>
                                                <span>
                                                    {formatCurrency(
                                                        lead.pricing.breakdown
                                                            .tax,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200 text-sm">
                                            <span>Total:</span>
                                            <span>
                                                {formatCurrency(
                                                    lead.pricing.totalAmount,
                                                    lead.pricing.currency,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onConfirm(lead);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                        Confirm & Send Payment Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailModal;
