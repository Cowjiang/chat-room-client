<template>
  <div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">开启桌面通知</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">接收所有消息提醒</span>
        <v-switch
          v-model="switchValue[0]"
          class="flex-grow-0"
          hide-details
          density="comfortable"
          color="deep-purple"
          @change="updateSetting('notifyStatus', Number(switchValue[0]))"/>
      </div>
      <v-divider class="my-6" color="#e5e5ea"/>
    </div>
    <div class="setting-group w-100 d-flex flex-column">
      <span class="mb-2 text-subtitle-1 text-grey-darken-3 font-weight-bold">声音提醒</span>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">开启声音提醒</span>
        <v-switch
          v-model="switchValue[1]"
          class="flex-grow-0"
          hide-details
          density="comfortable"
          color="deep-purple"
          @change="updateSetting('messageNotify', Number(switchValue[1]))"/>
      </div>
      <div class="pt-2 d-flex align-center">
        <span class="flex-grow-1 text-subtitle-2 text-grey-darken-3">消息提醒音量</span>
        <v-slider
          v-model="volume"
          prepend-icon="mdi-volume-high"
          color="deep-purple"
          hide-details
          thumb-label
          single-line
          :step="1"
          density="comfortable"
          @update:modelValue="updateSetting('volume', Number(volume))"/>
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
    const {userSetting} = storeToRefs(store)
    const switchValue = ref<Array<boolean>>([true, true])
    const volume = ref(100)

    watch(
        () => userSetting.value,
        nVal => {
            switchValue.value = [Boolean(nVal.notifyStatus), Boolean(nVal.messageNotify)]
            volume.value = nVal.volume ?? 100
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
  .setting-group {
    ::v-deep(.v-switch .v-label) {
      display: none;
    }
  }
</style>