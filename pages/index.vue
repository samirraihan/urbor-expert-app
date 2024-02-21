<template>
    <main>
        <div class="page">
            <div class="page-content">
                <div class="profile-header">
                    <div class="container">
                        <div class="profile-details side-by-side">
                            <div class="profile-name">{{ userName }}</div>
                            <div class="profile-subtitle">{{ userID }}</div>
                            <div class="profile-subtitle">{{ userPhone }}</div>
                        </div>
                        <div class="profile-image small-profile-image side-by-side">
                            <img src="/img/avatars/agent.jpg" alt="">
                        </div>
                    </div>
                </div>
                <div class="album-grid">
                    <NuxtLink to="/farmers" class="link">
                        <img src="/img/images/suggestion-list.png" alt="">
                        <div class="album-details">
                            <div class="album-title">Total Solution Given</div>
                            <div class="album-author">{{ totalSolutionGiven }}</div>
                        </div>
                    </NuxtLink>
                </div>
                <br>
                <hr>
                <br>
                <div class="grid grid-cols-1 grid-gap">
                    <NuxtLink to="/crop_issues" class="category-item link">
                        <img src="/img/categories/iot.jpg" alt="">
                        <div class="category-name">নতুন সমস্যা সমূহ</div>
                    </NuxtLink>
                    <NuxtLink to="/prescribed_solutions" class="category-item link">
                        <img src="/img/categories/protection.jpg" alt="">
                        <div class="category-name">পূর্বের দেয়া পরামর্শ সমূহ</div>
                    </NuxtLink>
                    <NuxtLink to="/contact" class="category-item link">
                        <img src="/img/categories/contact-us.png" alt="">
                        <div class="category-name">যোগাযোগ</div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
definePageMeta({
    middleware: 'auth'
});

const totalSolutionGiven = ref('');

async function totalSolutionCount() {
    try {
        const response = await useMyFetch('expert/total-expert-solutions');
        totalSolutionGiven.value = response.data.getData;
    } catch (error) {
        console.log(error);
    }
}

totalSolutionCount();

const userName = computed(() => authStore.isAuthenticated ? authStore.user.name : 'নাম');
const userID = computed(() => authStore.isAuthenticated ? authStore.user.uuid : 'EID-000000');
const userPhone = computed(() => authStore.isAuthenticated ? authStore.user.phone : '--');
</script>

<style scoped></style>