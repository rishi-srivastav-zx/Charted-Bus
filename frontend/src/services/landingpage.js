import { cache } from "react";
import apiClient from "./appclient";

const ENDPOINT = "/charter-bus";

export const getPageBySlug = cache(async (slug) => {
    try {
        const res = await apiClient.get(
            `${ENDPOINT}/slug/${encodeURIComponent(slug)}`,
        );
        return res.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
});

export const getAllPages = cache(async () => {
    try {
        const res = await apiClient.get(ENDPOINT);
        return res.data.data || [];
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
});

export const getPageById = cache(async (id) => {
    const res = await apiClient.get(`${ENDPOINT}/${id}`);
    return res.data.data;
});

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
