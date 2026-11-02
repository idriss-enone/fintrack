import realApi from "./axios";
import mockApi from "./mockApi";

const api = import.meta.env.VITE_USE_MOCK === "true" ? mockApi : realApi;

export default api;