"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { MapPin, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
        <Link
            href={href}
            className={clsx(
                "text-brand-gray hover:text-brand-white transition-colors font-medium",
                mobile ? "block py-2 text-lg" : "text-sm"
            )}
            onClick={() => setMobileMenuOpen(false)}
        >
            {children}
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 w-full bg-brand-navy border-b border-white/10 backdrop-blur-md bg-opacity-95">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative h-10 w-32">
                        <Image
                            src="/logo.png"
                            alt="Parkvoid"
                            fill
                            className="object-contain"
                            priority
                            sizes="128px"
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink href="/search">Find Parking</NavLink>
                    {user?.role === 'owner' && <NavLink href="/dashboard/owner">Host Dashboard</NavLink>}
                    {user?.role === 'admin' && <NavLink href="/admin">Admin Panel</NavLink>}
                    <NavLink href="/how-it-works">How it works</NavLink>
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href={user.role === 'owner' ? '/dashboard/owner' : '/dashboard'} className="flex items-center gap-2 text-brand-white hover:text-brand-teal">
                                <UserIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                            </Link>
                            <button
                                onClick={() => void logout()}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 text-brand-gray" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-brand-teal text-brand-navy px-5 py-2 rounded-full font-bold text-sm hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg shadow-brand-teal/20"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-brand-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-brand-navy border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <NavLink href="/search" mobile>Find Parking</NavLink>
                    {user?.role === 'owner' && <NavLink href="/dashboard/owner" mobile>Host Dashboard</NavLink>}
                    {user?.role === 'admin' && <NavLink href="/admin" mobile>Admin Panel</NavLink>}
                    <NavLink href="/how-it-works" mobile>How it works</NavLink>
                    <div className="h-px bg-white/10 my-2" />
                    {user ? (
                        <>
                            <div className="text-brand-gray text-sm px-2">Signed in as {user.name}</div>
                            <button onClick={() => void logout()} className="text-left text-brand-teal py-2 font-medium">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-brand-teal text-brand-navy px-5 py-3 rounded-xl font-bold text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
