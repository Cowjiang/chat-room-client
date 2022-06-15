import {defineStore} from 'pinia'

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        userInfo: '', //当前登录的用户信息
        primaryColor: '', //个性化颜色
    }),
    getters: {
        getUserInfo: state => JSON.parse(state.userInfo),
    },
    actions: {}
})