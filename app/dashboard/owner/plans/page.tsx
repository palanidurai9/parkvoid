"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/lib/store";
import { SubscriptionPlan, Subscription, Invoice } from "@/lib/types";
import { Check, Shield, Zap, Star, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const PLANS = [
    {
        id: 'free' as SubscriptionPlan,
        name: 'Free Host',
        price: 0,
        slots: 1,
        commission: 15,
        features: ['Max 1 Parking Slot', '15% Commission', 'Standard Ranking', 'Basic Dashboard', 'Booking Calendar', 'No Analytics Export'],
        color: 'border-white/20',
        bg: 'bg-white/5',
        badge: 'bg-gray-600',
    },
    {
        id: 'starter' as SubscriptionPlan,
        name: 'Starter Host',
        price: 499,
        slots: 2,
        commission: 10,
        features: ['Max 2 Parking Slots', '10% Commission', 'Standard Ranking', 'Booking Calendar', 'Basic Earnings Dashboard'],
        color: 'border-brand-teal',
        bg: 'bg-brand-teal/10',
        badge: 'bg-brand-teal',
    },
    {
        id: 'pro' as SubscriptionPlan,
        name: 'Pro Host',
        price: 1499,
        slots: 10,
        commission: 5,
        features: ['Max 10 Parking Slots', '5% Commission', 'Priority Ranking', 'Earnings PDF Export', 'Support Badge'],
        color: 'border-blue-400',
        bg: 'bg-blue-400/10',
        badge: 'bg-blue-400',
        recommended: true
    }
];

export default function PlansPage() {
    const { user, login } = useAuth(); // We need to refresh user to update plan in UI
    const router = useRouter();
    const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('starter');
    const [loading, setLoading] = useState(false);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.subscriptionPlan) {
            setCurrentPlan(user.subscriptionPlan);
        }
    }, [user]);

    const handleSubscribe = async (plan: typeof PLANS[0]) => {
        if (!user) return;
        setLoading(true);
        setProcessingPlan(plan.id);

        // Mock Razorpay Payment
        setTimeout(() => {
            // 1. Update User Plan
            const updatedUser = { ...user, subscriptionPlan: plan.id, subscriptionStatus: 'active' as const };
            db.users.update(updatedUser);

            // Update in DB
            db.subscriptions.create({
                id: uuidv4(),
                ownerId: user.id,
                plan: plan.id,
                amount: plan.price,
                status: 'active',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
                autoRenew: true
            });

            // Add Invoice
            db.invoices.add({
                id: uuidv4(),
                ownerId: user.id,
                subscriptionId: 'new',
                amount: plan.price,
                date: new Date().toISOString(),
                status: 'paid',
                pdfUrl: '#'
            });

            alert(`Successfully subscribed to ${plan.name}!`);

            // Force reload to pick up changes since AuthContext is simple
            //Ideally we should have an updateProfile method in context
            window.location.reload();
        }, 2000);
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
            <p className="text-brand-gray mb-1">Choose the perfect plan for your parking business</p>
            <p className="text-xs text-brand-gray/50 mb-8">* All prices are excluding 18% GST</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => {
                    const isCurrent = currentPlan === plan.id;
                    return (
                        <div
                            key={plan.id}
                            className={`relative bg-white/5 border-2 rounded-2xl p-6 flex flex-col transition-all hover:scale-105 ${isCurrent ? plan.color : 'border-transparent hover:border-white/20'}`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className={`text-xl font-bold ${isCurrent ? 'text-white' : 'text-gray-200'}`}>{plan.name}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">₹{plan.price}</span>
                                    <span className="text-brand-gray text-sm">/ month</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl mb-6 ${plan.bg} bg-opacity-10 border border-white/5`}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">Slot Limit</span>
                                    <span className="font-bold text-white">{plan.slots === -1 ? 'Unlimited' : plan.slots}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">Commission</span>
                                    <span className="font-bold text-white">{plan.commission}%</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className={`w-4 h-4 mt-0.5 ${plan.id === 'starter' ? 'text-brand-teal' : plan.id === 'pro' ? 'text-blue-400' : 'text-purple-400'}`} />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !isCurrent && handleSubscribe(plan)}
                                disabled={isCurrent || loading}
                                className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2
                                    ${isCurrent
                                        ? 'bg-white/10 text-gray-400 cursor-default'
                                        : 'bg-white text-brand-navy hover:bg-gray-200'
                                    }
                                `}
                            >
                                {loading && processingPlan === plan.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isCurrent ? (
                                    "Current Plan"
                                ) : (
                                    "Upgrade Plan"
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                <h3 className="text-lg font-bold mb-2">Needs Enterprise Solutions?</h3>
                <p className="text-brand-gray text-sm mb-4">For parking lots with 50+ slots or multi-city chains.</p>
                <button className="text-brand-teal font-bold hover:underline">Contact Sales</button>
            </div>
        </div>
    );
}
