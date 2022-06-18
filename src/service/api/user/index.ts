// import http from '@/service/http'
// import {LoginParams} from './types'
//
// //登录
// export const loginApi: Function = (params: LoginParams) => http.post('/user/login', params);
//
// //注册
// export const register = (mobile, password, code) => http.post('/user/register', {
//     mobile,
//     password,
//     code
// });
//
// //获取好友列表
// export const getMyFriendList = () => http.get(`/goodFriend/getMyFriendsList`);
//
// //获取群聊列表
// export const getMyGroupList = () => http.get(`/group/finAll`);
//
// //获取消息列表
// export const getMyChatList = () => http.get('/message/messageListItem');
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