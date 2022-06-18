import {createApp} from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
// @ts-ignore
import VueSocketIO from "vue-socket.io/dist/vue-socketio"
// @ts-ignore
import ClientSocketIO from 'socket.io-client'
import router from './router/index'
import 'animate.css'

loadFonts()

createApp(App)
    .use(vuetify)
    .use(createPinia())
    .use(router)
    .use(new VueSocketIO({
        connection: ClientSocketIO.connect("http://172.17.144.172:8888/", {
            transports: ['websocket']
        }),
    }))
    .mount('#app')
