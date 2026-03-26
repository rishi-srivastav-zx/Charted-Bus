"use client";

import React, { useState, useEffect } from "react";
import { Users, Bus, BookOpen, BarChart3, ArrowRight } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { StatCard } from "./startcard";
import {
    CHART_DATA_REVENUE,
    fetchDashboardData,
    processMonthlyBookings,
    getRecentBookings,
    formatCurrency,
} from "./utils/Dashboardutils";

export const DashboardView = () => {
    const [stats, setStats] = useState({
        operators: 0,
        buses: 0,
        bookings: 0,
        pages: 0,
    });
    const [monthlyBookings, setMonthlyBookings] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchDashboardData();

                setStats({
                    operators: 0,
                    buses: data.buses,
                    bookings: data.bookings,
                    pages: data.pages,
                });

                setMonthlyBookings(processMonthlyBookings(data.bookingsData));
                setRecentBookings(getRecentBookings(data.bookingsData));
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div>Loading stats...</div>;
    }

  const handleNavigation = (viewId) => {
      window.location.href = `/dashboard?view=${viewId}`;
  };

    return (
        <div className="min-h-screen bg-white lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Operators"
                    value={stats.operators}
                    change="+0%"
                    trend="up"
                    icon={<Users className="text-blue-600" size={24} />}
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Total Buses"
                    value={stats.buses}
                    change="+0%"
                    trend="up"
                    icon={<Bus className="text-purple-600" size={24} />}
                    iconBg="bg-purple-50"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.bookings}
                    change="+0%"
                    trend="up"
                    icon={<BookOpen className="text-orange-600" size={24} />}
                    iconBg="bg-orange-50"
                />
                <StatCard
                    title="Published Pages"
                    value={stats.pages}
                    change="+0%"
                    trend="up"
                    icon={<BarChart3 className="text-emerald-600" size={24} />}
                    iconBg="bg-emerald-50"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bookings Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Monthly Bookings
                            </h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                                Real booking volume from your data
                            </p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyBookings}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: "#f1f5f9" }}
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow:
                                            "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                        padding: "12px",
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Chart - SAMPLE DATA */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Revenue Trends
                            </h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                                Net income over time
                            </p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA_REVENUE}>
                                <defs>
                                    <linearGradient
                                        id="colorValue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.2}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e2e8f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow:
                                            "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                        padding: "12px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Recent Bookings
                        </h3>
                        <p className="text-slate-500 text-sm mt-0.5">
                            Latest 3 transactions
                        </p>
                    </div>
                    <button
                        onClick={() => handleNavigation("leads")}
                        className="group inline-flex items-center gap-1 text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Customer Name</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            #
                                            {booking.confirmationNumber ||
                                                booking.id?.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {booking.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {booking.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                                            {formatCurrency(booking.revenue)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-slate-500"
                                    >
                                        No recent bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
