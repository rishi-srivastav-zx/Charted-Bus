"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
    X,
    Edit3,
    User,
    Mail,
    Phone,
    Navigation,
    MapPin,
    Calendar,
    Clock,
    Users,
    Car,
    Briefcase,
    DollarSign,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { updateBooking } from "../../../services/bookingservice";

const EditLeadModal = ({ lead, onClose, onSave }) => {
    const [saving, setSaving] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState("contact");
    const modalRef = useRef(null);

    const [form, setForm] = useState({
        firstName: lead.contact?.firstName || "",
        lastName: lead.contact?.lastName || "",
        email: lead.contact?.email || "",
        phone: lead.contact?.phone || "",
        alternatePhone: lead.contact?.alternatePhone || "",
        passengers: lead.passengers || 1,
        pickupAddress: lead.pickupAddress || "",
        dropoffAddress: lead.dropoffAddress || "",
        vehicleType: lead.vehicleType || "Standard",
        luggage: lead.luggage || "Standard",
        datetime: lead.datetime
            ? new Date(lead.datetime).toISOString().slice(0, 16)
            : "",
        totalAmount: lead.pricing?.totalAmount || 0,
        currency: lead.pricing?.currency || "USD",
        status: lead.status || "pending",
    });

    // Entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async () => {
      // Validation
      if (!form.firstName.trim()) {
          toast.error("First name is required", {
              icon: <AlertCircle className="w-4 h-4" />,
          });
          return;
      }
      if (!form.email.trim()) {
          toast.error("Email is required", {
              icon: <AlertCircle className="w-4 h-4" />,
          });
          return;
      }

      setSaving(true);
      try {
          const payload = {
              contact: {
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                  phone: form.phone,
                  alternatePhone: form.alternatePhone,
              },
              passengers: Number(form.passengers),
              pickupAddress: form.pickupAddress,
              dropoffAddress: form.dropoffAddress,
              vehicleType: form.vehicleType,
              luggage: form.luggage,
              datetime: form.datetime
                  ? new Date(form.datetime).toISOString()
                  : null,
              status: form.status,
              pricing: {
                  totalAmount: Number(form.totalAmount),
                  currency: form.currency,
              },
          };

         
          const response = await updateBooking(lead._id, payload);

          toast.success("Lead updated successfully!", {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
              duration: 3000,
          });

          
          onSave?.(response.data || { ...lead, ...payload });
          handleClose();
      } catch (error) {
          console.error("Update error:", error);
          toast.error(
              error?.response?.data?.message ||
                  "Failed to save changes. Try again.",
              { icon: <AlertCircle className="w-4 h-4" /> },
          );
      } finally {
          setSaving(false);
      }
  };

    const sections = [
        { id: "contact", label: "Contact", icon: User },
        { id: "route", label: "Route", icon: Navigation },
        { id: "details", label: "Details", icon: Calendar },
        { id: "pricing", label: "Pricing", icon: DollarSign },
    ];

    const statusColors = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        completed: "bg-blue-100 text-blue-700 border-blue-200",
        cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={handleClose}
                style={{
                    background:
                        "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.7) 100%)",
                }}
            />

            {/* Main Modal */}
            <div
                ref={modalRef}
                className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    isVisible
                        ? "scale-100 translate-y-0"
                        : "scale-95 translate-y-4"
                }`}
            >
                {/* Header */}
                <div className="relative flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 pointer-events-none" />
                    <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Edit3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Edit Lead
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                    #{lead.confirmationNumber || "N/A"}
                                </span>
                                <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[form.status]}`}
                                >
                                    {form.status.charAt(0).toUpperCase() +
                                        form.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-all duration-200 hover:rotate-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1 px-6 py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto shrink-0">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                    isActive
                                        ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                }`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${isActive ? "text-blue-500" : "text-slate-400"}`}
                                />
                                {section.label}
                            </button>
                        );
                    })}
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6 bg-white">
                    {/* Contact Section */}
                    {activeSection === "contact" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionHeader
                                icon={<User className="w-5 h-5" />}
                                title="Contact Information"
                                subtitle="Personal details and communication preferences"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                <FloatingInput
                                    label="First Name"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    icon={<User className="w-4 h-4" />}
                                    required
                                    autoFocus
                                />
                                <FloatingInput
                                    label="Last Name"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    icon={<User className="w-4 h-4" />}
                                />
                                <FloatingInput
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    icon={<Mail className="w-4 h-4" />}
                                    required
                                    className="md:col-span-2"
                                />
                                <FloatingInput
                                    label="Phone Number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    icon={<Phone className="w-4 h-4" />}
                                />
                                <FloatingInput
                                    label="Alternative Phone"
                                    name="alternatePhone"
                                    value={form.alternatePhone}
                                    onChange={handleChange}
                                    icon={<Phone className="w-4 h-4" />}
                                />
                            </div>
                        </div>
                    )}

                    {/* Route Section */}
                    {activeSection === "route" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionHeader
                                icon={<Navigation className="w-5 h-5" />}
                                title="Route Details"
                                subtitle="Pickup and dropoff locations"
                            />
                            <div className="space-y-5 mt-4">
                                <LocationInput
                                    label="Pickup Address"
                                    name="pickupAddress"
                                    value={form.pickupAddress}
                                    onChange={handleChange}
                                    icon={
                                        <MapPin className="w-5 h-5 text-emerald-500" />
                                    }
                                    color="emerald"
                                />
                                <div className="flex justify-center -my-2 relative z-10">
                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        <div className="w-1 h-4 bg-slate-300 rounded-full" />
                                    </div>
                                </div>
                                <LocationInput
                                    label="Dropoff Address"
                                    name="dropoffAddress"
                                    value={form.dropoffAddress}
                                    onChange={handleChange}
                                    icon={
                                        <MapPin className="w-5 h-5 text-rose-500" />
                                    }
                                    color="rose"
                                />
                            </div>
                        </div>
                    )}

                    {/* Details Section */}
                    {activeSection === "details" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionHeader
                                icon={<Calendar className="w-5 h-5" />}
                                title="Booking Details"
                                subtitle="Schedule, vehicle, and passenger information"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                <FloatingInput
                                    label="Date & Time"
                                    name="datetime"
                                    type="datetime-local"
                                    value={form.datetime}
                                    onChange={handleChange}
                                    icon={<Clock className="w-4 h-4" />}
                                    className="md:col-span-2"
                                />
                                <FloatingInput
                                    label="Passengers"
                                    name="passengers"
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={form.passengers}
                                    onChange={handleChange}
                                    icon={<Users className="w-4 h-4" />}
                                />
                                <SelectInput
                                    label="Vehicle Type"
                                    name="vehicleType"
                                    value={form.vehicleType}
                                    onChange={handleChange}
                                    icon={<Car className="w-4 h-4" />}
                                    options={[
                                        "Standard",
                                        "Premium",
                                        "SUV",
                                        "Van",
                                        "Luxury",
                                        "Minibus",
                                        "Coach",
                                    ]}
                                />
                                <SelectInput
                                    label="Luggage"
                                    name="luggage"
                                    value={form.luggage}
                                    onChange={handleChange}
                                    icon={<Briefcase className="w-4 h-4" />}
                                    options={[
                                        "None",
                                        "Standard",
                                        "Extra",
                                        "Oversized",
                                    ]}
                                />
                                <SelectInput
                                    label="Status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    icon={<Sparkles className="w-4 h-4" />}
                                    options={[
                                        { value: "pending", label: "Pending" },
                                        {
                                            value: "confirmed",
                                            label: "Confirmed",
                                        },
                                        {
                                            value: "completed",
                                            label: "Completed",
                                        },
                                        {
                                            value: "cancelled",
                                            label: "Cancelled",
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {/* Pricing Section */}
                    {activeSection === "pricing" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <SectionHeader
                                icon={<DollarSign className="w-5 h-5" />}
                                title="Pricing Details"
                                subtitle="Cost breakdown and currency selection"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                <FloatingInput
                                    label="Total Amount"
                                    name="totalAmount"
                                    type="number"
                                    min={0}
                                    value={form.totalAmount}
                                    onChange={handleChange}
                                    icon={<DollarSign className="w-4 h-4" />}
                                />
                                <SelectInput
                                    label="Currency"
                                    name="currency"
                                    value={form.currency}
                                    onChange={handleChange}
                                    icon={<DollarSign className="w-4 h-4" />}
                                    options={[
                                        "USD",
                                        "EUR",
                                        "GBP",
                                        "CAD",
                                        "AUD",
                                        "INR",
                                    ]}
                                />
                            </div>

                            <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-slate-600">
                                        Subtotal
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {form.currency} {form.totalAmount}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                    <span className="text-base font-bold text-slate-900">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {form.currency} {form.totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-8 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={handleClose}
                            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .animate-in {
                    animation-fill-mode: both;
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slide-in-from-bottom-2 {
                    from {
                        transform: translateY(8px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .slide-in-from-bottom-2 {
                    animation: slide-in-from-bottom-2 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

/* ── Fixed Components ── */

const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-3 mb-2">
        <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-blue-600">{icon}</div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
    </div>
);

// FIXED: Proper floating label that handles pre-filled values
const FloatingInput = ({
    label,
    name,
    value,
    onChange,
    icon,
    required,
    type = "text",
    className = "",
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Check if field has value (handles 0 for numbers, empty strings, etc.)
    const hasValue = value !== undefined && value !== null && value !== "";
    const shouldFloat = hasValue || isFocused;

    return (
        <div className={`relative ${className}`}>
            <div
                className={`
                relative bg-white rounded-xl border transition-all duration-200
                ${
                    isFocused
                        ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300"
                }
            `}
            >
                {/* Icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {icon}
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-transparent focus:outline-none !pl-10 pr-4 py-3.5"
                    placeholder={label} // Always use label as placeholder (transparent when floating)
                    {...props}
                />

                {/* Floating Label - positioned above when has value or focused */}
                <label
                    htmlFor={name}
                    className={`
                        absolute left-0 text-xs font-medium transition-all duration-200 pointer-events-none bg-white px-1
                        ${
                            shouldFloat
                                ? "-top-2 left-2 text-blue-600 text-[11px] z-10"
                                : "left-10 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
                        }
                    `}
                >
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            </div>
        </div>
    );
};

const SelectInput = ({ label, name, value, onChange, icon, options }) => {
    const getOptionLabel = (opt) => (typeof opt === "string" ? opt : opt.label);
    const getOptionValue = (opt) => (typeof opt === "string" ? opt : opt.value);

    return (
        <div className="relative">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                <span className="text-slate-400">{icon}</span>
                {label}
            </label>
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full appearance-none px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 transition-all duration-200 cursor-pointer"
                >
                    {options.map((opt) => (
                        <option
                            key={getOptionValue(opt)}
                            value={getOptionValue(opt)}
                        >
                            {getOptionLabel(opt)}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
            </div>
        </div>
    );
};

const LocationInput = ({ label, name, value, onChange, icon, color }) => {
    const colors = {
        emerald:
            "focus-within:border-emerald-500 focus-within:ring-emerald-500/10",
        rose: "focus-within:border-rose-500 focus-within:ring-rose-500/10",
    };

    return (
        <div className="relative">
            <div
                className={`
                relative bg-white rounded-xl border border-slate-200 overflow-hidden
                transition-all duration-200 shadow-sm
                focus-within:shadow-lg
                ${colors[color]}
            `}
            >
                <div className="absolute left-4 top-4">{icon}</div>
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={2}
                    className="w-full !pl-12 pr-4 py-3.5 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
                    placeholder={label}
                />
            </div>
        </div>
    );
};

export default EditLeadModal;
