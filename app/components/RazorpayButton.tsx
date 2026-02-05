"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface RazorpayButtonProps {
    amount: number;
    currency?: string;
    description?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    onSuccess: (paymentId: string) => void;
    onFailure?: (error: any) => void;
    className?: string;
    children?: React.ReactNode;
}

export default function RazorpayButton({
    amount, // In paise/units (e.g. 100 = 1 INR) -> No, standard usage often passes base unit, let's clarify. Usually razorpay expects Paise.
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
        if (!(window as any).Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
            await new Promise((resolve) => (script.onload = resolve));
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890", // Test Key Fallback
            amount: amount * 100, // Convert INR to Paise
            currency,
            name: "Parkvoid India",
            description,
            image: "/logo.png", // Ensure this exists or use a default
            handler: function (response: any) {
                setLoading(false);
                onSuccess(response.razorpay_payment_id);
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
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
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
