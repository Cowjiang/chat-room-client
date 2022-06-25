import http from '@/service/http'
import {SearchGroupParams} from './types'

//搜索群聊
export const searchGroupApi = (params: SearchGroupParams) => http.post('/group/preFetchGroup', params)