import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationProvider } from "@/components/navigation-provider";
import { Toaster } from "react-hot-toast";
import { BUSINESS_CONFIG, baseMetadata } from "@/app/lib/seo-cofig";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export const metadata = baseMetadata;


function generateStructuredData() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "@id": `${BUSINESS_CONFIG.url}/#business`,
                name: BUSINESS_CONFIG.name,
                description: BUSINESS_CONFIG.description,
                url: BUSINESS_CONFIG.url,
                telephone: BUSINESS_CONFIG.telephone,
                email: BUSINESS_CONFIG.email,
                priceRange: BUSINESS_CONFIG.priceRange,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: BUSINESS_CONFIG.address.street,
                    addressLocality: BUSINESS_CONFIG.address.city,
                    addressRegion: BUSINESS_CONFIG.address.region,
                    postalCode: BUSINESS_CONFIG.address.postalCode,
                    addressCountry: BUSINESS_CONFIG.address.country,
                },
                geo: {
                    "@type": "GeoCoordinates",
                    latitude: BUSINESS_CONFIG.geo.latitude,
                    longitude: BUSINESS_CONFIG.geo.longitude,
                },
                openingHours: BUSINESS_CONFIG.hours,
                sameAs: BUSINESS_CONFIG.sameAs,
            },
            {
                "@type": "Organization",
                "@id": `${BUSINESS_CONFIG.url}/#organization`,
                name: BUSINESS_CONFIG.name,
                url: BUSINESS_CONFIG.url,
                logo: `${BUSINESS_CONFIG.url}${BUSINESS_CONFIG.logo}`,
                sameAs: BUSINESS_CONFIG.sameAs,
            },
            {
                "@type": "WebSite",
                "@id": `${BUSINESS_CONFIG.url}/#website`,
                url: BUSINESS_CONFIG.url,
                name: BUSINESS_CONFIG.name,
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${BUSINESS_CONFIG.url}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                },
            },
        ],
    };
}

export default function RootLayout({ children }) {
    const structuredData = generateStructuredData();

    return (
        <html lang="en">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
                <meta name="theme-color" content="#000000" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NavigationProvider>
                    <Toaster position="top-right" />
                    {children}
                </NavigationProvider>
            </body>
        </html>
    );
}
