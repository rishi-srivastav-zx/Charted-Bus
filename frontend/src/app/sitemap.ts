import { MetadataRoute } from "next";
import { getAllPages } from "@/services/landingpage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.charterbus.com";

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/bookingform`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/BusPage`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
    ];

    try {
        const pages = await getAllPages({ status: "Published" });
        
        const dynamicPages: MetadataRoute.Sitemap = Array.isArray(pages) 
            ? pages.map((page: any) => {
                    const citySlug = page.slug?.split("/").pop() || "";
                    const countrySlug = page.slug?.split("/")[0] || "usa";
                    const cityName = citySlug.replace(/-/g, " ");
                    
                    return {
                        url: `${baseUrl}/bookingform/${countrySlug}/${citySlug}`,
                        lastModified: new Date(page.updatedAt || page.createdAt),
                        changeFrequency: "weekly" as const,
                        priority: page.isFeatured ? 0.9 : 0.7,
                        alternates: {
                            languages: {
                                "en-US": `${baseUrl}/bookingform/${countrySlug}/${citySlug}`,
                            },
                        },
                    };
                })
            : [];

        return [...staticPages, ...dynamicPages];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return staticPages;
    }
}
