import React from "react";
import { ShieldCheck } from "lucide-react"; 
import { Clock } from "lucide-react";
import { Star } from "lucide-react";
import { Wifi } from "lucide-react"; 

export const BUSES = [
  {
    title: "Executive Coach",
    desc: "Perfect for corporate events and large groups.",
    capacity: "Up to 56 Passengers",
   img: "https://images.squarespace-cdn.com/content/v1/60f5dccfb29cb158dec6b64d/1629734807884-G2NY6P786TH48TZJ3ASN/Aretha-0579.jpg",
    features: ["Wifi", "Restroom", "Reclining Seats"]
  },
  {
    title: "Mini Bus",
    desc: "Ideal for smaller groups and airport transfers.",
    capacity: "Up to 24 Passengers",
   img: "https://www.uscoachways.com/static/miniBus.png",
    features: ["AC", "Audio System", "Storage"]
  },
  {
    title: "Party Bus",
    desc: "The ultimate choice for celebrations.",
    capacity: "Up to 30 Passengers",
   img: "https://images.squarespace-cdn.com/content/v1/670e776cb27d301f586433e1/ffc33537-2887-49fd-bd18-899840f4ee91/Fulllimocoachinterior.jpg",
    features: ["Sound System", "Lights", "Bar Area"]
  },
  {
    title: "School Bus",
    desc: "Safe and reliable for school trips.",
    capacity: "Up to 48 Passengers",
    img: "https://i.guim.co.uk/img/static/sys-images/Arts/Arts_/Pictures/2008/09/23/bus460.jpg?crop=none&dpr=1&s=none&width=465",
    features: ["Seat Belts", "Safety First", "Economical"]
  }
];

export const REASONS = [
  {
    icon: <ShieldCheck size={32} className="text-brand-orange" />,
    title: "Safety First",
    desc: "All drivers are vetted and trained. Buses undergo rigorous daily inspections."
  },
  {
    icon: <Clock size={32} className="text-brand-orange" />,
    title: "On-Time Guarantee",
    desc: "We pride ourselves on punctuality. If we are late, your ride is discounted."
  },
  {
    icon: <Star size={32} className="text-brand-orange" />,
    title: "Premium Comfort",
    desc: "Reclining seats, climate control, and onboard entertainment in every vehicle."
  },
  {
    icon: <Wifi size={32} className="text-brand-orange" />,
    title: "Stay Connected",
    desc: "Complimentary high-speed WiFi and charging ports at every seat."
  }
];

export const BUS_FEATURES = [
  "Plush Reclining Seats",
  "Free Wi-Fi",
  "Power Outlets (USB + AC)",
  "Onboard Restroom",
  "PA System",
  "Climate Control",
  "Overhead Storage",
  "DVD/TV Monitors"
];

export const BUS_VIEWS = {
 exterior: "https://mms.businesswire.com/media/20200831005698/en/817196/5/Exterior_%281%29.jpg?download=1",
  
 interior: "https://lirp.cdn-website.com/edcb2ea2/dms3rep/multi/opt/Motor%2BCoach%2BInterior-640w.jpg",
  
 cabin: "https://st4.depositphotos.com/24664374/30078/i/450/depositphotos_300784550-stock-photo-drivers-seat-on-the-bus.jpg"
};

export const STEPS = [
  { title: "Request Quote", desc: "Fill out our simple form with your trip details." },
  { title: "Compare Prices", desc: "Receive competitive, transparent pricing instantly." },
  { title: "Book Online", desc: "Secure your bus with our easy online booking system." },
  { title: "Enjoy the Ride", desc: "Relax and let our professional drivers handle the rest." }
];

export const REVIEWS = [
  {
    name: "Sarah Jenkins",
    role: "Event Coordinator",
    img: "https://images.squarespace-cdn.com/content/v1/5d5dc63edddf3e000159963c/1616554943014-9OXV3JCPC7KJONPJBDSL/event-planner-atlanta-brand-photographer-katya-vilchyk_0024.jpg",
    text: "PrimeDrive made our corporate retreat seamless. The bus was spotless and the driver was incredibly professional."
  },
  {
    name: "Michael Chen",
    role: "Wedding Planner",
    img: "https://tallo.com/uploads/ultra-realistic-wedding-planner.jpg",
    text: "I've used many charter services, but the luxury and reliability here are unmatched. Highly recommended!"
  },
  {
    name: "Jessica Alva",
    role: "School Principal",
    img: "https://png.pngtree.com/thumb_back/fw800/background/20250323/pngtree-confident-mature-woman-exudes-ambition-and-success-in-closeup-portrait-photo-photo-image_68395030.webp",
    text: "Safety is our top priority for school trips. PrimeDrive exceeded all our expectations with their safety protocols."
  }
];

export const FAQS = [
  { q: "How far in advance should I book?", a: "We recommend booking at least 3-4 weeks in advance for standard trips, and 2-3 months for peak seasons like prom or holidays." },
  { q: "What is your cancellation policy?", a: "You can cancel up to 7 days before your trip for a full refund. Cancellations within 7 days may be subject to a fee." },
  { q: "Are your buses wheelchair accessible?", a: "Yes, we have a selection of ADA-compliant buses available. Please mention this requirement when requesting a quote." },
  { q: "Can we bring food and drinks?", a: "Absolutely! We want you to enjoy your trip. Just please keep the bus clean as excessive mess may incur a cleaning fee." }
];
export const PRICES = {
  ADDITIONAL_LUGGAGE: 15.00,
  SPECIAL_LUGGAGE: 25.00,
  CLIMATE_CONTRIBUTION: 2.50
};

export const SEATS_MAP = [
  { id: "1A", position: "Window", isOccupied: false },
  { id: "1B", position: "Aisle", isOccupied: true },
  { id: "1C", position: "Aisle", isOccupied: false },
  { id: "1D", position: "Window", isOccupied: false },
  { id: "2A", position: "Window", isOccupied: false },
  { id: "2B", position: "Aisle", isOccupied: false },
  { id: "2C", position: "Aisle", isOccupied: true },
  { id: "2D", position: "Window", isOccupied: false },
  
];



// ─── Icons ───────────────────────────────────────────────────────────────────
export const BusIcon = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
    <circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>
  </svg>
);
export const ClockIcon = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
export const ArrowRight = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
export const RefreshIcon = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
export const CalIcon = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
export const PlusIcon = ({ s = 12 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
export const MinusIcon = ({ s = 12 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
export const ChevronDown = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
export const GripIcon = ({ s = 13 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/>
    <circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
  </svg>
);
export const EditIcon = ({ s = 13 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
export const XIcon = ({ s = 11 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
export const CheckIcon = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
export const ShieldIcon = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
export const HeadphonesIcon = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
export const StarIcon = ({ s = 13 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);