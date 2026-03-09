import React from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon 
} from 'lucide-react';
import { View } from '@/src/constants'; 


export const Header = ({ currentView, darkMode, setDarkMode }) => (
  <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
    <h2 className="text-xl font-bold text-slate-900 capitalize">
      {currentView === View.DASHBOARD ? 'Dashboard Overview' : currentView.replace('-', ' ')}
    </h2>

    <div className="flex items-center gap-6">
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search operators, routes..." 
          className="bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm w-80 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  </header>
);