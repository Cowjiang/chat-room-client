import http from '@/service/http'
import {EditRemarkNameParams} from './types'

//获取我的好友列表
export const getFriendsListApi= () => http.get('/goodFriend/getMyFriendsList')

//修改好友备注
export const editRemarkNameApi= (params: EditRemarkNameParams) => http.post('/user/updateFriendBeiZhu', params)