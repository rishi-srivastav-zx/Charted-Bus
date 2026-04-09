"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Bus, ArrowRight, AlertCircle, User, ChevronDown } from "lucide-react";
import { cn } from "../../app/lib/uitls";
import { FILTERS } from "./basicdetailsComponents/vechileselectcomponents/options";
import VehicleCard from "./basicdetailsComponents/vechileselectcomponents/VehicleCard";
import TripSummary from "./basicdetailsComponents/vechileselectcomponents/TripSummary";
import ContactFormModal from "./basicdetailsComponents/vechileselectcomponents/ContactFormModal";
import { getAllBuses } from "../../services/busservices";
import {
    saveVehicleSelection,
    saveContactDetails,
    getBooking,
} from "../../services/bookingservice";

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
    const [visibleCount, setVisibleCount] = useState(4); // Start with 4 buses
    const router = useRouter();

    // Get bookingId from localStorage or props
    const [bookingId, setBookingId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("bookingId");
        }
        return null;
    });

    // Reset visible count when filter changes
    useEffect(() => {
        setVisibleCount(4);
    }, [activeFilter]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                // Fetch booking details if bookingId exists
                const currentBookingId = localStorage.getItem("bookingId");
                if (currentBookingId) {
                    setBookingId(currentBookingId);
                    try {
                        const bookingResponse =
                            await getBooking(currentBookingId);
                        const booking = bookingResponse.data?.booking;
                        if (booking) {
                            // Format booking data for trip summary
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

                            // Also load contact data if available
                            if (booking.contact) {
                                setContactData(booking.contact);
                            }

                            // Also set selected vehicle if available
                            if (booking.busId) {
                                setSelectedVehicleId(booking.busId);
                            }

                            // Set vehicle data from booking if available
                            if (booking.busDetails) {
                                setBookingVehicleData(booking.busDetails);
                            }
                        }
                    } catch (bookingErr) {
                        console.error("Error fetching booking:", bookingErr);
                        // Fall back to localStorage
                        const storedBooking =
                            localStorage.getItem("bookingStep1");
                        if (storedBooking) {
                            setTripDetails(JSON.parse(storedBooking));
                        }
                    }
                } else {
                    // Fall back to localStorage
                    const storedBooking = localStorage.getItem("bookingStep1");
                    if (storedBooking) {
                        setTripDetails(JSON.parse(storedBooking));
                    }
                }

                // Fetch buses
                const response = await getAllBuses();

                const buses = response?.data?.data ?? response?.data ?? [];

                if (!Array.isArray(buses)) {
                    throw new Error("Invalid data format received");
                }

                if (buses.length === 0) {
                    setVehicles([]);
                    setLoading(false);
                    return;
                }

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

    // Get visible vehicles based on count
    const visibleVehicles = filteredVehicles.slice(0, visibleCount);
    const hasMoreVehicles = visibleCount < filteredVehicles.length;
    const remainingCount = filteredVehicles.length - visibleCount;

    const handleShowMore = () => {
        setVisibleCount((prev) => Math.min(prev + 3, filteredVehicles.length));
    };

    const selectedVehicle = selectedVehicleId
        ? vehicles?.find((v) => v.id === selectedVehicleId)
        : null;

    const handleVehicleSelect = async (vehicleId) => {
        setSelectedVehicleId(vehicleId);
        setShowError(false);

        const vehicle = vehicles?.find((v) => v.id === vehicleId);
        if (vehicle) {
            localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));

            // Get latest bookingId from localStorage
            const currentBookingId = localStorage.getItem("bookingId");

            // Save vehicle selection to backend if we have a bookingId
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

        // Reset contact data when vehicle changes
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

        // If contact data not filled, show modal
        if (!contactData) {
            setShowContactModal(true);
            return;
        }

        // If everything is filled, proceed
        handleFinalProceed();
    };

    const handleContactSubmit = async (data) => {
        setContactData(data);
        localStorage.setItem("bookingContact", JSON.stringify(data));

        // Get bookingId from localStorage - ensure it exists
        let currentBookingId = localStorage.getItem("bookingId");

        // If no bookingId, create one by saving basic details first
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

        // Save contact to backend
        if (currentBookingId) {
            try {
                await saveContactDetails({
                    bookingId: currentBookingId,
                    contact: data,
                });
                console.log("Contact saved to backend successfully");
            } catch (error) {
                console.error("Error saving contact to backend:", error);
            }
        }

        // Auto proceed after contact form submission
        setTimeout(() => {
            handleFinalProceed();
        }, 500);
    };

    const handleFinalProceed = async () => {
        if (!selectedVehicleId || !contactData) {
            return;
        }

        setIsSaving(true);

        // Get latest bookingId from localStorage (in case it changed)
        const currentBookingId = localStorage.getItem("bookingId") || bookingId;

        try {
            // Save contact details to backend
            if (currentBookingId) {
                await saveContactDetails({
                    bookingId: currentBookingId,
                    contact: contactData,
                });
            }

            // Store complete booking data locally as fallback/display
            const bookingData = {
                vehicle: selectedVehicle,
                contact: contactData,
                timestamp: new Date().toISOString(),
                bookingId: currentBookingId || bookingId,
            };
            localStorage.setItem("bookingStep2", JSON.stringify(bookingData));

            // Navigate to confirmation page
            router.push("/bookingform/vechileselect/confirmation");
        } catch (error) {
            console.error("Error saving contact details:", error);
            // Still proceed even if API fails
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
                    {/* Left Column: Vehicle Selection */}
                    <div className="lg:col-span-8">
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Select Your Vehicle
                            </h1>
                        </div>

                        {/* Error Banner */}
                        {showError && !selectedVehicleId && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-red-800">
                                        Vehicle Required
                                    </p>
                                    <p className="text-sm text-red-600">
                                        Please select a vehicle from the options
                                        below to continue with your booking.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact Required Notice */}
                        {selectedVehicleId && !contactData && (
                            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                                <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-blue-800">
                                        Contact Information Required
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        Please click to "Continue" and provide
                                        your contact details to proceed.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={cn(
                                        "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all border",
                                        activeFilter === filter.id
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600",
                                    )}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Vehicle List */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 animate-pulse"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                            <div className="w-full sm:w-48 h-40 sm:h-32 bg-slate-200 rounded-xl" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-6 bg-slate-200 rounded w-2/3 sm:w-1/3" />
                                                <div className="h-4 bg-slate-100 rounded w-1/2 sm:w-1/4" />
                                                <div className="h-4 bg-slate-100 rounded w-3/4 sm:w-1/2" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-300">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    Error Loading Buses
                                </h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-4">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredVehicles.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                <Bus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    No buses available
                                </h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    There are currently no buses available for
                                    this category. Please check back later or
                                    contact support.
                                </p>
                            </div>
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

                                {/* Show More Button */}
                                {hasMoreVehicles && (
                                    <div className="pt-4 sm:pt-6">
                                        <button
                                            onClick={handleShowMore}
                                            className="w-full py-3 sm:py-4 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                                        >
                                            <span className="text-sm sm:text-base">
                                                Show More Buses
                                            </span>
                                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                {remainingCount} remaining
                                            </span>
                                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* All Buses Shown Message */}
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

                        {/* Mobile Continue Button (visible only on small screens) */}
                        <div className="lg:hidden mt-8">
                            <button
                                onClick={handleContinueClick}
                                className={cn(
                                    "w-full py-3 sm:py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm sm:text-base",
                                    selectedVehicleId
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed",
                                )}
                                disabled={!selectedVehicleId}
                            >
                                {contactData
                                    ? "Proceed to Next Step"
                                    : "Continue to Next Step"}
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            {showError && !selectedVehicleId && (
                                <p className="text-center text-red-600 text-xs sm:text-sm mt-2">
                                    Please select a vehicle first
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
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

            {/* Contact Form Modal */}
            <ContactFormModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                onSubmit={handleContactSubmit}
                initialData={contactData}
            />

            {/* Footer */}
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
