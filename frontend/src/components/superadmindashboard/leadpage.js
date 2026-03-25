"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    Bus,
    Search,
    Users,
    Clock3,
    XCircle,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit3,
    RefreshCw,
    ChevronDown,
    X,
    Navigation,
    User,
    Mail,
    Phone,
    FileText,
    Send,
    Loader2,
    Clock,
    Trash2,
    CheckCircle,
    CreditCard,
    Copy,
    DollarSign,
} from "lucide-react";
import { getAllBookings, deleteBooking } from "@/services/bookingservice";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles = {
        confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        pending: "bg-amber-100   text-amber-700   border-amber-200",
        cancelled: "bg-red-100     text-red-700     border-red-200",
        completed: "bg-blue-100    text-blue-700    border-blue-200",
    };
    return (
        <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[status] || styles.pending}`}
        >
            {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
        </span>
    );
};

// ─── Payment Link Modal ───────────────────────────────────────────────────────
const PaymentLinkModal = ({ lead, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const paymentLink = `https://pay.yourdomain.com/booking/${lead.confirmationNumber || lead._id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendEmail = async () => {
        setSending(true);
        try {
            // TODO: replace with real API → await sendPaymentEmail(lead._id, paymentLink)
            await new Promise((r) => setTimeout(r, 1500));
            setSent(true);
            toast.success(
                "Payment link sent to " + (lead.contact?.email || "customer"),
            );
        } catch {
            toast.error("Failed to send payment link. Try again.");
        } finally {
            setSending(false);
        }
    };

    const formatCurrency = (amount = 0, currency = "USD") => {
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }).format(amount);
        } catch {
            return `$${amount}`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Send Payment Link
                            </h2>
                            <p className="text-xs text-gray-500">
                                #{lead.confirmationNumber || "N/A"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Customer summary */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {lead.contact?.firstName || "N/A"}{" "}
                                {lead.contact?.lastName || ""}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {lead.contact?.email || "No email"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {lead.contact?.phone || "No phone"}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="text-base font-bold text-gray-900">
                                {formatCurrency(
                                    lead.pricing?.totalAmount || 0,
                                    lead.pricing?.currency || "USD",
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2 text-gray-600">
                            <Navigation className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-xs text-gray-400 block">
                                    From
                                </span>
                                <span className="font-medium text-gray-800">
                                    {lead.pickupAddress || "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600 pl-6">
                            <div>
                                <span className="text-xs text-gray-400 block">
                                    To
                                </span>
                                <span className="font-medium text-gray-800">
                                    {lead.dropoffAddress || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment link */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                            Payment Link
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <span className="text-xs text-gray-600 flex-1 truncate">
                                {paymentLink}
                            </span>
                            <button
                                onClick={handleCopy}
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    copied
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {copied ? (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    {/* Send button */}
                    {!sent ? (
                        <button
                            onClick={handleSendEmail}
                            disabled={sending}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                    Sending Email...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Send Payment
                                    Link via Email
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-xl text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Payment link sent successfully!
                        </div>
                    )}

                    <p className="text-center text-xs text-gray-400">
                        Customer will receive a secure link to complete the
                        payment.
                    </p>
                </div>
            </div>
        </div>
    );
};

// ─── Lead Detail Modal ────────────────────────────────────────────────────────
const LeadDetailModal = ({ lead, onClose, onConfirm }) => {
    const fmt = (d, type = "date") => {
        if (!d) return "N/A";
        try {
            return type === "date"
                ? new Date(d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  })
                : new Date(d).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                  });
        } catch {
            return "N/A";
        }
    };
    const formatCurrency = (amount = 0, currency = "USD") => {
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }).format(amount);
        } catch {
            return `$${amount}`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-start justify-between z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {lead.contact?.firstName || "N/A"}{" "}
                            {lead.contact?.lastName || ""}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            #{lead.confirmationNumber || "N/A"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status="pending" />
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Contact */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-blue-500" />{" "}
                                Contact
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <span className="break-all">
                                        {lead.contact?.email || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{lead.contact?.phone || "N/A"}</span>
                                </div>
                                {lead.contact?.alternatePhone && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>
                                            Alt: {lead.contact.alternatePhone}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Users className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>
                                        {lead.passengers || 0} passengers
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Route */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Navigation className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Route
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1">
                                        Pickup
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {lead.pickupAddress || "N/A"}
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <ChevronDown className="w-4 h-4 text-gray-300" />
                                </div>
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-400 mb-1">
                                        Dropoff
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {lead.dropoffAddress || "N/A"}
                                    </p>
                                </div>
                                {lead.distance && (
                                    <p className="text-xs text-gray-400 text-center">
                                        {lead.distance} miles
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Booking */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-purple-500" />{" "}
                                Booking
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Vehicle:</span>
                                    <span className="font-medium text-gray-900">
                                        {lead.vehicleType || "Standard"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-medium text-gray-900">
                                        {fmt(lead.datetime)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="font-medium text-gray-900">
                                        {fmt(lead.datetime, "time")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Luggage:</span>
                                    <span className="font-medium text-gray-900">
                                        {lead.luggage || "Standard"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Booked On:</span>
                                    <span className="font-medium text-gray-900">
                                        {fmt(lead.createdAt)}
                                    </span>
                                </div>
                                {lead.pricing && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                                        {lead.pricing.breakdown?.base !=
                                            null && (
                                            <div className="flex justify-between text-xs">
                                                <span>Base fare:</span>
                                                <span>
                                                    {formatCurrency(
                                                        lead.pricing.breakdown
                                                            .base,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {lead.pricing.breakdown?.tax > 0 && (
                                            <div className="flex justify-between text-xs">
                                                <span>Tax:</span>
                                                <span>
                                                    {formatCurrency(
                                                        lead.pricing.breakdown
                                                            .tax,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200 text-sm">
                                            <span>Total:</span>
                                            <span>
                                                {formatCurrency(
                                                    lead.pricing.totalAmount,
                                                    lead.pricing.currency,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onConfirm(lead);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                        Confirm & Send Payment Link
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const LeadsDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsData, setLeadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [leadsPerPage, setLeadsPerPage] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const [detailLead, setDetailLead] = useState(null);
    const [paymentLead, setPaymentLead] = useState(null);

    const fetchLeads = async (page = 1, limit = leadsPerPage) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllBookings({ page, limit });
            // Force all leads to "pending"
            const bookings = (response.data?.bookings || []).map((b) => ({
                ...b,
                status: "pending",
            }));
            setLeadsData(bookings);
            setTotalPages(response.data?.totalPages || 1);
            setTotalRecords(response.data?.totalRecords || bookings.length);
            setCurrentPage(page);
        } catch (err) {
            setError(err.message || "Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [leadsPerPage]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this lead? This cannot be undone.")) return;
        try {
            await deleteBooking(id);
            toast.success("Lead deleted");
            fetchLeads(currentPage);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete lead");
        }
    };

    const formatDate = (d) => {
        if (!d) return "N/A";
        try {
            return new Date(d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "N/A";
        }
    };
    const formatTime = (d) => {
        if (!d) return "N/A";
        try {
            return new Date(d).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "N/A";
        }
    };
    const formatCurrency = (amount = 0, currency = "USD") => {
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }).format(amount);
        } catch {
            return `$${amount}`;
        }
    };

    const filteredLeads = leadsData.filter((lead) => {
        const q = searchQuery.toLowerCase();
        return (
            (lead.contact?.firstName || "").toLowerCase().includes(q) ||
            (lead.contact?.lastName || "").toLowerCase().includes(q) ||
            (lead.contact?.email || "").toLowerCase().includes(q) ||
            (lead.confirmationNumber || "").toLowerCase().includes(q) ||
            (lead.pickupAddress || "").toLowerCase().includes(q) ||
            (lead.dropoffAddress || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="max-w-8xl mx-auto">
            {/* ── Modals ── */}
            {detailLead && (
                <LeadDetailModal
                    lead={detailLead}
                    onClose={() => setDetailLead(null)}
                    onConfirm={(lead) => setPaymentLead(lead)}
                />
            )}
            {paymentLead && (
                <PaymentLinkModal
                    lead={paymentLead}
                    onClose={() => setPaymentLead(null)}
                />
            )}

            {/* ── Stats: 4 Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Leads */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-600 rounded-full p-3 mb-3 shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                            Total Leads
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {totalRecords}
                        </p>
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-amber-500 rounded-full p-3 mb-3 shadow-lg">
                            <Clock3 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                            Pending
                        </h3>
                        <p className="text-2xl font-bold text-amber-600">
                            {
                                leadsData.filter((l) => l.status === "pending")
                                    .length
                            }
                        </p>
                    </div>
                </div>

                {/* Confirmed */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-emerald-500 rounded-full p-3 mb-3 shadow-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                            Confirmed
                        </h3>
                        <p className="text-2xl font-bold text-emerald-600">
                            {
                                leadsData.filter(
                                    (l) => l.status === "confirmed",
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-purple-600 rounded-full p-3 mb-3 shadow-lg">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                            Total Revenue
                        </h3>
                        <p className="text-2xl font-bold text-purple-600">
                            {formatCurrency(
                                leadsData
                                    .filter((l) => l.status !== "cancelled")
                                    .reduce(
                                        (acc, l) =>
                                            acc + (l.pricing?.totalAmount || 0),
                                        0,
                                    ),
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Filters / Search ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">
                            Filters
                        </span>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                        {showFilters ? "Hide" : "Show"}
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, confirmation, route..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full !pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                Show
                            </span>
                            <select
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={leadsPerPage}
                                onChange={(e) => {
                                    setLeadsPerPage(Number(e.target.value));
                                    fetchLeads(1, Number(e.target.value));
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                entries
                            </span>
                        </div>
                        <button
                            onClick={() => fetchLeads(currentPage)}
                            disabled={loading}
                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </button>
                    </div>
                    {showFilters && searchQuery && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium">
                            Loading leads...
                        </p>
                    </div>
                </div>
            )}

            {/* ── Error ── */}
            {error && !loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-red-600 font-semibold">
                            Failed to load leads
                        </p>
                        <p className="text-gray-500 text-sm">{error}</p>
                        <button
                            onClick={() => fetchLeads(currentPage)}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            {!loading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Lead Info
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Route
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Schedule
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLeads.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Bus className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600 font-semibold">
                                                    No leads found
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {searchQuery
                                                        ? "Try adjusting your search"
                                                        : "Leads will appear here when customers book trips"}
                                                </p>
                                                {searchQuery && (
                                                    <button
                                                        onClick={() =>
                                                            setSearchQuery("")
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        Clear Search
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead, index) => (
                                        <tr
                                            key={lead._id || lead.id || index}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {/* # */}
                                            <td className="px-4 py-4 text-sm text-gray-400">
                                                {(currentPage - 1) *
                                                    leadsPerPage +
                                                    index +
                                                    1}
                                            </td>

                                            {/* Lead Info */}
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    {lead.contact?.firstName ||
                                                        "N/A"}{" "}
                                                    {lead.contact?.lastName ||
                                                        ""}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {lead.confirmationNumber ||
                                                        "N/A"}{" "}
                                                    • {lead.passengers || 0} pax
                                                </p>
                                            </td>

                                            {/* Route */}
                                            <td className="px-4 py-4 max-w-[200px]">
                                                <div className="flex items-start gap-1.5 text-sm text-gray-700">
                                                    <Navigation className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                                                    <span
                                                        className="line-clamp-1"
                                                        title={
                                                            lead.pickupAddress
                                                        }
                                                    >
                                                        {lead.pickupAddress ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500 pl-5 mt-0.5">
                                                    <span
                                                        className="line-clamp-1"
                                                        title={
                                                            lead.dropoffAddress
                                                        }
                                                    >
                                                        →{" "}
                                                        {lead.dropoffAddress ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Schedule */}
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-gray-700">
                                                    {formatDate(lead.datetime)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />{" "}
                                                    {formatTime(lead.datetime)}
                                                </div>
                                            </td>

                                            {/* Status — always pending */}
                                            <td className="px-4 py-4">
                                                <StatusBadge status="pending" />
                                            </td>

                                            {/* Amount */}
                                            <td className="px-4 py-4 text-right">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(
                                                        lead.pricing
                                                            ?.totalAmount || 0,
                                                        lead.pricing
                                                            ?.currency || "USD",
                                                    )}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    {/* View details popup */}
                                                    <button
                                                        onClick={() =>
                                                            setDetailLead(lead)
                                                        }
                                                        className="p-1.5 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {/* Confirm → opens payment link popup directly */}
                                                    <button
                                                        onClick={() =>
                                                            setPaymentLead(lead)
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                                                        title="Confirm Lead"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Confirm
                                                    </button>

                                                    {/* Edit */}
                                                    <button
                                                        className="p-1.5 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                lead._id ||
                                                                    lead.id,
                                                            )
                                                        }
                                                        className="p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredLeads.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t border-gray-200 gap-4">
                            <p className="text-sm text-gray-600">
                                Showing{" "}
                                <b>
                                    {Math.min(
                                        (currentPage - 1) * leadsPerPage + 1,
                                        totalRecords,
                                    )}
                                </b>{" "}
                                to{" "}
                                <b>
                                    {Math.min(
                                        currentPage * leadsPerPage,
                                        totalRecords,
                                    )}
                                </b>{" "}
                                of <b>{totalRecords}</b> entries
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const p = Math.max(1, currentPage - 1);
                                        setCurrentPage(p);
                                        fetchLeads(p);
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                {Array.from(
                                    { length: Math.min(3, totalPages) },
                                    (_, i) => i + 1,
                                ).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => {
                                            setCurrentPage(pageNum);
                                            fetchLeads(pageNum);
                                        }}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-white"}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                                {totalPages > 3 && (
                                    <span className="px-2 py-1.5 text-gray-400">
                                        ...
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        const p = Math.min(
                                            totalPages,
                                            currentPage + 1,
                                        );
                                        setCurrentPage(p);
                                        fetchLeads(p);
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeadsDashboard;
