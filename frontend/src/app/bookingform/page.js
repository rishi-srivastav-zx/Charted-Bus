"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import LuxCharterPage from "@/components/bookinginterfacecomponent/basicdetails";

// Dynamic imports for SEO components
const AffordableLuxury = dynamic(
    () => import("@/components/seoComponent/AffordableLuxury"),
    {
        loading: () => <ComponentSkeleton title="Luxury Options" />,
        ssr: false,
    },
);

const CharterBusGuide = dynamic(
    () => import("@/components/seoComponent/CharterBusGuide"),
    {
        loading: () => <ComponentSkeleton title="Charter Guide" />,
        ssr: false,
    },
);

const IndustriesWeServe = dynamic(
    () => import("@/components/seoComponent/IndustriesWeServe"),
    {
        loading: () => <ComponentSkeleton title="Industries" />,
        ssr: false,
    },
);

const NationwideCoverage = dynamic(
    () => import("@/components/seoComponent/NationwideCoverage"),
    {
        loading: () => <ComponentSkeleton title="Coverage Info" />,
        ssr: false,
    },
);

const WhyChooseUs = dynamic(
    () => import("@/components/seoComponent/WhyChooseUs"),
    {
        loading: () => <ComponentSkeleton title="Why Choose Us" />,
        ssr: false,
    },
);

// Loading skeleton component
const ComponentSkeleton = ({ title }) => (
    <div className="animate-pulse bg-gray-100 rounded-lg p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        <div className="text-xs text-gray-400 mt-2">Loading {title}...</div>
    </div>
);

// Strictly supported countries only
const SUPPORTED_COUNTRIES = ["US", "CA", "GB", "AU"];

const countryConfig = {
    US: {
        name: "United States",
        flag: "🇺🇸",
        components: ["AffordableLuxury", "NationwideCoverage", "WhyChooseUs"],
        currency: "USD",
        phoneFormat: "(555) 123-4567",
        message:
            "Welcome! We offer full charter services across all 50 states.",
    },
    CA: {
        name: "Canada",
        flag: "🇨🇦",
        components: [
            "AffordableLuxury",
            "CharterBusGuide",
            "NationwideCoverage",
        ],
        currency: "CAD",
        phoneFormat: "(555) 123-4567",
        message:
            "Welcome! We offer charter services from Vancouver to Halifax.",
    },
    GB: {
        name: "United Kingdom",
        flag: "🇬🇧",
        components: ["IndustriesWeServe", "WhyChooseUs", "CharterBusGuide"],
        currency: "GBP",
        phoneFormat: "020 7946 0958",
        message:
            "Welcome! We offer charter services across England, Scotland, and Wales.",
    },
    AU: {
        name: "Australia",
        flag: "🇦🇺",
        components: ["AffordableLuxury", "CharterBusGuide", "WhyChooseUs"],
        currency: "AUD",
        phoneFormat: "(02) 9123 4567",
        message:
            "Welcome! We offer charter services across all Australian states.",
    },
};

const componentMap = {
    AffordableLuxury: (props) => <AffordableLuxury {...props} />,
    CharterBusGuide: (props) => <CharterBusGuide {...props} />,
    IndustriesWeServe: (props) => <IndustriesWeServe {...props} />,
    NationwideCoverage: (props) => <NationwideCoverage {...props} />,
    WhyChooseUs: (props) => <WhyChooseUs {...props} />,
};

export default function BookingFormPage() {
    const [countryData, setCountryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);

    // Feature flags for testing
    const [ipDetectionEnabled, setIpDetectionEnabled] = useState(false); // Default OFF - enable when ready
    const [simulatedCountry, setSimulatedCountry] = useState(null); // For testing different countries
    const [showDevTools, setShowDevTools] = useState(true); // Show/hide testing panel

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Country detection logic
    useEffect(() => {
        if (!isClient) return;

        // If IP detection is disabled and no simulation, show default message
        if (!ipDetectionEnabled && !simulatedCountry) {
            setLoading(false);
            setCountryData(null);
            return;
        }

        // If simulating a country, use that
        if (simulatedCountry) {
            setCountryData({
                country_code: simulatedCountry,
                country_name: countryConfig[simulatedCountry].name,
                city: "Test City",
                region: "Test Region",
            });
            setLoading(false);
            return;
        }

        // Otherwise fetch real IP data
        const detectCountry = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch("https://ipapi.co/json/", {
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                });

                clearTimeout(timeoutId);

                if (!response.ok)
                    throw new Error("Location service unavailable");

                const data = await response.json();

                if (!data.country_code)
                    throw new Error("Invalid location data");

                const normalizedCode =
                    data.country_code === "UK" ? "GB" : data.country_code;

                // Check if country is supported
                if (!SUPPORTED_COUNTRIES.includes(normalizedCode)) {
                    setCountryData({
                        country_code: normalizedCode,
                        country_name: data.country_name,
                        city: data.city,
                        region: data.region,
                        isUnsupported: true,
                    });
                    setLoading(false);
                    return;
                }

                setCountryData({
                    country_code: normalizedCode,
                    country_name: data.country_name,
                    city: data.city,
                    region: data.region,
                    isUnsupported: false,
                });
            } catch (err) {
                console.error("Location detection failed:", err);
                setError(
                    "Location detection failed. Please select your country manually.",
                );
                setCountryData(null);
            } finally {
                setLoading(false);
            }
        };

        detectCountry();
    }, [isClient, ipDetectionEnabled, simulatedCountry]);

    // Determine effective configuration
    const currentConfig = useMemo(() => {
        if (!countryData || countryData.isUnsupported) return null;
        return countryConfig[countryData.country_code] || null;
    }, [countryData]);

    // Render SEO components
    const renderSEOComponents = useMemo(() => {
        if (!currentConfig) return null;

        return (
            <div className="space-y-8 animate-fadeIn">
                {currentConfig.components.map((componentName, index) => {
                    const Component = componentMap[componentName];
                    if (!Component) return null;

                    return (
                        <Suspense
                            key={`${componentName}-${countryData?.country_code}`}
                            fallback={
                                <ComponentSkeleton
                                    title={componentName
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                                />
                            }
                        >
                            <div className="transform transition-all duration-500 hover:scale-[1.01]">
                                <Component
                                    country={countryData?.country_code}
                                    currency={currentConfig.currency}
                                    phoneFormat={currentConfig.phoneFormat}
                                    region={countryData?.region}
                                    city={countryData?.city}
                                />
                            </div>
                        </Suspense>
                    );
                })}
            </div>
        );
    }, [currentConfig, countryData]);

    // Unsupported country message
    const renderUnsupportedMessage = () => (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Coming Soon to Your Region
            </h3>
            <p className="text-gray-700 mb-4 max-w-xl mx-auto">
                We currently operate in the{" "}
                <strong>
                    United States, Canada, United Kingdom, and Australia
                </strong>
                . We're working hard to bring our services to{" "}
                {countryData?.country_name || "your country"}.
            </p>
            <div className="bg-white rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-sm text-gray-600 mb-2">Detected location:</p>
                <p className="font-semibold text-gray-900">
                    {countryData?.country_name}
                    {countryData?.city && ` - ${countryData.city}`}
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
                {SUPPORTED_COUNTRIES.map((code) => (
                    <button
                        key={code}
                        onClick={() => setSimulatedCountry(code)}
                        className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2"
                    >
                        <span>{countryConfig[code].flag}</span>
                        <span>View {countryConfig[code].name}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    // Default state when IP is off and no simulation
    const renderDefaultState = () => (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Premium Charter Services
            </h3>
            <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                We offer luxury charter bus rentals in select countries. Enable
                location detection or select your country below to see localized
                content.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {SUPPORTED_COUNTRIES.map((code) => (
                    <button
                        key={code}
                        onClick={() => setSimulatedCountry(code)}
                        className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
                    >
                        <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                            {countryConfig[code].flag}
                        </span>
                        <span className="font-semibold text-gray-900 block text-sm">
                            {countryConfig[code].name}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 block">
                            View Content
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-lg mx-auto">
                <p className="text-sm text-yellow-800">
                    <strong>Developer Mode:</strong> IP detection is currently
                    disabled. Toggle it on in the dev tools panel below to test
                    auto-detection.
                </p>
            </div>
        </div>
    );

    if (!isClient) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <LuxCharterPage />
                        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-64 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-8xl mx-auto">
                    <LuxCharterPage />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Developer Testing Panel */}
                    {showDevTools && (
                        <div className="mt-6 bg-gray-900 text-white rounded-xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="bg-orange-500 text-xs px-2 py-1 rounded">
                                        DEV
                                    </span>
                                    Testing & Configuration Panel
                                </h3>
                                <button
                                    onClick={() => setShowDevTools(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕ Hide
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* IP Detection Toggle */}
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="font-medium">
                                            IP Auto-Detection
                                        </span>
                                        <div
                                            className={`w-14 h-7 rounded-full transition-colors ${ipDetectionEnabled ? "bg-green-500" : "bg-gray-600"} relative`}
                                        >
                                            <div
                                                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${ipDetectionEnabled ? "translate-x-7" : "translate-x-1"}`}
                                            ></div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={ipDetectionEnabled}
                                                onChange={(e) => {
                                                    setIpDetectionEnabled(
                                                        e.target.checked,
                                                    );
                                                    setSimulatedCountry(null); // Clear simulation when toggling
                                                    setLoading(true);
                                                }}
                                            />
                                        </div>
                                    </label>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {ipDetectionEnabled
                                            ? "ON: Will detect user location via IP"
                                            : "OFF: Manual country selection only"}
                                    </p>
                                </div>

                                {/* Country Simulator Dropdown */}
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Simulate Country
                                    </label>
                                    <select
                                        value={simulatedCountry || ""}
                                        onChange={(e) => {
                                            setSimulatedCountry(
                                                e.target.value || null,
                                            );
                                            setLoading(false);
                                        }}
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                                        disabled={
                                            ipDetectionEnabled &&
                                            !simulatedCountry
                                        }
                                    >
                                        <option value="">
                                            {ipDetectionEnabled
                                                ? "Using real IP..."
                                                : "Select country..."}
                                        </option>
                                        {SUPPORTED_COUNTRIES.map((code) => (
                                            <option key={code} value={code}>
                                                {countryConfig[code].flag}{" "}
                                                {countryConfig[code].name}
                                            </option>
                                        ))}
                                        <option value="FR">
                                            🇫🇷 France (Unsupported)
                                        </option>
                                        <option value="DE">
                                            🇩🇪 Germany (Unsupported)
                                        </option>
                                        <option value="JP">
                                            🇯🇵 Japan (Unsupported)
                                        </option>
                                    </select>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Test how content appears for different
                                        regions
                                    </p>
                                </div>

                                {/* Current Status */}
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">
                                        Current State
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">
                                                IP Detection:
                                            </span>
                                            <span
                                                className={
                                                    ipDetectionEnabled
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }
                                            >
                                                {ipDetectionEnabled
                                                    ? "Enabled"
                                                    : "Disabled"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">
                                                Mode:
                                            </span>
                                            <span className="text-blue-400">
                                                {simulatedCountry
                                                    ? "Simulated"
                                                    : ipDetectionEnabled
                                                      ? "Auto-detect"
                                                      : "Default"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">
                                                Country:
                                            </span>
                                            <span className="text-white">
                                                {countryData
                                                    ? `${countryConfig[countryData.country_code]?.flag || "🌍"} ${countryData.country_code}`
                                                    : "None"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">
                                                Status:
                                            </span>
                                            <span
                                                className={
                                                    currentConfig
                                                        ? "text-green-400"
                                                        : "text-yellow-400"
                                                }
                                            >
                                                {loading
                                                    ? "Loading..."
                                                    : currentConfig
                                                      ? "Supported"
                                                      : countryData?.isUnsupported
                                                        ? "Unsupported"
                                                        : "Default"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        setSimulatedCountry(null);
                                        setIpDetectionEnabled(false);
                                        setCountryData(null);
                                        setLoading(false);
                                    }}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                >
                                    Reset to Default
                                </button>
                                <button
                                    onClick={() => setSimulatedCountry("US")}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                >
                                    Test US
                                </button>
                                <button
                                    onClick={() => setSimulatedCountry("CA")}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                >
                                    Test Canada
                                </button>
                                <button
                                    onClick={() => setSimulatedCountry("GB")}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                >
                                    Test UK
                                </button>
                                <button
                                    onClick={() => setSimulatedCountry("AU")}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                >
                                    Test Australia
                                </button>
                                <button
                                    onClick={() => {
                                        setSimulatedCountry("FR");
                                        setCountryData({
                                            country_code: "FR",
                                            country_name: "France",
                                            city: "Paris",
                                            isUnsupported: true,
                                        });
                                        setLoading(false);
                                    }}
                                    className="px-3 py-1 bg-red-900/50 hover:bg-red-900/70 rounded text-sm transition-colors text-red-200"
                                >
                                    Test Unsupported (FR)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Show Dev Tools Toggle when hidden */}
                    {!showDevTools && (
                        <button
                            onClick={() => setShowDevTools(true)}
                            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Show Developer Tools
                        </button>
                    )}

                    {/* Main Content Section */}
                    <section className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Section Header */}
                        <div className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {currentConfig
                                            ? "Local Charter Information"
                                            : "Charter Information"}
                                    </h2>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        {currentConfig
                                            ? `Personalized content for ${currentConfig.name}`
                                            : "Select your location to see relevant content"}
                                    </p>
                                </div>

                                {!loading && countryData && currentConfig && (
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                                        <span className="text-2xl">
                                            {currentConfig.flag}
                                        </span>
                                        <div className="text-sm">
                                            <div className="font-semibold text-gray-900">
                                                {currentConfig.name}
                                            </div>
                                            {countryData.city && (
                                                <div className="text-gray-500 text-xs">
                                                    {countryData.city}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="relative">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
                                    </div>
                                    <span className="mt-4 text-gray-600 font-medium">
                                        {ipDetectionEnabled
                                            ? "Detecting your location..."
                                            : "Loading..."}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    {/* Show content if supported country */}
                                    {currentConfig && renderSEOComponents}

                                    {/* Show unsupported message for non-supported countries */}
                                    {countryData?.isUnsupported &&
                                        renderUnsupportedMessage()}

                                    {/* Show default state when no IP and no simulation */}
                                    {!countryData &&
                                        !currentConfig &&
                                        renderDefaultState()}

                                    {/* Error message */}
                                    {error && !countryData && (
                                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-red-800">
                                                {error}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>

                    {/* Footer Contact */}
                    {currentConfig && (
                        <div className="mt-8 bg-gray-900 text-white rounded-xl p-6 text-center">
                            <p className="text-lg font-medium">
                                Need help booking in {currentConfig.name}?
                            </p>
                            <p className="text-gray-400 mt-1">
                                Call us at {currentConfig.phoneFormat} or
                                <a
                                    href="#quote-form"
                                    className="text-orange-400 hover:text-orange-300 ml-1 underline"
                                >
                                    get an instant quote
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
