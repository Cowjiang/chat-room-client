<template>
  <div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">文字聊天</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">发送消息</span>
        <v-select
          class="flex-grow-0"
          :items="['Enter']"
          :model-value="'Enter'"
          label="Outlined variant"
          variant="outlined"
          density="compact"
          color="deep-purple"
          hide-details
          disabled
          single-line/>
      </div>
      <v-divider class="my-6" color="#e5e5ea"/>
    </div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">语音聊天</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">按键说话快捷键</span>
        <v-select
          class="flex-grow-0"
          :items="['未设置']"
          :model-value="'未设置'"
          label="Outlined variant"
          variant="outlined"
          density="compact"
          color="deep-purple"
          hide-details
          disabled
          single-line/>
      </div>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">开启/关闭麦克风快捷键</span>
        <v-select
          class="flex-grow-0"
          :items="['未设置']"
          :model-value="'未设置'"
          label="Outlined variant"
          variant="outlined"
          density="compact"
          color="deep-purple"
          hide-details
          disabled
          single-line/>
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
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色

  .setting-group {
    ::v-deep(.v-switch .v-label) {
      display: none;
    }
  }
</style>