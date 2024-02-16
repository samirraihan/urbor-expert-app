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
          <p class="primary-text-color">{{ successMessage }}</p>
        </div>
        <div class="centered-text">
          <h2>প্রবেশ করুন</h2>
        </div>
        <form @submit.prevent="handleSignin">
          <small class="text-danger" v-if="!form.phone || loginFailed">{{ loginErrorMsg }}</small>
          <input type="text" id="phone" v-model="form.phone" placeholder="মোবাইল নম্বর"
            :class="!form.phone || loginFailed ? borderDanger : ''" maxlength="15" @input="checkPhoneInput"
            inputmode="numeric">
          <small class="text-danger" v-if="!form.password || loginFailed">{{ passwordErrorMsg }}</small>
          <input type="password" id="password" v-model="form.password" placeholder="পিন"
            :class="!form.password || loginFailed ? borderDanger : ''" maxlength="4" @input="checkPasswordInput"
            inputmode="numeric">
          <button type="submit" class="button button-fill color-dark primary-bg-color"
            :disabled="!form.phone || !form.password">প্রবেশ করুন</button>
        </form>
        <div class="signin-links">
          <NuxtLink to="/auth/forgot-password" class="link">পিন ভুলে গেছেন?</NuxtLink>
          <NuxtLink to="/auth/signup" class="link">একাউন্ট খুলুন</NuxtLink>
        </div>
      </div>
    </div>
    <LazyCommonPreloader :preloader="preloader" />
  </main>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

useHead({
  title: "Login | Urbor",
});

definePageMeta({
  layout: "auth",
});

const preloader = ref(false);
const noError = ref(false);
const borderDanger = ref('');
const loginFailed = ref(false);
const loginErrorMsg = ref('');
const passwordErrorMsg = ref('');

const form = ref({
  phone: '01766932180',
  password: '1111',
});

function handleErrors() {
  const requiredFields = [
    { fieldName:'form.value.phone', field: form.value.phone, message: "ফোন নম্বর প্রয়োজন" },
    { fieldName:'form.value.password', field: form.value.password, message: "পিন লিখুন" },
  ];

  const errorFields = requiredFields.filter(field => !field.field);

  if (errorFields.length > 0) {
    errorFields.forEach(field => {
      if (field.fieldName == 'form.value.phone') {
        loginErrorMsg.value = field.message;
        borderDanger.value = 'border-danger';
      } else if (field.fieldName == 'form.value.password') {
        passwordErrorMsg.value = field.message;
        borderDanger.value = 'border-danger';
      }
    });
  } else {
    noError.value = true;
  }
}

async function handleSignin() {
  try {
    handleErrors();

    if (noError.value === false) {
      return;
    }

    preloader.value = true;

    const response = await authStore.signin(form.value);
    if (!response) {
      preloader.value = false;
      noError.value = false;
      loginFailed.value = true
      borderDanger.value = 'border-danger'
      loginErrorMsg.value = 'ফোন নম্বর অথবা পিন ভুল হয়েছে';
      passwordErrorMsg.value = '';
    } else {
      preloader.value = false;
      noError.value = false;
      loginFailed.value = false;
      loginErrorMsg.value = '';
      passwordErrorMsg.value = '';
    }
  } catch (error) {
    preloader.value = false;
    noError.value = false;
    loginFailed.value = false;
    loginErrorMsg.value = '';
    passwordErrorMsg.value = '';
    console.log(error);
  }
}

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

const checkPasswordInput = () => {
  // Remove non-numeric characters
  password.value = password.value.replace(/[^0-9]/g, "");

  // Limit to 4 digits
  password.value = password.value.slice(0, 4);
};

const successMessage = ref('');
const router = useRouter();

onMounted(() => {
  if (router.currentRoute.value.query.success) {
    successMessage.value = 'আপনার একাউন্ট সফলভাবে তৈরি হয়েছে!';
  }
  if (router.currentRoute.value.query.reset) {
    successMessage.value = 'আপনার পিন সফলভাবে পুনরায় তৈরি হয়েছে!';
  }
});

</script>
