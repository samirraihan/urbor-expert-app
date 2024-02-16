<template>
    <main>
        <LazyCommonPreloader :preloader="preloader" />
        <div v-if="!preloader" class="page">
            <LazyCommonNav />
            <LazyNuxtPage />
        </div>
        <LazyCommonFooter v-if="!preloader" />
    </main>
</template>

<script setup>
import moment from 'moment';
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const { error, checkApiStatus } = useApiStatusCheck();
const { nextLogoutDatetime, logoutIfExpired } = useAutoLogout();

useHead(() => ({
    title: "Urbor | Farmer's App",
    link: [
        { rel: 'stylesheet', href: '/css/framework7-bundle.css' },
        { rel: 'stylesheet', href: '/css/framework7-icons.css' },
        { rel: 'stylesheet', href: '/css/style.css' },
        { rel: 'stylesheet', href: '/css/custom.css' },
    ],
    script: [
    ],
}))

if (localStorage.getItem('AUTH_USER_PHONE_VERIFIED') === 'false') {
    navigateTo('/auth/verify-otp');
}

const preloader = ref(true);
onMounted(() => {
    setTimeout(() => {
        preloader.value = false;
    }, 1000);
});

const currentDateTime = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
const availableNextLogoutDateTime = ref(localStorage.getItem('AUTH_NEXT_LOGOUT_DATETIME'));
if (currentDateTime.value > availableNextLogoutDateTime.value) {
    await authStore.logout();
}
</script>

<style scoped></style>