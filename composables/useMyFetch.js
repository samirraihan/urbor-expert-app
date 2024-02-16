import { useAuthStore } from '~/stores/auth';

export const useMyFetch = async (path, options) => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const { $toast } = useNuxtApp();

    try {
        const response = await $fetch(
            config.public['apiBaseUrl'] + `${path}`,
            {
                ...options,
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                },
            }
        );
        if (response.status !== "success") {
            $toast.error(response.data.message);
        }

        return response;
    } catch (error) {
        if (error.response) {
            console.error('Error:', error.response.status, '-', error.response.statusText);
            const status = error.response.status;
    
            switch (status) {
                case 400:
                    $toast.error("Bad request. Please check your input.");
                    break;
                case 401:
                    $toast.error("Authentication failed. Please log in again.");
                    authStore.logout();
                    break;
                case 403:
                    $toast.error("Access to the resource is forbidden. Please check your permissions.");
                    break;
                case 404:
                    $toast.error("Resource not found. Please check the URL.");
                    break;
                case 405:
                    $toast.error("Method not allowed for this resource. Please check your request method.");
                    break;
                case 422:
                    // $toast.error("Invalid data. Please check your input and try again.");
                    $toast.error(error.response._data.message);
                    break;
                case 429:
                    $toast.error(error.response._data.message);
                    break;
                case 500:
                    $toast.error("Internal server error. Please try again later.");
                    break;
                case 502:
                    $toast.error("Bad gateway error. Please try again later.");
                    break;
                case 503:
                    $toast.error("Service temporarily unavailable. Please try again later.");
                    break;
                case 504:
                    $toast.error("Gateway timeout. Please try again later.");
                    break;
                default:
                    $toast.error(`An error occurred. Status code: ${status}`);
                    break;
            }
        } else {
            console.log("Network Error! Please try again later.");
        }
    }    
}