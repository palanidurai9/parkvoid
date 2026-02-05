"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ShieldAlert, Users, Briefcase, LayoutDashboard,
    Car, CreditCard, Settings, LogOut
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const SidebarLink = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
        </Link>
    );
};

export default function AdminSidebar() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        // Implement logout logic or redirection
        //For now just redirect
        router.push('/');
    };

    return (
        <aside className="w-72 bg-zinc-950 border-r border-zinc-800 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-900/20">
                        <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Parkvoid<span className="text-red-500">.</span></span>
                </div>

                <nav className="space-y-1">
                    <SidebarLink icon={LayoutDashboard} label="Dashboard" href="/admin" />
                    <SidebarLink icon={Users} label="User Registry" href="/admin/users" />
                    <SidebarLink icon={Car} label="Parking Lots" href="/admin/parking-lots" />
                    <SidebarLink icon={CreditCard} label="Transactions" href="/admin/transactions" />
                </nav>

                <div className="mt-8 px-4 text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">System</div>
                <nav className="space-y-1">
                    <SidebarLink icon={Settings} label="Global Settings" href="/admin/settings" />
                    <SidebarLink icon={Briefcase} label="Subscription Plans" href="/admin/subscriptions" />
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-zinc-900">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-zinc-900/50 text-zinc-500 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Exit Console</span>
                </button>
            </div>
        </aside>
    );
}
