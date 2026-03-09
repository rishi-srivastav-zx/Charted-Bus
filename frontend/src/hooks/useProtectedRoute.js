"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useProtectedRoute() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (!user || !token) {
            router.push("/");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    return { isLoading };
}
