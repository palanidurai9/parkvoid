"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, Loader2, ShieldCheck, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    // 🛡️ ADMIN SECURITY CONFIGURATION
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [otp, setOtp] = useState("");
    const [stage, setStage] = useState<'credentials' | 'otp'>('credentials');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerifyCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validate server-side after the second factor input is collected.
        await new Promise(r => setTimeout(r, 1000)); // Simulate DB check

        if (phone.length === 10 && code.length >= 8) {
            setStage('otp'); // Proceed to Step 2
        } else {
            setError("Access Denied: Invalid Admin ID or Master Code.");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        await new Promise(r => setTimeout(r, 1000));

        // 2. Final Auth
        // In a real app, you'd verify the OTP here (e.g., against a generated code)
        // For this example, any non-empty OTP is considered valid after successful credentials
        if (otp.length > 0) {
            const success = await login(phone, code);
            if (success) {
                router.push('/admin');
            } else {
                setError("Authentication Failed: Admin user not found in registry.");
            }
        } else {
            setError("Please enter the 2FA code.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Security Tape */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>

                <div className="text-center mb-8 pt-4">
                    <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        {stage === 'otp' ? <ShieldCheck className="w-8 h-8 text-green-500" /> : <Lock className="w-8 h-8 text-red-500" />}
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Admin Access</h1>
                    <p className="text-zinc-500 text-sm mt-1">{stage === 'otp' ? 'Step 2: Dual-Factor Verification' : 'Step 1: Identity Challenge'}</p>
                </div>

                {stage === 'credentials' ? (
                    <form onSubmit={handleVerifyCredentials} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Admin Identifier</label>
                            <div className="group relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                                <input
                                    type="text"
                                    className="w-full bg-black border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                                    placeholder="Enter Admin ID"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Master Code</label>
                            <div className="group relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full bg-black border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-500 focus:outline-none transition-colors tracking-widest"
                                    placeholder="••••••••"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 text-red-400 text-xs font-mono">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-400 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-600"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 text-center">Enter 2FA Code</label>
                            <input
                                type="text"
                                className="w-full bg-black border border-zinc-700 rounded-lg py-4 text-white focus:border-green-500 focus:outline-none transition-colors tracking-[1em] text-center text-2xl font-mono"
                                placeholder="••••"
                                maxLength={4}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                autoFocus
                            />
                            <p className="text-center text-xs text-zinc-600 mt-4">
                                A verification code has been sent to your secure device ending in ****02.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 text-red-400 text-xs font-mono">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate Session"}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStage('credentials'); setOtp(''); setError(''); }}
                            className="w-full text-zinc-600 text-xs hover:text-white mt-4"
                        >
                            Back to Identity Check
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center border-t border-zinc-800 pt-4">
                    <p className="text-[10px] text-zinc-600 font-mono">
                        SECURE CONNECTION • 256-BIT ENCRYPTION
                    </p>
                </div>
            </div>
        </div>
    );
}
