<template>
    <main>
        <LazyCommonPreloader :preloader="preloader" />
        <div v-if="!preloader" class="page">
            <LazyNuxtPage />
        </div>
    </main>
</template>

<script setup>
useHead(() => ({
    title: "Verify OTP | Urbor",
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

const authUserPhoneVerified = ref(localStorage.getItem('AUTH_USER_PHONE_VERIFIED'));

watch(authUserPhoneVerified, (newValue) => {
    if (newValue === 'true') {
        $nuxt.$router.push('/');
    }
});

</script>

<style scoped></style>