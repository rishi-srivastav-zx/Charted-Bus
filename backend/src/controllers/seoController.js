import CharterBusPage from "../models/seoSchema.js";    

// ── CREATE ────────────────────────────────────────────────────
// POST /api/charter-bus
export const createPage = async (req, res) => {
    try {
        const page = new CharterBusPage(req.body);
        const saved = await page.save();
        return res.status(201).json({ success: true, data: saved });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({ success: false, message: err.message });
        }
        if (err.code === 11000) {
            return res
                .status(409)
                .json({
                    success: false,
                    message: "A page with this slug already exists",
                });
        }
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── GET ALL ───────────────────────────────────────────────────
// GET /api/charter-bus
export const getAllPages = async (req, res) => {
    try {
        const pages = await CharterBusPage.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: pages });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── GET ONE ───────────────────────────────────────────────────
// GET /api/charter-bus/:id
export const getPageById = async (req, res) => {
    try {
        const page = await CharterBusPage.findById(req.params.id);
        if (!page) {
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        }
        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── GET BY SLUG ───────────────────────────────────────────────
// GET /api/charter-bus/slug/:slug
export const getPageBySlug = async (req, res) => {
    try {
        const page = await CharterBusPage.findOne({ slug: req.params.slug });
        if (!page) {
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        }
        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── UPDATE ────────────────────────────────────────────────────
// PUT /api/charter-bus/:id
export const updatePage = async (req, res) => {
    try {
        const page = await CharterBusPage.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true },
        );
        if (!page) {
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        }
        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({ success: false, message: err.message });
        }
        if (err.code === 11000) {
            return res
                .status(409)
                .json({
                    success: false,
                    message: "A page with this slug already exists",
                });
        }
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── DELETE ────────────────────────────────────────────────────
// DELETE /api/charter-bus/:id
export const deletePage = async (req, res) => {
    try {
        const page = await CharterBusPage.findByIdAndDelete(req.params.id);
        if (!page) {
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        }
        return res
            .status(200)
            .json({ success: true, message: "Page deleted successfully" });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};
