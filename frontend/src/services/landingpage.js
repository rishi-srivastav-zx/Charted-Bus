import { cache } from "react";
import apiClient from "./appclient";

const ENDPOINT = "/charter-bus";

// Helper for auth headers
const authConfig = (accessToken) => ({
    headers: accessToken
        ? {
              Authorization: `Bearer ${accessToken}`,
          }
        : {},
    withCredentials: true,
});


// Public - cached
export const getPageBySlug = cache(async (slug) => {
    try {
        const res = await apiClient.get(
            `${ENDPOINT}/slug?slug=${encodeURIComponent(slug)}`,
        );
        return res.data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
});

// Admin preview - cached
export const previewPageBySlug = cache(async (slug, accessToken) => {
    try {
        const res = await apiClient.get(
            `${ENDPOINT}/preview?slug=${encodeURIComponent(slug)}`,
            authConfig(accessToken),
        );
        return res.data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
});

// Admin - cached (list rarely changes)
export const getAllPages = cache(async (accessToken) => {
    try {
        const res = await apiClient.get(ENDPOINT, authConfig(accessToken));
        return res.data.data || [];
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
});

// Admin - cached
export const getPageById = cache(async (id, accessToken) => {
    try {
        const res = await apiClient.get(
            `${ENDPOINT}/${id}`,
            authConfig(accessToken),
        );
        return res.data.data;
    } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
    }
});

// Admin - NO cache (mutations)
export const createPage = async (pageData, accessToken) => {
    try {
        const res = await apiClient.post(
            ENDPOINT,
            pageData,
            authConfig(accessToken),
        );
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const updatePage = async (id, pageData, accessToken) => {
    try {
        const res = await apiClient.put(
            `${ENDPOINT}/${id}`,
            pageData,
            authConfig(accessToken),
        );
        return res.data.data;
    } catch (error) {
        throw error;
    }
};

export const deletePage = async (id, accessToken) => {
    try {
        const res = await apiClient.delete(
            `${ENDPOINT}/${id}`,
            authConfig(accessToken),
        );
        return res.data.message || "Deleted successfully";
    } catch (error) {
        throw error;
    }
};

export const publishPage = async (id, isPublished, accessToken) => {
    try {
        const res = await apiClient.patch(
            `${ENDPOINT}/${id}/publish`,
            { isPublished },
            authConfig(accessToken),
        );
        return res.data.data;
    } catch (error) {
        throw error;
    }
};
