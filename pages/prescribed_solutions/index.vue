<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h2>পূর্বের দেয়া সমাধান সমূহ</h2>
                <div class="post-list">
                    <template v-if="isDataLoading">
                        <li> {{ loadingText }} </li>
                    </template>
                    <template v-else-if="solutionDatas.length !== 0 && !isDataLoading">
                        <template v-for="solution in solutionDatas" :key="solution.id">
                            <div class="link post-horizontal" @click="handleRemedyDetails(solution.id)">
                                <div class="infos">
                                    <div class="mt-10 post-category text-success"><b>{{ solution.crop_issue.title }}</b></div>
                                    <div class="post-title">{{ formatedDate(solution.updated_at) }}</div>
                                </div>
                                <div class="post-image"><img :src="solution.crop_issue.image" :alt="solution.crop_issue.title"></div>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <li> কোন তথ্য পাওয়া যায়নি! </li>
                    </template>
                </div>
            </div>
        </div>
        <LazyCommonPreloader :preloader="preloader" />
    </main>
</template>

<script setup>
import moment from 'moment';
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Crops Remedy");
const router = useRouter();
useHead({
    title: pageTitle.value + " | Urbor",
});

const preloader = ref(false);
const solutionDatas = ref([]);
const isDataLoading = ref(true);
const loadingText = ref("তথ্য অনুসন্ধান চলমান...");

watch(isDataLoading, (newValue) => {
    if (newValue) {
        loadingText.value;
    }
});

async function fetchSolutions() {
    try {
        const response = await useMyFetch('expert/solution/fetch-data');
        solutionDatas.value = response.data.getData;
        isDataLoading.value = false;
    } catch (error) {
        console.log(error);
    }
}

fetchSolutions();

function handleRemedyDetails(id) {
    const findsolutionById = solutionDatas.value.find((item) => item.id === id);
    localStorage.setItem('prescribed_solutions', JSON.stringify(findsolutionById));
    router.push(`/prescribed_solutions/${id}`);
}

const formatedDate = (date) => {
    return moment(date).format('DD/MM/YYYY, hh:mm A');
};
</script>

<style scoped></style>