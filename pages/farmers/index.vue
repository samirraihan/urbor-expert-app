<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>কৃষক তালিকা</h1>
                <div class="list links-list list-outline list-dividers full-width">
                    <ul>
                        <template v-if="isDataLoading">
                            <li class="text-center"> {{ loadingText }} </li>
                        </template>
                        <template v-else-if="farmerDatas.length !== 0 && !isDataLoading">
                            <template v-for="farmerData in farmerDatas" :key="farmerData.id">
                                <li><a @click="handleFarmerDetails(farmerData.id)">{{ farmerData.name }} ({{ farmerData.phone }})</a></li>
                            </template>
                        </template>
                        <template  v-else>
                            <li class="text-center"> কোন তথ্য পাওয়া যায়নি! </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
        <LazyCommonPreloader :preloader="preloader" />
    </main>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Farmers List");
const currentApiUrl = ref("agent/");
const router = useRouter();

useHead({
    title: pageTitle.value + " | Urbor",
});

const preloader = ref(false);
const farmerDatas = ref([]);
const isDataLoading = ref(true);
const loadingText = ref("লোড হচ্ছে...");

watch(isDataLoading, (newValue) => {
    if (newValue) {
        loadingText.value;
    }
});

async function fetchData() {
    try {
        isDataLoading.value = true;
        const response = await useMyFetch(
            currentApiUrl.value + "fetch-farmer-data",
        );
        if (response) {
            isDataLoading.value = false;
            farmerDatas.value = response.data.getData;
        }
    } catch (error) { }
}

fetchData();

function handleFarmerDetails(id) {
    const findFarmerById = farmerDatas.value.find((farmer) => farmer.id === id);
    localStorage.setItem('farmerDetails', JSON.stringify(findFarmerById));
    router.push(`/farmers/${id}`);
}
</script>

<style scoped></style>