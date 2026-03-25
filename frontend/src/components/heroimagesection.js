import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin } from "lucide-react";

// All bus/coach images
const images = [
    // Hero — confirmed charter/coach bus (keep as-is)
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",

    // Charter bus exterior (front/side view) — Pexels
    "https://unitedcoachways.com/wp-content/uploads/2019/07/buses7.jpg",

    // Charter/coach bus on highway — Pexels
    "https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=800",

    // Luxury charter bus parked — Pexels
    "https://www.unitedbuses.com/wp-content/uploads/35-Passenger.jpeg",

    // Coach bus interior seats — Pexels
    "https://www.nyccharterbuscompany.com/images/New-York-Charter-Bus-Company-Exterior.jpg",
];

export default function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden md:block w-[800px] h-[500px]"
        >
            {/* Image Container with Crossfade - Fixed background layer */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800">
                {/* Static background image to prevent bg flash during transition */}
                <img
                    src={images[currentIndex]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-100"
                    style={{ filter: "brightness(0.7)" }}
                />

                <AnimatePresence mode="sync">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt="Luxury Coach"
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 0.8, ease: "easeInOut" },
                            scale: { duration: 1.2, ease: "easeOut" },
                        }}
                    />
                </AnimatePresence>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? "bg-white w-6"
                                    : "bg-white/40 hover:bg-white/60 w-2"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Cards - 24/7 Support */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-6 -left-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl z-30"
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

            {/* Floating Cards - Nationwide */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl z-30"
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
    );
}
