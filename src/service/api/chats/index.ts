import http from '@/service/http'

//获取我的消息列表
export const getChatListApi: Function = () => http.get('/message/messageListItem')