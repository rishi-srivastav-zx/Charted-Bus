"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Bus, ChevronDown } from "lucide-react";
import LoginPopup from "../app/login/page";
import { usePathname, useRouter } from "next/navigation";

// Services dropdown items
const SERVICE_ITEMS = [
    { label: "Chartered Bus", href: "/#services" },
    { label: "Airport Transfers", href: "/#services" },
    { label: "Corporate Travel", href: "/#services" },
    { label: "School Trips", href: "/#services" },
    { label: "Event Shuttles", href: "/#services" },
];

// Desktop nav items (Services handled separately)
const NAV_ITEMS = [
    { label: "Fleet", href: "/#buses" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Amenities", href: "/#amenities" },
    { label: "FAQ", href: "/#faq" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
    const servicesRef = useRef(null);

    // Scroll detection
    useEffect(() => {
        if (!isHome) {
            setIsScrolled(true);
            return;
        }
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    // Close modal / mobile menu on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setIsLoginOpen(false);
                setIsMobileMenuOpen(false);
                setIsServicesOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    // Close services dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (servicesRef.current && !servicesRef.current.contains(e.target)) {
                setIsServicesOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isLoginOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isLoginOpen]);

    const handleLogoClick = () => {
        if (pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            router.push("/");
        }
    };

    const handleLogin = (user) => {
        console.log("Logged in as:", user.role, user.email);
        setIsLoginOpen(false);
        if (user.role === "superadmin" || user.role === "operator") {
            router.push("/dashboard");
        }
    };

   
    const handleNavClick = (e, href) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        setIsServicesOpen(false);

        if (href.startsWith("/#")) {
            const sectionId = href.replace("/#", "");
            if (pathname === "/") {
                // Already on home — just scroll
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            } else {
                // Navigate home first, then scroll after load
                router.push("/");
                setTimeout(() => {
                    const el = document.getElementById(sectionId);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 500);
            }
        } else {
            router.push(href);
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white/90 backdrop-blur-md shadow-md py-4"
                        : "bg-transparent py-6"
                }`}
            >
                <div className="max-w-8xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        <div
                            className={`w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white transition-all ${
                                isScrolled ? "shadow-lg" : "shadow-orange-500/30"
                            }`}
                        >
                            <Bus size={24} />
                        </div>
                        <span
                            className={`text-2xl font-bold tracking-tight transition-colors ${
                                isScrolled ? "text-slate-900" : "text-white"
                            }`}
                        >
                            Charter<span className="text-orange-500">Bus</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav
                        className={`hidden lg:flex items-center gap-8 font-medium transition-colors ${
                            isScrolled ? "text-slate-900" : "text-white"
                        }`}
                    >
                        {/* Services Dropdown */}
                        <div className="relative" ref={servicesRef}>
                            <button
                                onClick={() => setIsServicesOpen((prev) => !prev)}
                                className="flex items-center gap-1 hover:text-orange-500 transition-colors focus:outline-none"
                                aria-haspopup="true"
                                aria-expanded={isServicesOpen}
                            >
                                Services
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isServicesOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown Panel */}
                            {isServicesOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeInDown">
                                    <div className="py-2">
                                        {SERVICE_ITEMS.map((service) => (
                                            <a
                                                key={service.label}
                                                href={service.href}
                                                onClick={(e) => handleNavClick(e, service.href)}
                                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition-colors text-sm font-medium"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                                {service.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Other Nav Items */}
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="hover:text-orange-500 transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="tel:18005550199"
                            className={`flex items-center gap-2 font-semibold hover:text-orange-500 transition-colors ${
                                isScrolled ? "text-slate-900" : "text-white"
                            }`}
                        >
                            <Phone className="w-4 h-4 text-orange-500" />
                            1-800-555-0199
                        </a>

                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-orange-500/30 transform hover:scale-105"
                        >
                            Login
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? (
                            <X
                                className={`w-6 h-6 ${
                                    isScrolled ? "text-slate-900" : "text-white"
                                }`}
                            />
                        ) : (
                            <Menu
                                className={`w-6 h-6 ${
                                    isScrolled ? "text-slate-900" : "text-white"
                                }`}
                            />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-slate-100">
                        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-2">
                            {/* Mobile Services Accordion */}
                            <div>
                                <button
                                    onClick={() =>
                                        setIsMobileServicesOpen((prev) => !prev)
                                    }
                                    className="w-full flex items-center justify-between text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 hover:text-orange-500 transition-colors"
                                >
                                    Services
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-200 ${
                                            isMobileServicesOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {isMobileServicesOpen && (
                                    <div className="flex flex-col gap-1 mt-2 mb-2 pl-4 border-l-2 border-orange-300">
                                        {SERVICE_ITEMS.map((service) => (
                                            <a
                                                key={service.label}
                                                href={service.href}
                                                onClick={(e) =>
                                                    handleNavClick(e, service.href)
                                                }
                                                className="py-2 text-slate-600 hover:text-orange-500 transition-colors font-medium text-sm flex items-center gap-2"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                                {service.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Other Mobile Nav Items */}
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 hover:text-orange-500 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}

                            <a
                                href="tel:18005550199"
                                className="flex items-center gap-2 text-slate-900 font-bold text-lg pt-2 hover:text-orange-500 transition-colors"
                            >
                                <Phone className="w-5 h-5 text-orange-500" />
                                1-800-555-0199
                            </a>

                            <button
                                onClick={() => {
                                    setIsLoginOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold mt-2 transition-all shadow-lg hover:shadow-orange-500/30"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* LOGIN POPUP MODAL */}
            {isLoginOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsLoginOpen(false)}
                    />
                    {/* Login Component */}
                    <div className="relative z-10 w-full">
                        <LoginPopup
                            onLogin={handleLogin}
                            onClose={() => setIsLoginOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
