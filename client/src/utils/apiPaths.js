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

}