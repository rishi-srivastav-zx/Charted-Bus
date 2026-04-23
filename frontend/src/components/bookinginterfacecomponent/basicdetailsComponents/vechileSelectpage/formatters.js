export const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Not set";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Invalid Date";
        return (
            d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }) +
            " • " +
            d.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
        );
    } catch (e) {
        return "Not set";
    }
};
