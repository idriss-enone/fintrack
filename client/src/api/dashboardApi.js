
//import api from "@/lib/axios";
import api from "@/lib/api";
import { API_PATHS } from "@/utils/apiPaths";



export const getSummary = async () => {
    const res = await api.get(API_PATHS.DASHBOARD.SUMMARY);
    return res.data;

};
export const getMonthlyTrend = async () => {
    const res = await api.get(API_PATHS.DASHBOARD.MONTHLY_TREND);
    return res.data;
};

export const getCategoryBreakdown = async () => {
    const res = await api.get(API_PATHS.DASHBOARD.CATEGORY_BREAKDOWN);
    return res.data;
};