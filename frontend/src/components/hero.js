"use client";
import { motion } from "framer-motion";
import { ChevronRight, Star, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useNav } from "./navigation-provider";

const Hero = () => {
    const [blur, setBlur] = useState(false);
    const { navigate } = useNav();

    return (
        <section
            id="home"
            className="relative min-h-screen w-full flex items-center overflow-hidden pt-32 pb-20"
        >
            {/* Background */}
            <div className="absolute inset-0 [clip-path:inset(0)] -z-10">
                <div className="fixed inset-0">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />

                    {/* Image */}
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

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate("/bookingform/country/city")}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange-500/40 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            Get Instant Quote <ChevronRight size={20} />
                        </button>

                        <button
                            onClick={() => router.push("#buses")}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all"
                        >
                            View Buses
                        </button>
                    </div>

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

                    {/* Floating Cards */}
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
};

export default Hero;
