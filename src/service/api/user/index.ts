import http from '@/service/http'
import {
    GetUserProfileParams,
    LoginParams,
    RegisterParams,
    SearchUserParams,
    UpdateUserProfileParams,
    UpdateUserSettingsParams
} from './types'

//登录
export const loginApi = (params: LoginParams) => http.post('/user/login', params)

//注册
export const registerApi = (params: RegisterParams) => http.post('/user/register', params)

//根据用户id获取个人资料
export const getUserProfileApi = (params: GetUserProfileParams) => http.get(`/user/getUserInfo/${params.uid}`)

//搜索用户
export const searchUserApi = (params: SearchUserParams) => http.post('/user/preFetchUser', params)

//获取用户个性化设置
export const getUserSettingsApi = () => http.get('/user/setting/')

//更新用户个性化设置
export const updateUserSettingsApi = (params: UpdateUserSettingsParams) => http.put('/user/setting/update', params)

//更新用户个人资料
export const updateUserProfileApi = (params: UpdateUserProfileParams) => http.post('/user/updateUserInfo', params)