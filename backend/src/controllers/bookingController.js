import Booking from "../models/booking.js";
import { sendBookingConfirmationEmail, sendLeadNotificationEmail } from "../utils/email.js";

export const saveBasicDetails = async (req, res) => {
    try {
        const {
            bookingId,
            tripType,
            orderType,
            pickupAddress,
            pickupType,
            dropoffAddress,
            dropoffType,
            stops,
            datetime,
            passengers,
            duration,
            returnDate,
            returnStops,
            returnPickupAddress,
            returnDropoffAddress,
        } = req.body;

        // Validate required fields
        if (!tripType) {
            return res.status(400).json({ msg: "Trip type is required" });
        }
        if (!pickupAddress) {
            return res.status(400).json({ msg: "Pickup address is required" });
        }
        if (!dropoffAddress) {
            return res.status(400).json({ msg: "Drop-off address is required" });
        }
        if (!datetime) {
            return res.status(400).json({ msg: "Date and time is required" });
        }
        if (!passengers || passengers < 1) {
            return res.status(400).json({ msg: "Passenger count is required" });
        }

        // Parse datetime to ensure it's a valid date
        const parsedDatetime = datetime ? new Date(datetime) : null;
        if (datetime && isNaN(parsedDatetime?.getTime())) {
            return res.status(400).json({ msg: "Invalid date format" });
        }

        const parsedReturnDate = returnDate ? new Date(returnDate) : null;

        let booking;

        if (bookingId) {
            booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ msg: "Booking not found" });
            }
            booking.tripType = tripType;
            booking.orderType = orderType;
            booking.pickupAddress = pickupAddress;
            booking.pickupType = pickupType;
            booking.dropoffAddress = dropoffAddress;
            booking.dropoffType = dropoffType;
            booking.stops = stops || [];
            booking.datetime = parsedDatetime;
            booking.passengers = passengers;
            booking.duration = duration;
            booking.returnDate = parsedReturnDate;
            booking.returnStops = returnStops || [];
            booking.returnPickupAddress = returnPickupAddress;
            booking.returnDropoffAddress = returnDropoffAddress;
            await booking.save();
        } else {
            booking = await Booking.create({
                tripType,
                orderType,
                pickupAddress,
                pickupType,
                dropoffAddress,
                dropoffType,
                stops: stops || [],
                datetime: parsedDatetime,
                passengers,
                duration,
                returnDate: parsedReturnDate,
                returnStops: returnStops || [],
                returnPickupAddress,
                returnDropoffAddress,
            });
        }

        res.status(200).json({
            success: true,
            bookingId: booking._id,
            confirmationNumber: booking.confirmationNumber,
        });
    } catch (error) {
        console.error("Error saving basic details:", error);
        res.status(500).json({ msg: "Failed to save booking details" });
    }
};

export const saveVehicleSelection = async (req, res) => {
    try {
        const { bookingId, busId, busDetails } = req.body;

        if (!bookingId) {
            return res.status(400).json({ msg: "Booking ID is required" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        booking.busId = busId;
        booking.busDetails = {
            name: busDetails.name,
            image: busDetails.image,
            price: busDetails.price,
            taxes: busDetails.taxes || 0,
            passengers: busDetails.passengers,
            amenities: busDetails.amenities || [],
            inclusions: busDetails.inclusions || [],
            exclusions: busDetails.exclusions || [],
        };

        await booking.save();

        res.status(200).json({
            success: true,
            bookingId: booking._id,
            busDetails: booking.busDetails,
        });
    } catch (error) {
        console.error("Error saving vehicle selection:", error);
        res.status(500).json({ msg: "Failed to save vehicle selection" });
    }
};

export const saveContactDetails = async (req, res) => {
    try {
        const { bookingId, contact } = req.body;

        if (!bookingId) {
            return res.status(400).json({ msg: "Booking ID is required" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        booking.contact = {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            countryCode: contact.countryCode,
        };

        await booking.save();

        res.status(200).json({
            success: true,
            bookingId: booking._id,
            contact: booking.contact,
        });
    } catch (error) {
        console.error("Error saving contact details:", error);
        res.status(500).json({ msg: "Failed to save contact details" });
    }
};

export const confirmBooking = async (req, res) => {
    try {
        const { bookingId, pricing } = req.body;

        if (!bookingId) {
            return res.status(400).json({ msg: "Booking ID is required" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        if (pricing) {
            booking.pricing = {
                baseFare: pricing.baseFare || booking.busDetails?.price || 0,
                fuelSurcharge: pricing.fuelSurcharge || 45,
                driverGratuity:
                    pricing.driverGratuity ||
                    (booking.busDetails?.price || 0) * 0.1,
                serviceFees: pricing.serviceFees || 12.5,
                totalAmount:
                    pricing.totalAmount ||
                    (booking.busDetails?.price || 0) +
                        45 +
                        (booking.busDetails?.price || 0) * 0.1 +
                        12.5,
                currency: pricing.currency || "USD",
            };
        }

        booking.status = "confirmed";
        booking.paymentStatus = "pending";

        await booking.save();

        // Send email to customer
        if (booking.contact?.email) {
            try {
                await sendBookingConfirmationEmail(booking);
            } catch (emailError) {
                console.error("Failed to send confirmation email:", emailError);
            }
        }

        // Send lead notification to admin
        try {
            await sendLeadNotificationEmail(booking);
        } catch (leadEmailError) {
            console.error("Failed to send lead notification email:", leadEmailError);
        }

        res.status(200).json({
            success: true,
            booking: {
                _id: booking._id,
                confirmationNumber: booking.confirmationNumber,
                status: booking.status,
                pricing: booking.pricing,
                tripDetails: {
                    tripType: booking.tripType,
                    pickupAddress: booking.pickupAddress,
                    dropoffAddress: booking.dropoffAddress,
                    datetime: booking.datetime,
                    passengers: booking.passengers,
                },
                busDetails: booking.busDetails,
                contact: booking.contact,
            },
        });
    } catch (error) {
        console.error("Error confirming booking:", error);
        res.status(500).json({ msg: "Failed to confirm booking" });
    }
};

export const getBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ msg: "Failed to fetch booking" });
    }
};

export const getBookingByConfirmation = async (req, res) => {
    try {
        const { confirmationNumber } = req.params;

        const booking = await Booking.findOne({ confirmationNumber });
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ msg: "Failed to fetch booking" });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ msg: "Failed to cancel booking" });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ msg: "Failed to fetch bookings" });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({ 
            success: true, 
            message: "Booking deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ msg: "Failed to delete booking" });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { contact, passengers, pickupAddress, dropoffAddress, vehicleType, luggage, datetime, status, pricing } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        if (contact) booking.contact = { ...booking.contact, ...contact };
        if (passengers) booking.passengers = passengers;
        if (pickupAddress) booking.pickupAddress = pickupAddress;
        if (dropoffAddress) booking.dropoffAddress = dropoffAddress;
        if (vehicleType) booking.vehicleType = vehicleType;
        if (luggage) booking.luggage = luggage;
        if (datetime) booking.datetime = datetime;
        if (status) booking.status = status;
        if (pricing) booking.pricing = { ...booking.pricing, ...pricing };

        await booking.save();

        res.status(200).json({ 
            success: true, 
            booking 
        });
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ msg: "Failed to update booking" });
    }
};
