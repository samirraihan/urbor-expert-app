<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>উৎপাদিত ফসল</h1>
                <form @submit.prevent="handleSubmit">
                    <label for="season_id">চারা রোপনের মৌসম</label>
                    <select v-model="form.season_id" class="mb-0">
                            <option value="">মৌসম *</option>
                            <option v-for="option in seasonDatas" :key="option.id" :value="option.id">
                                {{ option.title }}
                            </option>
                        </select>
                    <div class="grid grid-cols-2 grid-gap ">
                        <div>
                            <label for="crop_type_id">ফসলের ধরণ</label>
                            <select v-model="form.crop_type_id" @change="handleSelectChange" class="mb-0">
                                <option value="">ফসলের ধরণ *</option>
                                <option v-for="option in formattedCropTypeOptions" :key="option.id" :value="option.id">
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label for="crop_id">ফসলের নাম</label>
                            <select v-model="form.crop_id" @change="handleSelectChange" class="mb-0">
                                <option value="">ফসলের নাম *</option>
                                <option v-for="option in formattedCropOptions" :key="option.id" :value="option.id">
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <label for="area_size">চাষকৃত জমির পরিমাণ</label>
                    <input type="text" v-model="form.area_size" placeholder="চাষকৃত জমির পরিমাণ">
                    <label for="transplant_date">চারা লাগানোর তারিখ</label>
                    <input type="date" v-model="form.transplant_date" placeholder="চারা লাগানোর তারিখ">
                    <button type="submit" class="button button-fill color-dark primary-bg-color">জমা দিন</button>
                </form>
                <hr>
                <div class="light-gray-title">ফসলের লিস্ট</div>
                <div class="list links-list list-outline list-dividers full-width">
                    <ul>
                        <template v-if="isDataLoading">
                            <li class="text-center"> {{ loadingText }} </li>
                        </template>
                        <template v-else-if="cropDatas.length !== 0 && !isDataLoading">
                            <template v-for="cropData in cropDatas" :key="cropData.id">
                                <li><a @click="handleCropDetails(cropData.id)">{{ cropData.crop.title }}</a></li>
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

const pageTitle = ref("Crops");
const currentApiUrl = ref("farmer/season-track/");
const router = useRouter();

useHead({
    title: pageTitle.value + " | Urbor",
});

const { $toast } = useNuxtApp();
const preloader = ref(false);
const noError = ref(false);
const cropDatas = ref([]);
const seasonDatas = ref([]);
const cropTypeDatas = ref([]);
const crops = ref([]);
const isDataLoading = ref(true);
const loadingText = ref("লোড হচ্ছে...");
const form = ref({
    farmer_phone: authStore.user.phone,
    season_id: "",
    crop_type_id: "",
    crop_id: "",
    area_size: "",
    transplant_date: "",
});

watch(isDataLoading, (newValue) => {
    if (newValue) {
        loadingText.value;
    }
});

function resetFormData() {
    form.value.season_id = "";
    form.value.crop_type_id = "";
    form.value.crop_id = "";
    form.value.area_size = "";
    form.value.transplant_date = "";
}

async function fetchData() {
    try {
        isDataLoading.value = true;
        const response = await useMyFetch(
            currentApiUrl.value + "fetch-data",
        );
        if (response) {
            isDataLoading.value = false;
            cropDatas.value = response.data.getData;
        }
    } catch (error) { }
}

fetchData();

async function fetchSeasonDropDownData() {
    try {
        const response = await useMyFetch('admin/season/fetch-data');
        seasonDatas.value = response.data.getData;
    } catch (error) {
        console.log(error);
    }
}

fetchSeasonDropDownData();

function handleErrors() {
    const requiredFields = [
        { field: form.value.season_id, message: "চারা রোপনের মৌসম দিন" },
        { field: form.value.crop_type_id, message: "ফসলের ধরণ দিন" },
        { field: form.value.crop_id, message: "ফসলের নাম দিন" },
        { field: form.value.area_size, message: "চাষকৃত জমির পরিমাণ দিন" },
        { field: form.value.transplant_date, message: "চারা লাগানোর তারিখ দিন" },
    ];

    const errorMessages = requiredFields.filter(field => !field.field).map(field => field.message);

    if (errorMessages.length > 0) {
        errorMessages.forEach(message => $toast.error(message));
    } else {
        noError.value = true;
    }
}

async function handleSubmit() {
    console.log('form', form.value);
    try {
        handleErrors();

        if (noError.value === false) {
            return;
        }

        preloader.value = true;
        const endpoint = currentApiUrl.value + "store";

        const response = await useMyFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(form.value)
        });

        if (response.status === "success") {
            preloader.value = false;
            noError.value = false;
            $toast.success(response.message);
            resetFormData();
            fetchData();
        } else {
            preloader.value = false;
            $toast.error("কিছু ভুল হয়েছে");
        }
    } catch (error) {
        preloader.value = false;
        console.log(error);
    }
}

function handleCropDetails(id) {
    const findCropById = cropDatas.value.find(crop => crop.id === id);
    localStorage.setItem('seasonTrack', JSON.stringify(findCropById));
    router.push(`/season_track/${id}`);
}

async function fetchCrops() {
    try {
        const response = await useMyFetch('admin/crop-type/fetch-data');
        cropTypeDatas.value = response.data.getData;
    } catch (error) {
        console.log(error);
    }
}

fetchCrops();

const handleSelectChange = () => {
    const findCropById = cropTypeDatas.value.find((item) => item.id === form.value.crop_type_id);
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
    return createFormattedOptions(crops.value, form.value.crop_type_id);
});
</script>

<style scoped></style>