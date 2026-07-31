"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Имитация запроса к NestJS бэкенду (POST http://localhost:3000/auth/login)
            // Когда свяжем с бэкендом — подставим fetch()
            if (email && password) {
                // Записываем фейковый токен в куки на 1 день
                Cookies.set("auth_token", "mock_jwt_token_12345", {
                    expires: 1,
                });

                // Перенаправляем на главную
                router.replace("/");
            } else {
                setError("Заполните все поля");
            }
        } catch (err) {
            setError("Ошибка при входе в систему");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Вход в систему
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 text-gray-700"
                    autoComplete="off"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="text" // Используем text вместо email, чтобы Chrome не привязывал к нему логин
                            inputMode="email" // На мобилках покажет удобную клавиатуру с @
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            aria-autocomplete="none"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="••••••••"
                            autoComplete="new-password" // <-- Ключевой хак для браузеров
                        />
                    </div>

                    {/* <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Вход..." : "Войти"}
                    </button> */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Вход..." : "Войти"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
