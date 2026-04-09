import { Bus } from "lucide-react";
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react";   
import { BUSINESS_CONFIG } from "../app/lib/seo-cofig";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const formatPhone = (phone) => phone.replace(/[^+\d]/g, '');
  
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12">
      <div className="max-w-8xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <Bus size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              {BUSINESS_CONFIG.name.toUpperCase().split(' ')[0]}<span className="text-orange-500">{BUSINESS_CONFIG.name.toUpperCase().includes(' ') ? ' ' + BUSINESS_CONFIG.name.split(' ')[1] : ''}</span>
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            {BUSINESS_CONFIG.tagline}
          </p>
          <div className="flex gap-4">
            {BUSINESS_CONFIG.sameAs[0] && (
              <a href={BUSINESS_CONFIG.sameAs[0]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors"><Facebook size={20} /></a>
            )}
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors"><Twitter size={20} /></a>
            {BUSINESS_CONFIG.sameAs[1] && (
              <a href={BUSINESS_CONFIG.sameAs[1]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors"><Instagram size={20} /></a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Services</h4>
          <ul className="space-y-4 text-slate-500">
            <li><a href="#" className="hover:text-white transition-colors">Corporate Events</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Wedding Shuttles</a></li>
            <li><a href="#" className="hover:text-white transition-colors">School Field Trips</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sports Team Travel</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Government & Military</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Popular Cities</h4>
          <ul className="space-y-4 text-slate-500">
            <li><a href="#" className="hover:text-white transition-colors">New York City</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Los Angeles</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chicago</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Houston</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Miami</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-slate-500">
            <li className="flex items-center gap-3"><Phone size={18} className="text-orange-500" /> <a href={`tel:${formatPhone(BUSINESS_CONFIG.telephone)}`} className="hover:text-white transition-colors">{BUSINESS_CONFIG.telephone}</a></li>
            <li className="flex items-center gap-3"><Mail size={18} className="text-orange-500" /> <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:text-white transition-colors">{BUSINESS_CONFIG.email}</a></li>
            <li className="flex items-center gap-3"><MapPin size={18} className="text-orange-500" /> {BUSINESS_CONFIG.address.street}, {BUSINESS_CONFIG.address.city}, {BUSINESS_CONFIG.address.region}</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 text-center text-slate-600 text-sm">
        <p>&copy; {currentYear} {BUSINESS_CONFIG.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
