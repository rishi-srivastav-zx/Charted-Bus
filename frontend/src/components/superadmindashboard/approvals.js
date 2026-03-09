import React from 'react';
import { 
  Search, 
  Users, 
  Filter, 
  Download, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  XCircle, 
  ChevronRight 
} from 'lucide-react';
import { APPROVALS_DATA } from './constant';
import { cn } from '@/app/lib/uitls';

export const ApprovalsView = () => (
  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Operator Approvals</h2>
        <p className="text-slate-500">Manage and verify new bus operator registration requests.</p>
      </div>
      <div className="flex gap-3">
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
          <Filter size={18} />
          Filters
        </button>
        <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
          <Download size={18} />
          Export CSV
        </button>
      </div>
    </div>

    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto">
        <button className="px-6 py-2 text-sm font-bold bg-blue-50 text-blue-600 rounded-lg">All Pending</button>
        <button className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900">Under Review</button>
        <button className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900">Rejected</button>
      </div>
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by company or email..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
    </div>

    <div className="space-y-4">
      {APPROVALS_DATA.map((req) => (
        <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
              {req.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-lg">{req.company}</h3>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  req.status === 'Pending Review' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                )}>
                  {req.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Users size={14} /> {req.contact}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {req.location}</span>
                <span className="flex items-center gap-1"><BookOpen size={14} /> Applied {req.date}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 gap-2">
              <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-slate-400 flex items-center gap-1.5">DOCS <CheckCircle2 size={12} className="text-emerald-500" /></div>
              <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-slate-400 flex items-center gap-1.5"><FileText size={12} /></div>
              <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-slate-400 flex items-center gap-1.5"><Users size={12} /></div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <XCircle size={18} className="text-slate-400" /> Reject
              </button>
              <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 flex items-center gap-2">
                <CheckCircle2 size={18} /> Approve
              </button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);