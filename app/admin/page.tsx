"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
    Check, X, ShieldAlert, TrendingUp, Users, Briefcase,
    Car, MapPin, Calendar, ArrowUpRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import AdminHeader from "./components/AdminHeader";

// Importing Server Actions
import { getAdminStats, getPendingSlots, approveSlot, rejectSlot, getRecentBookings } from "@/app/actions/admin";

// 🎨 COMPONENT: Stat Card (Kept local for now)
const StatCard = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
    <div className="relative overflow-hidden bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300 group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon className="w-16 h-16" />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg bg-zinc-950/50 border border-zinc-800 ${color} bg-opacity-10`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{title}</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
            {subtext && (
                <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                    {trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : null}
                    <span className={trend === 'up' ? "text-emerald-500" : "text-zinc-500"}>{subtext}</span>
                </div>
            )}
        </div>
    </div>
);

// 🎨 COMPONENT: Status Badge
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        inactive: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        starter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        pro: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        apartment: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    const defaultStyle = 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20';

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status.toLowerCase()] || defaultStyle}`}>
            {status}
        </span>
    );
};

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Data State
    const [stats, setStats] = useState<any>({
        revenue: 0, totalUsers: 0, totalBookings: 0, pendingRequests: 0, activeBookings: 0, activeSubs: 0, estimatedMRR: 0
    });
    const [pendingSlots, setPendingSlots] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const [statsData, slotsData, bookingsData] = await Promise.all([
                getAdminStats(),
                getPendingSlots(),
                getRecentBookings()
            ]);
            setStats(statsData);
            setPendingSlots(slotsData);
            setRecentBookings(bookingsData);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (user?.role !== 'admin') {
                router.push('/admin/login');
            } else {
                refreshData();
            }
        }
    }, [user, router]);

    const handleApprove = async (slotId: string) => {
        await approveSlot(slotId);
        refreshData();
    };

    const handleReject = async (slotId: string) => {
        await rejectSlot(slotId);
        refreshData();
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Metric,Value\n"
            + `Revenue,${stats.revenue}\n`
            + `Users,${stats.totalUsers}\n`
            + `Bookings,${stats.totalBookings}\n`
            + `Active Parkings,${stats.activeBookings}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "admin_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <>
            <AdminHeader title="Overview" />

            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-zinc-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* 1. Header Section */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back, Admin</h1>
                                <p className="text-zinc-500">Here's what's happening in Chennai today.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleExport} className="px-4 py-2 bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Export Report
                                </button>
                            </div>
                        </div>

                        {/* 2. Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Revenue"
                                value={`₹${stats.revenue.toLocaleString()}`}
                                subtext="+12% from last week"
                                trend="up"
                                icon={TrendingUp}
                                color="text-emerald-500"
                            />
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers}
                                subtext="+5 new today"
                                trend="up"
                                icon={Users}
                                color="text-blue-500"
                            />
                            <StatCard
                                title="Active Bookings"
                                value={stats.activeBookings}
                                subtext="Currently parked"
                                trend="neutral"
                                icon={Car}
                                color="text-indigo-500"
                            />
                            <StatCard
                                title="Pending Alerts"
                                value={stats.pendingRequests}
                                subtext="Action required"
                                trend={stats.pendingRequests > 0 ? "down" : "neutral"}
                                icon={ShieldAlert}
                                color="text-orange-500"
                            />
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 h-full">

                            {/* 3. Main Column (Approvals & Transactions) */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Pending Approvals Section */}
                                <section className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden">
                                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                                            Listing Requests
                                        </h3>
                                        {pendingSlots.length > 0 && <span className="bg-orange-500/10 text-orange-400 text-xs px-2 py-1 rounded-full font-bold">{pendingSlots.length} Pending</span>}
                                    </div>

                                    <div className="p-6">
                                        {pendingSlots.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                                                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                                    <Check className="w-8 h-8 text-zinc-500" />
                                                </div>
                                                <p className="font-medium text-zinc-300">All caught up!</p>
                                                <p className="text-sm text-zinc-500 max-w-xs mt-1">No new parking space listing requests at the moment.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {pendingSlots.map(slot => (
                                                    <div key={slot.id} className="bg-black/40 border border-zinc-800 p-5 rounded-xl flex items-start gap-4 hover:border-zinc-700 transition-all group">
                                                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                                                            <MapPin className="w-6 h-6 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-white text-lg">{slot.title}</h4>
                                                                    <p className="text-sm text-zinc-500 mt-0.5">{slot.address}</p>
                                                                    <p className="text-xs text-zinc-600 mt-1">Owner: {slot.owner?.name}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-lg font-bold text-emerald-400">₹{slot.pricePerHour}<span className="text-sm text-zinc-500 font-normal">/hr</span></div>
                                                                    <div className="text-xs text-zinc-500 uppercase font-bold mt-1 tracking-wide">{slot.vehicleType}</div>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-3 mt-6">
                                                                <button onClick={() => handleApprove(slot.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
                                                                    <Check className="w-4 h-4" /> Approve Listing
                                                                </button>
                                                                <button onClick={() => handleReject(slot.id)} className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-sm font-bold transition-all border border-zinc-700">
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Transactions Table */}
                                <section className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden">
                                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                            Recent Bookings
                                        </h3>
                                        <button onClick={() => router.push('/admin/transactions')} className="text-xs text-blue-400 font-bold hover:text-blue-300 flex items-center gap-1">
                                            View All <ArrowUpRight className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-zinc-500 bg-black/20 text-xs uppercase font-bold tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Booking ID</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Amount</th>
                                                    <th className="px-6 py-4 text-right">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-800">
                                                {recentBookings.map((b, i) => (
                                                    <tr key={b.id} className="hover:bg-zinc-800/30 transition-colors group">
                                                        <td className="px-6 py-4 font-mono text-zinc-400 group-hover:text-white transition-colors">
                                                            #{b.id.slice(0, 8)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <StatusBadge status={b.status} />
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

                            {/* 4. Side Column (Subscriptions) */}
                            <div className="space-y-8">
                                <section className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Briefcase className="w-40 h-40" />
                                    </div>
                                    <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Revenue</h3>
                                    <div className="text-4xl font-bold text-white mb-6">₹{stats.estimatedMRR.toLocaleString()}</div>

                                    <div className="space-y-4 relative z-10">
                                        <div className="bg-zinc-800/50 p-4 rounded-xl flex items-center justify-between border border-zinc-700/50">
                                            <div>
                                                <div className="text-xs text-zinc-400">Total Subscribers</div>
                                                <div className="text-xl font-bold text-white">{stats.activeSubs}</div>
                                            </div>
                                            <div className="h-10 w-10 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
                                                <Users className="w-5 h-5 text-indigo-400" />
                                            </div>
                                        </div>

                                        <div className="bg-zinc-800/50 p-4 rounded-xl flex items-center justify-between border border-zinc-700/50">
                                            <div>
                                                <div className="text-xs text-zinc-400">Churn Rate</div>
                                                <div className="text-xl font-bold text-white">2.4%</div>
                                            </div>
                                            <div className="h-10 w-10 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                                <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => router.push('/admin/subscriptions')} className="w-full mt-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                                        View Analytics
                                    </button>
                                </section>


                                <section className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden p-6">
                                    <h3 className="font-bold text-lg mb-4">Latest Subscribers (Demo)</h3>
                                    <p className="text-sm text-zinc-500">Live feed coming soon.</p>
                                </section>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
