import { motion } from "framer-motion"; 
import { MapPin, Users } from "lucide-react";
import { STEPS } from "../components/mockdata";     




export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-500 text-lg">Booking your premium charter bus is as easy as 1-2-3-4.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block z-0" />
          
          {STEPS.map((step, i) => (
            <div key={i} className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white border-4 border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-xl">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};




export const QuoteForm = () => {
  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Your Instant Quote</h2>
            <p className="text-slate-500">No hidden fees. Transparent pricing in seconds.</p>
          </div>

          <form className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pickup Location</label>
              <div className="relative">
                <input type="text" placeholder="City, State or Zip" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Destination</label>
              <div className="relative">
                <input type="text" placeholder="City, State or Zip" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Travel Date</label>
              <input type="date" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Passengers</label>
              <div className="relative">
                <input type="number" placeholder="Number of people" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
              </div>
            </div>
            
            <button className="md:col-span-2 mt-4 bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-orange-500/30 transition-all">
              Get Price Now
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};  


