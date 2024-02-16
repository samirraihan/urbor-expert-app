<template>
    <main>
        <div class="page">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="left mt-100">
                        <NuxtLink to="/crop_remedy" class="link back">
                            <i class="icon f7-icons arrow-back">arrow_left</i>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="page-content">
                <div class="album-header">
                    <img :src="image" :alt="title" class="album-cover">
                    <div class="album-title text-center">{{ title }}</div>
                    <div class="album-artist custom-badge text-light" :class="verification_status === 'verified' ? 'custom-badge-success' : 'custom-badge-warning'">
                        {{ verification_status === 'verified' ? 'যাচাইকৃত তথ্য' : 'যাচাইকৃত তথ্য নয়' }}
                    </div>
                </div>

                <div class="grid grid-cols-2 grid-gap album-stats">
                    <div class="album-stat">
                        <div class="album-stat-title">তথ্য প্রকাশের তারিখ</div>
                        <p class="album-stat-title">{{ published_at }}</p>
                    </div>
                    <div class="album-stat">
                        <div class="album-stat-title">তথ্য যাচাইয়ের তারিখ</div>
                        <p class="album-stat-title">{{ verified_at }}</p>
                    </div>
                </div>
                <span v-html="description"></span>
                <hr>
                <div class="text-info">তথ্য উল্লেখ: <a :href="source_link" target="_blank">{{ source_link }}</a></div>
            </div>
        </div>
    </main>
</template>

<script setup>
import moment from 'moment';

definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Crops Remedy Details");
const currentApiUrl = ref("farmer/crops_remedy_details/");
useHead({
    title: pageTitle.value + " | Urbor",
});

const storedData = JSON.parse(localStorage.getItem('cropRemedy')) || {};
const title = computed(() => {
    return storedData.title;
});
const verification_status = computed(() => {
    return storedData.verification_status;
});
const published_at = computed(() => {
    return moment(storedData.published_at).format('DD MMMM YYYY');
});
const verified_at = computed(() => {
    return moment(storedData.verified_at).format('DD MMMM YYYY');
});
const image = computed(() => {
    return storedData.image;
});
const description = computed(() => {
    return storedData.description;
});
const source_link = computed(() => {
    return storedData.source_link;
});
</script>

<style scoped></style>