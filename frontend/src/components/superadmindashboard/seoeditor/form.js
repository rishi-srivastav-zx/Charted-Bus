"use client";
import { useState, useRef } from "react";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Link,
    AlignLeft,
    AlignCenter,
    Type,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MapPin,
    MessageSquare,
    Layers,
    HelpCircle,
    Image,
    CheckCircle,
    X,
    GripVertical,
    Upload,
    AlertCircle,
    Star,
    Briefcase,
    Send,
} from "lucide-react";

// ─── uid helper ───────────────────────────────────────────────────────────────
let _id = 0;
const uid = () => `id_${++_id}_${Date.now()}`;

// ─── Empty defaults ───────────────────────────────────────────────────────────
const makeDefaults = () => ({
    hero: { heading: "", heroImage: "", description: "" },
    services: {
        heading: "",
        subheading: "",
        items: [
            { id: uid(), icon: "", title: "", description: "", link: "" },
            { id: uid(), icon: "", title: "", description: "", link: "" },
            { id: uid(), icon: "", title: "", description: "", link: "" },
        ],
    },
    whyus: {
        heading: "",
        mainContent: "",
        reasons: [{ id: uid(), title: "", body: "" }],
    },
    testimonials: {
        items: [
            { id: uid(), name: "", role: "", text: "", rating: "5", photo: "" },
        ],
    },
    faq: {
        items: [{ id: uid(), q: "", a: "" }],
    },
});

// ─── Nav steps ────────────────────────────────────────────────────────────────
const STEPS = [
    { id: "hero", label: "Hero", icon: Layers },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "whyus", label: "Why Choose Us", icon: CheckCircle },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "faq", label: "FAQ", icon: HelpCircle },
];

// ─── Rich Text Editor ─────────────────────────────────────────────────────────
function RichEditor({
    value,
    onChange,
    placeholder = "Start typing...",
    minHeight = "160px",
    error,
}) {
    const editorRef = useRef(null);
    const exec = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        editorRef.current?.focus();
        onChange(editorRef.current?.innerHTML || "");
    };
    const handleInput = () => onChange(editorRef.current?.innerHTML || "");
    const Btn = ({ onClick, title, children }) => (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className="w-7 h-7 flex items-center justify-center rounded text-xs transition-all text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm"
        >
            {children}
        </button>
    );
    return (
        <div
            className={`border rounded-xl overflow-hidden transition-all ${error ? "border-red-400 ring-2 ring-red-50" : "border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-50"}`}
        >
            <div className="flex items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                <Btn onClick={() => exec("bold")} title="Bold">
                    <Bold className="w-3 h-3" />
                </Btn>
                <Btn onClick={() => exec("italic")} title="Italic">
                    <Italic className="w-3 h-3" />
                </Btn>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <Btn
                    onClick={() => exec("insertUnorderedList")}
                    title="Bullet List"
                >
                    <List className="w-3 h-3" />
                </Btn>
                <Btn
                    onClick={() => exec("insertOrderedList")}
                    title="Numbered List"
                >
                    <ListOrdered className="w-3 h-3" />
                </Btn>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <Btn onClick={() => exec("justifyLeft")} title="Left">
                    <AlignLeft className="w-3 h-3" />
                </Btn>
                <Btn onClick={() => exec("justifyCenter")} title="Center">
                    <AlignCenter className="w-3 h-3" />
                </Btn>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <Btn onClick={() => exec("formatBlock", "h2")} title="Heading">
                    <Type className="w-3 h-3" />
                </Btn>
                <Btn
                    onClick={() => {
                        const u = window.prompt("URL:");
                        if (u) exec("createLink", u);
                    }}
                    title="Link"
                >
                    <Link className="w-3 h-3" />
                </Btn>
                <Btn onClick={() => exec("removeFormat")} title="Clear">
                    <X className="w-3 h-3" />
                </Btn>
                <div className="flex-1" />
                <span className="text-[10px] text-gray-400 font-medium">
                    RICH TEXT
                </span>
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                style={{ minHeight }}
                className="px-4 py-3 text-gray-800 text-sm leading-relaxed outline-none prose prose-sm max-w-none"
                data-placeholder={placeholder}
                dangerouslySetInnerHTML={{ __html: value }}
            />
            <style>{`
                [contenteditable]:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}
                [contenteditable] h2{font-size:1.2rem;font-weight:700;margin:.4rem 0}
                [contenteditable] ul{list-style:disc;padding-left:1.5rem;margin:.4rem 0}
                [contenteditable] ol{list-style:decimal;padding-left:1.5rem;margin:.4rem 0}
                [contenteditable] a{color:#ea580c;text-decoration:underline}
                [contenteditable] b,[contenteditable] strong{font-weight:700}
                [contenteditable] i,[contenteditable] em{font-style:italic}
            `}</style>
        </div>
    );
}

// ─── Form Primitives ──────────────────────────────────────────────────────────
function FormField({ label, hint, error, required, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
                <label className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
                {required && <span className="text-red-500 text-xs">*</span>}
            </div>
            {hint && (
                <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>
            )}
            {children}
            {error && (
                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-0.5">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}

function Input({ value, onChange, placeholder, type = "text", error }) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`px-4 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${error ? "border-red-400 ring-2 ring-red-50 focus:ring-red-100" : "border-gray-200 focus:border-orange-400 focus:ring-orange-50"}`}
        />
    );
}

function Textarea({ value, onChange, placeholder, rows = 3, error }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`px-4 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-y ${error ? "border-red-400 ring-2 ring-red-50 focus:ring-red-100" : "border-gray-200 focus:border-orange-400 focus:ring-orange-50"}`}
        />
    );
}

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, label, hint, error, required }) {
    const inputRef = useRef(null);
    const [urlMode, setUrlMode] = useState(true);
    const [urlVal, setUrlVal] = useState("");
    const [dragging, setDrag] = useState(false);
    const handleFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            onChange(e.target.result);
            setUrlMode(false);
        };
        reader.readAsDataURL(file);
    };
    const handleUrlChange = (v) => {
        setUrlVal(v);
        onChange(v);
    };
    const clearImage = () => {
        onChange("");
        setUrlVal("");
    };
    return (
        <FormField label={label} hint={hint} error={error} required={required}>
            <div className="flex gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => setUrlMode(true)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${urlMode ? "bg-orange-50 border-orange-400 text-orange-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                    URL
                </button>
                <button
                    type="button"
                    onClick={() => setUrlMode(false)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${!urlMode ? "bg-orange-50 border-orange-400 text-orange-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                    Upload File
                </button>
            </div>
            {urlMode ? (
                <Input
                    value={urlVal}
                    onChange={handleUrlChange}
                    placeholder="https://images.unsplash.com/..."
                    error={error}
                />
            ) : (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDrag(false);
                        handleFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${dragging ? "border-orange-400 bg-orange-50" : error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"}`}
                >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-500 font-medium">
                        Drop image here or{" "}
                        <span className="text-orange-500">browse</span>
                    </p>
                    <p className="text-xs text-gray-400">
                        PNG, JPG, WebP — max 5MB
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                </div>
            )}
            {value && (
                <div
                    className="relative rounded-xl overflow-hidden border border-gray-200 mt-1"
                    style={{ height: 160 }}
                >
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </FormField>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children, badge }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-orange-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                </div>
                {badge && (
                    <span className="text-xs text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full font-medium">
                        {badge}
                    </span>
                )}
            </div>
            <div className="p-6 flex flex-col gap-5">{children}</div>
        </div>
    );
}

// ─── Card List ────────────────────────────────────────────────────────────────
function CardList({
    items,
    onUpdate,
    onAdd,
    onDelete,
    onMove,
    renderFields,
    addLabel = "Add Item",
    errors = {},
}) {
    return (
        <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
                <div
                    key={item._id || item.id || idx}
                    className={`border rounded-xl overflow-hidden transition-all ${errors[idx] ? "border-red-300" : "border-gray-200"}`}
                >
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-gray-300" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                #{idx + 1}
                            </span>
                            {errors[idx] && (
                                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onMove(idx, -1)}
                                disabled={idx === 0}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 transition-all"
                            >
                                <ChevronUp className="w-3 h-3 text-gray-500" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onMove(idx, 1)}
                                disabled={idx === items.length - 1}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 transition-all"
                            >
                                <ChevronDown className="w-3 h-3 text-gray-500" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(idx)}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all ml-1"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        {renderFields(
                            item,
                            idx,
                            (field, val) =>
                                onUpdate(idx, { ...item, [field]: val }),
                            errors[idx] || {},
                        )}
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all"
            >
                <Plus className="w-4 h-4" /> {addLabel}
            </button>
        </div>
    );
}

// ─── Emoji Picker ─────────────────────────────────────────────────────────────
const EMOJI_OPTIONS = [
    "🚌",
    "✈️",
    "🎓",
    "🏢",
    "💒",
    "🎉",
    "⚽",
    "🎭",
    "🏥",
    "🛒",
    "🎸",
    "🏖️",
    "🚀",
    "🌆",
    "🎪",
    "🏆",
];
function EmojiPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 text-2xl flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
                {value || "➕"}
            </button>
            {open && (
                <div className="absolute z-20 top-14 left-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 grid grid-cols-4 gap-1.5 w-52">
                    {EMOJI_OPTIONS.map((e) => (
                        <button
                            key={e}
                            type="button"
                            onClick={() => {
                                onChange(e);
                                setOpen(false);
                            }}
                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center hover:bg-orange-50 transition-all ${value === e ? "bg-orange-100 ring-2 ring-orange-400" : ""}`}
                        >
                            {e}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="col-span-4 mt-1 text-xs text-gray-400 hover:text-gray-600 py-1"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingPageEditor({ initialData, onSave, isLoading }) {
    const [step, setStep] = useState(0); // current step index
    const [data, setData] = useState(() => {
        const defaults = makeDefaults();
        if (!initialData) return defaults;
        return {
            ...defaults,
            ...initialData,
            hero: { ...defaults.hero, ...initialData.hero },
            services: { ...defaults.services, ...initialData.services },
            whyus: { ...defaults.whyus, ...initialData.whyus },
            testimonials: { ...defaults.testimonials, ...initialData.testimonials },
            faq: { ...defaults.faq, ...initialData.faq },
        };
    });
    const [errors, setErrors] = useState({});
    const mainRef = useRef(null);

    const currentStep = STEPS[step];
    const isFirst = step === 0;
    const isLast = step === STEPS.length - 1;

    // ── Helpers ──────────────────────────────────────────────────────────────
    const update = (section, field, value) => {
        setData((d) => ({
            ...d,
            [section]: { ...d[section], [field]: value },
        }));
        setErrors((e) => {
            const n = { ...e };
            delete n[`${section}.${field}`];
            return n;
        });
    };

    const listOps = (section, field) => ({
        onUpdate: (idx, item) => {
            const arr = [...data[section][field]];
            arr[idx] = item;
            update(section, field, arr);
        },
        onAdd: (template) =>
            update(section, field, [
                ...data[section][field],
                { ...template, id: uid() },
            ]),
        onDelete: (idx) =>
            update(
                section,
                field,
                data[section][field].filter((_, i) => i !== idx),
            ),
        onMove: (idx, dir) => {
            const arr = [...data[section][field]];
            const ni = idx + dir;
            if (ni < 0 || ni >= arr.length) return;
            [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
            update(section, field, arr);
        },
    });

    const cardErrors = (section, field, keys) =>
        data[section][field].reduce((acc, _, i) => {
            const e = {};
            keys.forEach((k) => {
                if (errors[`${section}.${field}.${i}.${k}`])
                    e[k] = errors[`${section}.${field}.${i}.${k}`];
            });
            if (Object.keys(e).length) acc[i] = e;
            return acc;
        }, {});

    // ── Per-step validation ───────────────────────────────────────────────────
    const validateStep = (stepId) => {
        const errs = {};
        const txt = (v) => (v || "").replace(/<[^>]+>/g, "").trim();

        if (stepId === "hero") {
            if (!data.hero.heading.trim())
                errs["hero.heading"] = "Heading is required.";
            else if (data.hero.heading.trim().length < 10)
                errs["hero.heading"] = "Minimum 10 characters required.";
            if (!data.hero.heroImage)
                errs["hero.heroImage"] = "A hero image is required.";
            if (txt(data.hero.description).length < 20)
                errs["hero.description"] =
                    "Description must be at least 20 characters.";
        }
        if (stepId === "services") {
            if (!data.services.heading.trim())
                errs["services.heading"] = "Section heading is required.";
            if (!data.services.items.length)
                errs["services.items"] = "Add at least one service card.";
            data.services.items.forEach((s, i) => {
                if (!s.title.trim())
                    errs[`services.items.${i}.title`] = "Title is required.";
                if (!s.description.trim())
                    errs[`services.items.${i}.description`] =
                        "Description is required.";
                else if (s.description.trim().length < 10)
                    errs[`services.items.${i}.description`] =
                        "Minimum 10 characters required.";
                if (s.link?.trim()) {
                    try {
                        new URL(s.link);
                    } catch {
                        errs[`services.items.${i}.link`] =
                            "Enter a valid URL (https://...).";
                    }
                }
            });
        }
        if (stepId === "whyus") {
            if (!data.whyus.heading.trim())
                errs["whyus.heading"] = "Section heading is required.";
            if (txt(data.whyus.mainContent).length < 30)
                errs["whyus.mainContent"] =
                    "Main content must be at least 30 characters.";
            data.whyus.reasons.forEach((r, i) => {
                if (!r.title.trim())
                    errs[`whyus.reasons.${i}.title`] = "Title is required.";
                if (!r.body.trim())
                    errs[`whyus.reasons.${i}.body`] = "Body text is required.";
            });
        }
        if (stepId === "testimonials") {
            data.testimonials.items.forEach((t, i) => {
                if (!t.name.trim())
                    errs[`testimonials.items.${i}.name`] = "Name is required.";
                if (!t.text.trim())
                    errs[`testimonials.items.${i}.text`] =
                        "Review text is required.";
                else if (t.text.trim().length < 20)
                    errs[`testimonials.items.${i}.text`] =
                        "Minimum 20 characters required.";
            });
        }
        if (stepId === "faq") {
            if (!data.faq.items.length)
                errs["faq.items"] = "Add at least one FAQ item.";
            data.faq.items.forEach((f, i) => {
                if (!f.q.trim())
                    errs[`faq.items.${i}.q`] = "Question is required.";
                if (txt(f.a).length < 10)
                    errs[`faq.items.${i}.a`] =
                        "Answer must be at least 10 characters.";
            });
        }
        return errs;
    };

    // Count errors for a given step id (from current errors state)
    const stepErrorCount = (stepId) =>
        Object.keys(errors).filter((k) => k.startsWith(stepId + ".")).length;

    // ── Navigation ────────────────────────────────────────────────────────────
    const goNext = () => {
        const errs = validateStep(currentStep.id);
        // merge: keep old errors for other sections, replace for current
        setErrors((prev) => {
            const cleared = Object.fromEntries(
                Object.entries(prev).filter(
                    ([k]) => !k.startsWith(currentStep.id + "."),
                ),
            );
            return { ...cleared, ...errs };
        });
        if (!Object.keys(errs).length) {
            setStep((s) => Math.min(s + 1, STEPS.length - 1));
            mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goPrev = () => {
        setStep((s) => Math.max(s - 1, 0));
        mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSave = () => {
        const errs = validateStep(currentStep.id);
        setErrors((prev) => {
            const cleared = Object.fromEntries(
                Object.entries(prev).filter(
                    ([k]) => !k.startsWith(currentStep.id + "."),
                ),
            );
            return { ...cleared, ...errs };
        });
        if (!Object.keys(errs).length) {
            onSave?.(data);
        }
    };

    const handleReset = () => {
        setData(makeDefaults());
        setErrors({});
        setStep(0);
    };

    const currentErrors = stepErrorCount(currentStep.id);

    return (
        <div
            className="min-h-screen bg-gray-50 flex flex-col"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >

            {/* ── Step Progress Bar ── */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-0">
                        {STEPS.map((s, idx) => {
                            const isDone = idx < step;
                            const isActive = idx === step;
                            const hasErrors = stepErrorCount(s.id) > 0;
                            return (
                                <div
                                    key={s.id}
                                    className="flex items-center flex-1 last:flex-none"
                                >
                                    {/* Step circle */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (idx < step) setStep(idx);
                                        }}
                                        disabled={idx > step}
                                        className={`flex flex-col items-center gap-1 group disabled:cursor-not-allowed ${idx < step ? "cursor-pointer" : "cursor-default"}`}
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                            ${
                                                isActive
                                                    ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100"
                                                    : isDone
                                                      ? "bg-green-500 border-green-500 text-white"
                                                      : hasErrors
                                                        ? "bg-red-50 border-red-400 text-red-500"
                                                        : "bg-gray-100 border-gray-200 text-gray-400"
                                            }`}
                                        >
                                            {isDone ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : hasErrors ? (
                                                <AlertCircle className="w-4 h-4" />
                                            ) : (
                                                <s.icon className="w-4 h-4" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block ${isActive ? "text-orange-600" : isDone ? "text-green-600" : "text-gray-400"}`}
                                        >
                                            {s.label}
                                        </span>
                                    </button>
                                    {/* Connector line */}
                                    {idx < STEPS.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${idx < step ? "bg-green-400" : "bg-gray-200"}`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {/* Step label for mobile */}
                    <p className="text-xs text-gray-400 mt-3 sm:hidden text-center font-medium">
                        Step {step + 1} of {STEPS.length} —{" "}
                        <span className="text-gray-700">
                            {currentStep.label}
                        </span>
                    </p>
                </div>
            </div>

            {/* ── Main Content ── */}
            <main ref={mainRef} className="flex-1 overflow-y-auto">
                {/* Section sticky header */}
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                            <currentStep.icon className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">
                                {currentStep.label}
                            </h2>
                            <p className="text-[11px] text-gray-400">
                                {currentErrors > 0 ? (
                                    <span className="text-red-500 font-medium">
                                        {currentErrors} error
                                        {currentErrors > 1 ? "s" : ""} — please
                                        fix before continuing
                                    </span>
                                ) : (
                                    `Step ${step + 1} of ${STEPS.length}`
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form fields */}
                <div className="p-6 md:p-8 flex flex-col gap-6 max-w-3xl mx-auto">
                    {/* ══ HERO ══ */}
                    {currentStep.id === "hero" && (
                        <>
                            <SectionCard
                                title="Page Heading"
                                icon={Type}
                                badge="Required"
                            >
                                <FormField
                                    label="Main Heading"
                                    required
                                    error={errors["hero.heading"]}
                                >
                                    <Input
                                        value={data.hero.heading}
                                        onChange={(v) =>
                                            update("hero", "heading", v)
                                        }
                                        placeholder="e.g. Your Complete Guide to Charter Bus Rental in Los Angeles"
                                        error={errors["hero.heading"]}
                                    />
                                </FormField>
                            </SectionCard>
                            <SectionCard
                                title="Hero Image"
                                icon={Image}
                                badge="Required"
                            >
                                <ImageUpload
                                    label="Hero Banner Image"
                                    hint="Upload a high-quality wide image. Minimum 1200×600px recommended."
                                    value={data.hero.heroImage}
                                    onChange={(v) =>
                                        update("hero", "heroImage", v)
                                    }
                                    error={errors["hero.heroImage"]}
                                    required
                                />
                            </SectionCard>
                            <SectionCard
                                title="Hero Description"
                                icon={AlignLeft}
                                badge="Required"
                            >
                                <FormField
                                    label="Description"
                                    required
                                    hint="Use the toolbar for bold, lists, links, and headings. Minimum 20 characters."
                                    error={errors["hero.description"]}
                                >
                                    <RichEditor
                                        value={data.hero.description}
                                        onChange={(v) =>
                                            update("hero", "description", v)
                                        }
                                        placeholder="Write your hero description here — what makes your service stand out…"
                                        minHeight="140px"
                                        error={errors["hero.description"]}
                                    />
                                </FormField>
                            </SectionCard>
                        </>
                    )}

                    {/* ══ SERVICES ══ */}
                    {currentStep.id === "services" && (
                        <>
                            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                                <Briefcase className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    The <strong>Services section</strong>{" "}
                                    displays a grid of cards — each with an
                                    icon, title, and short description.
                                </p>
                            </div>
                            <SectionCard
                                title="Section Header"
                                icon={Type}
                                badge="Required"
                            >
                                <FormField
                                    label="Section Heading"
                                    required
                                    hint="Main title shown above the service cards."
                                    error={errors["services.heading"]}
                                >
                                    <Input
                                        value={data.services.heading}
                                        onChange={(v) =>
                                            update("services", "heading", v)
                                        }
                                        placeholder="e.g. Our Charter Bus Services"
                                        error={errors["services.heading"]}
                                    />
                                </FormField>
                                <FormField
                                    label="Subheading"
                                    hint="Optional supporting line below the heading."
                                >
                                    <Input
                                        value={data.services.subheading}
                                        onChange={(v) =>
                                            update("services", "subheading", v)
                                        }
                                        placeholder="e.g. Reliable transportation for every occasion in Los Angeles"
                                    />
                                </FormField>
                            </SectionCard>
                            <SectionCard
                                title="Service Cards"
                                icon={Briefcase}
                                badge="Grid layout"
                            >
                                <p className="text-xs text-gray-400 -mt-2">
                                    Each card appears in the services grid. Pick
                                    an icon, add a title and short description.
                                    Link is optional.
                                </p>
                                {errors["services.items"] && (
                                    <div className="flex items-center gap-1.5 text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        <AlertCircle className="w-3 h-3" />{" "}
                                        {errors["services.items"]}
                                    </div>
                                )}
                                <CardList
                                    items={data.services.items}
                                    {...listOps("services", "items")}
                                    addLabel="Add Service Card"
                                    onAdd={() =>
                                        listOps("services", "items").onAdd({
                                            icon: "",
                                            title: "",
                                            description: "",
                                            link: "",
                                        })
                                    }
                                    errors={cardErrors("services", "items", [
                                        "title",
                                        "description",
                                        "link",
                                    ])}
                                    renderFields={(
                                        item,
                                        idx,
                                        set,
                                        rowErrors,
                                    ) => (
                                        <>
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                                                        Icon
                                                    </span>
                                                    <EmojiPicker
                                                        value={item.icon}
                                                        onChange={(v) =>
                                                            set("icon", v)
                                                        }
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <FormField
                                                        label="Service Title"
                                                        required
                                                        error={rowErrors.title}
                                                    >
                                                        <Input
                                                            value={item.title}
                                                            onChange={(v) =>
                                                                set("title", v)
                                                            }
                                                            placeholder="e.g. Corporate Shuttles"
                                                            error={
                                                                rowErrors.title
                                                            }
                                                        />
                                                    </FormField>
                                                </div>
                                            </div>
                                            <FormField
                                                label="Description"
                                                required
                                                hint="1–3 sentences. Minimum 10 characters."
                                                error={rowErrors.description}
                                            >
                                                <Textarea
                                                    value={item.description}
                                                    onChange={(v) =>
                                                        set("description", v)
                                                    }
                                                    placeholder="e.g. Comfortable, on-time shuttle solutions for conferences, team events, and daily commutes across LA."
                                                    rows={3}
                                                    error={
                                                        rowErrors.description
                                                    }
                                                />
                                            </FormField>
                                            <FormField
                                                label="Learn More Link"
                                                hint="Optional URL to a dedicated service page."
                                                error={rowErrors.link}
                                            >
                                                <Input
                                                    value={item.link}
                                                    onChange={(v) =>
                                                        set("link", v)
                                                    }
                                                    placeholder="https://example.com/corporate-shuttles"
                                                    type="url"
                                                    error={rowErrors.link}
                                                />
                                            </FormField>
                                            {(item.icon || item.title) && (
                                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                                                    <span className="text-2xl">
                                                        {item.icon || "📦"}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">
                                                            {item.title ||
                                                                "Untitled Service"}
                                                        </p>
                                                        {item.description && (
                                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="ml-auto text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                                                        Preview
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                />
                            </SectionCard>
                        </>
                    )}

                    {/* ══ WHY CHOOSE US ══ */}
                    {currentStep.id === "whyus" && (
                        <>
                            <SectionCard
                                title="Section Heading"
                                icon={Type}
                                badge="Required"
                            >
                                <FormField
                                    label="Heading"
                                    required
                                    error={errors["whyus.heading"]}
                                >
                                    <Input
                                        value={data.whyus.heading}
                                        onChange={(v) =>
                                            update("whyus", "heading", v)
                                        }
                                        placeholder="e.g. Why Los Angeles Groups Choose Us Over the Competition"
                                        error={errors["whyus.heading"]}
                                    />
                                </FormField>
                            </SectionCard>
                            <SectionCard
                                title="Main Body Content"
                                icon={AlignLeft}
                                badge="Required"
                            >
                                <FormField
                                    label="Body Text"
                                    required
                                    hint="Left-column content. Minimum 30 characters."
                                    error={errors["whyus.mainContent"]}
                                >
                                    <RichEditor
                                        value={data.whyus.mainContent}
                                        onChange={(v) =>
                                            update("whyus", "mainContent", v)
                                        }
                                        placeholder="Write detailed content about why customers should choose you…"
                                        minHeight="200px"
                                        error={errors["whyus.mainContent"]}
                                    />
                                </FormField>
                            </SectionCard>
                            <SectionCard
                                title="Reason Cards"
                                icon={Layers}
                                badge="Right Column"
                            >
                                <p className="text-xs text-gray-400 -mt-2">
                                    These appear as expandable cards. Each
                                    requires a title and body.
                                </p>
                                <CardList
                                    items={data.whyus.reasons}
                                    {...listOps("whyus", "reasons")}
                                    addLabel="Add Reason Card"
                                    onAdd={() =>
                                        listOps("whyus", "reasons").onAdd({
                                            title: "",
                                            body: "",
                                        })
                                    }
                                    errors={cardErrors("whyus", "reasons", [
                                        "title",
                                        "body",
                                    ])}
                                    renderFields={(
                                        item,
                                        idx,
                                        set,
                                        rowErrors,
                                    ) => (
                                        <>
                                            <FormField
                                                label="Card Title"
                                                required
                                                error={rowErrors.title}
                                            >
                                                <Input
                                                    value={item.title}
                                                    onChange={(v) =>
                                                        set("title", v)
                                                    }
                                                    placeholder="e.g. Local Knowledge, Global Standards"
                                                    error={rowErrors.title}
                                                />
                                            </FormField>
                                            <FormField
                                                label="Card Body"
                                                required
                                                error={rowErrors.body}
                                            >
                                                <Textarea
                                                    value={item.body}
                                                    onChange={(v) =>
                                                        set("body", v)
                                                    }
                                                    placeholder="Describe this reason in detail…"
                                                    rows={3}
                                                    error={rowErrors.body}
                                                />
                                            </FormField>
                                        </>
                                    )}
                                />
                            </SectionCard>
                        </>
                    )}

                    {/* ══ TESTIMONIALS ══ */}
                    {currentStep.id === "testimonials" && (
                        <SectionCard
                            title="Testimonial Cards"
                            icon={MessageSquare}
                            badge="3-column grid"
                        >
                            <p className="text-xs text-gray-400 -mt-2">
                                Each testimonial needs a name and review. Keep
                                reviews between 2–5 sentences.
                            </p>
                            <CardList
                                items={data.testimonials.items}
                                {...listOps("testimonials", "items")}
                                addLabel="Add Testimonial"
                                onAdd={() =>
                                    listOps("testimonials", "items").onAdd({
                                        name: "",
                                        role: "",
                                        text: "",
                                        rating: "5",
                                        photo: "",
                                    })
                                }
                                errors={cardErrors("testimonials", "items", [
                                    "name",
                                    "text",
                                ])}
                                renderFields={(item, idx, set, rowErrors) => (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                label="Client Name"
                                                required
                                                error={rowErrors.name}
                                            >
                                                <Input
                                                    value={item.name}
                                                    onChange={(v) =>
                                                        set("name", v)
                                                    }
                                                    placeholder="e.g. Sarah M."
                                                    error={rowErrors.name}
                                                />
                                            </FormField>
                                            <FormField label="Role / Company">
                                                <Input
                                                    value={item.role}
                                                    onChange={(v) =>
                                                        set("role", v)
                                                    }
                                                    placeholder="e.g. HR Director, Pacific Tech"
                                                />
                                            </FormField>
                                        </div>
                                        <FormField
                                            label="Review Text"
                                            required
                                            hint="2–4 sentences. Minimum 20 characters."
                                            error={rowErrors.text}
                                        >
                                            <Textarea
                                                value={item.text}
                                                onChange={(v) => set("text", v)}
                                                placeholder="Write the client's testimonial here…"
                                                rows={4}
                                                error={rowErrors.text}
                                            />
                                        </FormField>
                                        <FormField label="Star Rating">
                                            <div className="flex gap-2">
                                                {["1", "2", "3", "4", "5"].map(
                                                    (r) => (
                                                        <button
                                                            key={r}
                                                            type="button"
                                                            onClick={() =>
                                                                set("rating", r)
                                                            }
                                                            className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-0.5 ${item.rating === r ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-400 hover:border-orange-200"}`}
                                                        >
                                                            {r}
                                                            <Star className="w-2.5 h-2.5 fill-current" />
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </FormField>
                                        <ImageUpload
                                            label="Client Photo"
                                            hint="Optional. Square photo recommended (100×100px minimum)."
                                            value={item.photo || ""}
                                            onChange={(v) => set("photo", v)}
                                        />
                                    </>
                                )}
                            />
                        </SectionCard>
                    )}

                    {/* ══ FAQ ══ */}
                    {currentStep.id === "faq" && (
                        <>
                            {errors["faq.items"] && (
                                <div className="flex items-center gap-1.5 text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                                    {errors["faq.items"]}
                                </div>
                            )}
                            <SectionCard
                                title="FAQ Items"
                                icon={HelpCircle}
                                badge="Accordion"
                            >
                                <p className="text-xs text-gray-400 -mt-2">
                                    Each FAQ needs a question and a detailed
                                    answer (minimum 10 characters).
                                </p>
                                <CardList
                                    items={data.faq.items}
                                    {...listOps("faq", "items")}
                                    addLabel="Add FAQ"
                                    onAdd={() =>
                                        listOps("faq", "items").onAdd({
                                            q: "",
                                            a: "",
                                        })
                                    }
                                    errors={cardErrors("faq", "items", [
                                        "q",
                                        "a",
                                    ])}
                                    renderFields={(
                                        item,
                                        idx,
                                        set,
                                        rowErrors,
                                    ) => (
                                        <>
                                            <FormField
                                                label="Question"
                                                required
                                                error={rowErrors.q}
                                            >
                                                <Textarea
                                                    value={item.q}
                                                    onChange={(v) =>
                                                        set("q", v)
                                                    }
                                                    placeholder="e.g. How much does a charter bus rental cost in Los Angeles?"
                                                    rows={2}
                                                    error={rowErrors.q}
                                                />
                                            </FormField>
                                            <FormField
                                                label="Answer"
                                                required
                                                hint="Minimum 10 characters. Use rich text for bullets, links, and emphasis."
                                                error={rowErrors.a}
                                            >
                                                <RichEditor
                                                    value={item.a}
                                                    onChange={(v) =>
                                                        set("a", v)
                                                    }
                                                    placeholder="Write a detailed, helpful answer…"
                                                    minHeight="120px"
                                                    error={rowErrors.a}
                                                />
                                            </FormField>
                                        </>
                                    )}
                                />
                            </SectionCard>
                        </>
                    )}

                    {/* ── Bottom Navigation Bar ── */}
                    <div className="flex items-center justify-between pt-4 pb-10 mt-2 border-t border-gray-200">
                        {/* Back */}
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={isFirst}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        {/* Step counter */}
                        <span className="text-xs text-gray-400 font-medium">
                            {step + 1} / {STEPS.length}
                        </span>

                        {/* Next or Save */}
                        {isLast ? (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-sm ${isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:scale-[0.98]"}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Save & Continue
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={goNext}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-sm"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
