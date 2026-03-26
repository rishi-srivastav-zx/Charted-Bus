import { Router } from "express";
import {
    getAllBuses,
    searchBuses,
    getPopularBuses,
    getBusById,
    createBus,
    updateBus,
    deleteBus,
    uploadImages,
    getAllBusesAdmin,
} from "../controllers/busController.js";
import { validateQuery } from "../middlewares/validation.js";   

import { validateBus } from "../middlewares/validation.js";
import { protect, restrictTo } from "../middlewares/auth.js";

const router = Router();

/* ===============================
PUBLIC ROUTES
================================ */

router.get("/",validateQuery, getAllBuses);
router.get("/search",validateQuery, searchBuses);
router.get("/popular",validateQuery, getPopularBuses);
router.get("/:id",validateQuery, getBusById);

/* ===============================
ADMIN ROUTES
================================ */

// Get all buses (admin only)
router.get("/admin/all", protect, restrictTo("admin", "superadmin"), getAllBusesAdmin);

/* ===============================
PROTECTED ROUTES
================================ */

router.post(
    "/",
    protect,
    restrictTo("operator", "admin", "superadmin"),
    validateBus,
    createBus,
);

router.put(
    "/:id",
    protect,
    restrictTo("operator", "admin", "superadmin"),
    validateBus,
    updateBus,
);

router.delete(
    "/:id",
    protect,
    restrictTo("operator", "admin", "superadmin"),
    deleteBus,
);

router.post(
    "/:id/images",
    protect,
    restrictTo("operator", "admin", "superadmin"),
    uploadImages,
);

export default router;