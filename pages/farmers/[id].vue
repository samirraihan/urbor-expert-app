<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>কৃষকের বিস্তারিত</h1>
                <p>
                    কৃষকের নাম: {{ farmer_name }} <br>
                    কৃষকের আইডি: {{ farmer_uuid }} <br>
                    কৃষকের ফোন নম্বর: {{ farmer_phone }}
                </p>
                <hr>
                <br>
                <div class="grid grid-cols-2 grid-gap">
                    <a @click="handleDetails(farmer_id)" class="category-item link">
                        <img src="/img/categories/crop.jpg" alt="">
                        <div class="category-name">ফসল</div>
                    </a>
                    <NuxtLink to="/farmers" class="category-item link">
                        <img src="/img/categories/medicine.jpg" alt="">
                        <div class="category-name">অর্ডার</div>
                    </NuxtLink>
                    <NuxtLink to="/farmers" class="category-item link">
                        <img src="/img/categories/supportchat.png" alt="">
                        <div class="category-name">পরামর্শ ইতিহাস</div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Farmers Details");
const currentApiUrl = ref("farmer/agent/");
const router = useRouter();
useHead({
    title: pageTitle.value + " | Urbor",
});

const storedData = JSON.parse(localStorage.getItem('farmerDetails')) || {};
const farmer_name = computed(() => {
    return storedData.name;
});
const farmer_id = computed(() => {
    return storedData.id;
});
const farmer_uuid = computed(() => {
    return storedData.farmer_details.uuid;
});
const farmer_phone = computed(() => {
    return storedData.phone;
});

function handleDetails(id) {
    // const findFarmerById = farmerDatas.value.find((farmer) => farmer.id === id);
    // localStorage.setItem('farmerDetails', JSON.stringify(findFarmerById));
    router.push(`/farmers/${id}/details`);
}
</script>

<style scoped></style>