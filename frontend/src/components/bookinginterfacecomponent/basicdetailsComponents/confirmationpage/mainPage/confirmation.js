"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { confirmBooking, getBooking } from "@/services/bookingservice";
import TripDetailsCard from "../TripDetailsCard";
import VehicleCard from "../VechicleCard";
import PassengerCard from "../PassengerCard";
import PriceBreakdown from "../PriceBreakdown";
import SuccessModal from "../SuccessModal";


export default function ReviewItineraryPage() {
    const [tripDetails, setTripDetails] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [backendBooking, setBackendBooking] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        async function fetchBookingData() {
            try {
                const bookingId = localStorage.getItem("bookingId");

                if (bookingId) {
                    const response = await getBooking(bookingId);
                    const booking = response.data?.booking;

                    if (booking) {
                        setBackendBooking(booking);
                        setTripDetails({
                            tripType: booking.tripType,
                            formData: {
                                pickupAddress: booking.pickupAddress,
                                dropoffAddress: booking.dropoffAddress,
                                datetime: booking.datetime,
                                passengers: booking.passengers,
                                duration: booking.duration,
                                orderType: booking.orderType,
                                stops: booking.stops,
                                outbound:
                                    booking.tripType === "round-trip"
                                        ? {
                                              pickupAddress:
                                                  booking.pickupAddress,
                                              dropoffAddress:
                                                  booking.dropoffAddress,
                                              datetime: booking.datetime,
                                              passengers: booking.passengers,
                                              stops: booking.stops,
                                          }
                                        : null,
                                return:
                                    booking.tripType === "round-trip"
                                        ? {
                                              datetime: booking.returnDate,
                                              stops: booking.returnStops,
                                          }
                                        : null,
                            },
                        });
                        setBookingDetails({
                            vehicle: booking.busDetails || {},
                            contact: booking.contact || {},
                        });

                        const step2 = localStorage.getItem("bookingStep2");
                        if (step2) {
                            try {
                                const step2Data = JSON.parse(step2);
                                if (!booking.busDetails && step2Data.vehicle) {
                                    setBookingDetails((prev) => ({
                                        ...prev,
                                        vehicle: step2Data.vehicle,
                                    }));
                                }
                                if (!booking.contact && step2Data.contact) {
                                    setBookingDetails((prev) => ({
                                        ...prev,
                                        contact: step2Data.contact,
                                    }));
                                }
                            } catch (e) {
                                console.error("Error parsing step2:", e);
                            }
                        }
                        return;
                    }
                }

                // Fallback to localStorage
                const step1 = localStorage.getItem("bookingStep1");
                const step2 = localStorage.getItem("bookingStep2");
                if (step1) {
                    try {
                        setTripDetails(JSON.parse(step1));
                    } catch (e) {
                        console.error(e);
                    }
                }
                if (step2) {
                    try {
                        setBookingDetails(JSON.parse(step2));
                    } catch (e) {
                        console.error(e);
                    }
                }
            } catch (err) {
                console.error("Error fetching booking:", err);
            } finally {
                setIsLoaded(true);
            }
        }

        fetchBookingData();
    }, []);

    const handleConfirm = async () => {
        setIsProcessing(true);
        const bookingId = localStorage.getItem("bookingId");
        const vehicleData =
            bookingDetails?.vehicle || backendBooking?.busDetails || {};

        let finalPricing = backendBooking?.pricing;
        if (!finalPricing) {
            const baseFare = vehicleData.price || 0;
            const fuelSurcharge = 45;
            const driverGratuity = baseFare * 0.1;
            const serviceFees = 12.5;
            const totalAmount =
                baseFare + fuelSurcharge + driverGratuity + serviceFees;

            finalPricing = {
                baseFare,
                fuelSurcharge,
                driverGratuity,
                serviceFees,
                totalAmount,
                currency: vehicleData.currency || "USD",
            };
        }

        try {
            if (bookingId) {
                const response = await confirmBooking({
                    bookingId,
                    pricing: finalPricing,
                });
                if (response.data?.booking) {
                    localStorage.setItem(
                        "confirmedBooking",
                        JSON.stringify(response.data.booking),
                    );
                }
            }
            setShowSuccess(true);
            localStorage.removeItem("bookingStep1");
            localStorage.removeItem("bookingStep2");
            localStorage.removeItem("selectedVehicle");
            localStorage.removeItem("bookingContact");
            localStorage.removeItem("bookingId");
        } catch (error) {
            console.error("Error confirming booking:", error);
            setShowSuccess(true);
            localStorage.removeItem("bookingStep1");
            localStorage.removeItem("bookingStep2");
            localStorage.removeItem("selectedVehicle");
            localStorage.removeItem("bookingContact");
            localStorage.removeItem("bookingId");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        router.push("/");
    };

    const vehicle = bookingDetails?.vehicle || backendBooking?.busDetails || {};
    const contact = bookingDetails?.contact || backendBooking?.contact || {};
    const pricing = backendBooking?.pricing || null;
    const tripType =
        tripDetails?.tripType || backendBooking?.tripType || "one-way";
    const tripData = tripDetails?.formData || {};

    const formatReviewDate = (dateStr) => {
        if (!dateStr) return "Not set";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatReviewTime = (dateStr) => {
        if (!dateStr) return "Not set";
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">
                        Loading booking details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 mt-20">
            <Head>
                <title>Review Booking | CharterBus</title>
            </Head>

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-8">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-8 h-1 bg-blue-600 rounded-full" />
                                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                                    Final Step
                                </p>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                Review Itinerary
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Please double check your booking details before
                                we finalize your request.
                            </p>
                        </div>

                        <TripDetailsCard
                            tripDetails={tripDetails}
                            backendBooking={backendBooking}
                            onEdit={() => router.push("/bookingform")}
                            formatReviewDate={formatReviewDate}
                            formatReviewTime={formatReviewTime}
                        />

                        <VehicleCard
                            vehicle={vehicle}
                            onChange={() =>
                                router.push("/bookingform/vechileselect")
                            }
                        />

                        <PassengerCard
                            contact={contact}
                            onEdit={() =>
                                router.push("/bookingform/vechileselect")
                            }
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4">
                        <PriceBreakdown
                            vehicle={vehicle}
                            pricing={pricing}
                            isProcessing={isProcessing}
                            onConfirm={handleConfirm}
                            tripType={tripType}
                            passengers={tripData.passengers || 0}
                            duration={tripData.duration || 0}
                        />
                    </div>
                </div>
            </main>

            <SuccessModal
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                tripDetails={tripDetails}
                bookingDetails={bookingDetails}
                vehicle={vehicle}
            />

            <footer className="bg-white border-t border-slate-100 mt-20 py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">
                        CharterBus Premium Fleet Services
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                        © 2024 CharterBus. All rights reserved. Managed and
                        operated in USA.
                    </p>
                </div>
            </footer>
        </div>
    );
}
