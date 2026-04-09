import Bus from "../models/busmodel.js";
import { cloudinary as cloudinaryV2 } from "../config/cloudnary.js";

/* ======================================================
GET ALL BUSES
====================================================== */
export async function getAllBuses(req, res) {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            fuelType,
            minCapacity,
            maxCapacity,
            minPrice,
            maxPrice,
            isPremium,
            isElectric,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        const filter = { isDeleted: false };

        if (category) filter.category = category;
        if (fuelType) filter.fuelType = fuelType;

        if (isPremium !== undefined) filter.isPremium = isPremium === "true";

        if (isElectric !== undefined) filter.isElectric = isElectric === "true";

        if (minCapacity || maxCapacity) {
            filter.seatCapacity = {};
            if (minCapacity) filter.seatCapacity.$gte = parseInt(minCapacity);
            if (maxCapacity) filter.seatCapacity.$lte = parseInt(maxCapacity);
        }

        if (minPrice || maxPrice) {
            filter["pricing.price"] = {};
            if (minPrice) filter["pricing.price"].$gte = parseFloat(minPrice);
            if (maxPrice) filter["pricing.price"].$lte = parseFloat(maxPrice);
        }

        const sortOptions = {};
        sortOptions[sortBy] = order === "asc" ? 1 : -1;

        const buses = await Bus.find(filter)
            // .populate("name email")
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Bus.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: buses.length,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: buses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

/* ======================================================
GET ALL BUSES (ADMIN - NO PAGINATION)
====================================================== */
export async function getAllBusesAdmin(req, res) {
    try {
        const buses = await Bus.find({ isDeleted: false }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

/* ======================================================
GET BUS BY ID
====================================================== */
export async function getBusById(req, res) {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Bus ID is required"
            });
        }

        // Try to find by _id first, then by id field
        let bus = await Bus.findOne({ _id: id, isDeleted: false }).populate("operator", "name email");
        
        // If not found, try by custom id field
        if (!bus) {
            bus = await Bus.findOne({ id: id, isDeleted: false }).populate("operator", "name email");
        }

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found"
            });
        }

        res.status(200).json({
            success: true,
            data: bus,
        });
    } catch (error) {
        console.error("GetBusById error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
}

/* ======================================================
POPULAR BUSES
====================================================== */
export async function getPopularBuses(req, res) {
    try {
        const buses = await Bus.find({ isMostPopular: true, isDeleted: false }).limit(6);

        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

/* ======================================================
CREATE BUS
====================================================== */
export async function createBus(req, res) {
    try {
        const bus = await Bus.create({
            ...req.body,
            createdBy: req.user.id,
            creatorRole: req.user.role,
        });

        res.status(201).json({
            success: true,
            message: "Bus created successfully",
            data: bus,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
/* ======================================================
UPDATE BUS
====================================================== */
export async function updateBus(req, res) {
    try {
        const bus = await Bus.findOne({ _id: req.params.id, isDeleted: false });

        if (!bus) {
            return res
                .status(404)
                .json({ success: false, message: "Bus not found" });
        }

        if (
            bus.createdBy.toString() !== req.user.id &&
            req.user.role !== "admin" &&
            req.user.role !== "superadmin"
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Not authorized" });
        }

        const updatedBus = await Bus.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            {
                new: true,
                runValidators: true,
            },
        );

        res.status(200).json({
            success: true,
            data: updatedBus,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

/* ======================================================
DELETE BUS (SOFT DELETE)
====================================================== */
export async function deleteBus(req, res) {
    try {
        const bus = await Bus.findOne({ _id: req.params.id, isDeleted: false });

        if (!bus) {
            return res
                .status(404)
                .json({ success: false, message: "Bus not found" });
        }

        if (
            bus.createdBy.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Not authorized" });
        }

        await Bus.findByIdAndUpdate(req.params.id, {
            isDeleted: true,
            deletedAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Bus deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

/* ======================================================
UPLOAD BUS IMAGES
====================================================== */
export async function uploadImages(req, res) {
    try {
        const bus = await Bus.findOne({ _id: req.params.id, isDeleted: false });

        if (!bus) {
            return res
                .status(404)
                .json({ success: false, message: "Bus not found" });
        }

        const uploads = await Promise.all(
            req.files.map((file) =>
                cloudinaryV2.uploader.upload(file.path, {
                    folder: "buses",
                }),
            ),
        );

        const images = uploads.map((u) => u.secure_url);

        bus.image = images[0];
        await bus.save();

        res.status(200).json({
            success: true,
            data: images,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
