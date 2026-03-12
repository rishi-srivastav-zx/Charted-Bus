import apiClient from "./appclient";

export const saveBasicDetails = (data) => {
    return apiClient.post("/bookings/basic-details", data);
};

export const saveVehicleSelection = (data) => {
    return apiClient.post("/bookings/vehicle-selection", data);
};

export const saveContactDetails = (data) => {
    return apiClient.post("/bookings/contact", data);
};

export const confirmBooking = (data) => {
    return apiClient.post("/bookings/confirm", data);
};

export const getBooking = (bookingId) => {
    return apiClient.get(`/bookings/${bookingId}`);
};

export const getBookingByConfirmation = (confirmationNumber) => {
    return apiClient.get(`/bookings/confirmation/${confirmationNumber}`);
};

export const cancelBooking = (bookingId) => {
    return apiClient.patch(`/bookings/${bookingId}/cancel`);
};

export const getAllBookings = (params) => {
    return apiClient.get("/bookings", { params });
};
