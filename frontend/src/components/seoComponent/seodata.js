"use client";
import { useState } from "react";
import Link from "next/link";   

export default function CharterBusPage({ data, ctaHref = "#quote" }) {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeInd, setActiveInd] = useState("corporate");
    const [activeReg, setActiveReg] = useState("ne");

    // Use data from props or fallback to defaults
    const pageData = data || {};
    const guideData = pageData.guide || {};
    const coverageData = pageData.coverage || {};
    const faqData = (pageData && pageData.faq) ? pageData.faq : {};

    const ind = [
        { id: "corporate", label: "Corporate", title: "Corporate & Business Transportation", tag: "Fortune 500 trusted", desc: "Executive coaches with leather seating, power outlets, and WiFi turn travel time into productive work time." },
        { id: "education", label: "Education", title: "Schools & Educational Institutions", tag: "99.7% on-time", desc: "Every driver is CDL-P certified and passes rigorous background checks meeting state DOE requirements." },
        { id: "wedding", label: "Weddings", title: "Wedding & Event Transportation", tag: "Elegant coaches", desc: "Seamless guest shuttles between ceremony, reception, and hotel." },
        { id: "sports", label: "Sports", title: "Sports Teams & Athletic Programs", tag: "Equipment storage", desc: "Under-bus storage, trailer hitches, extended-legroom seating, and real-time GPS." },
        { id: "religious", label: "Religious", title: "Religious & Community Groups", tag: "Non-profit billing", desc: "Tax-exempt billing, flexible payment terms, and accessible vehicles." },
        { id: "airport", label: "Airport", title: "Airport & Cruise Port Transfers", tag: "Flight monitoring", desc: "Real-time flight tracking with automatic delay adjustments at no charge." },
    ].find((i) => i.id === activeInd) || {};

    const regions = [
        { id: "ne", name: "Northeast", cities: ["New York City", "Boston", "Philadelphia", "Washington D.C.", "Baltimore"] },
        { id: "se", name: "Southeast", cities: ["Atlanta", "Miami", "Orlando", "Charlotte", "Nashville"] },
        { id: "tx", name: "Texas", cities: ["Dallas", "Houston", "Austin", "San Antonio"] },
        { id: "wc", name: "West Coast", cities: ["Los Angeles", "San Francisco", "Seattle", "Portland"] },
        { id: "mw", name: "Midwest", cities: ["Chicago", "Detroit", "Minneapolis", "Cleveland"] },
    ];

    const reg = regions.find((r) => r.id === activeReg) || {};
    const regionCities = coverageData.regions || reg.cities || [];

    const faqItems = Array.isArray(faqData?.items) ? faqData.items.filter(item => item && (item.q || item.question)) : [];
    const faqs = faqItems.length > 0 ? faqItems : [
        { q: "How much does a charter bus rental cost?", a: "Charter bus costs typically range from $125–$180 per hour for local trips." },
        { q: "How far in advance should I book a charter bus?", a: "We recommend booking 3–6 months ahead for peak seasons." },
        { q: "What size charter bus do I need?", a: "A minibus (18–28 seats) suits smaller groups. A mid-size coach (35–40 seats) handles most trips." },
        { q: "Are your drivers licensed and background-checked?", a: "All drivers hold CDL-P endorsements and undergo federal background checks." },
        { q: "Do charter buses have WiFi and restrooms?", a: "All full-size motorcoaches include onboard restrooms, climate control, and reclining seats." },
        { q: "What is your cancellation policy?", a: "Cancellations 48 hours or more before departure receive a full refund." },
        { q: "Can you handle multi-city or interstate travel?", a: "Yes — DOT-registered for full interstate commerce across all 50 states." },
    ];

    const heroHeading = pageData.hero?.heading || "Affordable Charter Bus Rentals";
    const heroSubtext = pageData.hero?.subtext || "From coast to coast, transparent group transportation with no hidden fees.";
    const guideHeading = guideData.heading || "Complete Guide to Charter Bus Rentals in the USA";
    const guideSubtext = guideData.subtext || "Everything you need to know before booking — from pricing and sizing to what questions to ask.";
    const guideBody = guideData.bodyHtml || "";
    const coverageHeading = coverageData.heading || "Nationwide Charter Bus Coverage";
    const coverageSubtext = coverageData.subtext || "All 50 states — major metro hubs to rural destinations.";
    const coverageCallout = coverageData.callout || "";
    const faqHeading = faqData.heading || "Frequently Asked Questions";
    const faqSubtext = faqData.subtext || "Everything you need to know about charter bus rentals.";
    const faqTag = faqData.tag || "FAQ";

    return (
        <main className="max-w-4xl mx-auto px-6">
            {/* ── 1. HERO / AFFORDABLE ───────────────────────────────────── */}
            <section
                id="affordable-charter-bus-rentals"
                className="pt-20 pb-16"
            >
                <span className="inline-flex items-center px-2.5 py-0.5 border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-widest uppercase rounded-sm">
                    Serving all 50 states
                </span>

                <h1 className="mt-5 mb-5 text-4xl sm:text-5xl font-extrabold leading-tight text-zinc-900 max-w-2xl">
                    {heroHeading}
                    <span className="text-blue-700">
                        Without Compromising Comfort
                    </span>
                </h1>

                <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mb-12">
                    {heroSubtext}
                </p>
            </section>

            <hr className="border-t border-zinc-200 my-0" />

            {/* ── 2. GUIDE ───────────────────────────────────────────────── */}
            <section id="charter-bus-rental-guide" className="py-16">
                <span className="inline-flex items-center px-2.5 py-0.5 border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-widest uppercase rounded-sm">
                    Buyer's Guide
                </span>
                <h2 className="mt-4 mb-2.5 text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-tight">
                    {guideHeading}
                </h2>
                <p className="text-zinc-500 text-base max-w-xl mb-8 leading-relaxed">
                    {guideSubtext}
                </p>

                {guideBody && (
                    <div
                        className="text-zinc-500 text-base leading-relaxed mb-8 max-w-2xl"
                        dangerouslySetInnerHTML={{ __html: guideBody }}
                    />
                )}

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

            <hr className="border-t border-zinc-200 my-0" />

            {/* ── 4. COVERAGE ────────────────────────────────────────────── */}
            <section id="nationwide-charter-bus-coverage" className="py-16">
                <span className="inline-flex items-center px-2.5 py-0.5 border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-widest uppercase rounded-sm">
                    Service Map
                </span>
                <h2 className="mt-4 mb-2.5 text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-tight">
                    Nationwide Charter Bus Coverage
                </h2>
                <p className="text-zinc-500 text-base max-w-xl mb-12 leading-relaxed">
                    {coverageSubtext}
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
                    {(coverageData.regions || regions).map((r) => (
                        <button
                            key={r.id || r.name}
                            onClick={() => setActiveReg(r.id || r.name)}
                            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all
                ${activeReg === (r.id || r.name) ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
                        >
                            {r.name}
                        </button>
                    ))}
                </div>

                {regionCities && (
                    <div className="flex flex-wrap gap-2 mb-12">
                        {(Array.isArray(regionCities)
                            ? regionCities
                            : regionCities.cities || []
                        ).map((city, i) => (
                            <span
                                key={i}
                                className="text-sm text-zinc-500 bg-zinc-100 px-4 py-1.5 rounded-full"
                            >
                                {typeof city === "string"
                                    ? city
                                    : city.name || city}
                            </span>
                        ))}
                    </div>
                )}

                {coverageCallout && (
                    <div className="bg-zinc-50 border-l-[3px] border-blue-700 rounded px-6 py-5 mb-10">
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            {coverageCallout}
                        </p>
                    </div>
                )}
            </section>

            <hr className="border-t border-zinc-200 my-0" />

            {/* ── 6. FAQ ─────────────────────────────────────────────────── */}
            <section id="charter-bus-faq" className="py-16 pb-24">
                <span className="inline-flex items-center px-2.5 py-0.5 border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-widest uppercase rounded-sm">
                    {faqTag}
                </span>
                <h2 className="mt-4 mb-2.5 text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-tight">
                    {faqHeading}
                </h2>
                <p className="text-zinc-500 text-base max-w-xl mb-12 leading-relaxed">
                    {faqSubtext}
                </p>

                <div itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq, i) => (
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
                                <span itemProp="name">
                                    {faq.q || faq.question}
                                </span>
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
                                    <span itemProp="text">
                                        {faq.a || faq.answer}
                                    </span>
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
                    <Link
                        href={ctaHref}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        Get a Custom Quote →
                    </Link>
                </div>
            </section>
        </main>
    );
}
