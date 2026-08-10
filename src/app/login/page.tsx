"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Проверяем авторизацию после завершения первичной загрузки сессии
        if (user) {
            router.replace("/");
            router.refresh();
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Вызываем метод login из контекста (он сделает POST /auth/login)
            await login({ username, password });
        } catch (err: any) {
            // Подтягиваем сообщение об ошибке с бэкенда (например, "Неверный логин или пароль")
            const message = err.response?.data?.message || "Ошибка авторизации";
            setError(Array.isArray(message) ? message.join(", ") : message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg space-y-4 text-gray-900 dark:text-gray-100"
            >
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                    Вход в систему
                </h2>

                {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Имя пользователя
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-1 focus:ring-primary dark:focus:ring-primary/70 outline-none transition"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Пароль
                    </label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="off"
                        aria-autocomplete="none"
                        // CSS-свойство превращает вводимый текст в кружочки/точки:
                        style={
                            {
                                WebkitTextSecurity: "disc",
                            } as React.CSSProperties
                        }
                        className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-1 focus:ring-primary dark:focus:ring-primary/70 outline-none transition"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-semibold"
                >
                    {loading ? "Входим..." : "Войти"}
                </Button>
            </form>
        </div>
    );
}
