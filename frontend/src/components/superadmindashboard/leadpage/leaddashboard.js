"use client";

import { useState, useEffect } from "react";
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
    Clock,
    Trash2,
    CheckCircle,
    DollarSign,
} from "lucide-react";
import { getAllBookings, deleteBooking } from "../../../services/bookingservice";
import StatusBadge from "./statusbadge";
import PaymentLinkModal from "./paymentLink";
import LeadDetailModal from "./leadDeatils";
import ContactPopup from "./contactpopup";
import RoutePopup from "./routepopup";
import EditLeadModal from "./editmodel";

// Truncate text to N chars with ellipsis
const truncate = (str = "", n = 24) =>
    str.length > n ? str.slice(0, n) + "…" : str;

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

    // Modals
    const [detailLead, setDetailLead] = useState(null);
    const [paymentLead, setPaymentLead] = useState(null);
    const [contactLead, setContactLead] = useState(null);
    const [routeLead, setRouteLead] = useState(null);
    const [editLead, setEditLead] = useState(null);

    const fetchLeads = async (page = 1, limit = leadsPerPage) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllBookings({ page, limit });
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

    // After EditLeadModal saves, patch local list without full refetch
    const handleSaved = (updated) => {
        setLeadsData((prev) =>
            prev.map((l) =>
                (l._id || l.id) === (updated._id || updated.id) ? updated : l,
            ),
        );
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
            {contactLead && (
                <ContactPopup
                    lead={contactLead}
                    onClose={() => setContactLead(null)}
                />
            )}
            {routeLead && (
                <RoutePopup
                    lead={routeLead}
                    onClose={() => setRouteLead(null)}
                />
            )}
            {editLead && (
                <EditLeadModal
                    lead={editLead}
                    onClose={() => setEditLead(null)}
                    onSave={handleSaved}
                />
            )}

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    color="bg-blue-600"
                    icon={<Users className="w-6 h-6 text-white" />}
                    label="Total Leads"
                    value={totalRecords}
                    textColor="text-blue-600"
                />
                <StatCard
                    color="bg-amber-500"
                    icon={<Clock3 className="w-6 h-6 text-white" />}
                    label="Pending"
                    value={
                        leadsData.filter((l) => l.status === "pending").length
                    }
                    textColor="text-amber-600"
                />
                <StatCard
                    color="bg-emerald-500"
                    icon={<CheckCircle className="w-6 h-6 text-white" />}
                    label="Confirmed"
                    value={
                        leadsData.filter((l) => l.status === "confirmed").length
                    }
                    textColor="text-emerald-600"
                />
                <StatCard
                    color="bg-purple-600"
                    icon={<DollarSign className="w-6 h-6 text-white" />}
                    label="Total Revenue"
                    value={formatCurrency(
                        leadsData
                            .filter((l) => l.status !== "cancelled")
                            .reduce(
                                (acc, l) => acc + (l.pricing?.totalAmount || 0),
                                0,
                            ),
                    )}
                    textColor="text-purple-600"
                />
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
                                {[10, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
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

                                            {/* ── Lead Info → click opens ContactPopup ── */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() =>
                                                        setContactLead(lead)
                                                    }
                                                    className="text-left group"
                                                >
                                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                                        {lead.contact
                                                            ?.firstName ||
                                                            "N/A"}{" "}
                                                        {lead.contact
                                                            ?.lastName || ""}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 group-hover:text-blue-400 transition-colors truncate max-w-[160px]">
                                                        {lead.contact?.email ||
                                                            "No email"}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5 font-mono tracking-tight">
                                                        #
                                                        {lead.confirmationNumber ||
                                                            "N/A"}
                                                    </p>
                                                </button>
                                            </td>

                                            {/* ── Route → click opens RoutePopup ── */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() =>
                                                        setRouteLead(lead)
                                                    }
                                                    className="text-left group"
                                                >
                                                    <div className="flex items-center gap-1.5 text-sm">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                        <span
                                                            className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors max-w-[160px] truncate block"
                                                            title={
                                                                lead.pickupAddress
                                                            }
                                                        >
                                                            {truncate(
                                                                lead.pickupAddress ||
                                                                    "N/A",
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm mt-1">
                                                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                                        <span
                                                            className="text-gray-500 group-hover:text-blue-500 transition-colors max-w-[160px] truncate block"
                                                            title={
                                                                lead.dropoffAddress
                                                            }
                                                        >
                                                            {truncate(
                                                                lead.dropoffAddress ||
                                                                    "N/A",
                                                            )}
                                                        </span>
                                                    </div>
                                                </button>
                                            </td>

                                            {/* Schedule */}
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-gray-700">
                                                    {formatDate(lead.datetime)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTime(lead.datetime)}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                <StatusBadge
                                                    status={
                                                        lead.status || "pending"
                                                    }
                                                />
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
                                                    <button
                                                        onClick={() =>
                                                            setDetailLead(lead)
                                                        }
                                                        className="p-1.5 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

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

                                                    <button
                                                        onClick={() =>
                                                            setEditLead(lead)
                                                        }
                                                        className="p-1.5 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="Edit Lead"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>

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
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                            currentPage === pageNum
                                                ? "bg-blue-600 text-white"
                                                : "border border-gray-300 text-gray-700 hover:bg-white"
                                        }`}
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

/* ── Stat Card ── */
const StatCard = ({ color, icon, label, value, textColor }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center text-center">
            <div className={`${color} rounded-full p-3 mb-3 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{label}</h3>
            <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
    </div>
);

export default LeadsDashboard;
