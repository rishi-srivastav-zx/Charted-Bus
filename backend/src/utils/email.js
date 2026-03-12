import nodemailer from "nodemailer";

const createTransporter = () => {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        console.warn("⚠️  SMTP credentials not configured. Emails will not be sent.");
        return null;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
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
            from: process.env.FROM_EMAIL || "noreply@luxcharter.com",
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

export const sendBookingConfirmationEmail = async (booking) => {
    if (!booking.contact?.email) {
        console.warn("📧 No email address provided for booking confirmation");
        return;
    }

    const formatDate = (date) => {
        if (!date) return "N/A";
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

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for choosing LuxCharter</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Confirmation Number</p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2563eb;">${booking.confirmationNumber}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Trip Details</h3>
                <p style="margin: 8px 0;"><strong>Trip Type:</strong> ${booking.tripType}</p>
                <p style="margin: 8px 0;"><strong>Event Type:</strong> ${booking.orderType}</p>
                <p style="margin: 8px 0;"><strong>Pickup:</strong> ${booking.pickupAddress}</p>
                <p style="margin: 8px 0;"><strong>Dropoff:</strong> ${booking.dropoffAddress}</p>
                <p style="margin: 8px 0;"><strong>Date & Time:</strong> ${formatDate(booking.datetime)}</p>
                <p style="margin: 8px 0;"><strong>Passengers:</strong> ${booking.passengers}</p>
                ${booking.duration ? `<p style="margin: 8px 0;"><strong>Duration:</strong> ${booking.duration} hours</p>` : ""}
            </div>

            ${booking.busDetails ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Vehicle Details</h3>
                <p style="margin: 8px 0;"><strong>Vehicle:</strong> ${booking.busDetails.name}</p>
                <p style="margin: 8px 0;"><strong>Passenger Capacity:</strong> ${booking.busDetails.passengers}</p>
            </div>
            ` : ""}

            ${booking.pricing ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Pricing</h3>
                <p style="margin: 8px 0;"><strong>Base Fare:</strong> $${booking.pricing.baseFare}</p>
                <p style="margin: 8px 0;"><strong>Fuel Surcharge:</strong> $${booking.pricing.fuelSurcharge}</p>
                <p style="margin: 8px 0;"><strong>Driver Gratuity:</strong> $${booking.pricing.driverGratuity.toFixed(2)}</p>
                <p style="margin: 8px 0;"><strong>Service Fees:</strong> $${booking.pricing.serviceFees}</p>
                <p style="margin: 8px 0; font-size: 18px; font-weight: bold; color: #2563eb;"><strong>Total:</strong> $${booking.pricing.totalAmount.toFixed(2)}</p>
            </div>
            ` : ""}

            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #a7f3d0;">
                <p style="margin: 0; color: #065f46; font-size: 14px;">Our dispatch team will review your booking and send you a payment link shortly.</p>
            </div>

            <p style="color: #6b7280; font-size: 12px; text-align: center;">
                If you have any questions, please contact us at support@luxcharter.com
            </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} LuxCharter Inc. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;

    return sendEmail({
        email: booking.contact.email,
        subject: `Booking Confirmed - ${booking.confirmationNumber}`,
        html,
    });
};

export const sendPaymentLinkEmail = async (booking, paymentLink) => {
    if (!booking.contact?.email) return;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Payment Link</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563eb; padding: 30px; border-radius: 12px; text-align: center;">
            <h1 style="color: white; margin: 0;">Complete Your Payment</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
            <p>Hi ${booking.contact.firstName},</p>
            <p>Thank you for booking with LuxCharter. Your booking confirmation is <strong>${booking.confirmationNumber}</strong>.</p>
            <p>Please complete your payment to confirm your reservation.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentLink}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Pay Now
                </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
                If you didn't make this booking, please ignore this email.
            </p>
        </div>
    </body>
    </html>
    `;

    return sendEmail({
        email: booking.contact.email,
        subject: `Payment Required - ${booking.confirmationNumber}`,
        html,
    });
};

export default { sendEmail, sendBookingConfirmationEmail, sendPaymentLinkEmail };
