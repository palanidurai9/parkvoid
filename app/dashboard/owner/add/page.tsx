"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Upload, MapPin, Map as MapIcon, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { addParkingSlot, getOwnerStats } from "@/app/actions/owner";

const LocationPickerMap = dynamic(() => import("@/app/components/LocationPickerMap"), {
    ssr: false,
    loading: () => <div className="h-64 bg-white/5 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
});

const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1573348722427-f1d6d288d745?q=80&w=2938&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590674899558-450f62243d4c?q=80&w=2600&auto=format&fit=crop'
];

export default function AddParkingPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canAdd, setCanAdd] = useState(true);
    const [limitMsg, setLimitMsg] = useState("");

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        pricePerHour: 20,
        vehicleType: 'car',
        lat: 13.0827,
        lng: 80.2707,
        openTime: '09:00',
        closeTime: '22:00',
        description: ''
    });

    useEffect(() => {
        const checkLimits = async () => {
            if (!user) return;
            try {
                const stats = await getOwnerStats(user.id);
                const currentSlots = stats.totalSlots;

                const plan = (user.subscriptionPlan || 'free').toLowerCase();
                let limit = 1; // Free
                if (plan === 'starter') limit = 2;
                if (plan === 'pro') limit = 10;

                if (currentSlots >= limit) {
                    setCanAdd(false);
                    setLimitMsg(`You have reached the ${limit} slot(s) limit for the ${plan} plan. Upgrade to list more.`);
                }
            } catch (error) {
                console.error("Failed to check limits", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkLimits();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !canAdd) return;

        setIsSubmitting(true);
        try {
            const result = await addParkingSlot({
                ...formData,
                images: DEFAULT_IMAGES // Using dummy images for MVP
            }, user.id);

            if (result.success) {
                alert("✅ Slot submitted successfully! Waiting for Admin Approval.");
                router.push('/dashboard/owner');
            } else {
                alert("❌ Failed: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
            </div>
        )
    }

    if (!canAdd) {
        return (
            <div className="container mx-auto p-4 md:p-8 max-w-2xl flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="p-4 bg-white/5 rounded-full mb-6">
                    <Lock className="w-12 h-12 text-brand-gray" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Slot Limit Reached</h1>
                <p className="text-brand-gray mb-8 max-w-md">{limitMsg}</p>

                <div className="flex gap-4">
                    <Link
                        href="/dashboard/owner/plans"
                        className="bg-brand-teal text-brand-navy px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                    >
                        Upgrade Plan
                    </Link>
                    <Link
                        href="/dashboard/owner"
                        className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">List New Parking Spot</h1>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6">
                <div>
                    <label className="block text-sm text-brand-gray mb-2">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-teal focus:outline-none"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Spacious Driveway in Anna Nagar"
                    />
                </div>

                <div>
                    <label className="block text-sm text-brand-gray mb-2">Address</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-teal focus:outline-none"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full address"
                    />
                </div>

                <div>
                    <label className="block text-sm text-brand-gray mb-2">Location Coordinates</label>

                    {/* Map Picker */}
                    <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10 mb-4 relative z-0">
                        <LocationPickerMap
                            initialLat={formData.lat || 13.0827}
                            initialLng={formData.lng || 80.2707}
                            onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                        />
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-xs px-2 py-1 rounded text-white z-[400] pointer-events-none">
                            Tap to Pin Location
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <button
                            type="button"
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                            setFormData({
                                                ...formData,
                                                lat: position.coords.latitude,
                                                lng: position.coords.longitude
                                            });
                                            alert("Location detected!");
                                        },
                                        () => alert("Unable to retrieve location.")
                                    );
                                } else {
                                    alert("Geolocation is not supported by your browser");
                                }
                            }}
                            className="bg-brand-teal/20 text-brand-teal px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-teal/30 transition-colors whitespace-nowrap"
                        >
                            <MapPin className="w-4 h-4" /> Use My GPS
                        </button>
                        <div className="flex flex-1 gap-2 text-xs text-brand-gray bg-black/20 p-2 rounded-lg border border-white/5 items-center justify-center">
                            <span>Lat: {formData.lat?.toFixed(5)}</span>
                            <span>•</span>
                            <span>Lng: {formData.lng?.toFixed(5)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-brand-gray mb-2">Price / Hour (₹)</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-teal focus:outline-none"
                            value={formData.pricePerHour || ''}
                            onChange={e => {
                                const val = parseFloat(e.target.value);
                                setFormData({ ...formData, pricePerHour: isNaN(val) ? 0 : val })
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-brand-gray mb-2">Vehicle Type</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-teal focus:outline-none"
                            value={formData.vehicleType}
                            onChange={e => setFormData({ ...formData, vehicleType: e.target.value as any })}
                        >
                            <option value="CAR">Car</option>
                            <option value="BIKE">Bike</option>
                            <option value="SUV">SUV</option>
                            <option value="ALL">All</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-brand-gray mb-2">Description</label>
                    <textarea
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white h-24 focus:border-brand-teal focus:outline-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Access instructions, security features, etc."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-teal text-brand-navy font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                        </>
                    ) : (
                        "Submit Listing"
                    )}
                </button>
            </form>
        </div>
    );
}
