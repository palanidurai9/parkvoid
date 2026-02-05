"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Phone, ShieldCheck, Car, Briefcase } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'driver' | 'owner'>('driver');
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [stage, setStage] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            setError("Please enter a valid 10-digit number");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStage('otp');
            setError("");
        }, 1500);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const success = login(phone);
            if (success) {
                if (activeTab === 'driver') router.push('/search');
                else router.push('/dashboard/owner');
            } else {
                // Auto-create logic for demo (or just error)
                // For this specific 'Zepto' feel, we simulate instant success for new numbers too
                // But since useAuth limits to 900... in demo, let's just error if not found or allow "new"
                // The current auth context only allows specific mock users. 
                // We'll just show error for unknown numbers for now, or guide them.
                setError("Account not found. Try 9000000000 (Driver) or 9000000001 (Owner)");
                setLoading(false);
            }
        }, 1500);
    };

    const fillDemo = (role: 'driver' | 'owner') => {
        setActiveTab(role);
        setPhone(role === 'driver' ? '9000000000' : '9000000001');
    };

    return (
        <div className="min-h-screen flex text-white font-sans">
            {/* Left Side - Hero / Branding */}
            <div className="hidden lg:flex w-1/2 bg-brand-navy relative items-center justify-center overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal/80 to-brand-navy z-10"></div>
                {/* Abstract Pattern */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-20 text-center px-12">
                    <div className="relative h-20 w-80 mx-auto mb-8">
                        <Image
                            src="/logo.png"
                            alt="Parkvoid"
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        {activeTab === 'driver' ? "Parking made simple." : "Monetize your empty space."}
                    </h2>
                    <p className="text-xl text-brand-gray font-light max-w-md mx-auto">
                        {activeTab === 'driver'
                            ? "Find secure spots in Chennai instantly. No circling, no hassle."
                            : "Join 500+ top property owners in Chennai earning daily revenue."}
                    </p>

                    {/* Testimonial */}
                    <div className="mt-16 text-left bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 max-w-sm mx-auto">
                        <div className="flex text-brand-teal mb-3">
                            {[1, 2, 3, 4, 5].map(i => <span key={i}>&#9733;</span>)}
                        </div>
                        <p className="text-sm italic text-gray-300 mb-4">
                            {activeTab === 'driver'
                                ? "\"Saved me 45 mins at T. Nagar yesterday. Absolutely essential app for Chennai drivers.\""
                                : "\"I turned my empty apartment slot into a ₹8k/month income stream. Hosting is effortless.\""}
                        </p>
                        <p className="text-xs font-bold text-white uppercase tracking-wider">
                            {activeTab === 'driver' ? "- Rajesh K., Anna Nagar" : "- Priya M., OMR"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-brand-navy p-6 md:p-12 relative">
                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-10 mt-12 lg:mt-0">
                        <h1 className="text-3xl font-bold mb-2">Login or Signup</h1>
                        <p className="text-brand-gray">Enter your number to continue</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex bg-white/5 p-1 rounded-xl mb-10 border border-white/5">
                        <button
                            onClick={() => { setActiveTab('driver'); setStage('phone'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'driver' ? 'bg-brand-teal text-brand-navy shadow-lg shadow-brand-teal/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Car className="w-4 h-4" /> Driver
                        </button>
                        <button
                            onClick={() => { setActiveTab('owner'); setStage('phone'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'owner' ? 'bg-blue-400 text-brand-navy shadow-lg shadow-blue-400/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Briefcase className="w-4 h-4" /> Partner
                        </button>
                    </div>

                    {stage === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="relative group">
                                <label className="block text-xs font-bold text-brand-gray mb-1.5 ml-1 uppercase tracking-wider">Phone Number</label>
                                <div className="flex bg-black/30 border border-white/10 rounded-xl overflow-hidden focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal transition-all">
                                    <div className="px-4 py-4 bg-white/5 border-r border-white/5 text-gray-400 flex items-center select-none font-mono">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 bg-transparent px-4 py-4 text-lg outline-none placeholder:text-gray-600 font-medium"
                                        placeholder="98765 43210"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-brand-navy text-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${activeTab === 'driver' ? 'bg-brand-teal hover:bg-brand-teal/90' : 'bg-blue-400 hover:bg-blue-500'}`}
                            >
                                {loading ? "Sending OTP..." : "Continue"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center">
                                <p className="text-brand-gray mb-1">We've sent a verification code to</p>
                                <p className="text-white font-mono text-lg font-bold flex items-center justify-center gap-2">
                                    +91 {phone}
                                    <button type="button" onClick={() => setStage('phone')} className="text-brand-teal text-xs underline">Edit</button>
                                </p>
                            </div>

                            <div className="flex justify-center gap-3 my-4">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <div key={i} className="w-12 h-14 relative">
                                        <input
                                            type="text"
                                            maxLength={1}
                                            className="w-full h-full text-center bg-black/30 border border-white/10 rounded-xl text-2xl font-bold focus:border-brand-teal focus:outline-none transition-colors caret-brand-teal"
                                            value={otp[i] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newOtp = otp.split('');
                                                newOtp[i] = val;
                                                setOtp(newOtp.join('').slice(0, 4));
                                                // Auto focus next logic omitted for simplicity
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <input type="hidden" value={otp} /> {/* Dummy for state */}

                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-brand-navy text-lg mt-4 transition-all ${activeTab === 'driver' ? 'bg-brand-teal' : 'bg-blue-400'}`}
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                        </form>
                    )}

                    {/* Footer / Terms */}
                    <div className="mt-12 text-center">
                        <p className="text-xs text-brand-gray/50">
                            By continuing, you agree to our <a href="/legal/terms" className="underline hover:text-brand-gray">Terms of Service</a> & <a href="/legal/privacy" className="underline hover:text-brand-gray">Privacy Policy</a>.
                        </p>
                    </div>

                    {/* Developer Access (Hidden Admin) */}
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <details className="group">
                            <summary className="text-[10px] text-brand-gray/30 text-center uppercase tracking-widest cursor-pointer hover:text-brand-gray/50 list-none">
                                Developer Access
                            </summary>
                            <div className="flex justify-center gap-3 mt-4">
                                <button onClick={() => fillDemo('driver')} className="px-3 py-1 bg-white/5 rounded text-xs text-brand-teal border border-white/5 hover:bg-white/10">Driver Prefill</button>
                                <button onClick={() => fillDemo('owner')} className="px-3 py-1 bg-white/5 rounded text-xs text-blue-400 border border-white/5 hover:bg-white/10">Partner Prefill</button>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
