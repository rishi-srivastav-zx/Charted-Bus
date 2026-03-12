import apiClient from "./appclient";

const ENDPOINT = "/charter-bus";    


export const createPage = async (pageData) => {
    const res = await apiClient.post(ENDPOINT, pageData);
    return res.data.data;
};

export const getAllPages = async () => {
    const res = await apiClient.get(ENDPOINT);
    return res.data.data;
};

export const getPageById = async (id) => {
    const res = await apiClient.get(`${ENDPOINT}/${id}`);
    return res.data.data;
};

export const getPageBySlug = async (slug) => {
    const res = await apiClient.get(
        `${ENDPOINT}/slug/${encodeURIComponent(slug)}`,
    );
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
