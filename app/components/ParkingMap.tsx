"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ParkingSlot } from "@/lib/types";
import { MapPin, Navigation, Info } from "lucide-react";
import Link from 'next/link';

// Fix for default marker icon in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Pin Component (Optional enhancement, sticking to default for stability first)

function LocationMarker() {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position} icon={DefaultIcon}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

interface ParkingMapProps {
    slots: ParkingSlot[];
}

export default function ParkingMap({ slots }: ParkingMapProps) {
    // Chennai Coordinates
    const center: [number, number] = [13.0827, 80.2707];

    return (
        <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full z-0" // z-0 to stay behind navbar details
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {slots.map((slot) => (
                <Marker key={slot.id} position={[slot.lat, slot.lng]}>
                    <Popup>
                        <div className="min-w-[200px]">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{slot.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{slot.address}</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-brand-teal text-lg">₹{slot.pricePerHour}/hr</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">{slot.vehicleType}</span>
                            </div>
                            <Link
                                href={`/book/${slot.id}`}
                                className="block w-full bg-brand-navy text-white text-center py-2 rounded font-medium hover:bg-opacity-90 transition-colors"
                            >
                                Book Slot
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}

            <LocationMarker />
        </MapContainer>
    );
}
