"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Users, Building } from "lucide-react"; // Иконки для табов

const SETTINGS_TABS = [
    {
        name: "Методы оплаты",
        href: "/settings/payment-methods",
        icon: CreditCard,
    },
    { name: "Пользователи", href: "/settings/users", icon: Users },
    { name: "Кассы", href: "/settings/cashboxes", icon: Building },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Настройки
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Управление справочниками и доступами системы
                </p>
            </div>

            <div className="flex flex-1 gap-8 items-start">
                {/* Вертикальные табы (Сайдбар) */}
                <aside className="w-64 shrink-0 flex flex-col gap-1">
                    {SETTINGS_TABS.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                                    isActive
                                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-medium shadow-sm"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                            </Link>
                        );
                    })}
                </aside>

                {/* Область контента (сюда подставляются page.tsx из вложенных папок) */}
                <main className="flex flex-col h-full flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm min-h-125">
                    {children}
                </main>
            </div>
        </div>
    );
}
