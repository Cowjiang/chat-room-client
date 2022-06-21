import http from '@/service/http'
import {GetSingleChatHistoryParams} from "@/service/api/chats/types";

//获取我的消息列表
export const getChatListApi = () => http.get('/message/messageListItem')

//获取单聊消息历史记录
export const getSingleChatHistoryApi = (params: GetSingleChatHistoryParams) => http.get(`/singleMessage/getRecentSingleMessages?roomId=${params.roomId}&pageIndex=${params.pageNumber}&pageSize=${params.pageSize}`)