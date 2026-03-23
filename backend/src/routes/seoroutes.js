import express from "express";
import {
    createPage,
    getAllPages,
    getPageById,
    getPageBySlug,
    updatePage,
    patchPage,
    deletePage,
} from "../controllers/seoController.js";

const router = express.Router();

// POST   /api/charter-bus              → create
// GET    /api/charter-bus              → get all
router.route("/").post(createPage).get(getAllPages);

// GET    /api/charter-bus/slug/:slug   → get by slug (must stay above /:id)
router.get("/slug/:slug", getPageBySlug);

// GET    /api/charter-bus/:id          → get one
// PUT    /api/charter-bus/:id          → full update
// PATCH  /api/charter-bus/:id          → partial update (single wizard step)
// DELETE /api/charter-bus/:id          → delete
router
    .route("/:id")
    .get(getPageById)
    .put(updatePage)
    .patch(patchPage)
    .delete(deletePage);

export default router;
