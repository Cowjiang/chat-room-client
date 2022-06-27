<template>
  <v-list>
    <v-list-subheader inset>
      全部 {{ getValidateList.length || 0 }}
    </v-list-subheader>
    <v-list-item
      v-for="validate in getValidateList"
      :key="validate.id"
      :value="validate"
      rounded
      @click="handleValidateClick(validate)">
      <v-list-item-avatar
        color="grey-lighten-3"
        start
        size="64">
        <v-img
          :src="validate.senderAvatar"
          :alt="validate.senderNickname"/>
      </v-list-item-avatar>
      <v-list-item-header>
        <v-list-item-title>
          <span>{{ validate.senderNickname }}</span>
        </v-list-item-title>
        <v-list-item-subtitle class="mt-2">
          <span>
            {{ validate.additionMessage ? `附加信息：${validate.additionMessage}` : `我是${validate.senderNickname}` }}
          </span>
        </v-list-item-subtitle>
      </v-list-item-header>
      <span class="ml-auto text-subtitle-2 text-grey-darken-2">
        {{ !validate.validateType ? '好友申请' : '群聊申请' }}
      </span>
      <v-btn
        class="ml-4"
        variant="tonal"
        :class="validate.status === 0 ? 'bg-green' : 'bg-grey-lighten-3 text-grey-darken-2'"
        @click.stop="">
        <span class="text-white" v-if="validate.status === 0">待处理</span>
        <span v-else-if="validate.status === 1">已同意</span>
        <span v-else-if="validate.status === 2">已忽略</span>
        <v-menu v-if="validate.status === 0" activator="parent" location="start">
          <v-list
            class="text-subtitle-2"
            elevation="3"
            rounded="lg"
            density="compact"
            min-width="150"
            @update:selected="handleValidateMenuClick(validate, $event)">
            <v-list-item :value="0">
              个人资料
            </v-list-item>
            <v-list-item :value="1">
              同意好友申请
            </v-list-item>
            <v-list-item class="text-red" :value="2">
              忽略好友申请
            </v-list-item>
            <v-list-item class="text-red" :value="3">
              屏蔽该用户
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-list-item>
  </v-list>
  <div
    v-if="!getValidateList.length"
    class="w-100 h-75 d-flex flex-column align-center justify-center text-grey-lighten-1">
    <div class="text-h1 mb-6 font-weight-medium">
      ╮(╯_╰)╭
    </div>
    <div>
      这里没有更多数据噢
    </div>
  </div>
  <user-profile-popup
    v-model="userProfilePopupProps.value"
    :uid="userProfilePopupProps.uid"/>
</template>

<script lang="ts" setup>
    import {ref} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import {AxiosResponse} from 'axios'
    import UserProfilePopup from '@/components/popup-dialogs/user-profile-popup'
    import {ValidateInfo} from '@/store/types'
    import {sendSocketMessage} from '@/service/socket'
    import {getValidateListApi} from '@/service/api/validate'

    //用户个人资料弹窗组件的属性
    interface UserProfilePopupProps {
        value: boolean //控制弹窗显示隐藏
        uid: string //用户id
    }

    const store = useStore()
    const {getValidateList} = storeToRefs(store)
    const userProfilePopupProps = ref<UserProfilePopupProps>({
        value: false,
        uid: ''
    })

    /**
     * 验证消息点击事件
     * @param validate 验证信息
     */
    const handleValidateClick = (validate: ValidateInfo) => {
        userProfilePopupProps.value.uid = validate.senderId
        userProfilePopupProps.value.value = true
    }

    /**
     * 验证消息更多操作菜单点击事件
     * @param validate 验证信息
     * @param e 当前点击的菜单项序号数组
     */
    const handleValidateMenuClick = (validate: ValidateInfo, e: Array<number>) => {
        if (e[0] === 0) {
            handleValidateClick(validate)
        } else if (e[0] === 1 || e[0] === 2) {
            const validateMessage = {
                roomId: validate.roomId,
                senderId: validate.senderId,
                senderName: validate.senderName,
                senderNickname: validate.senderNickname,
                senderAvatar: validate.senderAvatar,
                receiverId: validate.receiverId,
                time: new Date(),
                additionMessage: '',
                status: e[0] === 1 ? 1 : 2,
                validateType: validate.validateType,
            }
            sendSocketMessage('sendValidateMessage', validateMessage).then(() => {
                getValidateListApi().then((res: AxiosResponse) => {
                    if (res.data.validateMessageList) {
                        store.setValidateList(res.data.validateMessageList)
                    }
                }).catch(error => {
                    console.error(error)
                })
            }).catch(err => {
                console.error(err)
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>