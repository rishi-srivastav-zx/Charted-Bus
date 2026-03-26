const isBrowser = () => typeof window !== "undefined";

export const tokenInterceptor = {
    getToken: () => {
        return isBrowser() ? localStorage.getItem("accessToken") : null;
    },
    setToken: (token) => {
        if (isBrowser()) {
            localStorage.setItem("accessToken", token);
        }
    },
    removeToken: () => {
        if (isBrowser()) {
            localStorage.removeItem("accessToken");
        }
    },
    getAuthConfig: (customToken = null) => {
        const token = customToken || tokenInterceptor.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
};
