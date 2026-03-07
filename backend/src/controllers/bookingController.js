import Booking from "../models/booking.js";
import Schedule from "../models/schedule.js";
import Bus from "../models/bus.js";

export const createBooking = async (req, res) => {
    const { bookingType } = req.body;

    if (bookingType === "SEAT") {
        const schedule = await Schedule.findById(req.body.scheduleId);

        // seat check
        for (let seat of req.body.seats) {
            if (schedule.bookedSeats.includes(seat)) {
                return res.status(400).json({ msg: "Seat already booked" });
            }
        }

        // update seats
        schedule.bookedSeats.push(...req.body.seats);
        schedule.availableSeats = schedule.availableSeats.filter(
            (s) => !req.body.seats.includes(s),
        );
        await schedule.save();

        const total = req.body.seats.length * schedule.pricePerSeat;

        const booking = await Booking.create({
            ...req.body,
            totalAmount: total,
        });

        return res.json(booking);
    }

    if (bookingType === "CHARTER") {
        const bus = await Bus.findById(req.body.busId);

        const total = req.body.distanceKm * bus.charterPricing.pricePerKm;

        const booking = await Booking.create({
            ...req.body,
            totalAmount: total,
        });

        return res.json(booking);
    }
};
