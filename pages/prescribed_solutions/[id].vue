<template>
    <main>
        <div class="page">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="left mt-100">
                        <NuxtLink to="/prescribed_solutions" class="link back">
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
definePageMeta({
    middleware: 'auth'
});
const router = useRouter();

const { $toast } = useNuxtApp();
const pageTitle = ref("Crop New Issue Details");
useHead({
    title: pageTitle.value + " | Urbor",
});

const storedData = JSON.parse(localStorage.getItem('prescribed_solutions')) || {};

const title = computed(() => {
    return storedData.crop_issue.title;
});
const crop_type = computed(() => {
    return storedData.crop_issue.crop.crop_type.title;
});
const crop = computed(() => {
    return storedData.crop_issue.crop.title;
});
const image = computed(() => {
    return storedData.crop_issue.image;
});
const description = computed(() => {
    return storedData.crop_issue.description;
});
const currentSolution = computed(() => {
    return storedData.solution;
});

const solution = currentSolution.value ? ref(currentSolution.value) : ref('');

async function handleSolutionSubmit() {
    try {
        if (!solution.value) {
            $toast.error('সমাধান লিখুন');
            return;
        }
        
        if (currentSolution.value === solution.value) {
            $toast.error('আপনি এই সমাধান ইতিমধ্যে জমা দিয়েছেন');
            return;
        }

        const response = await useMyFetch('expert/solution/store-and-update', {
            method: 'POST',
            body: JSON.stringify({
                crop_issue_id: storedData.crop_issue.id,
                solution_id: storedData.id,
                solution: solution.value
            })
        });
        if (response) {
            $toast.success('আপনার সমাধান জমা দেয়া হয়েছে');
            router.push('/prescribed_solutions');
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