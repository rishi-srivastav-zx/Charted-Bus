import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/app/lib/uitls";

export default function PriceBreakdown({
    vehicle = {},
    pricing = null,
    isProcessing,
    onConfirm,
    tripType = "one-way",
    passengers = 0,
    duration = 0,
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-28">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
                Price Details
            </h3>

            {/* Final price message */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-amber-800">
                        Final Price Notice
                    </span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                    Final price will be shared after confirmation. Our team will
                    send you a detailed quote via email.
                </p>
            </div>

            <button
                onClick={onConfirm}
                disabled={isProcessing}
                className={cn(
                    "w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group mb-4",
                    isProcessing && "opacity-70 cursor-not-allowed",
                )}
            >
                {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Confirm & Book Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed font-medium">
                By confirming, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                    Terms
                </a>{" "}
                &{" "}
                <a href="#" className="text-blue-600 hover:underline">
                    Policies
                </a>
            </p>

            <div className="mt-8 bg-slate-50 rounded-2xl p-4 flex gap-3 items-start border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1 leading-none">
                        Secure Checkout
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Your booking is encrypted and protected. 24/7 priority
                        support.
                    </p>
                </div>
            </div>
        </div>
    );
}
