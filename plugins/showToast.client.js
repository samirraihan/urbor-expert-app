import {defineNuxtPlugin} from '#app'
import Toast, {POSITION, useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

const toast = useToast();

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(Toast, {
        position: POSITION.TOP_RIGHT,
        transition: "fade",
        newestOnTop: true,
        timeout: 10000,
        draggable: true,
        draggablePercent: 0.7,
        closeButton: "button",
        rtl: false,
    });
    nuxtApp.provide('toast', toast)
})