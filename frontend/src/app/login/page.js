"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bus,
    ShieldCheck,
    X,
    CheckCircle2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Star,
} from "lucide-react";

const UserRole = {
    SUPER_ADMIN: "SUPER_ADMIN",
    OPERATOR: "OPERATOR",
};

const Button = ({
    children,
    type = "button",
    className = "",
    isLoading = false,
    onClick,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-5 w-5 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                children
            )}
        </button>
    );
};

import { useAuth } from "../../services/useAuth";

export default function LoginPopup({ onLogin, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(UserRole.SUPER_ADMIN);
    const { login, isLoading, error } = useAuth(onLogin);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);

        if (res.success && !onLogin) {
            router.push("/dashboard");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-white rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[640px] animate-in zoom-in-95 duration-200">
            {/* ── Left Branding Side ── */}
            <div className="w-full md:w-5/12 relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover opacity-90 transition-transform duration-10000 hover:scale-110"
                        alt="Luxury Bus"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                </div>

                <div className="relative z-10 p-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Bus className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter text-white uppercase">
                                    FREEDOM
                                </span>
                                <span className="text-[10px] font-semibold tracking-widest text-red-600">
                                    CHARTER BUS USA
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: (
                                        <ShieldCheck
                                            size={14}
                                            className="text-white"
                                        />
                                    ),
                                    title: "Omni Assured",
                                    desc: "Enterprise-grade operational coverage and reliability.",
                                },
                                {
                                    icon: (
                                        <CheckCircle2
                                            size={14}
                                            className="text-white"
                                        />
                                    ),
                                    title: "Free Management",
                                    desc: "Transparent pricing with zero hidden infrastructure fees.",
                                },
                                {
                                    icon: (
                                        <Star
                                            size={14}
                                            className="text-white"
                                        />
                                    ),
                                    title: "4.9★ Fleet Rating",
                                    desc: "Trusted by 500+ global charter operators daily.",
                                },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} className="flex gap-4 group">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mt-1 border border-white/20 group-hover:bg-blue-600 transition-colors">
                                        {icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">
                                            {title}
                                        </h4>
                                        <p className="text-xs text-white/60 leading-relaxed mt-1">
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-rose-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                            <div className="relative px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg inline-block">
                                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                                    Global Operations Live
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Form Side ── */}
            <div className="w-full md:w-7/12 p-8 md:p-14 relative flex flex-col justify-center bg-white">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 text-neutral-300 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-all"
                >
                    <X size={24} />
                </button>

                <div className="max-w-[400px] mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="flex items-start gap-2 text-3xl font-bold text-neutral-900 mb-4 ml-10">
                            <span>Login to</span>
                            <span className="relative flex flex-col leading-none">
                                <span className="text-2xl font-black tracking-tighter text-black uppercase">
                                    FREEDOM
                                </span>
                                <span className="ml-3 text-[10px] font-semibold tracking-widest text-red-600 uppercase">
                                    CHARTER BUS USA
                                </span>
                            </span>
                        </h2>
                        <p className="text-sm text-neutral-500 ml-12">
                            Access your enterprise dashboard
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <X size={18} className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {/* EMAIL */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                                        <Mail
                                            size={18}
                                            className="text-neutral-400"
                                        />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 !pl-14 pr-4 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <a
                                        href="#"
                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        Forgot?
                                    </a>
                                </div>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                                        <Lock
                                            size={18}
                                            className="text-neutral-400"
                                        />
                                    </span>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 !pl-14 !pr-14 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    {/* FIX: eye button also uses inset-y-0 pattern */}
                                    <span className="absolute inset-y-0 right-4 flex items-center z-10">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="text-neutral-400 hover:text-neutral-700 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Role Selector + Submit */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] text-center block">
                                    System Context
                                </span>
                                <div className="flex p-1.5 bg-neutral-100/80 rounded-2xl gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedRole(
                                                UserRole.SUPER_ADMIN,
                                            )
                                        }
                                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                                            selectedRole ===
                                            UserRole.SUPER_ADMIN
                                                ? "bg-white text-blue-600 shadow-lg"
                                                : "text-neutral-400"
                                        }`}
                                    >
                                        SuperAdmin
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedRole(UserRole.OPERATOR)
                                        }
                                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                                            selectedRole === UserRole.OPERATOR
                                                ? "bg-white text-blue-600 shadow-lg"
                                                : "text-neutral-400"
                                        }`}
                                    >
                                        Operator
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl bg-neutral-900 text-white font-bold text-base hover:bg-blue-600 shadow-xl shadow-neutral-900/10 active:scale-[0.98] transition-all"
                                isLoading={isLoading}
                            >
                                Sign In to Workspace
                            </Button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-neutral-300 font-bold tracking-widest">
                                Single Sign-On
                            </span>
                        </div>
                    </div>

                    {/* Google SSO */}
                    <button className="w-full h-14 rounded-2xl border-2 border-neutral-100 flex items-center justify-center gap-3 hover:bg-neutral-50 transition-all group active:scale-[0.98]">
                        <img
                            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                            className="w-5 h-5 group-hover:scale-110 transition-transform"
                            alt="Google"
                        />
                        <span className="text-sm font-bold text-neutral-700">
                            Continue with Google
                        </span>
                    </button>

                    {/* Footer */}
                    <p className="text-[11px] text-center text-neutral-400 leading-relaxed px-4 mt-10">
                        By accessing the system, you agree to our <br />
                        <a
                            href="#"
                            className="font-bold text-neutral-900 hover:underline"
                        >
                            Enterprise Agreement
                        </a>{" "}
                        &{" "}
                        <a
                            href="#"
                            className="font-bold text-neutral-900 hover:underline"
                        >
                            Privacy Shield
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
