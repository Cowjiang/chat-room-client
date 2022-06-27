<template>
  <div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">开发者模式</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">是否启用开发者模式</span>
        <v-switch
          v-model="switchValue[0]"
          class="flex-grow-0"
          hide-details
          disabled
          density="comfortable"
          color="deep-purple"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {ref} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'

    const store = useStore()
    const {primaryColor} = storeToRefs(store)
    const switchValue = ref<Array<boolean>>([false])
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色

  .setting-group {
    ::v-deep(.v-switch .v-label) {
      display: none;
    }
  }
</style>