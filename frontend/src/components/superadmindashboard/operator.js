import React from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { OPERATORS_DATA } from './constant';
import { cn } from '@/app/lib/uitls';

export const  OperatorsView = () => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Bus Operators</h2>
        <p className="text-slate-500">Manage and oversee all bus operator accounts.</p>
      </div>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
        <Plus size={20} />
        Add New Operator
      </button>
    </div>

    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search operators by name or email..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
      <select className="bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]">
        <option>All Statuses</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </div>

    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {OPERATORS_DATA.map((op) => (
              <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                      {op.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-bold text-slate-900">{op.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-700 font-medium">{op.email}</span>
                    <span className="text-slate-400 text-xs">{op.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    op.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                  )}>
                    ● {op.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Pencil size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-slate-100 flex items-center justify-between">
        <p className="text-slate-400 text-sm">Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">5</span> of <span className="font-bold text-slate-900">12</span> results</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50">Previous</button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  </div>
);