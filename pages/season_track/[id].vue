<template>
    <main>
        <div class="page">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="left mt-100">
                        <NuxtLink to="/season_track" class="link back">
                            <i class="icon f7-icons arrow-back">arrow_left</i>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="page-content">
                <div class="album-header">
                    <div class="album-title text-center">{{ crop_name }}</div>
                    <br>
                    <div class="album-artist custom-badge custom-badge-success text-light">
                        {{ transplant_date }}
                    </div>
                </div>
                <div></div>
                <hr>
                <h3 class="text-info"><u>তথ্য:</u></h3>
                <p>ফসলের নাম: {{ crop_name }}</p>
                <p>চারা রোপনের মৌসম: {{ season_name }}</p>
                <p>ফসলের ধরণ: {{ crop_type }}</p>
                <p>চাষকৃত জমির পরিমাণ: {{ area_size }}</p>
                <p>চারা লাগানোর তারিখ: {{ transplant_date }}</p>
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

const storedData = JSON.parse(localStorage.getItem('seasonTrack')) || {};
const crop_name = computed(() => {
    return storedData.crop.title;
});
const area_size = computed(() => {
    return storedData.area_size;
});
const crop_type = computed(() => {
    return storedData.crop_type.title;
});
const season_name = computed(() => {
    return storedData.season.title;
});
const transplant_date = computed(() => {
    return moment(storedData.transplant_date).format('DD MMMM YYYY');
});
</script>

<style scoped></style>