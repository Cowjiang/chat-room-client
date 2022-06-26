import {createApp} from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import router from './router/index'
import 'animate.css'

loadFonts()

createApp(App)
    .use(vuetify)
    .use(createPinia())
    .use(router)
    .mount('#app')