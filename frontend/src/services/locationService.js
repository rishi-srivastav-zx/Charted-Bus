export const searchLocations = async (query) => {
    const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY;
    const BASE_URL = "https://api.locationiq.com/v1/autocomplete";
    try {
        if (!query || query.length < 3) return [];

        if (!API_KEY) {
            console.error(
                "Location API Key is missing! Check your environment variables.",
            );
            return [];
        }

        const res = await fetch(
            `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&limit=5&dedupe=1&format=json`,
        );

        if (res.status === 404) {
            return [];
        }

        const data = await res.json();
        if (!res.ok) {
            console.error(
                "Location API Error Response:",
                res.status,
                res.statusText,
                data,
            );
            return [];
        }

        return data.map((item) => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
        }));
    } catch (error) {
        console.error("Location API Error:", error);
        return [];
    }
};
