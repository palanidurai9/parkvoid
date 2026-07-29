"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Booking, ParkingSlot } from "@/lib/types";
import { format, parseISO, isFuture, isPast } from "date-fns";
import { Calendar, Clock, MapPin, QrCode } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDriverBookings } from "@/app/actions/booking";

export default function DriverDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<(Booking & { slot: ParkingSlot })[]>([]);

    useEffect(() => {
        if (user?.role !== 'driver') {
            // if user is owner redirect to owner dashboard
            if (user?.role === 'owner') router.push('/dashboard/owner');
            // if user is admin
            if (user?.role === 'admin') router.push('/admin');
        }

        if (user?.role === 'driver') getDriverBookings().then((items) => setBookings(items as unknown as (Booking & { slot: ParkingSlot })[]));
    }, [user, router]);

    if (!user) return null;

    const activeBookings = bookings.filter(b => isFuture(parseISO(b.endTime)));
    const pastBookings = bookings.filter(b => isPast(parseISO(b.endTime)));

    const BookingCard = ({ booking }: { booking: (Booking & { slot: ParkingSlot }) }) => (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-xl mb-1">{booking.slot.title}</h3>
                    <div className="flex items-center gap-2 text-brand-gray text-sm">
                        <MapPin className="w-4 h-4" /> {booking.slot.address}
                    </div>
                </div>
                <div className="bg-brand-teal/20 text-brand-teal px-3 py-1 rounded-lg text-xs font-bold uppercase">
                    {booking.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 p-3 rounded-lg">
                    <p className="text-xs text-brand-gray mb-1">Start</p>
                    <p className="font-mono text-sm">{format(parseISO(booking.startTime), "MMM d, h:mm a")}</p>
                </div>
                <div className="bg-black/20 p-3 rounded-lg">
                    <p className="text-xs text-brand-gray mb-1">End</p>
                    <p className="font-mono text-sm">{format(parseISO(booking.endTime), "MMM d, h:mm a")}</p>
                </div>
            </div>

            <div className="flex gap-3">
                <Link
                    href={`/bookings/${booking.id}`}
                    className="flex-1 bg-brand-white text-brand-navy py-2 rounded-lg font-bold text-center flex items-center justify-center gap-2 hover:bg-gray-200"
                >
                    <QrCode className="w-4 h-4" /> View Pass
                </Link>
                {/* Cancel Button Logic Mock */}
                {booking.status === 'paid' && (
                    <button className="px-4 py-2 border border-white/10 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-brand-gray transition-colors">
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-brand-teal mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Active & Upcoming
                    </h2>
                    {activeBookings.length === 0 ? (
                        <div className="text-brand-gray italic">No active bookings. <Link href="/search" className="text-brand-teal underline">Find a spot</Link></div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {activeBookings.map(b => <BookingCard key={b.id} booking={b} />)}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-bold text-brand-gray mb-4">Past Bookings</h2>
                    {pastBookings.length === 0 ? (
                        <div className="text-brand-gray italic">No history yet.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4 opacity-75">
                            {pastBookings.map(b => <BookingCard key={b.id} booking={b} />)}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
