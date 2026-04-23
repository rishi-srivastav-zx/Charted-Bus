import { AlertCircle, User } from "lucide-react";

export function VehicleErrorBanner() {
    return (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
                <p className="font-bold text-red-800">Vehicle Required</p>
                <p className="text-sm text-red-600">
                    Please select a vehicle from the options below to continue
                    with your booking.
                </p>
            </div>
        </div>
    );
}

export function ContactRequiredBanner() {
    return (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
                <p className="font-bold text-blue-800">
                    Contact Information Required
                </p>
                <p className="text-sm text-blue-600">
                    Please click "Continue" and provide your contact details to
                    proceed.
                </p>
            </div>
        </div>
    );
}
