"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function HomePage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Проверяем наличие токена авторизации
        const token = Cookies.get("auth_token");

        if (!token) {
            // Если токена нет — перенаправляем на страницу входа
            router.replace("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // Пока идет проверка токена — показываем спиннер или пустой экран
    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Проверка авторизации...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Главная панель управления (Dashboard)
                </h1>
                <p className="text-gray-600 mb-6">
                    Добро пожаловать! Вы авторизованы в системе финансового
                    аудита.
                </p>

                <button
                    onClick={() => {
                        Cookies.remove("auth_token");
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
