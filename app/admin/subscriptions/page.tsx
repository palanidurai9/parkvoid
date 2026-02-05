"use client";
import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { Check, Zap, X } from "lucide-react";

export default function SubscriptionsPage() {
    const [editingPlan, setEditingPlan] = useState<{ name: string; price: string } | null>(null);

    const handleEdit = (name: string, price: string) => {
        setEditingPlan({ name, price });
    };

    const handleSave = () => {
        alert("Plan updated successfully! (This is a mock action)");
        setEditingPlan(null);
    };

    return (
        <>
            <AdminHeader title="Subscription Plans" />
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide relative">
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                        <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Free Host</h3>
                        <div className="text-3xl font-bold text-white mb-6">₹0<span className="text-sm font-normal text-zinc-500">/mo</span></div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-zinc-300"><Check className="w-4 h-4 text-emerald-500" /> Max 1 Slot</li>
                            <li className="flex items-center gap-2 text-sm text-zinc-300"><Check className="w-4 h-4 text-emerald-500" /> 15% Commission</li>
                        </ul>
                        <button
                            onClick={() => handleEdit('Free Host', '0')}
                            className="w-full py-2 border border-zinc-700 rounded-lg text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
                        >
                            Edit Plan
                        </button>
                    </div>

                    {/* Starter Plan */}
                    <div className="bg-zinc-900/50 border border-brand-teal/30 rounded-2xl p-6 relative overflow-hidden">
                        <h3 className="text-brand-teal font-bold uppercase tracking-widest text-xs mb-4">Starter Host</h3>
                        <div className="text-3xl font-bold text-white mb-6">₹499<span className="text-sm font-normal text-zinc-500">/mo</span></div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> Max 2 Slots</li>
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> 10% Commission</li>
                        </ul>
                        <button
                            onClick={() => handleEdit('Starter Host', '499')}
                            className="w-full py-2 bg-brand-teal/20 text-brand-teal border border-brand-teal/50 rounded-lg text-sm font-bold hover:bg-brand-teal/30 transition-colors"
                        >
                            Edit Plan
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-zinc-900/50 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                        <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">Pro Host</h3>
                        <div className="text-3xl font-bold text-white mb-6">₹1499<span className="text-sm font-normal text-zinc-500">/mo</span></div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> Max 10 Slots</li>
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> 5% Commission</li>
                            <li className="flex items-center gap-2 text-sm text-white"><Check className="w-4 h-4 text-emerald-500" /> Priority Support</li>
                        </ul>
                        <button
                            onClick={() => handleEdit('Pro Host', '1499')}
                            className="w-full py-2 bg-blue-600 rounded-lg text-white text-sm font-bold hover:bg-blue-500 transition-colors"
                        >
                            Edit Plan
                        </button>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingPlan && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Edit {editingPlan.name}</h3>
                                <button onClick={() => setEditingPlan(null)} className="text-zinc-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Plan Name</label>
                                    <input
                                        type="text"
                                        defaultValue={editingPlan.name}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-teal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Monthly Price (₹)</label>
                                    <input
                                        type="text"
                                        defaultValue={editingPlan.price}
                                        className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-teal"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setEditingPlan(null)}
                                        className="flex-1 py-3 rounded-lg font-bold text-zinc-400 hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-3 bg-brand-teal rounded-lg font-bold text-white hover:bg-opacity-90 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
