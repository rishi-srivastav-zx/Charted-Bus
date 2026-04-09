import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.charterbus.com";
    
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/dashboard/",
                "/admin/",
                "/preview/",
                "/bookingform/*/edit",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
