"use client";
import BookingForm from "./basicdetailsComponents/bookingform";
import {
    CheckIcon,
    ShieldIcon,
    HeadphonesIcon,
    StarIcon,
} from "./basicdetailsComponents/icons";
import { STATS } from "./basicdetailsComponents/constant";

// ─── Trust badge icon map ─────────────────────────────────────────────────────
const TRUST = [
    { IconComp: CheckIcon, text: "Top Rated Fleet" },
    { IconComp: ShieldIcon, text: "Fully Insured" },
    { IconComp: HeadphonesIcon, text: "24/7 Support" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LuxCharterPage(safePageData) {
    const heading =
        safePageData?.initialData?.main?.title_line1 || "Book Your Charter Bus";

    const words = heading.split(" ");
    const mid = Math.ceil(words.length / 3);
    const firstHalf = words.slice(0, mid).join(" ");
    const secondHalf = words.slice(mid).join(" ");

    return (
        <section className="min-h-screen bg-gradient-to-br mt-8 sm:mt-10 from-slate-50 via-blue-50/20 to-white font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 items-start">
                    {/* ── Left: Hero Copy ────────────────────────────────────────────── */}
                    <div className="space-y-5 sm:space-y-7 lg:pt-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-2.5 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 text-blue-700 rounded-full px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wide sm:tracking-wider shadow-sm hover:shadow-md hover:bg-blue-100/80 transition-all duration-300 cursor-default">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0 shadow-sm shadow-blue-500/30" />
                            <span className="break-words leading-tight max-w-[200px] sm:max-w-none">
                                {safePageData?.initialData?.main?.title_line1 ||
                                    "Premium Charter Services"}
                            </span>
                        </div>

                        {/* Heading */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-black text-slate-900 leading-tight sm:leading-[1.05] tracking-tight">
                                {firstHalf}
                                <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                                    {secondHalf}
                                </span>
                            </h1>
                            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed max-w-md">
                                {safePageData?.initialData?.main?.description ||
                                    "Experience premium group travel with our fleet of luxury coaches. Seamless booking, professional drivers, and unparalleled comfort."}
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            {TRUST.map(({ IconComp, text }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-2 sm:gap-2.5 bg-white border border-slate-100 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm"
                                >
                                    <div className="w-5 h-5 sm:w-7 sm:h-7 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <IconComp
                                            s={12}
                                            className="sm:s-[14]"
                                        />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Stats Grid — hidden on mobile, shown sm+ */}
                        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
                            {STATS.map(({ value, label }) => (
                                <div
                                    key={label}
                                    className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-sm text-center"
                                >
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                                        {value}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold mt-1">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Proof — hidden on mobile */}
                        <div className="hidden sm:flex items-center gap-4 pt-2">
                            <div className="flex -space-x-2">
                                {[
                                    "#3b82f6",
                                    "#6366f1",
                                    "#8b5cf6",
                                    "#ec4899",
                                ].map((c, i) => (
                                    <div
                                        key={i}
                                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-sm"
                                        style={{ background: c }}
                                    >
                                        {["AK", "MJ", "SR", "LP"][i]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex text-amber-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            s={10}
                                            className="sm:s-[12]"
                                        />
                                    ))}
                                </div>
                                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                                    Loved by 50,000+ customers worldwide
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Booking Form ────────────────────────────────────────── */}
                    <div className="lg:sticky lg:top-24">
                        <BookingForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
