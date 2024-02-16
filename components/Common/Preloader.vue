<template>
    <div v-if="preloader" class="page no-toolbar">
        <div class="page-content page-onboarding">
            <LazyCommonLogo v-if="showLogo" />
            <br>
            <h3 v-if="showLogo" class="onboarding-title">উর্বর এ আপনাকে স্বাগতম</h3>
        </div>
    </div>
</template>

<script setup>
    const { preloader } = defineProps({
        preloader: Boolean
    })
    
    const showLogo = ref(false);
    setTimeout(() => {
        showLogo.value = true;
    }, 200);
</script>