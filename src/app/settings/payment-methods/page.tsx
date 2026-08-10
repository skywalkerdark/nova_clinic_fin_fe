"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Edit, Trash2, Plus, Power } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaymentMethodModal } from "@/components/modals/PaymentMethodModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

interface PaymentMethod {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
}

export default function PaymentMethodsTab() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<PaymentMethod | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Состояния для диалога удаления
    const [deletingItem, setDeletingItem] = useState<PaymentMethod | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchMethods = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get<PaymentMethod[]>(
                "/payment-methods/all",
            );
            setMethods(data);
        } catch (err) {
            console.error("Ошибка загрузки", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Быстрое переключение активности (isActive)
    const handleToggleActive = async (item: PaymentMethod) => {
        try {
            // Оптимистично обновляем UI
            setMethods((prev) =>
                prev.map((m) =>
                    m.id === item.id ? { ...m, isActive: !m.isActive } : m,
                ),
            );

            await api.patch(`/payment-methods/${item.id}`, {
                isActive: !item.isActive,
            });
        } catch (err) {
            console.error("Не удалось изменить статус", err);
            // Откатываем назад при ошибке
            fetchMethods();
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: PaymentMethod) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handlePromptDelete = (item: PaymentMethod) => {
        setDeletingItem(item);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingItem) return;
        setIsDeleting(true);
        setDeleteError(null);

        try {
            await api.delete(`/payment-methods/${deletingItem.id}`);
            setDeletingItem(null);
            fetchMethods();
        } catch (err: any) {
            setDeleteError(
                err.response?.data?.message ||
                    "Не удалось удалить метод оплаты",
            );
            setDeletingItem(null);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    return (
        <div className="space-y-6">
            {/* Шапка таба */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Методы оплаты
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Управление доступными способами проведения платежей
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="flex items-center gap-2 text-xs font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Добавить метод оплаты
                </Button>
            </div>

            {/* Ошибка удаления */}
            {deleteError && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    {deleteError}
                </div>
            )}

            {/* Таблица */}
            {isLoading ? (
                <div className="py-10 text-center text-sm text-gray-400">
                    Загрузка...
                </div>
            ) : (
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="p-4 font-medium">Название</th>
                                <th className="p-4 font-medium">Код</th>
                                <th className="p-4 font-medium">Статус</th>
                                <th className="p-4 font-medium text-right">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {methods.map((pm) => (
                                <tr
                                    key={pm.id}
                                    className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
                                        !pm.isActive
                                            ? "opacity-60 bg-gray-50/40 dark:bg-gray-900/40"
                                            : ""
                                    }`}
                                >
                                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                                        {pm.name}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs font-mono">
                                            {pm.code}
                                        </span>
                                    </td>
                                    {/* Новая колонка: Статус с кнопкой переключения */}
                                    <td className="p-4">
                                        <button
                                            onClick={() =>
                                                handleToggleActive(pm)
                                            }
                                            title={
                                                pm.isActive
                                                    ? "Деактивировать"
                                                    : "Активировать"
                                            }
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                                                pm.isActive
                                                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200"
                                                    : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300"
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    pm.isActive
                                                        ? "bg-emerald-500"
                                                        : "bg-gray-400"
                                                }`}
                                            />
                                            {pm.isActive
                                                ? "Активен"
                                                : "Отключен"}
                                        </button>
                                    </td>
                                    <td className="p-4 flex items-center justify-end gap-1">
                                        {/* Быстрая кнопка ВКЛ/ВЫКЛ */}
                                        <button
                                            onClick={() =>
                                                handleToggleActive(pm)
                                            }
                                            className={`p-2 rounded transition ${
                                                pm.isActive
                                                    ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                                    : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                            }`}
                                            title={
                                                pm.isActive
                                                    ? "Деактивировать"
                                                    : "Активировать"
                                            }
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(pm)}
                                            className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded transition"
                                            title="Редактировать"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlePromptDelete(pm)
                                            }
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition"
                                            title="Удалить"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Модалка добавления/редактирования */}
            <PaymentMethodModal
                isOpen={isModalOpen}
                initialData={editingItem || undefined}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchMethods}
            />

            {/* Модальное окно подтверждения удаления */}
            <ConfirmModal
                isOpen={Boolean(deletingItem)}
                title="Удаление способа оплаты"
                description={`Вы действительно хотите удалить метод "${deletingItem?.name}"? Это действие нельзя будет отменить.`}
                confirmText="Удалить"
                cancelText="Отмена"
                isLoading={isDeleting}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
