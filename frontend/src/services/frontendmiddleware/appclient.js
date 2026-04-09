import axios from "axios";
import { tokenInterceptor } from "./tokenInterceptor";

const isBrowser = () => typeof window !== "undefined";  

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
    paramsSerializer: (params) => {
        const qs = new URLSearchParams(params).toString();
        return qs;
    },
});

apiClient.interceptors.request.use((config) => {
    const token = tokenInterceptor.getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === "get" && isBrowser()) {
        config.params = { ...config.params, _t: Date.now() };
    }

    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) =>
        error ? prom.reject(error) : prom.resolve(token),
    );
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = isBrowser()
                ? localStorage.getItem("refreshToken")
                : null;

            if (!refreshToken) {
                tokenInterceptor.removeToken();
                if (isBrowser()) {
                    // ✅ ADD THIS CHECK
                    localStorage.removeItem("refreshToken");
                }
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    `${apiClient.defaults.baseURL}/auth/refresh`,
                    { refreshToken },
                );

                const { accessToken, refreshToken: newRefreshToken } =
                    res.data?.data || {};

                tokenInterceptor.setToken(accessToken);
                if (newRefreshToken && isBrowser()) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }

                apiClient.defaults.headers.common["Authorization"] =
                    `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenInterceptor.removeToken();
                if (isBrowser()) {
                    // ✅ ADD THIS CHECK
                    localStorage.removeItem("refreshToken");
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
        const response = await apiClient.post("/auth/login", { email, password });
        return response;
    },

    logout: async () => {
        if (isBrowser()) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
    },

    refreshToken: async () => {
        const refreshToken = isBrowser() ? localStorage.getItem("refreshToken") : null;
        const response = await apiClient.post("/auth/refresh", { refreshToken });
        
        if (isBrowser()) {
            localStorage.setItem("accessToken", response.data.data.accessToken);
            if (response.data.data.refreshToken) {
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
            }
        }
        return response.data;
    },
};

export default apiClient;
