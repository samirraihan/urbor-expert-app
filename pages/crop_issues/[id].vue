<template>
    <main>
        <div class="page">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="left mt-100">
                        <NuxtLink to="/crop_issues" class="link back">
                            <i class="icon f7-icons arrow-back">arrow_left</i>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="page-content mt-50">
                <div class="album-header">
                    <img :src="image" :alt="title" class="album-cover">
                    <br>
                    <div class="album-stat-title text-info">{{ crop_type }} : {{ crop }}</div>
                    <div class="album-title text-center">{{ title }}</div>
                </div>
                <br>
                <span v-html="description"></span>
                <hr>
                <h2 class="title-bottom-line">সমাধান দিন</h2>
                <form @submit.prevent="handleSolutionSubmit">
                    <textarea v-model="solution" placeholder="এখানে আপনার সমাধান লিখুন"></textarea>
                    <button type="submit" class="button button-fill button-round color-dark primary-bg-color">জমা দিন</button>
                </form>
                <!-- <div class="text-info">তথ্য উল্লেখ: <a :href="source_link" target="_blank">{{ source_link }}</a></div> -->
            </div>
        </div>
    </main>
</template>

<script setup>
import moment from 'moment';

definePageMeta({
    middleware: 'auth'
});

const { $toast } = useNuxtApp();
const pageTitle = ref("Crop New Issue Details");
useHead({
    title: pageTitle.value + " | Urbor",
});

const storedData = JSON.parse(localStorage.getItem('cropNewIssue')) || {};
const title = computed(() => {
    return storedData.title;
});
const crop_type = computed(() => {
    return storedData.crop.crop_type.title;
});
const crop = computed(() => {
    return storedData.crop.title;
});
const image = computed(() => {
    return storedData.image;
});
const description = computed(() => {
    return storedData.description;
});

const solution = ref('');

async function handleSolutionSubmit() {
    try {
        if (!solution.value) {
            $toast.error('সমাধান লিখুন');
            return;
        }

        const response = await useMyFetch('expert/solution/store-and-update', {
            method: 'POST',
            body: JSON.stringify({
                crop_issue_id: storedData.id,
                solution: solution.value
            })
        });
        if (response) {
            solution.value = '';
            $toast.success('আপনার সমাধান জমা দেয়া হয়েছে');
        }
    } catch (error) {
        $toast.error('সমাধান জমা দেয়া ব্যর্থ হয়েছে');
        console.log(error);
    }
}
</script>

<style scoped>
.mt-50 {
    margin-top: 50px;
}
</style>