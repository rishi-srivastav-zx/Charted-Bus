import { Star } from "lucide-react";
import { REVIEWS } from "../components/mockdata";


const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          <div className="flex justify-center gap-1 text-orange-500 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <p className="text-slate-500">Trusted by thousands of groups nationwide.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] shadow-lg border border-slate-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <img src={review.img} alt={review.name} className="w-14 h-14 rounded-full border-2 border-orange-500/20" />
                <div>
                  <div className="font-bold text-lg">{review.name}</div>
                  <div className="text-slate-400 text-sm">{review.role}</div>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed">&quot;{review.text}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
