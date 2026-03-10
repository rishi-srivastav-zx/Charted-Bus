"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CTASection = () => {
  const [isInView, setIsInView] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector(".cta-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section  className={`py-24 relative overflow-hidden cta-section ${isInView ? "in-view" : ""}`}>
      <div className="fixed inset-0 -z-10 cta-bg">
        <div className="absolute inset-0 bg-slate-900/85" />
        <img
          src="https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?q=80&w=1920&auto=format&fit=crop"
          alt="CTA Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to Book Your <br/><span className="text-orange-500">Charter Bus?</span></h2>
        <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
          Join 50,000+ happy travelers who trust PrimeDrive for their group transportation needs.
        </p>
        <button onClick={ () => router.push("/#home") } className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-full font-bold text-xl transition-all shadow-2xl hover:shadow-orange-500/40">
          Get Instant Quote
        </button>
      </div>
    </section>
  );
};

export default CTASection;
