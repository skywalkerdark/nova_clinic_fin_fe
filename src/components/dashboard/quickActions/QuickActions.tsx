"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "../../ui/Button";

interface QuickActionsProps {
    onCreateUser?: () => void;
    onCreateTransaction?: () => void; // <-- Добавили пропс
    onCreatePaymentMethod?: () => void; // <-- Добавили пропс
}

export const QuickActions = ({
    onCreateUser,
    onCreateTransaction,
    onCreatePaymentMethod,
}: QuickActionsProps) => {
    const { user } = useAuth();
    return (
        <section className="bg-white/90 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shrink-0 flex flex-col gap-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Быстрые действия
            </h2>
            <Button
                onClick={onCreateTransaction}
                className="w-full flex items-center justify-between"
            >
                <span>Добавить платёж</span>
                <span className="text-xl leading-none">+</span>
            </Button>
            {user?.role === "SUPERADMIN" && (
                <>
                    <Button
                        onClick={onCreateUser}
                        className="w-full flex items-center justify-between"
                    >
                        <span>Создать пользователя</span>
                        <span className="text-xl leading-none">+</span>
                    </Button>
                    <Button
                        onClick={onCreatePaymentMethod}
                        className="w-full flex items-center justify-between"
                    >
                        <span>Добавить метод оплаты</span>
                        <span className="text-xl leading-none">+</span>
                    </Button>
                </>
            )}
        </section>
    );
};
