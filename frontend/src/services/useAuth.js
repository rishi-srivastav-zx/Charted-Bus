import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./appclient.js";

export const useAuth = (onAuthChange) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const logout = useCallback(async () => {
        setIsLoading(true);

        try {
            await authApi.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            sessionStorage.clear();

            onAuthChange?.(null);
            router.push("/");
            router.refresh();
            setIsLoading(false);
        }
    }, [onAuthChange, router]);

    const login = useCallback(
        async (email, password) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await authApi.login(email, password);
                // authApi.login returns response.data (the body),
                // which is { success, data: { user, accessToken, refreshToken } }
                const { data } = response;

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("user", JSON.stringify(data.user));

                onAuthChange?.(data.user);
                return { success: true };
            } catch (err) {
                const message = err.response?.data?.message || "Login failed";
                setError(message);
                return { success: false, error: message };
            } finally {
                setIsLoading(false);
            }
        },
        [onAuthChange],
    );

    return {
        login,
        logout,
        isLoading,
        error,
        clearError: () => setError(null),
    };
};
