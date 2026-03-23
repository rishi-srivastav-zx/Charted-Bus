import { cache } from "react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Header from "@/components/header";
import LuxCharterPage from "@/components/bookinginterfacecomponent/basicdetails";
import { getPageBySlug } from "@/services/landingpage";
import CharterBusLanding from "@/components/superadmindashboard/seoeditor/new";

noStore();

// Cache the fetch to avoid duplicate requests

const getCharterPage = cache(async (country, city) => {
    const normalize = (str) =>
        decodeURIComponent(str) // ← decode %20 to space FIRST
            .toLowerCase()
            .replace(/[\s-]+/g, "-") // then replace spaces with dashes
            .replace(/[^a-z0-9-]/g, "");
    const normalizedCountry = normalize(country);
    const normalizedCity = normalize(city);
    const slug = `${normalizedCountry}/${normalizedCity}`;

    try {
        const pageData = await getPageBySlug(slug);
        return pageData;
    } catch (error) {
        console.error("API error   →", error.message);
        return null;
    }
});

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { country, city } = await params;
    const pageData = await getCharterPage(country, city);

    if (!pageData) {
        return {
            title: "Page Not Found",
            description: "The requested charter bus page could not be found.",
        };
    }

    return {
        title: pageData.seo?.meta_title || `${city} Charter Bus Services`,
        description:
            pageData.seo?.meta_description ||
            `Premium charter bus services in ${city}, ${country}`,
        keywords: pageData.seo?.focus_keyword ? [pageData.seo.focus_keyword] : [
            "charter bus",
            city,
            country,
            "transportation",
        ],
        openGraph: {
            title: pageData.seo?.og_title || pageData.seo?.meta_title,
            description:
                pageData.seo?.og_description || pageData.seo?.meta_description,
            images: pageData.seo?.og_image ? [pageData.seo.og_image] : [],
            url: `/${country}/${city}`,
        },
        twitter: {
            card: "summary_large_image",
            title: pageData.seo?.og_title || pageData.seo?.meta_title,
            description:
                pageData.seo?.og_description || pageData.seo?.meta_description,
            images: pageData.seo?.og_image
                ? [pageData.seo.og_image]
                : [],
        },
        alternates: {
            canonical: `/${country}/${city}`,
        },
    };
}

// Pre-generate popular routes at build time - disabled for now
export function generateStaticParams() {
    return [];
}

// Main Page Component
export default async function CityCharterPage({ params }) {
    const { country, city } = await params;
    const pageData = await getCharterPage(country, city);
    if (!pageData) {
        notFound();
    }

    const safePageData = pageData || {};

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <LuxCharterPage
                        initialData={safePageData}
                        country={country}
                        city={city}
                    />
                </div>
            </main>
            <CharterBusLanding data={safePageData} />
        </>
    );
}
