import http from '@/service/http'
import {CreateGroupParams, SearchGroupParams} from './types'

//搜索群聊
export const searchGroupApi = (params: SearchGroupParams) => http.post('/group/preFetchGroup', params)

//创建群聊
export const createGroupApi = (params: CreateGroupParams) => http.post('/group/createGroup', params)