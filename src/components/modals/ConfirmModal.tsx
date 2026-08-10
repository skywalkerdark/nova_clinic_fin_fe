"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: "danger" | "warning";
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmModal = ({
    isOpen,
    title = "Подтвердите действие",
    description = "Вы уверены? Это действие нельзя будет отменить.",
    confirmText = "Удалить",
    cancelText = "Отмена",
    isLoading = false,
    variant = "danger",
    onClose,
    onConfirm,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Бэкдроп с размытием */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={isLoading ? undefined : onClose}
            />

            {/* Контейнер модалки */}
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-4">
                <div className="flex items-start gap-4">
                    {/* Иконка типа действия */}
                    <div
                        className={`p-3 rounded-full shrink-0 ${
                            variant === "danger"
                                ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                : "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        }`}
                    >
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Кнопки управления */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-xs px-3 py-1.5"
                    >
                        {cancelText}
                    </Button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-1.5 text-xs font-medium text-white rounded-lg transition disabled:opacity-50 ${
                            variant === "danger"
                                ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                : "bg-amber-600 hover:bg-amber-700"
                        }`}
                    >
                        {isLoading ? "Удаление..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
