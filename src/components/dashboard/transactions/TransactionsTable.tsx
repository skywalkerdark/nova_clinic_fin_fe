"use client";

export const TransactionsTable = () => {
    return (
        <section className="lg:col-span-3 bg-gray-800/40 border border-gray-800 rounded-xl p-5 flex flex-col h-full min-h-0 overflow-hidden">
            <h2 className="text-lg font-semibold text-white mb-4 shrink-0">
                Последние транзакции
            </h2>

            {/* Оболочка с зафиксированным overflow */}
            <div className="flex-1 min-h-0 w-full overflow-hidden custom-scrollbar border border-gray-800/60 rounded-lg bg-gray-900/30">
                {/* Сам скролл-контейнер */}
                <div className="h-full w-full overflow-y-auto overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300 border-collapse">
                        <thead className="text-xs uppercase bg-gray-900 sticky top-0 text-gray-400 border-b border-gray-800 z-10">
                            <tr>
                                <th className="py-3 px-4 bg-gray-900">
                                    Дата / Время
                                </th>
                                <th className="py-3 px-4 bg-gray-900">Сумма</th>
                                <th className="py-3 px-4 bg-gray-900">
                                    ФИО пациента
                                </th>
                                <th className="py-3 px-4 bg-gray-900">
                                    ФИО врача
                                </th>
                                <th className="py-3 px-4 bg-gray-900">
                                    Провёл (User)
                                </th>
                                <th className="py-3 px-4 bg-gray-900">Касса</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {Array.from({ length: 25 }).map((_, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-800/30 transition"
                                >
                                    <td className="py-3 px-4 font-mono text-xs text-gray-400 whitespace-nowrap">
                                        03.08 12:40
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-emerald-400 whitespace-nowrap">
                                        1 500 UAH
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        Иванов Иван Иванович
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        Петров А. В.
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-gray-400">
                                        Serhii Vyshnevskyi
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <span className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            Главная касса
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
