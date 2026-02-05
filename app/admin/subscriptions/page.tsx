"use client";
import AdminHeader from "../components/AdminHeader";
import { Check, Zap } from "lucide-react";

export default function SubscriptionsPage() {
    return (
        <>
            <AdminHeader title="Subscription Plans" />
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Basic Plan */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                        <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Starter</h3>
                        <div className="text-3xl font-bold text-white mb-6">Free</div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-zinc-300"><Check className="w-4 h-4 text-emerald-500" /> 1 Listing</li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300"><Check className="w-4 h-4 text-emerald-500" /> 5% Commission</li>
                        </ul>
                        <button className="w-full py-2 border border-zinc-700 rounded-lg text-white text-sm font-bold hover:bg-zinc-800">Edit Plan</button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-zinc-900/50 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                        <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-4">Pro</h3>
                        <div className="text-3xl font-bold text-white mb-6">₹499<span className="text-sm font-normal text-zinc-500">/mo</span></div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Listings</li>
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> 0% Commission</li>
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> Priority Support</li>
                        </ul>
                        <button className="w-full py-2 bg-red-600 rounded-lg text-white text-sm font-bold hover:bg-red-500">Edit Plan</button>
                    </div>
                </div>
            </div>
        </>
    );
}
