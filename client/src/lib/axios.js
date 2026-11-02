import axios from "axios";
import { getAccessToken, clearAccessToken } from "./storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];
const isAuthEndpoint = (url = "") =>
    AUTH_ENDPOINTS.some((path) => url.includes(path));

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000, // 15 secondes
});


api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
},
);


api.interceptors.response.use(
    (response) => response,

    (error) => {
        const url = error.config?.url || '';
        if (error.response?.status === 401 && !isAuthEndpoint(url)) {
            clearAccessToken();
            //window.location.href = '/login'
            window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(error);
    }

);

export default api

