type ChatType = 0 | 1

export interface NavItemList {
    name: string //导航项目的Url参数名
    title: string //导航项目的标题（用于tooltips）
    icon?: string //导航项目的图标css类名，该项可选
    imgUrl?: string //导航项目的图片背景，设置icon后该项不生效，该项可选
    chatType?: ChatType //若该项导航为置顶的会话，单聊：0，群聊：1，该项可选
}

export interface ChatInfo {
    id: string
    avatarUrl: string
    nickname: string
    remarkName: string | null
    lastMessage: string
    time: string
}

export interface ChatMessageHistory {
    // id: string, //聊天室roomId
    updateTime: Date //更新时间
    messageList: Array<any> //消息记录数组
    pageNumber: number
}

export interface FriendInfo {
    id: string
    roomId: string
    nickname: string
    photo: string
    signature: string
    level: number
    createDate: string
}

export interface UserSettings {
    backgroundColor?: string | null
    chatTop?: string | null
    id?: string | null
    messageNotify?: string | null
    notifyStatus?: string | null
    primaryColor?: string | null
    publicStatus?: string | null
    userId?: string | null
    volume?: string | null
}

export interface ValidateInfo {
    id: string
    roomId: string
    senderId: string
    senderName: string
    senderNickname: string
    senderAvatar: string
    receiverId: string
    time: string
    additionMessage: string | null
    status: number
    validateType: number
    groupInfo: null
}

export interface MyGroupInfo {
    id: string
    userId: string
    username: string
    manager: number
    holder: number
    card: string
    time: string
    groupInfo?: Array<any>
    groupId: string
    userInfo?: null
}