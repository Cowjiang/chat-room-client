import {defineStore} from 'pinia'
import {formatTime} from "@/common/utils";

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        userInfo: '', //当前登录的用户信息
        backgroundColor: '#6d7888', //个性化背景颜色
        primaryColor: '#66c', //个性化主题颜色
        navItemList: [] as NavItemList[], //导航栏项目列表
        currentNavItemIndex: 0, //当前导航栏显示的项目的序号
        chatList: [] as ChatList[], //消息列表
    }),
    getters: {
        //获取用户信息
        getUserInfo: state => JSON.parse(state.userInfo),
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
        }
    }
})