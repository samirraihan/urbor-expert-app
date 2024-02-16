const APP_NAME = process.env.APP_NAME || "Admin Panel";
const BASE_URL = process.env.BASE_URL || "http://localhost:8040/";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8040/api/v1/";
const SERVER_STORAGE_URL = process.env.SERVER_STORAGE_URL || "http://localhost:8040/storage/";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001/";

export default defineNuxtConfig ({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            appName: APP_NAME,
            baseUrl: BASE_URL,
            apiBaseUrl: API_BASE_URL,
            serverStorageUrl: SERVER_STORAGE_URL,
            backendUrl: BACKEND_URL,
            frontendUrl: FRONTEND_URL,
        }
    },
    ssr: false,
    modules: [
        '@pinia/nuxt',
    ],
})
