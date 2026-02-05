"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { db } from "@/lib/store";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    login: (phone: string) => boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => false,
    logout: () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for active session
        const currentUser = db.auth.getCurrentUser();
        setUser(currentUser || null);
        setIsLoading(false);
    }, []);

    const login = (phone: string) => {
        const foundUser = db.users.login(phone);
        if (foundUser) {
            db.auth.setCurrentUser(foundUser.id);
            setUser(foundUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        db.auth.setCurrentUser(null);
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
