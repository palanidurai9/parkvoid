"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/store";
import { ParkingSlot, Booking } from "@/lib/types";
import { useAuth } from "@/app/context/AuthContext";
import { Calendar, Clock, MapPin, IndianRupee, ArrowLeft, CheckCircle, CreditCard, Loader2 } from "lucide-react";
import { format, addHours, differenceInHours, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export default function BookingPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [slot, setSlot] = useState<ParkingSlot | null>(null);
    const [startTime, setStartTime] = useState(format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
    const [duration, setDuration] = useState(2);
    const [showPayment, setShowPayment] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!user) {
            // Ideally use redirect param, keeping simple for demo
            router.push('/login');
            return;
        }
        const found = db.slots.getAll().find((s) => s.id === id);
        if (found) setSlot(found);
    }, [id, user, router]);

    if (!slot || !user) return <div className="p-8 text-center">Loading...</div>;

    const totalAmount = slot.pricePerHour * duration;

    const handlePayment = async () => {
        setProcessing(true);

        // Simulate Razorpay Delay
        await new Promise(r => setTimeout(r, 2000));

        // Create Booking
        const newBooking: Booking = {
            id: uuidv4(),
            slotId: slot.id,
            driverId: user.id,
            startTime: startTime,
            endTime: format(addHours(parseISO(startTime), duration), "yyyy-MM-dd'T'HH:mm"),
            amount: totalAmount,
            status: 'paid',
            qrCode: `PV-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        db.bookings.create(newBooking);

        console.log("Booking created", newBooking); // Debug

        router.push(`/bookings/${newBooking.id}`);
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-gray hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Map
            </button>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Slot Details */}
                <div className="space-y-6">
                    <div className="h-64 rounded-2xl overflow-hidden bg-brand-navy border border-white/10">
                        <img src={slot.images[0]} alt={slot.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{slot.title}</h1>
                        <div className="flex items-center gap-2 text-brand-gray mb-4">
                            <MapPin className="w-5 h-5 text-brand-teal" />
                            <span>{slot.address}</span>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <span className="block text-xs text-brand-gray">Price</span>
                                <span className="text-xl font-bold text-brand-teal">₹{slot.pricePerHour}/hr</span>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <span className="block text-xs text-brand-gray">Type</span>
                                <span className="text-xl font-bold capitalize">{slot.vehicleType}</span>
                            </div>
                        </div>
                        <p className="text-brand-gray leading-relaxed">{slot.description}</p>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl h-fit">
                    <h2 className="text-xl font-bold mb-6">Reserve your spot</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-gray mb-2">Start Time</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-teal"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-gray mb-2">Duration (Hours)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-teal appearance-none"
                                >
                                    {[1, 2, 3, 4, 5, 6, 12, 24].map(h => (
                                        <option key={h} value={h} className="text-black">{h} Hours</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-white/10 my-6 pt-6 space-y-2">
                            <div className="flex justify-between text-brand-gray">
                                <span>Rate</span>
                                <span>₹{slot.pricePerHour} x {duration} hrs</span>
                            </div>
                            <div className="flex justify-between text-brand-gray">
                                <span>Service Fee</span>
                                <span>₹10</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-2">
                                <span>Total</span>
                                <span>₹{totalAmount + 10}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowPayment(true)}
                            className="w-full bg-brand-teal text-brand-navy font-bold py-4 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-brand-teal/20"
                        >
                            Pay ₹{totalAmount + 10}
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayment && (
                <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white text-brand-navy rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <span className="text-blue-600 font-black italic">Razorpay</span> Sandbox
                            </h3>
                            <button onClick={() => setShowPayment(false)} className="text-gray-500 hover:text-black">Cancel</button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <p className="text-gray-500 text-sm">Paying to</p>
                                <p className="font-bold text-xl">Parkvoid India Pvt Ltd</p>
                                <p className="text-2xl font-bold mt-2">₹{totalAmount + 10}</p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="w-full p-4 border rounded-xl flex items-center gap-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-bold">UPI / QR</p>
                                        <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                                    </div>
                                    {processing && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                                </button>

                                <button
                                    disabled
                                    className="w-full p-4 border rounded-xl flex items-center gap-4 opacity-50 cursor-not-allowed"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-bold">Card</p>
                                        <p className="text-xs text-gray-500">Credit / Debit</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
                            TEST MODE • NO REAL MONEY DEDUCTED
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
