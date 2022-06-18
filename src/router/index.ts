import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import login from '@/views/login/login.vue'
import index from '@/views/index/index.vue'
import {clearUserInfo} from "@/common/utils"

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: index,
    },
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    {
        path: '/index',
        name: 'index',
        component: index,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from) => {
    if (to.path === '/index' || to.path === '/' ) {
        if (!sessionStorage.getItem("token")) {
            clearUserInfo()
            return {name: 'login'}
        }
    }
})

export default router