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
        secure: port === 465,
        auth: { user, pass },
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
            from: `"LuxCharter" <${process.env.FROM_EMAIL || "concierge@luxcharter.com"}>`,
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

const formatDate = (date) => {
    if (!date) return "To be confirmed";
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const formatTime = (date) => {
    if (!date) return "To be confirmed";
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount || 0);
};

// ==========================================
// LUXURY CUSTOMER CONFIRMATION EMAIL
// ==========================================
export const sendBookingConfirmationEmail = async (booking) => {
    if (!booking.contact?.email) {
        console.warn("📧 No email address provided for booking confirmation");
        return;
    }

    const isRoundTrip = booking.tripType === "round-trip";
    const stops = booking.stops?.filter(s => s) || [];
    const returnStops = booking.returnStops?.filter(s => s) || [];

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed — ${booking.confirmationNumber}</title>
        <style>
            body { margin: 0; padding: 0; background: #F4F6F9; font-family: 'Helvetica Neue', Arial, sans-serif; }
            @media (max-width: 600px) {
                .wrapper { padding: 20px 16px !important; }
                .card { padding: 28px 20px !important; }
                .conf-num { font-size: 22px !important; }
            }
        </style>
    </head>
    <body>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9; padding: 40px 20px;" class="wrapper">
        <tr><td align="center">
        <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

            <!-- Header -->
            <tr>
                <td style="background:#1A2E4A; border-radius:10px 10px 0 0; padding:28px 32px; text-align:center;">
                    <span style="font-size:26px;">🚌</span>
                    <h1 style="margin:8px 0 4px; color:#FFFFFF; font-size:22px; font-weight:700; letter-spacing:0.5px;">
                        Charter Confirmed
                    </h1>
                    <p style="margin:0; color:#A0B4CC; font-size:13px;">
                        Booking #<strong style="color:#F0C84B;">${booking.confirmationNumber}</strong>
                    </p>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="background:#FFFFFF; padding:32px;" class="card">

                    <!-- Greeting -->
                    <p style="margin:0 0 24px; color:#374151; font-size:15px; line-height:1.6;">
                        Hi <strong>${booking.contact?.firstName || "there"}</strong>, your charter bus booking is confirmed. Here's a summary:
                    </p>

                    <!-- Trip Summary -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; margin-bottom:24px;">
                        <tr style="background:#F9FAFB;">
                            <td colspan="2" style="padding:12px 16px; border-bottom:1px solid #E5E7EB;">
                                <span style="font-size:11px; font-weight:700; letter-spacing:1px; color:#6B7280; text-transform:uppercase;">Trip Summary</span>
                            </td>
                        </tr>
                        <tr><td colspan="2" style="padding:12px 16px; border-bottom:1px solid #E5E7EB; background:#F0FDF4;"><span style="font-size:12px; font-weight:700; color:#166534;">${isRoundTrip ? "🔁 Round Trip" : booking.tripType === "hourly" ? "⏱ Hourly Charter" : "➡️ One Way"}</span></td></tr>
                        ${row("📅 Departure", formatDate(booking.datetime))}
                        ${row("⏰ Time", formatTime(booking.datetime))}
                        ${row("👥 Passengers", `${booking.passengers} ${booking.passengers > 1 ? "Passengers" : "Passenger"}`)}
                        ${booking.duration ? row("⏱ Duration", `${booking.duration} Hours`) : ""}
                    </table>

                    <!-- Outbound Trip -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; margin-bottom:16px;">
                        <tr style="background:#EFF6FF;">
                            <td colspan="2" style="padding:12px 16px; border-bottom:1px solid #E5E7EB;">
                                <span style="font-size:11px; font-weight:700; letter-spacing:1px; color:#1D4ED8; text-transform:uppercase;">${isRoundTrip ? "Outbound Trip" : "Trip Route"}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:12px 16px; border-bottom:1px solid #E5E7EB; width:50%;">
                                <span style="font-size:10px; font-weight:600; color:#6B7280; text-transform:uppercase; display:block; margin-bottom:4px;">Pickup</span>
                                <span style="font-size:13px; color:#1F2937; font-weight:500;">${booking.pickupAddress || "Not specified"}</span>
                            </td>
                            <td style="padding:12px 16px; border-bottom:1px solid #E5E7EB; width:50%;">
                                <span style="font-size:10px; font-weight:600; color:#6B7280; text-transform:uppercase; display:block; margin-bottom:4px;">Drop-off</span>
                                <span style="font-size:13px; color:#1F2937; font-weight:500;">${booking.dropoffAddress || "Not specified"}</span>
                            </td>
                        </tr>
                        ${stops.length > 0 ? `
                        <tr>
                            <td colspan="2" style="padding:12px 16px; background:#FFFBEB;">
                                <span style="font-size:10px; font-weight:700; color:#92400E; text-transform:uppercase; display:block; margin-bottom:8px;">🚏 Intermediate Stops (${stops.length})</span>
                                ${stops.map((stop, i) => `<div style="font-size:12px; color:#78350F; padding:4px 0; border-bottom:1px dashed #FDE68A;">${i + 1}. ${stop}</div>`).join('')}
                            </td>
                        </tr>
                        ` : ""}
                    </table>

                    ${isRoundTrip ? `
                    <!-- Return Trip -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; margin-bottom:24px;">
                        <tr style="background:#FDF2F8;">
                            <td colspan="2" style="padding:12px 16px; border-bottom:1px solid #E5E7EB;">
                                <span style="font-size:11px; font-weight:700; letter-spacing:1px; color:#9D174D; text-transform:uppercase;">↩️ Return Trip</span>
                            </td>
                        </tr>
                        ${booking.returnDate ? row("📅 Return Date", formatDate(booking.returnDate)) : ""}
                        ${booking.returnPickupAddress ? row("↩️ Return Pickup", booking.returnPickupAddress) : ""}
                        ${booking.returnDropoffAddress ? row("🏁 Return Drop-off", booking.returnDropoffAddress) : ""}
                        ${returnStops.length > 0 ? `
                        <tr>
                            <td colspan="2" style="padding:12px 16px; background:#FFFBEB;">
                                <span style="font-size:10px; font-weight:700; color:#92400E; text-transform:uppercase; display:block; margin-bottom:8px;">🚏 Return Stops (${returnStops.length})</span>
                                ${returnStops.map((stop, i) => `<div style="font-size:12px; color:#78350F; padding:4px 0; border-bottom:1px dashed #FDE68A;">${i + 1}. ${stop}</div>`).join('')}
                            </td>
                        </tr>
                        ` : ""}
                    </table>
                    ` : ""}

                    <!-- Vehicle -->
                    ${
                        booking.busDetails
                            ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F7FF; border:1px solid #BFDBFE; border-radius:8px; margin-bottom:24px;">
                        <tr>
                            <td style="padding:16px 18px;">
                                <p style="margin:0 0 4px; font-size:11px; font-weight:700; letter-spacing:1px; color:#3B82F6; text-transform:uppercase;">Your Vehicle</p>
                                <p style="margin:0 0 6px; font-size:17px; font-weight:700; color:#1E3A5F;">${booking.busDetails.name}</p>
                                <p style="margin:0; font-size:13px; color:#4B6A88;">
                                    🚌 Up to ${booking.busDetails.passengers} passengers
                                    ${booking.busDetails.amenities?.length ? ` &nbsp;•&nbsp; ${booking.busDetails.amenities.join(" • ")}` : ""}
                                </p>
                            </td>
                        </tr>
                    </table>
                    `
                            : ""
                    }

                    <!-- Pricing -->
                    ${
                        booking.pricing
                            ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr><td colspan="2" style="padding:0 0 12px;"><span style="font-size:11px; font-weight:700; letter-spacing:1px; color:#6B7280; text-transform:uppercase;">Price Details</span></td></tr>
                        ${priceRow("Charter Rate", booking.pricing.baseFare)}
                        ${booking.pricing.fuelSurcharge ? priceRow("Fuel Surcharge", booking.pricing.fuelSurcharge) : ""}
                        ${booking.pricing.driverGratuity ? priceRow("Driver Gratuity", booking.pricing.driverGratuity) : ""}
                        ${booking.pricing.serviceFees ? priceRow("Service Fee", booking.pricing.serviceFees) : ""}
                        <tr>
                            <td style="padding:12px 0 0; border-top:2px solid #1A2E4A;">
                                <strong style="color:#1A2E4A; font-size:15px;">Total</strong>
                            </td>
                            <td style="padding:12px 0 0; border-top:2px solid #1A2E4A; text-align:right;">
                                <strong style="color:#1A2E4A; font-size:20px;">${formatCurrency(booking.pricing.totalAmount)}</strong>
                            </td>
                        </tr>
                    </table>
                    `
                            : ""
                    }

                    <!-- Notice -->
                    <div style="background:#FFFBEB; border-left:4px solid #F0C84B; border-radius:0 6px 6px 0; padding:14px 16px; margin-bottom:24px;">
                        <p style="margin:0; font-size:13px; color:#92400E; line-height:1.6;">
                            ⏳ <strong>Payment link incoming.</strong> A secure payment invitation will be sent within <strong>2 hours</strong>. Your bus is held for <strong>24 hours</strong>.
                        </p>
                    </div>

                    <!-- Contact -->
                    <p style="margin:0; font-size:13px; color:#6B7280; text-align:center; line-height:1.8;">
                        Questions? Reach us at
                        <a href="tel:5551234567" style="color:#1A2E4A; font-weight:600; text-decoration:none;">(555) 123-4567</a>
                        or
                        <a href="mailto:support@luxcharter.com" style="color:#1A2E4A; font-weight:600; text-decoration:none;">support@luxcharter.com</a>
                    </p>

                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background:#1A2E4A; border-radius:0 0 10px 10px; padding:20px 32px; text-align:center;">
                    <p style="margin:0 0 6px; color:#FFFFFF; font-weight:700; font-size:15px; letter-spacing:0.5px;">🚌 LuxCharter</p>
                    <p style="margin:0 0 12px; color:#A0B4CC; font-size:11px;">Licensed • Insured • DOT Certified</p>
                    <p style="margin:0; color:#6B7280; font-size:11px;">
                        © ${new Date().getFullYear()} LuxCharter Inc. &nbsp;|&nbsp;
                        <a href="https://luxcharter.com/terms" style="color:#6B7280;">Terms</a> &nbsp;|&nbsp;
                        <a href="https://luxcharter.com/privacy" style="color:#6B7280;">Privacy</a><br><br>
                        Sent to ${booking.contact.email}
                    </p>
                </td>
            </tr>

        </table>
        </td></tr>
        </table>
    </body>
    </html>
    `;

    return sendEmail({
        email: booking.contact.email,
        subject: `Charter Confirmed 🚌 — ${booking.confirmationNumber}`,
        html,
    });
};

// Helper: detail row
const row = (label, value) =>
    value
        ? `
    <tr>
        <td style="padding:10px 16px; font-size:13px; color:#6B7280; border-bottom:1px solid #F3F4F6; width:42%;">${label}</td>
        <td style="padding:10px 16px; font-size:13px; color:#111827; font-weight:500; border-bottom:1px solid #F3F4F6;">${value}</td>
    </tr>`
        : "";

// Helper: price row
const priceRow = (label, amount) => `
    <tr>
        <td style="padding:6px 0; font-size:13px; color:#6B7280;">${label}</td>
        <td style="padding:6px 0; font-size:13px; color:#374151; text-align:right;">${formatCurrency(amount)}</td>
    </tr>`;

// ==========================================
// LUXURY LEAD NOTIFICATION EMAIL (Internal)
// ==========================================
export const sendLeadNotificationEmail = async (booking) => {
    const leadScore = calculateLeadScore(booking);
    const priority =
        leadScore > 80 ? "PRIORITY" : leadScore > 50 ? "STANDARD" : "ROUTINE";
    const priorityColor =
        leadScore > 80 ? "#DC2626" : leadScore > 50 ? "#D97706" : "#059669";
    const responseTime = leadScore > 80 ? "15 min" : "2 hours";
    const daysUntil = Math.ceil(
        (new Date(booking.datetime) - new Date()) / 86400000,
    );
    const isHighValue = booking.pricing?.totalAmount > 2000;
    const isRoundTrip = booking.tripType === "round-trip";
    const stops = booking.stops?.filter(s => s) || [];
    const returnStops = booking.returnStops?.filter(s => s) || [];

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${priority} Lead — ${booking.confirmationNumber}</title>
        <style>
            body { margin: 0; padding: 0; background: #F4F6F9; font-family: 'Helvetica Neue', Arial, sans-serif; }
            @media (max-width: 600px) {
                .card { padding: 24px 16px !important; }
                .stack { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
            }
        </style>
    </head>
    <body>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9; padding:32px 20px;">
        <tr><td align="center">
        <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

            <!-- Priority Header -->
            <tr>
                <td style="background:${priorityColor}; border-radius:10px 10px 0 0; padding:24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <p style="margin:0 0 4px; font-size:11px; font-weight:700; letter-spacing:2px; color:rgba(255,255,255,0.85); text-transform:uppercase;">New Charter Inquiry 🚌</p>
                                <p style="margin:0; font-size:26px; font-weight:700; color:#FFFFFF;">${priority}</p>
                                <p style="margin:6px 0 0; font-size:12px; color:rgba(255,255,255,0.8);">
                                    Respond within <strong style="color:#FFFFFF;">${responseTime}</strong> &nbsp;•&nbsp;
                                    ${new Date().toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} EST
                                </p>
                            </td>
                            <td style="text-align:right; white-space:nowrap;">
                                <div style="display:inline-block; background:rgba(255,255,255,0.2); border-radius:8px; padding:10px 18px; text-align:center;">
                                    <p style="margin:0; font-size:10px; font-weight:700; letter-spacing:1px; color:rgba(255,255,255,0.8); text-transform:uppercase;">Score</p>
                                    <p style="margin:4px 0 0; font-size:28px; font-weight:800; color:#FFFFFF; line-height:1;">${leadScore}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Quick Actions -->
            <tr>
                <td style="background:#FFFFFF; padding:16px 28px; border-bottom:1px solid #E5E7EB;">
                    <a href="tel:${booking.contact?.phone}" style="display:inline-block; background:#1A2E4A; color:#FFFFFF; padding:10px 20px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; text-decoration:none; border-radius:5px; margin-right:10px;">📞 Call</a>
                    <a href="mailto:${booking.contact?.email}" style="display:inline-block; background:#F3F4F6; color:#1A2E4A; padding:10px 20px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; text-decoration:none; border-radius:5px; border:1px solid #E5E7EB;">✉️ Email</a>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="background:#FFFFFF; padding:28px;" class="card">

                    <!-- Guest + Trip side by side -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                            <!-- Guest -->
                            <td style="width:48%; vertical-align:top; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px; padding:16px;" class="stack">
                                <p style="margin:0 0 10px; font-size:11px; font-weight:700; letter-spacing:1px; color:#6B7280; text-transform:uppercase;">Guest</p>
                                <p style="margin:0 0 4px; font-size:16px; font-weight:700; color:#111827;">${booking.contact?.firstName} ${booking.contact?.lastName}</p>
                                <p style="margin:0 0 4px; font-size:13px; color:#1A2E4A; font-weight:600;">${booking.contact?.phone}</p>
                                <p style="margin:0 0 10px; font-size:12px; color:#6B7280;">${booking.contact?.email}</p>
                                <p style="margin:0; font-family:'Courier New', monospace; font-size:13px; font-weight:700; color:#1A2E4A; letter-spacing:1px;">${booking.confirmationNumber}</p>
                            </td>
                            <td style="width:4%;" class="stack"></td>
                            <!-- Trip -->
                            <td style="width:48%; vertical-align:top; background:#F0F7FF; border:1px solid #BFDBFE; border-radius:8px; padding:16px;" class="stack">
                                <p style="margin:0 0 10px; font-size:11px; font-weight:700; letter-spacing:1px; color:#3B82F6; text-transform:uppercase;">Trip</p>
                                <p style="margin:0 0 4px; font-size:12px; font-weight:600; color:#1E3A5F;">
                                    <span style="background:${isRoundTrip ? "#FDF2F8; color:#9D174D;" : "#F0FDF4; color:#166534;"}; padding:2px 8px; border-radius:4px; font-size:10px;">${isRoundTrip ? "🔁 Round Trip" : booking.tripType === "hourly" ? "⏱ Hourly" : "➡️ One Way"}</span>
                                </p>
                                <p style="margin:6px 0 4px; font-size:12px; color:#4B6A88;">📅 ${formatDate(booking.datetime)}</p>
                                <p style="margin:0 0 4px; font-size:12px; color:#4B6A88;">👥 ${booking.passengers} passengers</p>
                                ${booking.duration ? `<p style="margin:0; font-size:12px; color:#4B6A88;">⏱ ${booking.duration} Hours</p>` : ""}
                            </td>
                        </tr>
                    </table>

                    <!-- Route Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                            <td style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:14px;">
                                <p style="margin:0 0 10px; font-size:11px; font-weight:700; letter-spacing:1px; color:#166534; text-transform:uppercase;">${isRoundTrip ? "Outbound Route" : "Route"}</p>
                                <p style="margin:0 0 6px; font-size:12px; color:#15803D;"><strong>📍 Pickup:</strong> ${booking.pickupAddress || "Not specified"}</p>
                                <p style="margin:0 0 6px; font-size:12px; color:#15803D;"><strong>🏁 Drop-off:</strong> ${booking.dropoffAddress || "Not specified"}</p>
                                ${stops.length > 0 ? `
                                <p style="margin:8px 0 4px; font-size:11px; font-weight:700; color:#92400E;">🚏 Stops (${stops.length}):</p>
                                ${stops.map((stop, i) => `<p style="margin:2px 0; font-size:11px; color:#78350F; padding-left:12px;">${i + 1}. ${stop}</p>`).join('')}
                                ` : ""}
                            </td>
                        </tr>
                    </table>

                    ${isRoundTrip ? `
                    <!-- Return Route -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                            <td style="background:#FDF2F8; border:1px solid #FBCFE8; border-radius:8px; padding:14px;">
                                <p style="margin:0 0 10px; font-size:11px; font-weight:700; letter-spacing:1px; color:#9D174D; text-transform:uppercase;">↩️ Return Trip</p>
                                ${booking.returnDate ? `<p style="margin:0 0 6px; font-size:12px; color:#9D174D;"><strong>📅 Return:</strong> ${formatDate(booking.returnDate)}</p>` : ""}
                                ${booking.returnPickupAddress ? `<p style="margin:0 0 6px; font-size:12px; color:#9D174D;"><strong>📍 From:</strong> ${booking.returnPickupAddress}</p>` : ""}
                                ${booking.returnDropoffAddress ? `<p style="margin:0 0 6px; font-size:12px; color:#9D174D;"><strong>🏁 To:</strong> ${booking.returnDropoffAddress}</p>` : ""}
                                ${returnStops.length > 0 ? `
                                <p style="margin:8px 0 4px; font-size:11px; font-weight:700; color:#92400E;">🚏 Return Stops (${returnStops.length}):</p>
                                ${returnStops.map((stop, i) => `<p style="margin:2px 0; font-size:11px; color:#78350F; padding-left:12px;">${i + 1}. ${stop}</p>`).join('')}
                                ` : ""}
                            </td>
                        </tr>
                    </table>
                    ` : ""}

                    <!-- Value + Vehicle -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                        <tr>
                            <!-- Value -->
                            <td style="width:48%; vertical-align:top; background:${isHighValue ? "#FFFBEB" : "#F0FDF4"}; border:1px solid ${isHighValue ? "#FCD34D" : "#BBF7D0"}; border-radius:8px; padding:16px;" class="stack">
                                <p style="margin:0 0 6px; font-size:11px; font-weight:700; letter-spacing:1px; color:${isHighValue ? "#92400E" : "#166534"}; text-transform:uppercase;">Est. Value</p>
                                <p style="margin:0; font-size:28px; font-weight:800; color:${isHighValue ? "#78350F" : "#14532D"};">${formatCurrency(booking.pricing?.totalAmount)}</p>
                                ${isHighValue ? `<span style="display:inline-block; margin-top:8px; background:#DC2626; color:#FFF; padding:3px 8px; font-size:10px; font-weight:700; letter-spacing:1px; border-radius:4px;">HIGH VALUE</span>` : ""}
                            </td>
                            <td style="width:4%;" class="stack"></td>
                            <!-- Vehicle -->
                            <td style="width:48%; vertical-align:top; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px; padding:16px;" class="stack">
                                <p style="margin:0 0 6px; font-size:11px; font-weight:700; letter-spacing:1px; color:#6B7280; text-transform:uppercase;">Vehicle</p>
                                <p style="margin:0 0 6px; font-size:15px; font-weight:700; color:#111827;">${booking.busDetails?.name || "⚠️ Assign Vehicle"}</p>
                                ${booking.busDetails?.passengers ? `<p style="margin:0 0 4px; font-size:12px; color:#6B7280;">👥 ${booking.busDetails.passengers} seats</p>` : ""}
                                ${booking.busDetails?.amenities ? `<p style="margin:0; font-size:11px; color:#6B7280;">${booking.busDetails.amenities.slice(0, 3).join(" • ")}</p>` : ""}
                            </td>
                        </tr>
                    </table>

                    <!-- Lead Intel -->
                    <div style="background:#FAF5FF; border-left:4px solid #A855F7; border-radius:0 8px 8px 0; padding:14px 16px; margin-bottom:20px;">
                        <p style="margin:0 0 8px; font-size:11px; font-weight:700; letter-spacing:1px; color:#7C3AED; text-transform:uppercase;">Lead Intelligence</p>
                        <p style="margin:0; font-size:13px; color:#6B21A8; line-height:1.9;">
                            🧩 ${booking.passengers > 30 ? "Large group — Corporate/Wedding" : booking.passengers > 15 ? "Medium group — Event" : "Small group — Executive"}<br>
                            💰 ${isHighValue ? "Premium tier" : "Standard tier"} &nbsp;•&nbsp; 📅 ${daysUntil} days until service<br>
                            🌐 Source: Website inquiry form
                        </p>
                    </div>

                    <!-- Action Plan -->
                    <div style="background:#1A2E4A; border-radius:8px; padding:20px 24px;">
                        <p style="margin:0 0 12px; font-size:11px; font-weight:700; letter-spacing:2px; color:#F0C84B; text-transform:uppercase;">Action Plan</p>
                        ${[
                            `Call guest within <strong style="color:#F0C84B;">${responseTime}</strong>`,
                            `Check availability for <strong style="color:#F0C84B;">${formatDate(booking.datetime)}</strong>`,
                            "Send personalized payment invitation",
                            'Update CRM → <strong style="color:#F0C84B;">Contacted</strong>',
                            "Follow up in 24 hrs if no response",
                        ]
                            .map(
                                (step, i) => `
                        <p style="margin:0 0 8px; font-size:13px; color:rgba(255,255,255,0.9); display:flex; gap:10px;">
                            <span style="color:#F0C84B; font-weight:700; min-width:16px;">${i + 1}.</span> ${step}
                        </p>`,
                            )
                            .join("")}
                    </div>

                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background:#E5E7EB; border-radius:0 0 10px 10px; padding:14px 28px; text-align:center;">
                    <p style="margin:0; font-size:11px; color:#9CA3AF; letter-spacing:1px;">
                        LuxCharter Internal &nbsp;•&nbsp; Dispatch ID: ${booking.confirmationNumber}-${Date.now().toString().slice(-4)}
                    </p>
                </td>
            </tr>

        </table>
        </td></tr>
        </table>
    </body>
    </html>
    `;

    return sendEmail({
        email: process.env.DISPATCH_EMAIL || "dispatch@luxcharter.com",
        subject: `${priority} 🚌 ${booking.contact?.lastName} — ${formatCurrency(booking.pricing?.totalAmount || 0)} — ${booking.confirmationNumber}`,
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
                    LuxCharter Concierge
                </p>
            </div>

        </div>

        <div style="${luxuryStyles.footer}">
            <p style="${luxuryStyles.footerBrand}">LuxCharter</p>
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
