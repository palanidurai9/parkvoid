"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    login: (phone: string, adminCode?: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => false,
    logout: async () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(async (response) => response.ok ? response.json() : { user: null })
            .then(({ user: currentUser }) => setUser(currentUser || null))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (phone: string, adminCode?: string) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, adminCode }),
        });
        if (!response.ok) return false;
        const { user: foundUser } = await response.json();
        setUser(foundUser);
        return true;
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
