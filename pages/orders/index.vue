<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>ক্রয়কৃত পণ্যের লিস্ট</h1>
                <div class="list detailed-list list-dividers full-width">
                    <ul>
                        <template v-if="isDataLoading">
                            <li class="text-center"> {{ loadingText }} </li>
                        </template>
                        <template v-else-if="orderDatas.length !== 0 && !isDataLoading">
                            <template v-for="orderData in orderDatas" :key="orderData.id">
                                <li>
                                    <a href="#" class="item-link item-content">
                                        <div class="item-media"><i class="icon f7-icons">bag</i></div>
                                        <div class="item-inner">
                                            <div class="item-title">
                                                <div class="item-footer">Farmer Phone: {{ orderData.order_user.farmer_id }}</div>
                                                <div class="item-name">{{ orderData.order_id }}</div>
                                                <div class="item-footer">তারিখ: {{ orderData.created_at }}</div>
                                            </div>
                                            <div class="item-after"><span class="badge radius10 color-dark">{{ orderData.amount }} টাকা</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </template>
                        </template>
                        <template v-else>
                            <li class="text-center"> কোন তথ্য পাওয়া যায়নি! </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Order List");
const currentApiUrl = ref("farmer/order/");
useHead({
    title: pageTitle.value + " | Urbor",
});

const orderDatas = ref([]);
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
            "admin/order/fetch-data",
        );
        if (response) {
            isDataLoading.value = false;
            orderDatas.value = response.data.getData;
        }
    } catch (error) { }
}

fetchData();
</script>

<style scoped></style>