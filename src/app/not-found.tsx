// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center font-sans text-teal-700">
            <h1 className="mb-4 text-7xl font-bold ">404</h1>
            <h2 className="mb-3 text-2xl">Страница не найдена</h2>
            <p className="mb-6 max-w-64 text-teal-600">
                Извините, запрашиваемая страница не существует или была
                перемещена.
            </p>
            <Link
                href="/"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
                Вернуться на главную
            </Link>
        </div>
    );
}
