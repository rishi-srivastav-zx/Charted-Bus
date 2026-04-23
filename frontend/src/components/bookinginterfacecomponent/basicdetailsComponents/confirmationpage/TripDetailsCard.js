import { MapPin, Calendar } from "lucide-react";
import SectionCard from "./SectionCard";
import InfoRow from "./InfoRow";

export default function TripDetailsCard({
    tripDetails,
    backendBooking,
    onEdit,
    formatReviewDate,
    formatReviewTime,
}) {
    const tripData = tripDetails?.formData || {};
    const tripType =
        tripDetails?.tripType || backendBooking?.tripType || "one-way";
    const isRoundTrip = tripType === "round-trip";
    const isHourly = tripType === "hourly";

    const stops = (
        isRoundTrip ? tripData.outbound?.stops || [] : tripData.stops || []
    ).filter((s) => s);

    return (
        <SectionCard title="Trip Details" icon={MapPin} onAction={onEdit}>
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
                    value={tripType.replace("-", " ").toUpperCase()}
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
                                {formatReviewDate(tripData.return?.datetime)} at{" "}
                                {formatReviewTime(tripData.return?.datetime)}
                            </div>
                        </div>
                    </div>
                    <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Round Trip
                    </span>
                </div>
            )}
        </SectionCard>
    );
}
