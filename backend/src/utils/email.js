import nodemailer from "nodemailer";

const createTransporter = () => {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        console.warn(
            "SMTP credentials not configured. Emails will not be sent.",
        );
        return null;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 10000,
    });

    transporter.verify((error) => {
        if (error) {
            console.error("SMTP Connection Error:", error.message);
            if (port === 587) {
                console.warn(
                    "Tip: Many cloud providers block port 587. Try port 465 with SSL.",
                );
            }
        } else {
            console.log("SMTP is connected and ready.");
        }
    });

    return transporter;
};

const transporter = createTransporter();

const sendEmail = async (options) => {
    if (!transporter) {
        console.log("Email (mock):", {
            to: options.email,
            subject: options.subject,
        });
        return { mock: true };
    }
    try {
        const info = await transporter.sendMail({
            from: `"CharterBus" <${process.env.FROM_EMAIL || "support@charterbus.com"}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Email error:", error.message);
        throw error;
    }
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dt) => {
    if (!dt) return "Not specified";
    return new Date(dt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatTime = (dt) => {
    if (!dt) return "Not specified";
    return new Date(dt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const tripTypeLabel = (booking) => {
    if (booking.tripType === "round-trip") return "Round Trip";
    if (booking.tripType === "hourly") return "Hourly Charter";
    return "One Way";
};

// ─── Shared CSS reset ────────────────────────────────────────────────────────
const BASE_RESET = `
    body  { margin:0; padding:0; background:#EBEBEB; font-family:'Georgia','Times New Roman',Times,serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse; mso-table-lspace:0; mso-table-rspace:0; }
    a     { color:inherit; }
    img   { border:0; display:block; }
    @media (max-width:600px) {
        .outer   { padding:12px 6px !important; }
        .shell   { border-radius:0 !important; }
        .hd-pad  { padding:32px 20px !important; }
        .bd-pad  { padding:28px 20px !important; }
        .ft-pad  { padding:24px 20px !important; }
        .two-col { display:block !important; }
        .half    { display:block !important; width:100% !important; border-right:none !important; border-bottom:1px solid #E5E7EB !important; }
        .half:last-child { border-bottom:none !important; }
        .btn-row a { display:block !important; margin:0 0 10px !important; }
    }
`;

// ─── Shared footer ───────────────────────────────────────────────────────────
const sharedFooter = (email = "") => `
<tr>
    <td class="ft-pad" style="
        background:#111111;
        padding:40px 48px;
        text-align:center;
        border-radius:0 0 4px 4px;
    ">
        <p style="
            margin:0 0 6px;
            font-family:'Helvetica Neue',Arial,sans-serif;
            font-size:16px;
            font-weight:700;
            letter-spacing:4px;
            text-transform:uppercase;
            color:#FFFFFF;
        ">CharterBus</p>
        <p style="
            margin:0 0 20px;
            font-family:'Helvetica Neue',Arial,sans-serif;
            font-size:11px;
            letter-spacing:2px;
            text-transform:uppercase;
            color:#666666;
        ">Licensed &nbsp;&middot;&nbsp; Insured &nbsp;&middot;&nbsp; DOT Certified</p>
        <div style="width:40px;height:1px;background:#333333;margin:0 auto 20px;"></div>
        <p style="
            margin:0;
            font-family:'Helvetica Neue',Arial,sans-serif;
            font-size:11px;
            color:#555555;
            line-height:2;
        ">
            &copy; ${new Date().getFullYear()} CharterBus Inc.
            &nbsp;&nbsp;
            <a href="https://charterbus.com/terms"   style="color:#888888;text-decoration:none;letter-spacing:1px;">Terms</a>
            &nbsp;&nbsp;
            <a href="https://charterbus.com/privacy" style="color:#888888;text-decoration:none;letter-spacing:1px;">Privacy</a>
            ${email ? `<br><span style="color:#444444;">${email}</span>` : ""}
        </p>
    </td>
</tr>`;

// ────────────────────────────────────────────────────────────────────────────
// 1.  BOOKING CONFIRMATION (Customer-facing)
// ────────────────────────────────────────────────────────────────────────────
export const sendBookingConfirmationEmail = async (booking) => {
    if (!booking.contact?.email) {
        console.warn("No email address provided for booking confirmation");
        return;
    }

    const isRoundTrip = booking.tripType === "round-trip";
    const stops = booking.stops?.filter(Boolean) || [];
    const returnStops = booking.returnStops?.filter(Boolean) || [];
    const firstName = booking.contact?.firstName || "there";

    // ── Reusable detail row ──────────────────────────────────────────────────
    const detailRow = (label, value, last = false) => `
        <tr>
            <td style="
                padding:14px 0;
                ${last ? "" : "border-bottom:1px solid #F0F0F0;"}
                vertical-align:top;
                width:42%;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                font-weight:600;
                letter-spacing:1.5px;
                text-transform:uppercase;
                color:#999999;
            ">${label}</td>
            <td style="
                padding:14px 0 14px 20px;
                ${last ? "" : "border-bottom:1px solid #F0F0F0;"}
                vertical-align:top;
                font-family:'Georgia','Times New Roman',serif;
                font-size:14px;
                color:#111111;
                line-height:1.6;
            ">${value}</td>
        </tr>`;

    // ── Address block ────────────────────────────────────────────────────────
    const addressBlock = (topLabel, topAddr, botLabel, botAddr) => `
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding-bottom:16px;">
                    <p style="
                        margin:0 0 6px;
                        font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:10px;
                        font-weight:700;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#AAAAAA;
                    ">${topLabel}</p>
                    <p style="
                        margin:0;
                        font-family:'Georgia',serif;
                        font-size:14px;
                        color:#111111;
                        line-height:1.6;
                    ">${topAddr || "Not specified"}</p>
                </td>
            </tr>
            <tr>
                <td style="
                    padding:0 0 0 20px;
                    border-left:2px solid #D4AF37;
                ">
                    <p style="
                        margin:0 0 6px;
                        font-family:'Helvetica Neue',Arial,sans-serif;
                        font-size:10px;
                        font-weight:700;
                        letter-spacing:2px;
                        text-transform:uppercase;
                        color:#AAAAAA;
                    ">${botLabel}</p>
                    <p style="
                        margin:0;
                        font-family:'Georgia',serif;
                        font-size:14px;
                        color:#111111;
                        line-height:1.6;
                    ">${botAddr || "Not specified"}</p>
                </td>
            </tr>
        </table>`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Reservation Confirmed — ${booking.confirmationNumber}</title>
    <style>${BASE_RESET}</style>
</head>
<body>

<table width="100%" cellpadding="0" cellspacing="0" class="outer" style="background:#EBEBEB;padding:36px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" class="shell" style="max-width:560px;border-radius:4px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">

    <!-- HEADER -->
    <tr>
        <td class="hd-pad" style="background:#111111;padding:50px 48px 40px;text-align:center;">
            <p style="
                margin:0 0 4px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                font-weight:700;
                letter-spacing:5px;
                text-transform:uppercase;
                color:#D4AF37;
            ">CharterBus</p>
            <h1 style="
                margin:0 0 20px;
                font-family:'Georgia','Times New Roman',serif;
                font-size:34px;
                font-weight:400;
                color:#FFFFFF;
                letter-spacing:-0.5px;
                line-height:1.2;
            ">Reservation<br>Confirmed</h1>
            <div style="width:40px;height:2px;background:#D4AF37;margin:0 auto 24px;"></div>
            <p style="
                margin:0;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#666666;
            ">Reference No.</p>
            <p style="
                margin:8px 0 0;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:20px;
                font-weight:700;
                letter-spacing:4px;
                color:#D4AF37;
            ">${booking.confirmationNumber}</p>
        </td>
    </tr>

    <!-- STATUS BANNER -->
    <tr>
        <td style="background:#D4AF37;padding:14px 48px;text-align:center;">
            <p style="
                margin:0;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                font-weight:700;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#111111;
            ">Your charter is confirmed and pending payment</p>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td class="bd-pad" style="background:#FFFFFF;padding:48px;">

            <!-- Greeting -->
            <p style="
                margin:0 0 32px;
                font-family:'Georgia',serif;
                font-size:18px;
                color:#111111;
                line-height:1.6;
            ">Dear ${firstName},</p>
            <p style="
                margin:0 0 40px;
                font-family:'Georgia',serif;
                font-size:15px;
                color:#444444;
                line-height:1.8;
            ">Thank you for choosing CharterBus. We are pleased to confirm your reservation. The details of your journey are outlined below.</p>

            <!-- Divider label -->
            <p style="
                margin:0 0 20px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:10px;
                font-weight:700;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#999999;
            ">Journey Details</p>
            <div style="width:100%;height:1px;background:#111111;margin-bottom:4px;"></div>
            <div style="width:40px;height:2px;background:#D4AF37;margin-bottom:24px;"></div>

            <table width="100%" cellpadding="0" cellspacing="0">
                ${detailRow("Trip Type", tripTypeLabel(booking))}
                ${detailRow("Date", formatDate(booking.datetime))}
                ${detailRow("Departure", formatTime(booking.datetime))}
                ${detailRow("Passengers", `${booking.passengers} ${booking.passengers > 1 ? "passengers" : "passenger"}`)}
                ${booking.duration ? detailRow("Duration", `${booking.duration} hours`) : ""}
            </table>

            <!-- Route Section -->
            <p style="
                margin:40px 0 20px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:10px;
                font-weight:700;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#999999;
            ">${isRoundTrip ? "Outbound Route" : "Route"}</p>
            <div style="width:100%;height:1px;background:#111111;margin-bottom:4px;"></div>
            <div style="width:40px;height:2px;background:#D4AF37;margin-bottom:24px;"></div>

            ${addressBlock("Pickup", booking.pickupAddress, "Drop-off", booking.dropoffAddress)}

            ${
                stops.length > 0
                    ? `
            <div style="margin-top:24px;padding:20px;background:#FAFAFA;border-left:2px solid #E5E7EB;">
                <p style="margin:0 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999999;">Stops en route</p>
                ${stops.map((s, i) => `<p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:13px;color:#444444;">${i + 1}.&nbsp;&nbsp;${s}</p>`).join("")}
            </div>`
                    : ""
            }

            <!-- Return Trip -->
            ${
                isRoundTrip
                    ? `
            <p style="
                margin:40px 0 20px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:10px;
                font-weight:700;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#999999;
            ">Return Journey</p>
            <div style="width:100%;height:1px;background:#111111;margin-bottom:4px;"></div>
            <div style="width:40px;height:2px;background:#D4AF37;margin-bottom:24px;"></div>
            <table width="100%" cellpadding="0" cellspacing="0">
                ${booking.returnDate ? detailRow("Return Date", formatDate(booking.returnDate)) : ""}
                ${booking.returnPickupAddress ? detailRow("Return Pickup", booking.returnPickupAddress) : ""}
                ${booking.returnDropoffAddress ? detailRow("Return Drop-off", booking.returnDropoffAddress) : ""}
            </table>
            ${
                returnStops.length > 0
                    ? `
            <div style="margin-top:24px;padding:20px;background:#FAFAFA;border-left:2px solid #E5E7EB;">
                <p style="margin:0 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999999;">Return stops</p>
                ${returnStops.map((s, i) => `<p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:13px;color:#444444;">${i + 1}.&nbsp;&nbsp;${s}</p>`).join("")}
            </div>`
                    : ""
            }`
                    : ""
            }

            <!-- Vehicle -->
            ${
                booking.busDetails
                    ? `
            <p style="
                margin:40px 0 20px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:10px;
                font-weight:700;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#999999;
            ">Your Vehicle</p>
            <div style="width:100%;height:1px;background:#111111;margin-bottom:4px;"></div>
            <div style="width:40px;height:2px;background:#D4AF37;margin-bottom:24px;"></div>
            <div style="padding:24px;background:#F8F8F6;border:1px solid #E8E8E4;">
                <p style="margin:0 0 6px;font-family:'Georgia',serif;font-size:18px;font-weight:400;color:#111111;">${booking.busDetails.name}</p>
                <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#888888;letter-spacing:0.5px;">
                    Capacity: ${booking.busDetails.passengers} passengers
                    ${booking.busDetails.amenities?.length ? "&nbsp;&nbsp;&middot;&nbsp;&nbsp;" + booking.busDetails.amenities.join("&nbsp;&nbsp;&middot;&nbsp;&nbsp;") : ""}
                </p>
            </div>`
                    : ""
            }

            <!-- Notice -->
            <div style="margin-top:40px;padding:24px;background:#FFFBF0;border-left:3px solid #D4AF37;">
                <p style="margin:0 0 8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B6914;">Important</p>
                <p style="margin:0;font-family:'Georgia',serif;font-size:14px;color:#5C4A1E;line-height:1.7;">
                    A secure payment invitation will be sent to you within <strong>2 hours</strong>. Your vehicle is held for <strong>24 hours</strong> from this confirmation.
                </p>
            </div>

            <!-- Contact -->
            <div style="margin-top:40px;padding-top:32px;border-top:1px solid #F0F0F0;text-align:center;">
                <p style="margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999999;">Need assistance?</p>
                <p style="margin:0;font-family:'Georgia',serif;font-size:15px;color:#111111;line-height:2;">
                    <a href="tel:5551234567" style="color:#111111;text-decoration:none;font-weight:bold;">(555) 123-4567</a>
                    &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <a href="mailto:support@charterbus.com" style="color:#111111;text-decoration:none;font-weight:bold;">support@charterbus.com</a>
                </p>
            </div>

            <!-- Sign-off -->
            <p style="margin:40px 0 0;font-family:'Georgia',serif;font-style:italic;font-size:15px;color:#888888;text-align:center;line-height:2;">
                With warm regards,<br>
                <span style="font-style:normal;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111111;">The CharterBus Team</span>
            </p>

        </td>
    </tr>

    ${sharedFooter(booking.contact.email)}

</table>
</td></tr>
</table>

</body>
</html>`;

    return sendEmail({
        email: booking.contact.email,
        subject: `Reservation Confirmed — ${booking.confirmationNumber}`,
        html,
    });
};

// ────────────────────────────────────────────────────────────────────────────
// 2.  LEAD NOTIFICATION (Internal / Dispatch team)
// ────────────────────────────────────────────────────────────────────────────
export const sendLeadNotificationEmail = async (booking) => {
    const isRoundTrip = booking.tripType === "round-trip";
    const stops = booking.stops?.filter(Boolean) || [];
    const returnStops = booking.returnStops?.filter(Boolean) || [];
    const daysUntil = Math.ceil(
        (new Date(booking.datetime) - new Date()) / 86400000,
    );

    const receivedAt = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    // ── Reusable row ─────────────────────────────────────────────────────────
    const row = (label, value, last = false) => `
        <tr>
            <td style="
                padding:12px 20px;
                ${last ? "" : "border-bottom:1px solid #1E293B;"}
                width:38%;
                vertical-align:top;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:10px;
                font-weight:700;
                letter-spacing:1.5px;
                text-transform:uppercase;
                color:#64748B;
            ">${label}</td>
            <td style="
                padding:12px 20px;
                ${last ? "" : "border-bottom:1px solid #1E293B;"}
                vertical-align:top;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:13px;
                font-weight:500;
                color:#F1F5F9;
                line-height:1.5;
            ">${value}</td>
        </tr>`;

    // ── Step row ─────────────────────────────────────────────────────────────
    const step = (n, text) => `
        <tr>
            <td style="padding:12px 20px;border-bottom:1px solid #1E293B;vertical-align:top;width:38px;">
                <div style="
                    width:24px;height:24px;border-radius:50%;
                    background:#D4AF37;
                    text-align:center;line-height:24px;
                    font-family:'Helvetica Neue',Arial,sans-serif;
                    font-size:11px;font-weight:700;color:#111111;
                ">${n}</div>
            </td>
            <td style="padding:12px 20px;border-bottom:1px solid #1E293B;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#F1F5F9;font-weight:500;line-height:1.55;">${text}</td>
        </tr>`;

    // ── Address pair ─────────────────────────────────────────────────────────
    const routeBlock = (title, pickup, dropoff, stopsArr = []) => `
        <p style="margin:32px 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">${title}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;border:1px solid #1E293B;border-radius:4px;overflow:hidden;">
            <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #1E293B;">
                    <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">From</p>
                    <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;color:#F1F5F9;">${pickup || "Not specified"}</p>
                </td>
            </tr>
            <tr>
                <td style="padding:14px 18px;${stopsArr.length ? "border-bottom:1px solid #1E293B;" : ""}">
                    <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">To</p>
                    <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;color:#F1F5F9;">${dropoff || "Not specified"}</p>
                </td>
            </tr>
            ${
                stopsArr.length > 0
                    ? `
            <tr>
                <td style="padding:14px 18px;background:#0A0F1E;">
                    <p style="margin:0 0 8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">Stops (${stopsArr.length})</p>
                    ${stopsArr.map((s, i) => `<p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#94A3B8;">${i + 1}. ${s}</p>`).join("")}
                </td>
            </tr>`
                    : ""
            }
        </table>`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>New Inquiry — ${booking.confirmationNumber}</title>
    <style>${BASE_RESET}</style>
</head>
<body style="background:#0A0F1E;">

<table width="100%" cellpadding="0" cellspacing="0" class="outer" style="background:#0A0F1E;padding:28px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" class="shell" style="max-width:560px;border-radius:4px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,0.5);">

    <!-- HEADER -->
    <tr>
        <td class="hd-pad" style="background:#111827;padding:40px 40px 32px;border-bottom:3px solid #D4AF37;">
            <p style="
                margin:0 0 24px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                font-weight:700;
                letter-spacing:5px;
                text-transform:uppercase;
                color:#D4AF37;
            ">CharterBus — Internal</p>
            <h1 style="
                margin:0 0 8px;
                font-family:'Georgia','Times New Roman',serif;
                font-size:28px;
                font-weight:400;
                color:#F1F5F9;
                letter-spacing:-0.3px;
            ">New Booking Inquiry</h1>
            <p style="
                margin:0 0 20px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:12px;
                color:#64748B;
                letter-spacing:0.5px;
            ">Received ${receivedAt} EST &nbsp;&middot;&nbsp; ${daysUntil > 0 ? `${daysUntil} days until service` : "Today"}</p>
            <span style="
                display:inline-block;
                border:1px solid #D4AF37;
                padding:6px 16px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:12px;
                font-weight:700;
                letter-spacing:3px;
                color:#D4AF37;
            ">${booking.confirmationNumber}</span>
        </td>
    </tr>

    <!-- ACTION BAR -->
    <tr>
        <td class="btn-row" style="background:#1E293B;padding:16px 40px;text-align:center;">
            <a href="tel:${booking.contact?.phone}" style="
                display:inline-block;
                padding:12px 28px;
                background:#D4AF37;
                color:#111111;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                font-weight:700;
                letter-spacing:2px;
                text-transform:uppercase;
                text-decoration:none;
                margin:0 8px;
                border-radius:2px;
            ">Call Customer</a>
            <a href="mailto:${booking.contact?.email}" style="
                display:inline-block;
                padding:11px 28px;
                background:transparent;
                color:#D4AF37;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                font-weight:700;
                letter-spacing:2px;
                text-transform:uppercase;
                text-decoration:none;
                margin:0 8px;
                border:1px solid #D4AF37;
                border-radius:2px;
            ">Send Email</a>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td class="bd-pad" style="background:#0F172A;padding:36px 40px;">

            <!-- Customer -->
            <p style="margin:0 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">Customer</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border:1px solid #1E293B;border-radius:4px;overflow:hidden;margin-bottom:8px;">
                ${row("Name", `${booking.contact?.firstName || ""} ${booking.contact?.lastName || ""}`.trim() || "Not provided")}
                ${row("Phone", booking.contact?.phone || "Not provided")}
                ${row("Email", booking.contact?.email || "Not provided", true)}
            </table>

            <!-- Trip Overview -->
            <p style="margin:32px 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">Trip Overview</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border:1px solid #1E293B;border-radius:4px;overflow:hidden;">

                <!-- Trip type header -->
                <tr style="background:#1E293B;">
                    <td colspan="2" style="padding:10px 20px;border-bottom:1px solid #0F172A;">
                        <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#D4AF37;">${tripTypeLabel(booking)}</p>
                    </td>
                </tr>

                ${row("Date", formatDate(booking.datetime))}
                ${row("Time", formatTime(booking.datetime))}
                ${row("Passengers", `${booking.passengers} ${booking.passengers > 1 ? "people" : "person"}`)}
                ${booking.duration ? row("Duration", `${booking.duration} hours`) : ""}
                ${row("Days Away", daysUntil > 0 ? `${daysUntil} days` : "Today", !booking.busDetails)}
            </table>

            <!-- Routes -->
            ${routeBlock(
                isRoundTrip ? "Outbound Journey" : "Journey Details",
                booking.pickupAddress,
                booking.dropoffAddress,
                stops,
            )}

            ${
                isRoundTrip
                    ? routeBlock(
                          "Return Journey",
                          booking.returnPickupAddress || booking.dropoffAddress,
                          booking.returnDropoffAddress || booking.pickupAddress,
                          returnStops,
                      )
                    : ""
            }

            <!-- Vehicle -->
            <p style="margin:32px 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">Vehicle</p>
            ${
                booking.busDetails
                    ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border:1px solid #1E293B;border-radius:4px;overflow:hidden;">
                <tr>
                    <td style="padding:20px;">
                        <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:700;color:#F1F5F9;">${booking.busDetails.name}</p>
                        <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#64748B;">
                            ${booking.busDetails.passengers} passengers
                            ${booking.busDetails.amenities?.length ? " &middot; " + booking.busDetails.amenities.join(" &middot; ") : ""}
                        </p>
                    </td>
                </tr>
            </table>`
                    : `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1E0A0A;border:1px solid #7F1D1D;border-radius:4px;overflow:hidden;">
                <tr>
                    <td style="padding:20px;">
                        <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#EF4444;">Action Required</p>
                        <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#FCA5A5;">No vehicle assigned. Needs vehicle for ${booking.passengers} passengers.</p>
                    </td>
                </tr>
            </table>`
            }

            <!-- Next Steps -->
            <p style="margin:32px 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748B;">Action Plan</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827;border:1px solid #1E293B;border-radius:4px;overflow:hidden;">
                ${step(1, `Contact customer within <strong style="color:#D4AF37;">2 hours</strong>`)}
                ${step(2, `Confirm availability for <strong style="color:#D4AF37;">${formatDate(booking.datetime)}</strong>`)}
                ${step(3, booking.busDetails ? "Confirm vehicle assignment" : "Assign appropriate vehicle")}
                ${step(4, "Send pricing confirmation and payment link")}
                <tr>
                    <td style="padding:12px 20px;vertical-align:top;width:38px;">
                        <div style="width:24px;height:24px;border-radius:50%;background:#D4AF37;text-align:center;line-height:24px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;color:#111111;">5</div>
                    </td>
                    <td style="padding:12px 20px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#F1F5F9;font-weight:500;line-height:1.55;">
                        Update CRM status to <strong style="color:#D4AF37;">Contacted</strong>
                    </td>
                </tr>
            </table>

        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td class="ft-pad" style="background:#060C18;padding:24px 40px;text-align:center;border-radius:0 0 4px 4px;">
            <p style="margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#D4AF37;">CharterBus</p>
            <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#334155;line-height:2;">
                Internal Notification &nbsp;&middot;&nbsp; ID: ${booking._id || booking.id || booking.confirmationNumber}<br>
                ${new Date().toISOString()}
            </p>
        </td>
    </tr>

</table>
</td></tr>
</table>

</body>
</html>`;

    return sendEmail({
        email: process.env.DISPATCH_EMAIL || "dispatch@charterbus.com",
        subject: `New Inquiry — ${booking.contact?.lastName || "Customer"} — ${booking.confirmationNumber}`,
        html,
    });
};

// ────────────────────────────────────────────────────────────────────────────
// 3.  PAYMENT INVITATION (Customer-facing)
// ────────────────────────────────────────────────────────────────────────────
export const sendPaymentInvitationEmail = async (booking, paymentLink) => {
    if (!booking.contact?.email) return;

    const firstName = booking.contact?.firstName || "Guest";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Complete Your Reservation — ${booking.confirmationNumber}</title>
    <style>${BASE_RESET}</style>
</head>
<body>

<table width="100%" cellpadding="0" cellspacing="0" class="outer" style="background:#EBEBEB;padding:36px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" class="shell" style="max-width:520px;border-radius:4px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">

    <!-- HEADER -->
    <tr>
        <td class="hd-pad" style="background:#111111;padding:50px 48px 40px;text-align:center;">
            <p style="
                margin:0 0 4px;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                font-weight:700;
                letter-spacing:5px;
                text-transform:uppercase;
                color:#D4AF37;
            ">CharterBus</p>
            <h1 style="
                margin:0 0 20px;
                font-family:'Georgia','Times New Roman',serif;
                font-size:32px;
                font-weight:400;
                color:#FFFFFF;
                letter-spacing:-0.5px;
                line-height:1.25;
            ">Complete Your<br>Reservation</h1>
            <div style="width:40px;height:2px;background:#D4AF37;margin:0 auto 24px;"></div>
            <p style="
                margin:0;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:11px;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#666666;
            ">Reference No.</p>
            <p style="
                margin:8px 0 0;
                font-family:'Helvetica Neue',Arial,sans-serif;
                font-size:18px;
                font-weight:700;
                letter-spacing:4px;
                color:#D4AF37;
            ">${booking.confirmationNumber}</p>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td class="bd-pad" style="background:#FFFFFF;padding:48px;">

            <p style="
                margin:0 0 16px;
                font-family:'Georgia',serif;
                font-size:18px;
                color:#111111;
                line-height:1.6;
            ">Dear ${firstName},</p>

            <p style="
                margin:0 0 40px;
                font-family:'Georgia',serif;
                font-size:15px;
                color:#444444;
                line-height:1.8;
            ">Your charter reservation is confirmed. To finalise your booking and secure your vehicle, please complete the payment using the link below.</p>

            <!-- CTA -->
            <div style="text-align:center;margin:48px 0;">
                <a href="${paymentLink}" style="
                    display:inline-block;
                    background:#111111;
                    color:#D4AF37;
                    padding:20px 52px;
                    font-family:'Helvetica Neue',Arial,sans-serif;
                    font-size:11px;
                    font-weight:700;
                    letter-spacing:3px;
                    text-transform:uppercase;
                    text-decoration:none;
                    border:2px solid #111111;
                ">Complete Secure Payment</a>
                <p style="
                    margin:16px 0 0;
                    font-family:'Helvetica Neue',Arial,sans-serif;
                    font-size:11px;
                    letter-spacing:1px;
                    color:#AAAAAA;
                ">Secured and encrypted by Stripe</p>
            </div>

            <!-- Summary -->
            <div style="padding:24px;background:#F8F8F6;border:1px solid #E8E8E4;margin-bottom:32px;">
                <p style="margin:0 0 16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999999;">Booking Summary</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #EEEEEE;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#AAAAAA;width:45%;">Date</td>
                        <td style="padding:8px 0;border-bottom:1px solid #EEEEEE;font-family:'Georgia',serif;font-size:13px;color:#111111;text-align:right;">${formatDate(booking.datetime)}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #EEEEEE;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#AAAAAA;">Time</td>
                        <td style="padding:8px 0;border-bottom:1px solid #EEEEEE;font-family:'Georgia',serif;font-size:13px;color:#111111;text-align:right;">${formatTime(booking.datetime)}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #EEEEEE;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#AAAAAA;">Passengers</td>
                        <td style="padding:8px 0;border-bottom:1px solid #EEEEEE;font-family:'Georgia',serif;font-size:13px;color:#111111;text-align:right;">${booking.passengers}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#AAAAAA;">Reference</td>
                        <td style="padding:8px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;color:#111111;text-align:right;">${booking.confirmationNumber}</td>
                    </tr>
                </table>
            </div>

            <!-- Urgency Notice -->
            <div style="padding:24px;background:#FFFBF0;border-left:3px solid #D4AF37;">
                <p style="margin:0 0 8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B6914;">Time Sensitive</p>
                <p style="margin:0;font-family:'Georgia',serif;font-size:14px;color:#5C4A1E;line-height:1.7;">
                    This reservation is held for <strong>24 hours</strong> from receipt of this message. After this period, vehicle availability cannot be guaranteed.
                </p>
            </div>

            <!-- Contact -->
            <div style="margin-top:40px;padding-top:32px;border-top:1px solid #F0F0F0;text-align:center;">
                <p style="margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999999;">Questions?</p>
                <p style="margin:0;font-family:'Georgia',serif;font-size:15px;color:#111111;line-height:2;">
                    <a href="tel:5551234567" style="color:#111111;text-decoration:none;font-weight:bold;">(555) 123-4567</a>
                    &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <a href="mailto:support@charterbus.com" style="color:#111111;text-decoration:none;font-weight:bold;">support@charterbus.com</a>
                </p>
            </div>

            <p style="margin:40px 0 0;font-family:'Georgia',serif;font-style:italic;font-size:15px;color:#888888;text-align:center;line-height:2;">
                With warm regards,<br>
                <span style="font-style:normal;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111111;">CharterBus Concierge</span>
            </p>

        </td>
    </tr>

    ${sharedFooter(booking.contact.email)}

</table>
</td></tr>
</table>

</body>
</html>`;

    return sendEmail({
        email: booking.contact.email,
        subject: `Payment Invitation — ${booking.confirmationNumber}`,
        html,
    });
};

// ─── Helper: Lead scoring ────────────────────────────────────────────────────
const calculateLeadScore = (booking) => {
    let score = 50;
    if (booking.pricing?.totalAmount > 3000) score += 30;
    else if (booking.pricing?.totalAmount > 1500) score += 20;
    else if (booking.pricing?.totalAmount > 800) score += 10;
    if (booking.passengers > 40) score += 20;
    else if (booking.passengers > 25) score += 15;
    else if (booking.passengers > 15) score += 10;
    if (booking.tripType?.toLowerCase().includes("wedding")) score += 15;
    if (booking.tripType?.toLowerCase().includes("corporate")) score += 15;
    if (booking.tripType?.toLowerCase().includes("vip")) score += 20;
    const daysUntil = Math.ceil(
        (new Date(booking.datetime) - new Date()) / 86400000,
    );
    if (daysUntil <= 14 && daysUntil > 0) score += 15;
    if (daysUntil <= 7 && daysUntil > 0) score += 10;
    return Math.min(score, 100);
};

export default {
    sendEmail,
    sendBookingConfirmationEmail,
    sendPaymentInvitationEmail,
    sendLeadNotificationEmail,
};
