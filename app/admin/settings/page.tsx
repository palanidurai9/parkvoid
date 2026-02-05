"use client";
import AdminHeader from "../components/AdminHeader";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <>
            <AdminHeader title="Global Settings" />
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Platform Configuration</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Platform Name</label>
                                <input type="text" defaultValue="Parkvoid" className="w-full bg-black/40 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Support Email</label>
                                <input type="email" defaultValue="admin@parkvoid.com" className="w-full bg-black/40 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none" />
                            </div>

                            <div className="pt-4 border-t border-zinc-800">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-500" />
                                    <span className="text-sm text-zinc-300">Enable Maintenance Mode</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
