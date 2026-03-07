import mongoose from "mongoose";

const FeatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String, // wifi, ac, tv, leather etc
    },
});

const InclusionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
});

const ExclusionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
});

const AddOnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    isOptional: {
        type: Boolean,
        default: true,
    },
});

const AdditionalInfoSchema = new mongoose.Schema({
    label: String,
    value: String,
});

const VehicleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
        },

        category: {
            type: String, // van / sedan / suv
        },

        seatCapacity: {
            type: Number,
        },

        cabType: {
            type: String, // AC / Non AC
        },

        isMostPopular: {
            type: Boolean,
            default: false,
        },

        pricing: {
            price: {
                type: Number,
                required: true,
            },

            originalPrice: {
                type: Number,
            },

            discountPercent: {
                type: Number,
            },

            extraCharges: {
                type: Number,
            },

            totalPrice: {
                type: Number,
            },
        },

        distancePolicy: {
            includedKm: {
                type: Number,
            },

            extraKmPrice: {
                type: Number,
            },
        },

        driverAllowanceIncluded: {
            type: Boolean,
            default: true,
        },

        features: [FeatureSchema],

        inclusions: [InclusionSchema],

        exclusions: [ExclusionSchema],

        addOns: [AddOnSchema],

        additionalInfo: [AdditionalInfoSchema],
    },
    { timestamps: true },
);

export default mongoose.model("Vehicle", VehicleSchema);
