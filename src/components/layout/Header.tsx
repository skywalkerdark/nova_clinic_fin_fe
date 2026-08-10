"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Settings, Home } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import Link from "next/link";

export const Header = () => {
    const { user, logout, accessToken } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Не показываем Хедер, если юзер не авторизован (например, на странице /login)
    if (!accessToken) return null;

    const isSettingsPage = pathname.startsWith("/settings");
    const canAccessSettings = user?.role === "SUPERADMIN";

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/50 backdrop-blur px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative h-8 w-32 overflow-hidden">
                    <Image
                        src="/logo.png"
                        alt="NCF Audit Logo"
                        fill
                        sizes="128px"
                        className="object-contain"
                        priority
                    />
                </div>
                <span className="font-semibold text-lg tracking-wide text-gray-900 dark:text-white">
                    NCFA{" "}
                    {user?.role === "SUPERADMIN" && (
                        <span className="text-xs px-2 py-0.5 rounded bg-teal-100 dark:bg-[#2dd4bf]/10 text-teal-700 dark:text-[#5eead4] border border-teal-200 dark:border-[#2dd4bf]/20 ml-2 font-normal">
                            Superadmin
                        </span>
                    )}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* Кнопка «Настройки» (шестерёнка) */}
                {canAccessSettings && (
                    <Link
                        href={isSettingsPage ? "/" : "/settings"}
                        title={
                            isSettingsPage
                                ? "Вернуться на главную"
                                : "Настройки системы"
                        }
                        className={`p-2 rounded-lg border transition-all ${
                            isSettingsPage
                                ? "bg-teal-100/60 dark:bg-[#2dd4bf]/10 border-teal-300 dark:border-[#2dd4bf]/30 text-teal-700 dark:text-[#5eead4]"
                                : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                    >
                        {isSettingsPage ? (
                            <Home className="w-5 h-5" />
                        ) : (
                            <Settings className="w-5 h-5" />
                        )}
                    </Link>
                )}
                <ThemeToggle />
                <div className="text-right text-sm">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {user?.role}
                    </p>
                </div>
                <Button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-sm font-light rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-red-600/10 hover:text-red-600 dark:hover:bg-red-600/20 dark:hover:text-red-400 transition"
                >
                    Выйти
                </Button>
            </div>
        </header>
    );
};
