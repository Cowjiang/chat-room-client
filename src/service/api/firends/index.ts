import http from '@/service/http'

//获取我的好友列表
export const getFriendsListApi= () => http.get('/goodFriend/getMyFriendsList')