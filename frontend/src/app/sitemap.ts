import { MetadataRoute } from "next";
import { getAllPages } from "@/services/landingpage";
import { BUSINESS_CONFIG } from "./lib/seo-cofig";

type ChangeFrequency =
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";

interface SitemapEntry {
    url: string;
    lastModified: Date;
    changeFrequency: ChangeFrequency;
    priority: number;
    alternates?: {
        languages: Record<string, string>;
    };
}

/**
 * Enterprise-Grade Sitemap Generator
 *
 * Google Best Practices Implemented:
 * - lastmod: REQUIRED - Google uses this for crawl scheduling
 * - priority: HINT only - 0.0 to 1.0 relative importance
 * - changefreq: HINT only - realistic update patterns
 * - URL limit: Max 50,000 URLs per sitemap file
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || BUSINESS_CONFIG.url;

    // Remove trailing slash for consistency
    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

    // ==========================================
    // 1. CORE BUSINESS PAGES (Highest Priority)
    // ==========================================
    const corePages: SitemapEntry[] = [
        {
            url: normalizedBaseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            // Note: Actual route is /BusPage
            url: `${normalizedBaseUrl}/BusPage`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            // Note: Actual route is /bookingform
            url: `${normalizedBaseUrl}/bookingform`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.95,
        },
    ];

    // ==========================================
    // 2. LOCATION LANDING PAGES (Dynamic)
    // ==========================================
    let locationPages: SitemapEntry[] = [];

    try {
        const pages = await getAllPages({ status: "Published" });

        if (Array.isArray(pages) && pages.length > 0) {
            locationPages = pages
                .map((page: any) => {
                    const slugParts = page.slug?.split("/") || [];
                    const citySlug = slugParts.pop() || "";
                    const countrySlug = slugParts[0] || "usa";

                    if (!citySlug) return null;

                    const isMajorCity = [
                        "new-york",
                        "los-angeles",
                        "chicago",
                        "miami",
                    ].includes(citySlug.toLowerCase());
                    
                    const priority = page.isFeatured
                        ? 0.85
                        : isMajorCity
                          ? 0.8
                          : 0.6;

                    const lastUpdate = new Date(
                        page.updatedAt || page.createdAt || Date.now(),
                    );
                    const daysSinceUpdate = Math.floor(
                        (Date.now() - lastUpdate.getTime()) /
                            (1000 * 60 * 60 * 24),
                    );

                    let changeFrequency: ChangeFrequency = "monthly";
                    if (page.isFeatured || daysSinceUpdate < 7) changeFrequency = "weekly";

                    // Note: Dynamic routes live under /bookingform/[country]/[city]
                    const pageUrl = `${normalizedBaseUrl}/bookingform/${countrySlug}/${citySlug}`;

                    return {
                        url: pageUrl,
                        lastModified: lastUpdate,
                        changeFrequency,
                        priority,
                        alternates: {
                            languages: {
                                "en-US": pageUrl,
                                "x-default": pageUrl,
                            },
                        },
                    };
                })
                .filter(Boolean) as SitemapEntry[];
        }
    } catch (error) {
        console.error("Failed to fetch dynamic pages for sitemap:", error);
    }

    // ==========================================
    // 3. AUTH & UTILITY PAGES
    // ==========================================
    const utilityPages: SitemapEntry[] = [
        {
            url: `${normalizedBaseUrl}/login`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "yearly",
            priority: 0.1,
        },
    ];

    // ==========================================
    // ASSEMBLE & OPTIMIZE
    // ==========================================
    const allEntries = [
        ...corePages,
        ...locationPages,
        ...utilityPages,
    ];

    // Sort by priority descending
    const sortedEntries = allEntries.sort((a, b) => b.priority - a.priority);

    // Limit to 50,000 URLs
    return sortedEntries.slice(0, 50000);
}

// ==========================================
// OPTIONAL: Sitemap Index for Large Sites
// ==========================================
// If you exceed 50,000 URLs, create app/sitemap-index.ts:
/*
import { MetadataRoute } from "next";

export default function sitemapIndex(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yoursite.com/sitemap.xml", // Core pages
      lastModified: new Date(),
    },
    {
      url: "https://yoursite.com/sitemap-locations.xml", // Dynamic locations
      lastModified: new Date(),
    },
  ];
}
*/
