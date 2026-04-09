import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        tripType: {
            type: String,
            enum: ["hourly", "one-way", "round-trip"],
            required: true,
        },
        orderType: {
            type: String,
            required: true,
        },
        pickupAddress: {
            type: String,
            required: true,
        },
        pickupType: {
            type: String,
            enum: ["address", "airport"],
            default: "address",
        },
        dropoffAddress: {
            type: String,
            required: true,
        },
        dropoffType: {
            type: String,
            enum: ["address", "airport"],
            default: "address",
        },
        stops: [
            {
                type: String,
            },
        ],
        datetime: {
            type: Date,
            required: true,
        },
        passengers: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
        },
        returnDate: {
            type: Date,
        },
        returnStops: [
            {
                type: String,
            },
        ],
        returnPickupAddress: String,
        returnDropoffAddress: String,
        busId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
        },
        busDetails: {
            name: String,
            image: String,
            price: Number,
            taxes: Number,
            passengers: Number,
            amenities: [String],
            inclusions: [String],
            exclusions: [String],
        },
        contact: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            countryCode: String,
        },
        pricing: {
            baseFare: Number,
            fuelSurcharge: Number,
            driverGratuity: Number,
            serviceFees: Number,
            totalAmount: Number,
            currency: {
                type: String,
                default: "USD",
            },
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        confirmationNumber: {
            type: String,
            unique: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.pre("save", function () {
    if (!this.confirmationNumber) {
        const date = new Date();
        const random = Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, "0");
        this.confirmationNumber = `LB-${date.getFullYear()}${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}${random}`;
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
