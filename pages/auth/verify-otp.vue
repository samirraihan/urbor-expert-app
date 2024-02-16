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
          <img src="/img/illustrations/forgot-password.png" alt="">
        </div>
        <div class="centered-text">
          <h1>একাউন্ট যাচাই করুন</h1>
          <p class="forgot-password-text">একাউন্ট যাচাই করার জন্যে প্রেরণ করা ওটিপি নম্বর দিন</p>
        </div>
        <form @submit.prevent="handleOTPVerification">
          <input type="text" v-model="form.otp" placeholder="ওটিপি নম্বর" @input="checkOTPInput" inputmode="numeric"
            maxlength="4">
          <button type="submit" class="button button-fill color-dark primary-bg-color" :disabled="!form.otp"> যাচাই করুন </button>
        </form>
      </div>
    </div>
    <LazyCommonPreloader :preloader="preloader" />
  </main>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

definePageMeta({
  layout: "verify"
});
const { $toast } = useNuxtApp();

const preloader = ref(false);
const otpError = ref(false);
const router = useRouter();
const isForgotPassword = ref(false);

if (router.currentRoute.value.query.phone) {
  isForgotPassword.value = true;
}

const form = ref({
  phone: router.currentRoute.value.query.phone || authStore.user.phone,
  otp: "",
  type: isForgotPassword.value ? "forgot-password" : "signin",
});

const checkOTPInput = () => {
  // Remove non-numeric characters
  let cleanedValue = form.value.otp.replace(/[^0-9]/, "");

  // Limit to 4 characters
  form.value.otp = cleanedValue.slice(0, 4);
};

async function handleOTPVerification() {
  try {
    if (!form.value.otp) {
      $toast.error('ওটিপি দিন');
      otpError.value = true;
      return;
    } else if (form.value.otp.length !== 4) {
      $toast.error('ওটিপি অবশ্যই 4 সংখ্যার হতে হবে');
      otpError.value = true;
      return;
    } else {
      otpError.value = false;
    }

    preloader.value = true;

    const endpoint = otpError.value ? "auth/resend-verification-otp" : "auth/verify-otp";

    const response = await useMyFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(form.value)
    });

    if (response.status === "success") {
      preloader.value = false;
      if (authStore) {
        localStorage.setItem("AUTH_USER_PHONE_VERIFIED", true);
      }      
      navigateTo('/auth/reset-pin?phone=' + btoa(atob(form.value.phone)) + '&otp=' + btoa(form.value.otp));
    } else {
      $toast.error("কিছু ভুল হয়েছে! অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন.");
    }
  } catch (error) {
    preloader.value = false;
    console.log(error);
  }
}
</script>
