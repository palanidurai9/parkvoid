"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { getAllBookings } from "@/app/actions/admin";
import { ArrowUpRight } from "lucide-react";

export default function TransactionsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAllBookings().then(data => {
            setBookings(data);
            setIsLoading(false);
        });
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        const defaultStyle = 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20';
        return (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status.toLowerCase()] || defaultStyle}`}>
                {status}
            </span>
        );
    };

    return (
        <>
            <AdminHeader title="Transactions" />
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="max-w-6xl mx-auto">
                    <section className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-zinc-500 bg-black/20 text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="text-center py-6 text-zinc-500">Loading...</td></tr>
                                    ) : bookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-zinc-400 group-hover:text-white transition-colors">
                                                #{b.id.slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={b.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white">{b.driver?.name || 'Unknown'}</div>
                                                <div className="text-xs text-zinc-600">{b.driver?.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-zinc-400 truncate max-w-[200px]">{b.slot?.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-white">
                                                ₹{b.amount}
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-500">
                                                {new Date(b.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
