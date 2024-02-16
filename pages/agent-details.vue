<template>
    <main>
        <div class="page">
            <div class="page-content">
                <h1>এজেন্ট বিস্তারিত</h1>
                <p>
                    এজেন্টের নাম: Samir Raihan <br>
                    এজেন্টের আইডি: 123456789 <br>
                    এজেন্টের ফোন নম্বর: 01766932193
                </p>
                <span data-progress="20" class="progressbar"><span style="transform: translate3d(-80%, 0px, 0px);"></span></span>
            </div>
        </div>
    </main>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
});

const pageTitle = ref("Agent Details");
const currentApiUrl = ref("farmer/agent/");
useHead({
    title: pageTitle.value + " | Urbor",
});
</script>

<style scoped></style>