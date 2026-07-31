import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const { pathname } = request.nextUrl;

    // Если пользователя нет и он пытается зайти на главную (или другие защищенные страницы)
    if (!token && pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Если пользователь УЖЕ авторизован, но заходит на страницу /login
    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

// Указываем, для каких путей запускать проверку
export const config = {
    matcher: ["/", "/login"],
};
