<template>
  <v-dialog
    v-model="showDialog"
    @click:outside="handleCloseDialog">
    <v-card width="500" rounded="lg">
      <v-card-header>
        <v-card-header-text>
          <v-card-title
            class="text-subtitle-1 font-weight-bold text-grey-darken-3">
            {{ !type ? '添加好友' : '申请加入群聊' }}
          </v-card-title>
          <v-card-subtitle>
            {{ !type ? '发送好友请求' : '发送加入群聊申请' }}
          </v-card-subtitle>
        </v-card-header-text>
      </v-card-header>
      <v-card-text>
        <v-text-field
          class="mb-4 bg-grey-lighten-3 rounded-lg"
          v-model="messageValue"
          placeholder="请输入验证消息"
          variant="solo"
          :flat="true"
          single-line
          density="compact"
          hide-details/>
      </v-card-text>
      <div class="d-flex pa-6">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-lighten-1"
          variant="text"
          height="36"
          @click="handleCloseDialog">
          {{ sendRequestStatus === 1 || sendRequestStatus === 2 ? '关闭' : '取消' }}
        </v-btn>
        <v-btn
          v-if="sendRequestStatus === -1 || sendRequestStatus === 0"
          class="ml-4 text-white"
          :color="primaryColor"
          :flat="true"
          width="125"
          height="36"
          :loading="sendRequestStatus === 0"
          @click="sendRequestMessage">
          {{ !type ? '发送好友请求' : '发送申请' }}
        </v-btn>
        <v-btn
          v-else
          class="ml-4 text-white"
          :color="sendRequestStatus === 1 ? 'success' : 'error'"
          :flat="true"
          width="125"
          height="36"
          v-ripple="false">
          {{ sendRequestStatus === 1 ? '发送成功' : '发送失败' }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
    import {defineProps, withDefaults, defineEmits, ref} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {sendSocketMessage} from "@/service/socket";

    export type validateType = 0 | 1 //验证消息类型，0:好友，1:群聊
    type sendRequestStatusType = -1 | 0 | 1 | 2 //发送验证消息状态，-1:初始状态，0:发送中，1:发送成功，2:发送失败

    export interface ValidateMessagePopupProps {
        value: boolean //控制弹窗显示隐藏
        type: validateType //验证消息类型
        receiverId: string //接受者uid
        groupId: string|null //群聊id
    }

    const props = withDefaults(defineProps<ValidateMessagePopupProps>(), {
        value: false
    })

    const emit = defineEmits<{
        // eslint-disable-next-line no-unused-vars
        (e: 'update:modelValue', show: boolean): void
    }>()

    const showDialog = ref(props.value) //是否显示弹窗
    const type = ref(props.type) //验证消息类型
    const groupId = ref(props.groupId) //群聊id
    const store = useStore()
    const {primaryColor, getUserInfo} = storeToRefs(store)
    const messageValue = ref('') //验证消息输入框的值
    const sendRequestStatus = ref<sendRequestStatusType>(-1) //发送验证消息状态

    // 发送好友/群聊申请请求
    const sendRequestMessage = () => {
        sendRequestStatus.value = 0
        if (!props.receiverId) {
            sendRequestStatus.value = 2
        }
        else {
            const validateMessage = {
                roomId: `${getUserInfo.value.uid}${props.receiverId}`,
                senderId: getUserInfo.value.uid,
                senderName: getUserInfo.value.username,
                senderNickname: getUserInfo.value.nickname,
                senderAvatar: getUserInfo.value.photo,
                receiverId: props.receiverId,
                time: new Date(),
                additionMessage: messageValue.value,
                status: 0,
                validateType: 0,
            }
            if (groupId.value) {
                Object.assign(validateMessage, {groupId: groupId.value})
            }
            sendSocketMessage('sendValidateMessage', validateMessage)
            setTimeout(() => {
                sendRequestStatus.value = 1
            }, 500)
        }
    }

    // 重置数据
    const reset = () => {
        messageValue.value = ''
        sendRequestStatus.value = -1
    }

    // 关闭弹窗事件
    const handleCloseDialog = () => {
        showDialog.value = false
        emit('update:modelValue', false)
        reset()
    }
</script>

<style lang="scss" scoped>

</style>