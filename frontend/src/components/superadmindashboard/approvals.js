import React from "react";
import { HardHat, Clock, ArrowRight } from "lucide-react";

export const ApprovalsView = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        {/* Header - Kept for context but simplified */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    Approvals 
                </h2>
                <p className="text-slate-500">
                    Manage and oversee all approvals.
                </p>
            </div>
        </div>

        {/* Under Development Placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                {/* Icon Container with animated background */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
                    <div className="relative w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-100">
                        <HardHat size={36} className="text-blue-600" />
                    </div>
                </div>

                {/* Main Message */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Section Under Development
                </h3>

                {/* Subtext */}
                <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                    We're currently building this feature to help you manage bus
                    operators more efficiently. Check back soon for updates!
                </p>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-full mb-8">
                    <Clock size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                        Expected release: Coming Soon
                    </span>
                </div>

                {/* Optional CTA - can be removed or modified */}
                <button className="group flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    View Documentation
                    <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </button>
            </div>

            {/* Decorative bottom pattern */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 opacity-20" />
        </div>
    </div>
);
