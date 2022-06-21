import http from '@/service/http'
import {LoginParams, RegisterParams} from './types'

//登录
export const loginApi = (params: LoginParams) => http.post('/user/login', params)

//注册
export const registerApi = (params: RegisterParams) => http.post('/user/register', params)

//
// //获取群聊列表
// export const getMyGroupList = () => http.get(`/group/finAll`);
//
// //修改好友的备注名
// export const updateFriendNickname = (userId, friendId, friendBeiZhuName) => http.post('/user/updateFriendBeiZhu', {
//     userId,
//     friendId,
//     friendBeiZhuName
// });
//
// //将好友添加到分组
// export const addFriendToCustomGroup = (userId, fenZuName) => http.post('/user/addFenZu', {
//     userId,
//     fenZuName
// });
//
// //阿里云上传文件（废弃）
// export const uploadFileApi = (file) => http.post('/system/upload', {file}, {headers: {'Content-Type': 'multipart/form-data'}});
//
// //搜索用户
// export const searchUser = (type, searchContent, pageIndex, pageSize) => http.post('/user/preFetchUser', {
//     type,
//     searchContent,
//     pageIndex,
//     pageSize
// });
//
// //获取好友聊天记录
// export const getSingleChatHistory = (roomId, pageIndex, pageSize) => http.get(`/singleMessage/getRecentSingleMessages?roomId=${roomId}&pageIndex=${pageIndex}&pageSize=${pageSize}`);