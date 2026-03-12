"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    LayoutDashboard,
    Users,
    Package,
    ClipboardCheck,
    Route,
    Calendar,
    BarChart3,
    Search,
    Bell,
    Menu,
    X,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardView } from "@/components/superadmindashboard/dashboard";
import { OperatorsView } from "@/components/superadmindashboard/operator";
import { InventoryView } from "@/components/superadmindashboard/inventory";
import { ApprovalsView } from "@/components/superadmindashboard/approvals";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Sidebar } from "@/components/superadmindashboard/sidebar";
import LandingPages from "@/components/superadmindashboard/landing-page";
import LeadPage from "@/components/superadmindashboard/leadpage";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const view = searchParams.get("view") || "dashboard";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { isLoading } = useProtectedRoute();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div
                        className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-indigo-300 rounded-full animate-spin"
                        style={{ animationDuration: "1.5s" }}
                    ></div>
                </div>
            </div>
        );
    }

    const handleNavigation = (viewId) => {
        router.push(`/dashboard?view=${viewId}`);
        setIsMobileMenuOpen(false);
    };

    const currentViewLabel =
        {
            dashboard: "Dashboard Overview",
            operators: "Operator Management",
            inventory: "Vehicle Inventory",
            approvals: "Approval Queue",
            Landingpage: "Landingpage",
            Leads: "Leads",
            reports: "Performance Reports",
            settings: "Global Settings",
        }[view] || "Management Portal";

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Component - Desktop (Sticky) / Mobile (Fixed Overlay) */}
            <div
                className={`
                    fixed lg:sticky top-0 inset-y-0 left-0 z-50 lg:z-40 h-screen
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    transition-transform duration-300 ease-in-out lg:transition-none
                `}
            >
                <Sidebar currentView={view} setCurrentView={handleNavigation} />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#F9FBFC]">
                {/* Header (Top Nav) */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-sm/50">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Menu size={22} className="text-slate-600" />
                        </button>
                        <div>
                            <motion.h1
                                key={view}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-black text-slate-900 tracking-tight"
                            >
                                {currentViewLabel}
                            </motion.h1>
                            <p className="hidden sm:block text-[13px] text-slate-400 font-medium tracking-wide">
                                Welcome back, Administrator
                            </p>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl focus-within:bg-white focus-within:border-blue-200 transition-all duration-300 w-64 group">
                            <Search
                                size={16}
                                className="text-slate-400 group-focus-within:text-blue-500 transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Search inventory, users..."
                                className="bg-transparent border-none outline-none text-[13px] font-medium placeholder:text-slate-400 text-slate-700 w-full"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative p-2.5 bg-white border border-slate-200 hover:border-blue-200 rounded-xl transition-all duration-300 cursor-pointer group hover:bg-blue-50/30">
                            <Bell
                                size={20}
                                className="text-slate-500 group-hover:text-blue-600 transition-colors"
                            />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/10 animate-pulse" />
                        </div>
                    </div>
                </header>

                {/* Content Container (Scrollable) */}
                <div className="flex-1 p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.4,
                                cubicBezier: [0.4, 0, 0.2, 1],
                            }}
                        >
                            {view === "dashboard" && <DashboardView />}
                            {view === "operators" && <OperatorsView />}
                            {view === "inventory" && <InventoryView />}
                            {view === "approvals" && <ApprovalsView />}
                            {view === "Landingpage" && <LandingPages />}
                            {view === "Leads" && <LeadPage/>}
                            {[
                                "bookings",
                                "reports",
                                "settings",
                            ].includes(view) && (
                                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-slate-100 shadow-sm border-dashed">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-slate-50/50">
                                        <Settings
                                            size={40}
                                            className="text-slate-300 animate-spin-slow"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                                        Module is Coming Soon
                                    </h3>
                                    <p className="text-slate-400 font-medium max-w-sm text-center px-6">
                                        We are building this feature right now.
                                        This module will be available in the
                                        next system update.
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleNavigation("dashboard")
                                        }
                                        className="mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all"
                                    >
                                        Go Back home
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
