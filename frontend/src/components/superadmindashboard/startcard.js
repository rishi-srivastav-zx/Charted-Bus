import React from 'react';
import { cn } from '../../app/lib/uitls';

  
export const StatCard = ({ title, value, change, trend, icon, iconBg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", iconBg)}>
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={cn(
        "flex items-center gap-0.5 text-sm font-bold px-2 py-0.5 rounded-full",
        trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {trend === 'up' ? '↗' : '↘'} {change}
      </span>
      <span className="text-slate-400 text-xs font-medium">vs last month</span>
    </div>
  </div>
);