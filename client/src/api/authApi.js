//import api from "@/lib/axios";
import api from "@/lib/api";
import { API_PATHS } from "@/utils/apiPaths";


export const loginRequest = async (email, password) => {
    const res = await api.post(API_PATHS.AUTH.LOGIN, { email, password });
    return res.data;
};

export const registerRequest = async (data) => {
    const res = await api.post(API_PATHS.AUTH.REGISTER, data);
    return res.data;
};

export const getMeRequest = async () => {
    const res = await api.get(API_PATHS.AUTH.ME);
    return res.data;
};