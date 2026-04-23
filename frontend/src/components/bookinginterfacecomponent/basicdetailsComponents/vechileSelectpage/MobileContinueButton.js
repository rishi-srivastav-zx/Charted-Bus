import { ArrowRight } from "lucide-react";
import { cn } from "@/app/lib/uitls";

export default function MobileContinueButton({
    selectedVehicleId,
    contactData,
    onClick,
    showError,
}) {
    return (
        <div className="lg:hidden mt-8">
            <button
                onClick={onClick}
                className={cn(
                    "w-full py-3 sm:py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm sm:text-base",
                    selectedVehicleId
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed",
                )}
                disabled={!selectedVehicleId}
            >
                {contactData ? "Proceed to Next Step" : "Continue to Next Step"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {showError && !selectedVehicleId && (
                <p className="text-center text-red-600 text-xs sm:text-sm mt-2">
                    Please select a vehicle first
                </p>
            )}
        </div>
    );
}
