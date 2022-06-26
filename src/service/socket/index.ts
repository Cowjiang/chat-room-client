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
}

//断开socket
export const disconnectSocket = () => {
    const store = useStore()
    store.$socket.emit('leave')
    store.$socket = null
}

/**
 * 发送socket数据
 * @param event socket的事件名称
 * @param data 数据
 */
export const sendSocketMessage = (event: String, data?: any) => {
    const store = useStore()
    store.$socket.emit(event, data ?? null, (res: any) => {
        console.log(res)
    })
}
