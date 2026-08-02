import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    // <-- Раньше было export function middleware
    const token = request.cookies.get("auth_token")?.value;
    const { pathname } = request.nextUrl;

    // Если пользователя нет и он пытается зайти на главную
    if (!token && pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Если пользователь УЖЕ авторизован, но заходит на /login
    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login"],
};
