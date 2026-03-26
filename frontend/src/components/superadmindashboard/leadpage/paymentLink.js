"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
    CreditCard,
    X,
    User,
    Navigation,
    Copy,
    CheckCircle,
    Send,
    Loader2,
} from "lucide-react";

const PaymentLinkModal = ({ lead, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const paymentLink = `https://pay.yourdomain.com/booking/${lead.confirmationNumber || lead._id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendEmail = async () => {
        setSending(true);
        try {
            // TODO: replace with real API → await sendPaymentEmail(lead._id, paymentLink)
            await new Promise((r) => setTimeout(r, 1500));
            setSent(true);
            toast.success(
                "Payment link sent to " + (lead.contact?.email || "customer"),
            );
        } catch {
            toast.error("Failed to send payment link. Try again.");
        } finally {
            setSending(false);
        }
    };

    const formatCurrency = (amount = 0, currency = "USD") => {
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }).format(amount);
        } catch {
            return `$${amount}`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Send Payment Link
                            </h2>
                            <p className="text-xs text-gray-500">
                                #{lead.confirmationNumber || "N/A"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Customer summary */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {lead.contact?.firstName || "N/A"}{" "}
                                {lead.contact?.lastName || ""}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {lead.contact?.email || "No email"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {lead.contact?.phone || "No phone"}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="text-base font-bold text-gray-900">
                                {formatCurrency(
                                    lead.pricing?.totalAmount || 0,
                                    lead.pricing?.currency || "USD",
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2 text-gray-600">
                            <Navigation className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-xs text-gray-400 block">
                                    From
                                </span>
                                <span className="font-medium text-gray-800">
                                    {lead.pickupAddress || "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600 pl-6">
                            <div>
                                <span className="text-xs text-gray-400 block">
                                    To
                                </span>
                                <span className="font-medium text-gray-800">
                                    {lead.dropoffAddress || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment link */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                            Payment Link
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <span className="text-xs text-gray-600 flex-1 truncate">
                                {paymentLink}
                            </span>
                            <button
                                onClick={handleCopy}
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    copied
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {copied ? (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    {/* Send button */}
                    {!sent ? (
                        <button
                            onClick={handleSendEmail}
                            disabled={sending}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-sm text-sm"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                    Sending Email...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Send Payment
                                    Link via Email
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-xl text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Payment link sent successfully!
                        </div>
                    )}

                    <p className="text-center text-xs text-gray-400">
                        Customer will receive a secure link to complete the
                        payment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentLinkModal;
