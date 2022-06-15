import {useStore} from "@/store";

export const clearUserInfo = () => {
    const store = useStore()
    store.$reset()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userInfo')
}