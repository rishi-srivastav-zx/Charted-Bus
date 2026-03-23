// Local cache to avoid re-fetching on every keystroke
let cachedCountries = null;

// 🌍 Get Countries
export const getCountries = async (name) => {
    try {
        if (!cachedCountries) {
            const res = await fetch("https://countriesnow.space/api/v0.1/countries/iso");
            const data = await res.json();
            cachedCountries = data.data || [];
        }

        const query = name ? name.toLowerCase() : "";
        
        return cachedCountries
            .filter(c => c.name.toLowerCase().includes(query))
            .map(c => ({ name: c.name, code: c.Iso2 }));
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
};

// 🏙️ Get Cities
export const getCities = async (countryName) => {
    if (!countryName) return [];

    try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: countryName })
        });

        const data = await res.json();
        if (data.error) return [];
        return (data.data || []).map(city => ({ id: city, name: city }));
    } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
    }
};
