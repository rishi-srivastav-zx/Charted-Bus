import { cloudinary, getDateFolder } from "../config/cloudnary.js";
import CharterBusPage from "../models/seoSchema.js";

// ─── Image helpers (mirrors CloudinaryController patterns) ────────────────────

/**
 * Returns true when the value is a fresh base64 data-URL from the editor's
 * file-upload widget. Already-hosted https:// URLs are left untouched.
 */
const isBase64 = (str) => typeof str === "string" && str.startsWith("data:");

/**
 * Upload a single base64 image to Cloudinary.
 * Uses the same folder/publicId conventions as CloudinaryController.
 *
 * - If the value is already a Cloudinary URL  → return as-is (no re-upload)
 * - If the value is empty/undefined           → return ""
 * - If the value is base64                    → upload and return secure_url
 *
 * @param {string} value    - base64 data-URL or existing https:// URL
 * @param {string} folder   - e.g. "charter-bus/hero"
 * @param {string} publicId - stable id so re-saves overwrite instead of duplicate
 */
const uploadBase64Image = async (value, folder, publicId) => {
    if (!value) return "";
    if (!isBase64(value)) return value; // already a URL — skip upload

    const result = await cloudinary.uploader.upload(value, {
        folder: `${folder}/${getDateFolder()}`,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
    });

    // Return the same shape used by CloudinaryController.uploadSingle
    return result.secure_url;
};

/**
 * Delete a Cloudinary asset by its secure_url.
 * Extracts the public_id exactly as CloudinaryController.deleteFile expects it
 * (everything after /upload/vXXX/ minus the extension).
 * Errors are swallowed so a missing asset never breaks a delete request.
 */
const deleteBySecureUrl = async (secureUrl) => {
    if (!secureUrl || isBase64(secureUrl)) return;
    try {
        // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/folder/id.jpg
        const afterUpload = secureUrl.split("/upload/")[1]; // "v123/folder/id.jpg"
        const withoutVersion = afterUpload.replace(/^v\d+\//, ""); // "folder/id.jpg"
        const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); // "folder/id"

        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch (err) {
        if (process.env.NODE_ENV !== "production")
            console.warn(
                "[deleteBySecureUrl] could not delete:",
                secureUrl,
                err.message,
            );
    }
};

// ─── Per-section upload orchestration ────────────────────────────────────────

/**
 * Upload hero.heroImage if it is a new base64.
 * public_id: "<slug>-hero"  → stable overwrite on every save.
 */
const processHeroImages = async (hero, slug) => {
    if (!hero) return hero;
    return {
        ...hero,
        heroImage: await uploadBase64Image(
            hero.heroImage,
            "charter-bus/hero",
            slug ? `${slug}-hero` : undefined,
        ),
    };
};

/**
 * Upload each testimonial photo that is base64.
 * public_id: "<slug>-testimonial-<index>"
 */
const processTestimonialImages = async (testimonials, slug) => {
    if (!testimonials?.items?.length) return testimonials;

    const items = await Promise.all(
        testimonials.items.map(async (item, i) => ({
            ...item,
            photo: await uploadBase64Image(
                item.photo,
                "charter-bus/testimonials",
                slug ? `${slug}-testimonial-${i}` : undefined,
            ),
        })),
    );
    return { ...testimonials, items };
};

/**
 * Upload seo.og_image if it is base64.
 * public_id: "<slug>-og"
 */
const processSeoImages = async (seo, slug) => {
    if (!seo) return seo;
    return {
        ...seo,
        og_image: await uploadBase64Image(
            seo.og_image,
            "charter-bus/og",
            slug ? `${slug}-og` : undefined,
        ),
    };
};

/**
 * Run all three image-upload passes in parallel.
 * By the time buildDoc() runs every image field is a Cloudinary URL.
 */
const processAllImages = async (body, slug) => {
    const [hero, testimonials, seo] = await Promise.all([
        processHeroImages(body.hero, slug),
        processTestimonialImages(body.testimonials, slug),
        processSeoImages(body.seo, slug),
    ]);
    return { ...body, hero, testimonials, seo };
};

// ─── Normalise helpers ────────────────────────────────────────────────────────

// Editor sends { q, a }; schema stores { question, answer } — accept both.
const normaliseFaqItems = (items = []) =>
    items.map(({ q, a, question, answer }) => ({
        question: question ?? q ?? "",
        answer: answer ?? a ?? "",
    }));

// Editor sends rating as a string ("5"); schema stores Number.
const normaliseTestimonials = (items = []) =>
    items.map(({ rating, ...rest }) => ({
        ...rest,
        rating: Number(rating) || 5,
    }));

// ─── buildDoc ─────────────────────────────────────────────────────────────────
// Maps processed body → exact schema shape. Only keys present in the body are
// included so PATCH requests never wipe untouched sections.
const buildDoc = (body) => {
    const {
        slug,
        country,
        city,
        seo,
        main,
        hero,
        services,
        whyus,
        coverage,
        testimonials,
        faq,
    } = body;

    const doc = {};

    if (slug !== undefined) doc.slug = slug;
    if (country !== undefined) doc.country = country;
    if (city !== undefined) doc.city = city;

    if (seo !== undefined) {
        doc.seo = {
            meta_title: seo.meta_title ?? "",
            meta_description: seo.meta_description ?? "",
            focus_keyword: seo.focus_keyword ?? "",
            canonical_url: seo.canonical_url ?? "",
            og_title: seo.og_title ?? "",
            og_description: seo.og_description ?? "",
            og_image: seo.og_image ?? "", // already a Cloudinary URL here
        };
    }

    if (main !== undefined) {
        doc.main = {
            title_line1: main.title_line1 ?? "",
            description: main.description ?? "",
        };
    }

    if (hero !== undefined) {
        doc.hero = {
            heading: hero.heading ?? "",
            subtext: hero.subtext ?? "",
            heroImage: hero.heroImage ?? "", // already a Cloudinary URL here
            description: hero.description ?? "",
        };
    }

    if (services !== undefined) {
        doc.services = {
            heading: services.heading ?? "",
            subheading: services.subheading ?? "",
            items: (services.items ?? []).map(
                ({ icon, title, description, link }) => ({
                    icon: icon ?? "",
                    title: title ?? "",
                    description: description ?? "",
                    link: link ?? "",
                }),
            ),
        };
    }

    if (whyus !== undefined) {
        doc.whyus = {
            heading: whyus.heading ?? "",
            subtext: whyus.subtext ?? "",
            mainContent: whyus.mainContent ?? "",
            reasons: (whyus.reasons ?? []).map(({ title, body }) => ({
                title: title ?? "",
                body: body ?? "",
            })),
        };
    }

    if (coverage !== undefined) {
        doc.coverage = {
            heading: coverage.heading ?? "",
            subtext: coverage.subtext ?? "",
            callout: coverage.callout ?? "",
            regions: (coverage.regions ?? []).map(({ name, cities }) => ({
                name: name ?? "",
                cities: Array.isArray(cities) ? cities : [],
            })),
        };
    }

    if (testimonials !== undefined) {
        doc.testimonials = {
            // normalise rating type; photos are already Cloudinary URLs
            items: normaliseTestimonials(testimonials.items ?? []),
        };
    }

    if (faq !== undefined) {
        doc.faq = {
            tag: faq.tag ?? "",
            heading: faq.heading ?? "",
            subtext: faq.subtext ?? "",
            items: normaliseFaqItems(faq.items ?? []),
        };
    }

    return doc;
};

// ─── CONTROLLERS ─────────────────────────────────────────────────────────────

// ── CREATE ────────────────────────────────────────────────────────────────────
// POST /api/charter-bus
export const createPage = async (req, res) => {
    try {
        const slug = req.body.slug?.trim();
        const processed = await processAllImages(req.body, slug);
        const doc = buildDoc(processed);

        const page = new CharterBusPage(doc);
        const saved = await page.save();

        return res.status(201).json({ success: true, data: saved });
    } catch (err) {
        if (err.name === "ValidationError")
            return res
                .status(400)
                .json({ success: false, message: err.message });
        if (err.code === 11000)
            return res
                .status(409)
                .json({
                    success: false,
                    message: "A page with this slug already exists.",
                });
        console.error("[createPage]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── GET ALL ───────────────────────────────────────────────────────────────────
// GET /api/charter-bus
export const getAllPages = async (req, res) => {
    try {
        // Lightweight list — omit heavy HTML / image fields
        const pages = await CharterBusPage.find(
            {},
            "slug country city main.title_line1 hero.heroImage seo.meta_title createdAt updatedAt",
        ).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: pages });
    } catch (err) {
        console.error("[getAllPages]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── GET ONE BY ID ─────────────────────────────────────────────────────────────
// GET /api/charter-bus/:id
export const getPageById = async (req, res) => {
    try {
        const page = await CharterBusPage.findById(req.params.id);
        if (!page)
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        console.error("[getPageById]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── GET BY SLUG ───────────────────────────────────────────────────────────────
// GET /api/charter-bus/slug/:slug
export const getPageBySlug = async (req, res) => {
    try {
        const page = await CharterBusPage.findOne({ slug: req.params.slug });
        if (!page)
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        console.error("[getPageBySlug]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── UPDATE (full replace) ─────────────────────────────────────────────────────
// PUT /api/charter-bus/:id
export const updatePage = async (req, res) => {
    try {
        const slug = req.body.slug?.trim();
        const processed = await processAllImages(req.body, slug);
        const doc = buildDoc(processed);

        const page = await CharterBusPage.findByIdAndUpdate(
            req.params.id,
            { $set: doc },
            { new: true, runValidators: true },
        );
        if (!page)
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        if (err.name === "ValidationError")
            return res
                .status(400)
                .json({ success: false, message: err.message });
        if (err.code === 11000)
            return res
                .status(409)
                .json({
                    success: false,
                    message: "A page with this slug already exists.",
                });
        console.error("[updatePage]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── PATCH (single-section update from wizard step) ────────────────────────────
// PATCH /api/charter-bus/:id
export const patchPage = async (req, res) => {
    try {
        // Fetch existing slug so Cloudinary public_ids stay stable
        const existing = await CharterBusPage.findById(req.params.id).select(
            "slug",
        );
        const slug = req.body.slug?.trim() ?? existing?.slug;
        const processed = await processAllImages(req.body, slug);
        const doc = buildDoc(processed);

        const page = await CharterBusPage.findByIdAndUpdate(
            req.params.id,
            { $set: doc },
            { new: true, runValidators: true },
        );
        if (!page)
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });
        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        if (err.name === "ValidationError")
            return res
                .status(400)
                .json({ success: false, message: err.message });
        if (err.code === 11000)
            return res
                .status(409)
                .json({
                    success: false,
                    message: "A page with this slug already exists.",
                });
        console.error("[patchPage]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
// DELETE /api/charter-bus/:id
// Mirrors CloudinaryController.deleteFile — uses cloudinary.uploader.destroy()
export const deletePage = async (req, res) => {
    try {
        const page = await CharterBusPage.findByIdAndDelete(req.params.id);
        if (!page)
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });

        // Fire-and-forget cleanup — same destroy call as CloudinaryController
        const assetUrls = [
            page.hero?.heroImage,
            page.seo?.og_image,
            ...(page.testimonials?.items ?? []).map((t) => t.photo),
        ].filter(Boolean);

        Promise.allSettled(assetUrls.map(deleteBySecureUrl)).catch(() => {});

        return res
            .status(200)
            .json({ success: true, message: "Page deleted successfully" });
    } catch (err) {
        console.error("[deletePage]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};
