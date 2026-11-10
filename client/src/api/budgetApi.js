
//import api from "@/lib/axios";
import api from "@/lib/api";
import { API_PATHS } from "@/utils/apiPaths";



export const list = async () => {
    const res = await api.get(API_PATHS.BUDGETS.LIST);
    return res.data;
};
export const create = async (payload) => {
    const res = await api.post(API_PATHS.BUDGETS.CREATE, payload);
    return res.data;
}

export const update = async (id, payload) => {
    const res = await api.patch(API_PATHS.BUDGETS.UPDATE(id), payload);
    return res.data;
}

export const remove = async (id) => {
    const res = await api.delete(API_PATHS.BUDGETS.DELETE(id));
    return res.data;
}

export const analyze = async () => {
    const res = await api.post(API_PATHS.BUDGETS.ANALYZE);
    return res.data;
};
