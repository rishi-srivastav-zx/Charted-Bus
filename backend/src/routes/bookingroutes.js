import express from "express";
import {
    saveBasicDetails,
    saveVehicleSelection,
    saveContactDetails,
    confirmBooking,
    getBooking,
    getBookingByConfirmation,
    cancelBooking,
    getAllBookings,
    deleteBooking,
    updateBooking,  
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/basic-details", saveBasicDetails);
router.post("/vehicle-selection", saveVehicleSelection);
router.post("/contact", saveContactDetails);
router.post("/confirm", confirmBooking);
router.get("/:bookingId", getBooking);
router.get("/confirmation/:confirmationNumber", getBookingByConfirmation);
router.patch("/:bookingId/cancel", cancelBooking);
router.get("/", getAllBookings);
router.delete("/:id", deleteBooking);
router.put("/:id", updateBooking);  

export default router;
