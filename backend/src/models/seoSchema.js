import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const CharterBusPageSchema = new Schema(
    {
        // ── Basic Info ─────────────────────────────────────────────
        slug: { type: String, required: true, trim: true, unique: true },
        country: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },

        // ── Hero Section ───────────────────────────────────────────
        hero: {
            heading: { type: String, trim: true },
            subtext: { type: String, trim: true },
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

        // ── Guide Section ───────────────────────────────────────────
        guide: {
            heading: { type: String, trim: true },
            subtext: { type: String, trim: true },
            bodyHtml: { type: String },
            tripTypes: [
                {
                    title: { type: String, trim: true },
                    desc: { type: String, trim: true },
                    _id: false,
                },
            ],
        },

        // ── Coverage Section ───────────────────────────────────────
        coverage: {
            heading: { type: String, trim: true },
            subtext: { type: String, trim: true },
            callout: { type: String, default: "" },
            regions: [
                {
                    name: { type: String, trim: true },
                    cities: { type: [String], default: [] },
                    _id: false,
                },
            ],
        },

        // ── FAQ Section ─────────────────────────────────────────────
        faq: {
            tag: { type: String, trim: true },
            heading: { type: String, trim: true },
            subtext: { type: String, trim: true },
            items: [
                {
                    question: { type: String, trim: true },
                    answer: { type: String, trim: true },
                    _id: false,
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

const CharterBusPage = model("CharterBusPage", CharterBusPageSchema);

export default CharterBusPage;
