import { cloudinary, getDateFolder } from "../config/cloudnary.js";
import CharterBusPage from "../models/seoSchema.js";


const isBase64 = (str) => typeof str === "string" && str.startsWith("data:");


const uploadBase64Image = async (value, folder, publicId) => {
    if (!value) return "";
    if (!isBase64(value)) return value; 

    const result = await cloudinary.uploader.upload(value, {
        folder: `${folder}/${getDateFolder()}`,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
    });

    return result.secure_url;
};


const deleteBySecureUrl = async (secureUrl) => {
    if (!secureUrl || isBase64(secureUrl)) return;
    try {
        const afterUpload = secureUrl.split("/upload/")[1]; 
        const withoutVersion = afterUpload.replace(/^v\d+\//, ""); 
        const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); 

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


const processAllImages = async (body, slug) => {
    const [hero, testimonials, seo] = await Promise.all([
        processHeroImages(body.hero, slug),
        processTestimonialImages(body.testimonials, slug),
        processSeoImages(body.seo, slug),
    ]);
    return { ...body, hero, testimonials, seo };
};


const normaliseFaqItems = (items = []) =>
    items.map(({ q, a, question, answer }) => ({
        question: question ?? q ?? "",
        answer: answer ?? a ?? "",
    }));


const normaliseTestimonials = (items = []) =>
    items.map(({ rating, ...rest }) => ({
        ...rest,
        rating: Number(rating) || 5,
    }));


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
            og_image: seo.og_image ?? "", 
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
            heroImage: hero.heroImage ?? "", 
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


export const createPage = async (req, res) => {
    try {
        const slug = req.body.slug?.trim();
        const processed = await processAllImages(req.body, slug);
        const doc = buildDoc(processed);
        
        doc.status = "Draft";

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


export const getAllPages = async (req, res) => {
    try {
        const pages = await CharterBusPage.find(
            {},
            "slug country city main.title_line1 hero.heroImage seo.meta_title status createdAt updatedAt",
        ).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: pages });
    } catch (err) {
        console.error("[getAllPages]", err);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};


export const publishPage = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;

        const page = await CharterBusPage.findByIdAndUpdate(
            id,
            { $set: { status: isPublished ? "Published" : "Draft" } },
            { new: true, runValidators: true },
        );

        if (!page) {
            return res.status(404).json({ success: false, message: "Page not found" });
        }

        return res.status(200).json({ success: true, data: page });
    } catch (err) {
        console.error("[publishPage]", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


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


export const getPageBySlug = async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug parameter is required",
            });
        }
        const page = await CharterBusPage.findOne({ slug, status: "Published" });
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

// Admin only - preview any page including drafts
export const previewPageBySlug = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only.",
            });
        }

        const slug = req.query.slug;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug parameter is required",
            });
        }

        const page = await CharterBusPage.findOne({ slug });

        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: page,
            isPreview: true,
        });
    } catch (err) {
        console.error("[previewPageBySlug]", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


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


export const patchPage = async (req, res) => {
    try {
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


export const deletePage = async (req, res) => {
    try {
        const page = await CharterBusPage.findByIdAndDelete(req.params.id);
        if (!page)
            return res
                .status(404)
                .json({ success: false, message: "Page not found" });

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
