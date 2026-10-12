import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider"; // 1. Импортируем ThemeProvider

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
    title: "NovaClinic Fin Audit",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        /* 2. Добавляем suppressHydrationWarning для предотвращения конфликтов гидратации next-themes */
        <html lang="ru" suppressHydrationWarning>
            {/* 3. Обновляем классы body: задаём цвета и для светлой, и для тёмной темы */}
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}
            >
                <ThemeProvider>
                    <AuthProvider>
                        <div className="h-screen flex flex-col overflow-hidden">
                            <Header />
                            <div className="flex-1 overflow-hidden">
                                {children}
                            </div>
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
