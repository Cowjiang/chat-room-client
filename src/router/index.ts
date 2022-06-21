import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import login from '@/views/login/login.vue'
import index from '@/views/index/index.vue'
import {clearUserInfo} from "@/common/utils"

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/index/home'
    },
    {
        path: '/index',
        redirect: '/index/home'
    },
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    {
        path: '/index/:navItem',
        name: 'index',
        component: index,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from) => {
    if (to.path !== '/login') {
        if (!sessionStorage.getItem("token")) {
            clearUserInfo()
            return {name: 'login'}
        }
    }
})

export default router