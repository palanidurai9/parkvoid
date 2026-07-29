"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface RazorpayButtonProps {
    amount: number;
    orderId: string;
    currency?: string;
    description?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
    onFailure?: (error: unknown) => void;
    className?: string;
    children?: React.ReactNode;
}

type RazorpayResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
};

type RazorpayInstance = {
    on: (event: 'payment.failed', callback: (response: { error: unknown }) => void) => void;
    open: () => void;
};

type RazorpayConstructor = new (options: {
    key?: string;
    amount: number;
    order_id: string;
    currency: string;
    name: string;
    description: string;
    image: string;
    handler: (response: RazorpayResponse) => void;
    prefill: { name: string; email: string; contact: string };
    notes: { address: string };
    theme: { color: string };
    modal: { ondismiss: () => void };
}) => RazorpayInstance;

declare global {
    interface Window {
        Razorpay?: RazorpayConstructor;
    }
}

export default function RazorpayButton({
    amount, // In paise/units (e.g. 100 = 1 INR) -> No, standard usage often passes base unit, let's clarify. Usually razorpay expects Paise.
    orderId,
    // Let's assume input is INR for simplicity in component usage, we multiply by 100.
    currency = "INR",
    description = "Parkvoid Payment",
    prefill,
    onSuccess,
    onFailure,
    className = "",
    children
}: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        // 1. Load Razorpay Script if not present
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
            await new Promise((resolve) => (script.onload = resolve));
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: amount * 100, // Convert INR to Paise
            order_id: orderId,
            currency,
            name: "Parkvoid India",
            description,
            image: "/logo.png", // Ensure this exists or use a default
            handler: function (response: RazorpayResponse) {
                setLoading(false);
                onSuccess(response);
            },
            prefill: {
                name: prefill?.name || "",
                email: prefill?.email || "",
                contact: prefill?.contact || "",
            },
            notes: {
                address: "Chennai, TN",
            },
            theme: {
                color: "#18C7AE", // Brand Teal
            },
            modal: {
                ondismiss: function () {
                    setLoading(false);
                    if (onFailure) onFailure("Payment Cancelled");
                }
            }
        };

        try {
            if (!window.Razorpay) throw new Error('Razorpay checkout could not be loaded.');
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                if (onFailure) onFailure(response.error);
                setLoading(false);
            });
            rzp.open();
        } catch (error) {
            console.error("Razorpay Error:", error);
            setLoading(false);
            if (onFailure) onFailure(error);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={`${className} ${loading ? 'opacity-70 cursor-wait' : ''}`}
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : children || "Pay Now"}
        </button>
    );
}
