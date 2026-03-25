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



