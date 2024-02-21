<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>নতুন সমস্যা সমূহ</h1>
                <h3>ফসলের নতুন সমস্যা খুজুন</h3>
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
                    <button type="submit" class="button button-fill color-dark primary-bg-color">নতুন সমস্যা খুজুন</button>
                </form>
                <hr>
                <h3>ফসলের নতুন সমস্যা তালিকা</h3>
                <div class="post-list">
                    <template v-if="isDataLoading">
                        <li> {{ loadingText }} </li>
                    </template>
                    <template v-else-if="cropNewIssuesDatas.length !== 0 && !isDataLoading">
                        <template v-for="cropNewIssue in cropNewIssuesDatas" :key="cropNewIssue.id">
                            <div class="link post-horizontal" @click="handleRemedyDetails(cropNewIssue.id)">
                                <div class="infos">
                                    <div class="post-category text-success"><b>{{ cropNewIssue.title }}</b></div>
                                    <div class="post-title">{{ cropNewIssue.title }}</div>
                                    <div class="text-info post-date">সমাধানের অপেক্ষায়</div>
                                </div>
                                <div class="post-image"><img :src="cropNewIssue.image" :alt="cropNewIssue.title"></div>
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
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Crops New Issues");
const currentApiUrl = ref("expert/");
const router = useRouter();
useHead({
    title: pageTitle.value + " | Urbor",
});

const { $toast } = useNuxtApp();
const preloader = ref(false);
const cropNewIssuesDatas = ref([]);
const cropTypeDatas = ref([]);
const crops = ref([]);
const isDataLoading = ref(true);
const loadingText = ref("তথ্য অনুসন্ধান চলমান...");
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

async function fetchNewIssues() {
    try {
        const response = await useMyFetch('crop-issue/new-crop-issues');
        cropNewIssuesDatas.value = response.data.getData;
        console.log(cropNewIssuesDatas.value);
        isDataLoading.value = false;
    } catch (error) {
        console.log(error);
    }
}

fetchNewIssues();

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
        const endpoint = "crop-issue/search";

        const response = await useMyFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(form.value)
        });

        if (response.status === "success") {
            preloader.value = false;
            isDataLoading.value = false;
            noError.value = false;
            resetFormData();
            cropNewIssuesDatas.value = response.data.getData;
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
    const findcropNewIssueById = cropNewIssuesDatas.value.find((item) => item.id === id);
    localStorage.setItem('cropNewIssue', JSON.stringify(findcropNewIssueById));
    router.push(`/crop_issues/${id}`);
}
</script>

<style scoped></style>