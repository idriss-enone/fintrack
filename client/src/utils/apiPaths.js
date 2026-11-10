export const API_PATHS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
    },
    CATEGORIES: {
        LIST: '/categories',
        CREATE: '/categories',
        UPDATE: (id) => `/categories/${id}`,
        DELETE: (id) => `/categories/${id}`
    },
    BUDGETS: {
        LIST: '/budgets',
        CREATE: '/budgets',
        UPDATE: (id) => `/budgets/${id}`,
        DELETE: (id) => `/budgets/${id}`,
        ANALYZE: '/budgets/analyze',
    },

}