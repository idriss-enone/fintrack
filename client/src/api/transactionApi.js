//import api from "@/lib/axios";
import api from "@/lib/api";
import { API_PATHS } from "@/utils/apiPaths";

export const list = async (params) => {
    const res = await api.get(API_PATHS.TRANSACTIONS.LIST, { params });
    return res.data;
};
export const create = async (payload) => {
    const res = await api.post(API_PATHS.TRANSACTIONS.CREATE, payload);
    return res.data;
};

export const update = async (id, payload) => {
    const res = await api.patch(API_PATHS.TRANSACTIONS.UPDATE(id), payload);
    return res.data;
};

export const remove = async (id) => {
    const res = await api.delete(API_PATHS.TRANSACTIONS.DELETE(id));
    return res.data;
};

export const analyze = async (ids) => {
    const res = await api.post(API_PATHS.TRANSACTIONS.ANALYZE, { transactionIds: ids });
    return res.data;
};