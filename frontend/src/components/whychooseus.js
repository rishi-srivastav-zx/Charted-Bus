"use client";

import { motion } from "framer-motion";
import { REASONS } from "../components/mockdata";  
import { useEffect, useState } from "react";

const WhyChooseUs = () => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector(".whychooseus-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`py-24 relative overflow-hidden whychooseus-section ${isInView ? "in-view" : ""}`}>
      <div className="fixed inset-0 -z-10 cta-bg">
        <div className="absolute inset-0 bg-slate-900/85" />
        <img
          src="https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?q=80&w=1920&auto=format&fit=crop"
          alt="Why Choose Us Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose CharterBus?</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            We set the standard for group travel with a commitment to excellence in every mile.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((reason, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-orange-500/30 transition-all group"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
              <p className="text-white/50 leading-relaxed">{reason.desc}</p>
              <div className="mt-6 w-12 h-1 bg-orange-500/30 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
