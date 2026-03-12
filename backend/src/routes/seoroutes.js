import express from "express";
import {
    createPage,
    getAllPages,
    getPageById,
    getPageBySlug,
    updatePage,
    deletePage,
} from "../controllers/seoController.js";

const router = express.Router();

// POST   /api/charter-bus            → create
// GET    /api/charter-bus            → get all
router.route("/").post(createPage).get(getAllPages);

// GET    /api/charter-bus/slug/:slug → get by slug (must be before /:id)
router.get("/slug/:slug", getPageBySlug);

// GET    /api/charter-bus/:id        → get one
// PUT    /api/charter-bus/:id        → update
// DELETE /api/charter-bus/:id        → delete
router.route("/:id").get(getPageById).put(updatePage).delete(deletePage);

export default router;
