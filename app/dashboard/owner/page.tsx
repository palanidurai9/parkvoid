"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Booking, ParkingSlot } from "@/lib/types";
import { Plus, IndianRupee, Car, Calendar, ExternalLink, Trash2, Star, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteParkingSlot, getOwnerDashboard } from "@/app/actions/owner";

export default function OwnerDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [mySlots, setMySlots] = useState<ParkingSlot[]>([]);
    const [earnings, setEarnings] = useState(0);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [daysLeft, setDaysLeft] = useState(0);

    const [kycStatus, setKycStatus] = useState('pending'); // Mock

    useEffect(() => {
        if (user?.role !== 'owner') {
            if (user?.role === 'driver') router.push('/dashboard');
            return;
        }

        getOwnerDashboard().then((dashboard) => {
            setMySlots(dashboard.slots as ParkingSlot[]);
            setBookings(dashboard.bookings as unknown as Booking[]);
            setEarnings(dashboard.earnings);
            setDaysLeft(dashboard.subscription ? Math.max(0, Math.ceil((new Date(dashboard.subscription.currentPeriodEnd).getTime() - Date.now()) / 86400000)) : 0);
            setKycStatus(dashboard.owner.kycStatus.toLowerCase());
        });

    }, [user, router]);

    if (!user || user.role !== 'owner') return null;

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Top Bar with KYC Alert */}
            {kycStatus === 'pending' && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-bold text-orange-400">Identity Verification Required</span>
                    </div>
                    <Link href="/dashboard/owner/kyc" className="text-sm bg-orange-500 text-black px-3 py-1 rounded font-bold hover:bg-orange-400">
                        Verify Now
                    </Link>
                </div>
            )}

            {/* Subscription Banner */}
            <div className="bg-gradient-to-r from-brand-teal/20 to-blue-500/20 border border-brand-teal/30 rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-teal rounded-lg text-brand-navy">
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300">Your plan:</p>
                        <h3 className="font-bold text-lg capitalize flex items-center gap-2">
                            {user?.subscriptionPlan || 'Starter'} Host
                            <span className="text-xs font-normal bg-white/10 px-2 py-0.5 rounded">Expires in {daysLeft} days</span>
                        </h3>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/owner/plans" className="bg-brand-teal text-brand-navy px-4 py-2 rounded-lg font-bold text-sm hover:bg-opacity-90">
                        Upgrade Plan
                    </Link>
                    <Link href="/dashboard/owner/billing" className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/20">
                        Manage Subscription
                    </Link>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                <Link
                    href="/dashboard/owner/add"
                    className="bg-brand-teal text-brand-navy px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Add Parking
                </Link>
            </div>

            {/* Premium Features */}
            {user.subscriptionPlan === 'pro' && (
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">Premium Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => alert("Downloading Monthly Earnings PDF...")} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold">Monthly Earnings Report</h3>
                                <p className="text-xs text-brand-gray">Download PDF summary</p>
                            </div>
                        </button>

                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-brand-gray text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold">₹{earnings}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-brand-gray text-sm">Active Spots</p>
                            <p className="text-2xl font-bold">{mySlots.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-brand-gray text-sm">Total Bookings</p>
                            <p className="text-2xl font-bold">{bookings.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slots List */}
            <h2 className="text-xl font-bold mb-6">My Parking Slots</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySlots.map(slot => (
                    <div key={slot.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-teal/50 transition-colors group">
                        <div className="h-48 overflow-hidden relative">
                            <img src={slot.images[0]} alt={slot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase text-white">
                                    {slot.status}
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-lg">{slot.title}</h3>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this listing?')) {
                                            void deleteParkingSlot(slot.id).then(() => setMySlots(prev => prev.filter(s => s.id !== slot.id)));
                                        }
                                    }}
                                    className="text-brand-gray hover:text-red-400 p-1"
                                    title="Delete Listing"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-brand-gray text-sm mb-4">{slot.address}</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-brand-teal font-bold">₹{slot.pricePerHour}/hr</span>
                                <span className="capitalize text-gray-400">{slot.vehicleType}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
