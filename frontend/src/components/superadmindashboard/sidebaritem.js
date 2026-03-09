"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/uitls";

export const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
    onClick,
    badge,
    collapsed = false,
    color = "blue",
}) => {
    // Premium Color Schemes
    const colorSchemes = {
        blue: "bg-blue-600 shadow-blue-500/30 text-white",
        violet: "bg-violet-600 shadow-violet-500/30 text-white",
        amber: "bg-amber-600 shadow-amber-500/30 text-white",
        emerald: "bg-emerald-600 shadow-emerald-500/30 text-white",
        pink: "bg-pink-600 shadow-pink-500/30 text-white",
        cyan: "bg-cyan-600 shadow-cyan-500/30 text-white",
        orange: "bg-orange-600 shadow-orange-500/30 text-white",
        slate: "bg-slate-900 shadow-slate-500/30 text-white",
    };

    const activeStyles = colorSchemes[color] || colorSchemes.blue;

    return (
        <div className="relative group/nav-item">
            <motion.button
                onClick={onClick}
                whileHover={{ x: collapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "w-full flex items-center gap-3 rounded-2xl transition-all duration-300 relative overflow-hidden group mb-1.5",
                    collapsed ? "justify-center p-3" : "px-4 py-3.5",
                    active
                        ? activeStyles
                        : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900",
                )}
            >
                {/* Micro-Interaction Background Effect */}
                {!active && (
                    <motion.div
                        className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        layoutId="nav-bg-hover"
                    />
                )}

                {/* Icon Wrapper */}
                <div
                    className={cn(
                        "relative z-10 flex items-center justify-center transition-transform duration-300",
                        active ? "scale-110" : "group-hover:scale-110",
                    )}
                >
                    <Icon
                        size={collapsed ? 24 : 20}
                        strokeWidth={active ? 2.5 : 2}
                    />
                </div>

                {/* Label & Badge (Hidden when collapsed) */}
                {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0 z-10">
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-bold text-[14px] truncate tracking-tight"
                        >
                            {label}
                        </motion.span>
                        {badge && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                    "px-2 py-0.5 text-[10px] font-black rounded-lg min-w-[20px] text-center",
                                    active
                                        ? "bg-white/20 text-white ring-1 ring-white/30"
                                        : "bg-blue-600 text-white shadow-sm shadow-blue-500/20",
                                )}
                            >
                                {badge}
                            </motion.span>
                        )}
                    </div>
                )}

                {/* Active Indicator (Dot) */}
                {active && !collapsed && (
                    <motion.div
                        layoutId="active-dot"
                        className="w-1.5 h-1.5 bg-white rounded-full z-10"
                    />
                )}
            </motion.button>

            {/* Tooltip for Collapsed State */}
            <AnimatePresence>
                {collapsed && (
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 invisible group-hover/nav-item:visible z-50 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.95 }}
                            className="bg-slate-900 text-white text-[12px] font-bold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap relative flex items-center gap-2"
                        >
                            {/* Tooltip Arrow */}
                            <div className="absolute -left-1 w-2 h-2 bg-slate-900 rotate-45 rounded-sm" />
                            {label}
                            {badge && (
                                <span className="bg-blue-600 px-1.5 py-0.5 rounded-md text-[9px]">
                                    {badge}
                                </span>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
