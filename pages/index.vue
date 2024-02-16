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
                            <div class="album-author">{{ totalFarmers }}</div>
                        </div>
                    </NuxtLink>
                </div>
                <br>
                <hr>
                <br>
                <div class="grid grid-cols-1 grid-gap">
                    <NuxtLink to="/" class="category-item link">
                        <img src="/img/categories/iot.jpg" alt="">
                        <div class="category-name">নতুন সমস্যা সমূহ</div>
                    </NuxtLink>
                    <NuxtLink to="/" class="category-item link">
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

const currentMonthFarmersCount = ref('');
const currentMonthOrdersAmountCount = ref('');

async function monthlyFarmerEnollment() {
    try {
        const response = await useMyFetch(
            "agent/monthly-farmer-enrollment",
        );
        if (response) {
            currentMonthFarmersCount.value = response.data.getData;
        }
    } catch (error) { }
}

monthlyFarmerEnollment();

async function monthlyOrder() {
    try {
        const response = await useMyFetch(
            "admin/order/monthly-order-data",
        );
        if (response) {
            currentMonthOrdersAmountCount.value = response.data.getData;
        }
    } catch (error) { }
}

monthlyOrder();

const userName = computed(() => authStore.isAuthenticated ? authStore.user.name : 'কৃষকের নাম');
const userID = computed(() => authStore.isAuthenticated ? authStore.user.uuid : 'FID-000000');
const userPhone = computed(() => authStore.isAuthenticated ? authStore.user.phone : '000000000000000');

const totalFarmers = computed(() => authStore.isAuthenticated ? authStore.user.agent_details.farmer_enrollment : '0');
const totalOrders = computed(() => authStore.isAuthenticated ? authStore.user.agent_details.total_order : '0');

const totalOrderAmount = computed(() => authStore.isAuthenticated ? authStore.user.agent_details.total_order_amount : '0');

const targetFarmerEnrollment = computed(() => authStore.isAuthenticated ? authStore.user.agent_details.target_farmer_enrollment : '0');
const targetOrderAmount = computed(() => authStore.isAuthenticated ? authStore.user.agent_details.target_order_amount : '0');

const farmerProgressPercentage = computed(() => (currentMonthFarmersCount.value / targetFarmerEnrollment.value) * 100);
const orderAmountProgressPercentage = computed(() => (currentMonthOrdersAmountCount.value / targetOrderAmount.value) * 100);
</script>

<style scoped></style>