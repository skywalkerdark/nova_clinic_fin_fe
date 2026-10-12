"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button"; // Используем твой обновленный компонент Button

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex h-full w-full flex-col items-center justify-center px-5 text-center font-sans text-teal-700">
            <h1 className="mb-4 text-7xl font-bold">404</h1>
            <h2 className="mb-3 text-2xl">Страница находится в разработке.</h2>
            <p className="mb-6 max-w-64 text-teal-600">
                Вскоре она будет доступна.
            </p>
            <Button
                onClick={() => router.back()}
                className="bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
                Вернуться назад
            </Button>
        </div>
    );
}
