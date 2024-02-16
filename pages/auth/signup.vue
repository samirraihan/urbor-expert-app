<template>
  <main>
    <div class="page no-toolbar">
      <div class="navbar">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="left">
            <NuxtLink to="/auth" class="link back">
              <i class="icon f7-icons arrow-back">arrow_left</i>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="auth-logo">
          <LazyCommonLogo />
        </div>
        <h3 class="text-align-center">উর্বর এ আপনাকে স্বাগতম</h3>
        <div class="signup-image">
          <img src="/img/illustrations/signup.png" alt="">
        </div>
        <div class="centered-text">
          <h1>নতুন একাউন্ট খুলুন</h1>
          <form @submit.prevent="handleSignUp">
            <input type="text" v-model="form.name" placeholder="সম্পূর্ণ নাম *">
            <input type="text" v-model="form.phone" placeholder="মোবাইল নম্বর *" @input="checkPhoneInput"
              inputmode="numeric">
            <div class="grid grid-cols-2 grid-gap">
              <input type="password" v-model="form.password" placeholder="পিন *" @input="checkPasswordInput"
                inputmode="numeric" minlength="4" maxlength="4">
              <input type="password" v-model="form.password_confirmation" placeholder="পূনরায় পিন দিন *"
                @input="checkPasswordInput" inputmode="numeric" minlength="4" maxlength="4">
            </div>
            <input type="text" v-model="form.nid" placeholder="জাতীয় পরিচয়পত্র নম্বর *">
            <input type="text" v-model="form.nid_front" placeholder="জাতীয় পরিচয়পত্রের সামনের দিকের ফটো *">
            <input type="text" v-model="form.nid_back" placeholder="জাতীয় পরিচয়পত্রের পিছনের দিকের ফটো *">
            <input type="text" v-model="form.signature" placeholder="স্বাক্ষর *">
            <input type="text" v-model="form.qualification" placeholder="শিক্ষাগত যোগ্যতা *">
            <input type="text" v-model="form.qualification_certificate" placeholder="যোগ্যতা সার্টিফিকেট ফটো *">
            <hr>
            <div class="grid grid-cols-3 grid-gap">
              <!-- <Select2 v-model="form.division" :options="formattedDivisionOptions" @change="handleSelectChange" />
              <h4>Value: {{ form.division }}</h4> -->
              <select v-model="form.division" @change="handleSelectChange">
                <option value="">বিভাগ *</option>
                <option v-for="option in formattedDivisionOptions" :key="option.id" :value="option.id">
                  {{ option.text }}
                </option>
              </select>
              <select v-model="form.district" @change="handleSelectChange">
                <option value="">জেলা *</option>
                <option v-for="option in formattedDistrictOptions" :key="option.id" :value="option.id">
                  {{ option.text }}
                </option>
              </select>
              <select v-model="form.upazila" @change="handleSelectChange">
                <option value="">উপজেলা *</option>
                <option v-for="option in formattedUpazilaOptions" :key="option.id" :value="option.id">
                  {{ option.text }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-2 grid-gap">
              <select v-model="form.union" @change="handleSelectChange">
                <option value="">ইউনিয়ন *</option>
                <option v-for="option in formattedUnionOptions" :key="option.id" :value="option.id">
                  {{ option.text }}
                </option>
              </select>
              <!-- <input type="text" v-model="form.union" placeholder="ইউনিয়ন *"> -->
              <input type="text" v-model="form.village" placeholder="গ্রাম *">
            </div>
            <textarea v-model="form.address" placeholder="ঠিকানা *" />
            <p class="term-condition">
              <label class="checkbox checkbox-inline checkbox-rounded">
                <input type="checkbox" :checked="form.terms" @change="updateTerms">
                <i class="icon-checkbox"></i>
              </label>
              একাউন্ট করে, আমি নিয়ম ও শর্তাবলীতে সম্মত
              <NuxtLink to="/term-condition" class="link"><u>নিয়ম ও শর্তাবলীতে </u></NuxtLink>
              সম্মত।
            </p>
            <button type="submit" class="button color-dark button-fill primary-bg-color" :disabled="!form.terms || preloader">একাউন্ট
              খুলুন</button>
          </form>
          <p class="signup-have-account">
            একাউন্ট আছে?
            <NuxtLink to="/auth" class="link">প্রবেশ করুন</NuxtLink>
          </p>
        </div>
      </div>
    </div>
    <LazyCommonPreloader :preloader="preloader" />
  </main>
</template>

<script setup>
useHead({
  title: "Sign Up | Urbor",
});

definePageMeta({
  layout: "auth",
});
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const { $toast } = useNuxtApp();

const preloader = ref(false);
const locationDatas = ref([]);
const districts = ref([]);
const upazilas = ref([]);
const unions = ref([]);
const noError = ref(false);

const form = ref({
  user_type: 'Agent',
  name: '',
  phone: '',
  password: '',
  password_confirmation: '',
  nid: '',
  nid_front: '',
  nid_back: '',
  signature: '',
  qualification: '',
  qualification_certificate: '',
  division: '',
  district: '',
  upazila: '',
  union: '',
  village: '',
  address: '',
  terms: false,
});

function updateTerms() {
  form.value.terms = !form.value.terms
}

async function locationDropdowns() {
  try {
    const response = await useMyFetch('admin/location-dropdowns');
    locationDatas.value = response.data.getData;
  } catch (error) {
    console.log(error);
  }
}

locationDropdowns();

const handleSelectChange = () => {
  const findLocationById = (locations, id) => locations.find((location) => location.id === id);

  if (form.value.division) {
    districts.value = findLocationById(locationDatas.value, form.value.division)?.districts || [];
    upazilas.value = [];
    unions.value = [];
  }

  if (form.value.district) {
    upazilas.value = findLocationById(districts.value, form.value.district)?.upazilas || [];
    unions.value = [];
  }

  if (form.value.upazila) {
    unions.value = findLocationById(upazilas.value, form.value.upazila)?.unions || [];
  }
};

const createFormattedOptions = (locations, condition) => {
  if (condition) {
    return locations.map((location) => {
      return {
        id: location.id,
        text: location.bn_name,
      };
    });
  }
  return [];
};

const formattedDivisionOptions = computed(() => {
  return createFormattedOptions(locationDatas.value, true);
});

const formattedDistrictOptions = computed(() => {
  return createFormattedOptions(districts.value, form.value.division);
});

const formattedUpazilaOptions = computed(() => {
  return createFormattedOptions(upazilas.value, form.value.district);
});

const formattedUnionOptions = computed(() => {
  return createFormattedOptions(unions.value, form.value.upazila);
});

function handleErrors() {
  const requiredFields = [
    { field: form.value.name, message: "আপনার সম্পূর্ণ নাম লিখুন" },
    { field: form.value.phone, message: "আপনার মোবাইল নম্বর লিখুন" },
    { field: form.value.password, message: "পিন লিখুন" },
    { field: form.value.password_confirmation, message: "পূনরায় পিন দিন" },
    { field: form.value.nid, message: "জাতীয় পরিচয়পত্র নম্বর লিখুন" },
    { field: form.value.nid_front, message: "জাতীয় পরিচয়পত্রের সামনের দিকের ফটো দিন" },
    { field: form.value.nid_back, message: "জাতীয় পরিচয়পত্রের পিছনের দিকের ফটো দিন" },
    { field: form.value.signature, message: "স্বাক্ষর দিন" },
    { field: form.value.qualification, message: "শিক্ষাগত যোগ্যতা লিখুন" },
    { field: form.value.qualification_certificate, message: "যোগ্যতা সার্টিফিকেট ফটো দিন" },
    { field: form.value.division, message: "বিভাগ নির্বাচন করুন" },
    { field: form.value.district, message: "জেলা নির্বাচন করুন" },
    { field: form.value.upazila, message: "উপজেলা নির্বাচন করুন" },
    { field: form.value.union, message: "ইউনিয়ন নির্বাচন করুন" },
    { field: form.value.village, message: "গ্রাম লিখুন" },
    { field: form.value.address, message: "ঠিকানা লিখুন" },
    { field: form.value.terms, message: "নিয়ম ও শর্তাবলীর সাথে সম্মত হন" }
  ];

  const errorMessages = requiredFields.filter(field => !field.field).map(field => field.message);

  if (errorMessages.length > 0) {
    errorMessages.forEach(message => $toast.error(message));
  } else {
    noError.value = true;
  }
}

async function handleSignUp() {
  try {
    handleErrors();

    if (noError.value === false) {
      return;
    }

    if (!form.value.password.match(/^[0-9]+$/)) {
      $toast.error('পিন সংখ্যাসূচক হতে হবে');
      return;
    }
    if (form.value.password.length !== 4) {
      $toast.error('পিন অবশ্যই 4 সংখ্যার হতে হবে');
      return;
    }
    if (form.value.password !== form.value.password_confirmation) {
      $toast.error("নতুন পিন ও পুনরায় নতুন পিন অবশ্যই একই হতে হবে");
      return;
    }

    preloader.value = true;
    await authStore.signup(form.value);
    preloader.value = false;
  } catch (error) {
    preloader.value = false;
    console.log(error);
  }
}

const checkPhoneInput = () => {
  // Remove non-numeric characters, allowing a leading plus sign
  let cleanedValue = form.value.phone.replace(/[^0-9]/g, "");

  // Ensure plus sign only appears at the beginning
  if (form.value.phone.startsWith('+')) {
    cleanedValue = '+' + cleanedValue;
  }

  // Limit to 15 characters
  form.value.phone = cleanedValue.slice(0, 15);
};

const checkPasswordInput = () => {
  // Remove non-numeric characters
  form.value.password = form.value.password.replace(/[^0-9]/g, "");
  form.value.password_confirmation = form.value.password_confirmation.replace(/[^0-9]/g, "");

  // Limit to 4 digits
  form.value.password = form.value.password.slice(0, 4);
  form.value.password_confirmation = form.value.password_confirmation.slice(0, 4);
};
</script>
