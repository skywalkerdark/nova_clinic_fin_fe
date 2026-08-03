"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, setInMemoryToken } from "@/lib/api";

interface User {
    id: number;
    username: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
    firstName?: string;
    lastName?: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (credentials: {
        username: string;
        password: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // При первой загрузке страницы пробуем тихо обновить токен по httpOnly куке
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data } = await api.post("/auth/refresh");
                setAccessToken(data.accessToken);
                setInMemoryToken(data.accessToken); // Мгновенно обновляем молуль api
                setUser(data.user);
                // Если на бэке есть роут /auth/me или профиль — можно подтянуть юзера
            } catch (e) {
                setAccessToken(null);
                setInMemoryToken(null); // Мгновенно обновляем молуль api
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: {
        username: string;
        password: string;
    }) => {
        // Делаем запрос на NestJS (порт 4000)
        const { data } = await api.post("/auth/login", credentials);

        // Бэкенд сам установил httpOnly куку для refreshToken,
        // а нам возвращает accessToken и объект user:
        setAccessToken(data.accessToken);
        setInMemoryToken(data.accessToken);
        setUser(data.user);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            console.error("Ошибка при выходе:", e);
        } finally {
            setAccessToken(null);
            setInMemoryToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, accessToken, login, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth должен использоваться внутри AuthProvider");
    }
    return context;
};
