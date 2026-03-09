import React from "react";

const DEFAULT_ADVANTAGES = [
    {
        icon: "🪪",
        title: "Certified Professional Drivers",
        description:
            "All operators hold CDLs with Passenger endorsements, undergo annual safety recertification, and average 12+ years of professional driving experience.",
    },
    {
        icon: "📞",
        title: "24/7 Live Dispatch Support",
        description:
            "Real humans answer our phones around the clock — no automated menus when you need immediate assistance with route changes or emergency coordination.",
    },
    {
        icon: "⚡",
        title: "Instant Quote Technology",
        description:
            "Receive detailed, binding quotes within 2 hours through our proprietary pricing algorithm that eliminates surprise surcharges.",
    },
    {
        icon: "🛡️",
        title: "Comprehensive Insurance",
        description:
            "$5 million liability policies and full cargo protection provide peace of mind that basic operators cannot match.",
    },
    {
        icon: "🌱",
        title: "Sustainability Commitment",
        description:
            "Carbon offset programs, idle-reduction policies, and investment in electric vehicle technology for eco-conscious organizations.",
    },
];

const DEFAULT_STATS = [
    {
        value: "< 4 yrs",
        label: "Avg. Fleet Age",
        sub: "Modern safety features on every coach",
    },
    {
        value: "85%+",
        label: "Client Retention",
        sub: "Annual repeat booking rate",
    },
    {
        value: "99.7%",
        label: "On-Time Rate",
        sub: "Across all scheduled trips",
    },
];

const WhyChooseUs = ({
    advantages = DEFAULT_ADVANTAGES,
    stats = DEFAULT_STATS,
    fleetInspectionFrequency = "weekly",
    thirdPartyAuditFrequency = "quarterly",
    retentionRate = 85,
    ctaHref = "#quote-form",
}) => {
    return (
        <section className="py-16 bg-white" id="why-choose-us">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    What Makes Our Charter Bus Service Different
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mb-10">
                    We've established the benchmark for professional charter bus
                    services through unwavering commitment to operational
                    excellence — every vehicle, every driver, every mile.
                </p>

                {/* Stats row */}
                <div className="grid sm:grid-cols-3 gap-4 mb-12">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center"
                        >
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                                {s.value}
                            </div>
                            <div className="text-gray-900 font-semibold text-sm">
                                {s.label}
                            </div>
                            <div className="text-gray-400 text-xs mt-0.5">
                                {s.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fleet maintenance callout */}
                <div className="border border-blue-100 bg-blue-50 rounded-xl p-5 mb-10 flex gap-4 items-start">
                    <span className="text-2xl">🔧</span>
                    <div>
                        <p className="font-semibold text-blue-900 mb-1">
                            Fleet Maintenance Beyond FMCSA Standards
                        </p>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            Each motorcoach undergoes pre-trip inspections,{" "}
                            <strong>{fleetInspectionFrequency}</strong>{" "}
                            comprehensive checks, and{" "}
                            <strong>{thirdPartyAuditFrequency}</strong>{" "}
                            third-party safety audits. Average fleet age remains
                            under 4 years, ensuring modern safety features like
                            electronic stability control, collision mitigation,
                            and GPS tracking on every vehicle.
                        </p>
                    </div>
                </div>

                {/* Advantages list */}
                <div className="mb-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Our Competitive Advantages
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {advantages.map((adv, i) => (
                            <div
                                key={i}
                                className="flex gap-4 items-start p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow"
                            >
                                <span className="text-2xl shrink-0">
                                    {adv.icon}
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm mb-0.5">
                                        {adv.title}
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {adv.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transparency & expertise */}
                <div className="grid sm:grid-cols-2 gap-5 mb-12">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <p className="font-semibold text-gray-900 mb-2">
                            🔍 Full Transparency
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            We provide driver profiles 48 hours before
                            departure, real-time GPS tracking links for trip
                            coordinators, and detailed post-trip reporting. No
                            hidden fees, no ambiguous terms.
                        </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <p className="font-semibold text-gray-900 mb-2">
                            ⚙️ Specialized Expertise
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            From ADA-compliant accessible coaches with
                            wheelchair lifts to vehicles equipped for complex
                            logistics, we maintain certifications for challenges
                            general operators cannot handle.
                        </p>
                    </div>
                </div>

                {/* Retention callout */}
                <div className="bg-gray-900 text-white rounded-2xl p-7 mb-10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center shrink-0">
                        <div className="text-5xl font-bold text-yellow-400">
                            {retentionRate}%+
                        </div>
                        <div className="text-gray-300 text-sm mt-1">
                            Annual Client Retention
                        </div>
                    </div>
                    <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
                        <p className="text-gray-200 leading-relaxed text-sm">
                            When you choose our service, you gain a dedicated
                            transportation consultant who learns your
                            preferences, anticipates your needs, and ensures
                            consistent quality trip after trip — building a
                            long-term partnership rather than a transactional
                            relationship.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
                    <p className="text-blue-900 font-semibold mb-1">
                        Experience the Professional Difference
                    </p>
                    <p className="text-blue-800 text-sm mb-4">
                        Join thousands of satisfied organizations who trust us
                        with their most important group transportation needs.
                    </p>
                    <a
                        href={ctaHref}
                        className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Start Your Reservation Today
                    </a>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
