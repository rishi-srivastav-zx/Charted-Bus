"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, Phone, MapPin, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useNav } from "./navigation-provider";
import { getAllPages } from "../services/landingpage";
import HeroImageSection from "./heroimagesection";

const Hero = () => {
    const [blur, setBlur] = useState(false);
    const [pages, setPages] = useState([]);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [availableCities, setAvailableCities] = useState([]);

    const { navigate } = useNav();

    useEffect(() => {
        async function loadPages() {
            const data = await getAllPages();
            setPages(data);
        }
        loadPages();
    }, []);

    const normalizeName = (name, isCountry) => {
        if (!name) return "";
        let n = name.trim();
        if (isCountry) {
            if (n.toUpperCase() === "USA") return "USA";
            if (n.toUpperCase() === "UK") return "UK";
        }
        return n
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
    };

    const normalizedPages = pages.map((p) => ({
        ...p,
        country: normalizeName(p.country, true),
        city: normalizeName(p.city, false),
    }));

    const countries = [
        ...new Set(normalizedPages.map((p) => p.country).filter(Boolean)),
    ].sort();

    // Update available cities when country changes
    useEffect(() => {
        if (country) {
            const cities = pages
                .filter((p) => normalizeName(p.country, true) === country)
                .map((p) => normalizeName(p.city, false))
                .filter(Boolean)
                .sort();
            setAvailableCities([...new Set(cities)]);
            setCity("");
        } else {
            setAvailableCities([]);
            setCity("");
        }
    }, [country, pages]);

    const handleNavigate = () => {
        if (!country || !city) {
            navigate("/bookingform");
            return;
        }

        const slugify = (str) =>
            str
                .toLowerCase()
                .trim()
                .replace(/[\s_]+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
                .replace(/-+/g, "-");

        const pageExists = pages.find(
            (p) =>
                normalizeName(p.country, true).toLowerCase() ===
                    country.toLowerCase() &&
                normalizeName(p.city, false).toLowerCase() ===
                    city.toLowerCase(),
        );

        if (pageExists) {
            navigate(`/bookingform/${slugify(country)}/${slugify(city)}`);
        } else {
            navigate("/bookingform");
        }
    };

    const handleUniversalNavigate = () => {
        setShowDropdown(false);
        setCountry("");
        setCity("");
        navigate("/bookingform");
    };

    const handleQuoteClick = () => {
        if (pages.length > 0) {
            setShowDropdown(true);
        } else {
            navigate("/bookingform");
        }
    };

    const closeDropdown = () => {
        setShowDropdown(false);
        setCountry("");
        setCity("");
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") closeDropdown();
        };
        if (showDropdown) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [showDropdown]);

    return (
        <section
            id="home"
            className="relative min-h-screen w-full flex items-center overflow-hidden pt-24 md:pt-32 pb-16 md:pb-20"
        >
            {/* Background */}
            <div className="absolute inset-0 [clip-path:inset(0)] -z-10">
                <div className="fixed inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60 md:to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?q=80&w=1920&auto=format&fit=crop"
                        alt="Premium Charter Bus"
                        className={`w-full h-full object-cover ${blur ? "blur-light" : ""}`}
                        onBlur={() => setBlur(true)}
                        onFocus={() => setBlur(false)}
                        referrerPolicy="no-referrer"
                    />
                </div>
            </div>

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs sm:text-sm mb-4 md:mb-6 tracking-wider uppercase">
                            #1 Rated Charter Service
                        </span>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
                            Premium Charter Bus Rentals{" "}
                            <span className="text-orange-500">
                                Across the World
                            </span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 md:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Comfortable, Reliable and Affordable Group
                            Transportation for any occasion. Experience luxury
                            travel like never before.
                        </p>

                        {/* Quote Button with Dropdown */}
                        <div className="relative inline-block w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={handleQuoteClick}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    Get Instant Quote{" "}
                                    <ChevronRight
                                        size={18}
                                        className="md:size-5"
                                    />
                                </button>

                                <button
                                    onClick={() =>
                                        document
                                            .getElementById("buses")
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                            })
                                    }
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all flex items-center justify-center w-full sm:w-auto"
                                >
                                    View Buses
                                </button>
                            </div>

                            {/* Dropdown Modal - Perfectly Centered & Responsive */}
                            <AnimatePresence>
                                {showDropdown && (
                                    <>
                                        {/* Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                                            onClick={closeDropdown}
                                        />

                                        {/* Modal Container - Always Centered */}
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                    y: 20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                    y: 20,
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    damping: 25,
                                                    stiffness: 300,
                                                }}
                                                className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
                                            >
                                                {/* Header */}
                                                <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-100">
                                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                        <MapPin
                                                            size={20}
                                                            className="text-orange-500"
                                                        />
                                                        Select Location
                                                    </h3>
                                                    <button
                                                        onClick={closeDropdown}
                                                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 sm:p-5 space-y-4">
                                                    {/* Country */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Country
                                                        </label>
                                                        <select
                                                            value={country}
                                                            onChange={(e) =>
                                                                setCountry(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200
                                                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200
                                                            outline-none transition-all text-gray-800 text-sm bg-white
                                                            hover:border-gray-300 cursor-pointer"
                                                        >
                                                            <option value="">
                                                                Select Country
                                                            </option>
                                                            {countries.map(
                                                                (c) => (
                                                                    <option
                                                                        key={c}
                                                                        value={
                                                                            c
                                                                        }
                                                                    >
                                                                        {c}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>

                                                    {/* City */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            City
                                                        </label>
                                                        <select
                                                            value={city}
                                                            onChange={(e) =>
                                                                setCity(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={!country}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200
                                                            focus:border-orange-500 focus:ring-2 focus:ring-orange-200
                                                            outline-none transition-all text-gray-800 text-sm bg-white
                                                            disabled:bg-gray-100 disabled:cursor-not-allowed
                                                            disabled:text-gray-400 hover:border-gray-300 cursor-pointer"
                                                        >
                                                            <option value="">
                                                                {country
                                                                    ? "Select City"
                                                                    : "Select Country First"}
                                                            </option>
                                                            {availableCities.map(
                                                                (c) => (
                                                                    <option
                                                                        key={c}
                                                                        value={
                                                                            c
                                                                        }
                                                                    >
                                                                        {c}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="space-y-3 pt-2">
                                                        <button
                                                            onClick={
                                                                handleNavigate
                                                            }
                                                            disabled={
                                                                !country ||
                                                                !city
                                                            }
                                                            className="w-full bg-orange-500 hover:bg-orange-600
                                                            disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100
                                                            text-white py-3 rounded-xl font-semibold transition-all
                                                            flex items-center justify-center gap-2 text-sm
                                                            hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                                        >
                                                            Continue to Booking
                                                            <ChevronRight
                                                                size={18}
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={
                                                                handleUniversalNavigate
                                                            }
                                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                                                            py-3 rounded-xl font-semibold transition-all
                                                            flex items-center justify-center gap-2 text-sm
                                                            hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                                        >
                                                            <Globe size={18} />
                                                            Universal Booking
                                                        </button>
                                                    </div>

                                                    <p className="text-xs text-gray-500 text-center pt-1">
                                                        Select your location or
                                                        use universal booking
                                                        form
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-8 sm:mt-10 md:mt-16 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 border-t border-white/10 pt-6 md:pt-8">
                            <div className="text-center lg:text-left">
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                    50k+
                                </div>
                                <div className="text-xs sm:text-sm text-white/60">
                                    Trips Completed
                                </div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                    500+
                                </div>
                                <div className="text-xs sm:text-sm text-white/60">
                                    Cities Covered
                                </div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                    4.9
                                </div>
                                <div className="text-xs sm:text-sm text-white/60 flex items-center justify-center lg:justify-start gap-1">
                                    Avg. Rating{" "}
                                    <Star
                                        size={12}
                                        className="fill-orange-500 text-orange-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="hidden lg:block">
                        <HeroImageSection />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
