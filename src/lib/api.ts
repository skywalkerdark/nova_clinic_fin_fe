import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    withCredentials: true, // Обязательно: передает httpOnly куки на бэкенд (4000 порт)
    headers: {
        "Content-Type": "application/json",
    },
});
