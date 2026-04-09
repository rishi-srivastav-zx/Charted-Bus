"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, User, Mail, X } from "lucide-react";
import { cn } from "../../../../app/lib/uitls";
import { COUNTRY_CODES } from "./options";

const ContactFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        countryCode: "+1",
        phone: "",
        email: "",
        firstName: "",
        lastName: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen]);

    const validateField = (name, value) => {
        switch (name) {
            case "phone":
                return value.trim().length >= 10
                    ? ""
                    : "Please enter a valid phone number";
            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ""
                    : "Please enter a valid email address";
            case "firstName":
                return value.trim().length >= 2 ? "" : "First name is required";
            case "lastName":
                return value.trim().length >= 2 ? "" : "Last name is required";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        let hasErrors = false;

        Object.keys(formData).forEach((key) => {
            if (key !== "countryCode") {
                const error = validateField(key, formData[key]);
                if (error) {
                    newErrors[key] = error;
                    hasErrors = true;
                }
            }
        });

        setErrors(newErrors);
        setTouched({
            phone: true,
            email: true,
            firstName: true,
            lastName: true,
        });

        if (!hasErrors) {
            onSubmit(formData);
            onClose();
            // Navigate to confirmation page from inside the modal
            router.push("/bookingform/vechileselect/confirmation");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Booking Contact
                        </h2>
                        <p className="text-sm text-slate-500">
                            Please provide your contact details
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="gap-2">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="w-36 shrink-0 py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            >
                                {COUNTRY_CODES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.code} ({c.name})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="flex-1 py-2.5 px-3 mt-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        {errors.phone && touched.phone && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="john.doe@example.com"
                                className={cn(
                                    "w-full !pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                                    errors.email && touched.email
                                        ? "border-red-300 focus:border-red-400 bg-red-50"
                                        : "border-slate-200 focus:border-blue-400",
                                )}
                            />
                        </div>
                        {errors.email && touched.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="John"
                                className={cn(
                                    "w-full !pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                                    errors.firstName && touched.firstName
                                        ? "border-red-300 focus:border-red-400 bg-red-50"
                                        : "border-slate-200 focus:border-blue-400",
                                )}
                            />
                        </div>
                        {errors.firstName && touched.firstName && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Doe"
                                className={cn(
                                    "w-full !pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                                    errors.lastName && touched.lastName
                                        ? "border-red-300 focus:border-red-400 bg-red-50"
                                        : "border-slate-200 focus:border-blue-400",
                                )}
                            />
                        </div>
                        {errors.lastName && touched.lastName && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{" "}
                                {errors.lastName}
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            Continue to Next Step
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full mt-3 py-2.5 text-slate-500 font-medium hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactFormModal;
