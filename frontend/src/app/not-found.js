"use client";
import { ArrowRight, Home, Search, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
        setIsLoaded(true);

        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: (e.clientX - rect.left - rect.width / 2) / 20,
                    y: (e.clientY - rect.top - rect.height / 2) / 20,
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const quickLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Products", href: "/products", icon: Sparkles },
        { name: "About", href: "/about", icon: Compass },
    ];

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden selection:bg-orange-500/30"
        >
            {/* Animated Background Grid */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                        transition: "transform 0.3s ease-out",
                    }}
                />
            </div>

            {/* Dynamic Gradient Orbs */}
            <div
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[130px] animate-pulse"
                style={{
                    transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
                    transition: "transform 0.5s ease-out",
                }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-[110px] animate-pulse delay-1000"
                style={{
                    transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
                    transition: "transform 0.5s ease-out",
                }}
            />

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-orange-500/30 rounded-full blur-sm animate-float"
                    style={{
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${4 + i * 0.5}s`,
                    }}
                />
            ))}

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_80%)]" />

            {/* Main Content */}
            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* Glitchy 404 */}
                <div className="mb-8 relative">
                    <div
                        className={`inline-flex items-center gap-2 md:gap-4 text-7xl md:text-9xl font-black tracking-tighter transition-all duration-1000 ${
                            isLoaded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <span
                            className="text-white/90 relative inline-block hover:animate-glitch"
                            style={{
                                textShadow: "2px 2px 0px rgba(249,115,22,0.3)",
                            }}
                        >
                            4
                        </span>
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 relative inline-block animate-pulse-slow"
                            style={{
                                filter: "drop-shadow(0 0 30px rgba(249,115,22,0.5))",
                            }}
                        >
                            0
                        </span>
                        <span
                            className="text-white/90 relative inline-block hover:animate-glitch"
                            style={{
                                textShadow: "2px 2px 0px rgba(249,115,22,0.3)",
                            }}
                        >
                            4
                        </span>
                    </div>

                    {/* Decorative Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-orange-500/10 rounded-full animate-spin-slow" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-amber-500/5 rounded-full animate-spin-reverse" />
                </div>

                {/* Animated Divider */}
                <div
                    className={`w-24 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 mx-auto mb-8 rounded-full relative overflow-hidden transition-all duration-700 delay-300 ${
                        isLoaded
                            ? "opacity-100 scale-x-100"
                            : "opacity-0 scale-x-0"
                    }`}
                >
                    <div className="absolute inset-0 bg-white/50 animate-shimmer" />
                </div>

                {/* Title with Typewriter Effect */}
                <h1
                    className={`text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight transition-all duration-700 delay-500 ${
                        isLoaded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                    }`}
                >
                    Page Not Found
                </h1>

                {/* Description */}
                <p
                    className={`text-white/50 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed transition-all duration-700 delay-700 ${
                        isLoaded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                    }`}
                >
                    The page you're looking for seems to have vanished into the
                    digital void.
                    <span className="block mt-2 text-orange-400/80 text-base">
                        But don't worry, we can help you find your way back.
                    </span>
                </p>

                {/* CTA Buttons */}
                <div
                    className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-1000 ${
                        isLoaded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                    }`}
                >
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <Home className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Back to Home</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white font-medium transition-all duration-300 hover:bg-white/5 rounded-xl"
                    >
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Quick Links - Retention Strategy */}
                <div
                    className={`transition-all duration-700 delay-[1200ms] ${
                        isLoaded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                    }`}
                >
                    <p className="text-white/30 text-sm mb-4 uppercase tracking-widest">
                        Popular Destinations
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {quickLinks.map((link, i) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-orange-400 hover:border-orange-500/30 hover:bg-orange-500/10 transition-all duration-300 text-sm"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex items-center justify-center gap-3 mt-12">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 animate-bounce"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: "1s",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-sm flex items-center gap-2">
                <span>© 2024 Transit Co.</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-orange-500/60">Lost & Found</span>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    33% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    66% {
                        transform: translateY(10px) translateX(-10px);
                    }
                }
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                @keyframes spin-slow {
                    from {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    to {
                        transform: translate(-50%, -50%) rotate(360deg);
                    }
                }
                @keyframes spin-reverse {
                    from {
                        transform: translate(-50%, -50%) rotate(360deg);
                    }
                    to {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                }
                @keyframes pulse-slow {
                    0%,
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }
                @keyframes glitch {
                    0%,
                    100% {
                        transform: translate(0);
                    }
                    20% {
                        transform: translate(-2px, 2px);
                    }
                    40% {
                        transform: translate(-2px, -2px);
                    }
                    60% {
                        transform: translate(2px, 2px);
                    }
                    80% {
                        transform: translate(2px, -2px);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 25s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                .hover\\:animate-glitch:hover {
                    animation: glitch 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}
