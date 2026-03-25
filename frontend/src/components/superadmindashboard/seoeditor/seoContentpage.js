"use client";
import React, { useState,useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBuses } from "@/services/busservices";

// --- Static Data Constants (not dynamic) ---

const STATS = [
    { value: "12+", label: "Years in Business", icon: Award },
    { value: "500+", label: "Groups Served", icon: Users },
    { value: "98%", label: "On-Time Rate", icon: Clock },
    { value: "4.9★", label: "Average Rating", icon: Star },
];

const FEATURES = [
    { icon: Users, label: "PROFESSIONAL DRIVERS" },
    { icon: Bus, label: "MODERN BUS FLEET" },
    { icon: Globe, label: "NATIONWIDE COVERAGE" },
    { icon: Route, label: "FLEXIBLE ROUTES" },
    { icon: Armchair, label: "GROUP COMFORT" },
];

const FLEET = [
    {
        name: "Minibus",
        capacity: "24–35 Passengers",
        best: "Small corporate groups, airport transfers, intimate tours",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
    },
    {
        name: "Full-Size Coach",
        capacity: "45–56 Passengers",
        best: "School trips, weddings, large corporate events, concerts",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
    },
    {
        name: "Double Decker",
        capacity: "70–80 Passengers",
        best: "Large conferences, sports teams, festivals, city tours",
        image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=800&auto=format&fit=crop",
    },
];

const AMENITIES = [
    { icon: Wifi, label: "Free Wi-Fi", desc: "Stay connected on the go with high-speed internet" },
    { icon: Battery, label: "Power Outlets", desc: "USB and standard outlets at every seat" },
    { icon: Wind, label: "Climate Control", desc: "Individual air conditioning zones" },
    { icon: Volume2, label: "PA System", desc: "Built-in microphone for announcements" },
    { icon: Coffee, label: "Refreshment Area", desc: "Mini fridge and cup holders on select models" },
    { icon: Shield, label: "Safety Tech", desc: "GPS tracking, dash cams, and lane assist" },
];

const HOW_IT_WORKS = [
    { step: "01", title: "Request a Quote", desc: "Fill out our simple online form or call us directly. Tell us your destination, group size, date, and any special requirements. We respond within 2 hours." },
    { step: "02", title: "Get a Custom Plan", desc: "Our transportation specialists craft a tailored itinerary and pricing package. We'll suggest the ideal vehicle size and route to maximize comfort and value." },
    { step: "03", title: "Confirm & Relax", desc: "Review your quote, sign the agreement, and secure your booking with a deposit. We handle all the logistics — you just show up and enjoy the ride." },
];

const DEFAULT_SERVICES = [
    { icon: Briefcase, title: "Corporate Events", desc: "Impress clients and ensure your team arrives on time for conferences, meetings, and airport transfers." },
    { icon: Heart, title: "Wedding Transportation", desc: "Keep your celebration seamless with safe, elegant shuttle service between venues." },
    { icon: GraduationCap, title: "School Field Trips", desc: "Safe and educational travel for students and faculty." },
    { icon: Trophy, title: "Sports Team Travel", desc: "Spacious storage for equipment and ergonomic seating." },
    { icon: Church, title: "Religious Groups", desc: "Reliable group transit for retreats and community events." },
    { icon: Camera, title: "Private Tours", desc: "Explore the city's hidden gems with a personalized itinerary." },
];

const DEFAULT_TESTIMONIALS = [
    { name: "Sarah M.", role: "HR Director, Pacific Tech", text: "Professionalism is unmatched. Highly recommend!", rating: 5 },
    { name: "James K.", role: "Wedding Planner", text: "Transportation logistics made easy. The buses are gorgeous.", rating: 5 },
    { name: "Coach Rivera", role: "Varsity Football, Lincoln High", text: "Getting kids across town is now a non-event. Always on time.", rating: 5 },
];

const DEFAULT_FAQS = [
    { q: "How much does a charter bus rental cost?", a: "Pricing depends on several factors including bus type, travel distance, and duration. Request a free quote for a precise estimate tailored to your event." },
    { q: "How far in advance should I book my bus?", a: "We recommend booking at least 3–6 months in advance for peak seasons. However, we can often accommodate last-minute requests." },
    { q: "What amenities are included in the modern fleet?", a: "Our fleet includes reclining seats, air conditioning, Wi-Fi, power outlets, and PA systems. Specific amenities vary by vehicle size." },
    { q: "Is a professional driver included in the rental?", a: "Yes, absolutely. Every rental includes a licensed, experienced, and background-checked professional driver." },
    { q: "Can you handle multi-stop or multi-day itineraries?", a: "Absolutely. We specialize in complex logistics, including multi-stop itineraries, multi-day conferences, and tours." },
    { q: "What is your cancellation policy?", a: "We understand plans change. Cancellations made 30+ days before the trip receive a full deposit refund." },
];

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// --- Sub-Components ---
const SectionHeading = ({ title, subtitle, light = false }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? "text-white" : "text-gray-900"}`}>{title}</h2>
        {subtitle && <p className={`max-w-2xl mx-auto text-lg ${light ? "text-orange-100" : "text-gray-500"}`}>{subtitle}</p>}
    </motion.div>
);

const ServiceCard = ({ icon: Icon, title, desc }) => (
    <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all group cursor-pointer">
        <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
            <Icon className="w-7 h-7 text-orange-500 group-hover:text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden mb-4 hover:border-orange-200 transition-colors">
        <button onClick={onClick} className="w-full flex justify-between items-center p-6 text-left">
            <span className="font-bold text-gray-900 text-lg pr-4">{question}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOpen ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{answer}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// --- Main Page ---
export default function CharterBusLanding({ data }) {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? -1 : index);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const [vehicles, setVehicles] = useState([]); 

    // Dynamic data from database
    const pageData = data || {};
    const main = pageData.main || {};
    const hero = pageData.hero || {};
    const servicesData = pageData.services || {};
    const testimonialsData = pageData.testimonials || {};
    const faqData = pageData.faq || {};

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



    // Dynamic sections with fallbacks
    const services = servicesData.items?.filter(Boolean)?.length > 0 ? servicesData.items : DEFAULT_SERVICES;
    const testimonials = testimonialsData.items?.filter(Boolean)?.length > 0 ? testimonialsData.items : DEFAULT_TESTIMONIALS;
    const faqs = faqData.items?.filter(item => item && (item.q || item.question)) || DEFAULT_FAQS;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* ── HERO (DYNAMIC) ── */}
            <section className="max-w-7xl mx-auto pt-8 pb-20 lg:pt-20 lg:pb-28 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[580px] group"
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
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                                    Trusted Service
                                </p>
                                <p className="text-sm font-bold">
                                    500+ Groups Served
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-6 right-6 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ⭐ 4.9/5 Rating
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
                                <Zap className="w-4 h-4" /> #1 Rated Charter
                                Service
                            </div>
                            <h1 className="text-5xl lg:text-5xl font-extrabold leading-[1.1] mb-6 text-gray-900">
                                Your Complete Guide to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                                    {hero.heading || "Charter Bus Rental"}
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                {pageData.guide?.bodyHtml ||
                                    "Navigating the sprawl of Los Angeles is effortless when you leave the driving to us. Whether you're coordinating a multi-day corporate summit or a scenic tour, our fleet offers the perfect blend of luxury and reliability."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-2">
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
                                    className="flex items-center space-x-3"
                                >
                                    <div className="bg-orange-100 rounded-full p-1">
                                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={scrollToTop}
                                className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 flex items-center gap-2"
                            >
                                Get a Free Quote{" "}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── STATS BAR (STATIC) ── */}
            <section className="bg-orange-600 py-6">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, i) => (
                        <div key={i} className="text-center text-white">
                            <stat.icon className="w-8 h-8 mx-auto mb-2 text-orange-200" />
                            <div className="text-4xl font-extrabold mb-1">
                                {stat.value}
                            </div>
                            <div className="text-orange-100 text-sm">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TRUST BAR (STATIC) ── */}
            <section className="bg-white py-16 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-20">
                    {FEATURES.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="mb-4 p-4 bg-orange-50 rounded-2xl">
                                <feature.icon className="w-8 h-8 text-orange-500" />
                            </div>
                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                                {feature.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ABOUT SECTION (STATIC) ── */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Why Groups Choose Us Over the Competition
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Los Angeles is one of the most complex cities to
                                navigate. Our dispatchers are LA natives who
                                know every shortcut and construction detour.
                            </p>
                            <p className="text-gray-600">
                                We obsess over the experience. Our buses are
                                cleaned before every trip, drivers dress
                                professionally, and our team is reachable 24/7.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                    <Shield className="w-8 h-8 text-orange-500" />
                                    <div>
                                        <div className="font-bold">
                                            Fully Licensed & Insured
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            DOT certified, $5M coverage
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                    <ThumbsUp className="w-8 h-8 text-orange-500" />
                                    <div>
                                        <div className="font-bold">
                                            Satisfaction Guarantee
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Issues resolved or money back
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                {
                                    title: "Local Knowledge, Global Standards",
                                    body: "We know peak traffic hours and venue-specific logistics.",
                                },
                                {
                                    title: "Transparent, All-Inclusive Pricing",
                                    body: "No hidden fees. What we quote is what you pay.",
                                },
                                {
                                    title: "Flexible, Last-Minute Friendly",
                                    body: "Need to add a stop? We monitor your event and adjust.",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                                >
                                    <h3 className="text-lg font-bold mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES GRID (DYNAMIC) ── */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4">
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
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {services.map((service, idx) => {
                            const iconProp =
                                typeof service.icon === "string" ? (
                                    <span role="img" aria-label={service.title}>
                                        {service.icon}
                                    </span>
                                ) : (
                                    service.icon || Briefcase
                                );

                            return (
                                <ServiceCard
                                    key={idx}
                                    icon={
                                        typeof service.icon === "string"
                                            ? () => (
                                                  <span
                                                      role="img"
                                                      aria-label={service.title}
                                                  >
                                                      {service.icon}
                                                  </span>
                                              )
                                            : service.icon || Briefcase
                                    }
                                    title={service.title || "Service"}
                                    desc={
                                        service.description ||
                                        service.desc ||
                                        ""
                                    }
                                />
                            );
                        })}
                    </motion.div>
                </div>
            </section>
            {/* ── HOW IT WORKS (STATIC) ── */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading
                        title="How It Works"
                        subtitle="From first contact to final drop-off, we've streamlined every step."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {HOW_IT_WORKS.map((step, i) => (
                            <div key={i} className="text-center">
                                <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-extrabold">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FLEET SECTION (STATIC) ── */}
            <section className="bg-gray-900 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading
                        light
                        title="Explore Our Modern Fleet"
                        subtitle="Every vehicle is less than 5 years old and equipped with the amenities your group deserves."
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {vehicles.slice(0, 4).map((bus, i) => (
                            <motion.div
                                key={bus._id || bus.id || i}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 transition-all hover:shadow-2xl group"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={bus.image}
                                        alt={bus.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">
                                        {bus.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4">
                                        {bus.category}
                                    </p>
                                    <div className="flex items-center gap-2 text-orange-500 font-semibold mb-4">
                                        <Users size={16} /> {bus.seatCapacity}{" "}
                                        seats
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {bus.features
                                            ?.slice(0, 3)
                                            .map((f, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded"
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

            {/* ── AMENITIES (STATIC) ── */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading
                        title="Every Amenity Your Group Needs"
                        subtitle="Our modern fleet comes equipped with the features that keep passengers comfortable."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {AMENITIES.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100"
                            >
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">
                                        {item.label}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS (DYNAMIC) ── */}
            <section className="bg-orange-50 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading
                        title={
                            testimonialsData.heading || "What Our Clients Say"
                        }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="bg-white p-8 rounded-2xl shadow-sm"
                            >
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating || 5 }).map(
                                        (_, j) => (
                                            <Star
                                                key={j}
                                                className="w-5 h-5 text-orange-400 fill-orange-400"
                                            />
                                        ),
                                    )}
                                </div>
                                <p className="text-gray-700 mb-6 italic">
                                    "{t.text || t.description || ""}"
                                </p>
                                <div className="border-t pt-4">
                                    <div className="font-bold">
                                        {t.name || "Client"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {t.role || t.title}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ (DYNAMIC) ── */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-4">
                    <SectionHeading
                        title={faqData.heading || "Frequently Asked Questions"}
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

            {/* ── CTA (STATIC - DO NOT TOUCH) ── */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative rounded-[2.5rem] p-16 md:p-24 text-center text-white shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 backdrop-blur-md bg-black/60" />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-bold mb-6">
                                Still planning your group trip?
                            </h2>
                            <p className="text-gray-200 text-xl mb-12 max-w-2xl mx-auto">
                                Our travel experts are ready to help you find
                                the perfect vehicle at the best rate.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                                <button
                                    onClick={scrollToTop}
                                    className="px-12 py-5 bg-white text-orange-600 font-bold rounded-full shadow-xl hover:bg-gray-50 text-lg"
                                >
                                    Get a Free Quote
                                </button>
                                <button className="px-12 py-5 bg-orange-700/80 backdrop-blur-sm text-white font-bold rounded-full hover:bg-orange-800 text-lg flex items-center justify-center gap-3">
                                    <Phone className="w-5 h-5" /> Call (800)
                                    555-0199
                                </button>
                            </div>
                            <p className="text-gray-300 text-sm mt-10">
                                Available 24/7 · No obligation · Response within
                                2 hours
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER (STATIC - DO NOT TOUCH) ── */}
            <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-white text-2xl font-bold mb-4">
                                LA Charter Bus
                            </h3>
                            <p className="max-w-sm mb-6">
                                Providing premium group transportation services
                                across Los Angeles and Southern California.
                                Safe, reliable, and comfortable since 2012.
                            </p>
                            <div className="flex gap-3">
                                <div className="bg-gray-800 rounded-lg p-3 text-center">
                                    <div className="text-orange-400 font-bold text-lg">
                                        DOT
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Certified
                                    </div>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-3 text-center">
                                    <div className="text-orange-400 font-bold text-lg">
                                        A+
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        BBB Rating
                                    </div>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-3 text-center">
                                    <div className="text-orange-400 font-bold text-lg">
                                        4.9★
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Google
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">
                                Services
                            </h4>
                            <ul className="space-y-2">
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
                                            className="hover:text-orange-500"
                                        >
                                            {s}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">
                                Company
                            </h4>
                            <ul className="space-y-2">
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
                                            className="hover:text-orange-500"
                                        >
                                            {s}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm">
                            © {new Date().getFullYear()} Los Angeles Charter Bus
                            Services. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-white">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-white">
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
