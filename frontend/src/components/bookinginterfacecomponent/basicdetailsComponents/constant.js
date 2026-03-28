// ─── Duration Options: 1h to 24h in 0.5 increments ───────────────────────────
export const DURATION_OPTIONS = [];
for (let h = 1; h <= 24; h += 0.5) {
    DURATION_OPTIONS.push({
        value: `${h}`,
        label: h === 1 ? "1 Hour" : h % 1 === 0 ? `${h} Hours` : `${h} Hours`,
    });
}

export const ORDER_OPTIONS = [
    { value: "corporate", label: "Corporate Transfer" },
    { value: "wedding", label: "Wedding" },
    { value: "conference", label: "Conference / Convention" },
    { value: "school-trip", label: "School Trip" },
    { value: "airport-transfer", label: "Airport Transfer" },
    { value: "city-tour", label: "City Tour" },
    { value: "sporting-event", label: "Sporting Event" },
    { value: "concert", label: "Concert / Music Event" },
    { value: "prom", label: "Prom / Homecoming" },
    { value: "bachelor", label: "Bachelor / Bachelorette" },
    { value: "church", label: "Church / Religious Group" },
    { value: "military", label: "Military / Government" },
    { value: "medical", label: "Medical Transport" },
    { value: "casino", label: "Casino Trip" },
    { value: "winery", label: "Winery / Brewery Tour" },
    { value: "other", label: "Other" },
];

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const TRIP_TYPES = [
    { id: "hourly", label: "Hourly" },
    { id: "one-way", label: "One Way" },
    { id: "round-trip", label: "Round Trip" },
];

export const TRUST_ITEMS = [
    { text: "Top Rated Fleet", icon: "check" },
    { text: "Fully Insured", icon: "shield" },
    { text: "24/7 Support", icon: "headphones" },
];

export const STATS = [
    { value: "500+", label: "Vehicles" },
    { value: "50k+", label: "Trips Done" },
    { value: "98%", label: "Satisfaction" },
    { value: "24/7", label: "Support" },
];

export const HOURLY_INCLUSIONS = [
    "Professional licensed & insured driver",
    "Complimentary WiFi on board",
    "Climate-controlled cabin",
    "PA system & aux input",
    "ADA accessible vehicles available",
    "Real-time GPS tracking",
    "Free cancellation up to 48h before",
];

export const SERVICES = [
    { icon: "🏢", label: "Corporate" },
    { icon: "💍", label: "Wedding" },
    { icon: "✈️", label: "Airport" },
    { icon: "🏟️", label: "Sporting Event" },
    { icon: "🎓", label: "School Trip" },
    { icon: "🎵", label: "Concert" },
    { icon: "🍷", label: "Wine Tour" },
    { icon: "🎰", label: "Casino" },
];
