"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

// Интерфейсы сопоставлены со структурой ответа бэкенда (Prisma include)
export interface Transaction {
    id: string | number;
    amount: string | number;
    currency: string;
    paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER";
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
    refreshTrigger?: number; // Пропс для внешнего триггера рефреша (например, при создании транзакции)
}

export const TransactionsTable = ({
    refreshTrigger,
}: TransactionsTableProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Достаём текущего пользователя из контекста

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await api.get<Transaction[]>("/transactions");
            setTransactions(data);
        } catch (err: any) {
            console.error("Ошибка при получении транзакций:", err);
            setError(
                err.response?.data?.message ||
                    "Не удалось загрузить транзакции",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions, refreshTrigger]);

    // WebSocket подписка на обновления в реальном времени
    useEffect(() => {
        // Подключаемся к WebSocket серверу NestJS (порт 4000)
        const socket: Socket = io("http://localhost:4000", {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("WebSocket connected!");
        });

        // Слушаем событие создания новой транзакции
        socket.on("transactionCreated", (newTransaction: Transaction) => {
            // Если текущий юзер — обычный USER, и транзакцию создал кто-то другой — игнорируем
            if (
                user?.role === "USER" &&
                String(newTransaction.createdBy.id) !== String(user.id)
            ) {
                return;
            }

            // В противном случае добавляем новую транзакцию в таблицу
            setTransactions((prev) => [newTransaction, ...prev]);
        });

        // Очистка при размонтировании компонента
        return () => {
            socket.disconnect();
        };
    }, []);

    // Вспомогательная функция для форматирования даты (03.08 12:40)
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Отображение способа оплаты человеческим языком
    const getPaymentMethodBadge = (method: Transaction["paymentMethod"]) => {
        switch (method) {
            case "CASH":
                return <span className="text-gray-400">Наличные</span>;
            case "CARD":
                return <span className="text-indigo-400">Карта</span>;
            case "BANK_TRANSFER":
                return <span className="text-amber-400">Р/С</span>;
            default:
                return method;
        }
    };

    return (
        <section className="lg:col-span-3 bg-gray-800/40 border border-gray-800 rounded-xl p-5 flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-lg font-semibold text-white">
                    Последние транзакции
                </h2>
                <button
                    onClick={fetchTransactions}
                    disabled={isLoading}
                    className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1 disabled:opacity-50"
                    title="Обновить список"
                >
                    🔄 {isLoading ? "Загрузка..." : "Обновить"}
                </button>
            </div>

            {/* Оболочка с зафиксированным overflow */}
            <div className="flex-1 min-h-0 w-full overflow-hidden custom-scrollbar border border-gray-800/60 rounded-lg bg-gray-900/30">
                <div className="h-full w-full overflow-y-auto overflow-x-auto">
                    {isLoading && transactions.length === 0 ? (
                        <div className="flex h-full items-center justify-center py-12 text-gray-400 text-sm">
                            Загрузка списка транзакций...
                        </div>
                    ) : error ? (
                        <div className="flex h-full items-center justify-center py-12 text-red-400 text-sm">
                            {error}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex h-full items-center justify-center py-12 text-gray-500 text-sm">
                            Транзакций пока нет
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-300 border-collapse">
                            <thead className="text-xs uppercase bg-gray-900 sticky top-0 text-gray-400 border-b border-gray-800 z-10">
                                <tr>
                                    <th className="py-3 px-4 bg-gray-900">
                                        Дата / Время
                                    </th>
                                    <th className="py-3 px-4 bg-gray-900">
                                        Сумма
                                    </th>
                                    <th className="py-3 px-4 bg-gray-900">
                                        Метод
                                    </th>
                                    <th className="py-3 px-4 bg-gray-900">
                                        Пациент
                                    </th>
                                    <th className="py-3 px-4 bg-gray-900">
                                        Врач
                                    </th>
                                    <th className="py-3 px-4 bg-gray-900">
                                        Провёл (User)
                                    </th>
                                    <th className="py-3 px-4 bg-gray-900">
                                        Касса
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {transactions.map((tx) => {
                                    const numAmount = Number(tx.amount);
                                    const isPositive = numAmount > 0;

                                    return (
                                        <tr
                                            key={tx.id.toString()}
                                            className="hover:bg-gray-800/30 transition"
                                        >
                                            {/* Дата */}
                                            <td className="py-3 px-4 font-mono text-xs text-gray-400 whitespace-nowrap">
                                                {formatDate(tx.createdAt)}
                                            </td>

                                            {/* Сумма (зеленая для +, красная для -) */}
                                            <td
                                                className={`py-3 px-4 font-semibold whitespace-nowrap ${
                                                    isPositive
                                                        ? "text-emerald-400"
                                                        : "text-red-400"
                                                }`}
                                            >
                                                {isPositive
                                                    ? `+${numAmount}`
                                                    : numAmount}{" "}
                                                <span className="text-xs opacity-80">
                                                    {tx.currency}
                                                </span>
                                            </td>

                                            {/* Способ оплаты */}
                                            <td className="py-3 px-4 text-xs whitespace-nowrap">
                                                {getPaymentMethodBadge(
                                                    tx.paymentMethod,
                                                )}
                                            </td>

                                            {/* Пациент */}
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {tx.patientFullName || (
                                                    <span className="text-gray-600">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* Врач */}
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                {tx.doctor ? (
                                                    `${tx.doctor.lastName} ${tx.doctor.firstName[0]}.`
                                                ) : (
                                                    <span className="text-gray-600">
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* Кто провел */}
                                            <td className="py-3 px-4 whitespace-nowrap text-gray-400 text-xs">
                                                {tx.createdBy.firstName &&
                                                tx.createdBy.lastName
                                                    ? `${tx.createdBy.firstName} ${tx.createdBy.lastName}`
                                                    : tx.createdBy.username}
                                            </td>

                                            {/* Касса */}
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
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
        </section>
    );
};
