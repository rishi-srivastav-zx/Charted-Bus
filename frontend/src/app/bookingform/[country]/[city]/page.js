import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Header from "@/components/header";
import LuxCharterPage from "@/components/bookinginterfacecomponent/basicdetails";
import { getPageBySlug, previewPageBySlug } from "@/services/landingpage";
import CharterBusLanding from "@/components/superadmindashboard/seoeditor/seoContentpage";
import { cookies } from "next/headers";

const getCharterPage = async (country, city) => {
    const normalize = (str) =>
        decodeURIComponent(str)
            .toLowerCase()
            .replace(/[\s-]+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

    const slug = `${normalize(country)}/${normalize(city)}`;

    // CHECK ALL POSSIBLE COOKIE NAMES
    const cookieStore = await cookies();

    const accessToken =
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value ||
        cookieStore.get("authToken")?.value ||
        cookieStore.get("jwt")?.value ||
        cookieStore.get("next-auth.session-token")?.value; // if using NextAuth

    console.log(
        "🍪 Cookie names found:",
        cookieStore.getAll().map((c) => c.name),
    );
    console.log("🔑 Token found:", accessToken ? "YES" : "NO");

    // // Check if user is admin
    // const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;

    // Try preview API if admin (returns any page including drafts)
    if (accessToken) {
        try {
            noStore(); // Never cache preview requests
            const previewPage = await previewPageBySlug(slug, accessToken);
            if (previewPage) {
                return { page: previewPage, isPreview: true, isAdmin: true };
            }
        } catch (error) {
            // 403 = not admin, 404 = page doesn't exist as draft
            if (error.response?.status === 403) {
                console.log("Token invalid or not admin, trying public API...");
            } else if (error.response?.status !== 404) {
                console.error("Preview API error:", error.message);
            }
        }
    }

    // Fall back to public API (only published pages)
    try {
        const page = await getPageBySlug(slug);
        return { page, isPreview: false, isAdmin: false };
    } catch (error) {
        console.error("Public API error:", error.message);
        return { page: null, isPreview: false, isAdmin: false };
    }
};;

// SEO metadata
export async function generateMetadata({ params }) {
    const { country, city } = await params;
    const { page, isPreview } = await getCharterPage(country, city);

    if (!page) {
        return {
            title: "Page Not Found",
            description: "The requested charter bus page could not be found.",
        };
    }

    // Draft preview - noindex
    if (isPreview && page.status !== "Published") {
        return {
            title: `🔍 Preview: ${page.main?.title_line1 || city}`,
            description:
                "This is a draft preview visible only to administrators.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    // Published page
    return {
        title: page.seo?.meta_title || `${city} Charter Bus Services`,
        description:
            page.seo?.meta_description ||
            `Premium charter bus services in ${city}, ${country}`,
        keywords: page.seo?.focus_keyword
            ? [page.seo.focus_keyword]
            : ["charter bus", city, country],
        openGraph: {
            title: page.seo?.og_title || page.seo?.meta_title,
            description: page.seo?.og_description || page.seo?.meta_description,
            images: page.seo?.og_image ? [{ url: page.seo.og_image }] : [],
        },
    };
}

// Main Page
export default async function CityCharterPage({ params }) {
    const { country, city } = await params;

    const {
        page: pageData,
        isPreview,
        isAdmin,
    } = await getCharterPage(country, city);

    if (!pageData) {
        notFound();
    }

    return (
        <>
            <Header />

            {/* Preview Banner for drafts */}
            {isPreview && pageData.status !== "Published" && (
                <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium sticky top-0 z-50">
                    🔍 Admin Preview Mode — This page is in {pageData.status}{" "}
                    status
                    {isAdmin && " • You can edit and publish from dashboard"}
                </div>
            )}

            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <LuxCharterPage
                        initialData={pageData}
                        country={country}
                        city={city}
                        isPreview={isPreview} // Pass preview state if needed
                    />
                </div>
            </main>

            <CharterBusLanding data={pageData} isPreview={isPreview} />
        </>
    );
}
