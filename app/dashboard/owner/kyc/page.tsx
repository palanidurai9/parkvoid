"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Upload, ShieldCheck, FileCheck, AlertTriangle, Loader2 } from "lucide-react";

export default function KYCPage() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'pending' | 'submitting' | 'verified'>('pending');

    const [identityDoc, setIdentityDoc] = useState<File | null>(null);
    const [propertyDoc, setPropertyDoc] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate Upload
        setTimeout(() => {
            setStatus('verified'); // Mock success for demo
            // In producton: Update DB user.kycStatus = 'pending_verification'
        }, 2000);
    };

    if (!user) return null;

    if (status === 'verified') {
        return (
            <div className="container mx-auto p-8 max-w-2xl text-center">
                <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-12">
                    <div className="bg-green-500 text-brand-navy w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-400 mb-4">KYC Submitted Successfully</h1>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                        Our compliance team will review your documents within 24 hours. You can verify your bank account details while you wait.
                    </p>
                    <button onClick={() => window.location.href = '/dashboard/owner'} className="bg-brand-teal text-brand-navy px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <ShieldCheck className="text-brand-teal" /> Verification Center
                </h1>
                <p className="text-brand-gray">To activate payouts and remove limits, we need to verify your identity.</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3 mb-8">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold text-yellow-500 mb-1">Why is this required?</p>
                    <p className="text-gray-300">As per RBI guidelines and Local regulations, all parking hosts must verify their identity and property ownership to prevent fraud. Your data is encrypted and stored securely.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-8">

                {/* Step 1: Identity */}
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-brand-teal text-brand-navy w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Identity Proof
                    </h3>
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5 hover:border-brand-teal/50 transition-colors group cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setIdentityDoc(e.target.files?.[0] || null)}
                            required
                        />
                        <div className="flex flex-col items-center justify-center text-center">
                            {identityDoc ? (
                                <>
                                    <FileCheck className="w-10 h-10 text-green-400 mb-3" />
                                    <p className="font-bold text-white">{identityDoc.name}</p>
                                    <p className="text-xs text-green-400 mt-1">Ready to upload</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-10 h-10 text-brand-gray mb-3 group-hover:text-brand-teal transition-colors" />
                                    <p className="font-bold text-white">Upload Aadhar Card / PAN</p>
                                    <p className="text-xs text-brand-gray mt-1">JPG, PNG or PDF (Max 5MB)</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Step 2: Property */}
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-brand-teal text-brand-navy w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Property Ownership
                    </h3>
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5 hover:border-brand-teal/50 transition-colors group cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setPropertyDoc(e.target.files?.[0] || null)}
                            required
                        />
                        <div className="flex flex-col items-center justify-center text-center">
                            {propertyDoc ? (
                                <>
                                    <FileCheck className="w-10 h-10 text-green-400 mb-3" />
                                    <p className="font-bold text-white">{propertyDoc.name}</p>
                                    <p className="text-xs text-green-400 mt-1">Ready to upload</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-10 h-10 text-brand-gray mb-3 group-hover:text-brand-teal transition-colors" />
                                    <p className="font-bold text-white">Upload Tax Receipt / Electricity Bill</p>
                                    <p className="text-xs text-brand-gray mt-1">Must match the address of your first listing</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="mt-1 w-4 h-4 rounded bg-black/40 border-gray-600 text-brand-teal" />
                        <span className="text-sm text-brand-gray">
                            I declare that the information provided is true and accurate. I understand that providing false information will lead to immediate account suspension.
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-brand-teal text-brand-navy font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                    {status === 'submitting' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                        </>
                    ) : (
                        "Submit Documents for Verification"
                    )}
                </button>
            </form>
        </div>
    );
}
