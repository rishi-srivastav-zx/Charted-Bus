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
 * - lastmod: REQUIRED - Google uses this for crawl scheduling [^2^][^3^]
 * - priority: HINT only - 0.0 to 1.0 relative importance [^1^][^4^]
 * - changefreq: HINT only - realistic update patterns [^3^][^5^]
 * - URL limit: Max 50,000 URLs per sitemap file
 * - Size limit: Max 50MB uncompressed
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
            url: `${normalizedBaseUrl}/fleet`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${normalizedBaseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${normalizedBaseUrl}/booking`,
            lastModified: new Date(),
            changeFrequency: "daily", // High conversion page, check daily
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
                    // Parse slug: "usa/new-york" or "new-york"
                    const slugParts = page.slug?.split("/") || [];
                    const citySlug = slugParts.pop() || "";
                    const countrySlug = slugParts[0] || "usa";

                    // Validate we have a city slug
                    if (!citySlug) {
                        console.warn(`Invalid page slug: ${page.slug}`);
                        return null;
                    }

                    // Determine priority based on business rules
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

                    // Determine change frequency based on update patterns
                    const lastUpdate = new Date(
                        page.updatedAt || page.createdAt || Date.now(),
                    );
                    const daysSinceUpdate = Math.floor(
                        (Date.now() - lastUpdate.getTime()) /
                            (1000 * 60 * 60 * 24),
                    );

                    let changeFrequency: ChangeFrequency = "monthly";
                    if (page.isFeatured) changeFrequency = "weekly";
                    else if (daysSinceUpdate < 7) changeFrequency = "weekly";
                    else if (daysSinceUpdate < 30) changeFrequency = "monthly";

                    return {
                        url: `${normalizedBaseUrl}/${countrySlug}/${citySlug}`,
                        lastModified: lastUpdate,
                        changeFrequency,
                        priority,
                        alternates: {
                            languages: {
                                "en-US": `${normalizedBaseUrl}/${countrySlug}/${citySlug}`,
                                "x-default": `${normalizedBaseUrl}/${countrySlug}/${citySlug}`,
                            },
                        },
                    };
                })
                .filter(Boolean) as SitemapEntry[];
        }
    } catch (error) {
        console.error("Failed to fetch dynamic pages for sitemap:", error);
        // Continue with static pages only - don't fail the build
    }

    // ==========================================
    // 3. UTILITY PAGES (Lower Priority)
    // ==========================================
    const utilityPages: SitemapEntry[] = [
        {
            url: `${normalizedBaseUrl}/about`,
            lastModified: new Date("2024-01-01"), // Static page, rarely changes
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${normalizedBaseUrl}/contact`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${normalizedBaseUrl}/privacy`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${normalizedBaseUrl}/terms`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${normalizedBaseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.4,
        },
    ];

    // ==========================================
    // 4. AUTH PAGES (Lowest Priority - Indexable but not emphasized)
    // ==========================================
    const authPages: SitemapEntry[] = [
        {
            url: `${normalizedBaseUrl}/login`,
            lastModified: new Date("2024-01-01"),
            changeFrequency: "yearly",
            priority: 0.1,
        },
        {
            url: `${normalizedBaseUrl}/register`,
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
        ...authPages,
    ];

    // Sort by priority descending (hints importance to crawlers)
    const sortedEntries = allEntries.sort((a, b) => b.priority - a.priority);

    // Validate: Ensure we don't exceed 50,000 URLs
    if (sortedEntries.length > 50000) {
        console.warn(
            `Sitemap exceeds 50,000 URLs (${sortedEntries.length}). Consider splitting into sitemap index.`,
        );
        // Return top 50,000 by priority
        return sortedEntries.slice(0, 50000);
    }

    return sortedEntries;
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
