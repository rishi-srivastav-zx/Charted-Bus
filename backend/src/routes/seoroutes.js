import express from "express";
import {
    createPage,
    getAllPages,
    getPageById,
    getPageBySlug,
    previewPageBySlug,
    updatePage,
    patchPage,
    deletePage,
    publishPage,
} from "../controllers/seoController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Public routes - MUST come before /:id
router.get("/slug", getPageBySlug);

// Admin only routes
router.post("/", protect, createPage);
router.get("/", getAllPages);

// Admin preview - any status
router.get("/preview", protect, previewPageBySlug);

// Admin only - single resource operations (MUST be last)
router
    .route("/:id")
    .get(protect, getPageById)
    .put(protect, updatePage)
    .patch(protect, patchPage)
    .delete(protect, deletePage);

router.patch("/:id/publish", protect, publishPage);

export default router;
