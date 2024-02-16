import { useAuthStore } from '~/stores/auth';

export function useAutoLogout() {
    const authToken = ref(localStorage.getItem('AUTH_TOKEN'));

    if (authToken.value) {
        const nextLogoutDatetime = ref(localStorage.getItem('AUTH_NEXT_LOGOUT_DATETIME'));
        const authStore = useAuthStore();
        let intervalId; // Variable to store the interval ID

        const logoutIfExpired = () => {
            const currentTime = new Date();
            const year = currentTime.getFullYear();
            const month = String(currentTime.getMonth() + 1).padStart(2, '0');
            const day = String(currentTime.getDate()).padStart(2, '0');
            const hours = String(currentTime.getHours()).padStart(2, '0');
            const minutes = String(currentTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentTime.getSeconds()).padStart(2, '0');

            const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            if (nextLogoutDatetime.value && formattedTime > nextLogoutDatetime.value) {
                authStore.logout();
                clearInterval(intervalId); // Clear the interval when logging out
            }
        };

        // Check the expiration once when the component is first mounted
        onBeforeMount(() => {
            logoutIfExpired();

            // Set up a timer to check for expiration every 10 minutes
            intervalId = setInterval(logoutIfExpired, 10 * 60 * 1000); // 10 minutes interval
        });

        return {
            nextLogoutDatetime,
            logoutIfExpired,
        };
    }
}
