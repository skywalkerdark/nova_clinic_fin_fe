"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialty?: string;
}

interface Cashbox {
    id: number;
    name: string;
}

interface PaymentMethod {
    id: number;
    name: string;
    code: string;
}

interface CreateTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateTransactionModal = ({
    isOpen,
    onClose,
    onSuccess,
}: CreateTransactionModalProps) => {
    // Справочники из базы
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    // Состояние формы
    const [formData, setFormData] = useState({
        amount: "",
        currency: "UAH",
        paymentMethodId: "",
        patientFullName: "",
        doctorId: "",
        cashboxId: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingOptions, setIsFetchingOptions] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загружаем списки врачей, касс и способов оплаты при открытии модального окна
    useEffect(() => {
        if (!isOpen) return;

        const fetchOptions = async () => {
            setIsFetchingOptions(true);
            setError(null);
            try {
                const [doctorsRes, cashboxesRes, paymentMethodsRes] =
                    await Promise.all([
                        api.get<Doctor[]>("/doctors?activeOnly=true"),
                        api.get<Cashbox[]>("/cashboxes"),
                        api.get<PaymentMethod[]>("/payment-methods"),
                    ]);

                setDoctors(doctorsRes.data);
                setCashboxes(cashboxesRes.data);
                setPaymentMethods(paymentMethodsRes.data);

                // Устанавливаем дефолтные значения из загруженных справочников
                setFormData((prev) => ({
                    ...prev,
                    cashboxId:
                        cashboxesRes.data.length > 0
                            ? String(cashboxesRes.data[0].id)
                            : "",
                    doctorId:
                        doctorsRes.data.length > 0
                            ? String(doctorsRes.data[0].id)
                            : "",
                    paymentMethodId:
                        paymentMethodsRes.data.length > 0
                            ? String(paymentMethodsRes.data[0].id)
                            : "",
                }));
            } catch (err: any) {
                setError(
                    "Не удалось загрузить справочники (врачи/кассы/способы оплаты)",
                );
            } finally {
                setIsFetchingOptions(false);
            }
        };

        fetchOptions();
    }, [isOpen]);

    // Закрытие по Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData({
            amount: "",
            currency: "UAH",
            paymentMethodId:
                paymentMethods.length > 0 ? String(paymentMethods[0].id) : "",
            patientFullName: "",
            doctorId: doctors.length > 0 ? String(doctors[0].id) : "",
            cashboxId: cashboxes.length > 0 ? String(cashboxes[0].id) : "",
        });
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const numAmount = parseFloat(formData.amount);
        if (isNaN(numAmount) || numAmount === 0) {
            setError("Укажите корректную сумму (не равную 0)");
            setIsLoading(false);
            return;
        }

        if (!formData.paymentMethodId) {
            setError("Выберите способ оплаты");
            setIsLoading(false);
            return;
        }

        try {
            await api.post("/transactions", {
                amount: numAmount,
                currency: formData.currency,
                paymentMethodId: Number(formData.paymentMethodId), // Передаем ID новой сущности
                patientFullName: formData.patientFullName || undefined,
                doctorId: Number(formData.doctorId),
                cashboxId: Number(formData.cashboxId),
            });

            resetForm();
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Ошибка при создании транзакции",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Бэкдроп */}
            <div
                className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Модальное окно */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-5">
                {/* Шапка */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Новая транзакция
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

                {isFetchingOptions ? (
                    <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Загрузка справочников...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Сумма и Валюта */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Сумма *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            amount: e.target.value,
                                        })
                                    }
                                    placeholder="1500.00 или -500"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Валюта
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            currency: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                                >
                                    <option value="UAH">UAH (₴)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                        </div>

                        {/* Способ оплаты (Динамический выбор из БД) */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Способ оплаты *
                            </label>
                            <select
                                required
                                value={formData.paymentMethodId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        paymentMethodId: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                            >
                                {paymentMethods.map((pm) => (
                                    <option key={pm.id} value={pm.id}>
                                        {pm.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Врач */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Врач *
                            </label>
                            <select
                                required
                                value={formData.doctorId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        doctorId: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                            >
                                {doctors.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.lastName} {doc.firstName}{" "}
                                        {doc.specialty
                                            ? `(${doc.specialty})`
                                            : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Касса */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Касса *
                            </label>
                            <select
                                required
                                value={formData.cashboxId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cashboxId: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 transition"
                            >
                                {cashboxes.map((cb) => (
                                    <option key={cb.id} value={cb.id}>
                                        {cb.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Пациент */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                ФИО Пациента
                            </label>
                            <input
                                type="text"
                                value={formData.patientFullName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        patientFullName: e.target.value,
                                    })
                                }
                                placeholder="Иванов Иван Иванович"
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 transition"
                            />
                        </div>

                        {/* Кнопки */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Проведение..." : "Провести"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
