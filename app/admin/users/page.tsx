"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { getOwners } from "@/app/actions/admin";
import { User } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOwners().then(data => {
            setUsers(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            <AdminHeader title="User Registry" />
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-zinc-500 bg-black/20 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4 text-right">Wallet</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading users...</td>
                                    </tr>
                                ) : users.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{user.name}</div>
                                                    <div className="text-xs text-zinc-500">{user.email || 'No email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 uppercase text-xs font-bold">{user.role}</td>
                                        <td className="px-6 py-4 text-zinc-400">{user.phone}</td>
                                        <td className="px-6 py-4 text-right font-medium text-emerald-400">₹{user.walletBalance}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold">Active</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
