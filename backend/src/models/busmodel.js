import mongoose from "mongoose";

const FeatureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: mongoose.Schema.Types.Mixed },
});

const InclusionSchema = new mongoose.Schema({
    title: { type: String, required: true },
});

const ExclusionSchema = new mongoose.Schema({
    title: { type: String, required: true },
});

const AddOnSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number },
    isOptional: { type: Boolean, default: true },
});

const AdditionalInfoSchema = new mongoose.Schema({
    label: { type: String },
    value: { type: String },
});

const PolicySchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
});

const VehicleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        creatorRole: {
            type: String,
            enum: ["admin", "operator", "superadmin"],
        },
        image: { type: String },
        category: {
            type: String,
            enum: ["Luxury Coach", "Mini Bus", "Volvo Bus", "Sleeper Bus", "AC Deluxe", "Non-AC Standard"],
        },
        seatCapacity: { type: Number },
        isMostPopular: { type: Boolean, default: false },
        isElectric: { type: Boolean, default: false },
        isPremium: { type: Boolean, default: false },

        licensePlate: { type: String },
        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
            default: "Petrol",
        },
        luggageCapacity: { type: Number },

        pricing: {
            price: { type: Number, required: true },
            originalPrice: { type: Number },
            discountPercent: { type: Number },
            extraCharges: { type: Number, default: 0 },
            totalPrice: { type: Number },
            currency: {
                type: String,
                enum: ["USD", "INR", "EUR", "GBP", "AED"],
                default: "USD",
            },
            billingCycle: {
                type: String,
                enum: [
                    "per_hour",
                    "per_day",
                    "per_week",
                    "per_month",
                    "per_km",
                ],
                default: "per_day",
            },
        },

        distancePolicy: {
            includedKm: { type: Number },
            extraKmPrice: { type: Number },
        },
        driverAllowanceIncluded: { type: Boolean, default: true },
        nightChargesApplicable: { type: Boolean, default: false },
        nightChargesStartTime: { type: String, default: "22:00" },
        nightChargesExtra: { type: Number },

        features: [FeatureSchema],
        inclusions: [InclusionSchema],
        exclusions: [ExclusionSchema],
        addOns: [AddOnSchema],
        additionalInfo: [AdditionalInfoSchema],
        policies: [PolicySchema],
    },
    { timestamps: true },
);

export default mongoose.model("Bus", VehicleSchema);
