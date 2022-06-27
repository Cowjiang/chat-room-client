import http from '@/service/http'

// 获取我的验证消息列表
export const getValidateListApi = () => http.get('/validate/getMyValidateMessageList')