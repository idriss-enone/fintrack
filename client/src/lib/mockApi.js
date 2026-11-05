import { mockUser, mockCategories } from "../utils/mockData";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
let nextId = 1000;
const newId = () => nextId++;




const api = {
    get: async (url) => {
        // Simulation d'un appel réseau
        await delay();

        if (url === '/auth/me') return { data: mockUser }
        if (url === '/categories') return { data: mockCategories };

        return { data: null };
    },
    post: async (url, body = {}) => {
        // Simulation d'un appel réseau
        await delay();
        if (url === '/auth/login') {
            const token = 'mock-token'
            return {

                data: {
                    user: { ...mockUser, email: body.email || mockUser.email },
                    token
                }
            }
        }
        if (url === '/auth/register') {
            const token = 'mock-token'
            return {
                data: {
                    user: {
                        id: newId(),
                        name: body.name || mockUser.name,
                        email: body.email || mockUser.email,
                        currency: body.currency || "USD",
                    },
                    token
                }
            }
        }
        if (url === '/categories') return { data: { id: newId(), is_default: false, ...body } };

        return { data: null }
    },
    put: async (url, body = {}) => {
        await delay();
        const idMatch = url.match(/\/(\d+)$/);
        const id = idMatch ? parseInt(idMatch[1], 10) : newId();
        return { data: { id, ...body } }
    },
    delete: async () => {
        await delay();
        return {
            data: {
                message: "deleted"
            }
        }
    }
}

export default api