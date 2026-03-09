"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Search,
    Plus,
    Users,
    Bus,
    MoreVertical,
    X,
    RefreshCw,
    Zap,
    Crown,
    Star,
    Fuel,
    Luggage,
    MapPin,
    TrendingUp,
    ChevronDown,
    AlertCircle,
    Wifi,
    Snowflake,
    Activity,
    CheckCircle2,
    Wrench,
    BadgeCheck,
    Moon,
    Car,
    LayoutGrid,
    Sparkles,
    Navigation,
} from "lucide-react";
import { cn } from "@/app/lib/uitls";
import BusForm from "./busform";
import { getAllBuses } from "@/services/busservices";

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchVehicles() {
    try {
        const res = await getAllBuses();
        return res?.data?.data ?? res?.data ?? [];
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return [];
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", AED: "د.إ" };
function currSym(code) {
    return CURRENCY_SYMBOLS[code] ?? "$";
}

function StatusBadge({ status }) {
    const map = {
        Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        Maintenance: "bg-amber-500/10  text-amber-600  border-amber-500/20",
        Inactive: "bg-slate-400/10  text-slate-500  border-slate-400/20",
    };
    return (
        <span
            className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border",
                map[status] ?? map.Inactive,
            )}
        >
            {status ?? "Active"}
        </span>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse shadow-sm">
            <div className="h-48 bg-slate-200" />
            <div className="p-6 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-4 bg-slate-100 rounded" />
                    <div className="h-4 bg-slate-100 rounded" />
                </div>
                <div className="h-px bg-slate-100 mt-4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, sub }) {
    return (
        <div className="relative rounded-2xl p-5 overflow-hidden border border-slate-100 bg-white shadow-sm group hover:shadow-md transition-all">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors" />
            <div className="relative">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {label}
                    </span>
                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                </div>
                <p className="text-3xl font-black text-slate-800">{value}</p>
                {sub && (
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                        {sub}
                    </p>
                )}
            </div>
        </div>
    );
}

const FEATURE_ICONS = {
    WiFi: Wifi,
    "Air Conditioning": Snowflake,
    "GPS Navigation": Navigation,
    Electric: Zap,
    "Premium Sound": Crown,
};
function FeaturePill({ name }) {
    const Icon = FEATURE_ICONS[name] || Sparkles;
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[10px] font-semibold border border-slate-100">
            <Icon className="w-2.5 h-2.5" />
            {name}
        </span>
    );
}

function VehicleCard({ bus, onSelect }) {
    const sym = currSym(bus.pricing?.currency);
    const discount = bus.pricing?.discountPercent;

    return (
        <div
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={() => onSelect?.(bus)}
        >
            <div className="relative h-48 overflow-hidden bg-slate-100">
                {bus.image ? (
                    <img
                        src={bus.image}
                        alt={bus.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <Car className="w-16 h-16 text-slate-200" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {bus.isMostPopular && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black tracking-wider shadow-lg">
                            <Star className="w-2.5 h-2.5 fill-current" />{" "}
                            POPULAR
                        </span>
                    )}
                    {bus.isElectric && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-full text-[10px] font-black shadow-lg">
                            <Zap className="w-2.5 h-2.5 fill-current" /> EV
                        </span>
                    )}
                    {bus.isPremium && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 text-white rounded-full text-[10px] font-black shadow-lg">
                            <Crown className="w-2.5 h-2.5" /> PREMIUM
                        </span>
                    )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    <StatusBadge status={bus.status} />
                    {discount > 0 && (
                        <span className="px-2.5 py-1 bg-green-500 text-white rounded-full text-[10px] font-black shadow-lg">
                            {discount}% OFF
                        </span>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 flex items-center justify-between shadow-lg border border-white/20">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                {bus.pricing?.billingCycle?.replace("_", " ")}
                            </p>
                            <p className="font-black text-slate-900 text-xl">
                                {sym}
                                {bus.pricing?.totalPrice ??
                                    bus.pricing?.price ??
                                    "—"}
                            </p>
                        </div>
                        {bus.pricing?.originalPrice > bus.pricing?.price && (
                            <div className="text-right">
                                <p className="text-xs line-through text-slate-400">
                                    {sym}
                                    {bus.pricing.originalPrice}
                                </p>
                                <p className="text-xs text-green-600 font-bold">
                                    Save {sym}
                                    {(
                                        bus.pricing.originalPrice -
                                        bus.pricing.price
                                    ).toFixed(0)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-slate-900 text-base leading-tight line-clamp-1">
                        {bus.name}
                    </h3>
                    <button
                        className="text-slate-300 hover:text-slate-700 transition-colors p-1 -mr-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>

                {bus.creatorRole && (
                    <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2 border border-blue-100 w-fit">
                        Created by {bus.creatorRole}
                    </span>
                )}

                {bus.licensePlate && (
                    <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded mb-3 font-mono border border-slate-100 w-fit">
                        {bus.licensePlate}
                    </span>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Users
                            size={13}
                            className="text-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs font-semibold">
                            {bus.seatCapacity ?? "?"} Seats
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Bus
                            size={13}
                            className="text-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs font-semibold">
                            {bus.category}
                        </span>
                    </div>
                    {bus.fuelType && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Fuel
                                size={13}
                                className="text-orange-400 flex-shrink-0"
                            />
                            <span className="text-xs font-semibold">
                                {bus.fuelType}
                            </span>
                        </div>
                    )}
                    {bus.luggageCapacity && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Luggage
                                size={13}
                                className="text-slate-400 flex-shrink-0"
                            />
                            <span className="text-xs font-semibold">
                                {bus.luggageCapacity} bags
                            </span>
                        </div>
                    )}
                    {bus.distancePolicy?.includedKm && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <MapPin
                                size={13}
                                className="text-emerald-500 flex-shrink-0"
                            />
                            <span className="text-xs font-semibold">
                                {bus.distancePolicy.includedKm} km incl.
                            </span>
                        </div>
                    )}
                    {bus.nightChargesApplicable && (
                        <div className="flex items-center gap-1.5 text-amber-600">
                            <Moon size={13} className="flex-shrink-0" />
                            <span className="text-xs font-semibold">
                                Night charges
                            </span>
                        </div>
                    )}
                </div>

                {bus.features?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {bus.features.slice(0, 3).map((f, i) => (
                            <FeaturePill key={i} name={f.name} />
                        ))}
                        {bus.features.length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">
                                +{bus.features.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {bus.inclusions?.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
                                <CheckCircle2 className="w-3 h-3" />{" "}
                                {bus.inclusions.length} included
                            </span>
                        )}
                        {bus.driverAllowanceIncluded && (
                            <span className="flex items-center gap-1 text-[10px] text-violet-600 font-bold bg-violet-50 px-2 py-1 rounded-md">
                                <BadgeCheck className="w-3 h-3" /> Driver
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        {bus.pricing?.price && (
                            <p className="text-sm font-black text-blue-600">
                                {sym}
                                {bus.pricing.price}
                                <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                                    /
                                    {bus.pricing?.billingCycle?.replace(
                                        "per_",
                                        "",
                                    )}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function VehicleDrawer({ bus, onClose }) {
    if (!bus) return null;
    const sym = currSym(bus.pricing?.currency);

    return (
        <div
            className="fixed inset-0 z-[200] flex justify-end"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl"
                style={{
                    animation: "slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 pb-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {bus.image && (
                        <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 ring-2 ring-white/20 shadow-lg">
                            <img
                                src={bus.image}
                                alt={bus.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                        </div>
                    )}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-black leading-tight">
                                {bus.name}
                            </h2>
                            {bus.licensePlate && (
                                <span className="inline-block mt-1 text-xs font-mono font-bold tracking-widest bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 px-2 py-0.5 rounded">
                                    {bus.licensePlate}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 items-end flex-shrink-0">
                            {bus.creatorRole && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[10px] font-black">
                                    CREATED BY {bus.creatorRole.toUpperCase()}
                                </span>
                            )}
                            {bus.isMostPopular && (
                                <span className="px-2 py-0.5 bg-amber-500 rounded-full text-[10px] font-black">
                                    POPULAR
                                </span>
                            )}
                            {bus.isPremium && (
                                <span className="px-2 py-0.5 bg-purple-500 rounded-full text-[10px] font-black">
                                    PREMIUM
                                </span>
                            )}
                            {bus.isElectric && (
                                <span className="px-2 py-0.5 bg-green-500  rounded-full text-[10px] font-black">
                                    EV
                                </span>
                            )}
                        </div>
                    </div>
                    {bus.pricing?.price && (
                        <div className="mt-4 flex items-end gap-3">
                            <span className="text-3xl font-black">
                                {sym}
                                {bus.pricing.totalPrice ?? bus.pricing.price}
                            </span>
                            <span className="text-slate-400 text-sm mb-0.5">
                                /{bus.pricing.billingCycle?.replace("_", " ")}
                            </span>
                            {bus.pricing.discountPercent > 0 && (
                                <span className="ml-auto px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-bold">
                                    {bus.pricing.discountPercent}% OFF
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-8 bg-slate-50/50 min-h-[calc(100vh-300px)]">
                    <Section title="Specifications">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                {
                                    icon: Users,
                                    label: "Seats",
                                    val: bus.seatCapacity,
                                },
                                {
                                    icon: Bus,
                                    label: "Category",
                                    val: bus.category,
                                },
                                {
                                    icon: Fuel,
                                    label: "Fuel",
                                    val: bus.fuelType,
                                },
                                {
                                    icon: Luggage,
                                    label: "Luggage",
                                    val: bus.luggageCapacity
                                        ? `${bus.luggageCapacity} bags`
                                        : null,
                                },
                            ]
                                .filter((r) => r.val)
                                .map((row, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
                                    >
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <row.icon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                                {row.label}
                                            </p>
                                            <p className="text-sm font-bold text-slate-800">
                                                {row.val}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </Section>

                    {bus.pricing && (
                        <Section title="Pricing Breakdown">
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                                {[
                                    {
                                        l: "Original Price",
                                        v: bus.pricing.originalPrice
                                            ? `${sym}${bus.pricing.originalPrice}`
                                            : null,
                                    },
                                    {
                                        l: "Selling Price",
                                        v: bus.pricing.price
                                            ? `${sym}${bus.pricing.price}`
                                            : null,
                                    },
                                    {
                                        l: "Extra Charges",
                                        v: bus.pricing.extraCharges
                                            ? `${sym}${bus.pricing.extraCharges}`
                                            : null,
                                    },
                                    {
                                        l: "Discount",
                                        v: bus.pricing.discountPercent
                                            ? `${bus.pricing.discountPercent}%`
                                            : null,
                                    },
                                    {
                                        l: "Total",
                                        v: bus.pricing.totalPrice
                                            ? `${sym}${bus.pricing.totalPrice}`
                                            : null,
                                        bold: true,
                                    },
                                ]
                                    .filter((r) => r.v)
                                    .map((row, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex justify-between px-4 py-3 text-sm border-b border-slate-50 last:border-0",
                                                row.bold &&
                                                    "bg-blue-50/50 font-black text-blue-700",
                                            )}
                                        >
                                            <span
                                                className={
                                                    row.bold
                                                        ? "text-blue-900"
                                                        : "text-slate-500 font-medium"
                                                }
                                            >
                                                {row.l}
                                            </span>
                                            <span className="font-bold">
                                                {row.v}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </Section>
                    )}

                    {(bus.distancePolicy?.includedKm ||
                        bus.distancePolicy?.extraKmPrice) && (
                        <Section title="Distance Policy">
                            <div className="grid grid-cols-2 gap-3">
                                {bus.distancePolicy.includedKm && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-black text-blue-700">
                                            {bus.distancePolicy.includedKm}
                                        </p>
                                        <p className="text-xs text-blue-500 font-bold uppercase tracking-wide">
                                            km included
                                        </p>
                                    </div>
                                )}
                                {bus.distancePolicy.extraKmPrice && (
                                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-black text-orange-600">
                                            {sym}
                                            {bus.distancePolicy.extraKmPrice}
                                        </p>
                                        <p className="text-xs text-orange-500 font-bold uppercase tracking-wide">
                                            per extra km
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 mt-3">
                                <div
                                    className={cn(
                                        "flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold border",
                                        bus.driverAllowanceIncluded
                                            ? "bg-violet-50 border-violet-200 text-violet-700"
                                            : "bg-slate-50 border-slate-200 text-slate-400",
                                    )}
                                >
                                    <BadgeCheck className="w-4 h-4" /> Driver
                                    Allowance{" "}
                                    {bus.driverAllowanceIncluded
                                        ? "Included"
                                        : "Excluded"}
                                </div>
                            </div>
                            {bus.nightChargesApplicable && (
                                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mt-2">
                                    <Moon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-black text-amber-700">
                                            Night Charges from{" "}
                                            {bus.nightChargesStartTime}
                                        </p>
                                        {bus.nightChargesExtra && (
                                            <p className="text-xs text-amber-600">
                                                {sym}
                                                {bus.nightChargesExtra} extra
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Section>
                    )}

                    {bus.inclusions?.length > 0 && (
                        <Section title="Inclusions">
                            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2">
                                {bus.inclusions.map((inc, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-slate-700"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                                        </div>
                                        {inc.title}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {bus.exclusions?.length > 0 && (
                        <Section title="Exclusions">
                            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2">
                                {bus.exclusions.map((exc, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-slate-500"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                            <X className="w-3 h-3 text-red-400" />
                                        </div>
                                        {exc.title}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {bus.features?.length > 0 && (
                        <Section title="Features">
                            <div className="flex flex-wrap gap-2">
                                {bus.features.map((f, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                                    >
                                        <Zap className="w-3 h-3 text-blue-500" />{" "}
                                        {f.name}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {bus.addOns?.length > 0 && (
                        <Section title="Add-ons">
                            <div className="space-y-2">
                                {bus.addOns.map((a, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center bg-white border border-purple-100 rounded-xl px-4 py-3 shadow-sm"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                {a.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                {a.isOptional
                                                    ? "Optional"
                                                    : "Required"}
                                            </p>
                                        </div>
                                        <span className="font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg text-sm">
                                            {sym}
                                            {a.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {bus.additionalInfo?.length > 0 && (
                        <Section title="Additional Information">
                            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                                {bus.additionalInfo.map((inf, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-sm items-center border-b border-slate-50 last:border-0 last:pb-0 pb-2"
                                    >
                                        <span className="text-slate-500 font-medium">
                                            {inf.label}
                                        </span>
                                        <span className="text-slate-800 font-bold bg-slate-50 px-2 py-0.5 rounded text-xs">
                                            {inf.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {bus.policies?.length > 0 && (
                        <Section title="Policies">
                            <div className="space-y-3">
                                {bus.policies.map((p, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm"
                                    >
                                        <p className="text-sm font-black text-slate-800 mb-1">
                                            {p.title}
                                        </p>
                                        {p.description && (
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                {p.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            </div>
            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <div className="h-px w-4 bg-slate-300"></div>
                {title}
            </h4>
            {children}
        </div>
    );
}

// ─── Main InventoryView ───────────────────────────────────────────────────────
export const InventoryView = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [refreshKey, setRefreshKey] = useState(0);

    const loadVehicles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchVehicles();
            setVehicles(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    err.message ??
                    "Failed to load vehicles",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVehicles();
    }, [loadVehicles, refreshKey]);

    const handleModalClose = () => {
        setOpenModal(false);
        setRefreshKey((k) => k + 1);
    };

    const active = vehicles.filter(
        (v) => v.status === "Active" || !v.status,
    ).length;
    const maintenance = vehicles.filter(
        (v) => v.status === "Maintenance",
    ).length;
    const avgPrice = vehicles.length
        ? Math.round(
              vehicles.reduce(
                  (s, v) => s + (parseFloat(v.pricing?.price) || 0),
                  0,
              ) / vehicles.length,
          )
        : 0;

    const categories = [
        "All",
        ...new Set(vehicles.map((v) => v.category).filter(Boolean)),
    ];
    const filtered = vehicles.filter((v) => {
        const matchSearch =
            !search ||
            v.name?.toLowerCase().includes(search.toLowerCase()) ||
            v.licensePlate?.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            filterCategory === "All" || v.category === filterCategory;
        return matchSearch && matchCategory;
    });

    const sym = vehicles[0]?.pricing?.currency
        ? currSym(vehicles[0].pricing.currency)
        : "$";

    return (
        // ✅ NO blur / scale / brightness — clean wrapper
        <div className="min-h-screen">
            <div className="space-y-6 md:p-4 w-full mx-auto">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <LayoutGrid className="w-6 h-6 text-blue-600" />{" "}
                            Fleet Inventory
                        </h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">
                            Manage vehicles, check status, and view all charted
                            details.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setRefreshKey((k) => k + 1)}
                            className={cn(
                                "p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 transition-all shadow-sm",
                                loading && "animate-spin text-blue-600",
                            )}
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={() => setOpenModal(true)}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                        >
                            <Plus size={18} /> Add Vehicle
                        </button>
                    </div>
                </div>

                {/* ── Stats ── */}
                {!loading && vehicles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Fleet"
                            value={vehicles.length}
                            icon={Bus}
                            sub={`${filtered.length} shown`}
                        />
                        <StatCard
                            label="Active"
                            value={active}
                            icon={Activity}
                            sub="operational"
                        />
                        <StatCard
                            label="Maintenance"
                            value={maintenance}
                            icon={Wrench}
                            sub="in service"
                        />
                        <StatCard
                            label="Avg Price"
                            value={`${sym}${avgPrice}`}
                            icon={TrendingUp}
                            sub="per booking"
                        />
                    </div>
                )}

                {/* ── Filters ── */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full sm:max-w-xs">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or plate…"
                            className="w-full  pr-4 py-2.5 !pl-10 bg-slate-50 border border-slate-200 left-6 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        {/* Category Select */}
                        <div className="relative flex-1 sm:flex-none">
                            <select
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                                className="appearance-none !pl-10 w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 cursor-pointer"
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c === "All" ? "All Categories" : c}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={14}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                        </div>
                        {/* Clear Button */}
                        {(search || filterCategory !== "All") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setFilterCategory("All");
                                }}
                                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-700 transition-all shrink-0"
                            >
                                <X size={14} />
                                <span>Clear</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm font-medium">
                            {error}
                        </p>
                        <button
                            onClick={loadVehicles}
                            className="ml-auto text-xs font-bold text-red-600 hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Bus className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-lg font-bold text-slate-600">
                            {vehicles.length === 0
                                ? "No vehicles yet"
                                : "No results found"}
                        </p>
                        <p className="text-sm mt-1 font-medium">
                            {vehicles.length === 0
                                ? "Click 'Add Vehicle' to get started."
                                : "Try adjusting your filters."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((bus) => (
                            <VehicleCard
                                key={bus._id ?? bus.id}
                                bus={bus}
                                onSelect={setSelected}
                            />
                        ))}
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <p className="text-xs text-slate-400 text-center font-medium">
                        Showing {filtered.length} of {vehicles.length} vehicles
                    </p>
                )}
            </div>

            {/* ── Add Vehicle Modal ── */}
            {openModal && (
                // ✅ Portal-style: fixed, full-screen, z-[100], no effect on parent
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-6 px-4"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop — only blurs itself, never the dashboard */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={handleModalClose}
                    />

                    {/* ✅ Modal: max-w-[96rem] ≈ 8xl (Tailwind stops at 7xl=80rem, so we use inline style) */}
                    <div
                        className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-modal-pop"
                        style={{ maxWidth: "96rem" }} /* 8xl = 96rem */
                    >
                        {/* Accent bar */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex-shrink-0" />

                        {/* Close */}
                        <button
                            onClick={handleModalClose}
                            className="absolute right-4 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 hover:rotate-90 transition-all duration-300 shadow-sm border border-slate-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Content */}
                        <div className="p-6 md:p-10 custom-scrollbar bg-white">
                            <BusForm onSuccess={handleModalClose} />
                        </div>

                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                    </div>
                </div>
            )}

            {/* ── Detail Drawer ── */}
            <VehicleDrawer bus={selected} onClose={() => setSelected(null)} />

            <style jsx global>{`
                @keyframes modal-pop {
                    0% {
                        opacity: 0;
                        transform: scale(0.97) translateY(16px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-modal-pop {
                    animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1)
                        forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                    border: 3px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>
        </div>
    );
};
