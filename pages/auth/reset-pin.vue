<template>
  <main>
    <div class="page no-toolbar">
      <div class="navbar">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="left">
          </div>
        </div>
      </div>
      <div class="page-content">
        <div class="auth-logo">
          <LazyCommonLogo />
        </div>
        <h3 class="text-align-center">উর্বর এ আপনাকে স্বাগতম</h3>
        <div class="signin-image">
          <img src="/img/illustrations/signin.png" alt="">
        </div>
        <div class="centered-text">
          <h2>পিন পরিবর্তন করুন</h2>
        </div>
        <form @submit.prevent="handleResetPassword">
          <div class="grid grid-cols-2 grid-gap">
            <input type="password" v-model="form.password" placeholder="পিন *" @input="checkPasswordInput"
              inputmode="numeric" minlength="4" maxlength="4">
            <input type="password" v-model="form.password_confirmation" placeholder="পূনরায় পিন দিন *"
              @input="checkPasswordInput" inputmode="numeric" minlength="4" maxlength="4">
          </div>
          <button type="submit" class="button button-fill color-dark primary-bg-color" :disabled="!form.password">পরিবর্তন করুন</button>
        </form>
      </div>
    </div>
    <LazyCommonPreloader :preloader="preloader" />
  </main>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

useHead({
    title: "Pin Reset | Urbor",
});

definePageMeta({
  layout: "auth",
});

const preloader = ref(false);
const noError = ref(false);
const router = useRouter();

const form = ref({
    phone: router.currentRoute.value.query.phone,
    otp: router.currentRoute.value.query.otp,
    password: '1111',
    password_confirmation: '1111',
});

function handleErrors() {
    const requiredFields = [
        { field: form.value.password, message: "পিন লিখুন" },
        { field: form.value.password_confirmation, message: "পূনরায় পিন দিন" },
    ];

    const errorMessages = requiredFields.filter(field => !field.field).map(field => field.message);

    if (errorMessages.length > 0) {
        errorMessages.forEach(message => $toast.error(message));
    } else {
        noError.value = true;
    }
}

async function handleResetPassword() {
    try {
        handleErrors();

        if (noError.value === false) {
            return;
        }

        if (form.value.password !== form.value.password_confirmation) {
          $toast.error("নতুন পিন ও পুনরায় নতুন পিন অবশ্যই একই হতে হবে");
          return;
        }

        preloader.value = true;

        const response = await authStore.resetPassword(form.value);
        if (!response) {
            preloader.value = false;
            noError.value = false;
        } else {
            preloader.value = false;
            noError.value = false;
        }
    } catch (error) {
        preloader.value = false;
        noError.value = false;
        console.log(error);
    }
}

const checkPasswordInput = () => {
  // Remove non-numeric characters
  password.value = password.value.replace(/[^0-9]/g, "");
  password_confirmation.value = password_confirmation.value.replace(/[^0-9]/g, "");

  // Limit to 4 digits
  password.value = password.value.slice(0, 4);
  password_confirmation.value = password_confirmation.value.slice(0, 4);
};
</script>
