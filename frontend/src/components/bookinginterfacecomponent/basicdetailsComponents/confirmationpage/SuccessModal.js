import {
    CheckCircle2,
    Bus,
    MapPin,
    Calendar,
    Clock,
    Users,
    ArrowRight,
    Mail,
    Phone,
    Star,
    ShieldCheck,
    Download,
} from "lucide-react";


export default function SuccessModal({
    isOpen,
    onClose,
    tripDetails,
    bookingDetails,
    vehicle,
}) {
    if (!isOpen) return null;

    const tripData = tripDetails?.formData || {};
    const tripType = tripDetails?.tripType || "one-way";
    const isRoundTrip = tripType === "round-trip";
    const isHourly = tripType === "hourly";
    const contact = bookingDetails?.contact || {};

    const formatDate = (dateStr) => {
        if (!dateStr) return "Not set";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300 no-scrollbar">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 border border-slate-100 no-scrollbar">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center border-b border-emerald-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200/50">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                        Thank You, {contact.firstName || "Guest"}!
                    </h2>
                    <p className="text-emerald-700 font-semibold text-sm mb-1">
                        Your booking request has been received successfully
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mt-3 border border-emerald-100">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Booking #
                            {Math.random()
                                .toString(36)
                                .substr(2, 9)
                                .toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Trip Summary Card */}
                <div className="p-8 space-y-6">
                    {/* What Happens Next */}
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            What happens next?
                        </h4>
                        <ul className="space-y-2 text-xs text-blue-700 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                                Our dispatch team is reviewing your trip details
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                                You'll receive a detailed quote via email within
                                15 minutes
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                                Final confirmation and payment link will follow
                                shortly
                            </li>
                        </ul>
                    </div>

                    {/* Trip Details Grid */}
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                            Your Trip Details
                        </h4>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                            {/* Route */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                                        Route
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 truncate">
                                        {pickup || "Not set"}
                                    </p>
                                    <div className="flex items-center gap-1 my-1">
                                        <div className="w-px h-4 bg-slate-300 ml-1.5" />
                                        <ArrowRight className="w-3 h-3 text-slate-400 rotate-90" />
                                        <div className="w-px h-4 bg-slate-300 ml-1.5" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 truncate">
                                        {dropoff || "Not set"}
                                    </p>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                                        Departure
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {formatDate(datetime)}{" "}
                                        <span className="text-slate-400 font-medium">
                                            at
                                        </span>{" "}
                                        {formatTime(datetime)}
                                    </p>
                                </div>
                            </div>

                            {/* Vehicle */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Bus className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                                        Selected Vehicle
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {vehicle?.name ||
                                            "Standard Charter Bus"}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                                        <span className="text-xs text-slate-500 font-medium">
                                            4.9/5 Premium Fleet
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Passengers & Type */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                                        Passengers & Type
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {passengers || 0} Passengers ·{" "}
                                        {isHourly
                                            ? `${tripData.duration} Hours`
                                            : tripType
                                                  .replace("-", " ")
                                                  .toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            {/* Return Trip (if applicable) */}
                            {isRoundTrip && tripData.return?.datetime && (
                                <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mb-0.5">
                                            Return Trip
                                        </p>
                                        <p className="text-sm font-bold text-slate-800">
                                            {formatDate(
                                                tripData.return.datetime,
                                            )}{" "}
                                            <span className="text-slate-400 font-medium">
                                                at
                                            </span>{" "}
                                            {formatTime(
                                                tripData.return.datetime,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                            Confirmation Sent To
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Email
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {contact.email || "Not provided"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                    <Phone className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Phone
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {contact.countryCode}{" "}
                                        {contact.phone || "Not provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-emerald-800">
                                Secure & Protected
                            </p>
                            <p className="text-[10px] text-emerald-600 font-medium">
                                Your booking is encrypted. 24/7 support
                                available.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 pt-0 space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        Back to Home
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="w-full bg-white text-slate-700 font-bold py-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Save Trip Summary
                    </button>

                    <p className="text-[11px] text-slate-400 text-center font-bold uppercase tracking-widest pt-2">
                        Check your email for step-by-step updates
                    </p>
                </div>
            </div>
        </div>
    );
}
