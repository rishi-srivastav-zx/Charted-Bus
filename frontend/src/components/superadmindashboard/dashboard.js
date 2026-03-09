'use client';

import React from 'react';
import { 
  Users, 
  Bus, 
  BookOpen, 
  BarChart3,
  TrendingUp,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,  
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { StatCard } from './startcard';
import { cn } from '@/app/lib/uitls'; 
import { useRouter } from 'next/navigation';

// Sample data - replace with API calls
const CHART_DATA_BOOKINGS = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const CHART_DATA_REVENUE = [
  { name: 'Jan', value: 2400 },
  { name: 'Feb', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Apr', value: 3908 },
  { name: 'May', value: 4800 },
  { name: 'Jun', value: 3800 },
];

const BOOKINGS_DATA = [
  {
    id: '#3210',
    customer: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1' },
    route: 'NYC → Boston',
    date: '2024-01-15',
    status: 'Confirmed',
    price: '$450'
  },
  {
    id: '#3209',
    customer: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2' },
    route: 'LA → San Francisco',
    date: '2024-01-14',
    status: 'Pending',
    price: '$320'
  },
  {
    id: '#3208',
    customer: { name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?u=3' },
    route: 'Chicago → Detroit',
    date: '2024-01-13',
    status: 'Cancelled',
    price: '$280'
  },
];

export const DashboardView = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Operators" 
          value="124" 
          change="+12%" 
          trend="up" 
          icon={<Users className="text-blue-600" size={24} />} 
          iconBg="bg-blue-50"
        />
        <StatCard 
          title="Total Buses" 
          value="850" 
          change="+5%" 
          trend="up" 
          icon={<Bus className="text-purple-600" size={24} />} 
          iconBg="bg-purple-50"
        />
        <StatCard 
          title="Total Bookings" 
          value="3,200" 
          change="+18%" 
          trend="up" 
          icon={<BookOpen className="text-orange-600" size={24} />} 
          iconBg="bg-orange-50"
        />
        <StatCard 
          title="Total Revenue" 
          value="$450k" 
          change="+22%" 
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
              <h3 className="text-lg font-bold text-slate-900">Monthly Bookings</h3>
              <p className="text-slate-500 text-sm mt-0.5">Overview of booking volume</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-100">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA_BOOKINGS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Trends</h3>
              <p className="text-slate-500 text-sm mt-0.5">Net income over time</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-semibold bg-white text-blue-600 rounded-md shadow-sm transition-all">Monthly</button>
              <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-md transition-all">Weekly</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA_REVENUE}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    padding: '12px'
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
            <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
            <p className="text-slate-500 text-sm mt-0.5">Latest transactions across all routes</p>
          </div>
          <button 
            onClick={() => router.push('/bookings')}
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {BOOKINGS_DATA.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => router.push(`/bookings/${booking.id}`)}
                >
                  <td className="px-6 py-4 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.customer.avatar} 
                        alt={booking.customer.name}
                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform" 
                      />
                      <span className="font-medium text-slate-700">{booking.customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{booking.route}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                      booking.status === 'Confirmed' ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                      booking.status === 'Pending' ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      "bg-rose-100 text-rose-700 border border-rose-200"
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        booking.status === 'Confirmed' ? "bg-emerald-500" :
                        booking.status === 'Pending' ? "bg-amber-500" :
                        "bg-rose-500"
                      )} />
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{booking.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};