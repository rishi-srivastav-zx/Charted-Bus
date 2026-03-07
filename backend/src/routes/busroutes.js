import { Router } from "express";
const router = Router();
import { getAllBuses, searchBuses, getFilters, getPopularBuses, getBusById, getBusReviews, createBus, updateBus, deleteBus, toggleAvailability, uploadImages, getAllBusesAdmin, verifyBus, permanentDeleteBus } from "../controllers/busController.js";
import { validateBus, validateQuery } from "../middlewares/validation.js";
import { protect, restrictTo } from "../middlewares/auth.js";


router.get("/", validateQuery, getAllBuses);
router.get("/search", searchBuses);
router.get("/filters", getFilters);
router.get("/popular", getPopularBuses);
router.get("/:id", getBusById);
router.get("/:id/reviews", getBusReviews);


router.post(
    "/",
    protect,
    restrictTo("operator", "admin"),
    validateBus,
    createBus,
);
router.put(
    "/:id",
    protect,
    restrictTo("operator", "admin"),
    validateBus,
    updateBus,
);
router.delete(
    "/:id",
    protect,
    restrictTo("operator", "admin"),
    deleteBus,
);
router.patch(
    "/:id/availability",
    protect,
    restrictTo("operator", "admin"),
    toggleAvailability,
);
router.post(
    "/:id/images",
    protect,
    restrictTo("operator", "admin"),
    uploadImages,
);

// Admin Only Routes
router.get(
    "/admin/all",
    protect,
    restrictTo("admin"),
    getAllBusesAdmin,
);
router.patch(
    "/admin/:id/verify",
    protect,
    restrictTo("admin"),
    verifyBus,
);
router.delete(
    "/admin/:id/permanent",
    protect,
    restrictTo("admin"),
    permanentDeleteBus,
);

export default router;
