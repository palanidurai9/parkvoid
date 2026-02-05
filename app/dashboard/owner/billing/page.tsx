"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/lib/store";
import { Invoice, Subscription } from "@/lib/types";
import { Download, CreditCard, Calendar, RefreshCcw } from "lucide-react";

export default function BillingPage() {
    const { user } = useAuth();
    const [sub, setSub] = useState<Subscription | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        if (!user) return;

        const mySub = db.subscriptions.getByOwner(user.id);
        setSub(mySub || null);

        const myInvoices = db.invoices.getByOwner(user.id);
        setInvoices(myInvoices);
    }, [user]);

    if (!user) return null;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

            {/* Active Subscription Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <p className="text-brand-gray text-sm uppercase tracking-wider mb-1">Current Plan</p>
                        <h2 className="text-2xl font-bold capitalize flex items-center gap-2">
                            {sub?.plan || user.subscriptionPlan || 'Free'} Plan
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${(sub?.status === 'active' || user.subscriptionStatus === 'active') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {sub?.status || user.subscriptionStatus || 'Inactive'}
                            </span>
                        </h2>
                    </div>
                    {/* Status Badge */}
                    <div className="text-right">
                        <p className="text-brand-gray text-sm">Next Billing Date</p>
                        <p className="text-xl font-bold">{sub ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <CreditCard className="w-5 h-5 text-brand-teal" />
                        </div>
                        <div>
                            <p className="text-xs text-brand-gray">Payment Method</p>
                            <p className="text-sm font-bold">Ended with 4242</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-brand-gray">Billing Cycle</p>
                            <p className="text-sm font-bold">Monthly</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <RefreshCcw className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div>
                                <p className="text-xs text-brand-gray">Auto Renew</p>
                                <p className="text-sm font-bold">{sub?.autoRenew ? 'On' : 'Off'}</p>
                            </div>
                            <div className="ml-auto">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={sub?.autoRenew} readOnly className="sr-only peer" />
                                    <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-teal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice History */}
            <h3 className="text-xl font-bold mb-4">Invoice History</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-brand-gray text-xs uppercase">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Plan</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Download</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {invoices.length > 0 ? invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="p-4 font-bold">₹{inv.amount}</td>
                                <td className="p-4 text-sm capitalize">{sub?.plan || 'Subscription'}</td>
                                <td className="p-4">
                                    <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-brand-teal hover:text-white transition-colors">
                                        <Download className="w-4 h-4 ml-auto" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-brand-gray">No invoices found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
