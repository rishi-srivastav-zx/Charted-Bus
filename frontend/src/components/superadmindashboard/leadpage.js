"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
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
    ChevronDown,
    X,
    ChevronUp,
    Navigation,
    User,
    CreditCard,
    DollarSign,
    FileText,
} from "lucide-react";
import { getAllBookings, deleteBooking } from "@/services/bookingservice";

const LeadsDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsData, setLeadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [leadsPerPage, setLeadsPerPage] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});

    const fetchLeads = async (page = 1, limit = leadsPerPage) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllBookings({ page, limit });

            const bookings = response.data?.bookings || [];
            setLeadsData(bookings);
            setTotalPages(response.data?.totalPages || 1);
            setTotalRecords(response.data?.totalRecords || bookings.length);
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
    }, [leadsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchLeads(1);
    }, [statusFilter, searchQuery]);

    const handleRefresh = () => {
        fetchLeads(currentPage);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
            return;
        }
        
        try {
            await deleteBooking(id);
            toast.success("Lead deleted successfully");
            fetchLeads(currentPage);
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast.error(error.response?.data?.message || "Failed to delete lead");
        }
    };

    const stats = [
        {
            id: 1,
            title: "Total Leads",
            count: totalRecords,
            icon: Users,
            color: "bg-blue-600",
            textColor: "text-blue-600",
            filter: "all",
        },
        {
            id: 2,
            title: "Confirmed",
            count: leadsData.filter((l) => l.status === "confirmed").length,
            icon: CheckCircle,
            color: "bg-emerald-500",
            textColor: "text-emerald-600",
            filter: "confirmed",
        },
        {
            id: 3,
            title: "Pending",
            count: leadsData.filter((l) => l.status === "pending").length,
            icon: Clock3,
            color: "bg-amber-500",
            textColor: "text-amber-600",
            filter: "pending",
        },
        {
            id: 4,
            title: "Revenue",
            count: leadsData
                .filter((l) => l.status !== "cancelled")
                .reduce(
                    (acc, curr) => acc + (curr.pricing?.totalAmount || 0),
                    0,
                ),
            icon: Download,
            color: "bg-purple-600",
            textColor: "text-purple-600",
            isCurrency: true,
        },
    ];

    const filteredLeads = leadsData.filter((lead) => {
        const firstName = lead.contact?.firstName || "";
        const lastName = lead.contact?.lastName || "";
        const email = lead.contact?.email || "";
        const confNum = lead.confirmationNumber || "";
        const pickup = lead.pickupAddress || "";
        const dropoff = lead.dropoffAddress || "";

        const matchesSearch =
            firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            confNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dropoff.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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
                maximumFractionDigits: 0,
            }).format(amount);
        } catch {
            return `$${amount}`;
        }
    };

    const toggleRow = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleStatClick = (filter) => {
        if (filter === "all") {
            setStatusFilter("all");
        } else {
            setStatusFilter(filter);
        }
    };

    const clearFilters = () => {
        setStatusFilter("all");
        setSearchQuery("");
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
            completed: "bg-blue-100 text-blue-700 border-blue-200",
        };

        return (
            <span
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[status] || styles.pending}`}
            >
                {status?.charAt(0).toUpperCase() + status?.slice(1) ||
                    "Pending"}
            </span>
        );
    };

    const PaymentBadge = ({ status }) => {
        const styles = {
            paid: "bg-emerald-100 text-emerald-700",
            unpaid: "bg-red-100 text-red-700",
            pending: "bg-amber-100 text-amber-700",
        };

        return (
            <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.pending}`}
            >
                {status?.charAt(0).toUpperCase() + status?.slice(1) ||
                    "Pending"}
            </span>
        );
    };

    return (
        <div className="max-w-8xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const isActive =
                        statusFilter === stat.filter ||
                        (stat.filter === "all" && statusFilter === "all");
                    return (
                        <div
                            key={stat.id}
                            onClick={() => handleStatClick(stat.filter)}
                            className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 border-2 cursor-pointer ${
                                isActive
                                    ? "border-blue-500 shadow-md"
                                    : "border-transparent hover:border-gray-200"
                            }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={`${stat.color} rounded-full p-3 mb-3 shadow-lg`}
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-1">
                                    {stat.title}
                                </h3>
                                <p
                                    className={`text-2xl font-bold ${stat.textColor}`}
                                >
                                    {stat.isCurrency
                                        ? formatCurrency(stat.count)
                                        : stat.count}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Combined Filter & Search Bar */}
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

                {/* Search always visible, filters expandable */}
                <div className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, confirmation, route..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full !pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                Show
                            </span>
                            <select
                                className="border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </button>
                    </div>

                    {/* Expandable Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setStatusFilter("all")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        statusFilter === "all"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    All Status
                                </button>
                                <button
                                    onClick={() => setStatusFilter("confirmed")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        statusFilter === "confirmed"
                                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                                    }`}
                                >
                                    Confirmed
                                </button>
                                <button
                                    onClick={() => setStatusFilter("pending")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        statusFilter === "pending"
                                            ? "bg-amber-100 text-amber-700 border border-amber-300"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                                    }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setStatusFilter("completed")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        statusFilter === "completed"
                                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                                    }`}
                                >
                                    Completed
                                </button>
                                <button
                                    onClick={() => setStatusFilter("cancelled")}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        statusFilter === "cancelled"
                                            ? "bg-red-100 text-red-700 border border-red-300"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                                    }`}
                                >
                                    Cancelled
                                </button>

                                {(searchQuery || statusFilter !== "all") && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                                    >
                                        <X className="w-3 h-3" />
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">
                            Loading leads...
                        </p>
                    </div>
                </div>
            )}

            {/* Error State */}
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
                            onClick={handleRefresh}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Lead Info
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Route Details
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
                            <tbody className="divide-y divide-gray-200">
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
                                                    {searchQuery ||
                                                    statusFilter !== "all"
                                                        ? "Try adjusting your filters"
                                                        : "Leads will appear here when customers book trips"}
                                                </p>
                                                {(searchQuery ||
                                                    statusFilter !== "all") && (
                                                    <button
                                                        onClick={clearFilters}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        Clear Filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead, index) => {
                                        const isExpanded =
                                            expandedRows[lead._id || lead.id];
                                        return (
                                            <React.Fragment
                                                key={
                                                    lead._id || lead.id || index
                                                }
                                            >
                                                <tr className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-4 py-4 text-sm text-gray-400">
                                                        {(currentPage - 1) *
                                                            leadsPerPage +
                                                            index +
                                                            1}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">
                                                                {lead.contact
                                                                    ?.firstName ||
                                                                    "N/A"}{" "}
                                                                {lead.contact
                                                                    ?.lastName ||
                                                                    ""}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {lead.confirmationNumber ||
                                                                    "N/A"}{" "}
                                                                •{" "}
                                                                {lead.passengers ||
                                                                    0}{" "}
                                                                passengers
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    toggleRow(
                                                                        lead._id ||
                                                                            lead.id,
                                                                    )
                                                                }
                                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center gap-1"
                                                            >
                                                                {isExpanded
                                                                    ? "Show Less"
                                                                    : "Show More"}
                                                                {isExpanded ? (
                                                                    <ChevronUp className="w-3 h-3" />
                                                                ) : (
                                                                    <ChevronDown className="w-3 h-3" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-1 max-w-[200px]">
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
                                                            <div className="flex items-start gap-1.5 text-sm text-gray-500 pl-5">
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
                                                            <button
                                                                onClick={() =>
                                                                    toggleRow(
                                                                        lead._id ||
                                                                            lead.id,
                                                                    )
                                                                }
                                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1"
                                                            >
                                                                {isExpanded
                                                                    ? "Hide Route"
                                                                    : "View Full Route"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="text-sm text-gray-700">
                                                            {formatDate(
                                                                lead.datetime,
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatTime(
                                                                lead.datetime,
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <StatusBadge
                                                                status={
                                                                    lead.status
                                                                }
                                                            />
                                                            <PaymentBadge
                                                                status={
                                                                    lead.paymentStatus
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <span
                                                            className={`text-sm font-bold ${
                                                                lead.status ===
                                                                "cancelled"
                                                                    ? "text-gray-400 line-through"
                                                                    : "text-gray-900"
                                                            }`}
                                                        >
                                                            {formatCurrency(
                                                                lead.pricing
                                                                    ?.totalAmount ||
                                                                    0,
                                                                lead.pricing
                                                                    ?.currency ||
                                                                    "USD",
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex justify-center gap-1">
                                                            <button
                                                                className="p-1.5 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
                                                                title="View"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="p-1.5 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600 transition-colors"
                                                                title="Delete"
                                                                onClick={() => handleDelete(lead._id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded Details Row */}
                                                {isExpanded && (
                                                    <tr className="bg-gray-50/50">
                                                        <td
                                                            colSpan="7"
                                                            className="px-4 py-4"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                {/* Contact Details */}
                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                                        <User className="w-4 h-4 text-blue-600" />
                                                                        Contact
                                                                        Details
                                                                    </h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="flex items-center gap-2 text-gray-600">
                                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                                            <span>
                                                                                {lead
                                                                                    .contact
                                                                                    ?.email ||
                                                                                    "N/A"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-gray-600">
                                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                                            <span>
                                                                                {lead
                                                                                    .contact
                                                                                    ?.phone ||
                                                                                    "N/A"}
                                                                            </span>
                                                                        </div>
                                                                        {lead
                                                                            .contact
                                                                            ?.alternatePhone && (
                                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                                <Phone className="w-4 h-4 text-gray-400" />
                                                                                <span>
                                                                                    Alt:{" "}
                                                                                    {
                                                                                        lead
                                                                                            .contact
                                                                                            .alternatePhone
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Full Route Details */}
                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                                        <Navigation className="w-4 h-4 text-emerald-600" />
                                                                        Complete
                                                                        Route
                                                                    </h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="p-2 bg-white rounded border border-gray-200">
                                                                            <p className="text-xs text-gray-500 mb-1">
                                                                                Pickup
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                {lead.pickupAddress ||
                                                                                    "N/A"}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex justify-center">
                                                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                                                        </div>
                                                                        <div className="p-2 bg-white rounded border border-gray-200">
                                                                            <p className="text-xs text-gray-500 mb-1">
                                                                                Dropoff
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                {lead.dropoffAddress ||
                                                                                    "N/A"}
                                                                            </p>
                                                                        </div>
                                                                        {lead.distance && (
                                                                            <p className="text-xs text-gray-500">
                                                                                Distance:{" "}
                                                                                {
                                                                                    lead.distance
                                                                                }{" "}
                                                                                miles
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Booking Details */}
                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                                        <FileText className="w-4 h-4 text-purple-600" />
                                                                        Booking
                                                                        Info
                                                                    </h4>
                                                                    <div className="space-y-2 text-sm text-gray-600">
                                                                        <div className="flex justify-between">
                                                                            <span>
                                                                                Vehicle
                                                                                Type:
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {lead.vehicleType ||
                                                                                    "Standard"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span>
                                                                                Passengers:
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {lead.passengers ||
                                                                                    0}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span>
                                                                                Luggage:
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {lead.luggage ||
                                                                                    "Standard"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span>
                                                                                Booking
                                                                                Date:
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {formatDate(
                                                                                    lead.createdAt,
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        {lead
                                                                            .pricing
                                                                            ?.breakdown && (
                                                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                                                <p className="text-xs text-gray-500 mb-1">
                                                                                    Price
                                                                                    Breakdown
                                                                                </p>
                                                                                <div className="space-y-1 text-xs">
                                                                                    <div className="flex justify-between">
                                                                                        <span>
                                                                                            Base
                                                                                            fare:
                                                                                        </span>
                                                                                        <span>
                                                                                            {formatCurrency(
                                                                                                lead
                                                                                                    .pricing
                                                                                                    .breakdown
                                                                                                    .base,
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                    {lead
                                                                                        .pricing
                                                                                        .breakdown
                                                                                        .tax >
                                                                                        0 && (
                                                                                        <div className="flex justify-between">
                                                                                            <span>
                                                                                                Tax:
                                                                                            </span>
                                                                                            <span>
                                                                                                {formatCurrency(
                                                                                                    lead
                                                                                                        .pricing
                                                                                                        .breakdown
                                                                                                        .tax,
                                                                                                )}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-200">
                                                                                        <span>
                                                                                            Total:
                                                                                        </span>
                                                                                        <span>
                                                                                            {formatCurrency(
                                                                                                lead
                                                                                                    .pricing
                                                                                                    .totalAmount,
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Close button */}
                                                            <div className="mt-4 flex justify-end">
                                                                <button
                                                                    onClick={() =>
                                                                        toggleRow(
                                                                            lead._id ||
                                                                                lead.id,
                                                                        )
                                                                    }
                                                                    className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                                                                >
                                                                    <ChevronUp className="w-4 h-4" />
                                                                    Collapse
                                                                    Details
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
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
                                        const newPage = Math.max(
                                            1,
                                            currentPage - 1,
                                        );
                                        setCurrentPage(newPage);
                                        fetchLeads(newPage);
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                {Array.from(
                                    { length: Math.min(3, totalPages) },
                                    (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => {
                                                    setCurrentPage(pageNum);
                                                    fetchLeads(pageNum);
                                                }}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? "bg-blue-600 text-white"
                                                        : "border border-gray-300 text-gray-700 hover:bg-white"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    },
                                )}

                                {totalPages > 3 && (
                                    <span className="px-2 py-1.5 text-gray-400">
                                        ...
                                    </span>
                                )}

                                <button
                                    onClick={() => {
                                        const newPage = Math.min(
                                            totalPages,
                                            currentPage + 1,
                                        );
                                        setCurrentPage(newPage);
                                        fetchLeads(newPage);
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
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
