import {defineStore} from 'pinia'

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        userInfo: '', //当前登录的用户信息
        backgroundColor: '#6d7888', //个性化背景颜色
        primaryColor: '#66c', //个性化主题颜色
    }),
    getters: {
        getUserInfo: state => JSON.parse(state.userInfo),
    },
    actions: {}
})