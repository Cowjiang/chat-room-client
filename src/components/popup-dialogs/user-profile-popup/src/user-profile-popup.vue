<template>
  <v-dialog
    v-model="showDialog"
    @click:outside="handleCloseDialog">
    <div class="user-profile-container pa-6 d-flex flex-column rounded-lg bg-white">
      <div class="user-info d-flex align-center flex-shrink-0 mb-5">
        <v-avatar
          class="flex-shrink-0 mr-3"
          color="grey-lighten-3"
          size="72">
          <v-img
            :src="userProfile.photo"
            :alt="userProfile.nickname"/>
        </v-avatar>
        <div class="d-flex flex-column flex-grow-1 justify-center">
          <span
            class="text-subtitle-1 font-weight-bold text-grey-darken-3">
            {{ userProfile.nickname }}
            <i
              v-if="userProfile.sex !== 3"
              class="fa-solid ml-1"
              :class="userProfile.sex === 2 ? 'fa-venus text-red-lighten-1' : 'fa-mars text-blue-darken-2'"/>
          </span>
          <span class="text-caption text-grey-lighten-1">
            备注：{{ '无备注' }}
          </span>
        </div>
        <v-btn
          class="bg-grey-lighten-4 text-grey-darken-2"
          size="x-small"
          variant="tonal"
          :icon="true"
          :disabled="!userProfile.nickname">
          <i class="fa-solid fa-ellipsis"></i>
          <v-menu activator="parent" location="bottom">
            <v-list
              class="text-subtitle-2"
              elevation="3"
              rounded="default"
              density="compact"
              min-width="150">
              <v-list-item v-if="userProfile.myFriend" value="0">
                修改备注
              </v-list-item>
              <v-list-item v-if="userProfile.myFriend" class="text-red" value="1">
                删除好友
              </v-list-item>
              <v-list-item class="text-red" value="2">
                屏蔽该用户
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
      <div class="mb-2">
        <span class="text-subtitle-2 text-grey-darken-3">个人简介</span>
      </div>
      <div class="profile-text-view w-100 pa-4 mb-6 bg-grey-lighten-4 rounded-lg">
        <span class="text-subtitle-2 text-grey-darken-2">暂无简介</span>
      </div>
      <div class="w-100 d-flex">
        <v-btn
          v-if="isFriend"
          class="bg-grey-lighten-4 text-grey-darken-2"
          width="84"
          :flat="true"
          :disabled="!userProfile.nickname">
          私信
        </v-btn>
        <v-btn
          v-else
          color="success"
          width="84"
          :flat="true"
          :disabled="!userProfile.nickname"
          @click="handleAddFriend(userProfile)">
          加好友
        </v-btn>
        <v-btn
          :flat="true"
          class="ml-auto text-white"
          width="84"
          :color="primaryColor"
          @click="handleCloseDialog">
          关闭
        </v-btn>
      </div>
    </div>
    <validate-message-popup
      v-model="validateMessagePopupProps.value"
      :type="validateMessagePopupProps.type"
      :receiverId="validateMessagePopupProps.receiverId"
      :groupId="validateMessagePopupProps.groupId"/>
  </v-dialog>
</template>

<script lang="ts" setup>
    import {defineProps, withDefaults, defineEmits, ref, watch, onMounted, computed} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {getUserProfileApi} from '@/service/api/user'
    import {AxiosResponse} from 'axios'
    import ValidateMessagePopup from '@/components/popup-dialogs/validate-message-popup'
    import {ValidateMessagePopupProps} from '@/components/popup-dialogs/validate-message-popup/src/validate-message-popup.vue'

    export interface UserProfilePopupProps {
        value: boolean //控制弹窗显示隐藏
        uid: string //用户id
    }

    const props = withDefaults(defineProps<UserProfilePopupProps>(), {
        value: false,
        uid: ''
    })

    const emit = defineEmits<{
        // eslint-disable-next-line no-unused-vars
        (e: 'update:modelValue', show: boolean): void
    }>()

    const showDialog = ref(props.value) //是否显示弹窗
    const store = useStore()
    const {primaryColor, getUserInfo} = storeToRefs(store)
    const userProfile = ref<any>({}) //用户个人资料
    const validateMessagePopupProps = ref<ValidateMessagePopupProps>({
        value: false,
        type: 0,
        receiverId: '',
        groupId: ''
    }) //验证消息弹窗组件的属性

    // 是否为我的好友
    const isFriend = computed((): boolean => {
        if (userProfile.value.friendFenZu) {
            return userProfile.value.friendFenZu.bestFriend.includes(getUserInfo.value.uid)
        }
        else return false
    })

    // 获取用户个人资料
    const getUserProfile = async () => {
        const res: AxiosResponse = await getUserProfileApi({
            uid: props.uid
        })
        userProfile.value = res.data.user ? res.data.user : {}
    }

    /**
     * 添加好友事件
     * @param userInfo 用户信息
     */
    const handleAddFriend = (userInfo: any) => {
        validateMessagePopupProps.value.type = 0
        validateMessagePopupProps.value.receiverId = userInfo.uid
        validateMessagePopupProps.value.groupId = null
        validateMessagePopupProps.value.value = true
    }

    // 关闭弹窗事件
    const handleCloseDialog = () => {
        showDialog.value = false
        emit('update:modelValue', false)
    }

    onMounted(() => {
        watch(
            () => props.uid,
            (nVal) => {
                if (nVal) {
                    userProfile.value = {}
                    getUserProfile()
                }
            },
            {
                immediate: true
            }
        )
    })
</script>

<style lang="scss" scoped>
  .user-profile-container {
    min-width: 650px;

    .profile-text-view {
      height: 200px;
    }
  }
</style>