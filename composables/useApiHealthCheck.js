import { useAuthStore } from '~/stores/auth';

export function useApiStatusCheck() {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.public['apiBaseUrl'];
    const error = ref(null);
    const { $toast } = useNuxtApp();

    const checkApiStatus = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}` + 'api-health-check');
        } catch (err) {
            error.value = `Server Not Responding! Please try again later.: ${err}`;
            console.log(error.value);
            $toast.error("Server Not Responding! Please try again later.");
            
            const authToken = ref(localStorage.getItem('AUTH_TOKEN'));
            if (authToken.value) {
                localStorage.removeItem("AUTH_STATUS");
                localStorage.removeItem("AUTH_TOKEN");
                localStorage.removeItem("AUTH_USER");
                localStorage.removeItem("AUTH_USER_PHONE_VERIFIED");
                localStorage.removeItem("AUTH_NEXT_LOGOUT_DATETIME");
                localStorage.removeItem("AUTH_EXPIRE_ON_BROWSER_CLOSE");
                localStorage.removeItem("AUTH_LOGIN_DATETIME");
                navigateTo('/error');
            }
        }
    };

    onMounted(() => {
        checkApiStatus();
    });

    return {
        error,
        checkApiStatus,
    };
}
