import { motion } from "framer-motion";
import { useState } from "react";
import { BUS_VIEWS } from "../components/mockdata";
import { ChevronLeft, ChevronRight } from "lucide-react";

const InteractiveView = () => {
  const [activeTab, setActiveTab] = useState("exterior");
  
  return (
    <section className="py-24 bg-white text-slate-900 overflow-hidden relative z-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Experience the Fleet</h2>
          <p className="text-slate-600">Take a closer look at our world-class vehicles from every angle.</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {Object.keys(BUS_VIEWS).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-slate-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative group">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-white"
          >
            <img 
              src={BUS_VIEWS[activeTab]} 
              alt={activeTab} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <button className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft />
          </button>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveView;
    