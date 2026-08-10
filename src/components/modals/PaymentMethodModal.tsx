"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface PaymentMethod {
    id: number;
    name: string;
    code: string;
    isActive?: boolean;
}

interface PaymentMethodModalProps {
    isOpen: boolean;
    initialData?: PaymentMethod | null; // Если передано — режим редактирования, если null/undefined — создание
    onClose: () => void;
    onSuccess?: () => void;
}

export const PaymentMethodModal = ({
    isOpen,
    initialData,
    onClose,
    onSuccess,
}: PaymentMethodModalProps) => {
    const isEditMode = Boolean(initialData);

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Заполняем форму при открытии или смене initialData
    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setName(initialData.name);
            setCode(initialData.code);
        } else {
            setName("");
            setCode("");
        }
        setError(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const payload = {
            name,
            code: code.toUpperCase().trim().replace(/\s+/g, "_"),
        };

        try {
            if (isEditMode && initialData) {
                // Обновление существующего метода
                await api.patch(`/payment-methods/${initialData.id}`, payload);
            } else {
                // Создание нового метода
                await api.post("/payment-methods", payload);
            }

            setName("");
            setCode("");
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    (isEditMode
                        ? "Ошибка при обновлении метода оплаты"
                        : "Ошибка при создании метода оплаты"),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-5 text-gray-900 dark:text-gray-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                        {isEditMode
                            ? "Редактировать способ оплаты"
                            : "Новый способ оплаты"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Название
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Например: QR-код (Приват)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Системный код (slug)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Например: PRIVAT_QR"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-xs font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition disabled:opacity-50"
                        >
                            {isLoading
                                ? "Сохранение..."
                                : isEditMode
                                  ? "Сохранить"
                                  : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
