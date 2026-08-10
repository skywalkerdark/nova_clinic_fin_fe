import axios from "axios";

// Храним токен в обычной переменной модуля (in-memory)
let inMemoryToken: string | null = null;

export const setInMemoryToken = (token: string | null) => {
    inMemoryToken = token;
};

export const getInMemoryToken = () => inMemoryToken;

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Обязательно: передает httpOnly куки на бэкенд (4000 порт)
    headers: {
        "Content-Type": "application/json",
    },
});

// Переменные для управления очередью запросов при одновременных 401 ошибках
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 1. Request Interceptor: срабатывает СТРОГО перед каждым запросом
api.interceptors.request.use(
    (config) => {
        const token = getInMemoryToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// 2. Response Interceptor: перехватывает 401 и тихо обновляет токен
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Перехватываем 401 Unauthorized, исключая сам логин и рефреш
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh") &&
            !originalRequest.url?.includes("/auth/login")
        ) {
            // Если параллельный запрос УЖЕ запустил обновление токена — встаем в очередь
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Делаем отдельный запрос через чистый axios (чтобы не зациклить интерцепторы)
                const { data } = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                const newAccessToken = data.accessToken;

                // Обновляем токен в памяти модуля
                setInMemoryToken(newAccessToken);

                // Задаем заголовок для упавшего и будущих запросов
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Пропускаем все накопившиеся в очереди запросы с новым токеном
                processQueue(null, newAccessToken);

                // Повторяем исходный запрос
                return api(originalRequest);
            } catch (refreshError) {
                // Если refresh token истёк — чистим токен и отправляем на страницу входа
                processQueue(refreshError, null);
                setInMemoryToken(null);

                if (
                    typeof window !== "undefined" &&
                    !window.location.pathname.startsWith("/login")
                ) {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);
