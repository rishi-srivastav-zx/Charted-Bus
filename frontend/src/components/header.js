"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, Bus } from "lucide-react";
import LoginPopup from "../app/login/page";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";

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

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setIsLoginOpen(false);
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

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

        // Redirect to dashboard if user is an admin or operator
        if (user.role === "superadmin" || user.role === "operator") {
            router.push("/dashboard");
        }
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isLoginOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isLoginOpen]);

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
                    {/* Logo - PrimeDrive Style */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        <div
                            className={`w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white transition-all ${isScrolled ? "shadow-lg" : "shadow-orange-500/30"}`}
                        >
                            <Bus size={24} />
                        </div>
                        <span
                            className={`text-2xl font-bold tracking-tight transition-colors ${isScrolled ? "text-slate-900" : "text-white"}`}
                        >
                            Charter<span className="text-orange-500">Bus</span>
                        </span>
                    </div>

                    {/* Desktop Navigation - PrimeDrive Style */}
                    <nav
                        className={`hidden lg:flex items-center gap-8 font-medium transition-colors ${isScrolled ? "text-slate-900" : "text-white"}`}
                    >
                        {[
                            "Services",
                            "Fleet",
                            "Safety",
                            "Service Areas",
                            "FAQ",
                        ].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(" ", "-")}`}
                                className="hover:text-orange-500 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA - PrimeDrive Style */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="tel:18005550199"
                            className={`flex items-center gap-2 font-semibold hover:text-orange-500 transition-colors ${isScrolled ? "text-slate-900" : "text-white"}`}
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
                        aria-label={
                            isMobileMenuOpen ? "Close menu" : "Open menu"
                        }
                    >
                        {isMobileMenuOpen ? (
                            <X
                                className={`w-6 h-6 ${isScrolled ? "text-slate-900" : "text-white"}`}
                            />
                        ) : (
                            <Menu
                                className={`w-6 h-6 ${isScrolled ? "text-slate-900" : "text-white"}`}
                            />
                        )}
                    </button>
                </div>

                {/* Mobile Menu - Updated Style */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-slate-100">
                        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
                            {[
                                "Services",
                                "Fleet",
                                "Safety",
                                "Service Areas",
                                "FAQ",
                            ].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                                    className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 hover:text-orange-500 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
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
                    {/* Backdrop with blur */}
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
