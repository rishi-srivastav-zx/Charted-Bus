"use client";
import { useState, useRef } from "react";

// ── Rich Text Editor ──────────────────────────────────────────
function RichEditor({ value, onChange, rows = 3, error }) {
    const ref = useRef(null);

    const exec = (cmd, val = null) => {
        ref.current.focus();
        document.execCommand(cmd, false, val);
        onChange(ref.current.innerHTML);
    };

    const tools = [
        { label: "B", cmd: "bold", title: "Bold" },
        { label: "I", cmd: "italic", title: "Italic" },
        { label: "U", cmd: "underline", title: "Underline" },
        { label: "H2", cmd: "formatBlock", val: "h2", title: "Heading 2" },
        { label: "H3", cmd: "formatBlock", val: "h3", title: "Heading 3" },
        { label: "¶", cmd: "formatBlock", val: "p", title: "Paragraph" },
        { label: "UL", cmd: "insertUnorderedList", title: "Bullet list" },
        { label: "OL", cmd: "insertOrderedList", title: "Numbered list" },
        {
            label: "Link",
            cmd: "createLink",
            title: "Insert link",
            isLink: true,
        },
        { label: "—", cmd: "insertHorizontalRule", title: "Divider" },
    ];

    return (
        <div
            className={`border rounded-lg overflow-hidden ${error ? "border-red-500 ring-1 ring-red-400" : "border-gray-300"}`}
        >
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
                {tools.map((t) => (
                    <button
                        key={t.cmd + t.label}
                        title={t.title}
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            if (t.isLink) {
                                const url = window.prompt("Enter URL:");
                                if (url) exec(t.cmd, url);
                            } else {
                                exec(t.cmd, t.val || null);
                            }
                        }}
                        className="px-2 py-1 text-xs font-semibold bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-700 min-w-[30px] transition-colors"
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onInput={() => onChange(ref.current.innerHTML)}
                dangerouslySetInnerHTML={{ __html: value }}
                className="min-h-[120px] p-3 text-sm leading-relaxed outline-none text-gray-900 bg-white"
                style={{ minHeight: rows * 28 }}
            />
            {error && <p className="text-red-500 text-xs px-3 pb-2">{error}</p>}
        </div>
    );
}

// ── Field components ──────────────────────────────────────────
const Label = ({ children, required }) => (
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
    </label>
);

const Input = ({ value, onChange, placeholder, error }) => (
    <div>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2.5 text-sm border rounded-md outline-none transition-all bg-white
                ${
                    error
                        ? "border-red-400 ring-1 ring-red-300 focus:border-red-400"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const Textarea = ({ value, onChange, placeholder, rows = 3, error }) => (
    <div>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2.5 text-sm border rounded-md outline-none transition-all bg-white resize-y leading-relaxed
                ${
                    error
                        ? "border-red-400 ring-1 ring-red-300 focus:border-red-400"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const Card = ({ children, title, subtitle }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {(title || subtitle) && (
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                {title && (
                    <h3 className="text-sm font-bold text-gray-800">{title}</h3>
                )}
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                )}
            </div>
        )}
        <div className="p-5 grid gap-4">{children}</div>
    </div>
);

const AddBtn = ({ onClick, label }) => (
    <button
        type="button"
        onClick={onClick}
        className="mt-2 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
    >
        + {label}
    </button>
);

const RemoveBtn = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
    >
        Remove
    </button>
);

// ── Empty initial state ───────────────────────────────────────
const EMPTY = {
    hero: {
        heading: "",
        subtext: "",
    },
    guide: {
        heading: "",
        subtext: "",
        bodyHtml: "",
        tripTypes: [],
    },
    coverage: {
        heading: "",
        subtext: "",
        callout: "",
        regions: [],
    },
    faq: {
        tag: "",
        heading: "",
        subtext: "",
        items: [],
    },
};

const TABS = [
    { id: "hero", label: "Hero", required: ["heading", "subtext"] },
    {
        id: "guide",
        label: "Guide",
        required: ["heading", "subtext", "bodyHtml"],
    },
    {
        id: "coverage",
        label: "Coverage",
        required: ["heading", "subtext", "regions"],
    },
    {
        id: "faq",
        label: "FAQ",
        required: ["tag", "heading", "subtext", "items"],
    },
];

export default function CharterBusEditor({ initialData, onSave }) {
    const [tab, setTab] = useState("hero");
    const [data, setData] = useState(initialData || EMPTY);
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);

    const set = (section, key, value) =>
        setData((d) => ({ ...d, [section]: { ...d[section], [key]: value } }));

    const setArr = (section, key, idx, field, value) => {
        const arr = [...data[section][key]];
        arr[idx] = { ...arr[idx], [field]: value };
        set(section, key, arr);
    };

    const addItem = (section, key, template) =>
        set(section, key, [...data[section][key], template]);
    const removeItem = (section, key, idx) =>
        set(
            section,
            key,
            data[section][key].filter((_, i) => i !== idx),
        );

    // ── Validation ────────────────────────────────────────────
    const validateTab = (tabId) => {
        const tabConfig = TABS.find((t) => t.id === tabId);
        const newErrors = {};
        let isValid = true;

        tabConfig?.required.forEach((field) => {
            const value = data[tabId][field];

            if (
                field === "regions" ||
                field === "items" ||
                field === "tripTypes"
            ) {
                if (!value || value.length === 0) {
                    newErrors[field] =
                        `At least one ${field === "items" ? "FAQ item" : field.slice(0, -1)} is required`;
                    isValid = false;
                }
            } else if (field === "bodyHtml") {
                const stripped = value?.replace(/<[^>]*>/g, "").trim();
                if (!stripped) {
                    newErrors[field] = "This field is required";
                    isValid = false;
                }
            } else {
                if (!value || value.trim() === "") {
                    newErrors[field] = "This field is required";
                    isValid = false;
                }
            }
        });

        setErrors((prev) => ({ ...prev, [tabId]: newErrors }));
        return isValid;
    };

    const validateAll = () => {
        let allValid = true;
        TABS.forEach((t) => {
            if (!validateTab(t.id)) allValid = false;
        });
        return allValid;
    };

    const handleNext = () => {
        if (validateTab(tab)) {
            const idx = TABS.findIndex((t) => t.id === tab);
            if (idx < TABS.length - 1) setTab(TABS[idx + 1].id);
        }
    };

    const handlePrevious = () => {
        const idx = TABS.findIndex((t) => t.id === tab);
        if (idx > 0) setTab(TABS[idx - 1].id);
    };

    const handleTabClick = (tabId) => {
        const curr = TABS.findIndex((t) => t.id === tab);
        const target = TABS.findIndex((t) => t.id === tabId);
        if (target <= curr || validateTab(tab)) setTab(tabId);
    };

    const handleSave = () => {
        if (validateAll()) {
            onSave?.(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }
    };

    const err = (section, field) => errors[section]?.[field];

    const currentTabIndex = TABS.findIndex((t) => t.id === tab);
    const isFirstTab = currentTabIndex === 0;
    const isLastTab = currentTabIndex === TABS.length - 1;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto p-6">
                {/* ── Sidebar + Content layout ── */}
                <div className="flex gap-5 items-start">
                    {/* Sidebar */}
                    <div className="w-40 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm sticky top-6">
                        {TABS.map((t, index) => {
                            const isCompleted = index < currentTabIndex;
                            const isCurrent = t.id === tab;
                            const hasErrors =
                                errors[t.id] &&
                                Object.keys(errors[t.id]).length > 0;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => handleTabClick(t.id)}
                                    className={`w-full text-left px-4 py-3 text-sm transition-all border-l-2 flex items-center gap-2
                                        ${
                                            isCurrent
                                                ? "bg-blue-50 text-blue-600 border-blue-500 font-semibold"
                                                : isCompleted
                                                  ? "text-green-600 border-transparent hover:bg-gray-50"
                                                  : hasErrors
                                                    ? "text-red-500 border-transparent hover:bg-gray-50"
                                                    : "text-gray-500 border-transparent hover:bg-gray-50"
                                        }`}
                                >
                                    {isCompleted && !hasErrors ? (
                                        <span className="text-green-500 text-xs">
                                            ✓
                                        </span>
                                    ) : hasErrors && !isCurrent ? (
                                        <span className="text-red-400 text-xs">
                                            !
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            {index + 1}.
                                        </span>
                                    )}
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main panel */}
                    <div className="flex-1 grid gap-4">
                        {/* Progress bar */}
                        <div className="bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm flex items-center gap-4">
                            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                Step {currentTabIndex + 1} of {TABS.length}:{" "}
                                {TABS[currentTabIndex].label}
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${((currentTabIndex + 1) / TABS.length) * 100}%`,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                {Math.round(
                                    ((currentTabIndex + 1) / TABS.length) * 100,
                                )}
                                %
                            </span>
                        </div>

                        {/* ── HERO TAB ── */}
                        {tab === "hero" && (
                            <Card
                                title="Hero Section"
                                subtitle="The top banner content of the page."
                            >
                                <div>
                                    <Label required>Main Heading</Label>
                                    <Input
                                        value={data.hero.heading}
                                        onChange={(v) =>
                                            set("hero", "heading", v)
                                        }
                                        placeholder="Affordable Charter Bus Rentals"
                                        error={err("hero", "heading")}
                                    />
                                </div>
                                <div>
                                    <Label required>Subtext</Label>
                                    <Textarea
                                        value={data.hero.subtext}
                                        onChange={(v) =>
                                            set("hero", "subtext", v)
                                        }
                                        placeholder="From coast to coast, transparent group transportation..."
                                        rows={3}
                                        error={err("hero", "subtext")}
                                    />
                                </div>
                            </Card>
                        )}

                        {/* ── GUIDE TAB ── */}
                        {tab === "guide" && (
                            <>
                                <Card title="Guide Section — Header">
                                    <div>
                                        <Label required>Heading</Label>
                                        <Input
                                            value={data.guide.heading}
                                            onChange={(v) =>
                                                set("guide", "heading", v)
                                            }
                                            placeholder="Complete Guide to Charter Bus Rentals in the USA"
                                            error={err("guide", "heading")}
                                        />
                                    </div>
                                    <div>
                                        <Label required>Subtext</Label>
                                        <Textarea
                                            value={data.guide.subtext}
                                            onChange={(v) =>
                                                set("guide", "subtext", v)
                                            }
                                            placeholder="Everything you need to know before booking..."
                                            rows={2}
                                            error={err("guide", "subtext")}
                                        />
                                    </div>
                                </Card>

                                <Card
                                    title="Guide Body"
                                    subtitle="Rich text intro paragraph."
                                >
                                    <div>
                                        <Label required>Content</Label>
                                        <RichEditor
                                            value={data.guide.bodyHtml}
                                            onChange={(v) =>
                                                set("guide", "bodyHtml", v)
                                            }
                                            rows={5}
                                            error={err("guide", "bodyHtml")}
                                        />
                                    </div>
                                </Card>

                                <Card
                                    title="Trip Types"
                                    subtitle="List of specializations shown below the intro."
                                >
                                    {err("guide", "tripTypes") && (
                                        <p className="text-red-500 text-xs -mb-2">
                                            {err("guide", "tripTypes")}
                                        </p>
                                    )}
                                    {data.guide.tripTypes.map((item, i) => (
                                        <div
                                            key={i}
                                            className={`grid gap-3 ${i !== 0 ? "pt-4 border-t border-gray-100" : ""}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Trip Type {i + 1}
                                                </span>
                                                <RemoveBtn
                                                    onClick={() =>
                                                        removeItem(
                                                            "guide",
                                                            "tripTypes",
                                                            i,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label required>Title</Label>
                                                <Input
                                                    value={item.title}
                                                    onChange={(v) =>
                                                        setArr(
                                                            "guide",
                                                            "tripTypes",
                                                            i,
                                                            "title",
                                                            v,
                                                        )
                                                    }
                                                    placeholder="Corporate Events & Business Travel"
                                                />
                                            </div>
                                            <div>
                                                <Label required>
                                                    Description
                                                </Label>
                                                <Textarea
                                                    value={item.desc}
                                                    onChange={(v) =>
                                                        setArr(
                                                            "guide",
                                                            "tripTypes",
                                                            i,
                                                            "desc",
                                                            v,
                                                        )
                                                    }
                                                    placeholder="Employee shuttles, team offsite travel..."
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <AddBtn
                                        onClick={() =>
                                            addItem("guide", "tripTypes", {
                                                title: "",
                                                desc: "",
                                            })
                                        }
                                        label="Add Trip Type"
                                    />
                                </Card>
                            </>
                        )}

                        {/* ── COVERAGE TAB ── */}
                        {tab === "coverage" && (
                            <>
                                <Card title="Coverage Section — Header">
                                    <div>
                                        <Label required>Heading</Label>
                                        <Input
                                            value={data.coverage.heading}
                                            onChange={(v) =>
                                                set("coverage", "heading", v)
                                            }
                                            placeholder="Nationwide Charter Bus Coverage"
                                            error={err("coverage", "heading")}
                                        />
                                    </div>
                                    <div>
                                        <Label required>Subtext</Label>
                                        <Textarea
                                            value={data.coverage.subtext}
                                            onChange={(v) =>
                                                set("coverage", "subtext", v)
                                            }
                                            placeholder="All 50 states — major metro hubs to rural destinations."
                                            rows={2}
                                            error={err("coverage", "subtext")}
                                        />
                                    </div>
                                    <div>
                                        <Label>
                                            Callout Block{" "}
                                            <span className="normal-case font-normal text-gray-400">
                                                (HTML allowed)
                                            </span>
                                        </Label>
                                        <Textarea
                                            value={data.coverage.callout}
                                            onChange={(v) =>
                                                set("coverage", "callout", v)
                                            }
                                            placeholder="We've moved <strong>10,000+ attendees</strong>..."
                                            rows={2}
                                        />
                                    </div>
                                </Card>

                                <Card
                                    title="Regions & Cities"
                                    subtitle="Each region has a name and a comma-separated list of cities."
                                >
                                    {err("coverage", "regions") && (
                                        <p className="text-red-500 text-xs -mb-2">
                                            {err("coverage", "regions")}
                                        </p>
                                    )}
                                    {data.coverage.regions.map((reg, i) => (
                                        <div
                                            key={i}
                                            className={`grid gap-3 ${i !== 0 ? "pt-4 border-t border-gray-100" : ""}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Region {i + 1}
                                                </span>
                                                <RemoveBtn
                                                    onClick={() =>
                                                        removeItem(
                                                            "coverage",
                                                            "regions",
                                                            i,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label required>
                                                    Region Name
                                                </Label>
                                                <Input
                                                    value={reg.name}
                                                    onChange={(v) =>
                                                        setArr(
                                                            "coverage",
                                                            "regions",
                                                            i,
                                                            "name",
                                                            v,
                                                        )
                                                    }
                                                    placeholder="Northeast"
                                                />
                                            </div>
                                            <div>
                                                <Label required>
                                                    Cities (comma-separated)
                                                </Label>
                                                <Input
                                                    value={reg.cities.join(
                                                        ", ",
                                                    )}
                                                    onChange={(v) =>
                                                        setArr(
                                                            "coverage",
                                                            "regions",
                                                            i,
                                                            "cities",
                                                            v
                                                                .split(",")
                                                                .map((c) =>
                                                                    c.trim(),
                                                                )
                                                                .filter(
                                                                    Boolean,
                                                                ),
                                                        )
                                                    }
                                                    placeholder="New York City, Boston, Philadelphia"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <AddBtn
                                        onClick={() =>
                                            addItem("coverage", "regions", {
                                                id: `r${Date.now()}`,
                                                name: "",
                                                cities: [],
                                            })
                                        }
                                        label="Add Region"
                                    />
                                </Card>
                            </>
                        )}

                        {/* ── FAQ TAB ── */}
                        {tab === "faq" && (
                            <>
                                <Card title="FAQ Section — Header">
                                    <div>
                                        <Label required>Tag</Label>
                                        <Input
                                            value={data.faq.tag}
                                            onChange={(v) =>
                                                set("faq", "tag", v)
                                            }
                                            placeholder="FAQ"
                                            error={err("faq", "tag")}
                                        />
                                    </div>
                                    <div>
                                        <Label required>Heading</Label>
                                        <Input
                                            value={data.faq.heading}
                                            onChange={(v) =>
                                                set("faq", "heading", v)
                                            }
                                            placeholder="Frequently Asked Questions"
                                            error={err("faq", "heading")}
                                        />
                                    </div>
                                    <div>
                                        <Label required>Subtext</Label>
                                        <Textarea
                                            value={data.faq.subtext}
                                            onChange={(v) =>
                                                set("faq", "subtext", v)
                                            }
                                            placeholder="Everything you need to know about charter bus rentals."
                                            rows={2}
                                            error={err("faq", "subtext")}
                                        />
                                    </div>
                                </Card>

                                <Card title="FAQ Items">
                                    {err("faq", "items") && (
                                        <p className="text-red-500 text-xs -mb-2">
                                            {err("faq", "items")}
                                        </p>
                                    )}
                                    {data.faq.items.map((faq, i) => (
                                        <div
                                            key={i}
                                            className={`grid gap-3 ${i !== 0 ? "pt-4 border-t border-gray-100" : ""}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Q{i + 1}
                                                </span>
                                                <RemoveBtn
                                                    onClick={() =>
                                                        removeItem(
                                                            "faq",
                                                            "items",
                                                            i,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label required>Question</Label>
                                                <Input
                                                    value={faq.q}
                                                    onChange={(v) =>
                                                        setArr(
                                                            "faq",
                                                            "items",
                                                            i,
                                                            "q",
                                                            v,
                                                        )
                                                    }
                                                    placeholder="How much does a charter bus rental cost?"
                                                />
                                            </div>
                                            <div>
                                                <Label required>Answer</Label>
                                                <Textarea
                                                    value={faq.a}
                                                    onChange={(v) =>
                                                        setArr(
                                                            "faq",
                                                            "items",
                                                            i,
                                                            "a",
                                                            v,
                                                        )
                                                    }
                                                    placeholder="Charter bus costs typically range from..."
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <AddBtn
                                        onClick={() =>
                                            addItem("faq", "items", {
                                                q: "",
                                                a: "",
                                            })
                                        }
                                        label="Add FAQ"
                                    />
                                </Card>
                            </>
                        )}

                        {/* ── Navigation ── */}
                        <div className="flex justify-between items-center pt-2">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={isFirstTab}
                                className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all
                                    ${
                                        isFirstTab
                                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                            : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 shadow-sm"
                                    }`}
                            >
                                ← Previous
                            </button>

                            {!isLastTab ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-sm"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all shadow-sm
                                        ${saved ? "bg-green-600 text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
                                >
                                    {saved ? "✓ Saved" : "Complete & Save"}
                                </button>
                            )}
                        </div>

                        {/* Validation error summary */}
                        {Object.keys(errors[tab] || {}).length > 0 && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 text-xs font-medium">
                                    ⚠ Please fill in all required fields before
                                    proceeding.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
