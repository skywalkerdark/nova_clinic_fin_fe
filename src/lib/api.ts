import axios from "axios";

// Храним токен в обычной переменной модуля (in-memory)
let inMemoryToken: string | null = null;

export const setInMemoryToken = (token: string | null) => {
    inMemoryToken = token;
};

export const getInMemoryToken = () => inMemoryToken;

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    withCredentials: true, // Обязательно: передает httpOnly куки на бэкенд (4000 порт)
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: срабатывает СТРОГО перед каждым запросом
api.interceptors.request.use(
    (config) => {
        const token = getInMemoryToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);
