import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Wifi,
    Tv,
    Armchair,
    Wind,
    Zap,
    Shield,
    ArrowRight,
} from "lucide-react";
import { getAllBuses } from "../../../services/busservices";
import Link from "next/link";   

// Feature icon mapping
const featureIcons = {
    wifi: Wifi,
    tv: Tv,
    seats: Armchair,
    ac: Wind,
    charging: Zap,
    safety: Shield,
    default: Shield,
};

// Helper to safely get feature name and icon key
const getFeatureData = (feature) => {
    if (typeof feature === "string") {
        return { name: feature, iconKey: feature.toLowerCase() };
    }
    if (typeof feature === "object" && feature !== null) {
        return {
            name: feature.name || feature.label || "Feature",
            iconKey: (feature.icon || feature.key || "").toLowerCase(),
        };
    }
    return { name: "Feature", iconKey: "default" };
};

const BusTypes = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                setLoading(true);
                const res = await getAllBuses({ limit: 8 });
                const data = res?.data?.data ?? res?.data ?? [];
                const validBuses = (Array.isArray(data) ? data : []).filter(
                    (bus) => bus._id && bus._id.length === 24
                );
                setBuses(validBuses);
            } catch (err) {
                setError(err.message || "Failed to load buses");
            } finally {
                setLoading(false);
            }
        };
        fetchBuses();
    }, []);

    if (loading) {
        return (
            <section id="buses" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                            Our Premium Fleet
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200"
                            >
                                <div className="h-56 bg-slate-200 animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="buses" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="buses" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-orange-600 uppercase bg-orange-100 rounded-full">
                        Modern Fleet
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                        Choose Your Perfect Ride
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        From executive coaches to party buses, find the ideal
                        vehicle for your group size and occasion.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {buses.map((bus, i) => (
                            <motion.div
                            key={bus._id || i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300"
                            >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                <img
                                    src={bus.image || "/placeholder-bus.jpg"}
                                    alt={bus.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />

                                {/* Capacity Badge */}
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                        <Users
                                            size={14}
                                            className="text-orange-500"
                                        />
                                        <span className="text-sm font-bold">
                                            {bus.seatCapacity} Seats
                                        </span>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {bus.category}
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    {bus.name}
                                </h3>

                                {/* Price if available */}
                                {bus.pricePerDay && (
                                    <p className="text-slate-500 text-sm mb-3">
                                        From{" "}
                                        <span className="text-lg font-bold text-slate-900">
                                            ${bus.pricePerDay}
                                        </span>
                                        /day
                                    </p>
                                )}

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {bus.features
                                        ?.slice(0, 4)
                                        .map((feature, idx) => {
                                            const { name, iconKey } =
                                                getFeatureData(feature);
                                            const Icon =
                                                featureIcons[iconKey] ||
                                                featureIcons.default;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
                                                    title={name}
                                                >
                                                    <Icon
                                                        size={12}
                                                        className="text-slate-400"
                                                    />
                                                    <span className="text-xs font-medium text-slate-600 truncate max-w-[80px]">
                                                        {name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>

                                {/* CTA Button */}
                                {bus._id && bus._id.length === 24 && (
                                    <Link href={`/BusPage?id=${bus._id}`} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-orange-500 transition-colors duration-300 group/btn">
                                    View Details
                                    <ArrowRight
                                        size={16}
                                        className="transform group-hover/btn:translate-x-1 transition-transform"
                                    />
                                </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-12 text-center">
                    <Link href="/#buses" className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold hover:bg-slate-900 hover:text-white transition-all duration-300">
                        View All Vehicles
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BusTypes;
