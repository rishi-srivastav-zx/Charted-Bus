import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const CharterBusPageSchema = new Schema(
    {
        // ── Basic Info ─────────────────────────────────────────────
        slug: { type: String, required: true, trim: true, unique: true },
        country: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },

        // ── Hero Section ───────────────────────────────────────────
        main: {
            title_line1: { type: String, trim: true },
            description: { type: String, trim: true },
        },

        // ── SEO Section ─────────────────────────────────────────────
        seo: {
            meta_title: { type: String, trim: true },
            meta_description: { type: String, trim: true },
            focus_keyword: { type: String, default: "", trim: true },
            canonical_url: { type: String, default: "", trim: true },
            og_title: { type: String, default: "", trim: true },
            og_description: { type: String, default: "", trim: true },
            og_image: { type: String, default: "", trim: true },
        },

        // ══════════════════════════════════════════════════════════════
        // ── Hero Section  (extended from editor)
        // ══════════════════════════════════════════════════════════════
        hero: {
            heading: { type: String, default: "", trim: true }, // was: heading
            subtext: { type: String, default: "", trim: true }, // was: subtext (kept for backward compat)
            heroImage: { type: String, default: "", trim: true }, // NEW — banner image URL or base64
            description: { type: String, default: "" }, // NEW — rich HTML description
        },

        // ══════════════════════════════════════════════════════════════
        // ── Services Section  (NEW — from editor)
        // ══════════════════════════════════════════════════════════════
        services: {
            heading: { type: String, default: "", trim: true },
            subheading: { type: String, default: "", trim: true },
            items: [
                {
                    icon: { type: String, default: "", trim: true }, // emoji character
                    title: { type: String, default: "", trim: true },
                    description: { type: String, default: "", trim: true },
                    link: { type: String, default: "", trim: true }, // optional CTA URL
                    _id: false,
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // ── Why Choose Us Section  (merged: old "guide" + editor "whyus")
        // ══════════════════════════════════════════════════════════════
        whyus: {
            heading: { type: String, default: "", trim: true }, // was: guide.heading
            subtext: { type: String, default: "", trim: true }, // was: guide.subtext  (kept for compat)
            mainContent: { type: String, default: "" }, // rich HTML — was: guide.bodyHtml
            reasons: [
                {
                    title: { type: String, default: "", trim: true }, // was: guide.tripTypes[].title
                    body: { type: String, default: "", trim: true }, // was: guide.tripTypes[].desc
                    _id: false,
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // ── Coverage Section  (unchanged)
        // ══════════════════════════════════════════════════════════════
        coverage: {
            heading: { type: String, default: "", trim: true },
            subtext: { type: String, default: "", trim: true },
            callout: { type: String, default: "" },
            regions: [
                {
                    name: { type: String, default: "", trim: true },
                    cities: { type: [String], default: [] },
                    _id: false,
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // ── Testimonials Section  (NEW — from editor)
        // ══════════════════════════════════════════════════════════════
        testimonials: {
            items: [
                {
                    name: { type: String, default: "", trim: true },
                    role: { type: String, default: "", trim: true }, // job title / company
                    text: { type: String, default: "", trim: true }, // review body
                    rating: { type: Number, default: 5, min: 1, max: 5 },
                    photo: { type: String, default: "", trim: true }, // image URL or base64
                    _id: false,
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // ── FAQ Section  (extended from editor)
        // ══════════════════════════════════════════════════════════════
        faq: {
            tag: { type: String, default: "", trim: true }, // was: faq.tag (unchanged)
            heading: { type: String, default: "", trim: true }, // was: faq.heading (unchanged)
            subtext: { type: String, default: "", trim: true }, // was: faq.subtext (unchanged)
            items: [
                {
                    question: { type: String, default: "", trim: true }, // was: question  |  editor uses "q"
                    answer: { type: String, default: "", trim: true }, // was: answer    |  editor uses "a"
                    _id: false,
                },
            ],
        },
    },
    {
        timestamps: true,
    },
);

const CharterBusPage = model("CharterBusPage", CharterBusPageSchema);

export default CharterBusPage;
