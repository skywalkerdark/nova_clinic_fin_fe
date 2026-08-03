"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MetricsBlock } from "@/components/dashboard/metrics/MetricsBlock";
import { TransactionsTable } from "@/components/dashboard/transactions/TransactionsTable";
import { QuickActions } from "@/components/dashboard/quickActions/QuickActions";
import { CreateUserModal } from "@/components/dashboard/quickActions/CreateUserModal";

export default function HomePage() {
    const router = useRouter();
    const { user, accessToken, logout, isLoading } = useAuth();
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

    useEffect(() => {
        console.log("Checking authentication status...");
        // Проверяем авторизацию после завершения первичной загрузки сессии
        if (!isLoading && !accessToken) {
            console.log("User is not authenticated, redirecting to login...");
            router.replace("/login");
        }
    }, [accessToken, isLoading, router]);

    // Пока контекст пробует тихо обновить токен — показываем загрузку
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Проверка авторизации...</p>
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
                <TransactionsTable />
                <QuickActions onCreateUser={() => setIsCreateUserOpen(true)} />
            </div>

            {/* Модалка создания пользователя */}
            <CreateUserModal
                isOpen={isCreateUserOpen}
                onClose={() => setIsCreateUserOpen(false)}
                onSuccess={() => {
                    // Тут в будущем можно триггернуть обновление списка пользователей или toast
                    console.log("Пользователь успешно создан!");
                }}
            />
        </main>
    );
}
