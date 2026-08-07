"use client";

import { useState } from "react";
import { TransactionsTable } from "./TransactionsTable";

export type TabType = "ALL" | "INSURANCE";

interface TransactionsContainerProps {
    refreshTrigger?: number;
}

export const TransactionsContainer = ({
    refreshTrigger,
}: TransactionsContainerProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("ALL");
    const [reloadKey, setReloadKey] = useState(0);

    // Принудительное обновление текущей активной таблицы
    const handleRefresh = () => {
        setReloadKey((prev) => prev + 1);
    };

    return (
        <section className="lg:col-span-3 bg-white/90 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col h-full min-h-0 overflow-hidden shadow-sm">
            {/* Навигация по вкладкам (Header) */}
            <div className="flex items-center justify-between mb-4 shrink-0 border-b border-gray-200 dark:border-gray-800 pb-2">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveTab("ALL")}
                        className={`text-sm font-semibold transition relative pb-2 -mb-2 ${
                            activeTab === "ALL"
                                ? "text-gray-900 dark:text-gray-100 border-b-2 border-primary"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                    >
                        Последние транзакции
                    </button>

                    <button
                        onClick={() => setActiveTab("INSURANCE")}
                        className={`text-sm font-semibold transition relative pb-2 -mb-2 ${
                            activeTab === "INSURANCE"
                                ? "text-gray-900 dark:text-gray-100 border-b-2 border-primary"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                    >
                        Страховые платежи
                    </button>
                </div>
            </div>

            {/* Контент активной вкладки */}
            <div className="flex-1 min-h-0 w-full overflow-hidden">
                {activeTab === "ALL" ? (
                    <TransactionsTable
                        endpoint="/transactions"
                        type="ALL"
                        refreshTrigger={(refreshTrigger || 0) + reloadKey}
                        onRefresh={handleRefresh}
                    />
                ) : (
                    <TransactionsTable
                        endpoint="/transaction1s?paymentMethod=BANK_TRANSFER" // Или твой бэкенд URL для страховых: /transactions/insurance
                        type="INSURANCE"
                        refreshTrigger={(refreshTrigger || 0) + reloadKey}
                        onRefresh={handleRefresh}
                    />
                )}
            </div>
        </section>
    );
};
