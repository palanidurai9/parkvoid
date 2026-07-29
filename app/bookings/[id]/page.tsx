"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Booking, ParkingSlot } from "@/lib/types";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Clock, MapPin, Navigation, Star } from "lucide-react";
import { format, parseISO } from "date-fns";
import { getDriverBooking } from "@/app/actions/booking";

export default function BookingSuccessPage() {
    const { id } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [slot, setSlot] = useState<ParkingSlot | null>(null);

    useEffect(() => {
        getDriverBooking(String(id)).then((result) => {
            if (result) {
                setBooking(result as unknown as Booking);
                setSlot(result.slot as unknown as ParkingSlot);
            }
        });
    }, [id]);

    if (!booking || !slot) return <div className="p-8 text-center text-white">Loading Pass...</div>;

    return (
        <div className="container mx-auto p-4 max-w-md">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Success Header */}
                <div className="bg-brand-teal p-6 text-center text-brand-navy">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
                    <p className="opacity-80 text-sm">Pass Generated Successfully</p>
                </div>

                {/* Ticket Body */}
                <div className="p-6 relative">
                    {/* Punch hole effect */}
                    <div className="absolute top-0 -left-4 w-8 h-8 bg-brand-navy rounded-full"></div>
                    <div className="absolute top-0 -right-4 w-8 h-8 bg-brand-navy rounded-full"></div>
                    <div className="border-b-2 border-dashed border-gray-200 mb-6"></div>

                    <div className="text-center mb-6">
                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Scan at Entry</p>
                        <div className="flex justify-center p-2 border-2 border-brand-navy/10 rounded-xl inline-block">
                            <QRCodeSVG value={booking.qrCode || booking.id} size={150} fgColor="#071A2F" />
                        </div>
                        <p className="text-xs font-mono mt-2 text-gray-500">{booking.qrCode}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-brand-navy" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{slot.title}</h3>
                                <p className="text-sm text-gray-500">{slot.address}</p>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${slot.lat},${slot.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-brand-teal font-bold flex items-center gap-1 mt-1"
                                >
                                    <Navigation className="w-3 h-3" /> Get Directions
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-brand-navy" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {format(parseISO(booking.startTime), "h:mm a")} - {format(parseISO(booking.endTime), "h:mm a")}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {format(parseISO(booking.startTime), "MMM d, yyyy")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <button onClick={() => router.push('/search')} className="text-brand-gray text-sm hover:text-brand-navy">
                        Back to Map
                    </button>
                </div>
            </div>
        </div>
    );
}
