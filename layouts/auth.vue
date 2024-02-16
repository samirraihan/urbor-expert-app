<template>
    <main v-if="showLogin">
        <LazyCommonPreloader :preloader="preloader" />
        <div v-if="!preloader" class="page">
            <LazyNuxtPage />
        </div>
    </main>
</template>

<script setup>
const { error, checkApiStatus } = useApiStatusCheck();
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

const preloader = ref(true);
onMounted(() => {
    setTimeout(() => {
        preloader.value = false;
    }, 1000);
});

import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

const showLogin = ref(true);
if (authStore.isAuthenticated) {
    showLogin.value = false;
    navigateTo('/');
}
</script>

<style scoped></style>