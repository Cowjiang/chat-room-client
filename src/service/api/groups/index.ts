import http from '@/service/http'
import {CreateGroupParams, GetGroupListByUserNameParams, SearchGroupParams} from './types'

//搜索群聊
export const searchGroupApi = (params: SearchGroupParams) => http.post('/group/preFetchGroup', params)

//创建群聊
export const createGroupApi = (params: CreateGroupParams) => http.post('/group/createGroup', params)

//根据用户名获取群聊列表
export const getGroupListByUserNameApi = (params: GetGroupListByUserNameParams) => http.get(`/group/getMyGroupList?username=${params.username}`)