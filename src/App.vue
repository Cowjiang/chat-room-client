<template>
  <keep-alive>
    <v-app>
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

<style>
  @import "~@/common/style/fontawesome.css";

  ::-webkit-scrollbar {
    width: 0 !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
</style>
