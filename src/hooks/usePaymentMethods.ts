import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface PaymentMethod {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
}

export function usePaymentMethods() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Загрузка списка методов
    const fetchMethods = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get<PaymentMethod[]>(
                "/payment-methods/all",
            );
            setMethods(data);
        } catch (err) {
            console.error("Ошибка загрузки методов оплаты", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Оптимистичное переключение активности
    const toggleActive = async (item: PaymentMethod) => {
        setMethods((prev) =>
            prev.map((m) =>
                m.id === item.id ? { ...m, isActive: !m.isActive } : m,
            ),
        );

        try {
            await api.patch(`/payment-methods/${item.id}`, {
                isActive: !item.isActive,
            });
        } catch (err) {
            console.error("Не удалось изменить статус", err);
            // Откатываем состояние назад при ошибке
            fetchMethods();
        }
    };

    // Удаление метода
    const deleteMethod = async (id: number) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            await api.delete(`/payment-methods/${id}`);
            await fetchMethods();
            return true;
        } catch (err: any) {
            setDeleteError(
                err.response?.data?.message ||
                    "Не удалось удалить метод оплаты",
            );
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, [fetchMethods]);

    return {
        methods,
        isLoading,
        isDeleting,
        deleteError,
        setDeleteError,
        fetchMethods,
        toggleActive,
        deleteMethod,
    };
}
