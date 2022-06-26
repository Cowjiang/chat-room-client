<template>
  <div class="custom-container">
    <login-popup
      v-model="showLoginPopup"
      @close="showLoginPopup = false"/>
  </div>
</template>

<script lang="ts" setup>
    import {onMounted, ref} from 'vue'
    import LoginPopup from '@/components/popup-dialogs/login-popup/src/login-popup.vue'

    const showLoginPopup = ref(true)
    onMounted(() => {
        setTimeout(() => {
            showLoginPopup.value = true;
        }, 500);
    })
</script>

<style lang="scss" scoped>
  .custom-container {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;

    background: {
      image: url(https://static.zhihu.com/heifetz/assets/sign_bg.db29b0fb.png);
      repeat: no-repeat;
      color: #b8e5f8;
      size: cover;
    }
  }
</style>