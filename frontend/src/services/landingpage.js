import { cache } from "react";
import apiClient from "./frontendmiddleware/appclient";
import axios from "axios";  

const ENDPOINT = "/charter-bus";


const serverSafeGet = async (url, options = {}) => {
    const config = {
        ...options,
        headers: {
            ...options.headers,
            ...(options.token && { Authorization: `Bearer ${options.token}` }),
        },
    };
    delete config.token;
    return apiClient.get(url, config);
};


const serverClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    headers: { "Content-Type": "application/json" },
});

const serverSafeGetWithParams = async (url, params = {}, token = null) => {
    const config = {
        params,
        ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    };
    return serverClient.get(url, config);
};  

const publicClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    headers: { "Content-Type": "application/json" },
});

/* ==================== PUBLIC ROUTES (No Auth) ==================== */

export const getPageBySlug = cache(async (slug) => {
    try {
        const res = await publicClient.get(
            `${ENDPOINT}/slug?slug=${encodeURIComponent(slug)}&_t=${Date.now()}`,
        );
        return res.data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
});

/* ==================== ADMIN ROUTES (Server Components) ==================== */

export const previewPageBySlug = cache(async (slug, accessToken) => {
    try {
        const res = await serverSafeGetWithParams(
            `${ENDPOINT}/preview`,
            { slug: encodeURIComponent(slug) },
            accessToken,
        );
        return res.data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
});


export const getAllPages = cache(async (params = {}, accessToken = null) => {
    try {
        const res = await serverSafeGetWithParams(
            ENDPOINT,
            params,
            accessToken,
        );
        return res.data?.data || [];
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
});

export const getPageById = cache(async (id, accessToken) => {
    try {
        const res = await serverSafeGet(`${ENDPOINT}/${id}`, {
            token: accessToken,
        });
        return res.data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
});

/* ==================== ADMIN MUTATIONS (Client Components) ==================== */

export const createPage = async (pageData) => {
    const res = await apiClient.post(ENDPOINT, pageData);
    return res.data.data;
};

export const updatePage = async (id, pageData) => {
    const res = await apiClient.put(`${ENDPOINT}/${id}`, pageData);
    return res.data.data;
};

export const deletePage = async (id) => {
    const res = await apiClient.delete(`${ENDPOINT}/${id}`);
    return res.data.message || "Deleted successfully";
};

export const publishPage = async (id, isPublished) => {
    const res = await apiClient.patch(`${ENDPOINT}/${id}/publish`, {
        isPublished,
    });
    return res.data.data;
};

/* ==================== ADDITIONAL ADMIN UTILITIES ==================== */

export const duplicatePage = async (id) => {
    const res = await apiClient.post(`${ENDPOINT}/${id}/duplicate`);
    return res.data.data;
};

export const updatePageSEO = async (id, seoData) => {
    const res = await apiClient.patch(`${ENDPOINT}/${id}/seo`, seoData);
    return res.data.data;
};

export const bulkDeletePages = async (ids) => {
    const res = await apiClient.post(`${ENDPOINT}/bulk-delete`, { ids });
    return res.data;
};

export const bulkPublishPages = async (ids, isPublished) => {
    const res = await apiClient.post(`${ENDPOINT}/bulk-publish`, {
        ids,
        isPublished,
    });
    return res.data;
};
