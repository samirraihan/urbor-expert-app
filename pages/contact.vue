<template>
  <main>
    <div class="page">
      <div class="page-content">
        <img src="/img/illustrations/contact-us.png" alt="">
        <h1>যোগাযোগ</h1>
        <div class="grid grid-cols-2 grid-gap">
          <a :href="'tel:' + supportPhone" class="link contact-block">
            <i class="icon f7-icons arrow-back">phone_fill</i>
            <div class="contact-method">ফোন করুন</div>
          </a>
          <a :href="'mailto:' + supportEmail" class="link contact-block">
            <i class="icon f7-icons arrow-back">envelope_fill</i>
            <div class="contact-method">ইমেইল করুন</div>
          </a>
        </div>
        <p>আপনি আমাদের একটি বার্তা পাঠাতে পারেন, আমরা সাধারণত ২৪ ঘন্টার মধ্যে আপনার বার্তাগুলির উত্তর দিই।</p>
        <form>
            <input type="text" id="email" name="subject" placeholder="বিষয়">
            <textarea placeholder="সম্পূর্ণ বার্তা" id="content" class="contact-input"></textarea>
            <a href="#" class="button button-fill button-round color-dark primary-bg-color">পাঠান</a>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Contact");
const currentApiUrl = ref("farmer/contact/");
const supportPhone = process.env.SUPPORT_PHONE;
const supportEmail = process.env.SUPPORT_EMAIL;
useHead({
    title: pageTitle.value + " | Urbor",
});
</script>

<style scoped></style>
