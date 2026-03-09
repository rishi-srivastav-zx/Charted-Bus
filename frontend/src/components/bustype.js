import { motion } from "framer-motion";
import { Users } from "lucide-react";   
import { BUSES } from "../components/mockdata";

const BusTypes = () => {
  return (
    <section id="buses" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Premium Fleet</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Choose from our wide range of modern vehicles tailored to your specific group size and travel needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BUSES.map((bus, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 transition-all hover:shadow-2xl group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={bus.img} 
                  alt={bus.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{bus.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{bus.desc}</p>
                <div className="flex items-center gap-2 text-orange-500 font-semibold mb-4">
                  <Users size={16} /> {bus.capacity}
                </div>
                <div className="flex flex-wrap gap-2">
                  {bus.features.map((f, idx) => (
                    <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusTypes;
