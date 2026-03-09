import React, { useState } from "react";

const COUNTRY_CONTENT = {
    US: {
        currency: "$",
        distanceUnit: "miles",
        sizeOptions: [
            { size: "56-Passenger", price: 200 },
            { size: "40-Passenger", price: 350 },
            { size: "24-Passenger", price: 500 },
        ],
        phone: "(555) 123-4567",
        certifications: ["DOT Certified", "FMCSA Registered"],
        serviceAreas: "nationwide coverage across all 50 states",
        regionNote: "From coast to coast,",
    },
    CA: {
        currency: "C$",
        distanceUnit: "kilometers",
        sizeOptions: [
            { size: "56-Passenger", price: 220 },
            { size: "40-Passenger", price: 370 },
            { size: "24-Passenger", price: 520 },
        ],
        phone: "(555) 123-4567",
        certifications: ["Transport Canada Approved", "CVOR Certified"],
        serviceAreas: "coast-to-coast service from Vancouver to Halifax",
        regionNote: "From Vancouver to Halifax,",
    },
    UK: {
        currency: "£",
        distanceUnit: "miles",
        sizeOptions: [
            { size: "70-Seat", price: 180 },
            { size: "53-Seat", price: 320 },
            { size: "35-Seat", price: 460 },
        ],
        phone: "020 7946 0958",
        certifications: ["DVSA Approved", "CPC Certified"],
        serviceAreas: "nationwide coverage including Scotland and Wales",
        regionNote: "From London to Edinburgh,",
    },
    AU: {
        currency: "A$",
        distanceUnit: "kilometers",
        sizeOptions: [
            { size: "57-Seat", price: 210 },
            { size: "43-Seat", price: 360 },
            { size: "28-Seat", price: 510 },
        ],
        phone: "(02) 9123 4567",
        certifications: ["NHVR Accredited", "Chain of Responsibility"],
        serviceAreas: "interstate service connecting all major cities",
        regionNote: "From Sydney to Perth,",
    },
};

const DEFAULT_FEATURES = [
    {
        id: "seats",
        icon: "🪑",
        title: "Reclining High-Back Seats",
        description:
            "Extra legroom and adjustable headrests for journeys of any duration",
        detail: "Ergonomic design with 45° recline and memory foam cushioning",
    },
    {
        id: "climate",
        icon: "❄️",
        title: "Climate Control",
        description:
            "Individual air vents and advanced HVAC maintaining optimal cabin temperature",
        detail: "Dual-zone control with HEPA filtration and rapid cool-down",
    },
    {
        id: "entertainment",
        icon: "📺",
        title: "Entertainment Systems",
        description:
            "Flat-screen TVs, DVD players, and PA systems for presentations or movies",
        detail: "4K displays with HDMI connectivity and surround sound",
    },
    {
        id: "connectivity",
        icon: "📶",
        title: "WiFi & Charging",
        description: "Complimentary WiFi and USB charging ports at every seat",
        detail: "5G-enabled hotspots with unlimited data and fast-charge USB-C",
    },
    {
        id: "restroom",
        icon: "🚻",
        title: "Onboard Restroom",
        description:
            "Clean, spacious lavatories on full-size coaches for uninterrupted travel",
        detail: "Full-size restrooms with touchless fixtures and premium amenities",
    },
];

const DEFAULT_STATS = [
    {
        value: "98.5%",
        label: "Customer Satisfaction",
        sub: "Based on 10,000+ trips",
    },
    {
        value: "24/7",
        label: "Dispatch Center",
        sub: "Real-time support & tracking",
    },
    {
        value: "100+",
        label: "Group Discount",
        sub: "Special rates for large groups",
    },
];

const DEFAULT_SAVINGS = [
    { label: "Personal Vehicles", pct: 100 },
    { label: "Rideshare Services", pct: 85 },
    { label: "Our Charter Service", pct: 40 },
];

const AffordableLuxury = ({
    country = "US",
    features = DEFAULT_FEATURES,
    stats = DEFAULT_STATS,
    savingsData = DEFAULT_SAVINGS,
    ctaHref = "#quote-form",
}) => {
    const [activeFeature, setActiveFeature] = useState(null);
    const content = COUNTRY_CONTENT[country] || COUNTRY_CONTENT.US;

    return (
        <section className="py-16 bg-white" id="affordable-luxury">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded mb-3 border border-blue-100">
                        Serving {content.serviceAreas}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Affordable Group Transportation{" "}
                        <span className="text-blue-600">
                            Without Compromising Comfort
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl">
                        {content.regionNote} we deliver premium charter
                        experiences with transparent pricing — no hidden fees,
                        no surprises.
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-2 gap-10 mb-14">
                    {/* Cost comparison */}
                    <div>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Finding{" "}
                            <strong>affordable charter bus rentals</strong>{" "}
                            shouldn't mean sacrificing quality. When you divide
                            the total charter cost among passengers, individual
                            rates often beat driving personal vehicles — without
                            the parking headaches or coordination stress.
                        </p>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                Cost Per Person Comparison
                            </p>
                            <div className="space-y-3">
                                {savingsData.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>{item.label}</span>
                                            <span
                                                className={
                                                    i === savingsData.length - 1
                                                        ? "text-blue-600 font-semibold"
                                                        : ""
                                                }
                                            >
                                                {item.pct}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${i === savingsData.length - 1 ? "bg-blue-600" : "bg-gray-400"}`}
                                                style={{
                                                    width: `${item.pct}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-3">
                                Relative cost index based on 40-person group
                                travel
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            What's Included
                        </p>
                        {features.map((f) => (
                            <div
                                key={f.id}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                    onClick={() =>
                                        setActiveFeature(
                                            activeFeature === f.id
                                                ? null
                                                : f.id,
                                        )
                                    }
                                >
                                    <span className="text-xl">{f.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">
                                            {f.title}
                                        </p>
                                        <p className="text-gray-500 text-xs truncate">
                                            {f.description}
                                        </p>
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        {activeFeature === f.id ? "▲" : "▼"}
                                    </span>
                                </button>
                                {activeFeature === f.id && (
                                    <div className="px-4 pb-3 pt-1 bg-blue-50 border-t border-blue-100">
                                        <p className="text-blue-800 text-sm">
                                            {f.detail}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fleet size options */}
                <div className="grid sm:grid-cols-3 gap-4 mb-14">
                    {content.sizeOptions.map((opt, i) => (
                        <div
                            key={i}
                            className="border border-gray-200 rounded-xl p-5 text-center hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {opt.size}
                            </div>
                            <div className="text-gray-500 text-sm mb-3">
                                Coach Configuration
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                From {content.currency}
                                {opt.price}/day
                            </div>
                        </div>
                    ))}
                </div>

                {/* Executive fleet callout */}
                <div className="bg-gray-900 rounded-2xl p-8 text-white mb-14">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-3">
                                Executive Luxury Fleet
                            </h3>
                            <p className="text-gray-300 mb-5">
                                Elevate your journey with premium coaches
                                featuring leather upholstery, wood-grain
                                flooring, ambient lighting, and onboard
                                refreshment centers.
                            </p>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                {[
                                    "VIP wedding transportation",
                                    "Corporate executive shuttles",
                                    "Premium tour experiences",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-yellow-400">
                                            ★
                                        </span>{" "}
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/10 rounded-xl p-6 border border-white/20 text-center">
                            <div className="text-4xl font-bold text-yellow-400 mb-1">
                                15–20%
                            </div>
                            <div className="text-gray-300 text-sm mb-2">
                                Above standard rates
                            </div>
                            <div className="text-gray-400 text-xs">
                                Includes premium catering options and dedicated
                                concierge support
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-3 gap-6 mb-12 text-center">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className={`p-5 ${i === 1 ? "border-x border-gray-200" : ""}`}
                        >
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                                {s.value}
                            </div>
                            <div className="text-gray-900 font-semibold text-sm">
                                {s.label}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                                {s.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-7">
                    <div className="md:flex items-center justify-between gap-6">
                        <div className="mb-5 md:mb-0">
                            <h3 className="text-xl font-bold text-blue-900 mb-1">
                                Ready to Experience Premium Transportation?
                            </h3>
                            <p className="text-blue-800 text-sm mb-3">
                                Transparent pricing with no hidden fees.
                                Price-match guarantee available. Flexible
                                payment terms.
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-blue-700">
                                {[
                                    "Instant online quotes",
                                    "Free cancellation up to 48hrs",
                                    "Secure payment processing",
                                ].map((item, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-1"
                                    >
                                        ✓ {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-2 shrink-0">
                            <a
                                href={ctaHref}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm text-center whitespace-nowrap"
                            >
                                Get Transparent Quote
                            </a>
                            <span className="text-xs text-gray-400">
                                Or call {content.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AffordableLuxury;
