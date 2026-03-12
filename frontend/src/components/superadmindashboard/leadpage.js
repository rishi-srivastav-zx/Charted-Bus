"use client";

import React, { useState, useEffect } from "react";
import {
    Bus,
    Search,
    Plus,
    Bell,
    Mail,
    Phone,
    Trash2,
    MapPin,
    Calendar,
    Users,
    Clock,
    CheckCircle,
    Clock3,
    XCircle,
    MoreHorizontal,
    Filter,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Edit3,
    RefreshCw,
} from "lucide-react";
import { getAllBookings } from "@/services/bookingservice";

const LeadsDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsData, setLeadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLeads = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllBookings({ page, limit: 20 });
            
            const bookings = response.data?.bookings || [];
            setLeadsData(bookings);
            setTotalPages(response.data?.totalPages || 1);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError(err.message || "Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleRefresh = () => {
        fetchLeads(currentPage);
    };

    // Stats calculation
    const stats = {
        total: leadsData.length,
        confirmed: leadsData.filter((l) => l.status === "confirmed").length,
        pending: leadsData.filter((l) => l.status === "pending").length,
        completed: leadsData.filter((l) => l.status === "completed").length,
        revenue: leadsData
            .filter((l) => l.status !== "cancelled")
            .reduce((acc, curr) => acc + (curr.pricing?.totalAmount || 0), 0),
    };

    // Filter leads
    const filteredLeads = leadsData.filter((lead) => {
        const firstName = lead.contact?.firstName || "";
        const lastName = lead.contact?.lastName || "";
        const email = lead.contact?.email || "";
        const confNum = lead.confirmationNumber || "";
        
        const matchesSearch =
            firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            confNum.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Format helpers
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "N/A";
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleTimeString("en-US", {
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
                currency: currency,
            }).format(amount);
        } catch {
            return `$${amount}`;
        }
    };

    const getInitials = (firstName, lastName) => {
        const first = firstName?.charAt(0) || "";
        const last = lastName?.charAt(0) || "";
        return `${first}${last}`.toUpperCase() || "?";
    };

    const getAvatarColor = (id) => {
        const colors = [
            "from-blue-500 to-indigo-600",
            "from-emerald-500 to-teal-600",
            "from-purple-500 to-pink-600",
            "from-orange-500 to-red-600",
            "from-cyan-500 to-blue-600",
            "from-violet-500 to-purple-600",
        ];
        return colors[parseInt(id) % colors.length];
    };

    // Status badge component
    const StatusBadge = ({ status, type = "default" }) => {
        const styles = {
            confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
            pending: "bg-amber-100 text-amber-800 border-amber-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
            completed: "bg-blue-100 text-blue-800 border-blue-200",
            paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
            unpaid: "bg-rose-100 text-rose-800 border-rose-200",
            refunded: "bg-slate-100 text-slate-800 border-slate-200",
        };

        const labels = {
            confirmed: "Confirmed",
            pending: "Pending",
            cancelled: "Cancelled",
            completed: "Completed",
            paid: "Paid",
            unpaid: "Unpaid",
            refunded: "Refunded",
        };

        return (
            <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[status] || styles.pending}`}
            >
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Main Content */}
            <main className="max-w-8xl mx-auto px-4 ">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <Bus className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                +12%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            {stats.total}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Total Leads
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                +5%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            {stats.confirmed}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Confirmed</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <Clock3 className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                {stats.pending} new
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            {stats.pending}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Pending</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <Download className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                +23%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            {formatCurrency(stats.revenue)}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Total Revenue
                        </p>
                    </div>
                </div>

                {/* Filters & Controls */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                            {/* Search */}
                            <div className="flex-1 w-full lg:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, confirmation number..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full !pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2 flex-wrap items-center">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="!pl-9 !pr-8 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="confirmed">
                                            Confirmed
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                    <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-270 pointer-events-none" />
                                </div>

                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                                    />
                                    Refresh
                                </button>

                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm">
                                    <Plus className="w-4 h-4" />
                                    New Lead
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">
                                Loading leads...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <p className="text-red-600 font-semibold">
                                Failed to load leads
                            </p>
                            <p className="text-slate-500 text-sm">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Leads Display */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Lead Info
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Route
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredLeads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(
                                                        lead.id,
                                                    )} rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                                                >
                                                    {getInitials(
                                                        lead.contact
                                                            ?.firstName || "",
                                                        lead.contact
                                                            ?.lastName || "",
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {lead.contact
                                                            ?.firstName ||
                                                            "N/A"}{" "}
                                                        {lead.contact
                                                            ?.lastName || ""}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {lead.confirmationNumber ||
                                                            "N/A"}{" "}
                                                        • {lead.passengers || 0}{" "}
                                                        passengers
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-700 line-clamp-1">
                                                    {lead.pickupAddress ||
                                                        "N/A"}
                                                </p>
                                                <p className="text-sm text-slate-500 line-clamp-1">
                                                    →{" "}
                                                    {lead.dropoffAddress ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700">
                                                {formatDate(lead.datetime)}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {formatTime(lead.datetime)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <StatusBadge
                                                    status={lead.status}
                                                />
                                                <span className="text-xs text-slate-500">
                                                    {lead.paymentStatus ===
                                                    "paid"
                                                        ? "Paid"
                                                        : "Payment pending"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span
                                                className={`text-base font-bold ${
                                                    lead.status === "cancelled"
                                                        ? "text-slate-400 line-through"
                                                        : "text-slate-900"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    lead.pricing?.totalAmount ||
                                                        0,
                                                    lead.pricing?.currency ||
                                                        "USD",
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {!loading && !error && filteredLeads.length === 0 && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                <Bus className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-semibold">
                                No leads found
                            </p>
                            <p className="text-slate-500 text-sm">
                                {searchQuery || statusFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "Leads will appear here when customers book trips"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-600">
                        Showing {filteredLeads.length} of {leadsData.length}{" "}
                        leads
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                            1
                        </button>
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition-colors">
                            3
                        </button>
                        <span className="px-2 py-2 text-slate-400">...</span>
                        <button
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition-colors flex items-center gap-1"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LeadsDashboard;
