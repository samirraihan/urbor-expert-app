<template>
    <main>
        <div class="page">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="left mt-100">
                        <NuxtLink to="/agent_training" class="link back">
                            <i class="icon f7-icons arrow-back">arrow_left</i>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="page-content">
                <div class="album-header">
                    <img :src="image" :alt="title" class="album-cover">
                    <div class="album-title text-center">{{ title }}</div>
                    <div class="album-artist" v-if="location">
                        <i class="icon f7-icons small-icon">pin</i> {{ location }}
                    </div>
                </div>
                <div class="grid grid-cols-2 grid-gap album-stats">
                    <div class="album-stat">
                        <div class="album-stat-title">প্রশিক্ষণ শুরু</div>
                        <span class="album-stat-title">{{ start_date }}, {{ start_time }}</span>
                    </div>
                    <div class="album-stat">
                        <div class="album-stat-title">প্রশিক্ষণ শেষ</div>
                        <span class="album-stat-title">{{ end_date }}, {{ end_time }}</span>
                    </div>
                </div>
                <button class="button button-fill color-light-gray primary-bg-color" @click="handleEnrollment"
                    :disabled="enrolledStatus">
                    <i class="icon f7-icons arrow-back text-color-red">square_arrow_up</i> {{ enrolledStatus ? 'আপনি এনরোল হয়েছেন' : 'এনরোল করুন' }}
                </button>
                <div class="list links-list list-outline list-dividers full-width">
                    <ul>
                        <li><span>প্রশিক্ষকের নাম: {{ trainer_name }}</span></li>
                        <li><span>প্রশিক্ষকের দক্ষতা: {{ trainer_expertise }}</span></li>
                        <li v-if="trainer_company"><span>প্রশিক্ষক সংস্থা: {{ trainer_company }}</span></li>
                    </ul>
                </div>
                <h3>প্রশিক্ষণ বিবরণ</h3>
                <div v-html="description"></div>
            </div>
        </div>
        <LazyCommonPreloader :preloader="preloader" />
    </main>
</template>

<script setup>
import moment from 'moment';
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const { $toast } = useNuxtApp();

definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Agent Training Details");
const currentApiUrl = ref("admin/agent-training/");
useHead({
    title: pageTitle.value + " | Urbor",
});

const preloader = ref(false);
const storedData = JSON.parse(localStorage.getItem('agentTraining')) || {};
const title = computed(() => {
    return storedData.title;
});
const image = computed(() => {
    return storedData.image;
});
const description = computed(() => {
    return storedData.description;
});
const location = computed(() => {
    return storedData.location;
});
const start_date = computed(() => {
    return moment(storedData.start_date).format('DD-MM-YYYY');
});
const start_time = computed(() => {
    return moment(storedData.start_time, 'HH:mm:ss').format('hh:mm A');
});
const end_date = computed(() => {
    return moment(storedData.end_date).format('DD-MM-YYYY');
});
const end_time = computed(() => {
    return moment(storedData.end_time, 'HH:mm:ss').format('hh:mm A');
});
const trainer_name = computed(() => {
    return storedData.trainer_name;
});
const trainer_expertise = computed(() => {
    return storedData.trainer_expertise;
});
const trainer_company = computed(() => {
    return storedData.trainer_company;
});
const enrolledAgentID = computed(() => {
    if (!storedData.agent_training_enrollments) return;
    return storedData.agent_training_enrollments.agent_id;
});

const enrolledStatusRef = ref(false);
const enrolledStatus = computed(() => {
    if (!storedData.agent_training_enrollments) return enrolledStatusRef.value;
    return enrolledAgentID.value === authStore.user.id;
});

const agentID = computed(() => authStore.isAuthenticated ? authStore.user.id : '');

async function handleEnrollment() {
    try {
        preloader.value = true;

        const endpoint = "enroll";

        const response = await useMyFetch(currentApiUrl.value + endpoint, {
            method: "POST",
            body: JSON.stringify({
                training_id: storedData.id,
                agent_id: agentID.value,
            }),
        });

        if (response.status === "success") {
            preloader.value = false;
            $toast.success("আপনি এনরোল হয়েছেন");
            enrolledStatusRef.value = true;
        } else {
            preloader.value = false;
        }
    } catch (error) {
        preloader.value = false;
        console.log(error);
    }
}
</script>

<style scoped>
.simple-list ul li,
.links-list ul li span {
    min-height: 50px;
}

.links-list span {
    padding-left: 16px;
    padding-right: 16px;
    border-bottom: 1px solid #efeff1;
}

.links-list span,
.simple-list ul li {
    font-size: 14px;
    font-weight: 400;
    color: #000;
}

.links-list span {
    transition-duration: 300ms;
    transition-property: background-color;
    display: block;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    box-sizing: border-box;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    height: var(--f7-list-item-min-height);
    color: inherit;
}</style>