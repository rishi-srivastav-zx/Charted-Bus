import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { BUS_FEATURES } from "../components/mockdata"; 


const BusFeatures = () => {
  return (
    <section id="amenities" className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img 
            src="https://images.squarespace-cdn.com/content/v1/5c2fb0a7f407b47736379af2/1761859678899-MQCIQRGLYJN0GYWXLSNO/HH3A8673.jpg?format=1000w" 
            alt="Bus Interior" 
            className="rounded-[40px] shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-8 -right-8 bg-orange-500 p-8 rounded-3xl shadow-xl text-white hidden lg:block">
            <div className="text-4xl font-bold mb-1">100%</div>
            <div className="text-sm opacity-80 uppercase tracking-widest font-bold">Luxury Guaranteed</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">First-Class Amenities <br/><span className="text-orange-500 text-3xl">Standard on Every Trip</span></h2>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Our buses are equipped with the latest technology and comfort features to ensure your journey is as enjoyable as the destination.
          </p>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {BUS_FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <CheckCircle2 size={14} />
                </div>
                <span className="font-semibold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          <button className="mt-12 bg-slate-900 text-white px-8 py-4 rounded-full font-bold transition-all hover:bg-slate-800">
            Explore Full Specs
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BusFeatures;
