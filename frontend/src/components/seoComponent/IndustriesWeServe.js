import React, { useState } from "react";

const DEFAULT_INDUSTRIES = [
    {
        id: "corporate",
        icon: "🏢",
        title: "Corporate & Business Transportation",
        tag: "Fortune 500 trusted",
        description:
            "Fortune 500 companies and startups alike trust our corporate shuttle services for employee commuting, airport transfers, and off-site meetings. Our executive coaches feature leather seating, power outlets, and onboard WiFi — turning travel time into productive work time.",
        stats: "Up to 5,000 conference attendees",
    },
    {
        id: "education",
        icon: "🎓",
        title: "Educational Institutions & School Districts",
        tag: "99.7% on-time",
        description:
            "School administrators choose our school bus charter services for field trips, athletic competitions, and band tours because we exceed federal safety standards. Every driver undergoes rigorous background checks and meets all state Department of Education requirements.",
        stats: "200,000+ students transported annually",
    },
    {
        id: "religious",
        icon: "⛪",
        title: "Religious Organizations & Faith Communities",
        tag: "Non-profit friendly",
        description:
            "Churches, synagogues, and mosques rely on our religious group transportation for retreats, mission trips, and weekly services. We offer flexible payment options for non-profits, including tax-exempt billing and accessible vehicles for all ages and mobility levels.",
        stats: "Tax-exempt billing available",
    },
    {
        id: "sports",
        icon: "🏆",
        title: "Sports Teams & Athletic Programs",
        tag: "Equipment storage",
        description:
            "From youth soccer leagues to professional athletic organizations, our sports team transportation includes under-bus storage for equipment, trailer hitches for gear, and extended seating for tall athletes. We coordinate complex multi-city tournament schedules.",
        stats: "Real-time GPS for coaches & parents",
    },
    {
        id: "wedding",
        icon: "💍",
        title: "Wedding & Event Planners",
        tag: "Elegant coaches",
        description:
            "Create seamless guest experiences with our wedding shuttle services. We coordinate with venues and hotels to manage parking limitations and ensure safe transportation for celebrations — keeping your wedding party together with designated driver peace of mind.",
        stats: "Minibuses to luxury coaches",
    },
    {
        id: "airport",
        icon: "✈️",
        title: "Airport & Cruise Transfers",
        tag: "Flight monitoring",
        description:
            "Our airport charter bus services eliminate the stress of group arrivals and departures. We monitor flight times in real-time, adjust for delays without additional charges, and provide meet-and-greet services at major hubs including LAX, JFK, ORD, and ATL.",
        stats: "Major hubs: LAX, JFK, ORD, ATL",
    },
];

const IndustriesWeServe = ({
    yearsExperience = 15,
    industries = DEFAULT_INDUSTRIES,
    ctaHref = "#quote-form",
}) => {
    const [selected, setSelected] = useState(industries[0]?.id || null);
    const active =
        industries.find((ind) => ind.id === selected) || industries[0];

    return (
        <section className="py-16 bg-gray-50" id="industries-served">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Industries We Serve
                </h2>
                <p className="text-gray-600 text-lg mb-10 max-w-2xl">
                    With over <strong>{yearsExperience} years</strong> of
                    experience, we understand that different industries have
                    unique transportation requirements. Select your sector
                    below.
                </p>

                {/* Industry selector */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                    {industries.map((ind) => (
                        <button
                            key={ind.id}
                            onClick={() => setSelected(ind.id)}
                            className={`text-left px-4 py-3 rounded-xl border transition-all ${
                                selected === ind.id
                                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                        >
                            <span className="text-xl mr-2">{ind.icon}</span>
                            <span className="font-medium text-sm">
                                {ind.title.split("&")[0].trim()}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Active industry detail */}
                {active && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-7 mb-10 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">{active.icon}</div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {active.title}
                                    </h3>
                                    <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                                        {active.tag}
                                    </span>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {active.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                                    <span>📊</span>
                                    <span>{active.stats}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
                    <p className="text-blue-900 font-semibold mb-1">
                        Industry-Specific Transportation Solutions
                    </p>
                    <p className="text-blue-800 text-sm mb-4">
                        Tell us about your organization's unique needs. We'll
                        create a customized plan with dedicated account
                        management.
                    </p>
                    <a
                        href={ctaHref}
                        className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Discuss Your Industry Requirements
                    </a>
                </div>
            </div>
        </section>
    );
};

export default IndustriesWeServe;
