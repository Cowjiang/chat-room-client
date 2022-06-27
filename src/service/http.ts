import axios, {AxiosInstance} from 'axios'
import qs from 'qs'
import {useStore} from "@/store"

// 生成Axios的伪实例
const instance: AxiosInstance = axios.create({
    baseURL: '/api'
})

// 添加请求拦截器
instance.interceptors.request.use((config: any) => {
    const token: string | null = sessionStorage.getItem("token")
    if (token) {
        config.headers = {
            'Authorization': token
        }
    }
    switch (config.headers['Content-Type']) {
        case 'application/x-www-form-urlencoded':
            config.data = qs.stringify(config.data)
            break
        default:
            break
    }
    return config
})


// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        if (response.data.data.token) {
            const store = useStore()
            sessionStorage.setItem('token', response.data.data.token)
            sessionStorage.setItem('userInfo', JSON.stringify(response.data.data.userInfo))
            store.userInfo = JSON.stringify(response.data.data.userInfo)
        }
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance