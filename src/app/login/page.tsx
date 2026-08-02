"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Вызываем метод login из контекста (он сделает POST /auth/login)
            await login({ username, password });

            // После успешного входа перенаправляем на главную или в дашборд
            console.log("Login successful, redirecting to dashboard...");
            // Используем replace вместо push (чтобы юзер не возвращался на /login по стрелке "Назад")
            // И refresh() заставит App Router перечитать Server Components
            router.replace("/");
            router.refresh();
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 bg-white rounded-xl shadow-md space-y-4 text-gray-700"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Вход в систему
                </h2>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium ">
                        Имя пользователя
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium ">Пароль</label>
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
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary outline-none transition"
                    />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Входим..." : "Войти"}
                </Button>
            </form>
        </div>
    );
}
