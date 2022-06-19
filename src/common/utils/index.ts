import {useStore} from "@/store"

// 清除用户信息
export const clearUserInfo = (): void => {
    const store = useStore()
    store.$reset()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userInfo')
}

/**
 * 格式化时间
 * @param time 时间字符串
 * @param detail 是否返回更详细的结果，默认为true
 * @returns 格式化后的时间
 */
export const formatTime = (time: string, detail: boolean = true): string => {
    if (!time) {
        return ''
    }
    const messageDate = new Date(time)
    const nowDate = new Date()
    const messageTime = {
        year: messageDate.getFullYear(),
        month: messageDate.getMonth() + 1,
        day: messageDate.getDate(),
        hour: messageDate.getHours().toString().padStart(2, '0'),
        min: messageDate.getMinutes().toString().padStart(2, '0'),
        second: messageDate.getSeconds()
    }
    const nowTime = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        day: nowDate.getDate()
    }
    if (messageTime.year === nowTime.year && messageTime.month === nowTime.month && messageTime.day === nowTime.day) {
        return detail ? `今天 ${messageTime.hour}:${messageTime.min}` : `${messageTime.hour}:${messageTime.min}`
    } else if (messageTime.year === nowTime.year && messageTime.month === nowTime.month && nowTime.day - messageTime.day === 1) {
        return detail ? `昨天 ${messageTime.hour}:${messageTime.min}` : `昨天`
    } else if (messageTime.year === nowTime.year) {
        return detail ? `${messageTime.month}月${messageTime.day}日 ${messageTime.hour}:${messageTime.min}` : `${messageTime.month}/${messageTime.day}`
    } else {
        return detail ? `${messageTime.year}年${messageTime.month}月${messageTime.day}日 ${messageTime.hour}:${messageTime.min}` : `${messageTime.year}/${messageTime.month}/${messageTime.day}`
    }
}