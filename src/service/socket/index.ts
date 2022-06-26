import {useStore} from '@/store'
// @ts-ignore
import ClientSocketIO from 'socket.io-client'

//连接socket
export const connectSocket = () => {
    const store = useStore()
    store.$socket = ClientSocketIO("http://172.17.144.172:8888/", {
        transports: ['websocket']
    })
    store.$socket.on('connect', () => {
        console.log('socket-connect')
    })
    store.$socket.on('message',(data: any) =>{
        console.log(data)
    })
    store.$socket.on('success',(data: any) =>{
        console.log(data)
    })
}

//断开socket
export const disconnectSocket = () => {
    const store = useStore()
    if (store.$socket) {
        store.$socket.emit('leave')
        store.$socket = null
    }
}

/**
 * 发送socket数据
 * @param event socket的事件名称
 * @param data 数据
 */
export const sendSocketMessage = (event: String, data?: any) => new Promise((resolve, reject) => {
    const store = useStore()
    if (store.$socket) {
        store.$socket.emit(event, data ?? null)
        store.$socket.on(event, (res: any) => {
            res.success ? resolve(res) : reject(res)
        })
    }
})