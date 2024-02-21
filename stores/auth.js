import { defineStore } from 'pinia'
const { $toast } = useNuxtApp();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: localStorage.getItem("AUTH_STATUS") || false,
        user: JSON.parse(localStorage.getItem("AUTH_USER")) || null,
        phoneVerified: localStorage.getItem("AUTH_USER_PHONE_VERIFIED") || false,
        token: localStorage.getItem("AUTH_TOKEN") || null,
        nextLogoutDateTime: localStorage.getItem("AUTH_NEXT_LOGOUT_DATETIME") || null,
        exprireOnBrowserClose: localStorage.getItem("AUTH_EXPIRE_ON_BROWSER_CLOSE") || false,
        loginDateTime: localStorage.getItem("AUTH_LOGIN_DATETIME") || null,
    }),
    actions: {
        async signup(formData) {
            try {
                const response = await useMyFetch(
                    "auth/signup", {
                    method: "POST",
                    body: JSON.stringify(formData),
                });
                if (response.data.status === "success") {
                    navigateTo('/auth?success=true');
                    return true;
                }
            } catch (error) { }
        },
        async resendVerificationEmail(email) {
            try {
                const response = await useMyFetch(
                    "auth/resend-verification-email", {
                    method: "POST",
                    body: JSON.stringify({ email }),
                });
                if (response.data.status === "success") {
                    navigateTo('/auth/verify-email?email=' + btoa(email));
                    $toast.success(response.data.message);
                    return true;
                }
            } catch (error) { }
        },
        async signin(formData) {
            try {
                const response = await useMyFetch(
                    "auth/signin", {
                    method: "POST",
                    body: JSON.stringify(formData),
                });
                if (response.data.status === "success") {
                    this.isAuthenticated = true;
                    this.user = response.data.user;
                    this.token = response.data.token;
                    localStorage.setItem("AUTH_STATUS", this.isAuthenticated);
                    localStorage.setItem("AUTH_TOKEN", response.data.token);
                    localStorage.setItem("AUTH_USER", JSON.stringify(response.data.user));
                    localStorage.setItem("AUTH_USER_PHONE_VERIFIED", response.data.phoneVerified);
                    localStorage.setItem("AUTH_NEXT_LOGOUT_DATETIME", response.data.nextLogoutDateTime);
                    localStorage.setItem("AUTH_EXPIRE_ON_BROWSER_CLOSE", response.data.exprireOnBrowserClose);
                    localStorage.setItem("AUTH_LOGIN_DATETIME", new Date());

                    response.data.phoneVerified ? navigateTo('/') : navigateTo('/auth/verify-otp');
                    return true;
                }
            } catch (error) { }
        },
        async logout() {
            try {
                const response = await useMyFetch(
                    "auth/logout", {
                    method: "POST"
                });
                if (response.data.status === "success") {
                    this.isAuthenticated = false;
                    this.user = null;
                    this.token = null;
                    localStorage.clear();
                    navigateTo('/auth');
                    return true;
                }
            } catch (error) { }
        },
        async forgotPassword(phone) {
            try {
                const response = await useMyFetch(
                    "auth/forgot-password", {
                    method: "POST",
                    body: JSON.stringify({ phone }),
                });
                if (response.data.status === "success") {
                    navigateTo('/auth/verify-otp?phone=' + btoa(phone));
                    return true;
                }
            } catch (error) { }
        },
        async resetPassword(formData) {
            try {
                const response = await useMyFetch(
                    "auth/reset-password-process", {
                    method: "POST",
                    body: JSON.stringify(formData),
                });
                if (response.data.status === "success") {
                    navigateTo('/auth?reset=true');
                    return true;
                }
            } catch (error) { }
        }
    },
})
