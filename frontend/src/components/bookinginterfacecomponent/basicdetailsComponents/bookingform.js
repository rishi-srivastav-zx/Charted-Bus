"use client";
import { useState, useEffect } from "react";
import { useNav } from "../../navigation-provider";
import { saveBasicDetails } from "../../../services/bookingservice";
import {
    ClockIcon,
    ArrowRight,
    RefreshIcon,
    AlertIcon,
    StarIcon,
} from "./icons";
import HourlyForm from "./hourlyform";
import OneWayForm from "./onewayform";
import RoundTripForm from "./roundtripform";
import { TRIP_TYPES } from "./constant";
import { validateForm } from "./validator";

// ─── BookingForm ──────────────────────────────────────────────────────────────
const TRIP_ICONS = {
    hourly: ClockIcon,
    "one-way": ArrowRight,
    "round-trip": RefreshIcon,
};

export default function BookingForm() {
    const [tripType, setTripType] = useState("hourly");
    const [errors, setErrors] = useState([]);
    const [touched, setTouched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { navigate } = useNav();
    const [bookingId, setBookingId] = useState(null);

    const [hourlyData, setHourlyData] = useState({});
    const [oneWayData, setOneWayData] = useState({});
    const [roundTripData, setRoundTripData] = useState({});

    useEffect(() => {
        const savedData = localStorage.getItem("bookingStep1");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.tripType) setTripType(parsed.tripType);
                if (parsed.tripType === "hourly")
                    setHourlyData(parsed.formData || {});
                else if (parsed.tripType === "one-way")
                    setOneWayData(parsed.formData || {});
                else if (parsed.tripType === "round-trip")
                    setRoundTripData(parsed.formData || {});
            } catch (e) {
                console.error("Error parsing saved booking data:", e);
            }
        }
        const savedBookingId = localStorage.getItem("bookingId");
        if (savedBookingId) setBookingId(savedBookingId);
    }, []);

    const getCurrentFormData = () => {
        switch (tripType) {
            case "hourly":
                return hourlyData;
            case "one-way":
                return oneWayData;
            case "round-trip":
                return roundTripData;
            default:
                return {};
        }
    };

    const handleTripTypeChange = (newType) => {
        setTripType(newType);
        setErrors([]);
        setTouched(false);
    };

    const handleContinue = async () => {
        setTouched(true);
        const currentData = getCurrentFormData();
        const validationErrors = validateForm(tripType, currentData);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            document
                .getElementById("booking-form-content")
                ?.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            setErrors([]);
            setIsLoading(true);
            try {
                let apiData = {
                    tripType,
                    orderType: currentData.orderType || currentData.bookingType,
                    pickupAddress: currentData.pickupAddress,
                    pickupType: currentData.pickupType || "address",
                    dropoffAddress: currentData.dropoffAddress,
                    dropoffType: currentData.dropoffType || "address",
                    stops: currentData.stops || [],
                    datetime: currentData.datetime
                        ? new Date(currentData.datetime).toISOString()
                        : null,
                    passengers: currentData.passengers,
                    duration: currentData.duration
                        ? parseFloat(currentData.duration)
                        : null,
                };

                if (tripType === "round-trip") {
                    apiData = {
                        tripType,
                        orderType: currentData.orderType,
                        pickupAddress: currentData.outbound?.pickupAddress,
                        pickupType:
                            currentData.outbound?.pickupType || "address",
                        dropoffAddress: currentData.outbound?.dropoffAddress,
                        dropoffType:
                            currentData.outbound?.dropoffType || "address",
                        stops: currentData.outbound?.stops || [],
                        datetime: currentData.outbound?.datetime
                            ? new Date(
                                  currentData.outbound.datetime,
                              ).toISOString()
                            : null,
                        passengers: currentData.outbound?.passengers,
                        returnDate: currentData.return?.datetime
                            ? new Date(
                                  currentData.return.datetime,
                              ).toISOString()
                            : null,
                        returnStops: currentData.return?.stops || [],
                        returnPickupAddress: currentData.return?.pickupAddress,
                        returnDropoffAddress:
                            currentData.return?.dropoffAddress,
                    };
                }

                if (bookingId) apiData.bookingId = bookingId;

                const response = await saveBasicDetails(apiData);
                const result = response.data;

                if (result?.bookingId) {
                    setBookingId(result.bookingId);
                    localStorage.setItem("bookingId", result.bookingId);
                }

                localStorage.setItem(
                    "bookingStep1",
                    JSON.stringify({
                        tripType,
                        formData: currentData,
                        timestamp: new Date().toISOString(),
                        bookingId: result?.bookingId || bookingId,
                    }),
                );

                navigate("/bookingform/vechileselect");
            } catch (error) {
                console.error("Error saving booking details:", error);
                localStorage.setItem(
                    "bookingStep1",
                    JSON.stringify({
                        tripType,
                        formData: currentData,
                        timestamp: new Date().toISOString(),
                    }),
                );
                navigate("/bookingform/vechileselect");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getActiveForm = () => {
        switch (tripType) {
            case "hourly":
                return (
                    <HourlyForm data={hourlyData} onChange={setHourlyData} />
                );
            case "one-way":
                return (
                    <OneWayForm data={oneWayData} onChange={setOneWayData} />
                );
            case "round-trip":
                return (
                    <RoundTripForm
                        data={roundTripData}
                        onChange={setRoundTripData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div>
                        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
                            Step 1 of 3
                        </p>
                        <h2 className="text-white text-lg sm:text-[22px] font-black tracking-tight leading-none">
                            Trip Details
                        </h2>
                    </div>
                    <div className="flex gap-1 sm:gap-1.5 items-center">
                        <div className="h-1.5 w-8 sm:w-10 bg-white rounded-full" />
                        <div className="h-1.5 w-8 sm:w-10 bg-white/25 rounded-full" />
                        <div className="h-1.5 w-8 sm:w-10 bg-white/25 rounded-full" />
                    </div>
                </div>

                {/* Trip Type Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-black/20 rounded-xl sm:rounded-2xl p-1">
                    {TRIP_TYPES.map(({ id, label }) => {
                        const IconComp = TRIP_ICONS[id];
                        return (
                            <button
                                key={id}
                                onClick={() => handleTripTypeChange(id)}
                                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] font-bold transition-all ${
                                    tripType === id
                                        ? "bg-white text-blue-700 shadow-lg shadow-black/10"
                                        : "text-blue-200 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                <IconComp s={11} />
                                <span className="hidden xs:inline sm:inline">
                                    {label}
                                </span>
                                <span className="xs:hidden sm:hidden">
                                    {label.split(" ")[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Form Content */}
            <div
                id="booking-form-content"
                className="p-3 sm:p-4 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto bg-slate-50/60 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {touched && errors.length > 0 && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertIcon s={11} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-red-800 mb-1">
                                    Please complete all required fields
                                </p>
                                <ul className="space-y-1">
                                    {errors.map((error, index) => (
                                        <li
                                            key={index}
                                            className="text-[11px] sm:text-xs text-red-600 flex items-start gap-1.5"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {getActiveForm()}
            </div>

            {/* Footer CTA */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white border-t border-slate-100">
                <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-black py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 group tracking-wide"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            Continue to Fleet Selection
                            <span className="group-hover:translate-x-1 transition-transform inline-flex">
                                <ArrowRight s={14} />
                            </span>
                        </>
                    )}
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-2.5 sm:mt-3 flex-wrap">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} s={11} />
                        ))}
                    </div>
                    <p className="text-center text-[10px] sm:text-[11px] text-slate-400 font-medium">
                        Trusted by 50,000+ customers · No card required
                    </p>
                </div>
            </div>
        </div>
    );
}
