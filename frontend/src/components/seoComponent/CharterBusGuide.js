import React from "react";

const DEFAULT_TRIP_TYPES = [
    {
        title: "Corporate Events & Business Travel",
        description:
            "Employee shuttles, conference transportation, and team-building retreats with WiFi-equipped coaches",
    },
    {
        title: "Wedding & Special Occasion Transport",
        description:
            "Guest shuttles between venues, bachelor/bachelorette party buses, and rehearsal dinner transport",
    },
    {
        title: "Educational & School Trips",
        description:
            "Field trips, campus tours, and athletic events with certified, background-checked drivers",
    },
    {
        title: "Sports Team & Fan Transportation",
        description:
            "Professional team travel, youth league tournaments, and tailgate party buses",
    },
    {
        title: "Religious & Community Outings",
        description:
            "Church retreats, mission trips, and senior center excursions with accessible vehicle options",
    },
];

const DEFAULT_PRICING = {
    localMin: 125,
    localMax: 180,
    localUnit: "hour",
    bookingLeadMin: 3,
    bookingLeadMax: 6,
    currency: "$",
};

const CharterBusGuide = ({
    tripTypes = DEFAULT_TRIP_TYPES,
    pricing = DEFAULT_PRICING,
    minPassengers = 18,
    maxPassengers = 56,
    ctaHref = "#quote-form",
    expertYears = 8,
}) => {
    const p = { ...DEFAULT_PRICING, ...pricing };

    return (
        <section className="py-16 bg-white" id="charter-bus-guide">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Complete Guide to Charter Bus Rentals in the USA
                </h2>

                <div className="text-gray-700 space-y-4 mb-8">
                    <p className="text-lg leading-relaxed">
                        Booking a <strong>charter bus rental in the USA</strong>{" "}
                        doesn't have to be complicated. Whether you're
                        organizing corporate transportation, planning a wedding
                        shuttle, or coordinating school field trips,
                        understanding the rental process ensures you get the
                        best value and service.
                    </p>

                    <p className="leading-relaxed">
                        The charter bus booking process typically begins{" "}
                        <strong>
                            {p.bookingLeadMin}–{p.bookingLeadMax} months
                        </strong>{" "}
                        before your trip for optimal availability and pricing.
                        Local charters generally range from{" "}
                        <strong>
                            {p.currency}
                            {p.localMin}–{p.currency}
                            {p.localMax} per {p.localUnit}
                        </strong>
                        , while long-distance trips may be priced by mileage or
                        day rates.
                    </p>
                </div>

                {/* Trip types */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Types of Charter Bus Trips We Specialize In
                    </h3>
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                        {tripTypes.map((trip, i) => (
                            <div
                                key={i}
                                className="px-5 py-4 hover:bg-gray-50 transition-colors"
                            >
                                <p className="font-semibold text-gray-900 text-sm mb-0.5">
                                    {trip.title}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {trip.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust signals */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {[
                        {
                            icon: "✅",
                            title: "DOT Registered",
                            desc: "Verified insurance & safety ratings",
                        },
                        {
                            icon: "📍",
                            title: "GPS Tracking",
                            desc: "Real-time fleet visibility on every trip",
                        },
                        {
                            icon: "🕐",
                            title: "24/7 Dispatch",
                            desc: "Professional support around the clock",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center"
                        >
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <p className="font-semibold text-gray-900 text-sm">
                                {item.title}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="text-gray-700 leading-relaxed mb-8">
                    When comparing <strong>motorcoach companies</strong>, verify
                    DOT registration, insurance coverage, and safety ratings.
                    The best <strong>charter bus companies near you</strong>{" "}
                    offer transparent pricing without hidden fuel surcharges or
                    driver gratuity surprises. Our reservation specialists
                    average <strong>{expertYears}+ years</strong> in the
                    transportation industry and will match your group — from
                    minibuses for <strong>{minPassengers} passengers</strong> to
                    full-size coaches accommodating{" "}
                    <strong>{maxPassengers} travelers</strong>.
                </p>

                {/* CTA */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
                    <p className="text-blue-900 font-semibold mb-1">
                        Get Your Custom Charter Bus Quote Today
                    </p>
                    <p className="text-blue-800 text-sm mb-4">
                        Speak with a group transportation expert and receive a
                        detailed quote within 2 hours.
                    </p>
                    <a
                        href={ctaHref}
                        className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Request Free Quote Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CharterBusGuide;
