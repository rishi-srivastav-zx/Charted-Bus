import nodemailer from "nodemailer";

const createTransporter = () => {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        console.warn(
            "⚠️ SMTP credentials not configured. Emails will not be sent.",
        );
        return null;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // Use SSL for port 465
        auth: { user, pass },
        connectionTimeout: 10000, // 10 seconds timeout
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
        if (error) {
            console.error("❌ SMTP Connection Error:", error.message);
            if (port === 587) {
                console.warn("💡 Tip: Many cloud providers (like Render/AWS) block port 587. Try using port 465 with SSL if you encounter timeouts.");
            }
        } else {
            console.log("✅ SMTP is connected and ready!");
        }
    });

    return transporter;
};

const transporter = createTransporter();

const sendEmail = async (options) => {
    if (!transporter) {
        console.log("📧 Email (mock):", {
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
        console.log("📧 Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("📧 Email error:", error.message);
        throw error;
    }
};

// ==========================================
// LUXURY EMAIL STYLES - 2025 BEST PRACTICES
// Inspired by: Tiffany, Hermès, Four Seasons
// ==========================================
const luxuryStyles = {
    // Typography - Elegant, sophisticated
    fontPrimary: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    fontSecondary: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",

    // Colors - Refined palette
    colorGold: "#D4AF37",
    colorNavy: "#0A192F",
    colorCharcoal: "#2C3E50",
    colorCream: "#FAF9F6",
    colorWhite: "#FFFFFF",
    colorLightGray: "#F8F9FA",
    colorText: "#1A1A1A",
    colorMuted: "#6B7280",

    // Container - Centered, refined
    container: `
        font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.8;
        color: #1A1A1A;
        max-width: 680px;
        margin: 0 auto;
        background-color: #FAF9F6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    `,

    // Header - Minimalist, elegant
    header: `
        background: linear-gradient(180deg, #0A192F 0%, #1E3A5F 100%);
        padding: 60px 40px;
        text-align: center;
        position: relative;
    `,

    headerLogo: `
        width: 120px;
        height: 120px;
        background: rgba(255,255,255,0.05);
        border: 2px solid rgba(212,175,55,0.3);
        border-radius: 50%;
        margin: 0 auto 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        color: #D4AF37;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `,

    headerTitle: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: #FFFFFF;
        margin: 0;
        font-size: 42px;
        font-weight: 300;
        letter-spacing: 3px;
        text-transform: uppercase;
    `,

    headerSubtitle: `
        color: rgba(255,255,255,0.7);
        margin: 20px 0 0 0;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 4px;
        text-transform: uppercase;
    `,

    // Gold accent line
    goldLine: `
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, #D4AF37, #F4E4BC, #D4AF37);
        margin: 30px auto;
    `,

    // Body - Generous whitespace
    body: `
        background: #FFFFFF;
        padding: 60px 50px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.08);
    `,

    // Confirmation - Elegant box
    confirmationBox: `
        background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
        border: 1px solid #E5E7EB;
        padding: 40px;
        text-align: center;
        margin-bottom: 50px;
        position: relative;
    `,

    confirmationLabel: `
        font-family: 'Montserrat', sans-serif;
        color: #6B7280;
        margin: 0 0 15px 0;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 3px;
        text-transform: uppercase;
    `,

    confirmationNumber: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: #0A192F;
        margin: 0;
        font-size: 32px;
        font-weight: 400;
        letter-spacing: 6px;
        border-bottom: 2px solid #D4AF37;
        padding-bottom: 15px;
        display: inline-block;
    `,

    // Section styling
    section: `
        margin-bottom: 50px;
        padding-bottom: 40px;
        border-bottom: 1px solid #F3F4F6;
    `,

    sectionTitle: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: #0A192F;
        margin: 0 0 30px 0;
        font-size: 24px;
        font-weight: 400;
        letter-spacing: 2px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 15px;
    `,

    sectionIcon: `
        width: 40px;
        height: 40px;
        background: #F3F4F6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    `,

    // Data rows - Clean, editorial
    row: `
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 18px 0;
        border-bottom: 1px solid #F3F4F6;
    `,

    rowLast: `
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 18px 0;
    `,

    label: `
        color: #6B7280;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 1px;
        text-transform: uppercase;
        flex: 1;
    `,

    value: `
        color: #1A1A1A;
        font-size: 15px;
        font-weight: 500;
        text-align: right;
        flex: 1.5;
        line-height: 1.6;
    `,

    highlight: `
        color: #0A192F;
        font-weight: 600;
    `,

    // Vehicle card - Premium presentation
    vehicleCard: `
        background: #FAF9F6;
        border-left: 4px solid #D4AF37;
        padding: 35px;
        margin: 30px 0;
        position: relative;
    `,

    vehicleName: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 28px;
        color: #0A192F;
        margin: 0 0 20px 0;
        font-weight: 400;
        letter-spacing: 1px;
    `,

    vehicleDetail: `
        color: #4B5563;
        font-size: 14px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    `,

    // Pricing - Sophisticated
    priceSection: `
        background: linear-gradient(135deg, #0A192F 0%, #1E3A5F 100%);
        color: #FFFFFF;
        padding: 40px;
        margin: 40px 0;
    `,

    priceRow: `
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        font-size: 14px;
    `,

    priceLabel: `
        color: rgba(255,255,255,0.7);
        font-weight: 400;
    `,

    priceValue: `
        color: #FFFFFF;
        font-weight: 500;
    `,

    totalRow: `
        display: flex;
        justify-content: space-between;
        padding: 25px 0 0 0;
        margin-top: 20px;
        border-top: 2px solid #D4AF37;
    `,

    totalLabel: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: #FFFFFF;
        font-size: 20px;
        font-weight: 400;
        letter-spacing: 2px;
        text-transform: uppercase;
    `,

    totalValue: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: #D4AF37;
        font-size: 36px;
        font-weight: 400;
        letter-spacing: 1px;
    `,

    // CTA - Understated elegance
    ctaContainer: `
        text-align: center;
        margin: 50px 0;
        padding: 40px;
        background: #F8F9FA;
        border: 1px solid #E5E7EB;
    `,

    ctaButton: `
        display: inline-block;
        background: #0A192F;
        color: #FFFFFF;
        padding: 20px 50px;
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 3px;
        text-transform: uppercase;
        border: 2px solid #0A192F;
        transition: all 0.3s ease;
    `,

    ctaSecondary: `
        display: inline-block;
        background: transparent;
        color: #0A192F;
        padding: 15px 40px;
        text-decoration: none;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        border: 1px solid #0A192F;
        margin-top: 20px;
    `,

    // Notice - Refined urgency
    noticeBox: `
        background: #FEF3C7;
        border-left: 4px solid #F59E0B;
        padding: 30px;
        margin: 40px 0;
    `,

    noticeTitle: `
        color: #92400E;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 0 0 15px 0;
    `,

    noticeText: `
        color: #78350F;
        font-size: 15px;
        margin: 0;
        line-height: 1.8;
        font-weight: 500;
    `,

    // Contact - Concierge style
    contactSection: `
        background: #FAF9F6;
        padding: 40px;
        text-align: center;
        margin-top: 50px;
        border: 1px solid #E5E7EB;
    `,

    contactTitle: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: #0A192F;
        font-size: 22px;
        margin: 0 0 25px 0;
        font-weight: 400;
        letter-spacing: 2px;
        text-transform: uppercase;
    `,

    contactDetail: `
        color: #4B5563;
        font-size: 14px;
        margin: 12px 0;
        font-weight: 500;
    `,

    contactHighlight: `
        color: #0A192F;
        font-weight: 700;
        font-size: 18px;
        letter-spacing: 1px;
    `,

    // Footer - Refined
    footer: `
        background: #0A192F;
        padding: 50px 40px;
        text-align: center;
        color: rgba(255,255,255,0.6);
    `,

    footerBrand: `
        font-family: 'Cormorant Garamond', Georgia, serif;
        color: #FFFFFF;
        font-size: 24px;
        margin: 0 0 15px 0;
        letter-spacing: 4px;
        text-transform: uppercase;
        font-weight: 400;
    `,

    footerText: `
        font-size: 12px;
        letter-spacing: 1px;
        margin: 0 0 25px 0;
        line-height: 1.8;
    `,

    footerLinks: `
        margin: 30px 0;
        padding-top: 30px;
        border-top: 1px solid rgba(255,255,255,0.1);
    `,

    footerLink: `
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        margin: 0 20px;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
        transition: color 0.3s ease;
    `,

    // Signature
    signature: `
        margin-top: 40px;
        padding-top: 30px;
        border-top: 1px solid #E5E7EB;
        font-style: italic;
        color: #6B7280;
        font-size: 14px;
        text-align: center;
        font-family: 'Cormorant Garamond', Georgia, serif;
    `,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dt) => {
    if (!dt) return "Not specified";
    return new Date(dt).toLocaleDateString("en-US", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
    });
};

const formatTime = (dt) => {
    if (!dt) return "Not specified";
    return new Date(dt).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit",
    });
};

const row = (label, value) => `
    <tr>
        <td style="padding:8px 14px;font-size:12px;color:#6B7280;border-top:1px solid #F3F4F6;width:45%;">${label}</td>
        <td style="padding:8px 14px;font-size:12px;color:#1F2937;font-weight:500;text-align:right;border-top:1px solid #F3F4F6;">${value}</td>
    </tr>`;

// ─── Bus SVG icon (inline, no external deps) ────────────────────────────────
const busIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78C19.61 17.67 20 16.88 20 16V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM4 11V6h16v5H4z"/>
</svg>`;

const checkSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20,6 9,17 4,12" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ─── Trip type badge label ───────────────────────────────────────────────────
const tripBadgeLabel = (booking) => {
    if (booking.tripType === "round-trip") return "&#x1F501; Round Trip";
    if (booking.tripType === "hourly")     return "&#x23F1; Hourly Charter";
    return "&#x27A1;&#xFE0F; One Way";
};

// ─── Main function ───────────────────────────────────────────────────────────

export const sendBookingConfirmationEmail = async (booking) => {
    if (!booking.contact?.email) {
        console.warn("📧 No email address provided for booking confirmation");
        return;
    }

    const isRoundTrip  = booking.tripType === "round-trip";
    const stops        = booking.stops?.filter(Boolean)       || [];
    const returnStops  = booking.returnStops?.filter(Boolean) || [];
    const firstName    = booking.contact?.firstName || "there";
    const year         = new Date().getFullYear();

    // ── Logo block (reused in header & footer) ───────────────────────────────
    const logoHtml = (iconSize = 18, fontSize = 18) => `
        <table cellpadding="0" cellspacing="0" style="display:inline-table;">
            <tr>
                <td style="vertical-align:middle;">
                    <div style="
                        width:${iconSize + 14}px;
                        height:${iconSize + 14}px;
                        background:#F59E0B;
                        border-radius:8px;
                        text-align:center;
                        vertical-align:middle;
                        line-height:${iconSize + 14}px;
                        display:inline-block;
                    ">
                        <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin-bottom:2px;">
                            <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78C19.61 17.67 20 16.88 20 16V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM4 11V6h16v5H4z"/>
                        </svg>
                    </div>
                </td>
                <td style="padding-left:9px;vertical-align:middle;">
                    <span style="
                        font-size:${fontSize}px;
                        font-weight:700;
                        color:#FFFFFF;
                        letter-spacing:0.3px;
                        font-family:'Helvetica Neue',Arial,sans-serif;
                    ">Charter<span style="color:#F59E0B;">Bus</span></span>
                </td>
            </tr>
        </table>`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Charter Confirmed — ${booking.confirmationNumber}</title>
    <style>
        body  { margin:0; padding:0; background:#F4F6F9; font-family:'Helvetica Neue',Arial,sans-serif; }
        table { border-collapse:collapse; }

        /* ── Mobile ── */
        @media (max-width:600px) {
            .outer-wrap  { padding:16px 10px !important; }
            .body-card   { padding:22px 16px !important; }
            .hd-inner    { padding:22px 16px !important; }
            .ft-inner    { padding:16px !important; }
            .conf-title  { font-size:17px !important; }
            .conf-num    { font-size:12px !important; }
            .route-cols  { display:block !important; }
            .route-cell  { display:block !important; width:100% !important; border-right:none !important; border-bottom:1px solid #E5E7EB !important; }
            .route-cell:last-child { border-bottom:none !important; }
            .veh-row     { display:block !important; }
        }
    </style>
</head>
<body>

<table width="100%" cellpadding="0" cellspacing="0" class="outer-wrap"
       style="background:#F4F6F9; padding:36px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

    <!-- ══ HEADER ════════════════════════════════════════════════════ -->
    <tr>
        <td class="hd-inner"
            style="background:#0F1F3D; border-radius:12px 12px 0 0; padding:28px 28px 24px; text-align:center;">

            <!-- Logo -->
            <div style="margin-bottom:20px;">
                ${logoHtml(18, 19)}
            </div>

            <!-- Green tick + Confirmed -->
            <div style="display:inline-block; text-align:center;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
                    <tr>
                        <td style="vertical-align:middle; padding-right:9px;">
                            <!-- Green circle check -->
                            <div style="
                                width:28px; height:28px; border-radius:50%;
                                background:#22C55E;
                                display:inline-block;
                                text-align:center; line-height:28px;
                            ">
                                ${checkSvg}
                            </div>
                        </td>
                        <td style="vertical-align:middle;">
                            <span class="conf-title" style="
                                font-size:20px; font-weight:700;
                                color:#FFFFFF; letter-spacing:0.4px;
                                white-space:nowrap;
                            ">Charter Bus <span style="color:#4ADE80;">Confirmed</span></span>
                        </td>
                    </tr>
                </table>
                <p class="conf-num" style="margin:0; color:#A0B4CC; font-size:13px;">
                    Booking #<strong style="color:#F59E0B;">${booking.confirmationNumber}</strong>
                </p>
            </div>
        </td>
    </tr>

    <!-- ══ BODY ══════════════════════════════════════════════════════ -->
    <tr>
        <td class="body-card"
            style="background:#FFFFFF; padding:26px 24px;">

            <!-- Greeting -->
            <p style="margin:0 0 4px; font-size:15px; color:#374151;">
                Hey <strong>${firstName}</strong>,
            </p>
            <p style="margin:0 0 22px; font-size:14px; color:#16A34A; font-weight:600; display:flex; align-items:center; gap:6px;">
                <span style="
                    display:inline-block; width:8px; height:8px;
                    background:#22C55E; border-radius:50;
                    margin-right:5px; vertical-align:middle;
                "></span>
                Your booking is confirmed!
            </p>

            <!-- ── TRIP SUMMARY ─────────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; margin-bottom:14px;">
                <tr style="background:#F9FAFB;">
                    <td colspan="2" style="padding:10px 14px; border-bottom:1px solid #E5E7EB;">
                        <span style="font-size:10px; font-weight:700; letter-spacing:1px; color:#6B7280; text-transform:uppercase;">Trip Summary</span>
                    </td>
                </tr>
                <!-- Trip-type badge row -->
                <tr>
                    <td colspan="2" style="padding:10px 14px; border-bottom:1px solid #F3F4F6;">
                        <span style="
                            display:inline-block;
                            background:#EFF6FF; color:#1D4ED8;
                            font-size:11px; font-weight:700;
                            padding:4px 12px; border-radius:20px;
                        ">${tripBadgeLabel(booking)}</span>
                    </td>
                </tr>
                ${row("📅 Departure", formatDate(booking.datetime))}
                ${row("⏰ Time", formatTime(booking.datetime))}
                ${row("👥 Passengers", `${booking.passengers} ${booking.passengers > 1 ? "Passengers" : "Passenger"}`)}
                ${booking.duration ? row("⏱ Duration", `${booking.duration} Hours`) : ""}
            </table>

            <!-- ── TRIP ROUTE ───────────────────────────────────── -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; margin-bottom:14px;">
                <tr style="background:#EFF6FF;">
                    <td colspan="2" style="padding:10px 14px; border-bottom:1px solid #DBEAFE;">
                        <span style="font-size:10px; font-weight:700; letter-spacing:1px; color:#1D4ED8; text-transform:uppercase;">
                            ${isRoundTrip ? "Outbound Route" : "Trip Route"}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:14px; vertical-align:top; width:50%; border-right:1px solid #F3F4F6;">
                        <!-- Pickup -->
                        <span style="font-size:10px; font-weight:700; color:#6B7280; text-transform:uppercase; display:block; margin-bottom:7px;">
                            📍 Pickup
                        </span>
                        <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="vertical-align:top; padding-right:7px;">
                                    <div style="width:9px;height:9px;border-radius:50%;background:#3B82F6;margin-top:3px;"></div>
                                </td>
                                <td style="font-size:12px;color:#1F2937;font-weight:500;line-height:1.5;">
                                    ${booking.pickupAddress || "Not specified"}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="padding:14px; vertical-align:top; width:50%;">
                        <!-- Drop-off -->
                        <span style="font-size:10px; font-weight:700; color:#6B7280; text-transform:uppercase; display:block; margin-bottom:7px;">
                            🏁 Drop-off
                        </span>
                        <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="vertical-align:top; padding-right:7px;">
                                    <div style="width:9px;height:9px;border-radius:50%;background:#EF4444;margin-top:3px;"></div>
                                </td>
                                <td style="font-size:12px;color:#1F2937;font-weight:500;line-height:1.5;">
                                    ${booking.dropoffAddress || "Not specified"}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                ${stops.length > 0 ? `
                <tr>
                    <td colspan="2" style="padding:12px 14px; background:#FFFBEB; border-top:1px solid #E5E7EB;">
                        <span style="font-size:10px; font-weight:700; color:#92400E; text-transform:uppercase; display:block; margin-bottom:8px;">🚏 Stops (${stops.length})</span>
                        ${stops.map((s, i) => `<div style="font-size:12px;color:#78350F;padding:4px 0;border-bottom:1px dashed #FDE68A;">${i + 1}. ${s}</div>`).join("")}
                    </td>
                </tr>` : ""}
            </table>

            <!-- ── RETURN TRIP (round-trip only) ────────────────── -->
            ${isRoundTrip ? `
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; margin-bottom:14px;">
                <tr style="background:#FDF2F8;">
                    <td colspan="2" style="padding:10px 14px; border-bottom:1px solid #F9D7EA;">
                        <span style="font-size:10px; font-weight:700; letter-spacing:1px; color:#9D174D; text-transform:uppercase;">&#x21A9;&#xFE0F; Return Trip</span>
                    </td>
                </tr>
                ${booking.returnDate        ? row("📅 Return Date",   formatDate(booking.returnDate))          : ""}
                ${booking.returnPickupAddress  ? row("📍 Return Pickup",  booking.returnPickupAddress)             : ""}
                ${booking.returnDropoffAddress ? row("🏁 Return Drop-off", booking.returnDropoffAddress)           : ""}
                ${returnStops.length > 0 ? `
                <tr>
                    <td colspan="2" style="padding:12px 14px; background:#FFFBEB;">
                        <span style="font-size:10px;font-weight:700;color:#92400E;text-transform:uppercase;display:block;margin-bottom:8px;">🚏 Return Stops (${returnStops.length})</span>
                        ${returnStops.map((s, i) => `<div style="font-size:12px;color:#78350F;padding:4px 0;border-bottom:1px dashed #FDE68A;">${i + 1}. ${s}</div>`).join("")}
                    </td>
                </tr>` : ""}
            </table>` : ""}

            <!-- ── VEHICLE ──────────────────────────────────────── -->
            ${booking.busDetails ? `
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; margin-bottom:14px;">
                <tr>
                    <td style="padding:15px 16px;">
                        <p style="margin:0 0 4px; font-size:10px; font-weight:700; letter-spacing:1px; color:#3B82F6; text-transform:uppercase;">Your Vehicle</p>
                        <p style="margin:0 0 6px; font-size:16px; font-weight:700; color:#1E3A5F;">
                            &#x1F68C; ${booking.busDetails.name}
                        </p>
                        <p style="margin:0; font-size:12px; color:#4B6A88; line-height:1.55;">
                            Up to ${booking.busDetails.passengers} passengers
                            ${booking.busDetails.amenities?.length ? ` &nbsp;&bull;&nbsp; ${booking.busDetails.amenities.join(" &bull; ")}` : ""}
                        </p>
                    </td>
                </tr>
            </table>` : ""}

            <!-- ── NOTICE ───────────────────────────────────────── -->
            <div style="background:#FFFBEB; border-left:3px solid #F59E0B; border-radius:0 6px 6px 0; padding:13px 15px; margin-bottom:20px;">
                <p style="margin:0; font-size:12px; color:#92400E; line-height:1.65;">
                    &#x23F3; <strong>Payment link incoming.</strong> A secure payment invitation will be sent within <strong>2 hours</strong>. Your bus is held for <strong>24 hours</strong>.
                </p>
            </div>

            <!-- ── CONTACT ──────────────────────────────────────── -->
            <p style="margin:0; font-size:12px; color:#6B7280; text-align:center; line-height:2;">
                Questions? Reach us at<br>
                <a href="tel:5551234567"
                   style="color:#0F1F3D; font-weight:700; text-decoration:none;">(555) 123-4567</a>
                &nbsp;or&nbsp;
                <a href="mailto:support@charterbus.com"
                   style="color:#0F1F3D; font-weight:700; text-decoration:none;">support@charterbus.com</a>
            </p>

        </td>
    </tr>

    <!-- ══ FOOTER ════════════════════════════════════════════════════ -->
    <tr>
        <td class="ft-inner"
            style="background:#0F1F3D; border-radius:0 0 12px 12px; padding:20px 28px; text-align:center;">

            <div style="margin-bottom:10px;">
                ${logoHtml(15, 16)}
            </div>

            <p style="margin:0 0 6px; color:#A0B4CC; font-size:11px;">
                Licensed &nbsp;&bull;&nbsp; Insured &nbsp;&bull;&nbsp; DOT Certified
            </p>
            <p style="margin:0; color:#6B7280; font-size:11px; line-height:2;">
                &copy; ${year} CharterBus Inc. &nbsp;|&nbsp;
                <a href="https://charterbus.com/terms"   style="color:#6B7280; text-decoration:none;">Terms</a>
                &nbsp;|&nbsp;
                <a href="https://charterbus.com/privacy" style="color:#6B7280; text-decoration:none;">Privacy</a>
                <br>Sent to ${booking.contact.email}
            </p>
        </td>
    </tr>

</table>
</td></tr>
</table>

</body>
</html>`;

    return sendEmail({
        email:   booking.contact.email,
        subject: `Charter Confirmed ✅ — ${booking.confirmationNumber}`,
        html,
    });
};

// ==========================================
// LUXURY LEAD NOTIFICATION EMAIL (Internal)
// ==========================================
export const sendLeadNotificationEmail = async (booking) => {
    const isRoundTrip = booking.tripType === "round-trip";
    const stops = booking.stops?.filter(Boolean) || [];
    const returnStops = booking.returnStops?.filter(Boolean) || [];
    const daysUntil = Math.ceil(
        (new Date(booking.datetime) - new Date()) / 86400000,
    );

    const formatDate = (date) => {
        if (!date) return "Not specified";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "Not specified";
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ── Reusable inline row (label / value) ─────────────────────────────────
    const infoRow = (label, value, isLink = false, href = "") => `
        <tr>
            <td style="padding:13px 18px; border-bottom:1px solid #E2E8F0;">
                <span style="display:block; font-size:10px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:4px;">${label}</span>
                ${
                    isLink
                        ? `<a href="${href}" style="font-size:14px; font-weight:600; color:#0F172A; text-decoration:none;">${value}</a>`
                        : `<span style="font-size:14px; font-weight:600; color:#0F172A;">${value}</span>`
                }
            </td>
        </tr>`;

    // ── Trip grid cell ───────────────────────────────────────────────────────
    const tripCell = (label, value) => `
        <td style="padding:8px 12px; width:50%; vertical-align:top;">
            <span style="display:block; font-size:10px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:5px;">${label}</span>
            <span style="font-size:14px; font-weight:600; color:#0F172A;">${value}</span>
        </td>`;

    // ── Action step row ──────────────────────────────────────────────────────
    const actionStep = (num, text) => `
        <tr>
            <td style="padding:11px 18px; border-bottom:1px solid #1E293B; vertical-align:top;">
                <table cellpadding="0" cellspacing="0" width="100%"><tr>
                    <td style="width:28px; vertical-align:top; padding-top:1px;">
                        <div style="width:22px; height:22px; background:#F97316; border-radius:50%; text-align:center; line-height:22px; font-size:11px; font-weight:700; color:#fff;">${num}</div>
                    </td>
                    <td style="font-size:13px; color:#F1F5F9; font-weight:500; line-height:1.55; padding-left:10px;">${text}</td>
                </tr></table>
            </td>
        </tr>`;

    // ── Bus SVG icon ─────────────────────────────────────────────────────────
    const busSvg = (size = 20) =>
        `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style="display:block;">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78C19.61 17.67 20 16.88 20 16V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM4 11V6h16v5H4z"/>
        </svg>`;

    const logoBlock = (iconSize = 20, fontSize = 20) => `
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
                <td style="vertical-align:middle;">
                    <div style="width:${iconSize + 16}px; height:${iconSize + 16}px; background:#F97316; border-radius:9px; text-align:center; line-height:${iconSize + 16}px; display:inline-block; vertical-align:middle;">
                        ${busSvg(iconSize)}
                    </div>
                </td>
                <td style="padding-left:10px; vertical-align:middle;">
                    <span style="font-size:${fontSize}px; font-weight:700; color:#FFFFFF; font-family:'Helvetica Neue',Arial,sans-serif; letter-spacing:-0.3px;">
                        Charter<span style="color:#F97316;">Bus</span>
                    </span>
                </td>
            </tr>
        </table>`;

    const tripTypeLabel = isRoundTrip
        ? "&#x1F501; Round Trip"
        : booking.tripType === "hourly"
          ? "&#x23F1; Hourly Charter"
          : "&#x27A1;&#xFE0F; One Way";

    const receivedAt = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>New Booking Inquiry — ${booking.confirmationNumber}</title>
    <style>
        /* Only mobile overrides here — everything else is inline */
        body { margin:0; padding:0; background:#F1F5F9; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
        img { border:0; height:auto; line-height:100%; max-width:100%; }

        @media screen and (max-width:600px) {
            .outer  { padding:12px 8px !important; }
            .hd     { padding:22px 14px !important; }
            .abar   { padding:14px !important; }
            .body   { padding:18px 14px !important; }
            .ft     { padding:22px 14px !important; }
            .btn-p  { display:block !important; width:100% !important; margin:0 0 10px 0 !important; box-sizing:border-box !important; text-align:center !important; }
            .btn-s  { display:block !important; width:100% !important; margin:0 !important; box-sizing:border-box !important; text-align:center !important; }
            .tgrid  { display:block !important; }
            .tcell  { display:block !important; width:100% !important; padding:8px 14px !important; border-bottom:1px solid #E2E8F0!important; border-right:none !important; }
            .tcell:last-child { border-bottom:none !important; }
            .vcol   { display:block !important; }
            .vicon  { display:block !important; margin-bottom:12px !important; }
        }

        @media (prefers-color-scheme:dark) {
            body { background:#0F172A !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;">

<table width="100%" cellpadding="0" cellspacing="0" class="outer" style="background:#F1F5F9;padding:28px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

    <!-- ══ HEADER ════════════════════════════════════════════════════════════ -->
    <tr>
        <td class="hd" style="background:#0F172A;border-radius:14px 14px 0 0;padding:28px 24px;text-align:center;">

            <div style="margin-bottom:18px;">${logoBlock(20, 21)}</div>

            <h1 style="margin:0 0 6px;color:#FFFFFF;font-size:20px;font-weight:700;font-family:'Helvetica Neue',Arial,sans-serif;">
                New Booking Inquiry
            </h1>
            <p style="margin:0 0 10px;color:#94A3B8;font-size:13px;font-family:'Helvetica Neue',Arial,sans-serif;">
                Received ${receivedAt} EST
            </p>
            <span style="display:inline-block;background:#1E293B;border:1px solid #334155;border-radius:6px;padding:5px 14px;font-size:13px;font-weight:700;color:#F97316;letter-spacing:0.8px;font-family:'Helvetica Neue',Arial,sans-serif;">
                #${booking.confirmationNumber}
            </span>
        </td>
    </tr>

    <!-- ══ ACTION BAR ════════════════════════════════════════════════════════ -->
    <tr>
        <td class="abar" style="background:#FFFFFF;padding:16px 20px;border-bottom:1px solid #E2E8F0;text-align:center;">
            <a href="tel:${booking.contact?.phone}" class="btn-p"
               style="display:inline-block;padding:12px 22px;background:#0F172A;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;margin:0 5px 8px;font-family:'Helvetica Neue',Arial,sans-serif;">
                &#128222; Call Customer
            </a>
            <a href="mailto:${booking.contact?.email}" class="btn-s"
               style="display:inline-block;padding:11px 22px;background:#FFFFFF;color:#0F172A;font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;border:2px solid #0F172A;margin:0 5px 8px;font-family:'Helvetica Neue',Arial,sans-serif;">
                &#9993; Send Email
            </a>
        </td>
    </tr>

    <!-- ══ BODY ══════════════════════════════════════════════════════════════ -->
    <tr>
        <td class="body" style="background:#FFFFFF;padding:22px 20px;">

            <!-- ── Customer Details ─────────────────────────────────────────── -->
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0F172A;font-family:'Helvetica Neue',Arial,sans-serif;">&#128100; Customer Details</p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                ${infoRow("Full Name", `${booking.contact?.firstName || ""} ${booking.contact?.lastName || "Not provided"}`.trim())}
                ${infoRow("Phone Number", booking.contact?.phone || "Not provided", true, `tel:${booking.contact?.phone}`)}
                <tr>
                    <td style="padding:13px 18px;">
                        <span style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Email Address</span>
                        <a href="mailto:${booking.contact?.email}" style="font-size:14px;font-weight:600;color:#0F172A;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">
                            ${booking.contact?.email || "Not provided"}
                        </a>
                    </td>
                </tr>
            </table>

            <!-- ── Trip Overview ────────────────────────────────────────────── -->
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0F172A;font-family:'Helvetica Neue',Arial,sans-serif;">&#128652; Trip Overview</p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                <!-- Trip type header -->
                <tr style="background:#DBEAFE;">
                    <td colspan="2" style="padding:11px 16px;border-bottom:1px solid #BFDBFE;">
                        <table width="100%" cellpadding="0" cellspacing="0"><tr>
                            <td>
                                <span style="font-size:10px;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.8px;font-family:'Helvetica Neue',Arial,sans-serif;">${tripTypeLabel}</span>
                            </td>
                            <td style="text-align:right;">
                                <span style="font-size:11px;font-weight:600;color:#3B82F6;font-family:'Helvetica Neue',Arial,sans-serif;">${daysUntil > 0 ? `${daysUntil} days away` : "Today!"}</span>
                            </td>
                        </tr></table>
                    </td>
                </tr>
                <!-- 2-column grid -->
                <tr class="tgrid">
                    ${tripCell("Service Date", formatDate(booking.datetime))}
                    <td style="width:1px;background:#DBEAFE;"></td>
                    ${tripCell("Pickup Time", formatTime(booking.datetime))}
                </tr>
                <tr style="border-top:1px solid #BFDBFE;" class="tgrid">
                    ${tripCell("Passengers", `${booking.passengers} ${booking.passengers > 1 ? "people" : "person"}`)}
                    <td style="width:1px;background:#DBEAFE;"></td>
                    ${tripCell(
                        booking.duration ? "Duration" : "Trip Type",
                        booking.duration
                            ? `${booking.duration} hrs`
                            : isRoundTrip
                              ? "Round Trip"
                              : "One Way",
                    )}
                </tr>
            </table>

            <!-- ── Route Details ────────────────────────────────────────────── -->
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0F172A;font-family:'Helvetica Neue',Arial,sans-serif;">&#128205; Route Details</p>

            <!-- Outbound -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;overflow:hidden;margin-bottom:12px;">
                <tr style="background:#DCFCE7;">
                    <td style="padding:10px 16px;border-bottom:1px solid #BBF7D0;">
                        <span style="font-size:10px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.8px;font-family:'Helvetica Neue',Arial,sans-serif;">
                            &#128652; ${isRoundTrip ? "Outbound Journey" : "Journey Details"}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:16px;">
                        <!-- Pickup -->
                        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:8px;">
                            <tr>
                                <td style="width:30px;vertical-align:top;padding-top:2px;">
                                    <div style="width:26px;height:26px;background:#3B82F6;border-radius:50%;text-align:center;line-height:26px;font-size:13px;color:#fff;">&#128205;</div>
                                </td>
                                <td style="padding-left:10px;vertical-align:top;">
                                    <span style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;font-family:'Helvetica Neue',Arial,sans-serif;">Pickup</span>
                                    <span style="font-size:13px;font-weight:500;color:#0F172A;line-height:1.5;font-family:'Helvetica Neue',Arial,sans-serif;">${booking.pickupAddress || "Not specified"}</span>
                                </td>
                            </tr>
                        </table>
                        <!-- Connector line -->
                        <div style="margin-left:12px;width:2px;height:14px;background:#D1D5DB;margin-bottom:8px;"></div>
                        <!-- Drop-off -->
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="width:30px;vertical-align:top;padding-top:2px;">
                                    <div style="width:26px;height:26px;background:#EF4444;border-radius:50%;text-align:center;line-height:26px;font-size:13px;color:#fff;">&#127937;</div>
                                </td>
                                <td style="padding-left:10px;vertical-align:top;">
                                    <span style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;font-family:'Helvetica Neue',Arial,sans-serif;">Drop-off</span>
                                    <span style="font-size:13px;font-weight:500;color:#0F172A;line-height:1.5;font-family:'Helvetica Neue',Arial,sans-serif;">${booking.dropoffAddress || "Not specified"}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                ${
                    stops.length > 0
                        ? `
                <tr>
                    <td style="padding:12px 16px;background:#FFFBEB;border-top:1px solid #BBF7D0;">
                        <span style="display:block;font-size:10px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;font-family:'Helvetica Neue',Arial,sans-serif;">&#128655; Stops (${stops.length})</span>
                        ${stops
                            .map(
                                (s, i) => `
                        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:${i < stops.length - 1 ? "8px" : "0"};">
                            <tr>
                                <td style="width:26px;vertical-align:top;">
                                    <div style="width:22px;height:22px;background:#F59E0B;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#fff;">${i + 1}</div>
                                </td>
                                <td style="padding-left:10px;font-size:12px;color:#78350F;font-weight:500;font-family:'Helvetica Neue',Arial,sans-serif;">${s}</td>
                            </tr>
                        </table>`,
                            )
                            .join("")}
                    </td>
                </tr>`
                        : ""
                }
            </table>

            <!-- Return journey -->
            ${
                isRoundTrip
                    ? `
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#FDF2F8;border:1px solid #FBCFE8;border-radius:10px;overflow:hidden;margin-bottom:12px;">
                <tr style="background:#FCE7F3;">
                    <td style="padding:10px 16px;border-bottom:1px solid #FBCFE8;">
                        <span style="font-size:10px;font-weight:700;color:#9D174D;text-transform:uppercase;letter-spacing:0.8px;font-family:'Helvetica Neue',Arial,sans-serif;">
                            &#x21A9;&#xFE0F; Return Journey
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:16px;">
                        ${
                            booking.returnDate
                                ? `
                        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;">
                            <tr>
                                <td style="width:30px;vertical-align:top;padding-top:2px;">
                                    <div style="width:26px;height:26px;background:#A855F7;border-radius:50%;text-align:center;line-height:26px;font-size:13px;color:#fff;">&#128197;</div>
                                </td>
                                <td style="padding-left:10px;vertical-align:top;">
                                    <span style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;font-family:'Helvetica Neue',Arial,sans-serif;">Return Date</span>
                                    <span style="font-size:13px;font-weight:500;color:#0F172A;font-family:'Helvetica Neue',Arial,sans-serif;">${formatDate(booking.returnDate)}</span>
                                </td>
                            </tr>
                        </table>`
                                : ""
                        }
                        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:8px;">
                            <tr>
                                <td style="width:30px;vertical-align:top;padding-top:2px;">
                                    <div style="width:26px;height:26px;background:#3B82F6;border-radius:50%;text-align:center;line-height:26px;font-size:13px;color:#fff;">&#128205;</div>
                                </td>
                                <td style="padding-left:10px;vertical-align:top;">
                                    <span style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;font-family:'Helvetica Neue',Arial,sans-serif;">Return Pickup</span>
                                    <span style="font-size:13px;font-weight:500;color:#0F172A;line-height:1.5;font-family:'Helvetica Neue',Arial,sans-serif;">${booking.returnPickupAddress || booking.dropoffAddress || "Not specified"}</span>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-left:12px;width:2px;height:14px;background:#D1D5DB;margin-bottom:8px;"></div>
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="width:30px;vertical-align:top;padding-top:2px;">
                                    <div style="width:26px;height:26px;background:#EF4444;border-radius:50%;text-align:center;line-height:26px;font-size:13px;color:#fff;">&#127937;</div>
                                </td>
                                <td style="padding-left:10px;vertical-align:top;">
                                    <span style="display:block;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;font-family:'Helvetica Neue',Arial,sans-serif;">Return Drop-off</span>
                                    <span style="font-size:13px;font-weight:500;color:#0F172A;line-height:1.5;font-family:'Helvetica Neue',Arial,sans-serif;">${booking.returnDropoffAddress || booking.pickupAddress || "Not specified"}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                ${
                    returnStops.length > 0
                        ? `
                <tr>
                    <td style="padding:12px 16px;background:#FFFBEB;border-top:1px solid #FBCFE8;">
                        <span style="display:block;font-size:10px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;font-family:'Helvetica Neue',Arial,sans-serif;">&#128655; Return Stops (${returnStops.length})</span>
                        ${returnStops
                            .map(
                                (s, i) => `
                        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:${i < returnStops.length - 1 ? "8px" : "0"};">
                            <tr>
                                <td style="width:26px;vertical-align:top;">
                                    <div style="width:22px;height:22px;background:#F59E0B;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#fff;">${i + 1}</div>
                                </td>
                                <td style="padding-left:10px;font-size:12px;color:#78350F;font-weight:500;font-family:'Helvetica Neue',Arial,sans-serif;">${s}</td>
                            </tr>
                        </table>`,
                            )
                            .join("")}
                    </td>
                </tr>`
                        : ""
                }
            </table>`
                    : ""
            }

            <!-- ── Vehicle ──────────────────────────────────────────────────── -->
            <p style="margin:20px 0 12px;font-size:15px;font-weight:700;color:#0F172A;font-family:'Helvetica Neue',Arial,sans-serif;">&#128652; Vehicle Information</p>

            ${
                booking.busDetails
                    ? `
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                <tr>
                    <td style="padding:16px 18px;">
                        <span style="display:block;font-size:10px;font-weight:700;color:#0284C7;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;font-family:'Helvetica Neue',Arial,sans-serif;">Assigned Vehicle</span>
                        <table cellpadding="0" cellspacing="0" width="100%" class="vcol">
                            <tr>
                                <td class="vicon" style="width:62px;vertical-align:top;">
                                    <div style="width:54px;height:54px;background:#0EA5E9;border-radius:12px;text-align:center;line-height:54px;font-size:26px;">&#128652;</div>
                                </td>
                                <td style="padding-left:14px;vertical-align:top;">
                                    <p style="margin:0 0 5px;font-size:17px;font-weight:700;color:#0C4A6E;font-family:'Helvetica Neue',Arial,sans-serif;">${booking.busDetails.name}</p>
                                    <p style="margin:0;font-size:12px;color:#0369A1;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
                                        &#128101; ${booking.busDetails.passengers} passengers
                                        ${booking.busDetails.amenities?.length ? `<br>&#10024; ${booking.busDetails.amenities.join(" &bull; ")}` : ""}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>`
                    : `
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                <tr>
                    <td style="padding:16px 18px;">
                        <span style="display:block;font-size:10px;font-weight:700;color:#DC2626;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;font-family:'Helvetica Neue',Arial,sans-serif;">&#9888;&#65039; Action Required</span>
                        <p style="margin:0 0 3px;font-size:16px;font-weight:700;color:#7F1D1D;font-family:'Helvetica Neue',Arial,sans-serif;">Vehicle Not Assigned</p>
                        <p style="margin:0;font-size:13px;color:#B91C1C;font-family:'Helvetica Neue',Arial,sans-serif;">Please assign a vehicle for ${booking.passengers} passengers</p>
                    </td>
                </tr>
            </table>`
            }

            <!-- ── Next Steps ───────────────────────────────────────────────── -->
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0F172A;font-family:'Helvetica Neue',Arial,sans-serif;">&#9989; Next Steps</p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0F172A;border-radius:10px;overflow:hidden;margin-bottom:8px;">
                <tr>
                    <td style="padding:14px 18px 4px;">
                        <span style="font-size:10px;font-weight:700;letter-spacing:1px;color:#F97316;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Action Plan for Team</span>
                    </td>
                </tr>
                ${actionStep(1, `Contact customer within <strong style="color:#F97316;">2 hours</strong>`)}
                ${actionStep(2, `Verify availability for <strong style="color:#F97316;">${formatDate(booking.datetime)}</strong>`)}
                ${actionStep(3, booking.busDetails ? "Confirm vehicle assignment" : "Assign appropriate vehicle")}
                ${actionStep(4, "Send pricing and payment link")}
                <tr>
                    <td style="padding:11px 18px;vertical-align:top;">
                        <table cellpadding="0" cellspacing="0" width="100%"><tr>
                            <td style="width:28px;vertical-align:top;padding-top:1px;">
                                <div style="width:22px;height:22px;background:#F97316;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#fff;">5</div>
                            </td>
                            <td style="font-size:13px;color:#F1F5F9;font-weight:500;line-height:1.55;padding-left:10px;font-family:'Helvetica Neue',Arial,sans-serif;">
                                Update CRM to <strong style="color:#F97316;">"Contacted"</strong>
                            </td>
                        </tr></table>
                    </td>
                </tr>
            </table>

        </td>
    </tr>

    <!-- ══ FOOTER ════════════════════════════════════════════════════════════ -->
    <tr>
        <td class="ft" style="background:#0F172A;border-radius:0 0 14px 14px;padding:24px;text-align:center;">
            <div style="margin-bottom:12px;">${logoBlock(16, 17)}</div>
            <p style="margin:0 0 6px;color:#94A3B8;font-size:12px;font-family:'Helvetica Neue',Arial,sans-serif;">
                Licensed &nbsp;&bull;&nbsp; Insured &nbsp;&bull;&nbsp; DOT Certified
            </p>
            <p style="margin:0;color:#475569;font-size:11px;line-height:2;font-family:'Helvetica Neue',Arial,sans-serif;">
                Internal Notification &nbsp;|&nbsp; ID: ${booking._id || booking.id || booking.confirmationNumber}<br>
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
        subject: `&#x1F68C; New Inquiry — ${booking.contact?.lastName || "Customer"} — ${booking.confirmationNumber}`,
        html,
    });
};

// Helper function for lead scoring
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
        (new Date(booking.datetime) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (daysUntil <= 14 && daysUntil > 0) score += 15;
    if (daysUntil <= 7 && daysUntil > 0) score += 10;

    return Math.min(score, 100);
};

// Payment Invitation Email (Additional)
export const sendPaymentInvitationEmail = async (booking, paymentLink) => {
    if (!booking.contact?.email) return;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Reservation — ${booking.confirmationNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
    </head>
    <body style="${luxuryStyles.container}">
        
        <div style="${luxuryStyles.header}; padding: 50px 40px;">
            <div style="${luxuryStyles.headerLogo}">
                ✦
            </div>
            <h1 style="${luxuryStyles.headerTitle}; font-size: 36px;">Secure Your Reservation</h1>
            <div style="${luxuryStyles.goldLine}"></div>
        </div>

        <div style="${luxuryStyles.body}; padding: 50px;">
            
            <div style="text-align: center; margin-bottom: 40px;">
                <p style="font-family: 'Cormorant Garamond', serif; font-size: 26px; color: #0A192F; margin: 0 0 15px 0; font-weight: 400;">
                    Dear ${booking.contact?.firstName || "Guest"},
                </p>
                <p style="color: #6B7280; font-size: 15px; margin: 0; line-height: 1.8;">
                    To finalize your reservation, please complete the secure payment process below.
                </p>
            </div>

            <div style="${luxuryStyles.confirmationBox}; margin-bottom: 40px;">
                <p style="${luxuryStyles.confirmationLabel}">Reservation Reference</p>
                <p style="${luxuryStyles.confirmationNumber}">${booking.confirmationNumber}</p>
            </div>

            <div style="text-align: center; margin: 50px 0;">
                <a href="${paymentLink}" 
                   style="display: inline-block; background: #0A192F; color: #FFFFFF; padding: 22px 60px; text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; border: 2px solid #0A192F; box-shadow: 0 10px 30px rgba(10,25,47,0.2);">
                    Complete Secure Payment
                </a>
                <p style="margin-top: 20px; color: #9CA3AF; font-size: 12px; letter-spacing: 1px;">
                    🔒 Encrypted by Stripe • SSL Secure
                </p>
            </div>

            <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 25px; margin: 40px 0;">
                <p style="color: #991B1B; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 10px 0;">
                    Time Sensitive
                </p>
                <p style="color: #7F1D1D; font-size: 14px; margin: 0; line-height: 1.6;">
                    This reservation is held for <strong>24 hours</strong> from receipt of this message. After this period, vehicle availability cannot be guaranteed.
                </p>
            </div>

            <div style="${luxuryStyles.contactSection}; margin-top: 40px;">
                <p style="${luxuryStyles.contactTitle}">Questions?</p>
                <p style="${luxuryStyles.contactDetail}">
                    Concierge: <span style="${luxuryStyles.contactHighlight}">(555) 123-4567</span>
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 15px;">
                    Reference: ${booking.confirmationNumber}
                </p>
            </div>

            <div style="${luxuryStyles.signature}">
                <p style="margin: 0;">With appreciation,</p>
                <p style="margin: 10px 0 0 0; color: #0A192F; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; font-size: 12px; font-style: normal;">
                    CharterBus Concierge
                </p>
            </div>

        </div>

        <div style="${luxuryStyles.footer}">
            <p style="${luxuryStyles.footerBrand}">CharterBus</p>
            <p style="${luxuryStyles.footerText}">
                Premium Transportation Services<br>
                Licensed • Insured • Bonded
            </p>
        </div>
        
    </body>
    </html>
    `;

    return sendEmail({
        email: booking.contact.email,
        subject: `Secure Payment Invitation — ${booking.confirmationNumber}`,
        html,
    });
};

export default {
    sendEmail,
    sendBookingConfirmationEmail,
    sendPaymentInvitationEmail,
    sendLeadNotificationEmail,
};
