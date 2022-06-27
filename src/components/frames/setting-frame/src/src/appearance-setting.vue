<template>
  <div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">主题颜色设置</span>
      <div class="pt-2 d-flex">
        <v-sheet
          theme="dark"
          :color="primaryColor"
          class="w-50 pa-8 mr-8">
          <pre>设置主题颜色</pre>
          <pre>{{ primaryColor }}</pre>
        </v-sheet>
        <v-color-picker
          v-model="primaryColor"
          mode="hexa"
          :hide-inputs="true"
          :elevation="0"
          @update:modelValue="updateColor"/>
      </div>
      <v-divider class="my-6" color="#e5e5ea"/>
    </div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">背景颜色设置</span>
      <div class="pt-2 d-flex">
        <v-sheet
          theme="dark"
          :color="backgroundColor"
          class="w-50 pa-8 mr-8">
          <pre>设置背景颜色</pre>
          <pre>{{ backgroundColor }}</pre>
        </v-sheet>
        <v-color-picker
          v-model="backgroundColor"
          mode="hexa"
          :hide-inputs="true"
          :elevation="0"
          @update:modelValue="updateColor"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {updateUserSettingsApi} from '@/service/api/user'
    import {Utils} from '@/common/utils'

    const store = useStore()
    const {primaryColor, backgroundColor} = storeToRefs(store)
    const utils = new Utils()

    const updateColor = () => {
        utils.debounce(() => {
            updateUserSettingsApi({
                primaryColor: primaryColor.value,
                backgroundColor: backgroundColor.value
            }).then(() => {
                store.updateUserSetting('primaryColor', primaryColor.value)
                store.updateUserSetting('backgroundColor', backgroundColor.value)
            }).catch(err => {
                console.error(err)
            })
        }, 0)
    }
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色

  .setting-group {
    ::v-deep(.v-switch .v-label) {
      display: none;
    }

    ::v-deep(.v-color-picker-preview) {
      margin-bottom: 0;
    }

    ::v-deep(.v-color-picker__controls) {
      padding-bottom: 0;
    }
  }
</style>