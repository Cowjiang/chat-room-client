<template>
  <div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">谁可以添加你为好友</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">所有人</span>
        <v-switch
          v-model="switchValue[0]"
          class="flex-grow-0"
          hide-details
          density="comfortable"
          color="deep-purple"
          @change="updateSetting('publicStatus', Number(switchValue[0]))"/>
      </div>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">好友的好友</span>
        <v-switch
          v-model="switchValue[0]"
          class="flex-grow-0"
          hide-details
          disabled
          density="comfortable"
          color="deep-purple"/>
      </div>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">来自群聊</span>
        <v-switch
          v-model="switchValue[0]"
          class="flex-grow-0"
          hide-details
          disabled
          density="comfortable"
          color="deep-purple"/>
      </div>
      <v-divider class="my-6" color="#e5e5ea"/>
    </div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">用户体验改善计划</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">参与用户体验计划</span>
        <v-switch
          v-model="switchValue[1]"
          class="flex-grow-0"
          hide-details
          density="comfortable"
          color="deep-purple"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {ref, watch} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {Utils} from '@/common/utils'
    import {updateUserSettingsApi} from '@/service/api/user'

    const utils = new Utils()
    const store = useStore()
    const {primaryColor, userSetting} = storeToRefs(store)
    const switchValue = ref<Array<boolean>>([Boolean(userSetting.value.publicStatus), true])

    watch(
        () => userSetting.value,
        nVal => {
            switchValue.value = [Boolean(nVal.publicStatus), true]
        },
        {
            deep: true,
            immediate: true
        }
    )

    /**
     * 更新用户设置
     * @param key 更改的键名
     * @param value 更改的键值
     */
    const updateSetting = (key: string, value: any) => {
        utils.debounce(() => {
            const params = {} as any
            params[key] = value
            updateUserSettingsApi(params).then(() => {
                store.updateUserSetting(key, value)
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
  }
</style>