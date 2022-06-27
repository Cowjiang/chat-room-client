import {defineStore} from 'pinia'
import {formatTime} from '@/common/utils'
import {NavItemList, ChatInfo, ChatMessageHistory, FriendInfo, UserSettings, ValidateInfo} from '@/store/types'

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        $socket: null as any, //Socket对象
        userInfo: '', //当前登录的用户信息
        backgroundColor: '#6d7888', //个性化背景颜色
        primaryColor: '#66c', //个性化主题颜色
        userSetting: {} as any, //当前用户的个性化设置
        navItemList: [] as NavItemList[], //导航栏项目列表
        currentNavItemIndex: 0, //当前导航栏显示的项目的序号
        chatList: [] as ChatInfo[], //消息列表
        chatMessageHistory: new Map() as Map<string, ChatMessageHistory>, //聊天消息记录缓存
        friendList: [] as FriendInfo[], //好友列表
        validateList: [] as ValidateInfo[], //验证消息列表
    }),
    getters: {
        //获取用户信息
        getUserInfo: state => (JSON.parse(state.userInfo)),
        //获取我的聊天列表
        getChatList: state => JSON.parse(JSON.stringify(state.chatList)).map((chat: ChatInfo) => {
            chat.time = formatTime(chat.time, false)
            return chat
        }),
        //获取用户设置
        getUserSetting: state => state.userSetting,
        //获取验证消息列表
        getValidateList: state => state.validateList.map((validate: ValidateInfo) => {
            validate.time = formatTime(validate.time, true)
            return validate
        }),
    },
    actions: {
        /**
         * 存储更新的userInfo
         * @param userInfo 更新的userInfo
         */
        updateUserInfo(userInfo: any) {
            this.userInfo = JSON.stringify(userInfo)
            sessionStorage.setItem('userInfo', this.userInfo)
        },
        /**
         * 存储更新的用户个性化设置
         * @param key 设置项键名
         * @param value 设置项的值
         */
        updateUserSetting(key: string, value: any) {
            this.userSetting[key] = value
        },
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
                lastMessage: chat.lastMessage ?? '[新会话]',
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
        },
        setFriendList(friendList: any[]) {

        },
        /**
         * 存储用户个性化设置
         * @param userSettings 用户个性化设置
         */
        setUserSettings(userSettings: UserSettings) {
            if (userSettings.primaryColor) this.primaryColor = userSettings.primaryColor
            if (userSettings.backgroundColor) this.backgroundColor = userSettings.backgroundColor
            this.userSetting = userSettings
        },
        /**
         * 存储用户验证消息列表
         * @param validateList 验证消息列表
         */
        setValidateList(validateList: any[]) {
            this.validateList = validateList
        }
    }
})