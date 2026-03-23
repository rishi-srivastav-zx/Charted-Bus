import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Request interceptor: attach access token ──────────────────────────────────
apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ── Response interceptor: auto-refresh on 401 ────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue this request until token is refreshed
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

            if (!refreshToken) {
                // No refresh token — clear storage and let the 401 propagate
                if (typeof window !== "undefined") {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                }
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    "http://localhost:3001/api/auth/refresh",
                    { refreshToken },
                );
                const newAccessToken = res.data?.data?.accessToken;
                const newRefreshToken = res.data?.data?.refreshToken;

                if (typeof window !== "undefined") {
                    localStorage.setItem("accessToken", newAccessToken);
                    if (newRefreshToken) {
                        localStorage.setItem("refreshToken", newRefreshToken);
                    }
                }

                apiClient.defaults.headers.common["Authorization"] =
                    `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                if (typeof window !== "undefined") {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export const authApi = {
    login: async (email, password) => {
        const response = await apiClient.post("/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await apiClient.post("/auth/refresh", {
            refreshToken,
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data;
    },
};

export default apiClient;
