import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Login from '@/views/Login/Login.vue'
import {clearUserInfo} from "@/common/utils"

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Login,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach( (to, from) => {
    if (to.path === '/Main') {
        if (!sessionStorage.getItem("token")) {
            clearUserInfo()
            return {name: 'Login'}
        }
    }
})

export default router