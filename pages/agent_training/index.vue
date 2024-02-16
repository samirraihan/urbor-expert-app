<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>এজেন্ট ট্রেনিং</h1>
                <div class="post-list">
                    <template v-if="isDataLoading">
                        <li class="text-center"> {{ loadingText }} </li>
                    </template>
                    <template v-else-if="trainingDatas.length !== 0 && !isDataLoading">
                        <template v-for="training in trainingDatas" :key="training.id">
                            <div class="link post-horizontal" @click="handleTrainingDetails(training.id)">
                                <div class="infos">
                                    <div class="post-category" v-if="training.location"><i class="icon f7-icons small-icon">pin</i> {{ training.location }}</div>
                                    <div class="post-title text-success">{{ training.title }}</div>
                                    <div class="post-date">Date: {{ training.start_date }}</div>
                                    <div class="mt-10" :class="training.agent_training_enrollments ? 'text-success' : 'text-info'">
                                        {{ training.agent_training_enrollments ? 'এনরোল হয়েছেন' : 'এনরোল করুন' }}
                                    </div>
                                </div>
                                <div class="post-image"><img :src="training.image" :alt="training.title"></div>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <li class="text-center"> কোন তথ্য পাওয়া যায়নি! </li>
                    </template>
                </div>
            </div>
        </div>
        <LazyCommonPreloader :preloader="preloader" />
    </main>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Agent Training");
const currentApiUrl = ref("admin/agent-training/");
const router = useRouter();
useHead({
    title: pageTitle.value + " | Urbor",
});

const preloader = ref(false);
const trainingDatas = ref([]);
const isDataLoading = ref(true);
const loadingText = ref("লোড হচ্ছে...");

watch(isDataLoading, (newValue) => {
    if (newValue) {
        loadingText.value;
    }
});

async function fetchData() {
    try {
        const response = await useMyFetch(currentApiUrl.value + 'fetch-data');
        trainingDatas.value = response.data.getData;
        isDataLoading.value = false;
    } catch (error) {
        console.log(error);
    }
}

fetchData();

function handleTrainingDetails(id) {
    const findAgentTrainingById = trainingDatas.value.find((training) => training.id === id);
    localStorage.setItem('agentTraining', JSON.stringify(findAgentTrainingById));
    router.push(`/agent_training/${id}`);
}
</script>

<style scoped></style>