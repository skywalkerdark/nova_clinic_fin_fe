"use client";

import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateUserModal = ({
    isOpen,
    onClose,
    onSuccess,
}: CreateUserModalProps) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "USER", // По умолчанию обычный пользователь
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        resetForm();
        setError(null);
        onClose();
    };

    // Закрытие по клавише Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData({
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            role: "USER",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Подключим твой инстанс api / axios
            await api.post("/users", formData);
            console.log("Создание пользователя:", formData);

            // Имитация успешного запроса
            await new Promise((res) => setTimeout(res, 600));

            // Сброс формы и закрытие
            if (onSuccess) onSuccess();
            handleClose();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Ошибка при создании пользователя",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 1. Бэкдроп / Оверлей */}
            <div
                className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* 2. Контейнер модального окна */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-5">
                {/* Заголовок */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Создать пользователя
                    </h3>
                    <Button
                        onClick={handleClose}
                        variant="outline"
                        className="text-xl p-1"
                    >
                        ✕
                    </Button>
                </div>

                {/* Ошибка */}
                {error && (
                    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                        {error}
                    </div>
                )}

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Логин (Username) *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            autoComplete="off"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    username: e.target.value,
                                })
                            }
                            placeholder="Username"
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Пароль *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            autoComplete="off"
                            aria-autocomplete="none"
                            // CSS-свойство превращает вводимый текст в кружочки/точки:
                            style={
                                {
                                    WebkitTextSecurity: "disc",
                                } as React.CSSProperties
                            }
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Имя
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        firstName: e.target.value,
                                    })
                                }
                                placeholder="Сергей"
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Фамилия
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        lastName: e.target.value,
                                    })
                                }
                                placeholder="Вишневский"
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Роль в системе
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                        >
                            <option value="USER">Кассир</option>
                            <option value="ADMIN">Администратор</option>
                            <option value="SUPERADMIN">
                                Суперадминистратор
                            </option>
                        </select>
                    </div>

                    {/* Кнопки действия */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className=""
                        >
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isLoading} className="">
                            {isLoading ? "Создание..." : "Создать"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
