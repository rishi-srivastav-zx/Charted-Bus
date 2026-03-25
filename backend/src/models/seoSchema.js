import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const CharterBusPageSchema = new Schema(
    {
        // ── Basic Info ─────────────────────────────────────────────
        slug: { type: String, required: true, trim: true, unique: true },
        country: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        status: { 
            type: String, 
            enum: ["Draft", "Published"], 
            default: "Draft" 
        },

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
        // ── Hero Section  
        // ══════════════════════════════════════════════════════════════
        hero: {
            heading: { type: String, default: "", trim: true }, 
            subtext: { type: String, default: "", trim: true }, 
            heroImage: { type: String, default: "", trim: true }, 
            description: { type: String, default: "" }, 
        },

        // ══════════════════════════════════════════════════════════════
        // ── Services Section  
        // ══════════════════════════════════════════════════════════════
        services: {
            heading: { type: String, default: "", trim: true },
            subheading: { type: String, default: "", trim: true },
            items: [
                {
                    icon: { type: String, default: "", trim: true }, 
                    title: { type: String, default: "", trim: true },
                    description: { type: String, default: "", trim: true },
                    link: { type: String, default: "", trim: true }, 
                    _id: false,
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // ── Why Choose Us Section  
        // ══════════════════════════════════════════════════════════════
        whyus: {
            heading: { type: String, default: "", trim: true }, 
            subtext: { type: String, default: "", trim: true }, 
            mainContent: { type: String, default: "" }, 
            reasons: [
                {
                    title: { type: String, default: "", trim: true }, 
                    body: { type: String, default: "", trim: true }, 
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
        // ── Testimonials Section  
        // ══════════════════════════════════════════════════════════════
        testimonials: {
            items: [
                {
                    name: { type: String, default: "", trim: true },
                    role: { type: String, default: "", trim: true }, 
                    text: { type: String, default: "", trim: true }, 
                    rating: { type: Number, default: 5, min: 1, max: 5 },
                    photo: { type: String, default: "", trim: true }, 
                    _id: false,
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // ── FAQ Section  
        // ══════════════════════════════════════════════════════════════
        faq: {
            tag: { type: String, default: "", trim: true }, 
            heading: { type: String, default: "", trim: true }, 
            subtext: { type: String, default: "", trim: true }, 
            items: [
                {
                    question: { type: String, default: "", trim: true }, 
                    answer: { type: String, default: "", trim: true }, 
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
