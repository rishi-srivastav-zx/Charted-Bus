"use client";
import React, { useState, useEffect } from "react";
import {
    CheckCircle2,
    Bus,
    Users,
    Globe,
    Route,
    Armchair,
    Briefcase,
    Heart,
    GraduationCap,
    Trophy,
    Church,
    Camera,
    Phone,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Star,
    Shield,
    Clock,
    Zap,
    Award,
    ThumbsUp,
    Wifi,
    Wind,
    Volume2,
    Battery,
    Coffee,
    ShieldCheck,
    CreditCard,
    Headphones,
    BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBuses } from "../../../services/busservices";

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 },
    },
};

// --- Icon Map for Dynamic Services ---
const iconMap = {
    Briefcase,
    Heart,
    GraduationCap,
    Trophy,
    Church,
    Camera,
    Bus,
    Users,
    Globe,
    Route,
    Armchair,
    Star,
    Shield,
    Clock,
    Zap,
    Award,
    ThumbsUp,
    Wifi,
    Wind,
    Volume2,
    Battery,
    Coffee,
};

// --- Sub-Components ---
const SectionHeading = ({ title, subtitle, light = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 sm:mb-12 md:mb-16 px-4"
    >
        <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 ${light ? "text-white" : "text-gray-900"}`}
        >
            {title}
        </h2>
        {subtitle && (
            <p
                className={`max-w-2xl mx-auto text-base sm:text-lg ${light ? "text-orange-100" : "text-gray-500"}`}
            >
                {subtitle}
            </p>
        )}
    </motion.div>
);

const ServiceCard = ({ icon: Icon, title, desc }) => (
    <motion.div
        variants={itemVariants}
        className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all group cursor-pointer"
    >
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-orange-500 transition-colors">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 group-hover:text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
            {title}
        </h3>
        <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {desc}
        </div>
    </motion.div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden mb-3 sm:mb-4 hover:border-orange-200 transition-colors">
        <button
            type="button"
            onClick={onClick}
            className="w-full flex justify-between items-center p-4 sm:p-6 text-left focus:outline-none"
        >
            <span className="font-bold text-gray-900 text-base sm:text-lg pr-4 line-clamp-2">
                {question}
            </span>
            <span
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}
            >
                {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                ) : (
                    <ChevronDown className="w-5 h-5" />
                )}
            </span>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="px-4 sm:px-6 pb-4 sm:pb-6"
                >
                    <div 
                        className="text-gray-600 text-sm sm:text-base leading-relaxed prose-p:mb-2"
                        dangerouslySetInnerHTML={{ __html: answer }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// --- Main Page ---
export default function CharterBusLanding({ data }) {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const toggleFaq = (index) =>
        setOpenFaqIndex(openFaqIndex === index ? -1 : index);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const [vehicles, setVehicles] = useState([]);

    // Dynamic data from database
    const pageData = data || {};
    const main = pageData.main || {};
    const hero = pageData.hero || {};
    const servicesData = pageData.services || {};
    const fleetData = pageData.fleet || {};
    const amenitiesData = pageData.amenities || {};
    const howItWorksData = pageData.howItWorks || {};
    const aboutData = pageData.whyus || {};
    const statsData = pageData.stats || {};
    const trustData = pageData.trust || {};
    const testimonialsData = pageData.testimonials || {};
    const faqData = pageData.faq || {};
    const ctaData = pageData.cta || {};

    async function fetchVehicles() {
        try {
            const res = await getAllBuses();
            return res?.data?.data ?? res?.data ?? [];
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            return [];
        }
    }

    useEffect(() => {
        async function loadData() {
            const data = await fetchVehicles();
            setVehicles(data);
        }
        loadData();
    }, []);

    // Dynamic sections
    const services = servicesData.items || [];
    const fleet = fleetData.items || vehicles.slice(0, 4);
    const amenities = amenitiesData.items || [];
    const howItWorks = howItWorksData.items || [];
    const aboutReasons = aboutData.reasons || [];
    const stats = statsData.items || [];
    const trustFeatures = trustData.items || [];
    const testimonials = testimonialsData.items || [];
    const faqs = faqData.items || [];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* ── HERO (DYNAMIC) ── */}
            <section className="max-w-7xl mx-auto pt-6 sm:pt-8 pb-12 sm:pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl h-[300px] sm:h-[400px] lg:h-[580px] group order-2 lg:order-1"
                    >
                        <img
                            src={
                                hero.heroImage ||
                                hero.image ||
                                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069"
                            }
                            alt={
                                main.title_line1 ||
                                hero.heading ||
                                "Charter Bus"
                            }
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg flex items-center gap-2 sm:gap-3">
                            <div className="bg-green-100 p-1.5 sm:p-2 rounded-full">
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">
                                    Trusted Service
                                </p>
                                <p className="text-xs sm:text-sm font-bold">
                                    500+ Groups Served
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                            ⭐ 4.9/5 Rating
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6 sm:space-y-8 order-1 lg:order-2"
                    >
                        <div>
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-orange-50 text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6">
                                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> #1
                                Rated Charter Service
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-[1.1] mb-4 sm:mb-6 text-gray-900">
                                {main.title_line1 || "Your Complete Guide to"}{" "}
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                                    {hero.heading || "Charter Bus Rental"}
                                </span>
                            </h2>
                            <div
                                className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 prose-p:mb-4"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        pageData.guide?.bodyHtml ||
                                        "Navigating the sprawl of Los Angeles is effortless when you leave the driving to us. Whether you're coordinating a multi-day corporate summit or a scenic tour, our fleet offers the perfect blend of luxury and reliability.",
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 sm:gap-y-4 sm:gap-x-8 pt-2">
                            {[
                                "24/7 Dispatch Support",
                                "Local Professional Drivers",
                                "Real-time GPS Tracking",
                                "Customizable Itineraries",
                                "All-Inclusive Pricing",
                                "Instant Online Quotes",
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-2 sm:space-x-3"
                                >
                                    <div className="bg-orange-100 rounded-full p-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <button
                                onClick={scrollToTop}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 flex items-center gap-2 text-sm sm:text-base"
                            >
                                Get a Free Quote{" "}
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
            {/* ── STATS BAR (STATIC) ── */}
            <section className="bg-orange-600 py-4 sm:py-6">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                    <div className="text-center text-white">
                        <Award className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-orange-200" />
                        <div className="text-2xl sm:text-4xl font-extrabold mb-0.5 sm:mb-1">
                            10K+
                        </div>
                        <div className="text-orange-100 text-xs sm:text-sm">
                            Happy Travelers
                        </div>
                    </div>
                    <div className="text-center text-white">
                        <Bus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-orange-200" />
                        <div className="text-2xl sm:text-4xl font-extrabold mb-0.5 sm:mb-1">
                            500+
                        </div>
                        <div className="text-orange-100 text-xs sm:text-sm">
                            Routes Covered
                        </div>
                    </div>
                    <div className="text-center text-white">
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-orange-200" />
                        <div className="text-2xl sm:text-4xl font-extrabold mb-0.5 sm:mb-1">
                            99%
                        </div>
                        <div className="text-orange-100 text-xs sm:text-sm">
                            Safety Rating
                        </div>
                    </div>
                    <div className="text-center text-white">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-orange-200" />
                        <div className="text-2xl sm:text-4xl font-extrabold mb-0.5 sm:mb-1">
                            24/7
                        </div>
                        <div className="text-orange-100 text-xs sm:text-sm">
                            Support Available
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TRUST BAR (STATIC) ── */}
            <section className="bg-white py-8 sm:py-12 md:py-16 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-6 sm:gap-12 md:gap-20">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-orange-50 rounded-xl">
                            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase">
                            Secure Booking
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-orange-50 rounded-xl">
                            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase">
                            Easy Payments
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-orange-50 rounded-xl">
                            <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase">
                            24/7 Support
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-orange-50 rounded-xl">
                            <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase">
                            Verified Operators
                        </span>
                    </div>
                </div>
            </section>

            {/* ── ABOUT SECTION (DYNAMIC) ── */}
            {aboutData && (
                <section className="py-16 sm:py-20 md:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
                            {/* Left Column - Sticky on Desktop */}
                            <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                    {aboutData.heading ||
                                        "Why Groups Choose Us Over the Competition"}
                                </h2>
                                <div
                                    className="text-gray-600 text-base sm:text-lg prose-p:mb-4"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            aboutData.mainContent ||
                                            aboutData.subtext ||
                                            "Los Angeles is one of the most complex cities to navigate. Our dispatchers are LA natives who know every shortcut and construction detour.",
                                    }}
                                />
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 sm:pt-4">
                                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl p-3 sm:p-4">
                                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                                        <div>
                                            <div className="font-bold text-sm sm:text-base">
                                                Safety First
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500">
                                                Verified operators & secure
                                                bookings
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl p-3 sm:p-4">
                                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                                        <div>
                                            <div className="font-bold text-sm sm:text-base">
                                                24/7 Support
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500">
                                                Round-the-clock customer
                                                assistance
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Scrollable Cards */}
                            {aboutData.reasons &&
                                aboutData.reasons.length > 0 && (
                                    <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-100">
                                        {aboutData.reasons.map((reason, i) => (
                                            <div
                                                key={i}
                                                className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300"
                                            >
                                                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 text-gray-900">
                                                    {reason.title}
                                                </h3>
                                                <div
                                                    className="text-gray-600 text-sm sm:text-base"
                                                    dangerouslySetInnerHTML={{
                                                        __html: reason.body,
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>
                </section>
            )}
            
            {/* ── SERVICES GRID (DYNAMIC) ── */}
            {services.length > 0 && (
                <section className="bg-gray-50 py-16 sm:py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <SectionHeading
                            title={
                                servicesData.heading ||
                                "Tailored Transportation for Every Occasion"
                            }
                            subtitle="We specialize in making every journey comfortable, efficient, and memorable."
                        />
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
                        >
                            {services.map((service, idx) => {
                                const IconComponent =
                                    typeof service.icon === "string"
                                        ? iconMap[service.icon] || Briefcase
                                        : service.icon || Briefcase;
                                return (
                                    <ServiceCard
                                        key={idx}
                                        icon={IconComponent}
                                        title={service.title || "Service"}
                                        desc={
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        service.description ||
                                                        service.desc ||
                                                        "",
                                                }}
                                            />
                                        }
                                    />
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── HOW IT WORKS (STATIC - ENHANCED) ── */}
            <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white to-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
                        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs sm:text-sm font-semibold rounded-full mb-4">
                            Simple Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            How It{" "}
                            <span className="text-orange-500">Works</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            From first contact to final drop-off, we've
                            streamlined every step for your convenience
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
                        {/* Connector Line - Desktop Only */}
                        <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />

                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-300 h-full">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-6 text-2xl sm:text-3xl font-black shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    01
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        Choose Your Route
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        Browse and select from 500+ available
                                        routes across the country with real-time
                                        availability
                                    </p>
                                </div>
                                {/* Mobile Arrow */}
                                <div className="md:hidden flex justify-center mt-6">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-orange-500 rotate-90"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-300 h-full">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-6 text-2xl sm:text-3xl font-black shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    02
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        Book Your Seat
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        Secure your booking with our easy
                                        payment options and instant confirmation
                                        via email & SMS
                                    </p>
                                </div>
                                {/* Mobile Arrow */}
                                <div className="md:hidden flex justify-center mt-6">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-orange-500 rotate-90"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-300 h-full">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-6 text-2xl sm:text-3xl font-black shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    03
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        Travel With Ease
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        Board your bus and enjoy a comfortable
                                        journey with premium amenities and 24/7
                                        support
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FLEET SECTION (DYNAMIC) ── */}
            {(fleet.length > 0 || vehicles.length > 0) && (
                <section className="bg-gray-900 py-16 sm:py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <SectionHeading
                            light
                            title={
                                fleetData.heading || "Explore Our Modern Fleet"
                            }
                            subtitle="Every vehicle is less than 5 years old and equipped with the amenities your group deserves."
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                            {(fleet.length > 0
                                ? fleet
                                : vehicles.slice(0, 4)
                            ).map((bus, i) => (
                                <motion.div
                                    key={bus._id || bus.id || i}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-100 transition-all hover:shadow-2xl group"
                                >
                                    <div className="h-40 sm:h-48 overflow-hidden">
                                        <img
                                            src={bus.image}
                                            alt={bus.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                                            {bus.name}
                                        </h3>
                                        <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4">
                                            {bus.category}
                                        </p>
                                        <div className="flex items-center gap-2 text-orange-500 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                                            <Users
                                                size={14}
                                                className="sm:size-4"
                                            />{" "}
                                            {bus.seatCapacity} seats
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {bus.features
                                                ?.slice(0, 3)
                                                .map((f, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded"
                                                    >
                                                        {f.name || f}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── AMENITIES (DYNAMIC) ── */}
            {amenities.length > 0 && (
                <section className="py-16 sm:py-20 md:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <SectionHeading
                            title={
                                amenitiesData.heading ||
                                "Every Amenity Your Group Needs"
                            }
                            subtitle="Our modern fleet comes equipped with the features that keep passengers comfortable."
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {amenities.map((item, i) => {
                                const IconComponent =
                                    iconMap[item.icon] || Wifi;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100"
                                    >
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                                                {item.label}
                                            </h3>
                                            <p className="text-gray-500 text-xs sm:text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── TESTIMONIALS (DYNAMIC) ── */}
            {testimonials.length > 0 && (
                <section className="bg-orange-50 py-16 sm:py-20 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <SectionHeading
                            title={
                                testimonialsData.heading ||
                                "What Our Clients Say"
                            }
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm"
                                >
                                    <div className="flex gap-1 mb-3 sm:mb-4">
                                        {Array.from({
                                            length: t.rating || 5,
                                        }).map((_, j) => (
                                            <Star
                                                key={j}
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 fill-orange-400"
                                            />
                                        ))}
                                    </div>
                                    <div
                                        className="text-gray-700 mb-4 sm:mb-6 italic text-sm sm:text-base"
                                        dangerouslySetInnerHTML={{
                                            __html: `"${t.text || t.description || ""}"`,
                                        }}
                                    />
                                    <div className="border-t pt-3 sm:pt-4">
                                        <div className="font-bold text-sm sm:text-base">
                                            {t.name || "Client"}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            {t.role || t.title}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── FAQ (DYNAMIC) ── */}
            {faqs.length > 0 && (
                <section className="py-16 sm:py-20 md:py-24">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <SectionHeading
                            title={
                                faqData.heading || "Frequently Asked Questions"
                            }
                        />
                        {faqs.map((faqItem, idx) => (
                            <FAQItem
                                key={idx}
                                question={faqItem.q || faqItem.question || ""}
                                answer={faqItem.a || faqItem.answer || ""}
                                isOpen={openFaqIndex === idx}
                                onClick={() => toggleFaq(idx)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA (DYNAMIC) ── */}
            <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 lg:p-24 text-center text-white shadow-2xl overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-center justify-center"
                        style={{
                            backgroundImage: `url('${ctaData.image || "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071"}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 backdrop-blur-md bg-black/60" />
                        <div className="relative z-10 max-w-3xl mx-auto px-2">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
                                {ctaData.heading ||
                                    "Still planning your group trip?"}
                            </h2>
                            <div
                                className="text-gray-200 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        ctaData.body ||
                                        "Our travel experts are ready to help you find the perfect vehicle at the best rate.",
                                }}
                            />
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                                <button
                                    onClick={scrollToTop}
                                    className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-orange-600 font-bold rounded-full shadow-xl hover:bg-gray-50 text-base sm:text-lg w-full sm:w-auto"
                                >
                                    {ctaData.buttonText || "Get a Free Quote"}
                                </button>
                                <button className="px-8 sm:px-12 py-4 sm:py-5 bg-orange-700/80 backdrop-blur-sm text-white font-bold rounded-full hover:bg-orange-800 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                                    {ctaData.phone || "Call (800) 555-0199"}
                                </button>
                            </div>
                            <p className="text-gray-300 text-xs sm:text-sm mt-6 sm:mt-10">
                                {ctaData.footer ||
                                    "Available 24/7 · No obligation · Response within 2 hours"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER (DYNAMIC) ── */}
            <footer className="bg-gray-900 text-gray-400 py-12 sm:py-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                        <div className="col-span-1 sm:col-span-2">
                            <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                                {pageData.footer?.brand || "CharterBus"}
                            </h3>
                            <p className="max-w-sm mb-4 sm:mb-6 text-sm sm:text-base">
                                {pageData.footer?.description ||
                                    "Providing premium group transportation services across Los Angeles and Southern California. Safe, reliable, and comfortable since 2012."}
                            </p>
                            <div className="flex gap-2 sm:gap-3">
                                {(
                                    pageData.footer?.badges || [
                                        { label: "DOT", sub: "Certified" },
                                        { label: "A+", sub: "BBB Rating" },
                                        { label: "4.9★", sub: "Google" },
                                    ]
                                ).map((badge, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-800 rounded-lg p-2 sm:p-3 text-center"
                                    >
                                        <div className="text-orange-400 font-bold text-sm sm:text-lg">
                                            {badge.label}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">
                                            {badge.sub}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {pageData.footer?.links?.map((section, i) => (
                            <div key={i}>
                                <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                                    {section.title}
                                </h4>
                                <ul className="space-y-1.5 sm:space-y-2">
                                    {section.items.map((item, j) => (
                                        <li key={j}>
                                            <a
                                                href={item.href || "#"}
                                                className="hover:text-orange-500 text-sm sm:text-base"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )) || (
                            <>
                                <div>
                                    <h4 className="text-white font-bold mb-3 sm:mb-4">
                                        Services
                                    </h4>
                                    <ul className="space-y-1.5 sm:space-y-2">
                                        {[
                                            "Corporate Travel",
                                            "Wedding Shuttles",
                                            "School Trips",
                                            "Airport Transfers",
                                            "Sports Teams",
                                            "Private Tours",
                                        ].map((s, i) => (
                                            <li key={i}>
                                                <a
                                                    href="#"
                                                    className="hover:text-orange-500 text-sm sm:text-base"
                                                >
                                                    {s}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-3 sm:mb-4">
                                        Company
                                    </h4>
                                    <ul className="space-y-1.5 sm:space-y-2">
                                        {[
                                            "About Us",
                                            "Our Fleet",
                                            "Safety Standards",
                                            "Contact",
                                            "Blog",
                                            "Careers",
                                        ].map((s, i) => (
                                            <li key={i}>
                                                <a
                                                    href="#"
                                                    className="hover:text-orange-500 text-sm sm:text-base"
                                                >
                                                    {s}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs sm:text-sm text-center sm:text-left">
                            © {new Date().getFullYear()}{" "}
                            {pageData.footer?.copyright ||
                                "Los Angeles Charter Bus Services"}
                            . All rights reserved.
                        </p>
                        <div className="flex space-x-4 sm:space-x-6">
                            {(
                                pageData.footer?.legal || [
                                    { label: "Privacy Policy", href: "#" },
                                    { label: "Terms of Service", href: "#" },
                                    { label: "Sitemap", href: "#" },
                                ]
                            ).map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="hover:text-white text-xs sm:text-sm"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
