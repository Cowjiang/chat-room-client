import {useStore} from "@/store"
import {disconnectSocket} from '@/service/socket'

// 清除用户信息
export const clearUserInfo = (): void => {
    const store = useStore()
    store.$reset()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userInfo')
    disconnectSocket()
}

/**
 * 格式化时间
 * @param time 时间字符串
 * @param detail 是否返回更详细的结果，默认为true
 * @returns {string} 格式化后的时间
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

// @ts-ignore
export const computeDatetime = (oldTime: string, newTime: string): boolean => (new Date(newTime) - new Date(oldTime)) / 1000 / 60 >= 5 //返回两个时间差是否大于5分钟

/**
 * 对象数组去重
 * @param arr 要去重的目标数组
 * @returns {Array<any>} 去重后的数组
 */
export const removeDuplicateObj = (arr: Array<any>): Array<any> => {
    const obj: any = {}
    arr = arr.reduce((newArr, next) => {
        !obj[next.id] ? (obj[next.id] = newArr.push(next)) : ''
        return newArr
    }, [])
    return arr
}

//工具类
export class Utils {
    throttleBackTime = 0;
    throttleGapTime = 0;
    throttleEnterTime = 0;
    debounceTimer = null;
    debounceGapTime = 0;

    /**
     * 节流函数
     * @param fn 要执行的方法
     * @param interval 等待时间，默认500ms
     */
    throttle(fn: Function, interval: number) {
        this.throttleGapTime = interval || 500;
        (() => {
            // @ts-ignore
            this.throttleBackTime = new Date();
            if (this.throttleBackTime - this.throttleEnterTime > this.throttleGapTime) {
                // eslint-disable-next-line prefer-rest-params
                fn.call(this, arguments);
                this.throttleEnterTime = this.throttleBackTime;
            }
        })();
    }

    // 重置节流函数
    resetThrottle() {
        this.throttleBackTime = 0;
        this.throttleGapTime = 0;
        this.throttleEnterTime = 0;
    }

    /**
     * 防抖函数
     * @param fn 要执行的方法
     * @param interval 等待时间，默认500ms
     */
    debounce(fn: Function, interval: number) {
        this.debounceGapTime = interval || 500;
        (() => {
            // @ts-ignore
            clearTimeout(this.debounceTimer);
            // eslint-disable-next-line prefer-rest-params
            const args = arguments;
            // @ts-ignore
            this.debounceTimer = setTimeout(() => {
                fn.call(this, args);
            }, this.debounceGapTime);
        })();
    }
}