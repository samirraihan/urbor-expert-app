<template>
  <main>
    <div class="page no-toolbar">
      <div class="navbar">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="left">
            <NuxtLink to="/auth" class="back">
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
        <div class="signin-image">
          <img src="/img/illustrations/forgot-password.png" alt="">
        </div>
        <div class="centered-text">
          <h1>পিন ভুলে গেছেন?</h1>
          <p class="forgot-password-text">আপনার অ্যাকাউন্টের সাথে যুক্ত ফোন নম্বরটি লিখুন এবং আমরা আপনার পিনটি পুনরায়
            তৈরি করার জন্য আপনাকে একটি এসএমএস পাঠাব৷</p>
        </div>
        <form @submit.prevent="handleForgotPassword">
          <input type="text" v-model="phone" placeholder="মোবাইল নম্বর" @input="checkPhoneInput" inputmode="numeric">
          <button type="submit" class="button button-fill color-dark primary-bg-color" :disabled="!phone">এসএমএস পাঠান</button>
        </form>
        <!-- <div class="signin-links">
          <NuxtLink to="/contact/" class="link">আমাদের সাথে যোগাযোগ করুন</NuxtLink>
        </div> -->
      </div>
    </div>
    <LazyCommonPreloader :preloader="preloader" />
  </main>
</template>

<script setup>
useHead({
  title: "Forgot Password | Urbor",
});
definePageMeta({
  layout: "auth",
});
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

const preloader = ref(false);
const { $toast } = useNuxtApp();
const phone = ref("");

const checkPhoneInput = () => {
  // Remove non-numeric characters, allowing a leading plus sign
  let cleanedValue = phone.value.replace(/[^0-9]/g, "");

  // Ensure plus sign only appears at the beginning
  if (phone.value.startsWith('+')) {
    cleanedValue = '+' + cleanedValue;
  }

  // Limit to 15 characters
  phone.value = cleanedValue.slice(0, 15);
};

async function handleForgotPassword() {
  try {
    if(!phone.value) {
      $toast.error('আপনার মোবাইল নম্বরটি লিখুন');
      return;
    }
    preloader.value = true;
    const isForgotPasswordSendSuccess = await authStore.forgotPassword(phone.value);
    if (isForgotPasswordSendSuccess) {
        phone.value = "";
    }
    preloader.value = false;
  } catch (error) {
    preloader.value = false;
    console.log(error);
  }
}
</script>
