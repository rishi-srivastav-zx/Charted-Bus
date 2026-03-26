import apiClient from "./frontendmiddleware/appclient";

/* ==================== PUBLIC ROUTES ==================== */

export const getAllBuses = (params = {}) => {
    return apiClient.get("/buses", { params });
};

export const searchBuses = (params = {}) => {
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

/* ==================== OPERATOR / ADMIN ==================== */


const cleanBusData = (data) => ({
    ...data,
    pricing: {
        price: data.pricing?.price ?? 0,
        originalPrice: data.pricing?.originalPrice ?? 0,
        discountPercent: data.pricing?.discountPercent ?? 0,
        extraCharges: data.pricing?.extraCharges ?? 0,
        totalPrice: data.pricing?.totalPrice ?? 0,
        currency: data.pricing?.currency ?? "USD",
        billingCycle: data.pricing?.billingCycle ?? "per_day",
    },
    distancePolicy: {
        includedKm: data.distancePolicy?.includedKm ?? 0,
        extraKmPrice: data.distancePolicy?.extraKmPrice ?? 0,
    },
    seatCapacity: data.seatCapacity ? Number(data.seatCapacity) : 0,
    luggageCapacity: data.luggageCapacity ? Number(data.luggageCapacity) : 0,
    nightChargesExtra: data.nightChargesExtra
        ? Number(data.nightChargesExtra)
        : 0,
});

export const createBus = (data) => {
    return apiClient.post("/buses", data);
};

export const createBusWithHandler = async (data) => {
    const cleanedData = cleanBusData(data);
    const res = await apiClient.post("/buses", cleanedData);
    return res.data;
};

export const updateBus = (id, data) => {
    return apiClient.put(`/buses/${id}`, data);
};

export const updateBusWithHandler = async (id, data) => {
    const cleanedData = cleanBusData(data);
    const res = await apiClient.put(`/buses/${id}`, cleanedData);
    return res.data;
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

/* ==================== ADMIN ==================== */

export const uploadImage = (formData) => {
    return apiClient.post("/uploads/upload/image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllBusesAdmin = (params = {}) => {
    return apiClient.get("/buses/admin/all", { params });
};

export const verifyBus = (id) => {
    return apiClient.patch(`/buses/admin/${id}/verify`);
};

export const permanentDeleteBus = (id) => {
    return apiClient.delete(`/buses/admin/${id}/permanent`);
};
