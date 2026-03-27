export const BUSINESS_CONFIG = {
    name: "Charter Bus",
    legalName: "Charter Bus LLC",
    tagline: "Reliable Group Transportation",
    description:
        "Book affordable charter buses for corporate events, weddings, and airport transfers. Safe, reliable & nationwide service.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.charterbus.com",
    logo: "/logo.png",
    telephone: "+1-800-555-0199",
    email: "bookings@charterbus.com",
    address: {
        street: "123 Main Street",
        city: "Chicago",
        region: "IL",
        postalCode: "60601",
        country: "US",
    },
    geo: {
        latitude: "41.8781",
        longitude: "-87.6298",
    },
    hours: ["Mo-Fr 06:00-22:00", "Sa-Su 08:00-20:00"],
    priceRange: "$$",
    sameAs: [
        "https://facebook.com/charterbus",
        "https://instagram.com/charterbus",
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
