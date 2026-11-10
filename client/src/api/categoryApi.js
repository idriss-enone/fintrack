
//import api from "@/lib/axios";
import api from "@/lib/api";
import { API_PATHS } from "@/utils/apiPaths";



export const list = () => {
    return api.get(API_PATHS.CATEGORIES.LIST).then((res) => res.data)
};
export function create(payload) {
    return api.post(API_PATHS.CATEGORIES.CREATE, payload).then((res) => res.data);
}

export function update(id, payload) {
    return api.patch(API_PATHS.CATEGORIES.UPDATE(id), payload).then((res) => res.data);
}

export function remove(id) {
    return api.delete(API_PATHS.CATEGORIES.DELETE(id)).then((res) => res.data);
}
