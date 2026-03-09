"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react"; 
import { FAQS } from "../components/mockdata";     



const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left font-bold text-lg hover:bg-slate-50 transition-colors"
              >
                {faq.q}
                {openIndex === i ? <Minus size={20} className="text-orange-500" /> : <Plus size={20} className="text-slate-400" />}
              </button>
              <motion.div 
                initial={false}
                animate={{ height: openIndex === i ? "auto" : 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-slate-500 leading-relaxed border-t border-slate-50">
                  {faq.a}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
