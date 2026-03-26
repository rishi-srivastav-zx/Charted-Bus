import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./frontendmiddleware/appclient";


const setCookie = (name, value, days = 7) => {
    if (typeof window === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name) => {
    if (typeof window === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

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

            deleteCookie("accessToken");
            deleteCookie("refreshToken");

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
                const { user, accessToken, refreshToken } = response.data.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));
                setCookie("accessToken", accessToken);
                setCookie("refreshToken", refreshToken);

                onAuthChange?.(user);
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
