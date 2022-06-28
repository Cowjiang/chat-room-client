<template>
  <div class="chat-frame-container w-100 h-100 d-flex flex-column">
    <div class="chat-title-container w-100 px-4 d-flex flex-shrink-0 align-center">
      <div class="flex-shrink-0 mr-2 text-h6 text-grey-lighten-1">
        <i class="fa-solid fa-at"></i>
      </div>
      <div class="flex-grow-1 text-grey-darken-4 text-no-wrap">
        <span>{{ props.chatInfo.nickname }}</span>
        <span
          v-if="props.chatInfo.remarkName"
          class="text-grey-darken-1">
          （{{ props.chatInfo.remarkName }}）
        </span>
      </div>
      <div class="ml-auto d-flex align-center flex-shrink-0">
        <v-btn
          class="bg-grey-lighten-3 text-grey-darken-2"
          variant="tonal"
          size="x-small"
          :icon="true">
          <i class="fa-solid fa-search"></i>
        </v-btn>
        <v-btn
          class="ml-3 bg-grey-lighten-3 text-grey-darken-2"
          variant="tonal"
          size="x-small"
          :icon="true">
          <i class="fa-solid fa-ellipsis"></i>
          <v-menu activator="parent" location="start">
            <v-list
              class="text-subtitle-2"
              elevation="3"
              rounded="lg"
              density="compact"
              min-width="150"
              @update:selected="handleChatMenuClick">
              <v-list-item :value="0">
                置顶聊天
              </v-list-item>
              <v-list-item :value="1">
                聊天信息
              </v-list-item>
              <v-list-item class="text-red" :value="2">
                屏蔽该用户
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </div>
    <div ref="chatMessageArea" class="chat-content-container w-100 h-100 flex-grow-1">
      <loading v-model="loadingStatus" position="relative" leaveDuration="0.1s"/>
      <div class="message-list-container w-100 h-0 position-relative">
        <div class="chat-header d-flex flex-column pa-6">
          <div class="w-100">
            <v-avatar
              class="flex-shrink-0"
              :color="primaryColor"
              size="80">
              <v-img
                :src="props.chatInfo.avatarUrl"
                :alt="props.chatInfo.nickname"/>
            </v-avatar>
          </div>
          <span class="mt-4 text-h4 text-grey-darken-4 text-no-wrap">
            {{ props.chatInfo.nickname }}
          </span>
          <span class="my-2 text-grey-darken-2 text-body-1">
            这里是你与 @{{ props.chatInfo.nickname }} 私信记录的开头。
          </span>
          <v-divider class="mt-3 mb-6"/>
        </div>
        <div class="chat-content pb-4">
          <div
            class="message-container w-100 mb-6"
            v-for="(message, index) in chatMessageHistory"
            :key="message.id"
            :id="`message${message.id}`">
            <!-- 消息发送时间容器 -->
            <div
              class="datetime-container w-100"
              v-if="computeDatetime(chatMessageHistory[index - 1] === undefined ? 0 : chatMessageHistory[index - 1].time, message.time)">
              {{ formatTime(message.time) }}
            </div>
            <!-- 用户头像容器 -->
            <div
              class="avatar-container"
              :class="message.senderId !== getUserInfo.uid ? 'avatar-container-left' : 'avatar-container-right'">
              <v-avatar v-if="message.senderId !== getUserInfo.uid ">
                <v-img :src="`${message.senderAvatar}`"></v-img>
              </v-avatar>
              <v-avatar v-if="message.senderId === getUserInfo.uid">
                <v-img :src="`${message.senderAvatar}`"></v-img>
              </v-avatar>
            </div>
            <!-- 消息内容 -->
            <div
              v-ripple
              class="message-content"
              :data-name="`message${index}`"
              :class="message.senderId !== getUserInfo.uid ? 'message-content-left' : 'message-content-right'">
              <div v-if="message.messageType === 'text'">
                {{ message.message }}
              </div>
              <v-img
                width="10vw"
                contain
                v-if="message.messageType !== 'text'"
                :src="message.message"
                :data-name="`message${index}`"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input-container w-100 mt-auto flex-shrink-0 px-6 pt-3 pb-6">
      <div class="input-container w-100 h-100 px-4 d-flex align-center bg-grey-lighten-3 rounded-lg">
        <div class="prepend-btn-container flex-shrink-0 text-h6 text-grey-darken-2">
          <i class="fa-regular fa-face-grin-beam"></i>
        </div>
        <div class="input w-100 py-2 mr-4">
          <v-textarea
            v-model="inputValue"
            :auto-grow="true"
            :autofocus="true"
            hide-details
            rows="1"
            max-rows="5"
            bg-color="transparent"
            variant="solo"
            single-line
            color="primary"
            :placeholder="placeholder"
            :disabled="loadingStatus"
            @keydown.enter="handleSendMessage"/>
        </div>
        <div class="append-btn-container ml-auto flex-shrink-0 text-h6 text-grey-darken-2">
          <input
            class="position-relative"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            @change="handleFileSelected($event.target.files)">
          <i class="fa-regular fa-image"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {nextTick, ref, watch, defineProps, withDefaults, onMounted, defineEmits} from 'vue'
    import {useStore} from '@/store'
    import {storeToRefs} from 'pinia'
    import axios, {AxiosError, AxiosResponse} from 'axios'
    import Loading from '@/components/loading'
    import {formatTime, computeDatetime, removeDuplicateObj} from '@/common/utils'
    import {getSingleChatHistoryApi} from '@/service/api/chats'
    import {ChatInfo} from '@/store/types'
    import {sendSocketMessage} from '@/service/socket'
    import {updateUserSettingsApi} from '@/service/api/user'

    const emit = defineEmits(['send']) //消息发送事件

    const store = useStore()
    const {getUserInfo, primaryColor, getUserSetting} = storeToRefs(store)

    interface Props {
        chatInfo: ChatInfo
    }

    type FileType = 'image' | 'file' //文件上传类型

    const props = withDefaults(defineProps<Props>(), {})
    const chatMessageArea = ref<HTMLElement | null>(null)
    const loadingStatus = ref(true) //数据加载状态
    const inputValue = ref('') //输入框的值
    const placeholder = ref('') //输入框的占位文字
    const chatMessageHistory = ref<Array<any>>([]) //聊天消息记录列表
    const pageNumber = ref(1) //消息历史记录分页页码

    /**
     * 获取单聊消息历史记录
     * @param pageNumber 分页页码
     */
    const getSingleChatHistory = (pageNumber: number) => new Promise((resolve, reject) => {
        getSingleChatHistoryApi({
            roomId: props.chatInfo.id,
            pageSize: 30,
            pageNumber: pageNumber ?? 1
        }).then((res: AxiosResponse) => {
            res.data.recentMessage = [
                {
                    "id": "61c05939eb14ae4845723000",
                    "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                    "senderId": "61be0e3ae7fd6865cbcd74c7",
                    "senderName": "123456",
                    "senderNickname": "保利尼奥3151",
                    "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                    "time": "2021-12-20T10:21:45.430+00:00",
                    "fileRawName": null,
                    "message": "323112",
                    "messageType": "text",
                    "isReadUser":
                        [
                            "61be0e3ae7fd6865cbcd74c7",
                            "61be0e6ce7fd6865cbcd74ca"
                        ]
                },
                {
                    "id": "61c05939eb14ae4845723001",
                    "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                    "senderId": "61be0e3ae7fd6865cbcd74c7",
                    "senderName": "123456",
                    "senderNickname": "保利尼奥3151",
                    "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                    "time": "2021-12-20T10:21:45.430+00:00",
                    "fileRawName": null,
                    "message": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                    "messageType": "image",
                    "isReadUser":
                        [
                            "61be0e3ae7fd6865cbcd74c7",
                            "61be0e6ce7fd6865cbcd74ca"
                        ]
                },
                {
                    "id": "61c05939eb14ae4845723002",
                    "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                    "senderId": "62a78c90ac624970c9a7c229",
                    "senderName": "13711401096",
                    "senderNickname": "曼珠机奇3217",
                    "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                    "time": "2022-02-20T10:21:45.430+00:00",
                    "fileRawName": null,
                    "message": "曼珠机奇曼珠机奇曼珠机奇曼珠机奇曼珠机奇曼珠机奇曼珠机奇",
                    "messageType": "text",
                    "isReadUser":
                        [
                            "61be0e3ae7fd6865cbcd74c7",
                            "61be0e6ce7fd6865cbcd74ca"
                        ]
                }
            ]
            const msgList = res.data.recentMessage ?? []
            const msgHistory = JSON.parse(JSON.stringify(chatMessageHistory.value))
            chatMessageHistory.value = removeDuplicateObj([...msgList, ...msgHistory])
            resolve(res);
        }).catch((err: AxiosError) => {
            reject(err);
        })
    })

    // 消息发送事件
    const handleSendMessage = (e: KeyboardEvent) => {
        e.preventDefault()
        if (inputValue.value !== '') {
            const message = {
                roomId: props.chatInfo.id,
                message: inputValue.value,
                senderId: getUserInfo.value.uid,
                senderName: getUserInfo.value.username,
                senderNickname: getUserInfo.value.nickname,
                createdTime: new Date(),
                messageType: 'text',
                senderAvatar: getUserInfo.value.photo,
                isReadUser: [getUserInfo.value.uid],
                conversationType: 'FRIEND'
            }
            sendSocketMessage('sendNewMessage', message)
            chatMessageHistory.value.push(message)
            inputValue.value = ''
            emit('send', message)
            nextTick(() => {
                if (chatMessageArea.value) {
                    chatMessageArea.value.scrollTop = 9999909
                }
            })
        }
    }

    // 文件选择事件
    const handleFileSelected = (files: Array<File>) => {
        const file = files[0];
        let fileForm = new window.FormData();
        fileForm.append('file', file);
        fileForm.append('model', 'chat');
        uploadFile(fileForm, 'image');
    }

    /**
     * 文件上传事件
     * @param file 文件表单
     * @param type 文件类型
     */
    const uploadFile = (file: FormData, type: FileType) => {
        const token: string = sessionStorage.getItem("token") ?? ''
        axios.post('/api/system/upload', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            }
        }).then(res => {
            const fileUrl = res.data.data.file.filePath
            if (type === 'image') {
                const message = {
                    roomId: props.chatInfo.id,
                    message: fileUrl,
                    senderId: getUserInfo.value.uid,
                    senderName: getUserInfo.value.username,
                    senderNickname: getUserInfo.value.nickname,
                    createdTime: new Date(),
                    messageType: "image",
                    senderAvatar: getUserInfo.value.photo,
                    isReadUser: [getUserInfo.value.uid],
                    conversationType: "FRIEND"
                }
                sendSocketMessage('sendNewMessage', message)
                chatMessageHistory.value.push(message)
                emit('send', message)
                setTimeout(() => {
                    if (chatMessageArea.value) {
                        chatMessageArea.value.scrollTop = 9999909
                    }
                }, 500)
            }
        }).catch(error => {
            console.error(error);
        })
    }

    /**
     * 验证消息更多操作菜单点击事件
     * @param e 当前点击的菜单项序号数组
     */
    const handleChatMenuClick = (e: Array<number>) => {
        if (e[0] === 0) {
            const topChatList = JSON.parse(getUserSetting.value.chatTop ?? '[]')
            const newTopChatList = removeDuplicateObj([[{
                id: props.chatInfo.id,
                title: props.chatInfo.nickname,
                photo: props.chatInfo.avatarUrl,
                chatType: 0
            }], ...topChatList])
            updateUserSettingsApi({
                chatTop: JSON.stringify(newTopChatList)
            }).then(() => {
                store.updateUserSetting('chatTop', newTopChatList)
            }).catch(err => {
                console.error(err)
            })
        }
    }

    // 重置聊天组件数据
    const reset = () => {
        if (chatMessageArea.value) {
            chatMessageArea.value.scrollTop = 0
        }
        loadingStatus.value = true
        pageNumber.value = 1
        chatMessageHistory.value = []
    }

    onMounted(() => {
        watch(
            () => props.chatInfo,
            () => {
                reset()
                placeholder.value = `给 @${props.chatInfo.nickname} 发消息`
                const messageHistory = store.getChatMessageHistory(props.chatInfo.id)
                if (messageHistory) {
                    //如果store中存在缓存
                    chatMessageHistory.value = messageHistory.messageList
                    pageNumber.value = messageHistory.pageNumber
                }
                chatMessageHistory.value = [...chatMessageHistory.value, ...[
                    {
                        "id": "61c05939eb14ae4845723000",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723003",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723004",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723005",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723006",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723007",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723008",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723009",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723010",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723011",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                    {
                        "id": "61c05939eb14ae4845723012",
                        "roomId": "61be0e6ce7fd6865cbcd74ca-61be0e3ae7fd6865cbcd74c7",
                        "senderId": "61be0e3ae7fd6865cbcd74c7",
                        "senderName": "123456",
                        "senderNickname": "保利尼奥3151",
                        "senderAvatar": "https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg",
                        "time": "2021-12-20T10:21:45.430+00:00",
                        "fileRawName": null,
                        "message": "323112",
                        "messageType": "text",
                        "isReadUser":
                            [
                                "61be0e3ae7fd6865cbcd74c7",
                                "61be0e6ce7fd6865cbcd74ca"
                            ]
                    },
                ]]
                Promise.all([getSingleChatHistory(1)]).then(() => {
                    loadingStatus.value = false
                    if (chatMessageArea.value) {
                        setTimeout(() => {
                            if (chatMessageArea.value) {
                                chatMessageArea.value.scrollTop = 9999909
                            }
                        }, 300)
                    }
                })
            },
            {
                immediate: true
            }
        )
    })
</script>

<style lang="scss" scoped>
  $primary-color: v-bind(primaryColor); //个性化主题颜色
  $title-container-height: 60px;

  .chat-frame-container {
    @include scrollbar-default();

    .chat-title-container {
      height: $title-container-height;
      border-bottom: 1px solid #eeeeee;
    }

    .chat-content-container {
      overflow-y: scroll;

      .message-list-container {
        //top: -100%;

        .message-container {
          .datetime-container {
            margin: 30px 0 15px;
            font-size: 12px;
            text-align: center;
            color: #888;
          }

          .datetime-container:nth-child(1) {
            margin-top: 0;
          }

          .avatar-container {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;

            image {
              width: 100%;
            }
          }

          .message-content {
            width: fit-content;
            max-width: calc(100% - 140px);
            height: fit-content;
            min-height: 30px;
            padding: 10px;
            font-size: 15px;
            word-break: break-all;

            view {
              pointer-events: none;
            }

            image {
              max-width: 35vw;
            }
          }

          .avatar-container-left {
            float: left;
            margin-left: 20px;
          }

          .message-content-left {
            margin-left: 70px;
            border-radius: 0 10px 10px 20px;
            background-color: #f1f1f1;
          }

          .avatar-container-right {
            float: right;
            margin-right: 30px;
          }

          .message-content-right {
            margin-left: auto;
            margin-right: 80px;
            border-radius: 10px 0 20px 10px;
            background-color: $primary-color;
            color: #fff;
          }
        }
      }
    }

    .chat-input-container {
      min-height: 84px;

      .input-container {
        .prepend-btn-container, .append-btn-container {
          input {
            width: 30px;
            left: 50%;
            opacity: 0;
            cursor: pointer;
          }

          i {
            cursor: pointer;
          }
        }

        .input {
          ::v-deep(.v-field__field) {
            padding-top: 0;
            margin-top: 4px;
            word-break: break-all;

            .v-field__input {
              overflow-y: scroll;
            }
          }
        }
      }
    }
  }
</style>