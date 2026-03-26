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
import { useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { DashboardView } from "@/components/superadmindashboard/dashboard";
import { OperatorsView } from "@/components/superadmindashboard/operator";
import { InventoryView } from "@/components/superadmindashboard/inventory";
import { ApprovalsView } from "@/components/superadmindashboard/approvals";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Sidebar } from "@/components/superadmindashboard/sidebar";
import LandingPages from "@/components/superadmindashboard/landing-page";
import LeadPage from "@/components/superadmindashboard/leadpage/leaddashboard";

function DashboardContent() {
    const router = useRouter();
    const [view, setView] = useState("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Get view from URL on mount
        const params = new URLSearchParams(window.location.search);
        setView(params.get("view") || "dashboard");
    }, []);

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
        setView(viewId);
        setIsMobileMenuOpen(false);
    };

    const currentViewLabel =
        {
            dashboard: "Dashboard Overview",
            operators: "Operator Management",
            inventory: "Vehicle Inventory",
            bookings: "Booking Management",
            pages: "Landing Pages",
            leads: "Leads & Inquiries",
            approvals: "Pending Approvals",
            routes: "Route Management",
            calendar: "Calendar View",
            reports: "Reports & Analytics",
        }[view] || "Dashboard";

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar
                currentView={view}
                onNavigate={handleNavigation}
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">
                                    {currentViewLabel}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="!pl-10 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>
                            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* View Content */}
                <main className="p-4 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {view === "dashboard" && (
                                <Suspense
                                    fallback={
                                        <div className="p-8 text-center">
                                            Loading...
                                        </div>
                                    }
                                >
                                    <DashboardView />
                                </Suspense>
                            )}
                            {view === "operators" && <OperatorsView />}
                            {view === "inventory" && <InventoryView />}
                            {view === "bookings" && <LeadPage />}
                            {view === "pages" && <LandingPages />}
                            {view === "leads" && <LeadPage />}
                            {view === "approvals" && <ApprovalsView />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
