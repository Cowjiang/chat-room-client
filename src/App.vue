<template>
  <keep-alive>
    <v-app class="app">
      <router-view></router-view>
    </v-app>
  </keep-alive>
</template>

<script lang="ts" setup>
    import {onMounted} from "vue"
    import {useStore} from "@/store"
    import {clearUserInfo} from "@/common/utils"

    const store = useStore()

    onMounted(() => {
        if (sessionStorage.getItem("token") && sessionStorage.getItem("userInfo")) {
            store.userInfo = JSON.stringify(sessionStorage.getItem("userInfo"))
        } else {
            clearUserInfo()
        }
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
