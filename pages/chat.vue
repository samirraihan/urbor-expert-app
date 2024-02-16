<template>
  <main>
    <div class="page">
      <div class="toolbar messagebar messagebar-init custom-message-bar">
        <div v-if="previewImage" class="image-preview">
          <img :src="previewImage" alt="Preview" class="selected-image-preview" />
          <span class="remove-selected-image-icon" @click="clearPreview">&times;</span>
        </div>
        <form>
          <div class="toolbar-inner">
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileChange"
              name="imageFile" />
            <a class="link toggle-sheet" href="#" @click="openFileInput">
              <i class="icon f7-icons">camera_fill</i>
            </a>
            <div class="messagebar-area">
              <textarea v-model="form.messageText" placeholder="Message" name="messageText"></textarea>
            </div>
            <button type="button" @click="handleSubmit" class="link send-link"><i class="icon f7-icons">paperplane_fill</i></button>
          </div>
        </form>
      </div>
      <div ref="messagesContent" class="page-content messages-content">
        <div class="messages full-width">
          <div class="messages-date">April 25, 2023 at 1:45 PM</div>
          <div class="message message-sent" v-for="message in allMessages" :key="message.id">
            <div class="message-content">
                <div class="messages-date"><sub>{{ message.MessageDateTime }}</sub></div>
              <div class="message-bubble">
                <div class="message-text">{{ message.Body }}</div>
              </div>
            </div>
          </div>
          <div class="message message-received">
            <div class="message-avatar"><i class="icon f7-icons">person_alt_circle</i></div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text">Hey! It's going pretty well, thanks.</div>
              </div>
            </div>
          </div>
          <div class="message message-received">
            <div class="message-avatar"><i class="icon f7-icons">person_alt_circle</i></div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text">Just got back from the gym. How about you?</div>
              </div>
            </div>
          </div>
          <div class="message message-sent">
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text">Nice! I'm doing pretty good too. Hey, did you hear that they're closing down the
                  coffee shop on Main Street?</div>
              </div>
            </div>
          </div>
          <div class="message message-received">
            <div class="message-avatar"><i class="icon f7-icons">person_alt_circle</i></div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text">What? No way! That place has been around forever. Why are they closing it?</div>
              </div>
            </div>
          </div>
          <div class="message message-sent">
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text">I'm not sure, but I heard they weren't getting enough business. It's a shame
                  though, I really liked that place.</div>
              </div>
            </div>
          </div>
          <div class="message message-received">
            <div class="message-avatar"><i class="icon f7-icons">person_alt_circle</i></div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text">Yeah, me too. We should go there one last time before they close.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});

const pageTitle = ref("Chat");
const currentApiUrl = ref("admin/whatsapp/");
useHead({
  title: pageTitle.value + " | Urbor",
});
const { $toast } = useNuxtApp();

const messagesContent = ref(null);

onMounted(() => {
  // Scroll to the bottom when the component is mounted
  scrollBottom();
});

// Function to scroll to the bottom of messagesContent
const scrollBottom = () => {
  if (messagesContent.value) {
    messagesContent.value.scrollTop = messagesContent.value.scrollHeight;
  }
};

const allMessages = ref([]);

async function fetchData() {
    try {
        // isDataLoading.value = true;
        const response = await useMyFetch(
            currentApiUrl.value + "fetch-data"
        );
        if (response) {
            // isDataLoading.value = false;
            allMessages.value = response.data.getData;
        }
    } catch (error) { }
}

fetchData();

const fileInput = ref(null);
const previewImage = ref(null);

const openFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = () => {
  const selectedFile = fileInput.value.files[0];

  if (selectedFile) {
    // Read the selected file as a data URL to display as an image
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.value = reader.result;
    };
    reader.readAsDataURL(selectedFile);
  } else {
    // If no file is selected, clear the preview
    previewImage.value = null;
  }

  // Do something with the selected file, e.g., upload or display
  console.log('Selected file:', selectedFile);
};

const clearPreview = () => {
  previewImage.value = null;
};

const form = ref({
  messageText: '',
  messageSender: process.env.TWILIO_WHATSAPP_NUMBER,
  messageReceiver: '+8801766932193',
})

async function handleSubmit() {
  try {
        // handleErrors();

        // if (noError.value === false) {
        //     return;
        // }

        // preloader.value = true;

        const endpoint = currentApiUrl.value + "send-whatsapp-message";

        // if ((JSON.stringify(currentFormData.value) === JSON.stringify(form.value)) && isEdit.value === true) {
        //     preloader.value = false;
        //     handleCloseFormModal();
        //     swal.fire({
        //         title: 'Nothing to Update!',
        //         text: 'No Changes Made :)',
        //         icon: 'error',
        //         customClass: {
        //             confirmButton: 'btn btn-success'
        //         }
        //     });
        //     return;
        // }

        const response = await useMyFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(form.value)
        });

        if (response.status === "success") {
            // preloader.value = false;
            $toast.success(response.message);
            // handleCloseFormModal();
            // resetFormData();
            // fetchData();
            // isCreate.value = false;
            // isEdit.value = false;
        } else {
            // isCreate.value = false;
            // isEdit.value = false;
            $toast.error("Something went wrong! Please try again later.");
        }
    } catch (error) {
        // preloader.value = false;
        // isCreate.value = false;
        // isEdit.value = false;
        $toast.error("Something went wrong! Please try again later.");
        console.error('Error:', error);
    }
  // Clear the message text
  form.value.messageText = null;

  // Clear the preview image
  previewImage.value = null;

  // Scroll to the bottom
  scrollBottom();
};
</script>