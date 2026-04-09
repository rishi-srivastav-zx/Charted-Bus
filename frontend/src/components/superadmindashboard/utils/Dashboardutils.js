import { getAllBusesAdmin } from "../../../services/busservices";
import { getAllBookings } from "../../../services/bookingservice";
import { getAllPages } from "../../../services/landingpage";

// ─── Constants ─────────────────────────────────────────────────────────────

export const CHART_DATA_REVENUE = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
];

export const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

// ─── API Functions ───────────────────────────────────────────────────────────

export const fetchDashboardData = async () => {
    const [busesRes, bookingsRes, pagesRes] = await Promise.all([
        getAllBusesAdmin(),
        getAllBookings({ limit: 100 }),
        getAllPages(),
    ]);

    // Force all statuses to "pending" (same as LeadsDashboard)
    const bookingsData = (bookingsRes.data?.bookings || []).map((b) => ({
        ...b,
        status: "pending",
    }));

    return {
        buses: busesRes.data?.count || 0,
        bookings: bookingsRes.data?.total || bookingsData.length || 0,
        pages: Array.isArray(pagesRes) ? pagesRes.length : 0,
        bookingsData,
    };
};

// ─── Utility Functions ───────────────────────────────────────────────────────

export const formatDate = (d) => {
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

export const formatCurrency = (amount = 0, currency = "USD") => {
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

// ─── Data Processing Functions ───────────────────────────────────────────────

export const processMonthlyBookings = (bookings) => {
    if (!bookings || bookings.length === 0) {
        return [
            { name: "Jan", value: 0 },
            { name: "Feb", value: 0 },
            { name: "Mar", value: 0 },
            { name: "Apr", value: 0 },
            { name: "May", value: 0 },
            { name: "Jun", value: 0 },
        ];
    }

    const monthCounts = {};
    MONTH_NAMES.forEach((month) => (monthCounts[month] = 0));

    bookings.forEach((booking) => {
        const date = new Date(
            booking.createdAt || booking.created_at || new Date(),
        );
        const monthIndex = date.getMonth();
        const monthName = MONTH_NAMES[monthIndex];
        monthCounts[monthName]++;
    });

    const currentMonth = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const monthName = MONTH_NAMES[monthIndex];
        last6Months.push({
            name: monthName,
            value: monthCounts[monthName] || 0,
        });
    }

    return last6Months;
};

export const getRecentBookings = (bookings) => {
    if (!bookings || bookings.length === 0) return [];

    const sorted = [...bookings].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || 0);
        const dateB = new Date(b.createdAt || b.created_at || 0);
        return dateB - dateA;
    });

    return sorted.slice(0, 3).map((booking) => ({
        confirmationNumber: booking.confirmationNumber,
        id: booking._id,
        name:
            `${booking.contact?.firstName || ""} ${booking.contact?.lastName || ""}`.trim() ||
            "Unknown",
        date: formatDate(booking.createdAt),
        status: "pending",
        revenue:
            booking.pricing?.totalAmount || booking.pricing?.totalPrice || 0,
    }));
};
