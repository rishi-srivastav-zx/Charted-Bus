// ─── Date/Time Formatter ──────────────────────────────────────────────────────
export function formatDateTime(date) {
    if (!date) return "";
    const d = new Date(date);
    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        d.getDay()
    ];
    const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ][d.getMonth()];
    const day = d.getDate();
    const suffix =
        day === 1 || day === 21 || day === 31
            ? "st"
            : day === 2 || day === 22
              ? "nd"
              : day === 3 || day === 23
                ? "rd"
                : "th";
    const year = d.getFullYear();
    let hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${dayName}, ${month} ${day}${suffix}, ${year} ${hours}:${mins} ${ampm}`;
}

// ─── Form Validation ──────────────────────────────────────────────────────────
export function validateForm(tripType, formData) {
    const errors = [];

    if (tripType === "hourly") {
        if (!formData.duration) errors.push("Please select charter duration");
        if (!formData.orderType) errors.push("Please select event type");
        if (!formData.datetime)
            errors.push("Please select pick-up date and time");
        if (!formData.pickupAddress?.trim())
            errors.push("Please enter pick-up location");
        if (!formData.dropoffAddress?.trim())
            errors.push("Please enter drop-off location");
        if (!formData.passengers || formData.passengers < 1)
            errors.push("Please enter passenger count");
        if (formData.stops?.length > 0) {
            if (formData.stops.some((s) => !s?.trim()))
                errors.push(
                    "Please fill in all stop addresses or remove empty stops",
                );
        }
    } else if (tripType === "one-way") {
        if (!formData.orderType) errors.push("Please select event type");
        if (!formData.datetime)
            errors.push("Please select pick-up date and time");
        if (!formData.pickupAddress?.trim())
            errors.push("Please enter pick-up location");
        if (!formData.dropoffAddress?.trim())
            errors.push("Please enter drop-off location");
        if (!formData.passengers || formData.passengers < 1)
            errors.push("Please enter passenger count");
        if (formData.stops?.length > 0) {
            if (formData.stops.some((s) => !s?.trim()))
                errors.push(
                    "Please fill in all stop addresses or remove empty stops",
                );
        }
    } else if (tripType === "round-trip") {
        if (!formData.orderType) errors.push("Please select event type");
        if (!formData.outbound?.datetime)
            errors.push("Please select outbound date and time");
        if (!formData.outbound?.pickupAddress?.trim())
            errors.push("Please enter outbound pick-up location");
        if (!formData.outbound?.dropoffAddress?.trim())
            errors.push("Please enter outbound drop-off location");
        if (!formData.outbound?.passengers || formData.outbound.passengers < 1)
            errors.push("Please enter outbound passenger count");
        if (!formData.return?.datetime)
            errors.push("Please select return date and time");
        if (!formData.return?.pickupAddress?.trim())
            errors.push("Please enter return pick-up location");
        if (!formData.return?.dropoffAddress?.trim())
            errors.push("Please enter return drop-off location");
        if (!formData.return?.passengers || formData.return.passengers < 1)
            errors.push("Please enter return passenger count");
        if (formData.outbound?.stops?.some((s) => !s?.trim()))
            errors.push(
                "Please fill in all outbound stop addresses or remove empty stops",
            );
        if (formData.return?.stops?.some((s) => !s?.trim()))
            errors.push(
                "Please fill in all return stop addresses or remove empty stops",
            );
    }

    return errors;
}
