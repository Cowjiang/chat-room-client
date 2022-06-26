<template>
  <keep-alive>
    <v-app class="app">
      <router-view></router-view>
    </v-app>
  </keep-alive>
</template>

<script lang="ts" setup>
    import {onMounted, onUnmounted} from 'vue'
    import {useStore} from '@/store'
    import {clearUserInfo} from '@/common/utils'
    import {disconnectSocket} from '@/service/socket'

    const store = useStore()

    onMounted(() => {
        if (sessionStorage.getItem("token") && sessionStorage.getItem("userInfo")) {
            store.userInfo = sessionStorage.getItem("userInfo") ?? ''
        } else {
            clearUserInfo()
        }
    })

    onUnmounted(() => {
        disconnectSocket()
    })
</script>

<style lang="scss">
  @import "~@/common/style/fontawesome.css";

  ::-webkit-scrollbar {
    width: 0;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
</style>
