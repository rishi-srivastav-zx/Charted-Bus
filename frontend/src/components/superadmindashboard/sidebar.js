"use client";

import React, { useState } from "react";
import {
    Bus,
    LayoutDashboard,
    Users,
    MapPin,
    BookOpen,
    BarChart3,
    CheckCircle2,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarItem } from "./sidebaritem";
import { cn } from "@/app/lib/uitls";
import { useAuth } from "@/services/useAuth.js";

export const Sidebar = ({ currentView, setCurrentView }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout, isLoading } = useAuth();

    const handleLogoutClick = () => {
        if (confirm("Are you sure you want to logout?")) {
            logout();
        }
    };

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            color: "blue",
        },
        { id: "operators", label: "Operators", icon: Users, color: "violet" },
        { id: "inventory", label: "Inventory", icon: Bus, color: "amber" },
        { id: "routes", label: "Routes", icon: MapPin, color: "emerald" },
        { id: "bookings", label: "Bookings", icon: BookOpen, color: "pink" },
        { id: "reports", label: "Reports", icon: BarChart3, color: "cyan" },
        {
            id: "approvals",
            label: "Approvals",
            icon: CheckCircle2,
            badge: 12,
            color: "orange",
        },
    ];

    const systemItems = [
        { id: "settings", label: "Settings", icon: Settings, color: "slate" },
        { id: "help", label: "Help Center", icon: HelpCircle, color: "slate" },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 88 : 288 }}
            className="bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-40 shadow-sm transition-all duration-300"
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-slate-50 flex-shrink-0 relative">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0 cursor-pointer hover:rotate-3 transition-transform">
                        <Bus
                            className="text-white"
                            size={22}
                            strokeWidth={2.5}
                        />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col"
                            >
                                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                    BusManager
                                </h1>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Super Admin
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 hover:shadow-md transition-all z-50 text-slate-400 hover:text-blue-600"
            >
                {isCollapsed ? (
                    <ChevronRight size={14} />
                ) : (
                    <ChevronLeft size={14} />
                )}
            </button>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="mb-4 px-2">
                    <AnimatePresence>
                        {!isCollapsed ? (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                            >
                                Main Menu
                            </motion.span>
                        ) : (
                            <div className="h-px bg-slate-100 w-full" />
                        )}
                    </AnimatePresence>
                </div>

                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.id}
                        {...item}
                        active={currentView === item.id}
                        onClick={() => setCurrentView(item.id)}
                        collapsed={isCollapsed}
                    />
                ))}

                <div className="pt-8 pb-2">
                    <div className="mb-4 px-2">
                        <AnimatePresence>
                            {!isCollapsed ? (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                                >
                                    System
                                </motion.span>
                            ) : (
                                <div className="h-px bg-slate-100 w-full" />
                            )}
                        </AnimatePresence>
                    </div>
                    {systemItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            {...item}
                            active={currentView === item.id}
                            onClick={() => setCurrentView(item.id)}
                            collapsed={isCollapsed}
                        />
                    ))}
                </div>
            </nav>

            {/* User Profile & Logout - Modernized & Minimal */}
            <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                <div
                    className={cn(
                        "transition-all duration-300 rounded-2xl flex items-center gap-3 group relative overflow-hidden",
                        isCollapsed
                            ? "justify-center p-2"
                            : "p-3 hover:bg-slate-50 border border-transparent hover:border-slate-200",
                    )}
                >
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 transition-transform group-hover:scale-110">
                            <User size={18} />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>

                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 min-w-0"
                        >
                            <p className="text-sm font-bold text-slate-900 truncate tracking-tight">
                                Alex Morgan
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 truncate tracking-wide">
                                admin@busmgr.com
                            </p>
                        </motion.div>
                    )}

                    {!isCollapsed && (
                        <button
                            onClick={handleLogoutClick}
                            className="p-2 mr-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>

                {/* System Operational Status (Small & Subtle) */}
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400 tracking-wide opacity-70">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                    {!isCollapsed && <span>System Operational</span>}
                    {!isCollapsed && <span className="text-slate-300">•</span>}
                    {!isCollapsed && <span>v2.4.0</span>}
                </div>
            </div>
        </motion.aside>
    );
};
