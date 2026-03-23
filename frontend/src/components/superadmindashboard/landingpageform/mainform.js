"use client";
import { useState, useEffect, useRef } from "react";
import { getCountries, getCities } from "@/services/countryapi";    

const Label = ({ children, required }) => (
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
    </label>
);

const Input = ({ value, onChange, placeholder, type = "text", error }) => (
    <div>
        <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2.5 text-sm border rounded-md outline-none transition-all bg-white
                ${
                    error
                        ? "border-red-400 ring-1 ring-red-300"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const Textarea = ({
    value,
    onChange,
    placeholder,
    rows = 3,
    error,
    maxLength,
}) => (
    <div>
        <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2.5 text-sm border rounded-md outline-none transition-all bg-white resize-y leading-relaxed
                ${
                    error
                        ? "border-red-400 ring-1 ring-red-300"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
        />
        <div className="flex justify-between mt-1">
            {error ? <p className="text-red-500 text-xs">{error}</p> : <span />}
            {maxLength && (
                <span
                    className={`text-xs ml-auto ${(value?.length || 0) > maxLength ? "text-red-500" : "text-gray-400"}`}
                >
                    {value?.length || 0}/{maxLength}
                </span>
            )}
        </div>
    </div>
);

const TABS = [
    { id: "basic", label: "Basic Info" },
    { id: "hero", label: "Hero Section" },
    { id: "seo", label: "SEO Settings" },
];

export default function CharterBusForm({ initialData, onSave }) {
    const slugify = (str) =>
        str
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

    const generateSlug = (country, city) => {
        const co = slugify(country);
        const ci = slugify(city);
        if (co && ci) return `${co}/${ci}`;
        if (ci) return `${ci}`;
        if (co) return `${co}`;
        return "";
    };

    // Sync countryInput and cityInput with initialData when editing
    useEffect(() => {
        if (initialData?.country) {
            setCountryInput(initialData.country);
        }
        if (initialData?.city) {
            setCityInput(initialData.city);
        }
    }, [initialData]);

    const [data, setData] = useState({ 
        slug: initialData?.slug || "",
        country: initialData?.country || "",
        city: initialData?.city || "",
        main: {
            title_line1: initialData?.main?.title_line1 || "",
            description: initialData?.main?.description || "",
        },
        seo: {
            meta_title: initialData?.seo?.meta_title || "",
            meta_description: initialData?.seo?.meta_description || "",
            canonical_url: initialData?.seo?.canonical_url || "",
            focus_keyword: initialData?.seo?.focus_keyword || "",
            og_title: initialData?.seo?.og_title || "",
            og_description: initialData?.seo?.og_description || "",
            og_image: initialData?.seo?.og_image || "",
        },
    });

    const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState("basic");

    useEffect(() => {
        setData({
            slug: initialData?.slug || "",
            country: initialData?.country || "",
            city: initialData?.city || "",
            main: {
                title_line1: initialData?.main?.title_line1 || "",
                description: initialData?.main?.description || "",
            },
            seo: {
                meta_title: initialData?.seo?.meta_title || "",
                meta_description: initialData?.seo?.meta_description || "",
                canonical_url: initialData?.seo?.canonical_url || "",
                focus_keyword: initialData?.seo?.focus_keyword || "",
                og_title: initialData?.seo?.og_title || "",
                og_description: initialData?.seo?.og_description || "",
                og_image: initialData?.seo?.og_image || "",
            },
        });
        setSlugEdited(!!initialData?.slug);
        setErrors({});
        setTab("basic");
    }, [initialData]);

    const setBasic = (k, v) => {
        setData((d) => {
            const updated = { ...d, [k]: v };
            // Auto-generate slug when country or city changes, unless user manually edited it
            if ((k === "country" || k === "city") && !slugEdited) {
                const newCity = k === "city" ? v : d.city;
                const newCountry = k === "country" ? v : d.country;
                updated.slug = generateSlug(newCountry, newCity);
            }
            return updated;
        });
        clearErr(k);
        if (k === "slug") setSlugEdited(true);
    };
    const setMain = (k, v) => {
        setData((d) => ({ ...d, main: { ...d.main, [k]: v } }));
        clearErr(`main.${k}`);
    };
    const setSeo = (k, v) => {
        setData((d) => ({ ...d, seo: { ...d.seo, [k]: v } }));
        clearErr(`seo.${k}`);
    };
    const clearErr = (k) =>
        setErrors((e) => {
            const n = { ...e };
            delete n[k];
            return n;
        });

    const tabIndex = TABS.findIndex((t) => t.id === tab);

    const validate = () => {
        const e = {};
        if (!data.slug.trim()) e.slug = "Required";
        else if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(data.slug))
            e.slug = "Lowercase letters, numbers, hyphens and slashes only";
        if (!data.country.trim()) e.country = "Required";
        if (!data.city.trim()) e.city = "Required";
        if (!data.main.title_line1.trim()) e["main.title_line1"] = "Required";
        if (!data.main.description.trim()) e["main.description"] = "Required";
        else if (data.main.description.length > 300)
            e["main.description"] = "Max 300 characters";
        if (!data.seo.meta_title.trim()) e["seo.meta_title"] = "Required";
        else if (data.seo.meta_title.length > 60)
            e["seo.meta_title"] = "Max 60 characters";
        if (!data.seo.meta_description.trim())
            e["seo.meta_description"] = "Required";
        else if (data.seo.meta_description.length > 160)
            e["seo.meta_description"] = "Max 160 characters";
        if (data.seo.og_description.length > 200)
            e["seo.og_description"] = "Max 200 characters";
        if (
            data.seo.canonical_url &&
            !/^https?:\/\/.+/.test(data.seo.canonical_url)
        )
            e["seo.canonical_url"] =
                "Must be a valid URL starting with http:// or https://";
        if (data.seo.og_image && !/^https?:\/\/.+/.test(data.seo.og_image))
            e["seo.og_image"] =
                "Must be a valid URL starting with http:// or https://";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (tabIndex < TABS.length - 1) {
            if (!validate()) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            setTab(TABS[tabIndex + 1].id);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrev = () => {
        if (tabIndex > 0) {
            setTab(TABS[tabIndex - 1].id);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSubmit = () => {
        if (validate()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            onSave?.(data);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const [countryInput, setCountryInput] = useState("");
    const [countries, setCountries] = useState([]);

    const [cityInput, setCityInput] = useState("");
    const [cities, setCities] = useState([]);

    const [selectedCountryCode, setSelectedCountryCode] = useState(null);

    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const countryRef = useRef(null);
    const cityRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (countryRef.current && !countryRef.current.contains(e.target)) {
                setShowCountryDropdown(false);
            }
            if (cityRef.current && !cityRef.current.contains(e.target)) {
                setShowCityDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
   
  
    return (
        <div className="bg-white">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 px-6 pt-5">
                {TABS.map((t, i) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`mr-6 pb-3 text-sm font-medium border-b-2 transition-colors
                            ${
                                tab === t.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {i + 1}. {t.label}
                    </button>
                ))}
            </div>

            <div className="p-6 grid gap-5">
                {/* ── BASIC INFO ── */}
                {tab === "basic" && (
                    <>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <Label required>URL Slug</Label>
                                {slugEdited && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSlugEdited(false);
                                            setBasic(
                                                "slug",
                                                generateSlug(
                                                    data.country,
                                                    data.city,
                                                ),
                                            );
                                        }}
                                        className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                                    >
                                        ↺ Auto-generate
                                    </button>
                                )}
                            </div>
                            <Input
                                value={data.slug || ""}
                                onChange={(v) => {
                                    setSlugEdited(true);
                                    setBasic(
                                        "slug",
                                        v
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                            .replace(/[^a-z0-9-/]/g, ""),
                                    );
                                }}
                                placeholder="new-york-usa"
                                error={errors.slug}
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                {!slugEdited && (data.city || data.country) ? (
                                    <span className="text-green-600">
                                        Auto-generated from city & country
                                    </span>
                                ) : (
                                    "Type city and country above to auto-generate"
                                )}
                                {" · "}
                                Preview:{" "}
                                <code className="text-blue-500 bg-gray-50 px-1.5 py-0.5 rounded">
                                    /{slugify(data.country) || "your-country"}/
                                    {slugify(data.city) || "your-city"}
                                </code>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* 🌍 COUNTRY */}
                            <div className="relative" ref={countryRef}>
                                <Label required>Country</Label>

                                <Input
                                    value={countryInput}
                                    onChange={async (v) => {
                                        setCountryInput(v);

                                        if (!v) {
                                            setCountries([]);
                                            return;
                                        }

                                        const res = await getCountries(v);
                                        setCountries(res);
                                        setShowCountryDropdown(true);
                                    }}
                                    onFocus={async () => {
                                        if (countryInput) {
                                            const res = await getCountries(countryInput);
                                            setCountries(res);
                                        }
                                        setShowCountryDropdown(true);
                                    }}
                                    placeholder="Select Country"
                                />

                                {showCountryDropdown &&
                                    countries.length > 0 && (
                                        <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
                                            {countries.map((c) => (
                                                <div
                                                    key={c.code}
                                                    onClick={async () => {
                                                        setCountryInput(c.name);
                                                        setSelectedCountryCode(
                                                            c.code,
                                                        );
                                                        setBasic(
                                                            "country",
                                                            c.name,
                                                        );

                                                        setShowCountryDropdown(
                                                            false,
                                                        );

                                                        // 🔥 Load cities
                                                        const cityData =
                                                            await getCities(
                                                                c.name,
                                                            );
                                                        setCities(cityData);
                                                    }}
                                                    className="p-3 cursor-pointer hover:bg-gray-100"
                                                >
                                                    {c.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>

                            {/* 🏙️ CITY */}
                            <div className="relative" ref={cityRef}>
                                <Label required>City</Label>

                                <Input
                                    value={cityInput}
                                    onChange={(v) => {
                                        setCityInput(v);
                                        setShowCityDropdown(true);
                                    }}
                                    onFocus={() => {
                                        setShowCityDropdown(true);
                                    }}
                                    placeholder="Select City"
                                    disabled={!selectedCountryCode}
                                />

                                {showCityDropdown && cities.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
                                        {cities
                                            .filter((c) =>
                                                c.name
                                                    .toLowerCase()
                                                    .includes(
                                                        cityInput.toLowerCase(),
                                                    ),
                                            )
                                            .slice(0, 8)
                                            .map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => {
                                                        setCityInput(c.name);
                                                        setBasic(
                                                            "city",
                                                            c.name,
                                                        );
                                                        setShowCityDropdown(
                                                            false,
                                                        );
                                                    }}
                                                    className="p-3 cursor-pointer hover:bg-gray-100"
                                                >
                                                    {c.name}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="font-medium text-gray-700">
                                Config:
                            </span>
                            <span className="bg-white border border-gray-200 rounded px-2 py-0.5">
                                {data.country?.toUpperCase() || "USA"}
                            </span>
                            <span className="bg-white border border-gray-200 rounded px-2 py-0.5">
                                {data.city || "No City"}
                            </span>
                            <span
                                className={`rounded px-2 py-0.5 ${data.slug ? "bg-green-50 border border-green-200 text-green-700" : "bg-orange-50 border border-orange-200 text-orange-700"}`}
                            >
                                {data.slug ? "Slug set" : "Slug required"}
                            </span>
                        </div>
                    </>
                )}

                {/* ── HERO SECTION ── */}
                {tab === "hero" && (
                    <>
                        <div>
                            <Label required>Title Line 1</Label>
                            <Input
                                value={data.main?.title_line1 || ""}
                                onChange={(v) => setMain("title_line1", v)}
                                placeholder="Book Your"
                                error={errors["main.title_line1"]}
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                First line of the hero heading
                            </p>
                        </div>

                        <div>
                            <Label required>Description</Label>
                            <Textarea
                                value={data.main?.description || ""}
                                onChange={(v) => setMain("description", v)}
                                placeholder="Experience premium group travel with our fleet of luxury coaches..."
                                rows={4}
                                error={errors["main.description"]}
                                maxLength={300}
                            />
                        </div>
                    </>
                )}

                {/* ── SEO SETTINGS ── */}
                {tab === "seo" && (
                    <>
                        <div>
                            <Label required>Meta Title</Label>
                            <Input
                                value={data.seo?.meta_title || ""}
                                onChange={(v) => setSeo("meta_title", v)}
                                placeholder="New York Charter Bus Rental"
                                error={errors["seo.meta_title"]}
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-gray-400">
                                    Shown in browser tab and search results
                                </p>
                                <span
                                    className={`text-xs ${(data.seo.meta_title?.length || 0) > 60 ? "text-red-500" : "text-gray-400"}`}
                                >
                                    {data.seo.meta_title?.length || 0}/60
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label required>Meta Description</Label>
                            <Textarea
                                value={data.seo?.meta_description || ""}
                                onChange={(v) => setSeo("meta_description", v)}
                                placeholder="Book charter buses in New York with luxury coaches and professional drivers."
                                rows={3}
                                error={errors["seo.meta_description"]}
                                maxLength={160}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Summary shown in search engine results
                            </p>
                        </div>

                        <div>
                            <Label>Focus Keyword</Label>
                            <Input
                                value={data.seo?.focus_keyword || ""}
                                onChange={(v) => setSeo("focus_keyword", v)}
                                placeholder="charter bus new york"
                                error={errors["seo.focus_keyword"]}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Primary keyword this page should rank for
                            </p>
                        </div>

                        <div>
                            <Label>Canonical URL</Label>
                            <Input
                                value={data.seo?.canonical_url || ""}
                                onChange={(v) => setSeo("canonical_url", v)}
                                placeholder="https://yoursite.com/usa/new-york"
                                error={errors["seo.canonical_url"]}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Leave blank to use the page URL automatically
                            </p>
                        </div>

                        {/* ── Open Graph ── */}
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2 border-t border-gray-100 -mb-2">
                            Open Graph (Social Sharing)
                        </div>

                        <div>
                            <Label>OG Title</Label>
                            <Input
                                value={data.seo?.og_title || ""}
                                onChange={(v) => setSeo("og_title", v)}
                                placeholder="New York Charter Bus Rental — Book Now"
                                error={errors["seo.og_title"]}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Title shown when shared on Facebook, LinkedIn,
                                etc. Defaults to meta title if blank.
                            </p>
                        </div>

                        <div>
                            <Label>OG Description</Label>
                            <Textarea
                                value={data.seo?.og_description || ""}
                                onChange={(v) => setSeo("og_description", v)}
                                placeholder="Premium charter bus rentals in New York. Book online in minutes."
                                rows={2}
                                error={errors["seo.og_description"]}
                                maxLength={200}
                            />
                        </div>

                        <div>
                            <Label>OG Image URL</Label>
                            <Input
                                value={data.seo?.og_image || ""}
                                onChange={(v) => setSeo("og_image", v)}
                                placeholder="https://yoursite.com/images/og-new-york.jpg"
                                error={errors["seo.og_image"]}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Recommended size: 1200×630px
                            </p>
                        </div>

                        {/* Google Search Preview */}
                        <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mt-2">
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                                Search Preview
                            </p>
                            <p className="text-xs text-green-700">
                                www.yoursite.com › {data.slug || "your-slug"}
                            </p>
                            <p className="text-sm text-blue-700 font-medium mt-0.5">
                                {data.seo.meta_title || "Your Meta Title"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {data.seo.meta_description ||
                                    "Your meta description will appear here..."}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={tabIndex === 0}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                        ${
                            tabIndex === 0
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-200 bg-gray-100"
                        }`}
                >
                    ← Previous
                </button>

                {tabIndex < TABS.length - 1 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-5 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Save Changes
                    </button>
                )}
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="mx-6 mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-xs font-medium">
                        ⚠ {Object.keys(errors).length} field(s) need attention
                        before saving.
                    </p>
                </div>
            )}
        </div>
    );
}
