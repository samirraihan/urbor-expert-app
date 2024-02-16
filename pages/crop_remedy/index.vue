<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>রোগের সমাধান</h1>
                <h3>ফসলের রোগ খুজুন</h3>
                <form @submit.prevent="handleSearchSubmit">
                    <div class="grid grid-cols-2 grid-gap">
                        <select v-model="form.crop_type" @change="handleSelectChange" class="mb-0">
                            <option value="">ফসলের ধরণ *</option>
                            <option v-for="option in formattedCropTypeOptions" :key="option.id" :value="option.id">
                                {{ option.text }}
                            </option>
                        </select>
                        <select v-model="form.crop" @change="handleSelectChange" class="mb-0">
                            <option value="">ফসলের নাম *</option>
                            <option v-for="option in formattedCropOptions" :key="option.id" :value="option.id">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <button type="submit" class="button button-fill color-dark primary-bg-color">সমাধান খুজুন</button>
                </form>
                <hr>
                <h3>ফসলের রোগ ও পোকামাকড়ের তালিকা</h3>
                <div class="post-list">
                    <template v-if="isDataLoading">
                        <li class="text-center"> {{ loadingText }} </li>
                    </template>
                    <template v-else-if="cropRemedyDatas.length !== 0 && !isDataLoading">
                        <template v-for="cropRemedy in cropRemedyDatas" :key="cropRemedy.id">
                            <div class="link post-horizontal" @click="handleRemedyDetails(cropRemedy.id)">
                                <div class="infos">
                                    <div class="post-category text-success"><b>{{ cropRemedy.crop.title }}</b></div>
                                    <div class="post-title">{{ cropRemedy.title }}</div>
                                    <div :class="cropRemedy.verification_status === 'verified' ? 'text-success' : 'text-warning'" class="post-date">
                                        {{ cropRemedy.verification_status === 'verified' ? 'যাচাইকৃত তথ্য' : 'যাচাইকৃত তথ্য নয়' }}
                                    </div>
                                </div>
                                <div class="post-image"><img :src="cropRemedy.image" :alt="cropRemedy.crop.title"></div>
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

const pageTitle = ref("Crops Remedy");
const currentApiUrl = ref("admin/");
const router = useRouter();
useHead({
    title: pageTitle.value + " | Urbor",
});

const { $toast } = useNuxtApp();
const preloader = ref(false);
const cropRemedyDatas = ref([]);
const cropTypeDatas = ref([]);
const crops = ref([]);
const isDataLoading = ref(true);
const loadingText = ref("লোড হচ্ছে...");
const noError = ref(false);

const form = ref({
    crop_type: "",
    crop: "",
});

watch(isDataLoading, (newValue) => {
    if (newValue) {
        loadingText.value;
    }
});

function resetFormData() {
    form.value.crop_type = "";
    form.value.crop = "";
}

async function fetchData() {
    try {
        const response = await useMyFetch(currentApiUrl.value + 'crop-remedy/fetch-data');
        cropRemedyDatas.value = response.data.getData;
        isDataLoading.value = false;
    } catch (error) {
        console.log(error);
    }
}

fetchData();

async function fetchCrops() {
    try {
        const response = await useMyFetch(currentApiUrl.value + 'crop-type/fetch-data');
        cropTypeDatas.value = response.data.getData;
    } catch (error) {
        console.log(error);
    }
}

fetchCrops();

const handleSelectChange = () => {
    const findCropById = cropTypeDatas.value.find((item) => item.id === form.value.crop_type);
    crops.value = findCropById.crops;
};

const createFormattedOptions = (crop, condition) => {
    if (condition) {
        return crop.map((item) => {
            return {
                id: item.id,
                text: item.title,
            };
        });
    }
    return [];
};

const formattedCropTypeOptions = computed(() => {
    return createFormattedOptions(cropTypeDatas.value, true);
});

const formattedCropOptions = computed(() => {
    return createFormattedOptions(crops.value, form.value.crop_type);
});

function handleErrors() {
    const requiredFields = [
        { field: form.value.crop_type, message: "ফসলের ধরণ  দিন" },
        { field: form.value.crop, message: "ফসলের নাম দিন" },
    ];

    const errorMessages = requiredFields.filter(field => !field.field).map(field => field.message);

    if (errorMessages.length > 0) {
        errorMessages.forEach(message => $toast.error(message));
    } else {
        noError.value = true;
    }
}

async function handleSearchSubmit() {
    try {
        handleErrors();

        if (noError.value === false) {
            return;
        }

        preloader.value = true;
        isDataLoading.value = true;
        const endpoint = currentApiUrl.value + "crop-remedy/search";

        const response = await useMyFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(form.value)
        });

        if (response.status === "success") {
            preloader.value = false;
            isDataLoading.value = false;
            noError.value = false;
            resetFormData();
            cropRemedyDatas.value = response.data.getData;
        } else {
            preloader.value = false;
            isDataLoading.value = false;
            $toast.error("কিছু ভুল হয়েছে");
        }
    } catch (error) {
        preloader.value = false;
        isDataLoading.value = false;
        console.log(error);
    }
}

function handleRemedyDetails(id) {
    const findCropRemedyById = cropRemedyDatas.value.find((item) => item.id === id);
    localStorage.setItem('cropRemedy', JSON.stringify(findCropRemedyById));
    router.push(`/crop_remedy/${id}`);
}
</script>

<style scoped></style>