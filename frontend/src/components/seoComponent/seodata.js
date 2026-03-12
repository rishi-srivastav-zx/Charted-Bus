"use client";
import { useState } from "react";

const FEATURES = [
    {
        icon: "🪑",
        title: "Reclining High-Back Seats",
        desc: "Ergonomic 45° recline with memory foam cushioning and adjustable headrests for journeys of any length.",
    },
    {
        icon: "❄️",
        title: "Dual-Zone Climate Control",
        desc: "HEPA-filtered HVAC with individual air vents. Rapid cool-down keeps every seat comfortable on hot boarding days.",
    },
    {
        icon: "📺",
        title: "4K Entertainment Systems",
        desc: "Flat-screen displays with HDMI, surround sound, DVD players, and PA systems for presentations or movies.",
    },
    {
        icon: "📶",
        title: "5G WiFi & USB-C Charging",
        desc: "Complimentary 5G hotspot with unlimited data and fast-charge USB-C ports at every seat.",
    },
    {
        icon: "🚻",
        title: "Onboard Restrooms",
        desc: "Full-size lavatories with touchless fixtures on all full-size coaches. No unplanned stops.",
    },
];

const INDUSTRIES = [
    {
        id: "corporate",
        label: "Corporate",
        title: "Corporate & Business Transportation",
        tag: "Fortune 500 trusted",
        desc: "Executive coaches with leather seating, power outlets, and WiFi turn travel time into productive work time. We handle employee commutes, airport transfers, conference shuttles, and off-site retreats.",
    },
    {
        id: "education",
        label: "Education",
        title: "Schools & Educational Institutions",
        tag: "99.7% on-time",
        desc: "Every driver is CDL-P certified and passes rigorous background checks meeting state DOE requirements. Trusted for field trips, athletic competitions, band tours, and campus visits.",
    },
    {
        id: "wedding",
        label: "Weddings",
        title: "Wedding & Event Transportation",
        tag: "Elegant coaches",
        desc: "Seamless guest shuttles between ceremony, reception, and hotel. We coordinate with venues so you focus on the celebration, not the logistics.",
    },
    {
        id: "sports",
        label: "Sports",
        title: "Sports Teams & Athletic Programs",
        tag: "Equipment storage",
        desc: "Under-bus storage, trailer hitches, extended-legroom seating, and real-time GPS for coaches and parents. Multi-city tournament schedules handled end-to-end.",
    },
    {
        id: "religious",
        label: "Religious",
        title: "Religious & Community Groups",
        tag: "Non-profit billing",
        desc: "Tax-exempt billing, flexible payment terms, and accessible vehicles for churches, synagogues, mosques, and senior centers.",
    },
    {
        id: "airport",
        label: "Airport",
        title: "Airport & Cruise Port Transfers",
        tag: "Flight monitoring",
        desc: "Real-time flight tracking with automatic delay adjustments at no charge. Meet-and-greet at LAX, JFK, ORD, and ATL.",
    },
];

const REGIONS = [
    {
        id: "ne",
        name: "Northeast",
        cities: [
            "New York City",
            "Boston",
            "Philadelphia",
            "Washington D.C.",
            "Baltimore",
        ],
    },
    {
        id: "se",
        name: "Southeast",
        cities: ["Atlanta", "Miami", "Orlando", "Charlotte", "Nashville"],
    },
    {
        id: "tx",
        name: "Texas",
        cities: ["Dallas", "Houston", "Austin", "San Antonio"],
    },
    {
        id: "wc",
        name: "West Coast",
        cities: ["Los Angeles", "San Francisco", "Seattle", "Portland"],
    },
    {
        id: "mw",
        name: "Midwest",
        cities: ["Chicago", "Detroit", "Minneapolis", "Cleveland"],
    },
];

const ADVANTAGES = [
    {
        icon: "🪪",
        title: "CDL Certified Drivers",
        desc: "All operators hold CDL-P credentials with annual recertification and 12+ years average experience.",
    },
    {
        icon: "📞",
        title: "24/7 Live Dispatch",
        desc: "Real humans answer every call — no automated menus when you need immediate help.",
    },
    {
        icon: "⚡",
        title: "2-Hour Binding Quotes",
        desc: "Detailed, binding quotes that eliminate surprise surcharges before you commit.",
    },
    {
        icon: "🛡️",
        title: "$5M Liability Insurance",
        desc: "Full cargo protection on every trip — coverage basic operators cannot match.",
    },
    {
        icon: "🌱",
        title: "Sustainability Commitment",
        desc: "Carbon offsets, idle-reduction policies, and active investment in electric motorcoach technology.",
    },
];

const FAQS = [
    {
        q: "How much does a charter bus rental cost?",
        a: "Charter bus costs typically range from $125–$180 per hour for local trips. A 40-passenger coach for a full day generally runs $800–$1,400 depending on distance and amenities. Per-person costs consistently beat driving or rideshare when split among passengers.",
    },
    {
        q: "How far in advance should I book a charter bus?",
        a: "We recommend booking 3–6 months ahead for peak seasons (May–September, December) and major events. For off-peak travel, 4–6 weeks is usually sufficient. Last-minute bookings within 1–2 weeks are possible — contact us directly for urgent requests.",
    },
    {
        q: "What size charter bus do I need?",
        a: "Our fleet covers 18 to 56 passengers. A minibus (18–28 seats) suits smaller groups. A mid-size coach (35–40 seats) handles most corporate and school trips. A full-size motorcoach (55–56 seats) is the most cost-efficient for large groups.",
    },
    {
        q: "Are your drivers licensed and background-checked?",
        a: "All drivers hold CDL-P endorsements and undergo federal background checks, annual drug testing, and safety recertification. Our drivers average 12+ years of professional experience. Driver profiles are provided 48 hours before your trip.",
    },
    {
        q: "Do charter buses have WiFi and restrooms?",
        a: "All full-size motorcoaches include onboard restrooms, climate control, and reclining seats. WiFi and USB charging are standard on coaches 2021 and newer. Entertainment and PA systems are available on request.",
    },
    {
        q: "What is your cancellation policy?",
        a: "Cancellations 48 hours or more before departure receive a full refund. Within 48 hours may incur a partial fee. Free rescheduling up to 24 hours before departure, subject to availability.",
    },
    {
        q: "Can you handle multi-city or interstate travel?",
        a: "Yes — DOT-registered for full interstate commerce across all 50 states. For trips over 500 miles we use driver rotation protocols compliant with HOS regulations. Our ops team manages permitting, fuel stops, and meal breaks.",
    },
    {
        q: "Do you offer ADA-accessible coaches?",
        a: "Yes. We maintain ADA-compliant vehicles with wheelchair lifts, securement systems, and priority seating. Please indicate accessibility needs when booking. All drivers receive ADA accommodation training.",
    },
];

const HR = () => <hr className="border-t border-zinc-200 my-0" />;

const Tag = ({ children }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-widest uppercase rounded-sm">
        {children}
    </span>
);

const CtaBtn = ({ href, children, amber }) => (
    <a
        href={href}
        className={`inline-block px-7 py-3.5 rounded text-sm font-semibold tracking-wide transition-all hover:-translate-y-px
      ${amber ? "bg-amber-400 text-zinc-900 hover:bg-amber-500" : "bg-blue-700 text-white hover:bg-blue-800"}`}
    >
        {children}
    </a>
);

export default function CharterBusPage({ ctaHref = "#quote" }) {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeInd, setActiveInd] = useState("corporate");
    const [activeReg, setActiveReg] = useState("ne");

    const ind = INDUSTRIES.find((i) => i.id === activeInd);
    const reg = REGIONS.find((r) => r.id === activeReg);

    return (
        <main className="max-w-4xl mx-auto px-6">
            {/* ── 1. HERO / AFFORDABLE ───────────────────────────────────── */}
            <section
                id="affordable-charter-bus-rentals"
                className="pt-20 pb-16"
            >
                <Tag>Serving all 50 states</Tag>

                <h1 className="mt-5 mb-5 text-4xl sm:text-5xl font-extrabold leading-tight text-zinc-900 max-w-2xl">
                    Affordable Charter Bus Rentals{" "}
                    <span className="text-blue-700">
                        Without Compromising Comfort
                    </span>
                </h1>

                <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mb-12">
                    From coast to coast, transparent group transportation with
                    no hidden fuel surcharges or driver gratuity surprises.
                    Per-person costs consistently beat driving or rideshare.
                </p>

                {/* Features list */}
                {/* <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 mb-0">
                    Standard on every coach
                </p>
                {FEATURES.map((f, i) => (
                    <div
                        key={i}
                        className={`flex gap-8 py-7 border-t border-zinc-200 ${i === FEATURES.length - 1 ? "border-b" : ""}`}
                    >
                        <span className="text-2xl w-9 shrink-0">{f.icon}</span>
                        <div>
                            <h4 className="font-semibold text-sm text-zinc-900 mb-1">
                                {f.title}
                            </h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))} */}

                {/* Stats */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 my-14">
                    {[
                        {
                            v: "98.5%",
                            l: "Customer Satisfaction",
                            s: "10,000+ completed trips",
                        },
                        {
                            v: "24/7",
                            l: "Live Dispatch",
                            s: "Real humans, no menus",
                        },
                        {
                            v: "99.7%",
                            l: "On-Time Rate",
                            s: "All scheduled departures",
                        },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="before:block before:w-7 before:h-0.5 before:bg-blue-700 before:mb-3"
                        >
                            <p className="text-4xl font-extrabold text-zinc-900">
                                {s.v}
                            </p>
                            <p className="text-xs font-semibold text-zinc-900 mt-1.5">
                                {s.l}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                {s.s}
                            </p>
                        </div>
                    ))}
                </div> */}
            </section>

            <HR />

            {/* ── 2. GUIDE ───────────────────────────────────────────────── */}
            <section id="charter-bus-rental-guide" className="py-16">
                <Tag>Buyer's Guide</Tag>
                <h2 className="mt-4 mb-2.5 text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-tight">
                    Complete Guide to Charter Bus Rentals in the USA
                </h2>
                <p className="text-zinc-500 text-base max-w-xl mb-8 leading-relaxed">
                    Everything you need to know before booking — from pricing
                    and sizing to what questions to ask.
                </p>

                <p className="text-zinc-500 text-base leading-relaxed mb-8 max-w-2xl">
                    Booking a{" "}
                    <strong className="text-zinc-800">
                        charter bus rental
                    </strong>{" "}
                    is straightforward when you know the process. Start{" "}
                    <strong className="text-zinc-800">3–6 months</strong> in
                    advance for peak seasons. Local charters range from{" "}
                    <strong className="text-zinc-800">$125–$180/hour</strong>;
                    long-distance trips are priced by mileage or day rate.
                    Always verify DOT registration, FMCSA safety ratings, and
                    insurance before committing to any operator.
                </p>

                <h3 className="text-lg font-bold text-zinc-900 border-t border-zinc-200 pt-8 mb-0">
                    Trip Types We Specialize In
                </h3>
                {[
                    {
                        title: "Corporate Events & Business Travel",
                        desc: "Employee shuttles, conference transport, and team retreats with WiFi-equipped coaches and dedicated account management.",
                    },
                    {
                        title: "Wedding & Special Occasion Transport",
                        desc: "Guest shuttles, bachelorette party buses, and rehearsal dinner coordination between venues and hotels.",
                    },
                    {
                        title: "Educational & School Trips",
                        desc: "Field trips, campus tours, and athletic events with CDL-P certified, background-checked drivers.",
                    },
                    {
                        title: "Sports Teams & Fan Transportation",
                        desc: "Professional team travel, youth tournaments, and tailgate party buses with equipment storage included.",
                    },
                    {
                        title: "Religious & Community Outings",
                        desc: "Church retreats, mission trips, and senior center excursions with accessible vehicles and non-profit billing.",
                    },
                ].map((t, i) => (
                    <div key={i} className="border-b border-zinc-200 py-5">
                        <p className="font-semibold text-sm text-zinc-900 mb-1">
                            {t.title}
                        </p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {t.desc}
                        </p>
                    </div>
                ))}
            </section>

            <HR />

            {/* ── 4. COVERAGE ────────────────────────────────────────────── */}
            <section id="nationwide-charter-bus-coverage" className="py-16">
                <Tag>Service Map</Tag>
                <h2 className="mt-4 mb-2.5 text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-tight">
                    Nationwide Charter Bus Coverage
                </h2>
                <p className="text-zinc-500 text-base max-w-xl mb-12 leading-relaxed">
                    All 50 states — major metro hubs to rural destinations.
                    Consistent quality, coast to coast.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 mb-12">
                    {[
                        {
                            icon: "📋",
                            t: "DOT-Registered Carrier",
                            d: "Licensed for full interstate commerce across all 50 states.",
                        },
                        {
                            icon: "🔄",
                            t: "Driver Rotation Protocols",
                            d: "Safe driver changes on 500+ mile trips without delays.",
                        },
                        {
                            icon: "🌎",
                            t: "International Coverage",
                            d: "Border crossings into Canada and Mexico transport partnerships.",
                        },
                        {
                            icon: "🗺️",
                            t: "Route Optimization",
                            d: "HOS compliance, permitting, and fuel/meal stop planning included.",
                        },
                    ].map((cap, i) => (
                        <div
                            key={i}
                            className="flex gap-3.5 py-6 border-b border-zinc-200"
                        >
                            <span className="text-lg mt-0.5">{cap.icon}</span>
                            <div>
                                <p className="font-semibold text-sm text-zinc-900 mb-1">
                                    {cap.t}
                                </p>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {cap.d}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-lg font-bold text-zinc-900 mb-4">
                    Major Service Areas
                </h3>
                <div className="flex flex-wrap gap-2 mb-5">
                    {REGIONS.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setActiveReg(r.id)}
                            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all
                ${activeReg === r.id ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
                        >
                            {r.name}
                        </button>
                    ))}
                </div>

                {reg && (
                    <div className="flex flex-wrap gap-2 mb-12">
                        {reg.cities.map((city, i) => (
                            <span
                                key={i}
                                className="text-sm text-zinc-500 bg-zinc-100 px-4 py-1.5 rounded-full"
                            >
                                {city}
                            </span>
                        ))}
                    </div>
                )}

                <div className="bg-zinc-50 border-l-[3px] border-blue-700 rounded px-6 py-5 mb-10">
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        We've moved{" "}
                        <strong className="text-zinc-800">
                            10,000+ attendees
                        </strong>{" "}
                        for events including SXSW, CES, and NCAA Tournaments.
                        For trips exceeding{" "}
                        <strong className="text-zinc-800">500 miles</strong>,
                        driver rotation and HOS-compliant protocols ensure
                        safety without delays.
                    </p>
                </div>
            </section>

            <HR />

            {/* ── 6. FAQ ─────────────────────────────────────────────────── */}
            <section id="charter-bus-faq" className="py-16 pb-24">
                <Tag>FAQ</Tag>
                <h2 className="mt-4 mb-2.5 text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-tight">
                    Frequently Asked Questions
                </h2>
                <p className="text-zinc-500 text-base max-w-xl mb-12 leading-relaxed">
                    Everything you need to know about charter bus rentals,
                    pricing, sizing, and our process.
                </p>

                <div itemScope itemType="https://schema.org/FAQPage">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className="border-b border-zinc-200"
                            itemScope
                            itemProp="mainEntity"
                            itemType="https://schema.org/Question"
                        >
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === i ? null : i)
                                }
                                aria-expanded={openFaq === i}
                                className="w-full flex justify-between items-center py-5 text-left gap-4 text-base font-medium text-zinc-900 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer"
                            >
                                <span itemProp="name">{faq.q}</span>
                                <span className="text-xl text-zinc-300 font-light shrink-0 leading-none">
                                    {openFaq === i ? "−" : "+"}
                                </span>
                            </button>
                            {openFaq === i && (
                                <div
                                    className="pb-5 text-sm text-zinc-500 leading-relaxed"
                                    itemScope
                                    itemProp="acceptedAnswer"
                                    itemType="https://schema.org/Answer"
                                >
                                    <span itemProp="text">{faq.a}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-14 pt-10 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <p className="text-xl font-bold text-zinc-900 mb-1.5">
                            Still have questions?
                        </p>
                        <p className="text-sm text-zinc-400">
                            Our specialists respond within 2 hours.
                        </p>
                    </div>
                    <CtaBtn href={ctaHref}>Get a Custom Quote →</CtaBtn>
                </div>
            </section>
        </main>
    );
}
