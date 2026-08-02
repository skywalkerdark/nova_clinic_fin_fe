"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
    const router = useRouter();
    const { user, accessToken, logout, isLoading } = useAuth();

    useEffect(() => {
        console.log("Checking authentication status...");
        // Проверяем авторизацию после завершения первичной загрузки сессии
        if (!isLoading && !accessToken) {
            console.log("User is not authenticated, redirecting to login...");
            router.replace("/login");
        }
    }, [accessToken, isLoading, router]);

    // Пока контекст пробует тихо обновить токен — показываем загрузку
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Проверка авторизации...</p>
            </div>
        );
    }

    if (!accessToken) {
        return null; // Ждем срабатывания useEffect для редиректа
    }

    return (
        <main className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Главная панель управления (Dashboard)
                </h1>
                <p className="text-gray-600 mb-6">
                    Добро пожаловать,{" "}
                    <span className="font-semibold text-primary">
                        {user?.username || "пользователь"}
                    </span>
                    ! Вы авторизованы в системе финансового аудита.
                </p>

                <button
                    onClick={async () => {
                        await logout();
                        router.replace("/login");
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                >
                    Выйти из системы
                </button>
            </div>
        </main>
    );
}
