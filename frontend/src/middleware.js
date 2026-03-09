import { NextResponse } from "next/server";

export function middleware(request) {
    const requestHeaders = new Headers(request.headers);

    // Get IP from various headers (Vercel, AWS, etc.)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0] : realIp || "unknown";

    // Add IP to headers so server components can access it
    requestHeaders.set("x-user-ip", ip);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ["/bookingform/:path*"],
};
