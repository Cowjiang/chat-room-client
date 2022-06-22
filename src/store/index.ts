import {defineStore} from 'pinia'
import {formatTime} from "@/common/utils";
import {NavItemList, ChatInfo, ChatMessageHistory} from "@/store/types";

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        userInfo: '', //当前登录的用户信息
        backgroundColor: '#6d7888', //个性化背景颜色
        primaryColor: '#66c', //个性化主题颜色
        navItemList: [] as NavItemList[], //导航栏项目列表
        currentNavItemIndex: 0, //当前导航栏显示的项目的序号
        chatList: [] as ChatInfo[], //消息列表
        chatMessageHistory: new Map() as Map<string, ChatMessageHistory>, //聊天消息记录缓存
    }),
    getters: {
        //获取用户信息
        getUserInfo: state => (JSON.parse(state.userInfo)),
        //获取我的聊天列表
        getChatList: state => state.chatList.map(chat => {
            chat.time = formatTime(chat.time, false)
            return chat
        }),
    },
    actions: {
        /**
         * 存储聊天列表
         * @param chatList 更新的聊天列表
         */
        setChatList(chatList: any[]) {
            this.chatList = chatList.map(chat => ({
                id: chat.id,
                nickname: chat.nickname,
                avatarUrl: chat.photo ?? chat.avatarUrl,
                remarkName: chat.friendBeiZu ?? chat.remarkName ?? null,
                lastMessage: chat.lastMessage,
                time: chat.time
            }))
        },
        //根据roomId获取聊天消息记录
        getChatMessageHistory(roomId: string): ChatMessageHistory | null {
            const messageHistory = this.chatMessageHistory.get(roomId)
            return messageHistory ?? null
        },
        /**
         * 存储聊天消息历史记录
         * @param roomId 聊天室id
         * @param messageHistory 消息历史记录
         * @param pageNumber 分页页码
         */
        setChatMessageHistory(roomId: string, messageHistory: Array<any>, pageNumber: number) {
            const chatMessageHistory: ChatMessageHistory = {
                updateTime: new Date(),
                messageList: messageHistory,
                pageNumber: pageNumber
            }
            this.chatMessageHistory.set(roomId, chatMessageHistory)
        }
    }
})