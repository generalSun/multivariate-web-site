import '@/assets/styles/main.css'
import '@/assets/styles/index.scss'
import '@/assets/iconfont/iconfont.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerDirectives } from '@/directives'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/i18n'

const app = createApp(App)
registerDirectives(app)
app.use(createPinia())
app.use(router)
app.use(i18n)
window.$router = router
window.$app = app
app.mount('#app')
