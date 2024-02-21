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
          <button class="button button-fill color-light-gray w-50" @click="handleLogout">
            <i class="icon f7-icons arrow-back text-color-red">square_arrow_right</i> Logout
          </button>
        </div>
        <div class="list list-outline list-dividers full-width">
          <ul>
            <li class="item-content" v-if="!showPinChange">
              <div class="item-inner">
                <div class="item-title">প্রোফাইল আপডেট</div>
                <div class="item-after">
                  <label class="switch">
                    <input type="checkbox" v-model="showProfileChange" class="checkbox" @click="handleDiv('profile')" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </li>
            <li class="item-content" v-if="!showProfileChange">
              <div class="item-inner">
                <div class="item-title">পিন পরিবর্তন</div>
                <div class="item-after">
                  <label class="switch">
                    <input type="checkbox" v-model="showPinChange" class="checkbox" @click="handleDiv('pinChange')" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <form v-if="showProfileChange" @submit.prevent="handleProfileUpdate">
          <div class="light-gray-title">ঠিকানা</div>
          <textarea type="text" v-model="profileForm.address" placeholder="ঠিকানা" readonly />
          <div class="light-gray-title">ছবি</div>
          <div class="create-post-cover" v-if="!imageView">
            <input type="file" name="profileForm.photo" @click="handleImage">
            <i class="icon f7-icons">photo</i>
            <div>ছবি আপলোড</div>
          </div>
          <div class="create-post-cover" v-else>
            <img :src="profileForm.photo" alt="ছবি" @click="handleImage" />
          </div>
          <div class="light-gray-title">স্বাক্ষর</div>
          <div class="create-post-cover">
            <input type="file" name="profileForm.signature">
            <i class="icon f7-icons">photo</i>
            <div>স্বাক্ষর আপলোড</div>
          </div>
          <div class="light-gray-title">আইডি / ভিজিটং কার্ড নং</div>
          <input type="text" v-model="profileForm.id_card_number" placeholder="আইডি / ভিজিটং কার্ড নং">
          <div class="light-gray-title">আইডি / ভিজিটং কার্ডের ছবি আপলোড</div>
          <div class="create-post-cover">
            <input type="file" name="profileForm.id_card_photo">
            <i class="icon f7-icons">photo</i>
            <div>আইডি / ভিজিটং কার্ডের ছবি আপলোড</div>
          </div>
          <button type="submit" class="button button-fill button-round color-dark primary-bg-color">প্রোফাইল আপডেট
            করুন</button>
        </form>
        <form v-if="showPinChange" @submit.prevent="handlePasswordChange">
          <div class="light-gray-title">পিন পরিবর্তন</div>
          <input type="password" v-model="form.old_password" placeholder="বর্তমান পিন" @input="checkPasswordInput"
            inputmode="numeric" minlength="4" maxlength="4">
          <div class="grid grid-cols-2 grid-gap no-margin">
            <div>
              <div class="light-gray-title">নতুন পিন</div>
              <input type="password" v-model="form.password" placeholder="নতুন পিন" @input="checkPasswordInput"
                inputmode="numeric" minlength="4" maxlength="4">
            </div>
            <div>
              <div class="light-gray-title">পুনরায় নতুন পিন</div>
              <input type="password" v-model="form.password_confirmation" placeholder="পুনরায় নতুন পিন"
                @input="checkPasswordInput" inputmode="numeric" minlength="4" maxlength="4">
            </div>
          </div>
          <button type="submit" class="button button-fill button-round color-dark primary-bg-color">পিন পরিবর্তন</button>
        </form>
      </div>
    </div>
    <LazyCommonPreloader :preloader="preloader" />
  </main>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const { $toast } = useNuxtApp();

definePageMeta({
  middleware: 'auth'
});

const pageTitle = ref("Profile");
const currentApiUrl = ref("admin/profile/");
useHead({
  title: pageTitle.value + " | Urbor",
});

const userName = computed(() => authStore.isAuthenticated ? authStore.user.name : 'নাম');
const userID = computed(() => authStore.isAuthenticated ? authStore.user.uuid : 'EID-000000');
const userPhone = computed(() => authStore.isAuthenticated ? authStore.user.phone : '000000000000000');

const showProfileChange = ref(false);
const showPinChange = ref(false);
const preloader = ref(false);
const noError = ref(false);
const currentFormData = ref({});
const imageView = ref(false);

const form = ref({
  id: authStore.user.id,
  old_password: '',
  password: '',
  password_confirmation: '',
});

const profileForm = ref({
  id: authStore.user.id,
  address: authStore.user.agent_details.address,
  photo: authStore.user.agent_details.photo,
  signature: authStore.user.agent_details.signature,
  id_card_number: authStore.user.agent_details.id_card_number,
  id_card_photo: authStore.user.agent_details.id_card_photo,
  user_type: 'Expert',
});
currentFormData.value = { ...profileForm.value };

const resetForm = () => {
  form.value.old_password = '';
  form.value.password = '';
  form.value.password_confirmation = '';
};

const handleDiv = (div) => {
  if (div === 'profile') {
    showProfileChange.value = !showProfileChange.value;
  } else if (div === 'pinChange') {
    showPinChange.value = !showPinChange.value;
  }
};

const checkPasswordInput = () => {
  // Remove non-numeric characters
  form.value.old_password = form.value.old_password.replace(/[^0-9]/g, "");
  form.value.password = form.value.password.replace(/[^0-9]/g, "");
  form.value.password_confirmation = form.value.password_confirmation.replace(/[^0-9]/g, "");

  // Limit to 4 digits
  form.value.old_password = form.value.old_password.slice(0, 4);
  form.value.password = form.value.password.slice(0, 4);
  form.value.password_confirmation = form.value.password_confirmation.slice(0, 4);
};

async function handleLogout() {
  preloader.value = true;
  await authStore.logout();
  preloader.value = false;
}

function handleErrors() {
  const requiredFields = [
    { field: form.value.old_password, message: "বর্তমান পিন দিন" },
    { field: form.value.password, message: "নতুন পিন দিন" },
    { field: form.value.password_confirmation, message: "পুনরায় নতুন পিন দিন" },
  ];

  const errorMessages = requiredFields.filter(field => !field.field).map(field => field.message);

  if (errorMessages.length > 0) {
    errorMessages.forEach(message => $toast.error(message));
  } else {
    noError.value = true;
  }
}

async function handlePasswordChange() {
  try {
    handleErrors();

    if (noError.value === false) {
      return;
    }

    if (!form.value.old_password.match(/^[0-9]+$/)) {
      $toast.error('বর্তমান পিন সংখ্যাসূচক হতে হবে');
      return;
    }
    if (form.value.old_password.length !== 4) {
      $toast.error('বর্তমান পিন অবশ্যই 4 সংখ্যার হতে হবে');
      return;
    }
    if (!form.value.password.match(/^[0-9]+$/)) {
      $toast.error('নতুন পিন সংখ্যাসূচক হতে হবে');
      return;
    }
    if (form.value.password.length !== 4) {
      $toast.error('নতুন পিন অবশ্যই 4 সংখ্যার হতে হবে');
      return;
    }
    if (form.value.password !== form.value.password_confirmation) {
      $toast.error("নতুন পিন ও পুনরায় নতুন পিন অবশ্যই একই হতে হবে");
      return;
    }

    preloader.value = true;

    const endpoint = "changePassword";

    const response = await useMyFetch(currentApiUrl.value + endpoint, {
      method: "POST",
      body: JSON.stringify(form.value)
    });

    if (response.status === "success") {
      preloader.value = false;
      $toast.success("পিন পরিবর্তন সফল হয়েছে");
      resetForm();
      await authStore.logout();
    } else {
      preloader.value = false;
      // $toast.error(response.data.message);
    }
  } catch (error) {
    preloader.value = false;
    console.log(error);
  }
}
async function handleProfileUpdate() {
  try {
    preloader.value = true;

    const endpoint = "updateProfile";

    if ((JSON.stringify(currentFormData.value) === JSON.stringify(profileForm.value))) {
      preloader.value = false;
      $toast.success("কোন পরিবর্তন হয়নি");
      return;
    }

    const response = await useMyFetch(currentApiUrl.value + endpoint, {
      method: "POST",
      body: JSON.stringify(profileForm.value)
    });

    if (response.status === "success") {
      preloader.value = false;
      $toast.success("প্রোফাইল আপডেট সফল হয়েছে");
      resetForm();
      await authStore.logout();
    } else {
      preloader.value = false;
    }
  } catch (error) {
    preloader.value = false;
    console.log(error);
  }
}

const handleImage = () => {
  imageView.value = !imageView.value;
};
</script>

<style scoped></style>