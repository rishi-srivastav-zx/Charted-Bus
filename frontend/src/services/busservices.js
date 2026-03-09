import apiClient from "./appclient";

/* PUBLIC ROUTES */

export const getAllBuses = (params) => {
    return apiClient.get("/buses", { params });
};

export const searchBuses = (params) => {
    return apiClient.get("/buses/search", { params });
};

export const getFilters = () => {
    return apiClient.get("/buses/filters");
};

export const getPopularBuses = () => {
    return apiClient.get("/buses/popular");
};

export const getBusById = (id) => {
    return apiClient.get(`/buses/${id}`);
};

export const getBusReviews = (id) => {
    return apiClient.get(`/buses/${id}/reviews`);
};

/* OPERATOR / ADMIN */

export const createBus = (data) => {
    return apiClient.post("/buses", data);
};

export const updateBus = (id, data) => {
    return apiClient.put(`/buses/${id}`, data);
};

export const deleteBus = (id) => {
    return apiClient.delete(`/buses/${id}`);
};

export const toggleAvailability = (id, data) => {
    return apiClient.patch(`/buses/${id}/availability`, data);
};

export const uploadBusImages = (id, formData) => {
    return apiClient.post(`/buses/${id}/images`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/* ADMIN */

export const uploadImage = (formData) => {
    return apiClient.post("/uploads/upload/image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllBusesAdmin = () => {
    return apiClient.get("/buses/admin/all");
};

export const verifyBus = (id) => {
    return apiClient.patch(`/buses/admin/${id}/verify`);
};

export const permanentDeleteBus = (id) => {
    return apiClient.delete(`/buses/admin/${id}/permanent`);
};
