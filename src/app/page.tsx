"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MetricsBlock } from "@/components/dashboard/metrics/MetricsBlock";
import { TransactionsContainer } from "@/components/dashboard/transactions/TransactionsContainer";
import { QuickActions } from "@/components/dashboard/quickActions/QuickActions";
import { CreateUserModal } from "@/components/modals/CreateUserModal";
import { CreateTransactionModal } from "@/components/modals/CreateTransactionModal";
import { CreatePaymentMethodModal } from "@/components/modals/CreatePaymentMethodModal";
import { PaymentMethodModal } from "@/components/modals/PaymentMethodModal";

export default function HomePage() {
    const router = useRouter();
    const { user, accessToken, logout, isLoading } = useAuth();
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [isCreateTxOpen, setIsCreateTxOpen] = useState(false); // <-- State для транзакций
    const [isCreatePaymentMethodOpen, setIsCreatePaymentMethodOpen] =
        useState(false); // <-- State для методов оплаты

    useEffect(() => {
        // Проверяем авторизацию после завершения первичной загрузки сессии
        if (!isLoading && !accessToken) {
            router.replace("/login");
        }
    }, [accessToken, isLoading, router]);

    // Пока контекст пробует тихо обновить токен — показываем загрузку
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
                <p>Проверка авторизации...</p>
            </div>
        );
    }

    if (!accessToken) {
        return null; // Ждем срабатывания useEffect для редиректа
    }

    return (
        <main className="flex-1 p-6 max-w-7xl h-full mx-auto w-full flex flex-col gap-6 overflow-hidden">
            <MetricsBlock />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 overflow-hidden">
                <TransactionsContainer />
                <QuickActions
                    onCreateUser={() => setIsCreateUserOpen(true)}
                    onCreateTransaction={() => setIsCreateTxOpen(true)}
                    onCreatePaymentMethod={() =>
                        setIsCreatePaymentMethodOpen(true)
                    }
                />
            </div>

            {/* Модалка создания пользователя */}
            <CreateUserModal
                isOpen={isCreateUserOpen}
                onClose={() => setIsCreateUserOpen(false)}
                onSuccess={() => {
                    // Тут в будущем можно триггернуть обновление списка пользователей или toast
                    // console.log("Пользователь успешно создан!");
                }}
            />

            {/* Модалка проведения транзакции */}
            <CreateTransactionModal
                isOpen={isCreateTxOpen}
                onClose={() => setIsCreateTxOpen(false)}
                onSuccess={() => {
                    // console.log("Транзакция успешно проведена!");
                    // В будущем здесь вызовем refreshTransactions() для обновления таблицы
                }}
            />

            {/* Модалка добавления способа оплаты */}
            <PaymentMethodModal
                isOpen={isCreatePaymentMethodOpen}
                onClose={() => setIsCreatePaymentMethodOpen(false)}
                onSuccess={() => {
                    // console.log("Метод оплаты успешно создан!");
                    // В будущем здесь вызовем refreshTransactions() для обновления таблицы
                }}
            />
        </main>
    );
}
