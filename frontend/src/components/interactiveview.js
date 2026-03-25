import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BUS_VIEWS } from "../components/mockdata";
import { ChevronLeft, ChevronRight } from "lucide-react";

const InteractiveView = () => {
    const [activeTab, setActiveTab] = useState("exterior");
    const [currentIndex, setCurrentIndex] = useState(0);

    // Get current images array based on active tab
    const currentImages = BUS_VIEWS[activeTab];

    // Handle tab change with reset
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentIndex(0);
    };

    // Navigation handlers
    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % currentImages.length);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + currentImages.length) % currentImages.length,
        );
    };

    return (
        <section className="py-24 bg-white text-slate-900 overflow-hidden relative z-30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-slate-900">
                        Experience the Fleet
                    </h2>
                    <p className="text-slate-600">
                        Take a closer look at our world-class vehicles from
                        every angle.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-12">
                    {Object.keys(BUS_VIEWS).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${
                                activeTab === tab
                                    ? "bg-orange-500 text-white shadow-lg"
                                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Image Carousel */}
                <div className="relative group max-w-5xl mx-auto">
                    <div className="aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-slate-100 relative">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={`${activeTab}-${currentIndex}`}
                                src={currentImages[currentIndex]}
                                alt={`${activeTab} view ${currentIndex + 1}`}
                                className="w-full h-full object-cover absolute inset-0"
                                referrerPolicy="no-referrer"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                }}
                            />
                        </AnimatePresence>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-medium">
                            {currentIndex + 1} / {currentImages.length}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    >
                        <ChevronRight className="w-6 h-6 text-slate-700" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {currentImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? "bg-orange-500 w-6"
                                        : "bg-slate-300 w-2 hover:bg-slate-400"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveView;
