import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Filter,
    MoreVertical,
    Plus,
    Edit2,
    Copy,
    Trash2,
    ChevronDown,
    X,
    Calendar,
    Globe,
    FileText,
    Layout,
    ExternalLink,
    Sparkles,
    FolderOpen,
    Eye,
    EyeOff,
} from "lucide-react";
import CharterBusForm from "./landingpageform/mainform";
import LandingPageEditor from "./seoeditor/Seoformpage";
import { createPortal } from "react-dom";
import {
    createPage,
    getAllPages,
    updatePage,
    deletePage,
    getPageById,
    publishPage,
} from "../../services/landingpage";
import toast from "react-hot-toast";
import Link from "next/link";

const PER_PAGE = 6;

const StatusBadge = ({ status }) => {
    const isPublished = status === "Published";
    return (
        <span
            className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            ${
                isPublished
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
            }
        `}
        >
            <span
                className={`
                w-1.5 h-1.5 rounded-full 
                ${isPublished ? "bg-green-500 animate-pulse" : "bg-amber-500"}
            `}
            />
            {status}
        </span>
    );
};

const PageIcon = ({ country, city }) => {
    const seed = (country + city).length;
    const icons = [Globe, FileText, Layout, Sparkles];
    const Icon = icons[seed % icons.length];

    const colors = [
        { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
        {
            bg: "bg-purple-50",
            text: "text-purple-600",
            border: "border-purple-200",
        },
        {
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            border: "border-emerald-200",
        },
        {
            bg: "bg-orange-50",
            text: "text-orange-600",
            border: "border-orange-200",
        },
        { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
        { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
    ];
    const color = colors[seed % colors.length];

    return (
        <div
            className={`w-10 h-10 rounded-xl ${color.bg} ${color.border} border flex items-center justify-center flex-shrink-0`}
        >
            <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
    );
};

const Modal = ({ mode, page, onClose, onSave, onSuccess }) => {
    const [formStep, setFormStep] = useState("main");
    const [mainData, setMainData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadFullPage = async () => {
            if (mode === "edit" && page) {
                try {
                    const fullPage = await getPageById(page._id || page.id);
                    if (!isMounted) return;

                    setMainData({
                        slug: fullPage.slug || "",
                        country: fullPage.country || "",
                        city: fullPage.city || "",
                        hero: {
                            heading:
                                fullPage.hero?.heading ||
                                fullPage.main?.title_line1 ||
                                fullPage.main?.heading ||
                                "",
                            subtext:
                                fullPage.hero?.subtext ||
                                fullPage.main?.description ||
                                fullPage.main?.subtext ||
                                "",
                            heroImage:
                                fullPage.hero?.heroImage ||
                                fullPage.hero?.image ||
                                fullPage.main?.heroImage ||
                                "",
                            description: fullPage.hero?.description || "",
                        },
                        seo: {
                            meta_title: fullPage.seo?.meta_title || "",
                            meta_description:
                                fullPage.seo?.meta_description || "",
                            focus_keyword: fullPage.seo?.focus_keyword || "",
                            canonical_url: fullPage.seo?.canonical_url || "",
                            og_title: fullPage.seo?.og_title || "",
                            og_description: fullPage.seo?.og_description || "",
                            og_image: fullPage.seo?.og_image || "",
                        },
                        services: {
                            heading: fullPage.services?.heading || "",
                            subheading: fullPage.services?.subheading || "",
                            items:
                                fullPage.services?.items?.map((item) => ({
                                    icon: item.icon || "",
                                    title: item.title || "",
                                    description: item.description || "",
                                    link: item.link || "",
                                })) || [],
                        },
                        whyus: {
                            heading:
                                fullPage.whyus?.heading ||
                                fullPage.guide?.heading ||
                                "",
                            subtext:
                                fullPage.whyus?.subtext ||
                                fullPage.guide?.subtext ||
                                "",
                            mainContent:
                                fullPage.whyus?.mainContent ||
                                fullPage.guide?.bodyHtml ||
                                "",
                            reasons:
                                fullPage.whyus?.reasons?.map((r) => ({
                                    title: r.title || "",
                                    body: r.body || "",
                                })) ||
                                fullPage.guide?.tripTypes?.map((t) => ({
                                    title: t.title || "",
                                    body: t.desc || t.body || "",
                                })) ||
                                [],
                        },
                        coverage: {
                            heading: fullPage.coverage?.heading || "",
                            subtext: fullPage.coverage?.subtext || "",
                            callout: fullPage.coverage?.callout || "",
                            regions:
                                fullPage.coverage?.regions?.map((r) => ({
                                    name: r.name || "",
                                    cities: r.cities || [],
                                })) || [],
                        },
                        testimonials: {
                            items:
                                fullPage.testimonials?.items?.map((t) => ({
                                    name: t.name || "",
                                    role: t.role || "",
                                    text: t.text || "",
                                    rating: t.rating || 5,
                                    photo: t.photo || "",
                                })) || [],
                        },
                        faq: {
                            tag: fullPage.faq?.tag || "",
                            heading: fullPage.faq?.heading || "",
                            subtext: fullPage.faq?.subtext || "",
                            items:
                                fullPage.faq?.items?.map((item) => ({
                                    q: item.question || item.q || "",
                                    a: item.answer || item.a || "",
                                })) || [],
                        },
                        main: fullPage.main || {
                            title_line1: "",
                            description: "",
                        },
                    });
                    setFormStep("main");
                } catch (err) {
                    console.error("Failed to load full page details:", err);
                    toast.error("Failed to load complete page details.");
                    if (isMounted) onClose();
                }
            }
        };

        loadFullPage();

        return () => {
            isMounted = false;
        };
    }, [mode, page, onClose]);

    useEffect(() => {
        const handleEscape = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleMainSave = (data) => {
        setMainData((prev) => ({ ...prev, ...data }));
        setFormStep("seo");
    };

    const handleSeoSave = async (seoData) => {
        try {
            setLoading(true);
            setError(null);
            const finalData = { ...mainData, ...seoData };

            if (mode === "edit" && page?._id) {
                await updatePage(page._id, finalData);
                toast.success("Page updated successfully!");
            } else {
                await createPage(finalData);
                toast.success("Page created successfully!");
            }

            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Failed to save page. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-2 text-sm font-semibold ${formStep === "main" ? "text-blue-600" : "text-green-600"}`}
                        >
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${formStep === "main" ? "bg-blue-600 text-white" : "bg-green-100 text-green-600"}`}
                            >
                                {formStep === "main" ? "1" : "✓"}
                            </span>
                            Page Content
                        </div>
                        <div className="w-8 h-px bg-gray-200" />
                        <div
                            className={`flex items-center gap-2 text-sm font-semibold ${formStep === "seo" ? "text-blue-600" : "text-gray-400"}`}
                        >
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${formStep === "seo" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                            >
                                2
                            </span>
                            SEO Settings
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-red-700 text-sm font-medium">
                                Submission Failed
                            </p>
                            <p className="text-red-600 text-xs mt-0.5">
                                {error}
                            </p>
                            <button
                                onClick={() => setError(null)}
                                className="text-xs text-red-500 hover:text-red-700 mt-2 underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {formStep === "main" && (mode !== "edit" || mainData) && (
                    <CharterBusForm
                        initialData={mainData || page || {}}
                        onSave={handleMainSave}
                    />
                )}

                {formStep === "main" && mode === "edit" && !mainData && (
                    <div className="p-8 text-center text-gray-500">
                        Loading...
                    </div>
                )}

                {formStep === "seo" && (
                    <div>
                        <LandingPageEditor
                            initialData={mainData || page}
                            onSave={handleSeoSave}
                            isLoading={loading}
                        />
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => setFormStep("main")}
                                className="text-sm text-gray-500 hover:text-gray-700 font-medium underline underline-offset-2"
                            >
                                ← Back to Page Content
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
};

const DeleteConfirmModal = ({ page, onClose, onConfirm }) => (
    <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete Page
                </h3>
                <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{page.title}"? This action
                    cannot be undone.
                </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-200 transition-all"
                >
                    Delete Page
                </button>
            </div>
        </div>
    </div>
);

export default function LandingPages() {
    const router = useRouter();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [menuId, setMenuId] = useState(null);
    const [nextId, setNextId] = useState(1);

    const menuRef = useRef(null);

    useEffect(() => {
        async function fetchPages() {
            try {
                setLoading(true);
                const data = await getAllPages();
                if (Array.isArray(data)) {
                    setPages(data);
                    setNextId(data.length + 1);
                }
            } catch (error) {
                console.error("Error fetching pages:", error);
                toast.error("Failed to load pages");
            } finally {
                setLoading(false);
            }
        }
        fetchPages();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = useMemo(() => {
        return pages.filter((p) => {
            const title =
                p.main?.title_line1 ||
                p.hero?.heading ||
                p.country ||
                p.city ||
                "";
            const slug = p.slug || "";
            const matchSearch =
                title.toLowerCase().includes(search.toLowerCase()) ||
                slug.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                statusFilter === "All" || p.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [pages, search, statusFilter]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE,
    );

    const stats = useMemo(() => {
        const published = pages.filter((p) => p.status === "Published").length;
        const drafts = pages.filter((p) => p.status === "Draft").length;
        return { total: pages.length, published, drafts };
    }, [pages]);

    const handleCreate = (form) => {
        const icons = ["🚌", "🎯", "🌟", "🔥", "💫", "🎊"];
        const colors = [
            { bg: "bg-indigo-50", c: "text-indigo-600" },
            { bg: "bg-rose-50", c: "text-rose-600" },
            { bg: "bg-sky-50", c: "text-sky-600" },
        ];
        const col = colors[nextId % colors.length];

        setPages((p) => [
            ...p,
            {
                id: nextId,
                icon: icons[nextId % icons.length],
                iconBg: col.bg,
                iconColor: col.c,
                title: form.title,
                subtitle: form.subtitle,
                slug: form.slug.startsWith("/") ? form.slug : `/${form.slug}`,
                status: form.status,
                modified: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
            },
        ]);
        setNextId((n) => n + 1);
        setCurrentPage(1);
    };

    const handleRefreshPages = async () => {
        try {
            const data = await getAllPages();
            if (Array.isArray(data)) setPages(data);
        } catch (error) {
            console.error("Error refreshing pages:", error);
        }
    };

    const handleEdit = async (form) => {
        try {
            const pageId = form._id || form.id;
            if (pageId) {
                await updatePage(pageId, form);
                toast.success("Page updated successfully!");
                handleRefreshPages();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update page",
            );
        }
    };

    const handleDelete = async (pageItem) => {
        try {
            const pageId = pageItem._id || pageItem.id;
            if (pageId) {
                await deletePage(pageId);
                toast.success("Page deleted successfully!");
            }
            setPages((p) => p.filter((pg) => (pg._id || pg.id) !== pageId));
            setDeleteModal(null);
            setMenuId(null);
            if (paginated.length === 1 && currentPage > 1) {
                setCurrentPage((c) => c - 1);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete page",
            );
        }
    };

    const handlePublish = async (pageItem) => {
        try {
            const pageId = pageItem._id || pageItem.id;
            const isCurrentlyPublished = pageItem.status === "Published";
            const newStatus = !isCurrentlyPublished;

            if (pageId) {
                await publishPage(pageId, newStatus);
            }
            
            setPages((p) =>
                p.map((pg) =>
                    (pg._id || pg.id) === pageId
                        ? { ...pg, status: newStatus ? "Published" : "Draft" }
                        : pg
                )
            );
            
            toast.success(newStatus ? "Page published successfully!" : "Page unpublished");
            setMenuId(null);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update page status",
            );
        }
    };

    const handleDuplicate = (page) => {
        const icons = ["🚌", "🎯", "🌟"];
        setPages((p) => [
            ...p,
            {
                ...page,
                id: nextId,
                icon: icons[nextId % icons.length],
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                title: page.title + " (Copy)",
                slug: page.slug + "-copy",
                status: "Draft",
                modified: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
            },
        ]);
        setNextId((n) => n + 1);
        setMenuId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            {/* Stats Cards - Makes it look less empty */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Pages
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <FolderOpen className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Published
                            </p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {stats.published}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <Globe className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Drafts
                            </p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">
                                {stats.drafts}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search pages by title or slug..."
                            className="w-full !pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="appearance-none pl-4 !pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                    <button
                        onClick={() => setModal({ mode: "create" })}
                        className="inline-flex items-center ml-auto gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-blue-200 transition-all hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Create Page
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 text-sm">
                                Loading pages...
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Page Details
                                    </th>
                                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        URL
                                    </th>
                                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Modified
                                    </th>
                                    <th className="text-right py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <FolderOpen className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-900 font-medium">
                                                    No pages found
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    Get started by creating your
                                                    first landing page
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setSearch("");
                                                        setStatusFilter("All");
                                                    }}
                                                    className="text-blue-600 text-sm font-medium hover:underline"
                                                >
                                                    Clear filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((page) => {
                                        const pageId = page._id || page.id;
                                        const pageTitle =
                                            page.main?.title_line1 ||
                                            page.hero?.heading ||
                                            `${page.country} - ${page.city}` ||
                                            "Untitled";
                                        const pageSubtitle =
                                            page.seo?.meta_description ||
                                            page.slug ||
                                            "";
                                        const pageSlug = page.slug || "";
                                        const pageModified =
                                            page.updatedAt || page.createdAt;
                                        const pageStatus =
                                            page.status || "Draft";

                                        return (
                                            <tr
                                                key={pageId}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <PageIcon
                                                            country={
                                                                page.country ||
                                                                ""
                                                            }
                                                            city={
                                                                page.city || ""
                                                            }
                                                        />
                                                        <div className="min-w-0">
                                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                                {pageTitle}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                                                                {pageSubtitle}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Link
                                                        href={`/bookingform/${pageSlug}`} target="_blank"   
                                                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
                                                    >
                                                        <span className="truncate max-w-[150px]">
                                                            /{pageSlug}
                                                        </span>
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge
                                                        status={pageStatus}
                                                    />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {pageModified
                                                            ? new Date(
                                                                  pageModified,
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setModal({
                                                                    mode: "edit",
                                                                    page,
                                                                })
                                                            }
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <div
                                                            className="relative"
                                                            ref={
                                                                menuId ===
                                                                pageId
                                                                    ? menuRef
                                                                    : null
                                                            }
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    setMenuId(
                                                                        menuId ===
                                                                            pageId
                                                                            ? null
                                                                            : pageId,
                                                                    )
                                                                }
                                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>

                                                            {menuId ===
                                                                pageId && (
                                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-xl shadow-black/5 py-1 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                                                                    <button
                                                                        onClick={() => {
                                                                            setModal(
                                                                                {
                                                                                    mode: "edit",
                                                                                    page,
                                                                                },
                                                                            );
                                                                            setMenuId(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />{" "}
                                                                        Edit
                                                                        Page
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDuplicate(
                                                                                page,
                                                                            )
                                                                        }
                                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                                    >
                                                                        <Copy className="w-4 h-4" />{" "}
                                                                        Duplicate
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            handlePublish(page);
                                                                        }}
                                                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                                                            page.status === "Published"
                                                                                ? "text-amber-600 hover:bg-amber-50"
                                                                                : "text-green-600 hover:bg-green-50"
                                                                        }`}
                                                                    >
                                                                        {page.status === "Published" ? (
                                                                            <>
                                                                                <EyeOff className="w-4 h-4" /> Unpublish
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Eye className="w-4 h-4" /> Publish
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                    <a
                                                                        href={`/bookingform/${page.country?.toLowerCase().replace(/\s+/g, "-")}/${page.city?.toLowerCase().replace(/\s+/g, "-")}`}
                                                                        target="_blank"
                                                                        className="w-full px-4 py-2.5 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-3 transition-colors"
                                                                    >
                                                                        <ExternalLink className="w-4 h-4" /> Preview
                                                                    </a>
                                                                    <div className="h-px bg-gray-100 my-1" />
                                                                    <button
                                                                        onClick={() => {
                                                                            setDeleteModal(
                                                                                page,
                                                                            );
                                                                            setMenuId(
                                                                                null,
                                                                            );
                                                                        }}
                                                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />{" "}
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {filtered.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/30">
                        <p className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-medium text-gray-900">
                                {(currentPage - 1) * PER_PAGE + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium text-gray-900">
                                {Math.min(
                                    currentPage * PER_PAGE,
                                    filtered.length,
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-gray-900">
                                {filtered.length}
                            </span>{" "}
                            results
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                                            currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {modal?.mode === "create" && (
                <Modal
                    mode="create"
                    onClose={() => setModal(null)}
                    onSave={handleCreate}
                    onSuccess={handleRefreshPages}
                />
            )}
            {modal?.mode === "edit" && (
                <Modal
                    mode="edit"
                    page={modal.page}
                    onClose={() => setModal(null)}
                    onSave={handleEdit}
                    onSuccess={handleRefreshPages}
                />
            )}
            {deleteModal && (
                <DeleteConfirmModal
                    page={deleteModal}
                    onClose={() => setDeleteModal(null)}
                    onConfirm={() => handleDelete(deleteModal)}
                />
            )}
        </div>
    );
}
