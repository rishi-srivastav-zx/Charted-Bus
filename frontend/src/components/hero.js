"use client";
import { motion } from "framer-motion";
import { ChevronRight, Star, Phone, MapPin, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useNav } from "./navigation-provider";
import { getAllPages } from "@/services/landingpage";

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
        return n.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    };

    const normalizedPages = pages.map((p) => ({
        ...p,
        country: normalizeName(p.country, true),
        city: normalizeName(p.city, false)
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
                normalizeName(p.country, true).toLowerCase() === country.toLowerCase() &&
                normalizeName(p.city, false).toLowerCase() === city.toLowerCase(),
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

    return (
        <section
            id="home"
            className="relative min-h-screen w-full flex items-center overflow-hidden pt-32 pb-20"
        >
            {/* Background */}
            <div className="absolute inset-0 [clip-path:inset(0)] -z-10">
                <div className="fixed inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
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

            <div className="max-w-8xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-4 rounded-full bg-orange-500/20 text-orange-400 font-bold text-sm mb-6 tracking-wider uppercase">
                        #1 Rated Charter Service
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
                        Premium Charter Bus Rentals{" "}
                        <span className="text-orange-500">Across the USA</span>
                    </h1>
                    <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                        Comfortable, Reliable and Affordable Group
                        Transportation for any occasion. Experience luxury
                        travel like never before.
                    </p>

                    {/* Quote Button with Dropdown */}
                    <div className="relative inline-block">
                        <button
                            onClick={handleQuoteClick}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange-500/40 flex items-center gap-2"
                        >
                            Get Instant Quote <ChevronRight size={20} />
                        </button>

                        {/* Dropdown Modal */}
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-[-110px] left-20   w-80 bg-white rounded-2xl shadow-2xl p-6 z-999"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Select Location
                                    </h3>
                                    <button
                                        onClick={closeDropdown}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Country Dropdown */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <select
                                        value={country}
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-800"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Dropdown */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <select
                                        value={city}
                                        onChange={(e) =>
                                            setCity(e.target.value)
                                        }
                                        disabled={!country}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select City</option>
                                        {availableCities.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleNavigate}
                                        disabled={!country || !city}
                                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        Continue <ChevronRight size={18} />
                                    </button>

                                    {/* Universal Page Option */}
                                    <button
                                        onClick={handleUniversalNavigate}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Globe size={18} />
                                        Go to Universal Booking
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 mt-4 text-center">
                                    Select your location or use universal
                                    booking
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Backdrop for dropdown */}
                    {showDropdown && (
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={closeDropdown}
                        />
                    )}

                    <button
                        onClick={() => navigate("#buses")}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all ml-4"
                    >
                        View Buses
                    </button>

                    <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                        <div>
                            <div className="text-3xl font-bold text-white">
                                50k+
                            </div>
                            <div className="text-sm text-white/60">
                                Trips Completed
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                500+
                            </div>
                            <div className="text-sm text-white/60">
                                Cities Covered
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                4.9
                            </div>
                            <div className="text-sm text-white/60 flex items-center gap-1">
                                Avg. Rating{" "}
                                <Star
                                    size={12}
                                    className="fill-orange-500 text-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden md:block"
                >
                    <img
                        src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80"
                        alt="Luxury Coach"
                        className="rounded-3xl shadow-2xl border-4 border-white/10"
                        referrerPolicy="no-referrer"
                    />

                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -top-6 -left-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl"
                    >
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <Phone size={18} />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">
                                24/7 Support
                            </div>
                            <div className="text-white/60 text-xs">
                                Always here for you
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl"
                    >
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">
                                Nationwide Service
                            </div>
                            <div className="text-white/60 text-xs">
                                Coast to coast coverage
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};;;

export default Hero;
