<template>
  <div class="main-container d-flex flex-row">
    <div class="nav-wrapper flex-shrink-0 flex-grow-0">
      <navigation-bar/>
    </div>
    <div class="content-wrapper flex-grow-1 pt-2 pr-2 pb-2">
      <div class="content-container rounded-lg">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {onMounted} from 'vue'
    import {useStore} from "@/store"
    import {storeToRefs} from "pinia"
    import NavigationBar from "@/components/navigationBar/src/navigationBar.vue";

    const store = useStore()
    const {backgroundColor} = storeToRefs(store)

    onMounted(() => {

    })
</script>

<style lang="scss" scoped>
  $background-color: v-bind(backgroundColor); //个性化背景颜色

  .main-container {
    width: 100vw;
    height: 100vh;

    .nav-wrapper {
      width: $nav-width;
      height: inherit;
      background-color: $background-color;
    }

    .content-wrapper {
      height: inherit;
      background-color: $background-color;

      .content-container {
        width: 100%;
        height: 100%;
        background-color: #fff;
      }
    }
  }
</style>