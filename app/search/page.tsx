"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ParkingSlot } from "@/lib/types";
import { getPublicSlots } from "@/app/actions/public";
import { Search as SearchIcon, Filter } from "lucide-react";

// Dynamic Import is Crucial for Leaflet
const ParkingMap = dynamic(() => import("../components/ParkingMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-brand-navy/50 text-white animate-pulse">Loading Map...</div>
});

export default function SearchPage() {
    const [allSlots, setAllSlots] = useState<ParkingSlot[]>([]);
    const [filteredSlots, setFilteredSlots] = useState<ParkingSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        getPublicSlots()
            .then((slots) => {
                setAllSlots(slots as ParkingSlot[]);
                setFilteredSlots(slots as ParkingSlot[]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredSlots(allSlots); // allSlots is already sorted
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = allSlots.filter(s =>
                s.title.toLowerCase().includes(lowerQuery) ||
                s.address.toLowerCase().includes(lowerQuery)
            );
            setFilteredSlots(filtered);
        }
    }, [query, allSlots]);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] relative">
            {/* Search Overlay */}
            <div className="absolute top-4 left-4 right-4 z-[400] md:w-96 md:left-4">
                <div className="bg-white rounded-xl shadow-xl p-2 flex gap-2">
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search location..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gray-100">
                <ParkingMap slots={filteredSlots} />
            </div>

            {/* Bottom List View for Mobile (Optional, keeping simple map for now) */}
        </div>
    );
}
