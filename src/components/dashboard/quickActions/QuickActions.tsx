"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "../../ui/Button";

interface QuickActionsProps {
    onCreateUser?: () => void;
}

export const QuickActions = ({ onCreateUser }: QuickActionsProps) => {
    const { user } = useAuth();
    return (
        <section className="bg-gray-800/40 border border-gray-800 rounded-xl p-5 shrink-0 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">
                Быстрые действия
            </h2>
            <Button
                onClick={() => {}}
                className="w-full flex items-center justify-between px-4 py-2 text-white rounded-lg transition"
            >
                <span>Добавить платёж</span>
                <span className="text-xl leading-none">+</span>
            </Button>
            {user?.role === "SUPERADMIN" && (
                <Button
                    onClick={onCreateUser}
                    className="w-full flex items-center justify-between px-4 py-2 text-white rounded-lg transition"
                >
                    <span>Создать пользователя</span>
                    <span className="text-xl leading-none">+</span>
                </Button>
            )}
        </section>
    );
};
