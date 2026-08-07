"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";

export const Header = () => {
    const { user, logout, accessToken } = useAuth();
    const router = useRouter();

    // Не показываем Хедер, если юзер не авторизован (например, на странице /login)
    if (!accessToken) return null;

    console.log("Rendering Header for user:", user);

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
