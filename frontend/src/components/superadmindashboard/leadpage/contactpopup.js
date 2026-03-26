"use client";

import { X, User, Mail, Phone, Users, Hash, Calendar } from "lucide-react";
import StatusBadge from "./statusbadge";

const ContactPopup = ({ lead, onClose }) => {
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
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Contact Details
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

                {/* Avatar + Name */}
                <div className="px-6 pt-5 pb-4 flex flex-col items-center text-center border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
                        {(lead.contact?.firstName?.[0] || "?").toUpperCase()}
                        {(lead.contact?.lastName?.[0] || "").toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {lead.contact?.firstName || "N/A"}{" "}
                        {lead.contact?.lastName || ""}
                    </h3>
                    <div className="mt-1">
                        <StatusBadge status={lead.status || "pending"} />
                    </div>
                </div>

                {/* Details */}
                <div className="px-6 py-5 space-y-3">
                    <InfoRow
                        icon={<Mail className="w-4 h-4 text-blue-500" />}
                        label="Email"
                        value={lead.contact?.email || "N/A"}
                        mono
                    />
                    <InfoRow
                        icon={<Phone className="w-4 h-4 text-emerald-500" />}
                        label="Phone"
                        value={lead.contact?.phone || "N/A"}
                    />
                    {lead.contact?.alternatePhone && (
                        <InfoRow
                            icon={<Phone className="w-4 h-4 text-gray-400" />}
                            label="Alt. Phone"
                            value={lead.contact.alternatePhone}
                        />
                    )}
                    <InfoRow
                        icon={<Users className="w-4 h-4 text-purple-500" />}
                        label="Passengers"
                        value={`${lead.passengers || 0} passengers`}
                    />
                    <InfoRow
                        icon={<Hash className="w-4 h-4 text-amber-500" />}
                        label="Confirmation #"
                        value={lead.confirmationNumber || "N/A"}
                        mono
                    />
                    <InfoRow
                        icon={<Calendar className="w-4 h-4 text-gray-400" />}
                        label="Booked On"
                        value={formatDate(lead.createdAt)}
                    />
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

const InfoRow = ({ icon, label, value, mono = false }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p
                className={`text-sm font-semibold text-gray-800 break-all ${mono ? "font-mono" : ""}`}
            >
                {value}
            </p>
        </div>
    </div>
);

export default ContactPopup;
