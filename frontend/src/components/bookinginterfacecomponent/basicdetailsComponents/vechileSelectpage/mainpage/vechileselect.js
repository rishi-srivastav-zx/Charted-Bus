"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { getAllBuses } from "@/services/busservices";
import {
    saveVehicleSelection,
    saveContactDetails,
    getBooking,
} from "@/services/bookingservice";

import VehicleCard from "../vehicleCard";
import FilterBar from "../FilterBar";
import TripSummary from "../TripSummary";
import ContactFormModal from "../ContactFormModal";
import { VehicleErrorBanner, ContactRequiredBanner } from "../ErrorBanner";
import LoadingSkeleton from "../LoadingSkeleton";
import { ErrorEmptyState, NoBusesEmptyState } from "../EmptyState";
import ShowMoreButton from "../ShowMoreButton";
import MobileContinueButton from "../MobileContinueButton";

export default function SelectVehiclePage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [tripDetails, setTripDetails] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [bookingVehicleData, setBookingVehicleData] = useState(null);
    const [visibleCount, setVisibleCount] = useState(4);
    const router = useRouter();

    const [bookingId, setBookingId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("bookingId");
        }
        return null;
    });

    useEffect(() => {
        setVisibleCount(4);
    }, [activeFilter]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const currentBookingId = localStorage.getItem("bookingId");
                if (currentBookingId) {
                    setBookingId(currentBookingId);
                    try {
                        const bookingResponse =
                            await getBooking(currentBookingId);
                        const booking = bookingResponse.data?.booking;
                        if (booking) {
                            const formattedBooking = {
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
                                                  passengers:
                                                      booking.passengers,
                                                  stops: booking.stops,
                                              }
                                            : null,
                                    return:
                                        booking.tripType === "round-trip"
                                            ? {
                                                  pickupAddress:
                                                      booking.returnPickupAddress,
                                                  dropoffAddress:
                                                      booking.returnDropoffAddress,
                                                  datetime: booking.returnDate,
                                                  stops: booking.returnStops,
                                              }
                                            : null,
                                },
                                timestamp: booking.createdAt,
                            };
                            setTripDetails(formattedBooking);
                            if (booking.contact)
                                setContactData(booking.contact);
                            if (booking.busId)
                                setSelectedVehicleId(booking.busId);
                            if (booking.busDetails)
                                setBookingVehicleData(booking.busDetails);
                        }
                    } catch (bookingErr) {
                        console.error("Error fetching booking:", bookingErr);
                        const storedBooking =
                            localStorage.getItem("bookingStep1");
                        if (storedBooking)
                            setTripDetails(JSON.parse(storedBooking));
                    }
                } else {
                    const storedBooking = localStorage.getItem("bookingStep1");
                    if (storedBooking)
                        setTripDetails(JSON.parse(storedBooking));
                }

                const response = await getAllBuses();
                const buses = response?.data?.data ?? response?.data ?? [];

                if (!Array.isArray(buses))
                    throw new Error("Invalid data format received");

                const mappedBuses = buses.map((bus) => {
                    const inclusionsList = (bus.inclusions || [])
                        .map((i) => i.title)
                        .filter(Boolean);
                    const exclusionsList = (bus.exclusions || [])
                        .map((i) => i.title)
                        .filter(Boolean);
                    const currency = bus.pricing?.currency || "USD";

                    return {
                        id: bus._id?.toString() || bus.id,
                        name: bus.name || "Charter Bus",
                        price: bus.pricing?.price || 0,
                        originalPrice: bus.pricing?.originalPrice || 0,
                        discount: bus.pricing?.discountPercent || 0,
                        passengers: bus.seatCapacity || 0,
                        luggage: bus.luggageCapacity || 0,
                        image:
                            bus.image || "https://via.placeholder.com/400x300",
                        amenities: (bus.features || []).map((f) => f.name),
                        badge: bus.isMostPopular
                            ? "Most Popular"
                            : bus.isPremium
                              ? "Premium"
                              : null,
                        category:
                            bus.category === "Mini Bus"
                                ? "small"
                                : bus.category === "Luxury Coach" ||
                                    bus.category === "Volvo Bus"
                                  ? "large"
                                  : "medium",
                        inclusions:
                            inclusionsList.length > 0
                                ? inclusionsList
                                : [
                                      "Driver Allowance",
                                      "GST (5%)",
                                      "State Tax & Toll",
                                  ],
                        exclusions:
                            exclusionsList.length > 0
                                ? exclusionsList
                                : [
                                      "Parking charges",
                                      "Night charges (10 PM - 6 AM)",
                                  ],
                        extraKmRate: bus.distancePolicy?.extraKmPrice || 0,
                        includedKms: bus.distancePolicy?.includedKm || 0,
                        taxes: bus.pricing?.extraCharges || 0,
                        currency: currency,
                        billingCycle: bus.pricing?.billingCycle,
                    };
                });

                setVehicles(mappedBuses);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load data");
                setVehicles([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredVehicles = Array.isArray(vehicles)
        ? activeFilter === "all"
            ? vehicles
            : vehicles.filter((v) => v.category === activeFilter)
        : [];

    const visibleVehicles = filteredVehicles.slice(0, visibleCount);
    const hasMoreVehicles = visibleCount < filteredVehicles.length;
    const remainingCount = filteredVehicles.length - visibleCount;

    const selectedVehicle = selectedVehicleId
        ? vehicles?.find((v) => v.id === selectedVehicleId)
        : null;

    const handleVehicleSelect = async (vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setShowError(false);

        const vehicle = vehicles?.find((v) => v.id === vehicleId);
        if (vehicle) {
            localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));
            const currentBookingId = localStorage.getItem("bookingId");
            if (currentBookingId) {
                try {
                    await saveVehicleSelection({
                        bookingId: currentBookingId,
                        busId: vehicleId,
                        busDetails: {
                            name: vehicle.name,
                            image: vehicle.image,
                            price: vehicle.price,
                            taxes: vehicle.taxes,
                            passengers: vehicle.passengers,
                            amenities: vehicle.amenities,
                            inclusions: vehicle.inclusions,
                            exclusions: vehicle.exclusions,
                        },
                    });
                } catch (error) {
                    console.error("Error saving vehicle selection:", error);
                }
            }
        }
        if (selectedVehicleId !== vehicleId) {
            setContactData(null);
            localStorage.removeItem("bookingContact");
        }
    };

    const handleContinueClick = () => {
        if (!selectedVehicleId) {
            setShowError(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!contactData) {
            setShowContactModal(true);
            return;
        }
        handleFinalProceed();
    };

    const handleContactSubmit = async (data) => {
        setContactData(data);
        localStorage.setItem("bookingContact", JSON.stringify(data));

        let currentBookingId = localStorage.getItem("bookingId");
        if (!currentBookingId) {
            const savedStep1 = localStorage.getItem("bookingStep1");
            if (savedStep1) {
                try {
                    const step1Data = JSON.parse(savedStep1);
                    const { saveBasicDetails } =
                        await import("@/services/bookingservice");
                    const response = await saveBasicDetails({
                        tripType: step1Data.tripType,
                        ...step1Data.formData,
                    });
                    if (response.data?.bookingId) {
                        currentBookingId = response.data.bookingId;
                        localStorage.setItem("bookingId", currentBookingId);
                        setBookingId(currentBookingId);
                    }
                } catch (err) {
                    console.error("Error creating booking:", err);
                }
            }
        }

        if (currentBookingId) {
            try {
                await saveContactDetails({
                    bookingId: currentBookingId,
                    contact: data,
                });
            } catch (error) {
                console.error("Error saving contact to backend:", error);
            }
        }

        setTimeout(() => handleFinalProceed(), 500);
    };

    const handleFinalProceed = async () => {
        if (!selectedVehicleId || !contactData) return;
        setIsSaving(true);

        const currentBookingId = localStorage.getItem("bookingId") || bookingId;
        try {
            if (currentBookingId) {
                await saveContactDetails({
                    bookingId: currentBookingId,
                    contact: contactData,
                });
            }
            const bookingData = {
                vehicle: selectedVehicle,
                contact: contactData,
                timestamp: new Date().toISOString(),
                bookingId: currentBookingId || bookingId,
            };
            localStorage.setItem("bookingStep2", JSON.stringify(bookingData));
            router.push("/bookingform/vechileselect/confirmation");
        } catch (error) {
            console.error("Error saving contact details:", error);
            const bookingData = {
                vehicle: selectedVehicle,
                contact: contactData,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem("bookingStep2", JSON.stringify(bookingData));
            router.push("/bookingform/vechileselect/confirmation");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 mt-20">
            <Head>
                <title>Select Vehicle | CharterBus</title>
            </Head>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8">
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Select Your Vehicle
                            </h1>
                        </div>

                        {showError && !selectedVehicleId && (
                            <VehicleErrorBanner />
                        )}
                        {selectedVehicleId && !contactData && (
                            <ContactRequiredBanner />
                        )}

                        <FilterBar
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                        />

                        {loading ? (
                            <LoadingSkeleton />
                        ) : error ? (
                            <ErrorEmptyState
                                error={error}
                                onRetry={() => window.location.reload()}
                            />
                        ) : filteredVehicles.length === 0 ? (
                            <NoBusesEmptyState />
                        ) : (
                            <div className="space-y-4">
                                {visibleVehicles.map((vehicle, idx) => (
                                    <VehicleCard
                                        key={`${vehicle.id}-${idx}`}
                                        vehicle={vehicle}
                                        isSelected={
                                            selectedVehicleId === vehicle.id
                                        }
                                        onSelect={handleVehicleSelect}
                                    />
                                ))}

                                {hasMoreVehicles && (
                                    <ShowMoreButton
                                        remainingCount={remainingCount}
                                        onClick={() =>
                                            setVisibleCount((prev) =>
                                                Math.min(
                                                    prev + 3,
                                                    filteredVehicles.length,
                                                ),
                                            )
                                        }
                                    />
                                )}

                                {!hasMoreVehicles &&
                                    filteredVehicles.length > 4 && (
                                        <div className="pt-4 text-center">
                                            <p className="text-xs sm:text-sm text-slate-400">
                                                All {filteredVehicles.length}{" "}
                                                buses shown
                                            </p>
                                        </div>
                                    )}
                            </div>
                        )}

                        <MobileContinueButton
                            selectedVehicleId={selectedVehicleId}
                            contactData={contactData}
                            onClick={handleContinueClick}
                            showError={showError}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4">
                        <TripSummary
                            tripDetails={tripDetails}
                            selectedVehicle={selectedVehicle}
                            bookingVehicleData={bookingVehicleData}
                            onContinue={handleContinueClick}
                            showError={showError}
                            contactData={contactData}
                            isSaving={isSaving}
                        />
                    </div>
                </div>
            </main>

            <ContactFormModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                onSubmit={handleContactSubmit}
                initialData={contactData}
            />

            <footer className="bg-white border-t border-slate-200 mt-20 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-slate-500">
                    <p>© 2024 CharterBus. All rights reserved.</p>
                    <div className="flex gap-4 sm:gap-6">
                        <a href="#" className="hover:text-slate-900">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-slate-900">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
