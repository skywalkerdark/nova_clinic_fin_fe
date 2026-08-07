"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw } from "lucide-react";

export interface PaymentMethod {
    id: number;
    name: string;
    code: string;
}

export interface Transaction {
    id: string | number;
    amount: string | number;
    currency: string;
    paymentMethodId: number;
    paymentMethod: PaymentMethod; //"CASH" | "CARD" | "BANK_TRANSFER";
    patientFullName?: string | null;
    createdAt: string;
    doctor?: {
        id: number;
        firstName: string;
        lastName: string;
    } | null;
    createdBy: {
        id: string | number;
        username: string;
        firstName?: string | null;
        lastName?: string | null;
    };
    cashbox: {
        id: number;
        name: string;
    };
}

interface TransactionsTableProps {
    endpoint: string;
    type: "ALL" | "INSURANCE";
    refreshTrigger?: number;
    onRefresh?: () => void;
}

export const TransactionsTable = ({
    endpoint,
    type,
    refreshTrigger,
    onRefresh,
}: TransactionsTableProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get(endpoint);
            const data = res.data;

            console.log("Fetched transactions data:", data);
            // ЗАЩИТА: Проверяем, массив ли пришёл с бэкенда
            if (Array.isArray(data)) {
                setTransactions(data);
            } else if (data && Array.isArray(data.transactions)) {
                setTransactions(data.transactions);
            } else if (data && Array.isArray(data.data)) {
                setTransactions(data.data);
            } else {
                setTransactions([]);
            }
        } catch (err: any) {
            console.error("Ошибка при получении транзакций:", err);
            setError(
                err.response?.data?.message ||
                    "Не удалось загрузить транзакции",
            );
            setTransactions([]); // Гарантируем, что state останется массивом
        } finally {
            setIsLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions, refreshTrigger]);

    // Достаем простые значения для зависимостей useEffect
    const userId = user?.id;
    const userRole = user?.role;

    // WebSocket подписка
    useEffect(() => {
        const socketUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const socket: Socket = io(socketUrl, {
            withCredentials: true,
        });

        socket.on("transactionCreated", (newTransaction: Transaction) => {
            if (
                userRole === "USER" &&
                String(newTransaction.createdBy.id) !== String(userId)
            ) {
                return;
            }

            // if (
            //     type === "INSURANCE" &&
            //     newTransaction.paymentMethod !== "BANK_TRANSFER"
            // ) {
            //     return;
            // }

            setTransactions((prev) =>
                Array.isArray(prev)
                    ? [newTransaction, ...prev]
                    : [newTransaction],
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, userRole, type]); // Передаём примитивы вместо объекта user

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const getPaymentMethodBadge = (pm?: PaymentMethod | null) => {
        let cssClass = "";
        if (!pm)
            return <span className="text-gray-400 dark:text-gray-600">—</span>;
        switch (pm.code) {
            case "CASH":
                cssClass = "text-gray-600 dark:text-gray-400";
                break;
            case "CARD":
                cssClass = "text-indigo-600 dark:text-indigo-400";
                break;
            case "BANK_TRANSFER":
                cssClass = "text-amber-600 dark:text-amber-400";
                break;
            default:
                cssClass = "text-gray-600 dark:text-gray-400";
                break;
        }
        return <span className={cssClass}>{pm.name}</span>;
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex justify-end mb-2">
                <button
                    onClick={onRefresh || fetchTransactions}
                    disabled={isLoading}
                    className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition flex items-center gap-1 disabled:opacity-50"
                    title="Обновить список"
                >
                    <RefreshCw
                        className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
                    />
                    {isLoading ? "Загрузка..." : "Обновить"}
                </button>
            </div>

            <div className="flex-1 min-h-0 w-full overflow-hidden custom-scrollbar border border-gray-200 dark:border-gray-800/60 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                <div className="h-full w-full overflow-y-auto overflow-x-auto">
                    {isLoading && transactions.length === 0 ? (
                        <div className="flex h-full items-center justify-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                            Загрузка списка транзакций...
                        </div>
                    ) : error ? (
                        <div className="flex h-full items-center justify-center py-12 text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    ) : !Array.isArray(transactions) ||
                      transactions.length === 0 ? (
                        <div className="flex h-full items-center justify-center py-12 text-gray-500 dark:text-gray-500 text-sm">
                            Транзакций пока нет
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300 border-collapse">
                            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-900 sticky top-0 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 z-10">
                                <tr>
                                    <th className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                                        Дата / Время
                                    </th>
                                    <th className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                                        Сумма
                                    </th>
                                    <th className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                                        Метод
                                    </th>
                                    <th className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                                        Пациент
                                    </th>
                                    <th className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                                        Врач
                                    </th>
                                    <th className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                                        Провёл (User)
                                    </th>
                                    <th className="py-3 px-4 bg-gray-100 dark:bg-gray-900">
                                        Касса
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
                                {/* БЕЗОПАСНЫЙ `.map()` с проверкой Array.isArray */}
                                {Array.isArray(transactions) &&
                                    transactions.map((tx) => {
                                        const numAmount = Number(tx.amount);
                                        const isPositive = numAmount > 0;

                                        return (
                                            <tr
                                                key={tx.id.toString()}
                                                className="hover:bg-gray-100 dark:hover:bg-gray-800/30 transition"
                                            >
                                                <td className="py-3 px-4 font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                    {formatDate(tx.createdAt)}
                                                </td>
                                                <td
                                                    className={`py-3 px-4 font-semibold whitespace-nowrap ${
                                                        isPositive
                                                            ? "text-emerald-600 dark:text-emerald-400"
                                                            : "text-red-600 dark:text-red-400"
                                                    }`}
                                                >
                                                    {isPositive
                                                        ? `+${numAmount}`
                                                        : numAmount}{" "}
                                                    <span className="text-xs opacity-80">
                                                        {tx.currency}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-xs whitespace-nowrap">
                                                    {getPaymentMethodBadge(
                                                        tx.paymentMethod,
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {tx.patientFullName || (
                                                        <span className="text-gray-400 dark:text-gray-600">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {tx.doctor ? (
                                                        `${tx.doctor.lastName} ${tx.doctor.firstName[0]}.`
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-600">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs">
                                                    {tx.createdBy.firstName &&
                                                    tx.createdBy.lastName
                                                        ? `${tx.createdBy.firstName} ${tx.createdBy.lastName}`
                                                        : tx.createdBy.username}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <span className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                                        {tx.cashbox.name}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
