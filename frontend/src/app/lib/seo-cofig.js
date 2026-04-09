export const BUSINESS_CONFIG = {
    name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "CharterBus",
    legalName: process.env.NEXT_PUBLIC_BUSINESS_LEGAL_NAME || "CharterBus LLC",
    tagline: process.env.NEXT_PUBLIC_BUSINESS_TAGLINE || "Reliable Group Transportation",
    description:
        process.env.NEXT_PUBLIC_BUSINESS_DESCRIPTION || "Book affordable charter buses for corporate events, weddings, and airport transfers. Safe, reliable & nationwide service.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.charterbus.com",
    logo: process.env.NEXT_PUBLIC_LOGO_URL || "/logo.png",
    telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1-800-555-0199",
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "support@charterbus.com",
    address: {
        street: process.env.NEXT_PUBLIC_BUSINESS_STREET || "123 Main Street",
        city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Chicago",
        region: process.env.NEXT_PUBLIC_BUSINESS_REGION || "IL",
        postalCode: process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE || "60601",
        country: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "US",
    },
    geo: {
        latitude: process.env.NEXT_PUBLIC_GEO_LATITUDE || "41.8781",
        longitude: process.env.NEXT_PUBLIC_GEO_LONGITUDE || "-87.6298",
    },
    hours: ["Mo-Fr 06:00-22:00", "Sa-Su 08:00-20:00"],
    priceRange: process.env.NEXT_PUBLIC_PRICE_RANGE || "$$",
    sameAs: [
        process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/charterbus",
        process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/charterbus",
    ],
};


export const baseMetadata = {
    metadataBase: new URL(BUSINESS_CONFIG.url),

    title: {
        default: `${BUSINESS_CONFIG.name} Rental | Group Transportation Services`,
        template: `%s | ${BUSINESS_CONFIG.name}`,
    },

    description: BUSINESS_CONFIG.description,

    keywords: [
        "charter bus rental",
        "group transportation",
        "corporate shuttle",
        "wedding transportation",
        "airport transfer bus",
        "motorcoach rental",
        "bus hire",
        "group travel",
    ],

    authors: [{ name: BUSINESS_CONFIG.legalName }],
    creator: BUSINESS_CONFIG.legalName,
    publisher: BUSINESS_CONFIG.legalName,

    alternates: {
        canonical: "/",
    },

    openGraph: {
        type: "website",
        locale: "en_US",
        url: BUSINESS_CONFIG.url,
        siteName: BUSINESS_CONFIG.name,
        title: `${BUSINESS_CONFIG.name} Rental Services`,
        description: BUSINESS_CONFIG.description,
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: `${BUSINESS_CONFIG.name} - Luxury Fleet`,
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `${BUSINESS_CONFIG.name} Rental`,
        description: "Affordable group transportation across the US.",
        images: ["/og-image.jpg"],
        creator: "@charterbus",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },

    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export function createMetadata(pageMetadata = {}) {
    return {
        ...baseMetadata,
        ...pageMetadata,
       
        openGraph: {
            ...baseMetadata.openGraph,
            ...pageMetadata.openGraph,
        },
        twitter: {
            ...baseMetadata.twitter,
            ...pageMetadata.twitter,
        },
        robots: {
            ...baseMetadata.robots,
            ...pageMetadata.robots,
        },
    };
}
