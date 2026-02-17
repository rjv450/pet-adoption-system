"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        setLoading(true); // Ensure loading is true while checking
        const token = Cookies.get('token');
        if (token) {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                console.error('Auth check failed:', error);
                Cookies.remove('token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (userData: any) => {
        try {
            const { data } = await api.post('/auth/login', userData);
            Cookies.set('token', data.token, { expires: 30 });
            setUser(data);
            router.push(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            Cookies.set('token', data.token, { expires: 30 });
            setUser(data);
            router.push('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
