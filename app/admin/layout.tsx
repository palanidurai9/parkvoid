"use client";
import AdminSidebar from "./components/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show the admin layout on the login page
    if (pathname?.startsWith('/admin/login')) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans selection:bg-red-500/30">
            <AdminSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />
                {children}
            </main>
        </div>
    );
}
