import axios from "axios";

export const api = axios.create({
    baseURL: "https://ss-store-production.up.railway.app/api",
});

// 🔥 AUTO KIRIM TOKEN KE SEMUA REQUEST
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});