"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { getAllSlots } from "@/app/actions/admin";
import { MapPin, Car } from "lucide-react";

export default function ParkingLotsPage() {
    const [slots, setSlots] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAllSlots().then(data => {
            setSlots(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            <AdminHeader title="Parking Lots" />
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="text-zinc-500">Loading parking lots...</div>
                    ) : slots.map(slot => (
                        <div key={slot.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group">
                            <div className="h-32 bg-zinc-800/50 relative">
                                {/* Placeholder Map/Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                                    <MapPin className="w-8 h-8 opacity-20" />
                                </div>
                                <div className="absolute top-3 right-3 space-x-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${slot.isApproved ? 'bg-emerald-500 text-black' : 'bg-orange-500 text-black'}`}>
                                        {slot.isApproved ? 'Live' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-1">{slot.title}</h3>
                                <p className="text-zinc-500 text-sm line-clamp-1 mb-4">{slot.address}</p>

                                <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <Car className="w-3 h-3 text-zinc-400" />
                                        </div>
                                        <span className="text-xs text-zinc-400 font-bold uppercase">{slot.vehicleType}</span>
                                    </div>
                                    <div className="text-emerald-400 font-bold">₹{slot.pricePerHour}<span className="text-zinc-600 text-xs">/hr</span></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
