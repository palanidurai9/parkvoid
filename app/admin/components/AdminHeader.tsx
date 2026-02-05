"use client";
import { Search, Bell, User, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminHeader({ title }: { title: string }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Quick hook to close on click outside
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <header className="h-20 border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
                <div className="h-4 w-px bg-zinc-800" />
                <div className="flex items-center text-xs text-zinc-500 gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    System Operational
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 w-64 transition-all"
                    />
                </div>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative text-zinc-400 hover:text-white transition-colors p-1"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                                <span className="font-bold text-sm text-white">Notifications</span>
                                <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">2 New</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <div className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50">
                                    <div className="text-sm font-medium text-white">New Listing Request</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">User 'Rajesh' added a new parking spot.</div>
                                    <div className="text-[10px] text-zinc-600 mt-2">2 mins ago</div>
                                </div>
                                <div className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer">
                                    <div className="text-sm font-medium text-white">High Server Load</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">System warning: CPU usage {'>'} 80%</div>
                                    <div className="text-[10px] text-zinc-600 mt-2">1 hour ago</div>
                                </div>
                            </div>
                            <div className="p-2 border-t border-zinc-800 text-center">
                                <button className="text-xs text-zinc-400 hover:text-white">Mark all as read</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 border border-zinc-500/30 hover:border-zinc-400 transition-all flex items-center justify-center overflow-hidden"
                    >
                        {user?.name ? (
                            <span className="font-bold text-xs text-white uppercase">{user.name.substring(0, 2)}</span>
                        ) : (
                            <User className="w-5 h-5 text-zinc-300" />
                        )}
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-zinc-800">
                                <div className="font-bold text-white text-sm">{user?.name || 'Admin'}</div>
                                <div className="text-xs text-zinc-500 truncate">{user?.email || 'admin@parkvoid.com'}</div>
                            </div>

                            <div className="p-1">
                                <button onClick={() => router.push('/admin/settings')} className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg flex items-center gap-2 transition-colors">
                                    <Settings className="w-4 h-4" /> Settings
                                </button>
                                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}
