import React, { useState } from "react";

const DEFAULT_REGIONS = [
    {
        id: "northeast",
        name: "Northeast Corridor",
        cities: [
            "New York City",
            "Boston",
            "Philadelphia",
            "Washington D.C.",
            "Baltimore",
        ],
        highlight: "High-frequency service",
    },
    {
        id: "southeast",
        name: "Southeast Region",
        cities: ["Atlanta", "Miami", "Orlando", "Charlotte", "Nashville"],
        highlight: "Tourism & corporate travel",
    },
    {
        id: "texas",
        name: "Texas Triangle",
        cities: ["Dallas", "Houston", "Austin", "San Antonio"],
        highlight: "Oil industry & tech sector experience",
    },
    {
        id: "westcoast",
        name: "West Coast Hubs",
        cities: ["Los Angeles", "San Francisco", "Seattle", "Portland"],
        highlight: "Eco-friendly fleet options",
    },
    {
        id: "midwest",
        name: "Midwest Centers",
        cities: ["Chicago", "Detroit", "Minneapolis", "Cleveland"],
        highlight: "Winter weather operational expertise",
    },
];

const DEFAULT_EVENTS = ["SXSW", "CES", "NCAA Tournaments"];

const DEFAULT_CAPABILITIES = [
    {
        icon: "📋",
        title: "DOT-Registered Carrier",
        desc: "Licensed for full interstate commerce with authority across all 50 states.",
    },
    {
        icon: "🔄",
        title: "Driver Rotation Protocols",
        desc: "Strategic driver changes on 500+ mile trips maintain safety without delays.",
    },
    {
        icon: "🌎",
        title: "International Coverage",
        desc: "Border crossings into Canada and partnerships with Mexican transport providers.",
    },
    {
        icon: "🗺️",
        title: "Route Optimization",
        desc: "Our ops team manages HOS regulations, permitting, and fuel/meal stop planning.",
    },
];

const NationwideCoverage = ({
    regions = DEFAULT_REGIONS,
    eventExamples = DEFAULT_EVENTS,
    capabilities = DEFAULT_CAPABILITIES,
    maxAttendees = 10000,
    longDistanceMileThreshold = 500,
    ctaHref = "#quote-form",
}) => {
    const [activeRegion, setActiveRegion] = useState(regions[0]?.id || null);
    const active = regions.find((r) => r.id === activeRegion) || regions[0];

    return (
        <section className="py-16 bg-gray-50" id="nationwide-coverage">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Nationwide Charter Bus Coverage
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mb-10">
                    Our network spans all 50 states — from major metropolitan
                    hubs to rural destinations. Consistent quality and
                    reliability, coast to coast.
                </p>

                {/* Capabilities grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-12">
                    {capabilities.map((cap, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 items-start hover:shadow-sm transition-shadow"
                        >
                            <span className="text-2xl">{cap.icon}</span>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm mb-0.5">
                                    {cap.title}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {cap.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Region explorer */}
                <div className="mb-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Major Service Areas
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {regions.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setActiveRegion(r.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                    activeRegion === r.id
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                                }`}
                            >
                                {r.name}
                            </button>
                        ))}
                    </div>
                    {active && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h4 className="font-bold text-gray-900">
                                    {active.name}
                                </h4>
                                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-medium">
                                    {active.highlight}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {active.cities.map((city, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                                    >
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Event coordination */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Large-Scale Event Coordination
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        We've moved{" "}
                        <strong>{maxAttendees.toLocaleString()}+</strong>{" "}
                        attendees for events like {eventExamples.join(", ")},
                        managing complex shuttle loops, parking logistics, and
                        real-time schedule adjustments. For long-distance trips
                        exceeding{" "}
                        <strong>{longDistanceMileThreshold} miles</strong>, we
                        implement driver rotation and overnight accommodation
                        protocols for safety and efficiency.
                    </p>
                </div>

                {/* CTA */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
                    <p className="text-blue-900 font-semibold mb-1">
                        Coast-to-Coast Transportation Solutions
                    </p>
                    <p className="text-blue-800 text-sm mb-4">
                        Planning multi-city travel or need transportation in a
                        specific region? Our network covers every state with
                        local expertise.
                    </p>
                    <a
                        href={ctaHref}
                        className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Check Coverage in Your Area
                    </a>
                </div>
            </div>
        </section>
    );
};

export default NationwideCoverage;
